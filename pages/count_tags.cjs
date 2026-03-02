const fs = require('fs');
const content = fs.readFileSync('c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx', 'utf8').split('\n');
const lines = content.slice(948, 1344);
let open = 0;
let close = 0;
lines.forEach((line, i) => {
    const o = (line.match(/<div/g) || []).length;
    const c = (line.match(/<\/div/g) || []).length;
    open += o;
    close += c;
    if (o > 0 || c > 0) {
        console.log(`L${i + 949}: +${o} -${c} | Balance: ${open - close}`);
    }
});
console.log(`Final Open: ${open}, Final Close: ${close}, Balance: ${open - close}`);
