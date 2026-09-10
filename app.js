/* ============ STORAGE HELPERS (SALVANDO NA NUVEM) ============ */
async function loadList(key){
  try {
    const doc = await db.collection('sgq_fabrica').doc(key).get();
    if (doc.exists) {
      const raw = doc.data().value;
      return raw ? JSON.parse(raw) : [];
    }
    return [];
  } catch(e) {
    console.error('Erro ao ler do Firebase', e);
    return [];
  }
}

async function saveList(key, arr){
  try {
    await db.collection('sgq_fabrica').doc(key).set({
      value: JSON.stringify(arr)
    });
    return true;
  } catch(e) {
    console.error('Erro ao salvar no Firebase', e);
    showSaveError();
    return false;
  }
}

function showSaveError(){
  let box = document.getElementById('__saveErrorToast');
  if(!box){
    box = document.createElement('div');
    box.id = '__saveErrorToast';
    box.style.cssText = 'position:fixed; top:20px; right:20px; max-width:340px; background:#FBE9E6; color:#8A2E22; border:1px solid #E3B4AC; border-radius:12px; padding:14px 16px; font-family:Inter,sans-serif; font-size:13px; line-height:1.4; box-shadow:0 8px 24px -8px rgba(0,0,0,.25); z-index:9999;';
    box.innerHTML = '<b>Falha de comunicação com a nuvem.</b><br>Verifique se o seu banco de dados Firestore foi criado e as regras de segurança estão no "modo de teste".';
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4000);
  }
}

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function todayISO(){ return new Date().toISOString().slice(0,10); }
function fmtDate(d){ if(!d) return '—'; const p=d.split('-'); return p.length===3? p[2]+'/'+p[1]+'/'+p[0] : d; }
function daysUntil(d){ if(!d) return null; const diff = (new Date(d) - new Date(todayISO())) / 86400000; return Math.round(diff); }

/* ============ SEED DATA (from planilhas enviadas) ============ */
const SEED_FORNECEDORES = [
 ['Açúcar cristal','SAKAS','qualidade@sakas.com.br','(11)2201-2010'],
 ['Açúcar invertido','SAKAS','qualidade@sakas.com.br','(11)2201-2010'],
 ['Leite integral','Distribuidora Paim','amandapaimc@gmail.com','(19)98929-7958'],
 ['Leite composto','Polar','Falecom@polardistribuidora.com.br','(19)2105-8300'],
 ['Maltodextrina','SAKAS','qualidade@sakas.com.br','(11)2201-2010'],
 ['Dextrose','SAKAS','qualidade@sakas.com.br','(11)2201-2010'],
 ['Emulsificante Maxgel DS','Doremus','regulatorio@doremus.com.br','(11)2436-3333'],
 ['Estabilizante Aqua 5','Duas Rodas','','(47) 3372-9000'],
 ['Estabilizante BL 5','Doremus','regulatorio@doremus.com.br','(47) 3372-9000'],
 ['Max Cream','Duas Rodas','',''],
 ['Ácido cítrico','Polar','Falecom@polardistribuidora.com.br','(19)2105-8300'],
 ['Estabilizante Sherex IC','Duas Rodas','','(47) 3372-9000'],
 ['Gordura vegetal','Polar','Falecom@polardistribuidora.com.br','(19)2105-8300'],
 ['Glucose','SAKAS','qualidade@sakas.com.br','(11)2201-2010'],
 ['Cacau em pó','SAKAS','qualidade@sakas.com.br','(11)2201-2010'],
 ['Liga G2','Polar','Falecom@polardistribuidora.com.br','(19)2105-8300'],
 ['Palitos (picolé)','Polar','Falecom@polardistribuidora.com.br','(19)2105-8300'],
 ['Polpa de açaí','Gold','',''],
 ['Polpa de cupuaçu','Polar','Falecom@polardistribuidora.com.br','(19)2105-8300'],
 ['Polpa de maracujá','Chocotine','Doremus',''],
 ['Leite de coco','Doremus','regulatorio@doremus.com.br',''],
 ['Leite condensado integral','Polar','Falecom@polardistribuidora.com.br','(19)2105-8300'],
 ['Álcool/etanol','D.A Brasil Comércio de Álcool Eireli','dabrasil@dabrasil.com.br','(11)2085-0829'],
 ['Embalagens','BP Potes','','(15)3283-2503'],
];
const SEED_DOCUMENTOS = [
 ['LIC-001-R0','Licença Sanitária','','Indeterminada','Ausente','',''],
 ['MAN-001-R0','Manual de Boas Práticas - MBP','Nutrimix','Se houver alteração no local','Válido','2026-07-06',''],
 ['POP-001-R0','Procedimento Operacional Padronizado - POP','Nutrimix','Se houver alteração no local','Válido','2026-07-06',''],
 ['SST-001-R0','Programa de Gerenciamento de Riscos - PGR','','Anual','Válido','2026-03-20','2027-03-20'],
 ['SST-002-R0','Laudo Técnico das Condições Ambientais do Trabalho - LTCAT','','Anual','Válido','2026-03-20','2027-03-20'],
 ['SST-003-R0','Programa de Controle Médico de Saúde Ocupacional - PCMSO','','Anual','Válido','2026-03-20','2027-03-20'],
 ['SST-004-R0','ASO dos colaboradores','','','Ausente','',''],
 ['CTR-001-R0','Controle de Pragas','Tecnopragas','4 meses','Válido','2026-05-08','2026-09-08'],
 ['T-LIC-002','Alvará de Funcionamento da Vigilância Sanitária - Controle de pragas','','','Ausente','',''],
 ['CTR-002-R0','Laudo de Potabilidade da Água','','Semestral','Válido','2026-06-03','2026-12-03'],
 ['CTR-003-R0','Higienização da Caixa de Água','','Semestral','Válido','2026-04-17','2026-10-17'],
 ['LIC-003-R0','AVCB','','3 anos','Válido','2024-08-15','2027-08-13'],
 ['LIC-004-R0','CETESB','','','Ausente','',''],
 ['CTR-004-R0','Treinamento','Nutrimix','Semestral','Válido','2026-06-16','2026-12-16'],
 ['CTR-005-R0','Balança Calibração','','','Ausente','',''],
 ['CTR-006-R0','Calibração Termômetro','Moura Instrumentos de Medição','Anual','Válido','2025-12-08','2026-12-08'],
 ['ANL-001-R0','Análise de matéria prima','','','Ausente','',''],
 ['ANL-002-R0','Análise Microbiológica Produto Final','','','Ausente','',''],
 ['ANL-003-R0','Análise de vida de prateleira','','','Ausente','',''],
 ['ANL-004-R0','Metodologia da informação nutricional','','','Ausente','',''],
 ['ANL-005-R0','Migração de embalagem','','','Ausente','',''],
 ['ANL-006-R0','Ficha de Informações de Segurança de Produto','','','Ausente','',''],
 ['ANL-007-R0','Certificado de licenciamento integrado - Empresa','','','Ausente','',''],
];
const HYGIENE_ITEMS = ['Uniforme limpo','Uso de touca','Sapato adequado','Cabelo preso','Barba aparada','Unhas aparadas/sem esmalte','Sem maquiagem','Sem perfume','Sem anel','Sem brincos','Sem pulseiras','Sem relógio','Sem piercing (protegido)','Sem aparelho celular'];
const PACKAGE_SIZES = ['Picolé','200ml','300ml','350ml','450ml','500ml','1L','1,5L','1,8L','5L','10L'];
const UNIDADES = ['kg','g','L','ml','un','cx','pct','dz'];

/* Receitas fixas de pasteurização — quantidades da receita padrão (kg) */
const RECIPES = [
  { id:'base_desnatado', nome:'Base Desnatado', pasteuriza:true, maturacao:'inicio_fim', embalagem:false,
    ingredientes:[
      {nome:'Água', qtd:792}, {nome:'Leite Desnatado', qtd:150}, {nome:'Dextrose', qtd:25},
      {nome:'Açúcar Invertido', qtd:28}, {nome:'Açúcar', qtd:125}, {nome:'Gordura Vegetal', qtd:70},
      {nome:'Estabilizante DR PRIME', qtd:6},       
    ]},
  { id:'base_icepro', nome:'Base Icepro', pasteuriza:true, maturacao:'inicio_fim', embalagem:false,
    ingredientes:[
      {nome:'Água', qtd:789}, {nome:'Leite Zero Lactose', qtd:250}, {nome:'Polydextrose', qtd:25.8},
      {nome:'Liga Neutra', qtd:5.85},
    ]},
  { id:'cupuacu', nome:'Cupuaçu', pasteuriza:false, embalagem:true,
    ingredientes:[
      {nome:'Água', qtd:300}, {nome:'Cupuaçu', qtd:120}, {nome:'Leite Integral', qtd:35},
      {nome:'Açúcar', qtd:105}, {nome:'Maltodextrina', qtd:18}, {nome:'Maxcream', qtd:10},
      {nome:'Pó Sabor Cupuaçu', qtd:6}, {nome:'Liga Aqua 5', qtd:3.4}, {nome:'Emulsificante', qtd:5},
      {nome:'Ácido Cítrico', qtd:1},
    ]},
  { id:'acai', nome:'Açaí', pasteuriza:false, embalagem:true,
    ingredientes:[
      {nome:'Água', qtd:205}, {nome:'Açaí', qtd:240}, {nome:'Açúcar', qtd:83},
      {nome:'Maltodextrina', qtd:40}, {nome:'Dextrose', qtd:42}, {nome:'Liga Aqua 5', qtd:3.4},
      {nome:'Ácido Cítrico', qtd:0.8}, {nome:'Emulsificante', qtd:2.8}, {nome:'Corante Roxo', qtd:0.5},
      {nome:'Xarope de Guaraná', qtd:1.24}, {nome:'Xarope de Maçã', qtd:0.25},
    ]},
  { id:'picole_fruta', nome:'Picolé de Fruta', pasteuriza:true, maturacao:'tempo_only', embalagem:true,
    ingredientes:[
      {nome:'Água', qtd:879}, {nome:'Açúcar', qtd:240}, {nome:'Glucose', qtd:25},
      {nome:'Maltodextrina', qtd:50}, {nome:'Liga Aqua 5', qtd:6},
    ]},
  { id:'creme_americano', nome:'Creme Americano', pasteuriza:true, embalagem:true,
    ingredientes:[
      {nome:'Água', qtd:385}, {nome:'Leite Integral', qtd:50}, {nome:'Leite Composto', qtd:42},
      {nome:'Açúcar', qtd:73}, {nome:'Dextrose', qtd:25}, {nome:'Gordura Vegetal', qtd:20},
      {nome:'Estabilizante DR PRIME', qtd:3.1}, {nome:'Açúcar', qtd:2},
    ]},
  { id:'base', nome:'Base', pasteuriza:true, maturacao:'inicio_fim', embalagem:false,
    ingredientes:[
      {nome:'Água', qtd:789}, {nome:'Leite Composto', qtd:100}, {nome:'Leite Integral', qtd:87.5},
      {nome:'Glucose', qtd:25}, {nome:'Açúcar Invertido', qtd:28}, {nome:'Açúcar', qtd:125},
      {nome:'Gordura Vegetal', qtd:32}, {nome:'Estabilizante BL5', qtd:6.6}, {nome:'Açúcar', qtd:10},
    ]},
];
const EMBALAGEM_SUGESTOES = ['Pote 200ml','Tampa 200ml','Pote 300ml','Tampa 300ml','Pote 350ml','Tampa 350ml','Pote 450ml','Tampa 450ml','Pote 500ml','Tampa 500ml','Pote 1L','Tampa 1L','Pote 1,5L','Tampa 1,5L','Pote 1,8L','Tampa 1,8L','Pote 5L','Tampa 5L','Pote 10L','Tampa 10L','Saco Picolé','Caixa Picolé'];

