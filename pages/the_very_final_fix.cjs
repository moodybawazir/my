const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8').split('\n');

// 1. Fix Content leak (2 tags)
for (let i = 0; i < content.length; i++) {
    if (content[i].includes(' activeMenu === \'invoices\' && (')) {
        console.log(`Fixing Content leak before line ${i + 1}`);
        content[i - 3] = '            </div>\n          </div>\n        </div>';
        break;
    }
}

// 2. Fix root leak (3 tags)
for (let i = content.length - 1; i > 0; i--) {
    if (content[i].includes('export default AdminPortal;')) {
        console.log(`Fixing Root leak at line ${i + 1}`);
        content[i - 1] = '      </main>\n    </div>\n  );\n};\n';
        break;
    }
}

fs.writeFileSync(filePath, content.join('\n'));
console.log('Very final fix applied.');
