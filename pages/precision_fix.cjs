const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8').split('\n');

// 1. Fix Industries leak (3 tags)
for (let i = 1350; i < 1370; i++) {
    if (content[i] && content[i].includes('                          ))}')) {
        console.log(`Fixing Industries leak at line ${i + 1}`);
        content[i] = '                          </div></div></div>\n                          ))}';
        break;
    }
}

// 2. Fix Content parent leak (3 tags to return to 1)
// Current end of policies:
// 1395:                     </div>
// 1396:                   )}
// 1397:               </div>
// 1398:             </div>
// 1399:           )}
for (let i = 1390; i < 1410; i++) {
    if (content[i] && content[i].includes('          )}')) {
        // This is exactly what I need.
        console.log(`Fixing Content parent leak at line ${i + 1}`);
        content[i] = '          )}\n      </div>\n    </div>\n  </div>\n)}';
        break;
    }
}

// 3. Final Root fix (return 1 to 0)
// The end of the file currently is:
// 1919: )}
// 1920: </main>
// 1921: </div>
for (let i = 1910; i < content.length; i++) {
    if (content[i] && content[i].includes('      );')) {
        console.log(`Fixing root termination at line ${i + 1}`);
        content[i] = '    </div>\n  );\n};';
        break;
    }
}

fs.writeFileSync(filePath, content.join('\n'));
console.log('Precision fix applied.');