const TEMP_RANGES = {
 'Freezer Picolé':[-25,-12],
 'Freezer Polpa':[0,4],
 'Banho Maria Picolé':[30,40],
 'Antecâmara Expedição':[0,4],
 'Câmara Expedição':[-18,-12],
};

/* ============ MODULE CONFIG (CRUD genérico) ============ */
const MODULES = {
  piq: {
    title:'PIQ · Ficha de Inspeção de Qualidade', sub:'Aprovação de lote — aparência, odor, cor, sabor, acidez e textura',
    key:'qg_piq', columns:['data','produto','lote','validade','tamanhos','embalagem','aparencia','odor','cor','sabor','acidez','textura','aprovacao','responsavel'],
    labels:{data:'Data',produto:'Produto',lote:'Lote',validade:'Validade',tamanhos:'Embalagens (tamanho)',embalagem:'Embalagem',aparencia:'Aparência',odor:'Odor',cor:'Cor',sabor:'Sabor',acidez:'Acidez',textura:'Textura',aprovacao:'Aprovação',responsavel:'Responsável'},
    fields:[
      {key:'data',label:'Data',type:'date',def:todayISO()},
      {key:'produto',label:'Produto',type:'text'},
      {key:'lote',label:'Lote',type:'text'},
      {key:'fabricacao',label:'Fabricação',type:'date'},
      {key:'validade',label:'Validade',type:'date'},
      {key:'tamanhos',label:'Embalagens utilizadas neste lote (selecione uma ou mais)',type:'multiselect',options:PACKAGE_SIZES,wide:true},
      {key:'embalagem',label:'Embalagem — conformidade',type:'select',options:['C','NC']},
      {key:'aparencia',label:'Aparência',type:'select',options:['C','NC']},
      {key:'odor',label:'Odor',type:'select',options:['C','NC']},
      {key:'cor',label:'Cor',type:'select',options:['C','NC']},
      {key:'sabor',label:'Sabor',type:'select',options:['C','NC']},
      {key:'acidez',label:'Acidez',type:'select',options:['C','NC']},
      {key:'textura',label:'Textura',type:'select',options:['C','NC']},
      {key:'obs',label:'Observações',type:'text',wide:true},
      {key:'responsavel',label:'Responsável',type:'text'},
    ],
    derive:(r)=>{
      const checks=['embalagem','aparencia','odor','cor','sabor','acidez','textura'];
      r.aprovacao = checks.every(c=>r[c]==='C') ? 'APROVADO' : 'REPROVADO';
      return r;
    },
    pillFields:['embalagem','aparencia','odor','cor','sabor','acidez','textura']
  },
  fornecedores: {
    title:'Lista de Fornecedores', sub:'Contatos de matérias-primas e insumos',
    key:'qg_fornecedores', columns:['produto','fornecedor','email','telefone'],
    labels:{produto:'Produto/Matéria-prima',fornecedor:'Fornecedor',email:'E-mail',telefone:'Telefone'},
    fields:[
      {key:'produto',label:'Produto/Matéria-prima',type:'text'},
      {key:'fornecedor',label:'Fornecedor',type:'text'},
      {key:'email',label:'E-mail',type:'text'},
      {key:'telefone',label:'Telefone',type:'text'},
    ]
  },
  documentos: {
    title:'Lista Mestra de Documentos', sub:'Controle de vigência de licenças, laudos e certificados',
    key:'qg_documentos', columns:['numero','nome','responsavel','periodicidade','status','realizado','validade'],
    labels:{numero:'Nº Documento',nome:'Documento',responsavel:'Responsável',periodicidade:'Periodicidade',status:'Status',realizado:'Realizado',validade:'Validade'},
    fields:[
      {key:'numero',label:'Número do documento',type:'text'},
      {key:'nome',label:'Documento',type:'text',wide:true},
      {key:'responsavel',label:'Responsável',type:'text'},
      {key:'periodicidade',label:'Periodicidade',type:'text'},
      {key:'status',label:'Status',type:'select',options:['Válido','Ausente','Vencido']},
      {key:'realizado',label:'Realizado em',type:'date'},
      {key:'validade',label:'Validade',type:'date'},
    ]
  },
};

/* ============ STATE ============ */
let currentView = 'dashboard';

/* ============ RENDER: NAV ============ */
function setActiveNav(view){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
}
document.querySelectorAll('.nav-btn').forEach(b=>{
  b.addEventListener('click', ()=> route(b.dataset.view));
});

const TITLES = {
  dashboard:['Painel','Visão geral da qualidade da produção'],
  piq:['PIQ · Inspeção de Qualidade','Registro de aprovação de lote por produto'],
  temp_producao:['Temperatura · Produção','Freezer picolé, freezer polpa e banho-maria'],
  temp_expedicao:['Temperatura · Expedição','Antecâmara e câmara de expedição'],
  recebimento:['Recebimento de Produtos','Controle de perecíveis e secos'],
  estoque:['Estoque','Entradas automáticas do recebimento e baixas de uso'],
  pasteurizacao:['Pasteurização','Fichas de pasteurização por calda, com parâmetros e rastreabilidade de lotes'],
  saborizacao:['Saborização e Rastreabilidade','Ficha por lote: ingredientes, embalagens e seus lotes de origem'],
  higiene:['Check List · Higiene Pessoal','Verificação diária por funcionário'],
  fornecedores:['Lista de Fornecedores','Contatos de matérias-primas e insumos'],
  documentos:['Lista Mestra de Documentos','Licenças, laudos e certificados obrigatórios'],
};

async function route(view){
  currentView = view;
  setActiveNav(view);
  document.getElementById('viewTitle').textContent = TITLES[view][0];
  document.getElementById('viewSub').textContent = TITLES[view][1];
  const content = document.getElementById('content');
  content.innerHTML = '<p class="empty">Carregando…</p>';
  if(view==='dashboard') return renderDashboard();
  if(view==='piq') return renderCrud('piq');
  if(view==='fornecedores') return renderCrud('fornecedores');
  if(view==='documentos') return renderCrud('documentos');
  if(view==='temp_producao') return renderTemp('producao');
  if(view==='temp_expedicao') return renderTemp('expedicao');
  if(view==='recebimento') return renderRecebimento();
  if(view==='estoque') return renderEstoque();
  if(view==='pasteurizacao') return renderPasteurizacao();
  if(view==='saborizacao') return renderSaborizacao();
  if(view==='higiene') return renderHigiene();
}

