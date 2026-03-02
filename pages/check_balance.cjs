const fs = require('fs');
const content = fs.readFileSync('AdminPortal.tsx', 'utf8');
const lines = content.split('\n');

let divBalance = 0;
let braceBalance = 0;
let parenBalance = 0;

lines.forEach((line, index) => {
    // Basic counting
    const divsOpen = (line.match(/<div/g) || []).length;
    const divsClose = (line.match(/<\/div>/g) || []).length;
    divBalance += (divsOpen - divsClose);

    const bracesOpen = (line.match(/\{/g) || []).length;
    const bracesClose = (line.match(/\}/g) || []).length;
    braceBalance += (bracesOpen - bracesClose);

    const parensOpen = (line.match(/\(/g) || []).length;
    const parensClose = (line.match(/\)/g) || []).length;
    parenBalance += (parensOpen - parensClose);

    // Track <main>
    const mainOpen = line.includes('<main') ? 1 : 0;
    const mainClose = line.includes('</main>') ? 1 : 0;

    // Only log anomalies or interesting sections
    if (index > 1850 || line.includes('activeMenu') || line.includes('contentTab')) {
        console.log(`L${index + 1}: DIV:${divBalance} {:${braceBalance} (:${parenBalance} | ${line.trim().substring(0, 40)}`);
    }
});

console.log('\nFINAL BALANCE:');
console.log('DIV:', divBalance);
console.log('BRACE:', braceBalance);
console.log('PAREN:', parenBalance);
