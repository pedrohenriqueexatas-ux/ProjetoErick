import { inicializarPagina } from './common';
import { categoriasDespesa, categoriasReceita } from '../utils/categorias';

inicializarPagina();

const renderCategorias = () => {
  const container = document.getElementById('lista-categorias-view');
  if (!container) return;

  let html = '<div class="categorias-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">';

  html += '<div><h3>⬇️ Despesas</h3><ul class="sobre-lista">';
  categoriasDespesa.forEach((c: string) => html += `<li>${c}</li>`);
  html += '</ul></div>';

  html += '<div><h3>⬆️ Receitas</h3><ul class="sobre-lista">';
  categoriasReceita.forEach((c: string) => html += `<li>${c}</li>`);
  html += '</ul></div>';

  html += '</div>';
  container.innerHTML = html;
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderCategorias);
} else {
  renderCategorias();
}
