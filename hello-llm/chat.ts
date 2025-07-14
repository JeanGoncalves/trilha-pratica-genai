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

async function chat(): Promise<void> {
    console.log(chalk.green('💬 Chatbot com Ollama iniciado! Digite "sair" para encerrar.\n'));
    
    const perguntarContinuo = (): void => {
        rl.question(chalk.yellow('Você: '), async (question) => {
            if (question.toLowerCase() === 'sair') {
                console.log(chalk.green('\nObrigado por usar o chatbot! Até mais! 👋'));
                rl.close();
                return;
            }

            try {
                console.log(chalk.gray('\n🤖 Pensando...\n'));
                const response = await ollama.chat({
                    model: 'llama3.2',
                    messages: [{ role: 'user', content: question }],
                });
                
                console.log(chalk.blue(`Bot: ${response.message.content}\n`));
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