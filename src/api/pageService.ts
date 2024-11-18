const API_URL = 'https://seu-servidor-api.com/api/paginas';

// Salvar uma nova página
export const savePage = async (pageData: Record<string, any>) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pageData),
  });
  if (!response.ok) throw new Error('Erro ao salvar a página.');
  return response.json();
};

// Buscar uma página pelo ID
export const getPageById = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Erro ao buscar a página.');
  return response.json();
};

// Atualizar uma página existente
export const updatePage = async (id: number, pageData: Record<string, any>) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pageData),
  });
  if (!response.ok) throw new Error('Erro ao atualizar a página.');
  return response.json();
};
