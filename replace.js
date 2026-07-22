const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'frontend/src'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace the axios instance baseURL
    if (file.includes('axios.js') && content.includes("baseURL: 'http://localhost:5000/api'")) {
        content = content.replace(
            "baseURL: 'http://localhost:5000/api'", 
            "baseURL: (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api'"
        );
        changed = true;
    }

    // Replace hardcoded URLs
    if (content.includes('http://localhost:5000')) {
        // Find things like 'http://localhost:5000/api...'
        content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, "((import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api$1')");
        // Find things like `http://localhost:5000/api...` (template literals)
        content = content.replace(/`http:\/\/localhost:5000\/api([^`]*)`/g, "`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api$1`");
        
        // Find io('http://localhost:5000')
        content = content.replace(/'http:\/\/localhost:5000'/g, "(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
    }
});
console.log('Done!');
