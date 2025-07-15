import { config } from 'dotenv';
import readline from 'readline';
import OpenAI from 'openai';
import chalk from 'chalk';
import { tools } from './tools';

config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = `
Você é um assistente de IA que responde perguntas de forma educativa e informativa.
Jamais deve falar sobre o modelo que está usando, apenas responda as perguntas.
Você tem acesso a ferramentas/tools que pode usar quando necessário. Caso seja necessário usar uma ferramenta para usar outra, use!
Quero apenas respostas descritivas e não deve ter respostas da tool, e sim o resumo.
`;

async function chat(): Promise<void> {
    console.log(chalk.green('💬 Chatbot com OpenAI iniciado! Digite "sair" para encerrar.\n'));
    
    let messages: { role: 'system' | 'user' | 'assistant' | 'tool', content: string, tool_call_id?: string }[] = [
        { role: 'system', content: prompt }
    ];

    const perguntarContinuo = (): void => {
        rl.question(chalk.yellow('Você: '), async (question) => {
            if (question.toLowerCase() === 'sair') {
                console.log(chalk.green('\nObrigado por usar o chatbot! Até mais! 👋'));
                rl.close();
                return;
            }

            try {
                console.log(chalk.gray('\n🤖 Pensando...\n'));
                messages.push({ role: 'user', content: question });

                const toolsFormatted = tools.map(tool => ({
                    type: 'function' as const,
                    function: {
                        name: tool.name,
                        description: tool.description,
                        parameters: tool.parameters
                    }
                }));

                const response = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: messages as any,
                    tool_choice: 'auto',
                    tools: toolsFormatted,
                    temperature: 0.7,
                });

                const message = response.choices[0].message;

                if (message.tool_calls && message.tool_calls.length > 0) {
                    messages.push({ role: 'assistant', content: message.content || '', tool_calls: message.tool_calls } as any);
                    
                    const toolResults = await Promise.all(
                        message.tool_calls.map(async (toolCall) => {
                            const tool = tools.find(t => t.name === toolCall.function.name);
                            if (!tool) return null;
                            
                            try {
                                let args = toolCall.function.arguments;
                                if (typeof args === 'string') {
                                    args = JSON.parse(args);
                                }
                                
                                const result = await (tool.function as any)(args);
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

                    toolResults.filter(Boolean).forEach(result => messages.push(result as any));

                    const finalResponse = await openai.chat.completions.create({
                        model: 'gpt-4o-mini',
                        messages: messages as any,
                        temperature: 0.7,
                        tools: toolsFormatted
                    });

                    const finalContent = finalResponse.choices[0].message.content || '';
                    messages.push({ role: 'assistant', content: finalContent });
                    console.log(chalk.blue(`🤖 Bot: ${finalContent}\n`));
                } else {
                    const content = message.content || '';
                    messages.push({ role: 'assistant', content });
                    console.log(chalk.blue(`🤖 Bot: ${content}\n`));
                }
                
            } catch (error) {
                console.error(chalk.red('❌ Erro ao processar a pergunta:'), error);
            }
            
            perguntarContinuo();
        });
    };

    perguntarContinuo();
}

chat(); 