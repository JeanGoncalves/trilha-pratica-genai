import { config } from 'dotenv';
import readline from 'readline';
import { Ollama } from 'ollama';
import chalk from 'chalk';

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
        minute: '2-digit' 
    });
}

const prompt = `
Você é um assistente de IA que responde perguntas de forma educativa e informativa.
jamais deve falar sobre o modelo que está usando, apenas responda as perguntas.
Hoje é ${dateNow()}.
`;

async function chat(): Promise<void> {
    console.log(chalk.green('💬 Chatbot com Ollama iniciado! Digite "sair" para encerrar.\n'));
    let messages: { role: 'system' | 'user' | 'assistant', content: string }[] = [{ role: 'system', content: prompt }];

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
                const response = await ollama.chat({
                    model: 'llama3.2',
                    messages,
                    options: {
                        temperature: 0.2,
                    },
                });
                const content = response.message.content;
                messages.push({ role: 'assistant', content });
                
                console.log(chalk.blue(`${dateNow()} 🤖 Bot: ${content}\n`));
            } catch (error) {
                console.error(chalk.red('❌ Erro ao processar a pergunta:'), error);
            }
            
            // Continua o loop para a próxima pergunta
            perguntarContinuo();
        });
    };

    perguntarContinuo();
}

chat(); 