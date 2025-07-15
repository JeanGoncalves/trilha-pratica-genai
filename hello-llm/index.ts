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

function perguntar(promptText: string): void {
    rl.question(chalk.yellow(`${dateNow()} ${promptText}`), async (question) => {
        try {
            console.log(chalk.gray(`\n${dateNow()} 🤖 Pensando...\n`));
            const response = await ollama.chat({
                model: 'qwen2.5',
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: question }
                ],
                options: {
                    temperature: 0.7,
                },
            });
            console.log(chalk.blue(`${dateNow()} 🤖 Bot: ${response.message.content}`));
        } catch (error) {
            console.error(chalk.red('❌ Erro ao processar a pergunta:'), error);
        } finally {
            rl.close();
        }
    });
}

perguntar('Você: ');
