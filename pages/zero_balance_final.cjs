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

// 1. Fix Home (776-864)
let homeBlock = content.slice(0, 864);
let balHome = getBalance(homeBlock);
console.log('Balance at 864: ' + balHome);
if (balHome > 1) {
    let diff = balHome - 1;
    content[863] = '</div>'.repeat(diff) + '\n                )}';
}

// 2. Fix About (864-969)
let aboutBlock = content.slice(0, 969);
let balAbout = getBalance(aboutBlock);
console.log('Balance at 969: ' + balAbout);
if (balAbout > 1) {
    let diff = balAbout - 1;
    content[967] = '</div>'.repeat(diff) + '\n                </div>';
}

// 3. Fix Industries (1001-1304)
// I'll just find the line before policies and zero it out to 1.
let indEnd = content.findIndex(l => l.includes('{contentTab === \'policies\' && ('));
let indBlock = content.slice(0, indEnd);
let balInd = getBalance(indBlock);
console.log('Balance at Industries End: ' + balInd);
if (balInd > 1) {
    let diff = balInd - 1;
    content[indEnd - 1] = '</div>'.repeat(diff) + '\n              )}';
}

fs.writeFileSync(filePath, content.join('\n'));
console.log('Zero balance final applied.');
