const fs = require('fs'); const appCode = fs.readFileSync('src/App.tsx', 'utf8'); const report = fs.readFileSync('REPORT.md', 'utf8'); const newReport = report.split('## ПРИЛОЖЕНИЯ')[0] + '## ПРИЛОЖЕНИЕ А: ПОЛНЫЙ ЛИСТИНГ ИСХОДНОГО КОДА (App.tsx)


'; fs.writeFileSync('REPORT.md', newReport, 'utf8');
