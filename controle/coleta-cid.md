# Coleta de diagnósticos (CID) e refração — EyecareBI

Somente leitura no EyecareBI. Pede ao portal (Supabase) a lista de pacientes pendentes, lê o histórico de cada um
e grava CIDs e o grau esférico mais negativo em `paciente_cid` (função `receber_cid`). A chave vem no prompt da rotina
(`CHAVE_CID`); no repositório fica só o hash dela.

Rodar na aba do EyecareBI (logada). Processa até `LIM` pacientes por rodada; o progresso fica em `window.__cid`.

```js
window.__cid={ok:0,erro:0,feito:false};(async()=>{
const CHAVE=CHAVE_CID, LIM=400;
const SB='https://avbmtrvxieetoptmzere.supabase.co/rest/v1/rpc/', HSB={apikey:'sb_publishable_Ohqe8a6rhGEwOImU302jjw_69V8kcJ7','Content-Type':'application/json'};
const tok=localStorage.access_token.replace(/^"|"$/g,''), API='https://eyecarebi.prod.eyecarehealth.com.br/api/';
const OA='b930bcfb-f011-4475-b589-f07a57ba805b', PSO='019fb804-5b1a-726d-a2f0-9490eafb06f1', OPUS='a2f34a89-2ea8-4b67-aebc-74f8aa6d5683';
const ids=u=>/opus/i.test(u||'')?[OPUS,OPUS]:/para[ií]so/i.test(u||'')?[OA,PSO]:[OA,OA];
const pend=await (await fetch(SB+'cid_pendentes',{method:'POST',headers:HSB,body:JSON.stringify({chave:CHAVE,lim:LIM})})).json();
window.__cid.total=pend.length; const lote=[];
const envia=async()=>{ if(!lote.length) return; const it=lote.splice(0); await fetch(SB+'receber_cid',{method:'POST',headers:HSB,body:JSON.stringify({chave:CHAVE,itens:it})}); };
const num=v=>{ const s=String(v||'').toUpperCase().replace(',','.').trim(); if(/^PL/.test(s)) return 0; const m=s.match(/^[+-]?\d+(\.\d+)?/); return m?Number(m[0]):null; };
const um=async p=>{ const [root,unit]=ids(p.unidade); let cids=new Set(), esf=null;
  try{ const r=await fetch(API+'attendances/patient/history',{method:'POST',headers:{Authorization:'Bearer '+tok,'X-Root-Clinic':root,'X-Unity':unit,Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({patient_id:p.paciente_id,clinic_id:unit,attendance_types:['ATTENDANCE','EXAM','SURGERY','PRE_CONSULTATION'],modules:[],date:null})});
    if(r.ok){ const h=await r.json(); (function w(o,k){ if(o&&typeof o==='object'){ for(const kk in o) w(o[kk],kk); } else if(k==='cid'&&o) cids.add(String(o).slice(0,120)); else if(/^olho(Direito|Esquerdo)Esferico(Din)?$/.test(k)){ const n=num(o); if(n!=null&&n>-30&&n<20) esf=esf==null?n:Math.min(esf,n); } })(h,''); window.__cid.ok++; }
    else window.__cid.erro++;
  }catch(e){ window.__cid.erro++; }
  lote.push({paciente_id:p.paciente_id,nome:p.nome,cids:[...cids],esf_min:esf,ultima:p.ultima}); if(lote.length>=50) await envia(); };
for(let i=0;i<pend.length;i+=4) await Promise.all(pend.slice(i,i+4).map(um));
await envia(); window.__cid.feito=true; })();
```

`window.__cid` → `{total, ok, erro, feito}`. Se `total` vier igual a `LIM`, ainda há pendentes para a próxima rodada.
