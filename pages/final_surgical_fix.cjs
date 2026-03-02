const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Clean up the botched Policies/Content end (L1394-L1400 range)
// I'll replace the redundant closures with the correct ones.
// I'll look for the specific pattern I created.
content = content.replace(/<\/div>\s+<\/div>\s+<\/div>\s+\)\}/g, ')}');
content = content.replace(/<\/div>\s+<\/div>\s+\)\}\s+<\/div>\s+<\/div>\s+\)\}/g, '</div></div></div>)}');

// 2. Count current balance
function count(str, pat) {
    return (str.match(new RegExp(pat, 'g')) || []).length;
}

const openDivs = count(content, '<div');
const closeDivs = count(content, '</div');
const openBraces = count(content, '{');
const closeBraces = count(content, '}');
const openParens = count(content, '\\(');
const closeParens = count(content, '\\)');

console.log(`Initial Counts: DIV:${openDivs - closeDivs}, {:${openBraces - closeBraces}, (:${openParens - closeParens}`);

// 3. Fix the end of the file based on the counts
// I'll remove all my previous hacks at the end.
content = content.replace(/<\/div>[\s\S]*?export default AdminPortal;/, 'REPLACE_ME_END');

let currentBalanceDiv = count(content.replace('REPLACE_ME_END', ''), '<div') - count(content.replace('REPLACE_ME_END', ''), '</div');
let currentBalanceBrace = count(content.replace('REPLACE_ME_END', ''), '{') - count(content.replace('REPLACE_ME_END', ''), '}');
let currentBalanceParen = count(content.replace('REPLACE_ME_END', ''), '\\(') - count(content.replace('REPLACE_ME_END', ''), '\\)');

let finalClosures = '';
for (let i = 0; i < currentBalanceDiv; i++) finalClosures += '</div>\n';
for (let i = 0; i < currentBalanceBrace; i++) finalClosures += '}\n';
for (let i = 0; i < currentBalanceParen; i++) finalClosures += ')\n';

content = content.replace('REPLACE_ME_END', finalClosures + '\n);\n};\nexport default AdminPortal;');

fs.writeFileSync(filePath, content);
console.log('Final surgical fix applied.');
const finalContent = fs.readFileSync(filePath, 'utf8');
console.log(`Final Counts: DIV:${count(finalContent, '<div') - count(finalContent, '</div')}, {:${count(finalContent, '{') - count(finalContent, '}')}, (:${count(finalContent, '\\(') - count(finalContent, '\\)')}`);
