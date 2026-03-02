const fs = require('fs');
const content = fs.readFileSync('AdminPortal.tsx', 'utf8');
const lines = content.split('\n');

let divBalance = 0;
let braceBalance = 0;
let parenBalance = 0;

lines.forEach((line, index) => {
    const divsOpen = (line.match(/<div/g) || []).length;
    const divsClose = (line.match(/<\/div>/g) || []).length;
    divBalance += (divsOpen - divsClose);

    const bracesOpen = (line.match(/\{/g) || []).length;
    const bracesClose = (line.match(/\}/g) || []).length;
    braceBalance += (bracesOpen - bracesClose);

    const parensOpen = (line.match(/\(/g) || []).length;
    const parensClose = (line.match(/\)/g) || []).length;
    parenBalance += (parensOpen - parensClose);

    if (line.includes('contentTab ===') || line.includes('activeMenu ===') || index > 1330) {
        console.log(`L${index + 1}: DIV:${divBalance} {:${braceBalance} (:${parenBalance} | ${line.trim().substring(0, 40)}`);
    }
});

console.log('\nFINAL BALANCE:');
console.log('DIV:', divBalance);
console.log('BRACE:', braceBalance);
console.log('PAREN:', parenBalance);
