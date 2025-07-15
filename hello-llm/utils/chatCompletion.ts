import OpenAI from 'openai';
import chalk from 'chalk';

interface Tool {
    name: string;
    description: string;
    parameters: any;
    function: (args: any) => Promise<any>;
}

interface ChatCompletionParams {
    openai: OpenAI;
    model: string;
    messages: any[];
    tools?: Tool[];
    temperature?: number;
    maxTokens?: number;
    toolChoice?: 'auto' | 'none' | 'required';
    maxIterations?: number;
}

interface ChatCompletionResponse {
    content: string;
    messages: any[];
    toolCalls?: any[];
    iterations: number;
}

export async function chatCompletion({
    openai,
    model,
    messages,
    tools = [],
    temperature = 0.7,
    maxTokens,
    toolChoice = 'auto',
    maxIterations = 5
}: ChatCompletionParams): Promise<ChatCompletionResponse> {
    
    // Formata as tools para o formato da OpenAI
    const toolsFormatted = tools.length > 0 ? tools.map(tool => ({
        type: 'function' as const,
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
        }
    })) : undefined;

    let updatedMessages = [...messages];
    let allToolCalls: any[] = [];
    let iteration = 0;

    // Loop para permitir execução sequencial de tools
    while (iteration < maxIterations) {
        iteration++;
        
        // Chamada para a OpenAI
        const response = await openai.chat.completions.create({
            model,
            messages: updatedMessages,
            ...(toolsFormatted && { tools: toolsFormatted }),
            ...(toolsFormatted && { tool_choice: toolChoice }),
            temperature,
            ...(maxTokens && { max_tokens: maxTokens }),
        });

        const message = response.choices[0].message;

        // Se não há tool calls, retorna a resposta final
        if (!message.tool_calls || message.tool_calls.length === 0) {
            const content = message.content || '';
            updatedMessages.push({ role: 'assistant', content });
            
            if (iteration > 1) {
                console.log(chalk.gray(`✅ Concluído em ${iteration} iterações`));
            }
            
            return {
                content,
                messages: updatedMessages,
                toolCalls: allToolCalls,
                iterations: iteration
            };
        }

        // Adiciona a mensagem do assistant com as tool calls
        updatedMessages.push({ 
            role: 'assistant', 
            content: message.content || '', 
            tool_calls: message.tool_calls 
        });

        // Adiciona as tool calls ao array geral
        allToolCalls.push(...message.tool_calls);

        // Log para múltiplas tools
        if (message.tool_calls.length > 1) {
            console.log(chalk.gray(`🔧 Executando ${message.tool_calls.length} tools em paralelo:`));
        }

        // Executa as tools em paralelo
        const toolResults = await Promise.all(
            message.tool_calls.map(async (toolCall, index) => {
                const tool = tools.find(t => t.name === toolCall.function.name);
                if (!tool) {
                    return {
                        role: 'tool' as const,
                        content: JSON.stringify({ error: `Tool '${toolCall.function.name}' not found` }),
                        tool_call_id: toolCall.id
                    };
                }
                
                try {
                    const toolLabel = message.tool_calls!.length > 1 ? 
                        `🔧 Tool ${index + 1}/${message.tool_calls!.length}: ${tool.name}` :
                        `🔧 Executando tool: ${tool.name}`;
                    console.log(chalk.gray(toolLabel));
                    
                    let args = toolCall.function.arguments;
                    if (typeof args === 'string') {
                        args = JSON.parse(args);
                    }
                    
                    const result = await tool.function(args);
                    return {
                        role: 'tool' as const,
                        content: JSON.stringify(result),
                        tool_call_id: toolCall.id
                    };
                } catch (error) {
                    return {
                        role: 'tool' as const,
                        content: JSON.stringify({ error: String(error) }),
                        tool_call_id: toolCall.id
                    };
                }
            })
        );

        // Adiciona os resultados das tools às mensagens
        updatedMessages.push(...toolResults);

        // Continua o loop para permitir que o modelo use os resultados das tools
    }

    // Se chegou aqui, excedeu o limite de iterações
    console.log(chalk.yellow(`⚠️ Limite de ${maxIterations} iterações atingido`));
    
    return {
        content: 'Desculpe, não consegui completar a tarefa dentro do limite de iterações.',
        messages: updatedMessages,
        toolCalls: allToolCalls,
        iterations: iteration
    };
} 