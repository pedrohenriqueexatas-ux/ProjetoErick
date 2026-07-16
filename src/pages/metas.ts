import { inicializarPagina } from './common';
import { GerenciadorFinanceiro } from '../services/GerenciadorFinanceiro';

// ============================================================
// INTERFACE: define o formato de uma meta mensal
// Interface = "contrato" que especifica quais campos o objeto deve ter
// ============================================================
interface IMeta {
  id: string;               // identificador único gerado automaticamente
  mes: string;              // mês no formato 'YYYY-MM' (ex: '2026-07')
  metaGastos: number;       // limite máximo de gastos que quer ter no mês
  metaEconomia: number;     // quanto quer ter sobrado (receitas - despesas)
  metaInvestimento: number; // quanto planeja investir no mês
}

// Chave usada para salvar as metas no localStorage
const CHAVE_METAS = 'myfinance_metas';

// ============================================================
// FUNÇÕES DE ARMAZENAMENTO (leitura e gravação no localStorage)
// ============================================================

// Carrega todas as metas salvas no navegador
// Retorna um array vazio se ainda não houver nenhuma
function carregarMetas(): IMeta[] {
  const json = localStorage.getItem(CHAVE_METAS);
  if (json === null) {
    return [];
  }
  // JSON.parse converte o texto salvo de volta para um array de objetos
  return JSON.parse(json) as IMeta[];
}

// Grava o array de metas no localStorage
function salvarMetas(metas: IMeta[]): void {
  // JSON.stringify converte o array de objetos para texto
  localStorage.setItem(CHAVE_METAS, JSON.stringify(metas));
}

// ============================================================
// FUNÇÕES DE LÓGICA (adicionar e excluir metas)
// ============================================================

// Cria uma nova meta e adiciona à lista
function adicionarMeta(
  mes: string,
  metaGastos: number,
  metaEconomia: number,
  metaInvestimento: number
): void {
  const metas = carregarMetas();

  // Gera um ID único combinando o tempo atual com um número aleatório
  const novoId = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  // Cria o objeto da nova meta com os valores recebidos
  const novaMeta: IMeta = {
    id: novoId,
    mes: mes,
    metaGastos: metaGastos,
    metaEconomia: metaEconomia,
    metaInvestimento: metaInvestimento,
  };

  // Adiciona ao final do array e grava tudo no localStorage
  metas.push(novaMeta);
  salvarMetas(metas);
}

// Remove uma meta pelo seu ID único
function excluirMeta(id: string): void {
  const metas = carregarMetas();

  // Cria um novo array copiando apenas as metas que NÃO são a que queremos excluir
  const metasRestantes: IMeta[] = [];
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].id !== id) {
      metasRestantes.push(metas[i]);
    }
  }

  salvarMetas(metasRestantes);
}

// ============================================================
// FUNÇÕES DE FORMATAÇÃO (transformam dados brutos em texto legível)
// ============================================================

// Converte um número para moeda brasileira — ex: 1234.5 → "R$ 1.234,50"
function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Converte 'YYYY-MM' para "Mês Ano" — ex: '2026-07' → "Julho 2026"
function formatarMes(anoMes: string): string {
  const partes = anoMes.split('-');     // divide em ['2026', '07']
  const ano = Number(partes[0]);        // 2026
  const mes = Number(partes[1]);        // 7

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  // mes - 1 porque arrays começam em 0 (índice 0 = Janeiro)
  return nomesMeses[mes - 1] + ' ' + ano;
}

// ============================================================
// FUNÇÃO AUXILIAR: monta uma linha de comparação "meta vs real"
// Recebe rótulo, os valores formatados, se atingiu a meta, e os textos de sucesso/falha
// Retorna HTML pronto para ser inserido na página
// ============================================================
function criarLinhaComparacao(
  rotulo: string,
  valoresTexto: string,
  atingiu: boolean,
  textoSucesso: string,
  textoFalha: string
): string {
  // Define o ícone e a classe de cor com base em se a meta foi atingida
  let icone = '';
  let classeStatus = '';
  let textoStatus = '';

  if (atingiu) {
    icone = '✅';
    classeStatus = 'status-positivo';
    textoStatus = textoSucesso;
  } else {
    icone = '❌';
    classeStatus = 'status-negativo';
    textoStatus = textoFalha;
  }

  // Monta e retorna o HTML da linha
  let html = '';
  html += '<div class="categoria-item" style="margin-top: 10px;">';
  html += '<span class="categoria-label">' + rotulo + '</span>';
  html += '<span class="categoria-valor">' + valoresTexto + '</span>';
  html += '</div>';
  html += '<div class="categoria-item">';
  html += '<span class="' + classeStatus + '" style="font-size: 0.8rem; padding: 3px 8px; border-radius: 4px;">';
  html += icone + ' ' + textoStatus;
  html += '</span>';
  html += '</div>';

  return html;
}

