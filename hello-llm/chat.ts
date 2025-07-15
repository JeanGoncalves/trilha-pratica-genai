import { config } from 'dotenv';
import readline from 'readline';
import { Ollama, Tool } from 'ollama';
import chalk from 'chalk';
import { tools } from './tools';

config();

const ollama = new Ollama();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dateNow = () => {
    const date = new Date();
    return date.toLocaleString('pt-BR', { 
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

// Função de debug para tools
const debugLog = (message: string, data?: any) => {
    console.log(chalk.cyan(`[DEBUG ${dateNow()}] ${message}`));
    if (data) {
        console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
};

const prompt = `
Você é um assistente de IA que responde perguntas de forma educativa e informativa.
Jamais deve falar sobre o modelo que está usando, apenas responda as perguntas.
Você tem acesso a ferramentas/tools que pode usar quando necessário. Caso seja necessário usar uma ferramenta para usar outra, use!
Quero apenas respostas descritivas e não deve ter respostas da tool, e sim o resumo.
`;

async function chat(): Promise<void> {
    console.log(chalk.green('💬 Chatbot com Ollama iniciado! Digite "sair" para encerrar.\n'));
    console.log(chalk.blue('🔧 Debug mode ativado - Tools disponíveis:\n'));
    
    // Mostrar tools disponíveis
    tools.forEach((tool, index) => {
        console.log(chalk.blue(`${index + 1}. ${tool.name}: ${tool.description}`));
    });
    console.log('');
    
    let messages: { role: 'system' | 'user' | 'assistant' | 'tool', content: string, tool_call_id?: string }[] = [
        { role: 'system', content: prompt }
    ];

    const perguntarContinuo = (): void => {
        rl.question(chalk.yellow(`${dateNow()} Você: `), async (question) => {
            if (question.toLowerCase() === 'sair') {
                console.log(chalk.green('\nObrigado por usar o chatbot! Até mais! 👋'));
                rl.close();
                return;
            }

            try {
                console.log(chalk.gray(`\n${dateNow()} 🤖 Pensando...\n`));
                messages.push({ role: 'user', content: question });
                
                debugLog('Enviando mensagem para o modelo', {
                    model: 'qwen2.5',
                    messageCount: messages.length,
                    toolsCount: tools.length
                });

                const response = await ollama.chat({
                    model: 'qwen2.5',
                    messages,
                    tools: tools as any as Tool[],
                    options: {
                        temperature: 0.7,
                    },
                });

                debugLog('Resposta recebida do modelo', {
                    hasContent: !!response.message.content,
                    hasToolCalls: !!response.message.tool_calls,
                    toolCallsCount: response.message.tool_calls?.length || 0
                });

                const content = response.message.content || '';
                messages.push({ role: 'assistant', content });

                // Verificar se há tool calls
                if (response.message.tool_calls && response.message.tool_calls.length > 0) {
                    console.log(chalk.magenta(`\n🔧 ${response.message.tool_calls.length} tool(s) chamada(s) detectada(s)!\n`));
                    
                    for (const toolCall of response.message.tool_calls) {
                        debugLog(`Tool chamada: ${toolCall.function.name}`, {
                            name: toolCall.function.name,
                            arguments: toolCall.function.arguments
                        });

                        // Encontrar e executar a tool
                        const tool = tools.find(t => t.name === toolCall.function.name);
                        if (tool) {
                            console.log(chalk.magenta(`🔧 Executando tool: ${tool.name}`));
                            console.log(chalk.gray(`Argumentos: ${JSON.stringify(toolCall.function.arguments)}`));
                            
                            try {
                                const result = await (tool.function as any)(toolCall.function.arguments);
                                
                                debugLog(`Tool ${tool.name} executada com sucesso`, result);
                                console.log(chalk.green(`✅ Resultado: ${JSON.stringify(result)}\n`));
                                
                                // Adicionar resultado da tool nas mensagens
                                messages.push({
                                    role: 'tool',
                                    content: JSON.stringify(result),
                                    tool_call_id: toolCall.function.name
                                });
                            } catch (error) {
                                debugLog(`Erro ao executar tool ${tool.name}`, error);
                                console.log(chalk.red(`❌ Erro na tool ${tool.name}: ${error}`));
                                
                                messages.push({
                                    role: 'tool',
                                    content: JSON.stringify({ error: String(error) }),
                                    tool_call_id: toolCall.function.name
                                });
                            }
                        } else {
                            debugLog(`Tool não encontrada: ${toolCall.function.name}`);
                            console.log(chalk.red(`❌ Tool '${toolCall.function.name}' não encontrada`));
                        }
                    }

                    // Obter resposta final do modelo após executar as tools
                    debugLog('Obtendo resposta final após executar tools');
                    const finalResponse = await ollama.chat({
                        model: 'qwen2.5',
                        messages,
                        options: {
                            temperature: 0.7,
                        },
                        tools: tools as any as Tool[]
                    });

                    const finalContent = finalResponse.message.content || '';
                    messages.push({ role: 'assistant', content: finalContent });
                    console.log(chalk.blue(`${dateNow()} 🤖 Bot: ${finalContent}\n`));
                } else {
                    debugLog('Nenhuma tool chamada detectada');
                    console.log(chalk.blue(`${dateNow()} 🤖 Bot: ${content}\n`));
                }
                
            } catch (error) {
                debugLog('Erro no processamento', error);
                console.error(chalk.red('❌ Erro ao processar a pergunta:'), error);
            }
            
            // Continua o loop para a próxima pergunta
            perguntarContinuo();
        });
    };

    perguntarContinuo();
}

chat(); 