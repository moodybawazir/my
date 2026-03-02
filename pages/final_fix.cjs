const fs = require('fs');
const content = fs.readFileSync('c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx', 'utf8').split('\n');

// 1. Fix Industries (leak of 4 in map + end)
// I'll add the missing divs inside the map by finding the map closure.
for (let i = 1350; i < 1370; i++) {
    if (content[i] && content[i].includes('                            ))}')) {
        console.log(`Fixing Industries map at line ${i + 1}`);
        content[i] = '                          </div></div></div></div>))}';
        break;
    }
}

// 2. Fix the file end balance (was 9)
// I'll add the final closing divs at the very very end of the file.
// The root div(508), main(551), and activeMenu parents.
// Actually, I'll just look for )}; and replace it.
for (let i = 1910; i < content.length; i++) {
    if (content[i] && content[i].includes('};')) {
        console.log(`Fixing file end at line ${i + 1}`);
        content[i] = '</div></div></div></div></div></div></div></div></div>\n  );\n};\nexport default AdminPortal;';
        break;
    }
}

fs.writeFileSync('c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx', content.join('\n'));
console.log('Final fix applied.');