// ============================================================
// FUNÇÃO PRINCIPAL: exibe os cards de metas na tela
// Lê as metas salvas, busca as transações do mês e compara com as metas
// ============================================================
function mostrarMetas(gerenciador: GerenciadorFinanceiro): void {
  const container = document.getElementById('lista-metas');
  if (container === null) {
    return;
  }

  const metas = carregarMetas();

  // Se não houver metas, mostra mensagem informativa e para aqui
  if (metas.length === 0) {
    container.innerHTML = '<p class="texto-vazio">Nenhuma meta cadastrada ainda. Use o formulário acima!</p>';
    return;
  }

  // Abre o grid de cards
  let html = '<div class="categorias-container">';

  // Percorre cada meta salva e monta seu card de comparação
  for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];

    // Busca todas as transações do mês desta meta
    // filtrarPorMes recebe 'YYYY-MM' e retorna as transações daquele mês
    const transacoesDomes = gerenciador.filtrarPorMes(meta.mes);

    // Calcula os totais reais do mês com um loop pelas transações
    let gastosReais = 0;
    let receitasReais = 0;
    let investidoReal = 0;

    for (let j = 0; j < transacoesDomes.length; j++) {
      const transacao = transacoesDomes[j];

      if (transacao.tipo === 'despesa') {
        gastosReais += transacao.valor;
      } else {
        // Receita normal
        receitasReais += transacao.valor;
        // Se a receita for da categoria Investimentos, conta também como investimento
        if (transacao.categoria === 'Investimentos') {
          investidoReal += transacao.valor;
        }
      }
    }

    // Quanto sobrou = tudo que entrou menos tudo que saiu
    const sobrou = receitasReais - gastosReais;

    // Monta o HTML do card desta meta
    html += '<div class="categoria-card">';
    html += '<div class="categoria-titulo">📅 ' + formatarMes(meta.mes) + '</div>';
    html += '<div class="categoria-detalhes">';

    // Linha 1 — Gastos: real deve ser MENOR ou igual à meta (gastar menos é bom)
    html += criarLinhaComparacao(
      '💸 Gastos',
      formatarMoeda(gastosReais) + ' de ' + formatarMoeda(meta.metaGastos),
      gastosReais <= meta.metaGastos,
      'Dentro do limite!',
      'Limite ultrapassado'
    );

    // Linha 2 — Economia: sobrou deve ser MAIOR ou igual à meta (sobrar mais é bom)
    html += criarLinhaComparacao(
      '💰 Economizou',
      formatarMoeda(sobrou) + ' de ' + formatarMoeda(meta.metaEconomia),
      sobrou >= meta.metaEconomia,
      'Meta alcançada!',
      'Abaixo da meta'
    );

    // Linha 3 — Investimento: investido deve ser MAIOR ou igual à meta
    html += criarLinhaComparacao(
      '📈 Investido',
      formatarMoeda(investidoReal) + ' de ' + formatarMoeda(meta.metaInvestimento),
      investidoReal >= meta.metaInvestimento,
      'Meta alcançada!',
      'Abaixo da meta'
    );

    // Botão para excluir esta meta — usa data-id para guardar o ID
    html += '<div style="margin-top: 14px; text-align: right;">';
    html += '<button class="btn btn-secundario btn-excluir-meta" data-id="' + meta.id + '" style="font-size: 0.85rem; padding: 6px 12px;">🗑️ Excluir</button>';
    html += '</div>';

    html += '</div>'; // fecha categoria-detalhes
    html += '</div>'; // fecha categoria-card
  }

  html += '</div>'; // fecha categorias-container
  container.innerHTML = html;

  // Após inserir o HTML, percorre todos os botões de excluir e adiciona o evento de clique
  const botoes = container.querySelectorAll('.btn-excluir-meta');
  for (let i = 0; i < botoes.length; i++) {
    const botao = botoes[i] as HTMLButtonElement;

    botao.addEventListener('click', function () {
      const id = botao.getAttribute('data-id');
      if (id !== null) {
        excluirMeta(id);
        mostrarMetas(gerenciador); // atualiza a tela após excluir
      }
    });
  }
}

// ============================================================
// INICIALIZAÇÃO DA PÁGINA
// ============================================================

inicializarPagina();

document.addEventListener('DOMContentLoaded', function () {
  const gerenciador = new GerenciadorFinanceiro();

  // Carrega e exibe as metas que já estão salvas
  mostrarMetas(gerenciador);

  // Configura o formulário de nova meta
  const formulario = document.getElementById('form-meta');

  if (formulario !== null) {
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault(); // impede a página de recarregar ao submeter

      // Lê os valores dos campos do formulário
      const mes = (document.getElementById('meta-mes') as HTMLInputElement).value;
      const metaGastos = parseFloat((document.getElementById('meta-gastos') as HTMLInputElement).value);
      const metaEconomia = parseFloat((document.getElementById('meta-economia') as HTMLInputElement).value);
      const metaInvestimento = parseFloat((document.getElementById('meta-investimento') as HTMLInputElement).value);

      // Adiciona a nova meta e atualiza a tela
      adicionarMeta(mes, metaGastos, metaEconomia, metaInvestimento);
      (formulario as HTMLFormElement).reset(); // limpa o formulário
      mostrarMetas(gerenciador);
    });
  }
});
