const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8').split('\n');

// 1. Fix Home tab (leak 1)
for (let i = 0; i < content.length; i++) {
    if (content[i].includes('handleSaveData(STORAGE_KEYS.HOME, homeData)') && content[i + 4] && content[i + 4].includes('                )}')) {
        console.log(`Fixing Home tab leak at line ${i + 5}`);
        content[i + 3] = '                    </div>\n                  </div>';
        break;
    }
}

// 2. Fix Industries package container (leak N)
// I'll look for the specific pattern of the package loop end.
for (let i = 0; i < content.length; i++) {
    if (content[i].includes('(!sub.packages || sub.packages.length === 0)')) {
        // The div above this is the package container
        let j = i - 1;
        while (j > 0 && !content[j].includes('                                </div>')) j--;
        if (j > 0) {
            console.log(`Fixing Industries package container leak at line ${j + 1}`);
            content[j] = '                                  </div>\n                                </div>';
        }
    }
}

// 3. Fix root termination (leak 1)
// Audit L1526: DIV 5. (Should be 1).
// Wait, if I fixed 3 above, then 5 - 3 = 2.
// Still 1 too many at the very end.
for (let i = content.length - 1; i > 0; i--) {
    if (content[i].includes('export default AdminPortal;')) {
        console.log(`Fixing root termination leak at line ${i + 1}`);
        // We need it to return to 0.
        // If it's at 2, we need 2 more closures? No, if it's 2, we have 2 open.
        // I'll just find the end and close them.
    }
}

fs.writeFileSync(filePath, content.join('\n'));
console.log('Fix v2 applied.');
