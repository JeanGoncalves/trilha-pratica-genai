export const cep = {
    name: 'cep',
    description: 'Busca informações de um CEP, obtendo o endereço, bairro, cidade, estado',
    parameters: {
        type: 'object',
        properties: {
            cep: {
                type: 'string',
                description: 'CEP para buscar, ex: 01001000',
                minLength: 8,
                maxLength: 8 
            }
        },
        required: ['cep']
    },
    function: async ({ cep }: { cep: string }) => {
        const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        const data = await res.json();
        return { data };
    }
}