/* ============ DASHBOARD ============ */
async function renderDashboard(){
  const [piq, tprod, texp, receb, docs] = await Promise.all([
    loadList('qg_piq'), loadList('qg_temp_producao'), loadList('qg_temp_expedicao'),
    loadList('qg_recebimento'), loadList('qg_documentos')
  ]);
  const docsSeeded = docs.length ? docs : SEED_DOCUMENTOS.map(rowToDocObj);

  const mesAtual = todayISO().slice(0,7);
  const piqMes = piq.filter(r=>r.data && r.data.slice(0,7)===mesAtual);
  const aprovados = piqMes.filter(r=>r.aprovacao==='APROVADO').length;
  const reprovados = piqMes.filter(r=>r.aprovacao==='REPROVADO').length;

  const allTemp = [...tprod.map(t=>({...t,setor:'Produção'})), ...texp.map(t=>({...t,setor:'Expedição'}))];
  const foraPadrao = allTemp.filter(t=>t.status==='Fora do padrão');

  const ncReceb = receb.filter(r=>r.transporte==='NC'||r.embalagem==='NC'||r.produtos==='NC');

  const docsAlerta = docsSeeded.filter(d=>{
    if(!d.validade) return false;
    const dd = daysUntil(d.validade);
    return dd!==null && dd<=30;
  }).sort((a,b)=> daysUntil(a.validade)-daysUntil(b.validade));

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="stat-grid">
      <div class="stat ok"><div class="num">${aprovados}</div><div class="lbl">Lotes aprovados (PIQ) — mês</div></div>
      <div class="stat warn"><div class="num">${reprovados}</div><div class="lbl">Lotes reprovados (PIQ) — mês</div></div>
      <div class="stat ${foraPadrao.length? 'warn':'ok'}"><div class="num">${foraPadrao.length}</div><div class="lbl">Temperaturas fora do padrão</div></div>
      <div class="stat ${docsAlerta.length? 'info':'ok'}"><div class="num">${docsAlerta.length}</div><div class="lbl">Documentos vencendo em 30 dias</div></div>
    </div>

    <div class="card">
      <h2>Alertas de temperatura</h2>
      <p class="sub">Leituras registradas fora da faixa ideal do equipamento</p>
      ${foraPadrao.length ? foraPadrao.slice(-6).reverse().map(t=>`
        <div class="alert-row"><span class="dot coral"></span>
          <div><b>${t.equipamento}</b> (${t.setor}) — ${t.temperatura}°C em ${fmtDate(t.data)} ${t.horario||''}<br>
          <span style="color:var(--ink-soft)">Responsável: ${t.responsavel||'—'}</span></div>
        </div>`).join('') : '<p class="empty">Nenhuma leitura fora do padrão registrada.</p>'}
    </div>

    <div class="card">
      <h2>Documentos a vencer</h2>
      <p class="sub">Licenças, laudos e certificados com validade próxima ou vencida</p>
      ${docsAlerta.length ? docsAlerta.map(d=>{
        const dd = daysUntil(d.validade);
        const cls = dd<0 ? 'coral' : (dd<=7?'coral':'amber');
        return `<div class="alert-row"><span class="dot ${cls}"></span>
          <div><b>${d.nome}</b> (${d.numero})<br>
          <span style="color:var(--ink-soft)">${dd<0? 'Vencido há '+Math.abs(dd)+' dias' : 'Vence em '+dd+' dias'} — ${fmtDate(d.validade)}</span></div>
        </div>`;
      }).join('') : '<p class="empty">Nenhum documento vencendo nos próximos 30 dias.</p>'}
    </div>

    <div class="card">
      <h2>Recebimentos com não conformidade</h2>
      <p class="sub">Itens marcados como NC em transporte, embalagem ou produto</p>
      ${ncReceb.length ? ncReceb.slice(-6).reverse().map(r=>`
        <div class="alert-row"><span class="dot coral"></span>
          <div><b>${r.produto}</b> — ${r.fornecedor||'—'} em ${fmtDate(r.data)}<br>
          <span style="color:var(--ink-soft)">${r.acao_corretiva||'Sem ação corretiva registrada'}</span></div>
        </div>`).join('') : '<p class="empty">Nenhuma não conformidade registrada nos recebimentos.</p>'}
    </div>
  `;
}
function rowToDocObj(row){
  const [numero,nome,responsavel,periodicidade,status,realizado,validade]=row;
  return {id:uid(),numero,nome,responsavel,periodicidade,status,realizado,validade};
}

/* ============ GENERIC CRUD (piq, fornecedores, documentos) ============ */
async function renderCrud(modKey){
  const mod = MODULES[modKey];
  let list = await loadList(mod.key);
  if(!list.length){
    if(modKey==='fornecedores') list = SEED_FORNECEDORES.map(([produto,fornecedor,email,telefone])=>({id:uid(),produto,fornecedor,email,telefone}));
    if(modKey==='documentos') list = SEED_DOCUMENTOS.map(rowToDocObj);
    if(list.length) await saveList(mod.key, list);
  }

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="card">
      <h2>Novo registro</h2>
      <p class="sub">${mod.sub}</p>
      <div class="form-grid" id="formGrid"></div>
      <button class="btn btn-primary" id="addBtn">Adicionar</button>
    </div>
    <div class="card">
      <h2>Histórico</h2>
      <div class="toolbar">
        <input type="text" id="filterTxt" placeholder="Buscar…">
      </div>
      <div class="table-wrap"><table><thead><tr id="thRow"></tr></thead><tbody id="tbody"></tbody></table></div>
    </div>
  `;
  const formGrid = document.getElementById('formGrid');
  mod.fields.forEach(f=>{
    const wrap = document.createElement('div');
    wrap.className = 'field'+(f.wide?' wide':'');
    if(f.type==='multiselect'){
      const boxes = f.options.map(o=>`<label style="display:inline-flex;align-items:center;gap:6px;font-weight:400;text-transform:none;letter-spacing:0;font-size:13px;margin:0 14px 6px 0;color:var(--ink);"><input type="checkbox" data-f="${f.key}" value="${o}"> ${o}</label>`).join('');
      wrap.innerHTML = `<label>${f.label}</label><div style="display:flex;flex-wrap:wrap;">${boxes}</div>`;
    } else {
      const opts = f.type==='select' ? f.options.map(o=>`<option value="${o}">${o}</option>`).join('') : '';
      wrap.innerHTML = `<label>${f.label}</label>${
        f.type==='select' ? `<select data-f="${f.key}"><option value="">—</option>${opts}</select>`
        : f.type==='text' ? `<input type="text" data-f="${f.key}">`
        : `<input type="${f.type}" data-f="${f.key}" value="${f.def||''}">`
      }`;
    }
    formGrid.appendChild(wrap);
  });

  document.getElementById('addBtn').addEventListener('click', async ()=>{
    const rec = {id:uid()};
    mod.fields.forEach(f=>{
      if(f.type==='multiselect'){
        rec[f.key] = Array.from(formGrid.querySelectorAll(`[data-f="${f.key}"]:checked`)).map(c=>c.value);
      } else {
        rec[f.key] = formGrid.querySelector(`[data-f="${f.key}"]`).value;
      }
    });
    if(mod.derive) mod.derive(rec);
    if(!rec[mod.fields[0].key] && !rec[mod.fields[1].key]){ return; }
    const freshList = await loadList(mod.key);
    freshList.push(rec);
    const ok = await saveList(mod.key, freshList);
    if(!ok){ showSaveError(); return; }
    renderCrud(modKey);
  });

  document.getElementById('filterTxt').addEventListener('input', (e)=> paintTable(mod, list, e.target.value));
  paintTable(mod, list, '');

  async function deleteRow(id){
    const freshList = (await loadList(mod.key)).filter(r=>r.id!==id);
    const ok = await saveList(mod.key, freshList);
    if(!ok){ showSaveError(); return; }
    renderCrud(modKey);
  }
  window.__deleteRow = deleteRow;
}

function paintTable(mod, list, filter){
  const th = document.getElementById('thRow');
  th.innerHTML = mod.columns.map(c=>`<th>${mod.labels[c]}</th>`).join('') + '<th></th>';
  const tbody = document.getElementById('tbody');
  const f = (filter||'').toLowerCase();
  const rows = list.filter(r => !f || JSON.stringify(r).toLowerCase().includes(f)).slice().reverse();
  tbody.innerHTML = rows.length ? rows.map(r=>{
    const cells = mod.columns.map(c=>{
      let v = r[c] ?? '';
      if(Array.isArray(v)) v = v.length ? v.join(', ') : '—';
      if(c==='data'||c==='validade'||c==='realizado'||c==='fabricacao') v = fmtDate(v);
      if(v==='C') return `<td><span class="pill c">C</span></td>`;
      if(v==='NC') return `<td><span class="pill nc">NC</span></td>`;
      if(v==='APROVADO') return `<td><span class="pill c">APROVADO</span></td>`;
      if(v==='REPROVADO') return `<td><span class="pill nc">REPROVADO</span></td>`;
      if(v==='Vencido') return `<td><span class="pill nc">Vencido</span></td>`;
      if(v==='Ausente') return `<td><span class="pill warn">Ausente</span></td>`;
      if(v==='Válido') return `<td><span class="pill c">Válido</span></td>`;
      return `<td>${v||'—'}</td>`;
    }).join('');
    return `<tr>${cells}<td><button class="btn-del" onclick="__deleteRow('${r.id}')">Excluir</button></td></tr>`;
  }).join('') : `<tr><td colspan="${mod.columns.length+1}" class="empty">Nenhum registro ainda.</td></tr>`;
}

