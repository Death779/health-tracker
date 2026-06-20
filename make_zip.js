import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('Installing adm-zip...');
execSync('npm install --no-save adm-zip', {stdio: 'ignore'});

const { default: AdmZip } = await import('adm-zip');
const zip = new AdmZip();

function addDir(dirPath, zipPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'project_archive.zip') continue;
        
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            zip.addLocalFolder(fullPath, path.join(zipPath, file));
        } else {
            zip.addLocalFile(fullPath, zipPath);
        }
    }
}

addDir('.', '');
zip.writeZip('project.zip');
console.log('Successfully created project.zip');
