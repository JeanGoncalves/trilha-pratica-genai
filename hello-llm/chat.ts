import { config } from 'dotenv';
import readline from 'readline';
import OpenAI from 'openai';
import chalk from 'chalk';
import { tools } from './tools';
import { chatCompletion } from './utils/chatCompletion';

config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

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
    console.log(chalk.green(`💬 Chatbot com OpenAI (${MODEL}) iniciado! Digite "sair" para encerrar.\n`));
    
    let messages: any[] = [
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

                const response = await chatCompletion({
                    openai,
                    model: MODEL,
                    messages,
                    tools,
                    temperature: 0.7,
                    toolChoice: 'auto'
                });

                messages = response.messages;
                console.log(chalk.blue(`🤖 Bot: ${response.content}\n`));
                
            } catch (error) {
                console.error(chalk.red('❌ Erro ao processar a pergunta:'), error);
            }
            
            perguntarContinuo();
        });
    };

    perguntarContinuo();
}

chat(); 