/* ============ TEMPERATURA (produção / expedição) ============ */
async function renderTemp(setor){
  const key = setor==='producao' ? 'qg_temp_producao' : 'qg_temp_expedicao';
  const equipList = setor==='producao'
    ? ['Freezer Picolé','Freezer Polpa','Banho Maria Picolé']
    : ['Antecâmara Expedição','Câmara Expedição'];
  let list = await loadList(key);

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="tag-note">Faixas ideais consideradas: Freezer −20°C a −12°C · Câmara/Antecâmara -20°C a -30°C · Banho-maria/Balcão quente 30°C a 40°C. Ajuste conforme o padrão do seu equipamento.</div>
    <div class="card">
      <h2>Nova leitura</h2>
      <div class="form-grid">
        <div class="field"><label>Data</label><input type="date" id="t_data" value="${todayISO()}"></div>
        <div class="field"><label>Horário</label><input type="time" id="t_hora"></div>
        <div class="field"><label>Equipamento</label><select id="t_equip">${equipList.map(e=>`<option>${e}</option>`).join('')}</select></div>
        <div class="field"><label>Temperatura (°C)</label><input type="text" step="0.1" id="t_temp"></div>
        <div class="field"><label>Responsável</label><input type="text" id="t_resp"></div>
        <div class="field wide"><label>Ação corretiva (se fora do padrão)</label><input type="text" id="t_acao"></div>
      </div>
      <label style="display:flex; align-items:center; gap:8px; font-size:13px; margin-bottom:14px;">
        <input type="checkbox" id="t_desl"> Equipamento desligado (DESL)
      </label>
      <button class="btn btn-primary" id="t_add">Adicionar leitura</button>
    </div>
    <div class="card">
      <h2>Histórico de leituras</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Data</th><th>Horário</th><th>Equipamento</th><th>Temp.</th><th>Status</th><th>Responsável</th><th>Ação corretiva</th><th></th></tr></thead>
        <tbody id="t_body"></tbody>
      </table></div>
    </div>
  `;
  document.getElementById('t_add').addEventListener('click', async ()=>{
    const desligado = document.getElementById('t_desl').checked;
    const equip = document.getElementById('t_equip').value;
    const temp = document.getElementById('t_temp').value;
    let status = 'Desligado';
    if(!desligado){
      const range = TEMP_RANGES[equip];
      const tv = parseFloat(temp);
      status = (range && !isNaN(tv) && tv>=range[0] && tv<=range[1]) ? 'Dentro do padrão' : 'Fora do padrão';
    }
    const rec = {
      id:uid(), data:document.getElementById('t_data').value, horario:document.getElementById('t_hora').value,
      equipamento:equip, temperatura: desligado ? 'DESL' : temp, status,
      responsavel:document.getElementById('t_resp').value, acao_corretiva:document.getElementById('t_acao').value,
    };
    if(!rec.data) return;
    const freshList = await loadList(key);
    freshList.push(rec);
    const ok = await saveList(key, freshList);
    if(!ok){ showSaveError(); return; }
    renderTemp(setor);
  });
  paintTempTable(list, key);
}
function paintTempTable(list, key){
  const tbody = document.getElementById('t_body');
  const rows = list.slice().reverse();
  tbody.innerHTML = rows.length ? rows.map(r=>`
    <tr>
      <td>${fmtDate(r.data)}</td><td>${r.horario||'—'}</td><td>${r.equipamento}</td>
      <td>${r.temperatura}${r.temperatura!=='DESL'?'°C':''}</td>
      <td><span class="pill ${r.status==='Fora do padrão'?'nc':(r.status==='Desligado'?'neutral':'c')}">${r.status}</span></td>
      <td>${r.responsavel||'—'}</td><td>${r.acao_corretiva||'—'}</td>
      <td><button class="btn-del" onclick="__deleteTemp('${key}','${r.id}')">Excluir</button></td>
    </tr>`).join('') : `<tr><td colspan="8" class="empty">Nenhuma leitura registrada ainda.</td></tr>`;
}
window.__deleteTemp = async (key,id)=>{
  const list = (await loadList(key)).filter(r=>r.id!==id);
  await saveList(key, list);
  route(key==='qg_temp_producao'?'temp_producao':'temp_expedicao');
};

/* ============ RECEBIMENTO ============ */
async function renderRecebimento(){
  const key = 'qg_recebimento';
  let list = await loadList(key);
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="card">
      <h2>Novo recebimento</h2>
      <p class="sub">Perecíveis: congelados −12°C · pescados 3°C · carnes 7°C · demais 10°C (ou conforme fabricante)</p>
      <div class="form-grid">
        <div class="field"><label>Data</label><input type="date" id="r_data" value="${todayISO()}"></div>
        <div class="field"><label>Tipo</label><select id="r_tipo"><option>Perecível</option><option>Seco</option></select></div>
        <div class="field"><label>Produto</label><input type="text" id="r_produto"></div>
        <div class="field"><label>Quantidade</label><input type="number" step="0.01" id="r_qtd"></div>
        <div class="field"><label>Unidade</label><select id="r_unidade">${UNIDADES.map(u=>`<option>${u}</option>`).join('')}</select></div>
        <div class="field"><label>Fornecedor</label><input type="text" id="r_fornecedor"></div>
        <div class="field"><label>Lote/Data de fabricação</label><input type="text" id="r_lote"></div>
        <div class="field"><label>Data de validade</label><input type="date" id="r_validade"></div>
        <div class="field"><label>Transporte/entregador</label><select id="r_transporte"><option value="">—</option><option>C</option><option>NC</option></select></div>
        <div class="field" id="r_temp_wrap"><label>Temperatura (°C)</label><input type="text" id="r_temp"></div>
        <div class="field" id="r_sif_wrap"><label>SIF</label><input type="text" id="r_sif"></div>
        <div class="field"><label>Embalagem</label><select id="r_embalagem"><option value="">—</option><option>C</option><option>NC</option></select></div>
        <div class="field"><label>Produtos</label><select id="r_produtos"><option value="">—</option><option>C</option><option>NC</option></select></div>
        <div class="field"><label>Responsável pelo recebimento</label><input type="text" id="r_resp"></div>
        <div class="field wide"><label>Ação corretiva</label><input type="text" id="r_acao"></div>
      </div>
      <button class="btn btn-primary" id="r_add">Adicionar</button>
    </div>
    <div class="tag-note">Toda entrada registrada aqui soma automaticamente no <b>Estoque</b>. Para consumir/usar o item depois, dê baixa na aba Estoque.</div>
    <div class="card">
      <h2>Histórico de recebimentos</h2>
      <div class="toolbar">
        <select id="r_filter"><option value="">Todos</option><option>Perecível</option><option>Seco</option></select>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Data</th><th>Tipo</th><th>Produto</th><th>Qtd</th><th>Unid.</th><th>Fornecedor</th><th>Validade</th><th>Transp.</th><th>Embal.</th><th>Prod.</th><th>Responsável</th><th></th></tr></thead>
        <tbody id="r_body"></tbody>
      </table></div>
    </div>
  `;
  function toggleTipoFields(){
    const show = document.getElementById('r_tipo').value === 'Perecível';
    document.getElementById('r_temp_wrap').style.display = show?'flex':'none';
    document.getElementById('r_sif_wrap').style.display = show?'flex':'none';
  }
  document.getElementById('r_tipo').addEventListener('change', toggleTipoFields);
  toggleTipoFields();

  document.getElementById('r_add').addEventListener('click', async ()=>{
    const rec = {
      id:uid(), data:document.getElementById('r_data').value, tipo:document.getElementById('r_tipo').value,
      produto:document.getElementById('r_produto').value, qtd:document.getElementById('r_qtd').value,
      unidade:document.getElementById('r_unidade').value,
      fornecedor:document.getElementById('r_fornecedor').value, lote:document.getElementById('r_lote').value,
      validade:document.getElementById('r_validade').value, transporte:document.getElementById('r_transporte').value,
      temperatura:document.getElementById('r_temp').value, sif:document.getElementById('r_sif').value,
      embalagem:document.getElementById('r_embalagem').value, produtos:document.getElementById('r_produtos').value,
      responsavel:document.getElementById('r_resp').value, acao_corretiva:document.getElementById('r_acao').value,
    };
    if(!rec.produto) return;
    const freshList = await loadList(key);
    freshList.push(rec);
    const ok = await saveList(key, freshList);
    if(!ok){ showSaveError(); return; }
    const qtdNum = parseFloat(rec.qtd);
    if(qtdNum > 0){
      await addMovement({
        id:uid(), data:rec.data, produto:rec.produto, unidade:rec.unidade, tipo:'entrada',
        quantidade:qtdNum, origem:'Recebimento', responsavel:rec.responsavel, recId:rec.id,
        observacao:'Entrada automática via recebimento'+(rec.fornecedor?' — '+rec.fornecedor:'')
      });
    }
    renderRecebimento();
  });
  document.getElementById('r_filter').addEventListener('change', (e)=> paintRecTable(list, e.target.value));
  paintRecTable(list, '');
}
function paintRecTable(list, filterTipo){
  const tbody = document.getElementById('r_body');
  const rows = list.filter(r=>!filterTipo || r.tipo===filterTipo).slice().reverse();
  const pill = v => v==='C' ? '<span class="pill c">C</span>' : v==='NC' ? '<span class="pill nc">NC</span>' : '—';
  tbody.innerHTML = rows.length ? rows.map(r=>`
    <tr>
      <td>${fmtDate(r.data)}</td><td>${r.tipo}</td><td>${r.produto}</td><td>${r.qtd||'—'}</td><td>${r.unidade||'—'}</td><td>${r.fornecedor||'—'}</td>
      <td>${fmtDate(r.validade)}</td><td>${pill(r.transporte)}</td><td>${pill(r.embalagem)}</td><td>${pill(r.produtos)}</td>
      <td>${r.responsavel||'—'}</td>
      <td><button class="btn-del" onclick="__deleteRec('${r.id}')">Excluir</button></td>
    </tr>`).join('') : `<tr><td colspan="12" class="empty">Nenhum recebimento registrado ainda.</td></tr>`;
}
window.__deleteRec = async (id)=>{
  const list = (await loadList('qg_recebimento')).filter(r=>r.id!==id);
  await saveList('qg_recebimento', list);
  const movs = (await loadList('qg_estoque_mov')).filter(m=>m.recId!==id);
  await saveList('qg_estoque_mov', movs);
  await recalcStockFromMovements();
  renderRecebimento();
};

