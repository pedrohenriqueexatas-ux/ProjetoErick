import { inicializarPagina } from './common';
import { GerenciadorFinanceiro } from '../services/GerenciadorFinanceiro';
import { atualizarResumo } from '../components/Resumo';

inicializarPagina();

const initResumo = () => {
  const gerenciador = new GerenciadorFinanceiro();
  atualizarResumo(gerenciador);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResumo);
} else {
  initResumo();
}
