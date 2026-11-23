/* Lente da catarata: lê trechos de texto do prontuário (EyecareBI / Amigo) e da planilha
   e tira modelo, tórica e dioptria por olho. Só interpreta texto; quem grava é o portal.
   Regra de segurança: na dúvida, não chuta — marca "conferir" e guarda o trecho original. */
(function(root){
  const sa = s => String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();

  // modelos conhecidos (ordem importa: o mais específico primeiro)
  const MODELOS = [
    [/\bPANOPTIX\b|\bPAN\b/, "PanOptix"],
    [/\bEYHANCE\b/, "Eyhance"],
    [/\bVIVITY\b/, "Vivity"],
    [/\bODYSSEY\b/, "Odyssey"],
    [/\bSYNERGY\b/, "Synergy"],
    [/\bCLAREON\b/, "Clareon"],
    [/\bZCB\s?00\b/, "Tecnis ZCB00"],
    [/\bTECNIS\b/, "Tecnis"],
    [/\bSN60\w*/, "AcrySof SN60"],
    [/\bACRYSOF\b/, "AcrySof"],
    [/\bMA60\w*/, "MA60"],
    [/\bEDOF\b/, "EDOF"],
    [/\bTRIFOCAL\b/, "Trifocal"],
    [/\bBIFOCAL\b/, "Bifocal"],
    [/\bMULTIFOCAL\b/, "Multifocal"],
    [/LIO\s+(DO\s+)?PLANO|LENTE\s+(DO\s+)?PLANO|PLANO\s+POP/, "Lente do plano"],
    [/\bMONOFOCAL\b|\bMONO\b/, "Monofocal"],
  ];
  const CONTEXTO = /\bLIO\b|\bIOL\b|BIOMETRI|BIONETRI|\bLENTE\b|\bFACO\b|FACECT/;
  // linhas que têm números com vírgula mas não são lente intraocular
  const NAO_LIO = /\bLC\b|LENTE DE CONTATO|\bMD\b|\bPIO\b|PAQUI|\bADI[CC]|\bAV\b|ESF[EÉ]RICO|CILIN|\bEIXO\b|\bK1\b|\bK2\b|\bACD\b|\bAXL\b|\bAL\b/;

  function olhoDe(l){
    const od = /\bOD\b|\bO\.D\.|OLHO DIREITO|\bDIREITO\b/.test(l), oe = /\bOE\b|\bO\.E\.|OLHO ESQUERDO|\bESQUERDO\b/.test(l), ao = /\bAO\b|AMBOS/.test(l);
    if(ao || (od && oe)) return od && oe && !ao ? "AMBIG" : "AO";
    return od ? "OD" : oe ? "OE" : null;
  }
  function modeloDe(l){
    if(/\bDEFINIR\b|A DEFINIR/.test(l)) return null;
    const achados = MODELOS.filter(([re]) => re.test(l)).map(x => x[1]);
    const uniq = [...new Set(achados)];
    // "X OU Y" → ainda em decisão
    if(uniq.length > 1 && /\bOU\b/.test(l)) return {duvida: uniq};
    // "OPÇÕES: ..." é lista de alternativas, não escolha
    if(uniq.length && /\bOPC(OES|AO)\b/.test(l)) return {duvida: uniq};
    // "Monofocal" junto de um nome comercial: fica o nome comercial
    const fortes = uniq.filter(m => !["Monofocal","Multifocal","Trifocal","Bifocal","EDOF"].includes(m));
    return fortes[0] || uniq[0] || null;
  }
  function toricaDe(l){
    if(/\bNAO\b\s*-?\s*TORIC|\bN\.?\s*TORIC|\bSEM\s+TORIC/.test(l)) return false;
    if(/TORIC|\bT[2-9]\b/.test(l)) return true;   // T3…T9 = cilindro da lente tórica
    return null;
  }
  const fmtD = (sinal, n) => { const v = Number(n.replace(",", ".")); if(!(v >= -10 && v <= 40)) return null; return (sinal === "-" ? "-" : "+") + v.toFixed(2).replace(".", ","); };
  function dioptriasDe(l){
    const out = []; const re = /(^|[^\d,.])([+-]?)\s?(\d{1,2}[.,]\d{2})(?![\d])/g; let m;
    while((m = re.exec(l))){ const d = fmtD(m[2], m[3]); if(d) out.push(d); }
    // "16D" / "+21 D" (sem casas decimais), só na faixa usual de LIO
    const re2 = /(^|[^\d,.])([+-]?)\s?(\d{1,2})\s?D\b/g;
    while((m = re2.exec(l))){ const v = Number(m[3]); if(v >= 5 && v <= 35){ const d = fmtD(m[2], m[3] + ".00"); if(d) out.push(d); } }
    return out;
  }

  // Um trecho = {data:"AAAA-MM-DD", origem:"agendamento"|"prontuario"|"planilha", texto}
  // Devolve candidatos por linha: {data, origem, tipo, olho, modelo, torica, dioptria, ambig, linha}
  function candidatos(trechos){
    const out = [];
    for(const t of (trechos || [])){
      const linhas = String(t.texto || "").split(/\r?\n|\\n/).map(x => x.trim()).filter(Boolean);
      const txtA = sa(t.texto);
      const tipo = t.origem === "agendamento" ? "agendamento" : t.origem === "planilha" ? "planilha"
        : /DESCRI[CÇ]?A?O CIRURGICA|FACO\s*\+\s*LIO|PO FACO|POT FACO/.test(txtA) ? "cirurgia"
        : /BIOMETRI|BIONETRI/.test(txtA) ? "biometria" : "consulta";
      let olhoCtx = t.olho || null;           // o agendamento/planilha pode já dizer o olho
      for(const bruto of linhas){
        const l = sa(bruto);
        const o = olhoDe(l);
        // linha que é só cabeçalho de olho ("FACO OLHO ESQUERDO", "OLHO: DIREITO") muda o contexto
        if(o && o !== "AMBIG") olhoCtx = o;
        const temCtx = CONTEXTO.test(l) || MODELOS.some(([re]) => re.test(l)) || /TORIC/.test(l) || (tipo === "biometria" && /^[-*>\s]*(OD|OE)\b/.test(l));
        if(!temCtx) continue;
        const mod = modeloDe(l), tor = toricaDe(l);
        let ds = NAO_LIO.test(l) ? [] : dioptriasDe(l);
        if(!mod && tor === null && !ds.length) continue;
        const ambig = o === "AMBIG" || (ds.length > 1 && /\bOU\b/.test(l)) || (mod && mod.duvida);
        out.push({ data: t.data || null, origem: t.origem, tipo, olho: o === "AMBIG" ? null : (o || olhoCtx), olhoExplicito: !!o && o !== "AMBIG",
          modelo: mod && !mod.duvida ? mod : null, opcoes: mod && mod.duvida ? mod.duvida : null, torica: tor,
          dioptria: ds.length === 1 ? ds[0] : null, dioptrias: ds, ambig: !!ambig, linha: bruto.slice(0, 160) });
      }
    }
    return out;
  }

  const PESO = { cirurgia: 4, agendamento: 3, biometria: 2, planilha: 1, consulta: 1 };
  const maisNovo = (a, b) => (b.data || "").localeCompare(a.data || "") || PESO[b.tipo] - PESO[a.tipo];

  // Resumo para um olho ("OD" | "OE"): modelo, tórica, dioptria e se precisa conferir.
  function resumoOlho(cands, olho){
    const deste = cands.filter(c => c.olho === olho || c.olho === "AO").sort(maisNovo);
    const semOlho = cands.filter(c => !c.olho).sort(maisNovo);
    const motivos = [];
    // dioptria: a mais recente sem ambiguidade, rotulada com o olho
    let dio = deste.find(c => c.dioptria && !c.ambig) || null;
    if(!dio){ const s = semOlho.filter(c => c.dioptria && !c.ambig); const vals = [...new Set(s.map(c => c.dioptria))];
      if(vals.length === 1){ dio = s[0]; motivos.push("dioptria sem o olho escrito"); } }
    if(!dio && semOlho.some(c => c.ambig && c.dioptrias.length)) motivos.push("dioptria com o olho incerto");
    if(dio){
      const recentes = deste.filter(c => c.dioptrias.length && c.data && dio.data && (Date.parse(dio.data) - Date.parse(c.data)) / 864e5 <= 180);
      if(recentes.some(c => c.ambig || c.dioptrias.some(d => d !== dio.dioptria))) motivos.push("dioptrias diferentes no prontuário");
      const maisNovaAmb = deste.find(c => c.dioptrias.length); if(maisNovaAmb && maisNovaAmb.ambig) motivos.push("última anotação com duas opções");
    } else if(deste.some(c => c.dioptrias.length)) motivos.push("dioptria com duas opções");
    // modelo e tórica: o mais recente informado (do olho ou sem olho)
    const todos = [...deste, ...semOlho].sort(maisNovo);
    const mod = todos.find(c => c.modelo) || null;
    const tor = todos.find(c => c.torica !== null) || null;
    if(mod && todos.some(c => c.opcoes && c.data && mod.data && c.data >= mod.data)) motivos.push("lente ainda em decisão (" + [...new Set(todos.filter(c => c.opcoes).flatMap(c => c.opcoes))].join(" ou ") + ")");
    if(mod){ const outros = todos.filter(c => c.modelo && c.modelo !== mod.modelo && c.data && mod.data && (Date.parse(mod.data) - Date.parse(c.data)) / 864e5 <= 120 && !["Monofocal"].includes(c.modelo));
      if(outros.length) motivos.push(`modelo diferente em outra anotação (${[...new Set(outros.map(c => c.modelo))].join(", ")})`); }
    else if(todos.some(c => c.opcoes)) motivos.push("lente ainda em decisão (" + [...new Set(todos.filter(c => c.opcoes).flatMap(c => c.opcoes))].join(" ou ") + ")");
    if(tor){ const conflito = todos.some(c => c.torica !== null && c.torica !== tor.torica && c.data && tor.data && (Date.parse(tor.data) - Date.parse(c.data)) / 864e5 <= 120);
      if(conflito) motivos.push("tórica / não tórica divergente"); }
    return { modelo: mod ? mod.modelo : null, torica: tor ? tor.torica : null, dioptria: dio ? dio.dioptria : null,
      motivos: [...new Set(motivos)], usados: [dio, mod, tor].filter(Boolean) };
  }

  // Resumo para um caso: olho "OD" | "OE" | "AO" | null
  function resumoCaso(trechos, olhoCaso){
    const cands = candidatos(trechos);
    if(!cands.length) return null;
    const olhos = olhoCaso === "OD" || olhoCaso === "OE" ? [olhoCaso] : ["OD", "OE"];
    const r = {}; olhos.forEach(o => r[o] = resumoOlho(cands, o));
    const lista = Object.values(r);
    const modelos = [...new Set(lista.map(x => x.modelo).filter(Boolean))];
    const toricas = [...new Set(lista.map(x => x.torica).filter(x => x !== null))];
    const motivos = [...new Set(lista.flatMap(x => x.motivos))];
    if(modelos.length > 1) motivos.push("modelos diferentes entre os olhos");
    const usados = new Set(lista.flatMap(x => x.usados));
    const trechosRel = cands.slice().sort(maisNovo).filter((c, i, a) => a.findIndex(y => y.linha === c.linha && y.data === c.data) === i)
      .slice(0, 8).map(c => ({ data: c.data, origem: c.tipo, olho: c.olho, texto: c.linha, usado: usados.has(c) }));
    return {
      modelo: modelos.join(" / ") || null,
      torica: toricas.length === 1 ? toricas[0] : null,
      dioptria_od: r.OD ? r.OD.dioptria : null,
      dioptria_oe: r.OE ? r.OE.dioptria : null,
      conferir: motivos.length > 0,
      motivos, trechos: trechosRel
    };
  }

  // Olho escrito num agendamento ("OLHO: DIREITO", "FACO OLHO ESQUERDO", "OD")
  function olhoDoTexto(txt){ const l = sa(txt); const m = l.match(/OLHO\s*:?\s*(DIREITO|ESQUERDO|AMBOS)/); if(m) return {DIREITO:"OD",ESQUERDO:"OE",AMBOS:"AO"}[m[1]];
    const o = olhoDe(l); return o === "AMBIG" ? null : o; }
  // Campo "LENTE:" do modelo de agendamento
  function lenteDoAgendamento(txt){ const m = String(txt || "").match(/LENTE\s*:\s*([^\n•]*)/i); return m ? m[1].trim() : null; }

  const api = { candidatos, resumoOlho, resumoCaso, olhoDoTexto, lenteDoAgendamento, modeloDe: l => modeloDe(sa(l)), toricaDe: l => toricaDe(sa(l)), dioptriasDe: l => dioptriasDe(sa(l)) };
  if(typeof module !== "undefined" && module.exports) module.exports = api; else root.LENTE = api;
})(typeof window !== "undefined" ? window : globalThis);
