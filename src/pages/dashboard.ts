import { inicializarPagina } from './common';
import { GerenciadorFinanceiro } from '../services/GerenciadorFinanceiro';
import { atualizarDashboard } from '../components/Dashboard';

inicializarPagina();

const initDashboard = () => {
  const gerenciador = new GerenciadorFinanceiro();
  atualizarDashboard(gerenciador);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}
