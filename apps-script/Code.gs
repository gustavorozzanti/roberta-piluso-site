/**
 * Recebe os leads do site e grava na planilha.
 * Cole este código em Extensões > Apps Script de uma planilha do Google
 * e siga o passo a passo do arquivo LEADS.md.
 */

// Interesses oferecidos nos formulários. Cada um vira uma coluna com 1 ou 0,
// o que permite contar leads por interesse com exatidão (SOMA da coluna).
const INTERESSES = [
  // Palestras
  'Cuidado como valor organizacional',
  'Direitos humanos e empresas',
  'Mulheres, maternidade e carreira',
  'Inclusão da pessoa com deficiência',
  'Liderança que cuida',
  'Envelhecimento e cuidado familiar',
  'Outro / sob medida',
  // Mentoria
  'Direito Constitucional (OAB)',
  'Direitos Humanos',
  'Orientação de TCC e artigos',
  'Inglês jurídico',
];

const ABA = 'Leads';
const COLUNAS = ['Data/hora', 'Origem', 'Nome', 'Empresa', 'Interesses', 'Data prevista',
  'Público', 'Formato', 'Modalidade', 'Momento', 'Mensagem', 'utm_source', 'utm_medium', 'utm_campaign'];

function aba_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.appendRow(COLUNAS.concat(INTERESSES));
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUNAS.length + INTERESSES.length).setFontWeight('bold');
  }
  return sh;
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const lista = Array.isArray(d.interesses) ? d.interesses : [];
    const sh = aba_();
    const linha = [
      new Date(), d.origem || '', d.nome || '', d.empresa || '', lista.join('; '),
      d.data || '', d.publico || '', d.formato || '', d.modalidade || '', d.momento || '',
      d.msg || d.objetivo || '', d.utm_source || '', d.utm_medium || '', d.utm_campaign || '',
    ].concat(INTERESSES.map(i => (lista.indexOf(i) >= 0 ? 1 : 0)));
    sh.appendRow(linha);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('erro');
  }
}

/** Rode uma vez: cria a aba "Leads" e a aba "Resumo" (contagem por interesse e por origem). */
function configurar() {
  const sh = aba_();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let r = ss.getSheetByName('Resumo');
  if (!r) r = ss.insertSheet('Resumo');
  r.clear();
  r.appendRow(['Total de leads', '=COUNTA(Leads!C2:C)']);
  r.appendRow(['Leads de palestras', '=COUNTIF(Leads!B2:B,"palestras")']);
  r.appendRow(['Leads de mentoria', '=COUNTIF(Leads!B2:B,"mentoria")']);
  r.appendRow(['']);
  r.appendRow(['Interesse', 'Leads']);
  INTERESSES.forEach((nome, i) => {
    const col = sh.getRange(1, COLUNAS.length + 1 + i).getA1Notation().replace(/\d+/, '');
    r.appendRow([nome, '=SUM(Leads!' + col + '2:' + col + ')']);
  });
  r.getRange(1, 1, r.getLastRow(), 1).setFontWeight('bold');
  r.autoResizeColumns(1, 2);
}
