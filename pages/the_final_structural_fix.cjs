const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8').split('\n');

function getBalance(lines) {
    let div = 0;
    for (const line of lines) {
        div += (line.match(/<div(\s|>|$)/g) || []).length;
        div -= (line.match(/<\/div>/g) || []).length;
    }
    return div;
}

// Target: Root (1) + Main (1) = 2.
// We want it to be 2 before 'Messages' (1528).
let msgLine = content.findIndex(l => l.includes(' activeMenu === \'messages\' && ('));
if (msgLine !== -1) {
    let currentBal = getBalance(content.slice(0, msgLine));
    console.log('Balance before Messages: ' + currentBal);
    if (currentBal > 2) {
        let diff = currentBal - 2;
        content[msgLine - 1] = '</div>'.repeat(diff) + '\n        ' + content[msgLine - 1];
        console.log(`Added ${diff} closures.`);
    }
}

// Target: At very end: 0.
let finalBal = getBalance(content);
console.log('Final Balance: ' + finalBal);
if (finalBal > 0) {
    let diff = finalBal;
    content[content.length - 1] = content[content.length - 1] + '\n' + '</div>'.repeat(diff);
    console.log(`Added ${diff} final closures.`);
}

fs.writeFileSync(filePath, content.join('\n'));
console.log('Final structural fix applied.');
