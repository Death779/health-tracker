import fs from 'fs';

const report = fs.readFileSync('REPORT.md', 'utf8');

let newReport = report;
newReport = newReport.replace(
    /массив объектов `INITIAL_PATIENTS` в файле `data\.ts`\)/g,
    'полный листинг структуры данных `data.ts` представлен в **Приложении 2**)'
);

fs.writeFileSync('REPORT.md', newReport, 'utf8');
console.log('Modified data.ts reference');
