import { inicializarPagina } from './common';
import { GerenciadorFinanceiro } from '../services/GerenciadorFinanceiro';
import { inicializarFormulario } from '../components/Formulario';

inicializarPagina();

const initNovaTransacao = () => {
  const gerenciador = new GerenciadorFinanceiro();
  inicializarFormulario(gerenciador, () => {});

  const form = document.getElementById('form-transacao');
  if (form) {
    form.addEventListener('submit', () => {
      setTimeout(() => {
        window.location.href = 'historico.html';
      }, 1500);
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNovaTransacao);
} else {
  initNovaTransacao();
}
