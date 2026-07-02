import { inicializarNavbar } from '../components/Navbar';

// Inicializa componentes comuns a todas as páginas
export function inicializarPagina(): void {
  const init = () => inicializarNavbar();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
