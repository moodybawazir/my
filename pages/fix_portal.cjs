const fs = require('fs');
const content = fs.readFileSync('c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx', 'utf8').split('\n');

// Fix Home sub-tab (Line 823 in the version I saw earlier)
// Find the exact line "                )}" for about/policies
// Home ends at about line 823.
// I'll search for the line around 823 that says "                )}"
for (let i = 810; i < 830; i++) {
    if (content[i] && content[i].includes('                )}')) {
        console.log(`Fixing Home at line ${i + 1}`);
        content[i] = '                    </div>\n                  </div>\n                )}';
        break;
    }
}

// Fix Content parent (Line 1393 in the version I saw earlier)
for (let i = 1380; i < 1400; i++) {
    if (content[i] && content[i].includes('                  )}')) {
        console.log(`Fixing Content parent at line ${i + 1}`);
        content[i] = '                  )}\n              </div>\n            </div>\n          )}';
        break;
    }
}

fs.writeFileSync('c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx', content.join('\n'));
console.log('Fixed structural issues.');
