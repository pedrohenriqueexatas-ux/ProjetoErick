// ============================================================
// Arquivo: categorias.ts
// Descrição: Arrays com as categorias disponíveis para receitas e despesas
// Separamos em arrays para facilitar a manutenção e reutilização
// ============================================================

// Categorias disponíveis para receitas
export const categoriasReceita: string[] = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Vendas',
  'Presentes',
  'Aluguéis',
  'Bônus',
  'Pensão',
  'Outros',
];

// Categorias disponíveis para despesas
export const categoriasDespesa: string[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Roupas',
  'Contas',
  'Outros',
];

// Retorna as categorias de acordo com o tipo (receita ou despesa)
export function obterCategoriasPorTipo(tipo: string): string[] {
  if (tipo === 'receita') {
    return categoriasReceita;
  } else {
    return categoriasDespesa;
  }
}

// Retorna todas as categorias juntas (sem repetições)
export function obterTodasCategorias(): string[] {
  const todas: string[] = [];

  // Adiciona as categorias de receita
  for (const cat of categoriasReceita) {
    if (!todas.includes(cat)) {
      todas.push(cat);
    }
  }

  // Adiciona as categorias de despesa
  for (const cat of categoriasDespesa) {
    if (!todas.includes(cat)) {
      todas.push(cat);
    }
  }

  return todas;
}
