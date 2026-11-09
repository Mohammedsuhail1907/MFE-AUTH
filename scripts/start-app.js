const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const configPath = path.join(__dirname, '../mfe-config.json');
let config = { mode: 'standalone' }; // Default to standalone

if (fs.existsSync(configPath)) {
    try {
        const configData = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(configData);
    } catch (err) {
        console.warn('Error reading mfe-config.json, defaulting to standalone mode.', err);
    }
}

const mode = config.mode || 'standalone';
console.log(`Starting application in ${mode} mode...`);

let command;

if (mode === 'single-spa') {
    command = 'npm run serve:single-spa:auth';
} else {
    command = 'ng run auth:serve-standalone';
}

console.log(`Executing: ${command}`);

try {
    execSync(command, { stdio: 'inherit' });
} catch (err) {
    process.exit(1);
}

