const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Введите текст или "exit" для выхода: ');
rl.prompt();

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    console.log(`Вы ввели: ${input}`);
    fs.appendFile(filePath, `${input}\n`, err => {
      if (err) throw err;
      console.log('Данные успешно записаны в файл');
      rl.prompt();
    });
  }
});

rl.on('close', () => {
  console.log('Вы вышли из программы');
  process.exit(0);
});

process.on('SIGINT', () => {
  rl.close();
});