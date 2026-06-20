import fs from 'fs';

const report = fs.readFileSync('REPORT.md', 'utf8');
const appCode = fs.readFileSync('src/App.tsx', 'utf8');
const dataCode = fs.readFileSync('src/data.ts', 'utf8');

// Replace text references
let newReport = report.replace(/\*\*Приложении А\*\*/g, '**Приложении 1**');
newReport = newReport.replace(/Приложении А/g, 'Приложении 1');
newReport = newReport.replace(/Приложение А/g, 'Приложение 1');

// Cut off the old appendix
const parts = newReport.split('## ПРИЛОЖЕНИЕ А');
if (parts.length > 1) {
    newReport = parts[0];
} else {
    // If not found, cut at '---' after literature
    const splitIndex = newReport.indexOf('## СПИСОК ИСПОЛЬЗОВАННОЙ ЛИТЕРАТУРЫ');
    if (splitIndex !== -1) {
        const nextBreak = newReport.indexOf('---', splitIndex);
        if (nextBreak !== -1) {
             newReport = newReport.substring(0, nextBreak + 3) + '\n\n';
        }
    }
}

// Append new formatted appendices
newReport += `## ПРИЛОЖЕНИЯ

ПРИЛОЖЕНИЕ 1

Листинг исходного кода логики интерфейса и стилей \`App.tsx\`

\`\`\`tsx
${appCode}
\`\`\`

ПРИЛОЖЕНИЕ 2

Листинг исходного кода структуры данных \`data.ts\`

\`\`\`ts
${dataCode}
\`\`\`
`;

fs.writeFileSync('REPORT.md', newReport, 'utf8');
console.log('Done!');
