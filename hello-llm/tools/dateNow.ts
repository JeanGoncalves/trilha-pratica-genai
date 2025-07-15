export const dateNow = {
    name: 'dataAtual',
    description: 'Retorna a data de hoje formatada',
    parameters: { 
        type: 'object',
        properties: {},
        required: []
    },
    function: async () => {
      const hoje = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      return { hoje };
    }
  }
  