# Coleta da lente da catarata (rotina noturna)

Somente leitura nos prontuários. O portal (`window.receberLentes`) é quem interpreta e grava.

## EyecareBI (aba eyecarebi.eyecarehealth.com.br)

```js
window.__lentes=null;(async()=>{
const tok=localStorage.access_token.replace(/^"|"$/g,'');const API='https://eyecarebi.prod.eyecarehealth.com.br/api/';
const CL=['b930bcfb-f011-4475-b589-f07a57ba805b','a2f34a89-2ea8-4b67-aebc-74f8aa6d5683'];
const H=(root,unit)=>({Authorization:'Bearer '+tok,'X-Root-Clinic':root,'X-Unity':unit,Accept:'application/json','Content-Type':'application/json'});
const hoje=new Date(Date.now()-3*36e5);const iso=d=>d.toISOString().slice(0,10);
const dias=[];for(let i=-60;i<=60;i++){const d=new Date(hoje.getTime()+i*864e5);if(d.getUTCDay())dias.push(iso(d));}
const CIR=/FACECT|FACO|IMPLANTE DE LENTE|LENTE INTRA|\bLIO\b/i, BIO=/BIOMETRI/i;
const olhoTx=t=>{const m=String(t||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').match(/OLHO\s*:?\s*(DIREITO|ESQUERDO|AMBOS)/);return m?{DIREITO:'OD',ESQUERDO:'OE',AMBOS:'AO'}[m[1]]:null;};
const pats=new Map();
await Promise.all(CL.flatMap(c=>dias.map(async d=>{const r=await fetch(`${API}clinics/${c}/overview/my-day?scope=group&date=${d}`,{headers:H(c,c)});if(!r.ok)return;const j=await r.json();
 for(const e of j.encounters||[]){const it=(e.items||[]).map(i=>i.name).join(' + ');if(!e.patient||!(CIR.test(it)||BIO.test(it)))continue;
  const p=pats.get(e.patient.id)||{nome:e.patient.name,root:c,unit:e.clinic.id,cirurgias:[],trechos:[]};pats.set(e.patient.id,p);
  if(CIR.test(it)) p.cirurgias.push({data:(e.start_datetime||d).slice(0,10),olho:olhoTx(e.description),status:e.status});
  const lin=String(e.description||'').split(/\n/).filter(l=>/OLHO\s*:|LENTE\s*:/i.test(l)).join('\n');
  if(/LENTE\s*:/i.test(lin)) p.trechos.push({data:(e.start_datetime||d).slice(0,10),origem:'agendamento',texto:lin,olho:olhoTx(e.description)});}})));
const REL=/\bLIO\b|\bIOL\b|BIOMETRI|BIONETRI|LENTE|TORIC|FACO|EYHANCE|PANOPTIX|\bPAN\b|VIVITY|ODYSSEY|SYNERGY|CLAREON|TECNIS|ACRYSOF|SN60|MA60|MONOFOCAL|MULTIFOCAL|EDOF/i;
const folhas=v=>{const out=[];(function w(o){if(o==null)return;if(typeof o==='string'){out.push(o);return;}if(typeof o==='object')for(const k in o)w(o[k]);})(v);return out.join('\n').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,' ');};
const corte=iso(new Date(hoje.getTime()-365*864e5));
for(const [pid,p] of pats){
 const r=await fetch(API+'attendances/patient/history',{method:'POST',headers:H(p.root,p.unit),body:JSON.stringify({patient_id:pid,clinic_id:p.unit,attendance_types:['ATTENDANCE','PRE_CONSULTATION','EXAM','SURGERY','TEAM_EVOLUTION','ANESTHESIST_EVOLUTION'],modules:[],date:null})});
 if(!r.ok)continue;const h=await r.json();
 for(const [data,arr] of Object.entries(h)){if(data<corte)continue;for(const a of arr||[]){
  const desc=a.appointment&&a.appointment.description||'';const lin=desc.split(/\n/).filter(l=>/OLHO\s*:|LENTE\s*:/i.test(l)).join('\n');
  if(/LENTE\s*:/i.test(lin)) p.trechos.push({data,origem:'agendamento',texto:lin,olho:olhoTx(desc)});
  for(const m of a.medical_records||[]){const t=folhas(m.value);if(REL.test(t)) p.trechos.push({data,origem:'prontuario',texto:t.slice(0,2000)});}}}
}
const pacote={fonte:'eyecare',pacientes:[...pats.values()].map(({nome,cirurgias,trechos})=>({nome,cirurgias,trechos}))};
const gz=await new Response(new Blob([JSON.stringify(pacote)]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
let s='';const b=new Uint8Array(gz);for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode.apply(null,b.subarray(i,i+8192));
window.__lentes={pacientes:pacote.pacientes.length,b64:btoa(s)};})();
```

