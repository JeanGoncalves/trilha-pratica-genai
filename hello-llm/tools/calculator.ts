export const calculator = {
    name: 'calculator',
    description: 'Realiza operações matemáticas simples',
    parameters: {
        type: 'object',
        properties: {
            expression: {
                type: 'string',
                description: 'expressão matemática para resolver, ex: 2+2'
            }
        },
        required: ['expression']
    },
    function: async ({ expression }: { expression: string }) => {
        try {
            const result = eval(expression);
            return { result };
        } catch (e) {
            return { error: 'expressão inválida' };
        }
    }
}