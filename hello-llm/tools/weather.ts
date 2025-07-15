export const weather = {
    name: 'weather',
    description: 'Busca a previsão do tempo para uma cidade',
    parameters: {
      type: 'object',
      properties: {
        city: { 
          type: 'string',
          description: 'Nome da cidade'
        }
      },
      required: ['city']
    },
    function: async ({ city }: { city: string }) => {
      const res = await fetch(`https://wttr.in/${city}?format=3`);
      const text = await res.text();
      return { forecast: text };
    }
  }