## Amigo (aba amigoapp.com.br)

```js
window.__lentesAmigo=null;(async()=>{
const tok=localStorage.token.replace(/^"|"$/g,'');const H={Authorization:'Bearer '+tok,'company-id':'126104',Accept:'application/json'};
const hoje=new Date(Date.now()-3*36e5);const iso=d=>d.toISOString().slice(0,10);
const r=await fetch(`https://api.amigoapp.com.br/api/attendance/agenda?start_date=${iso(new Date(hoje.getTime()-60*864e5))}&end_date=${iso(new Date(hoje.getTime()+60*864e5))}&is_view_all_doctors=false&new_listing=true&user_id=215271`,{headers:H});
const j=await r.json();const arr=Array.isArray(j)?j:(j.data||Object.values(j).find(Array.isArray)||[]);
const ST={done:'FINISHED',canceled:'CANCELED',missed:'MISSED',scheduled:'SCHEDULED',confirmed:'CONFIRMED',arrived:'ARRIVED'};
const sa=t=>String(t||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const olhoTx=t=>{const l=sa(t);const m=l.match(/OLHO\s*:?\s*(DIREITO|ESQUERDO|AMBOS)/);if(m)return{DIREITO:'OD',ESQUERDO:'OE',AMBOS:'AO'}[m[1]];const od=/\bOD\b/.test(l),oe=/\bOE\b/.test(l);return od&&!oe?'OD':oe&&!od?'OE':null;};
const REL=/\bLIO\b|\bIOL\b|LENTE|TORIC|FACO|OLHO|\bO[DE]\b|EYHANCE|PANOPTIX|\bPAN\b|VIVITY|ODYSSEY|SYNERGY|CLAREON|TECNIS|ACRYSOF|SN60|MA60|MONOFOCAL|MULTIFOCAL|EDOF|\d{1,2}[.,]\d{2}/i;
const FORA=/CPF|NASC|#|R\$|VALOR|SENHA|ALERG|TELEFONE|CEL/i;
const pats=new Map();
for(const a of arr){ if(a.is_block||!a.patient)continue; const ev=(a.agenda_event&&a.agenda_event.name)||''; const obs=a.observation||'';
 if(!/CIRURG|FACO|BIOMETR/i.test(ev)&&!/FACO|\bLIO\b|\bIOL\b|LENTE/i.test(obs))continue;
 const p=pats.get(a.patient_id)||{nome:a.patient.name,cirurgias:[],trechos:[]};pats.set(a.patient_id,p);
 const data=iso(new Date(Date.parse(a.start_date)-3*36e5));
 if(/CIRURG/i.test(ev)||/FACO/i.test(obs)) p.cirurgias.push({data,olho:olhoTx(obs),status:ST[a.status]||a.status});
 const lin=obs.split(/\r?\n/).filter(l=>REL.test(l)&&!FORA.test(l)).map(l=>l.replace(/GUIAS?\s*\S*\s*[\d\/ ]*/gi,'').trim()).filter(Boolean).join('\n');
 if(lin) p.trechos.push({data,origem:'agendamento',texto:lin,olho:olhoTx(obs)});}
const pacote={fonte:'amigo',pacientes:[...pats.values()]};
const gz=await new Response(new Blob([JSON.stringify(pacote)]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
let s='';const b=new Uint8Array(gz);for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode.apply(null,b.subarray(i,i+8192));
window.__lentesAmigo={pacientes:pacote.pacientes.length,b64:btoa(s)};})();
```

## Portal

`await receberLentes(base64)` para cada pacote (EyecareBI e Amigo).
Para testar sem gravar: `await receberLentes(base64,{simular:true})`.
