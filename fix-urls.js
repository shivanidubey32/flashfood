import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the messy double-import patterns
    content = content.replace(/\(import\.meta\.env\.VITE_BACKEND_URL \|\| \(import\.meta\.env\.VITE_BACKEND_URL \|\| 'http:\/\/localhost:5000'\)\)/g, 
        "(import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))");
        
    // Replace the single import patterns
    content = content.replace(/\(import\.meta\.env\.VITE_BACKEND_URL \|\| 'http:\/\/localhost:5000'\)/g, 
        "(import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))");

    // Replace the template literal patterns
    content = content.replace(/\$\{import\.meta\.env\.VITE_BACKEND_URL \|\| \(import\.meta\.env\.VITE_BACKEND_URL \|\| 'http:\/\/localhost:5000'\)\}/g, 
        "${import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')}");

    fs.writeFileSync(file, content, 'utf8');
});

console.log('URLs updated for production monolithic deployment.');
