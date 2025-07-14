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

function perguntar(prompt: string): void {
    rl.question(prompt, async (question) => {
        try {
            const response = await ollama.chat({
                model: 'llama3.2',
                messages: [{ role: 'user', content: question }],
            });
            console.log(chalk.blue(response.message.content));
        } catch (error) {
            console.error('Erro ao processar a pergunta:', error);
        } finally {
            rl.close();
        }
    });
}

perguntar('Você: ');
