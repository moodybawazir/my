const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8').split('\n');

// 1. Fix Home (add 1 closure)
const homeEndLine = content.findIndex(l => l.includes('handleSaveData(STORAGE_KEYS.HOME, homeData)'));
if (homeEndLine !== -1) {
    for (let j = homeEndLine; j < homeEndLine + 10; j++) {
        if (content[j].includes(')}')) {
            content[j - 1] = '                    </div>\n                  </div>';
            console.log('Fixed Home');
            break;
        }
    }
}

// 2. Fix About (add 1 closure)
const aboutEndLine = content.findIndex(l => l.includes('handleSaveData(\'about_content\', aboutData)'));
if (aboutEndLine !== -1) {
    for (let j = aboutEndLine; j < aboutEndLine + 10; j++) {
        if (content[j].includes(')}')) {
            content[j - 1] = '                    </div>\n                  </div>';
            console.log('Fixed About');
            break;
        }
    }
}

// 3. Fix Industries (add 4 closures)
// - Package container (1), Sub-service map (1), Sub-service container (1), Glass panel (1)
// I'll add them at the end of the Industries block.
const indEndLine = content.findIndex(l => l.includes('{contentTab === \'policies\' && ('));
if (indEndLine !== -1) {
    console.log('Fixed Industries at line ' + indEndLine);
    content[indEndLine - 1] = '                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>';
}

fs.writeFileSync(filePath, content.join('\n'));
console.log('Precision repair complete.');
