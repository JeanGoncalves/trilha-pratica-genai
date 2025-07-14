import { config } from 'dotenv';
import readline from 'readline';
import { OpenAI } from 'openai';

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function perguntar(prompt: string): void {
    rl.question(prompt, async (question) => {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: question }],
        });
        console.log(response.choices[0].message.content);
        rl.close();
    });
}

perguntar('Você: ');
