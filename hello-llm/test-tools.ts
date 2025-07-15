import { tools } from './tools';
import chalk from 'chalk';

const testTools = async () => {
    console.log(chalk.blue('🔧 Testando tools individualmente...\n'));
    
    // Teste da calculadora
    console.log(chalk.yellow('1. Testando calculadora:'));
    try {
        const calcTool = tools.find(t => t.name === 'calculator');
        if (calcTool) {
            const result = await (calcTool.function as any)({ expression: '2+2' });
            console.log(chalk.green(`✅ Resultado: ${JSON.stringify(result)}`));
        }
    } catch (error) {
        console.log(chalk.red(`❌ Erro: ${error}`));
    }
    
    // Teste do clima
    console.log(chalk.yellow('\n2. Testando clima:'));
    try {
        const weatherTool = tools.find(t => t.name === 'weather');
        if (weatherTool) {
            const result = await (weatherTool.function as any)({ city: 'São Paulo' });
            console.log(chalk.green(`✅ Resultado: ${JSON.stringify(result).slice(0, 100)}...`));
        }
    } catch (error) {
        console.log(chalk.red(`❌ Erro: ${error}`));
    }
    
    console.log(chalk.blue('\n🔧 Teste concluído!\n'));
    
    // Mostrar estrutura das tools
    console.log(chalk.cyan('📋 Estrutura das tools:'));
    tools.forEach((tool, index) => {
        console.log(chalk.cyan(`${index + 1}. ${tool.name}:`));
        console.log(chalk.gray(`   Descrição: ${tool.description}`));
        console.log(chalk.gray(`   Parâmetros: ${JSON.stringify(tool.parameters.properties)}`));
        console.log(chalk.gray(`   Obrigatórios: ${tool.parameters.required.join(', ')}`));
        console.log('');
    });
};

testTools(); 