/* ============ ESTOQUE (ligado ao Recebimento) ============ */
async function recalcStockFromMovements(){
  const movs = await loadList('qg_estoque_mov');
  const map = {};
  movs.forEach(m=>{
    const k = (m.produto||'').trim().toLowerCase()+'|'+m.unidade;
    if(!map[k]) map[k] = {id:uid(), produto:m.produto, unidade:m.unidade, quantidade:0};
    map[k].quantidade += (m.tipo==='entrada' ? Number(m.quantidade)||0 : -(Number(m.quantidade)||0));
  });
  const stock = Object.values(map).map(s=>({...s, quantidade:Math.round(s.quantidade*100)/100}));
  await saveList('qg_estoque', stock);
  return stock;
}
async function addMovement(mov){
  const movs = await loadList('qg_estoque_mov');
  movs.push(mov);
  const ok = await saveList('qg_estoque_mov', movs);
  if(ok) await recalcStockFromMovements();
  return ok;
}
async function renderEstoque(){
  const stock = await recalcStockFromMovements();
  const movs = await loadList('qg_estoque_mov');
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="tag-note">Toda entrada registrada em <b>Recebimento</b> soma aqui automaticamente. Use o formulário abaixo para dar baixa (saída/uso) ou fazer um ajuste manual de entrada.</div>
    <div class="card">
      <h2>Situação atual do estoque</h2>
      <div class="toolbar"><input type="text" id="e_search" placeholder="Buscar produto…"></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Produto</th><th>Unidade</th><th>Quantidade atual</th></tr></thead>
        <tbody id="e_stock_body"></tbody>
      </table></div>
    </div>
    <div class="card">
      <h2>Registrar movimentação</h2>
      <div class="form-grid">
        <div class="field"><label>Tipo</label><select id="e_tipo"><option value="saida">Saída (uso/baixa)</option><option value="entrada">Entrada (ajuste manual)</option></select></div>
        <div class="field"><label>Data</label><input type="date" id="e_data" value="${todayISO()}"></div>
        <div class="field"><label>Produto</label><input type="text" id="e_produto" list="e_produtos_list">
          <datalist id="e_produtos_list">${stock.map(s=>`<option value="${s.produto}">`).join('')}</datalist>
        </div>
        <div class="field"><label>Unidade</label><select id="e_unidade">${UNIDADES.map(u=>`<option>${u}</option>`).join('')}</select></div>
        <div class="field"><label>Quantidade</label><input type="number" step="0.01" id="e_qtd"></div>
        <div class="field"><label>Responsável</label><input type="text" id="e_resp"></div>
        <div class="field wide"><label>Observação/Motivo</label><input type="text" id="e_obs" placeholder="Ex: uso na produção do lote MO1903"></div>
      </div>
      <button class="btn btn-primary" id="e_add">Registrar movimentação</button>
    </div>
    <div class="card">
      <h2>Histórico de movimentações</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Data</th><th>Tipo</th><th>Produto</th><th>Qtd</th><th>Unid.</th><th>Origem</th><th>Responsável</th><th>Observação</th><th></th></tr></thead>
        <tbody id="e_mov_body"></tbody>
      </table></div>
    </div>
  `;
  function paintStock(filter){
    const f=(filter||'').toLowerCase();
    const rows = stock.filter(s=>!f||s.produto.toLowerCase().includes(f)).slice().sort((a,b)=>a.produto.localeCompare(b.produto));
    document.getElementById('e_stock_body').innerHTML = rows.length ? rows.map(s=>`
      <tr><td>${s.produto}</td><td>${s.unidade}</td>
      <td><span class="pill ${s.quantidade<0?'nc':(s.quantidade===0?'neutral':'c')}">${s.quantidade} ${s.unidade}</span></td></tr>
    `).join('') : `<tr><td colspan="3" class="empty">Nenhum item em estoque ainda. Registre um recebimento para começar.</td></tr>`;
  }
  paintStock('');
  document.getElementById('e_search').addEventListener('input', e=>paintStock(e.target.value));

  const movBody = document.getElementById('e_mov_body');
  const rows = movs.slice().reverse();
  movBody.innerHTML = rows.length ? rows.map(m=>`
    <tr>
      <td>${fmtDate(m.data)}</td>
      <td><span class="pill ${m.tipo==='entrada'?'c':'warn'}">${m.tipo==='entrada'?'Entrada':'Saída'}</span></td>
      <td>${m.produto}</td><td>${m.quantidade}</td><td>${m.unidade}</td>
      <td>${m.origem||'Manual'}</td><td>${m.responsavel||'—'}</td><td>${m.observacao||'—'}</td>
      <td><button class="btn-del" onclick="__deleteMov('${m.id}')">Excluir</button></td>
    </tr>`).join('') : `<tr><td colspan="9" class="empty">Nenhuma movimentação registrada ainda.</td></tr>`;

  document.getElementById('e_add').addEventListener('click', async ()=>{
    const produto = document.getElementById('e_produto').value.trim();
    const qtd = parseFloat(document.getElementById('e_qtd').value);
    if(!produto || !qtd) return;
    const ok = await addMovement({
      id:uid(), data:document.getElementById('e_data').value, tipo:document.getElementById('e_tipo').value,
      produto, unidade:document.getElementById('e_unidade').value, quantidade:qtd, origem:'Manual',
      responsavel:document.getElementById('e_resp').value, observacao:document.getElementById('e_obs').value
    });
    if(!ok){ showSaveError(); return; }
    renderEstoque();
  });
}
window.__deleteMov = async (id)=>{
  const movs = (await loadList('qg_estoque_mov')).filter(m=>m.id!==id);
  await saveList('qg_estoque_mov', movs);
  await recalcStockFromMovements();
  renderEstoque();
};

/* ============ PASTEURIZAÇÃO E RASTREABILIDADE ============ */
async function renderPasteurizacao(){
  const key = 'qg_pasteurizacao';
  let list = await loadList(key);
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="tag-note">As quantidades de cada calda são fixas pela receita padrão. Preencha apenas o <b>lote de cada matéria-prima</b> e, quando aplicável, os <b>parâmetros de pasteurização</b>. Ao salvar, os ingredientes descontam automaticamente do Estoque.</div>
    <div class="card">
      <h2>Nova ficha de pasteurização</h2>
      <div class="form-grid">
        <div class="field"><label>Calda</label><select id="pt_receita">${RECIPES.map(r=>`<option value="${r.id}">${r.nome}</option>`).join('')}</select></div>
        <div class="field"><label>Data</label><input type="date" id="pt_data" value="${todayISO()}"></div>
        <div class="field"><label>Lote (produto final)</label><input type="text" id="pt_lote"></div>
        <div class="field"><label>Responsável</label><input type="text" id="pt_resp"></div>
      </div>
      <div id="pt_body"></div>
      <div style="margin-top:18px;"><button class="btn btn-primary" id="pt_save">Salvar ficha</button></div>
    </div>
    <div class="card">
      <h2>Rastreabilidade</h2>
      <p class="sub">Busque por lote do produto final ou lote de uma matéria-prima</p>
      <div class="toolbar"><input type="text" id="pt_trace" placeholder="Ex: IP260626…" style="min-width:240px;"></div>
      <div id="pt_trace_results"></div>
    </div>
    <div class="card">
      <h2>Histórico de fichas</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Data</th><th>Calda</th><th>Lote</th><th>Responsável</th><th></th></tr></thead>
        <tbody id="pt_hist_body"></tbody>
      </table></div>
    </div>
  `;

  function paintForm(){
    const receita = RECIPES.find(r=>r.id===document.getElementById('pt_receita').value);
    const body = document.getElementById('pt_body');
    let html = `<h3 style="font-family:'Fraunces',serif; font-size:14.5px; margin:18px 0 8px;">Ingredientes (quantidade fixa da receita)</h3>
      <div class="table-wrap"><table><thead><tr><th>Ingrediente</th><th>Quantidade</th><th>Lote</th></tr></thead><tbody>
      ${receita.ingredientes.map((i,idx)=>`<tr><td>${i.nome}</td><td>${i.qtd} kg</td><td><input type="text" class="pt-lote" data-idx="${idx}" style="width:140px;"></td></tr>`).join('')}
      </tbody></table></div>`;

    if(receita.pasteuriza){
      html += `
        <div class="tag-note" style="margin-top:16px;">Parâmetros: no processo contínuo (HTST), 80ºC por 25 segundos, ou no processo em batelada (batch), 70ºC por 30 minutos.</div>
        <div class="form-grid">
          <div class="field"><label>Temperatura Pasteurização (°C)</label><input type="number" step="0.1" id="pt_temp_p"></div>
          <div class="field"><label>Tempo Pasteurização (min)</label><input type="number" step="1" id="pt_tempo_p"></div>
        </div>
        <div class="tag-note">O resfriamento deve ser imediato após a pasteurização, em temperatura de 4°C ou inferior.</div>
        <div class="form-grid">
          <div class="field"><label>Temperatura Resfriamento (°C)</label><input type="number" step="0.1" id="pt_temp_r"></div>
          <div class="field"><label>Imediato após pasteurização?</label><select id="pt_imediato"><option value="">—</option><option>Sim</option><option>Não</option></select></div>
        </div>
        <div class="tag-note">A maturação deve ser em temperatura de 4°C ou inferior, por no máximo 24 horas.</div>
        <div class="form-grid">
          <div class="field"><label>Temperatura Maturação (°C)</label><input type="number" step="0.1" id="pt_temp_m"></div>
          ${receita.maturacao==='inicio_fim' ? `
            <div class="field"><label>Início Maturação</label><input type="time" id="pt_inicio_m"></div>
            <div class="field"><label>Final Maturação</label><input type="time" id="pt_final_m"></div>
            <div class="field"><label>Tempo de Maturação (h)</label><input type="number" step="0.5" id="pt_tempo_m"></div>
          ` : `
            <div class="field"><label>Tempo de Maturação (h)</label><input type="number" step="0.5" id="pt_tempo_m"></div>
          `}
        </div>
      `;
    } else {
      html += `<div class="tag-note" style="margin-top:16px;">Esta calda não passa pela pasteurizadora — parâmetros de pasteurização não se aplicam.</div>`;
    }

    if(receita.embalagem){
      html += `
        <h3 style="font-family:'Fraunces',serif; font-size:14.5px; margin:20px 0 8px;">Embalagem utilizada</h3>
        <div class="table-wrap"><table><thead><tr><th>Embalagem</th><th>Quantidade</th><th>Unid.</th><th>Lote</th></tr></thead><tbody id="pt_emb_body"></tbody></table></div>
        <button class="btn btn-ghost btn-sm" id="pt_emb_add" type="button" style="margin-top:10px;">+ Adicionar embalagem</button>
      `;
    }

    html += `<div class="field wide" style="margin-top:16px;"><label>Observações</label><textarea id="pt_obs"></textarea></div>`;

    body.innerHTML = html;

    if(receita.embalagem){
      const addEmbRow = (v={})=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="text" class="pt-e-nome" value="${v.embalagem||''}" style="min-width:130px;"></td>
          <td><input type="number" step="0.01" class="pt-e-qtd" value="${v.quantidade||''}" style="width:80px;"></td>
          <td><select class="pt-e-un">${UNIDADES.map(u=>`<option ${u===(v.unidade||'un')?'selected':''}>${u}</option>`).join('')}</select></td>
          <td><input type="text" class="pt-e-lote" value="${v.lote||''}" style="width:120px;"></td>
        `;
        document.getElementById('pt_emb_body').appendChild(tr);
      };
      addEmbRow();
      document.getElementById('pt_emb_add').addEventListener('click', ()=>addEmbRow());
    }
  }
  paintForm();
  document.getElementById('pt_receita').addEventListener('change', paintForm);

  document.getElementById('pt_save').addEventListener('click', async ()=>{
    const receita = RECIPES.find(r=>r.id===document.getElementById('pt_receita').value);
    const lote = document.getElementById('pt_lote').value.trim();
    if(!lote) return;
    const data = document.getElementById('pt_data').value;
    const responsavel = document.getElementById('pt_resp').value;

    const ingredientes = receita.ingredientes.map((ing,idx)=>({
      nome: ing.nome, quantidade: ing.qtd, unidade:'kg',
      lote: (document.querySelector(`.pt-lote[data-idx="${idx}"]`)||{}).value || ''
    }));

    let parametros = null;
    if(receita.pasteuriza){
      parametros = {
        tempPasteurizacao: document.getElementById('pt_temp_p').value,
        tempoPasteurizacao: document.getElementById('pt_tempo_p').value,
        tempResfriamento: document.getElementById('pt_temp_r').value,
        imediato: document.getElementById('pt_imediato').value,
        tempMaturacao: document.getElementById('pt_temp_m').value,
        inicioMaturacao: receita.maturacao==='inicio_fim' ? document.getElementById('pt_inicio_m').value : '',
        finalMaturacao: receita.maturacao==='inicio_fim' ? document.getElementById('pt_final_m').value : '',
        tempoMaturacao: document.getElementById('pt_tempo_m').value,
      };
    }

    let embalagens = [];
    if(receita.embalagem){
      embalagens = Array.from(document.querySelectorAll('#pt_emb_body tr')).map(tr=>({
        embalagem: tr.querySelector('.pt-e-nome').value.trim(),
        quantidade: tr.querySelector('.pt-e-qtd').value,
        unidade: tr.querySelector('.pt-e-un').value,
        lote: tr.querySelector('.pt-e-lote').value.trim(),
      })).filter(e=>e.embalagem);
    }

    const observacoes = document.getElementById('pt_obs').value;

    const rec = {id:uid(), receitaId:receita.id, receitaNome:receita.nome, data, lote, responsavel, ingredientes, parametros, embalagens, observacoes};
    const freshList = await loadList(key);
    freshList.push(rec);
    const ok = await saveList(key, freshList);
    if(!ok){ showSaveError(); return; }

    for(const i of ingredientes){
      await addMovement({
        id:uid(), data, produto:i.nome, unidade:i.unidade, tipo:'saida', quantidade:Number(i.quantidade)||0,
        origem:'Pasteurização', responsavel, pastId:rec.id,
        observacao:`Uso na calda ${receita.nome} — lote ${lote}`+(i.lote?` — lote da matéria-prima: ${i.lote}`:'')
      });
    }
    for(const e of embalagens){
      const q = parseFloat(e.quantidade);
      if(q>0){
        await addMovement({
          id:uid(), data, produto:e.embalagem, unidade:e.unidade, tipo:'saida', quantidade:q,
          origem:'Pasteurização', responsavel, pastId:rec.id,
          observacao:`Uso na calda ${receita.nome} — lote ${lote}`+(e.lote?` — lote da embalagem: ${e.lote}`:'')
        });
      }
    }

    renderPasteurizacao();
  });

  paintPastHist(list);
  document.getElementById('pt_trace').addEventListener('input', e=>paintPtTrace(list, e.target.value));
  paintPtTrace(list, '');
}

function paintPastHist(list){
  const tbody = document.getElementById('pt_hist_body');
  const rows = list.slice().reverse();
  tbody.innerHTML = rows.length ? rows.map(r=>`
    <tr>
      <td>${fmtDate(r.data)}</td><td>${r.receitaNome}</td><td><b>${r.lote}</b></td><td>${r.responsavel||'—'}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="__togglePastDetail('${r.id}')">Detalhes</button>
        <button class="btn-del" onclick="__deletePast('${r.id}')">Excluir</button>
      </td>
    </tr>
    <tr id="pt_detail_${r.id}" style="display:none;"><td colspan="5">${pastDetailHtml(r)}</td></tr>
  `).join('') : `<tr><td colspan="5" class="empty">Nenhuma ficha registrada ainda.</td></tr>`;
}
function pastDetailHtml(r, highlight){
  const h = (highlight||'').toLowerCase();
  const mark = (txt)=> (h && txt && txt.toLowerCase().includes(h)) ? `<span class="pill warn">${txt}</span>` : (txt||'—');
  const ing = `<table style="margin-bottom:10px;"><thead><tr><th>Ingrediente</th><th>Qtd</th><th>Lote</th></tr></thead><tbody>
    ${r.ingredientes.map(i=>`<tr><td>${i.nome}</td><td>${i.quantidade} ${i.unidade}</td><td>${mark(i.lote)}</td></tr>`).join('')}
  </tbody></table>`;
  let params = '';
  if(r.parametros){
    const p = r.parametros;
    params = `<b>Parâmetros de pasteurização</b>
      <table style="margin-bottom:10px;"><tbody>
      <tr><td>Temp. Pasteurização</td><td>${p.tempPasteurizacao||'—'} °C</td></tr>
      <tr><td>Tempo Pasteurização</td><td>${p.tempoPasteurizacao||'—'} min</td></tr>
      <tr><td>Temp. Resfriamento</td><td>${p.tempResfriamento||'—'} °C</td></tr>
      <tr><td>Imediato após pasteurização</td><td>${p.imediato||'—'}</td></tr>
      <tr><td>Temp. Maturação</td><td>${p.tempMaturacao||'—'} °C</td></tr>
      ${p.inicioMaturacao||p.finalMaturacao ? `<tr><td>Início / Final Maturação</td><td>${p.inicioMaturacao||'—'} → ${p.finalMaturacao||'—'}</td></tr>` : ''}
      <tr><td>Tempo de Maturação</td><td>${p.tempoMaturacao||'—'} h</td></tr>
      </tbody></table>`;
  } else {
    params = `<p class="empty">Calda não passa pela pasteurizadora.</p>`;
  }
  const emb = r.embalagens && r.embalagens.length ? `<b>Embalagens</b><table><thead><tr><th>Embalagem</th><th>Qtd</th><th>Lote</th></tr></thead><tbody>
    ${r.embalagens.map(e=>`<tr><td>${e.embalagem}</td><td>${e.quantidade||'—'} ${e.unidade||''}</td><td>${mark(e.lote)}</td></tr>`).join('')}
  </tbody></table>` : '';
  const obs = r.observacoes ? `<p style="margin-top:8px;"><b>Observações:</b> ${r.observacoes}</p>` : '';
  return `<div style="padding:10px 4px;"><b>Ingredientes</b>${ing}${params}${emb}${obs}</div>`;
}
window.__togglePastDetail = (id)=>{
  const row = document.getElementById('pt_detail_'+id);
  if(row) row.style.display = row.style.display==='none' ? 'table-row' : 'none';
};
window.__deletePast = async (id)=>{
  const list = (await loadList('qg_pasteurizacao')).filter(r=>r.id!==id);
  await saveList('qg_pasteurizacao', list);
  const movs = (await loadList('qg_estoque_mov')).filter(m=>m.pastId!==id);
  await saveList('qg_estoque_mov', movs);
  await recalcStockFromMovements();
  renderPasteurizacao();
};
function paintPtTrace(list, q){
  const wrap = document.getElementById('pt_trace_results');
  const term = (q||'').trim().toLowerCase();
  if(!term){ wrap.innerHTML = '<p class="empty">Digite um lote para ver a ficha completa dessa calda ou onde uma matéria-prima foi usada.</p>'; return; }
  const matches = list.filter(r=>
    (r.lote||'').toLowerCase().includes(term) ||
    r.ingredientes.some(i=>(i.lote||'').toLowerCase().includes(term)) ||
    (r.embalagens||[]).some(e=>(e.lote||'').toLowerCase().includes(term))
  ).slice().reverse();
  wrap.innerHTML = matches.length ? matches.map(r=>`
    <div style="border:1px solid var(--line); border-radius:12px; padding:12px 14px; margin-top:12px;">
      <div style="font-size:13.5px; margin-bottom:6px;"><b>${r.receitaNome}</b> — Lote ${r.lote} · ${fmtDate(r.data)} · ${r.responsavel||'—'}</div>
      ${pastDetailHtml(r, term)}
    </div>
  `).join('') : '<p class="empty">Nenhuma ficha encontrada com esse lote.</p>';
}

/* ============ SABORIZAÇÃO E RASTREABILIDADE ============ */
async function renderSaborizacao(){
  const key = 'qg_saborizacao';
  let list = await loadList(key);
  const estoque = await loadList('qg_estoque');
  const fornecedores = await loadList('qg_fornecedores');
  const nomesConhecidos = Array.from(new Set([
    ...estoque.map(s=>s.produto),
    ...fornecedores.map(f=>f.produto)
  ])).filter(Boolean);

  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="tag-note">Cada ficha registra o produto, o lote final e todos os ingredientes/embalagens usados — com o lote de cada um. Ingredientes e embalagens com quantidade informada dão <b>baixa automática no Estoque</b>.</div>

    <div class="card">
      <h2>Nova ficha de saborização</h2>
      <p class="sub">Preencha os dados do lote e adicione quantas linhas de ingrediente/embalagem forem necessárias</p>
      <div class="form-grid">
        <div class="field"><label>Data</label><input type="date" id="sb_data" value="${todayISO()}"></div>
        <div class="field"><label>Produto</label><input type="text" id="sb_produto"></div>
        <div class="field"><label>Operador</label><input type="text" id="sb_operador"></div>
        <div class="field"><label>Lote (produto final)</label><input type="text" id="sb_lote"></div>
      </div>

      <datalist id="sb_ing_list">${nomesConhecidos.map(n=>`<option value="${n}">`).join('')}</datalist>

      <h3 style="font-family:'Fraunces',serif; font-size:14.5px; margin:18px 0 8px;">Ingredientes utilizados</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Ingrediente</th><th>Quantidade</th><th>Unid.</th><th>Lote do ingrediente</th><th>Responsável</th><th></th></tr></thead>
        <tbody id="sb_ing_body"></tbody>
      </table></div>
      <button class="btn btn-ghost btn-sm" id="sb_ing_add" style="margin-top:10px;" type="button">+ Adicionar ingrediente</button>

      <h3 style="font-family:'Fraunces',serif; font-size:14.5px; margin:20px 0 8px;">Embalagem utilizada</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Embalagem</th><th>Quantidade</th><th>Unid.</th><th>Lote da embalagem</th><th>Responsável</th><th></th></tr></thead>
        <tbody id="sb_emb_body"></tbody>
      </table></div>
      <button class="btn btn-ghost btn-sm" id="sb_emb_add" style="margin-top:10px;" type="button">+ Adicionar embalagem</button>

      <div style="margin-top:20px;"><button class="btn btn-primary" id="sb_save">Salvar ficha</button></div>
    </div>
    <label style="margin-top: 10px; display: block; font-weight: 600; font-size: 0.9rem; color: var(--ink);">Observação / Ocorrências do Lote:</label>
<textarea id="sab_obs" placeholder="Anote aqui desvios, atrasos ou detalhes do lote..." style="width: 100%; padding: 10px; border-radius: var(--radius); border: 1px solid var(--line); font-family: inherit; margin-top: 4px; resize: vertical; min-height: 60px;"></textarea>

    <div class="card">
      <h2>Rastreabilidade</h2>
      <p class="sub">Busque por lote do produto final, lote de um ingrediente ou lote de uma embalagem</p>
      <div class="toolbar"><input type="text" id="sb_trace" placeholder="Ex: MO1903, CO3103…" style="min-width:240px;"></div>
      <div id="sb_trace_results"></div>
    </div>

    <div class="card">
      <h2>Histórico de fichas</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Data</th><th>Produto</th><th>Lote</th><th>Operador</th><th>Ingred.</th><th>Embal.</th><th>Observação</th></tr></thead>
        <tbody id="sb_hist_body"></tbody>
      </table></div>
    </div>
  `;

  function ingRow(v={}){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="sb-i-nome" list="sb_ing_list" value="${v.ingrediente||''}" style="min-width:140px;"></td>
      <td><input type="number" step="0.01" class="sb-i-qtd" value="${v.quantidade||''}" style="width:80px;"></td>
      <td><select class="sb-i-un">${UNIDADES.map(u=>`<option ${u===(v.unidade||'kg')?'selected':''}>${u}</option>`).join('')}</select></td>
      <td><input type="text" class="sb-i-lote" value="${v.lote||''}" style="width:120px;"></td>
      <td><input type="text" class="sb-i-resp" value="${v.responsavel||''}" style="width:120px;"></td>
      <td><button class="btn-del" type="button" onclick="this.closest('tr').remove()">✕</button></td>
    `;
    document.getElementById('sb_ing_body').appendChild(tr);
  }
  function embRow(v={}){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="sb-e-nome" list="sb_ing_list" value="${v.embalagem||''}" style="min-width:140px;"></td>
      <td><input type="number" step="0.01" class="sb-e-qtd" value="${v.quantidade||''}" style="width:80px;"></td>
      <td><select class="sb-e-un">${UNIDADES.map(u=>`<option ${u===(v.unidade||'un')?'selected':''}>${u}</option>`).join('')}</select></td>
      <td><input type="text" class="sb-e-lote" value="${v.lote||''}" style="width:120px;"></td>
      <td><input type="text" class="sb-e-resp" value="${v.responsavel||''}" style="width:120px;"></td>
      <td><button class="btn-del" type="button" onclick="this.closest('tr').remove()">✕</button></td>
    `;
    document.getElementById('sb_emb_body').appendChild(tr);
  }
  ingRow(); ingRow();
  embRow();
  document.getElementById('sb_ing_add').addEventListener('click', ()=>ingRow());
  document.getElementById('sb_emb_add').addEventListener('click', ()=>embRow());

  document.getElementById('sb_save').addEventListener('click', async ()=>{
    const produto = document.getElementById('sb_produto').value.trim();
    const lote = document.getElementById('sb_lote').value.trim();
    if(!produto || !lote) return;
    const data = document.getElementById('sb_data').value;
    const operador = document.getElementById('sb_operador').value;
    
    

    const ingredientes = Array.from(document.querySelectorAll('#sb_ing_body tr')).map(tr=>({
      ingrediente: tr.querySelector('.sb-i-nome').value.trim(),
      quantidade: tr.querySelector('.sb-i-qtd').value,
      unidade: tr.querySelector('.sb-i-un').value,
      lote: tr.querySelector('.sb-i-lote').value.trim(),
      responsavel: tr.querySelector('.sb-i-resp').value.trim(),
    })).filter(i=>i.ingrediente);

    const embalagens = Array.from(document.querySelectorAll('#sb_emb_body tr')).map(tr=>({
      embalagem: tr.querySelector('.sb-e-nome').value.trim(),
      quantidade: tr.querySelector('.sb-e-qtd').value,
      unidade: tr.querySelector('.sb-e-un').value,
      lote: tr.querySelector('.sb-e-lote').value.trim(),
      responsavel: tr.querySelector('.sb-e-resp').value.trim(),
    })).filter(e=>e.embalagem);
const obs = document.getElementById('sab_obs').value;

    const rec = {id:uid(), data, produto, operador, lote, ingredientes, embalagens, obs: obs};
    const freshList = await loadList(key);
    freshList.push(rec);
    const ok = await saveList(key, freshList);
    if(!ok){ showSaveError(); return; }

    for(const i of ingredientes){
      const q = parseFloat(i.quantidade);
      if(q>0){
        await addMovement({
          id:uid(), data, produto:i.ingrediente, unidade:i.unidade, tipo:'saida', quantidade:q,
          origem:'Saborização', responsavel:i.responsavel||operador, saborId:rec.id,
          observacao:`Uso no lote ${lote} (${produto})`+(i.lote?` — lote do ingrediente: ${i.lote}`:'')
        });
      }
    }
    for(const e of embalagens){
      const q = parseFloat(e.quantidade);
      if(q>0){
        await addMovement({
          id:uid(), data, produto:e.embalagem, unidade:e.unidade, tipo:'saida', quantidade:q,
          origem:'Saborização', responsavel:e.responsavel||operador, saborId:rec.id,
          observacao:`Uso no lote ${lote} (${produto})`+(e.lote?` — lote da embalagem: ${e.lote}`:'')
        });
      }
    }
    renderSaborizacao();
  });

  paintSaborHist(list);
  document.getElementById('sb_trace').addEventListener('input', e=>paintTrace(list, e.target.value));
  paintTrace(list, '');
}

function paintSaborHist(list){
  const tbody = document.getElementById('sb_hist_body');
  const rows = list.slice().reverse();
  tbody.innerHTML = rows.length ? rows.map(r=>`
    <tr>
      <td>${fmtDate(r.data)}</td><td>${r.produto}</td><td><b>${r.lote}</b></td><td>${r.operador||'—'}</td>
      <td>${r.ingredientes.length}</td><td>${r.embalagens.length}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="__toggleSaborDetail('${r.id}')">Detalhes</button>
        <button class="btn-del" onclick="__deleteSabor('${r.id}')">Excluir</button>
      </td>
    </tr>
    <tr id="sb_detail_${r.id}" style="display:none;"><td colspan="7">${saborDetailHtml(r)}</td></tr>
  `).join('') : `<tr><td colspan="7" class="empty">Nenhuma ficha registrada ainda.</td></tr>`;
}
function saborDetailHtml(r, highlight){
  const h = (highlight||'').toLowerCase();
  const mark = (txt)=> (h && txt && txt.toLowerCase().includes(h)) ? `<span class="pill warn">${txt}</span>` : (txt||'—');
  const ing = (r.ingredientes.length ? `
    <table style="margin-bottom:10px;"><thead><tr><th>Ingrediente</th><th>Qtd</th><th>Lote</th><th>Responsável</th></tr></thead>
    <tbody>${r.ingredientes.map(i=>`<tr><td>${i.ingrediente}</td><td>${i.quantidade||'—'} ${i.unidade||''}</td><td>${mark(i.lote)}</td><td>${i.responsavel||'—'}</td></tr>`).join('')}</tbody></table>` : '<p class="empty">Sem ingredientes registrados.</p>') 
    + 
    `<div style="margin-top: 12px; padding: 10px; background: var(--primary-tint); border-radius: var(--radius); font-size: 0.9rem;">
      <strong>Observação / Ocorrências:</strong> <br>
      ${r.obs ? r.obs : 'Nenhuma observação registrada.'}
    </div>`;
    const emb = r.embalagens.length ? `
    <table><thead><tr><th>Embalagem</th><th>Qtd</th><th>Lote</th><th>Responsável</th></tr></thead>
    <tbody>${r.embalagens.map(e=>`<tr><td>${e.embalagem}</td><td>${e.quantidade||'—'} ${e.unidade||''}</td><td>${mark(e.lote)}</td><td>${e.responsavel||'—'}</td></tr>`).join('')}</tbody></table>` : '<p class="empty">Sem embalagens registradas.</p>';
  return `<div style="padding:10px 4px;"><b>Ingredientes</b>${ing}<b>Embalagens</b>${emb}</div>`;
}
window.__toggleSaborDetail = (id)=>{
  const row = document.getElementById('sb_detail_'+id);
  if(row) row.style.display = row.style.display==='none' ? 'table-row' : 'none';
};
window.__deleteSabor = async (id)=>{
  const list = (await loadList('qg_saborizacao')).filter(r=>r.id!==id);
  await saveList('qg_saborizacao', list);
  const movs = (await loadList('qg_estoque_mov')).filter(m=>m.saborId!==id);
  await saveList('qg_estoque_mov', movs);
  await recalcStockFromMovements();
  renderSaborizacao();
};
function paintTrace(list, q){
  const wrap = document.getElementById('sb_trace_results');
  const term = (q||'').trim().toLowerCase();
  if(!term){ wrap.innerHTML = '<p class="empty">Digite um número de lote para ver onde ele foi usado ou o que compõe esse lote.</p>'; return; }
  const matches = list.filter(r=>
    (r.lote||'').toLowerCase().includes(term) ||
    r.ingredientes.some(i=>(i.lote||'').toLowerCase().includes(term)) ||
    r.embalagens.some(e=>(e.lote||'').toLowerCase().includes(term))
  ).slice().reverse();
  wrap.innerHTML = matches.length ? matches.map(r=>`
    <div style="border:1px solid var(--line); border-radius:12px; padding:12px 14px; margin-top:12px;">
      <div style="font-size:13.5px; margin-bottom:6px;"><b>${r.produto}</b> — Lote ${r.lote} · ${fmtDate(r.data)} · ${r.operador||'—'}</div>
      ${saborDetailHtml(r, term)}
    </div>
  `).join('') : '<p class="empty">Nenhuma ficha encontrada com esse lote.</p>';
}

/* ============ HIGIENE PESSOAL ============ */
async function renderHigiene(){
  const key = 'qg_higiene';
  let list = await loadList(key);
  const content = document.getElementById('content');
  const mesAtual = todayISO().slice(0,7);
  content.innerHTML = `
    <div class="card">
      <h2>Selecionar registro</h2>
      <div class="form-grid">
        <div class="field"><label>Nome do funcionário</label><input type="text" id="h_nome" placeholder="Ex: Thiago"></div>
        <div class="field"><label>Função</label><input type="text" id="h_funcao"></div>
        <div class="field"><label>Mês/Ano</label><input type="month" id="h_mes" value="${mesAtual}"></div>
      </div>
      <button class="btn btn-primary" id="h_open">Abrir / criar check list do mês</button>
    </div>
    <div id="h_gridWrap"></div>
    <div class="card">
      <h2>Registros salvos</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Funcionário</th><th>Função</th><th>Mês/Ano</th><th></th></tr></thead>
        <tbody id="h_body"></tbody>
      </table></div>
    </div>
  `;
  paintHigieneList(list);

  document.getElementById('h_open').addEventListener('click', ()=>{
    const nome = document.getElementById('h_nome').value.trim();
    const funcao = document.getElementById('h_funcao').value.trim();
    const mes = document.getElementById('h_mes').value;
    if(!nome || !mes) return;
    openHigieneGrid(list, key, nome, funcao, mes);
  });
}
function paintHigieneList(list){
  const tbody = document.getElementById('h_body');
  tbody.innerHTML = list.length ? list.slice().reverse().map(r=>`
    <tr>
      <td>${r.nome}</td><td>${r.funcao||'—'}</td><td>${r.mes}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="__openHigieneRow('${r.id}')">Abrir</button>
        <button class="btn-del" onclick="__deleteHigiene('${r.id}')">Excluir</button>
      </td>
    </tr>`).join('') : `<tr><td colspan="4" class="empty">Nenhum check list salvo ainda.</td></tr>`;
}
function daysInMonth(mes){
  const [y,m] = mes.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}
function openHigieneGrid(list, key, nome, funcao, mes){
  let rec = list.find(r=>r.nome===nome && r.mes===mes);
  if(!rec){
    rec = {id:uid(), nome, funcao, mes, marks:{}};
    list.push(rec);
  } else if(funcao) rec.funcao = funcao;

  const nd = daysInMonth(mes);
  const wrap = document.getElementById('h_gridWrap');
  wrap.innerHTML = `
    <div class="card">
      <h2>${rec.nome} — ${rec.mes}</h2>
      <p class="sub">${rec.funcao||''}</p>
      <div class="hyg-wrap"><table class="hyg-table">
        <thead><tr><th class="item-col">Item</th>${Array.from({length:nd},(_,i)=>`<th>${i+1}</th>`).join('')}</tr></thead>
        <tbody>
          ${HYGIENE_ITEMS.map(item=>`
            <tr>
              <td class="item-col">${item}</td>
              ${Array.from({length:nd},(_,i)=>{
                const d = i+1;
                const checked = rec.marks[item] && rec.marks[item][d] ? 'checked' : '';
                return `<td><input type="checkbox" data-item="${item}" data-day="${d}" ${checked}></td>`;
              }).join('')}
            </tr>`).join('')}
        </tbody>
      </table></div>
      <div class="field wide" style="margin-top:14px;"><label>Observação</label><textarea id="h_obs">${rec.obs||''}</textarea></div>
      <button class="btn btn-primary" id="h_save" style="margin-top:12px;">Salvar check list</button>
    </div>
  `;
  document.getElementById('h_save').addEventListener('click', async ()=>{
    const marks = {};
    wrap.querySelectorAll('input[type=checkbox]').forEach(cb=>{
      const item = cb.dataset.item, day = cb.dataset.day;
      if(!marks[item]) marks[item] = {};
      marks[item][day] = cb.checked;
    });
    const obs = document.getElementById('h_obs').value;

    const freshList = await loadList(key);
    let freshRec = freshList.find(r=>r.nome===nome && r.mes===mes);
    if(!freshRec){
      freshRec = {id:rec.id, nome, funcao, mes, marks:{}};
      freshList.push(freshRec);
    }
    freshRec.marks = marks;
    freshRec.obs = obs;
    if(funcao) freshRec.funcao = funcao;

    const ok = await saveList(key, freshList);
    if(!ok){ showSaveError(); return; }
    list = freshList;
    rec = freshRec;
    paintHigieneList(list);
  });
}
window.__openHigieneRow = async (id)=>{
  const list = await loadList('qg_higiene');
  const rec = list.find(r=>r.id===id);
  if(rec) openHigieneGrid(list, 'qg_higiene', rec.nome, rec.funcao, rec.mes);
};
window.__deleteHigiene = async (id)=>{
  const list = (await loadList('qg_higiene')).filter(r=>r.id!==id);
  await saveList('qg_higiene', list);
  renderHigiene();
};
/* ============ BACKUP E LIMPEZA ============ */
window.__downloadBackup = async () => {
  // Puxa todas as coleções de dados da nuvem
  const collections = ['qg_piq', 'qg_temp_producao', 'qg_temp_expedicao', 'qg_recebimento', 'qg_estoque', 'qg_estoque_mov', 'qg_pasteurizacao', 'qg_saborizacao', 'qg_higiene', 'qg_fornecedores', 'qg_documentos'];
  const backup = {};
  
  for(const k of collections) {
     backup[k] = await loadList(k);
  }
  
  // Cria o arquivo e faz o download automático para a pasta Downloads do seu PC
  const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'backup_icegoela_' + todayISO() + '.json';
  a.click();
  
  alert("Backup salvo com sucesso no seu computador!");
};

window.__limparBancoDeDados = async () => {
  // Proteção para ninguém apertar sem querer
  const senha = prompt("CUIDADO: Isso vai APAGAR O HISTÓRICO DA NUVEM.\nAs planilhas voltarão ao zero para o novo ciclo.\nDigite a palavra ZERAR para confirmar:");
  
  if(senha === 'ZERAR') {
     // Listas que serão zeradas (histórico de produção)
     const collections = ['qg_piq', 'qg_temp_producao', 'qg_temp_expedicao', 'qg_recebimento', 'qg_estoque', 'qg_estoque_mov', 'qg_pasteurizacao', 'qg_saborizacao', 'qg_higiene'];
     
     // Sobrescreve as listas com arrays vazios na nuvem
     for(const k of collections) {
        await saveList(k, []);
     }
     
     alert("Sistema zerado com sucesso! A página será recarregada.");
     location.reload();
  } else if (senha !== null) {
     alert("Palavra incorreta. O sistema NÃO foi zerado.");
  }
};
/* ============ INIT ============ */
route('dashboard');