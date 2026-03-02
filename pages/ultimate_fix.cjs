const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the "hack" at the end if it exists
content = content.replace(/<\/div><\/div><\/div><\/div><\/div><\/div><\/div><\/div><\/div>[\s\S]*?export default AdminPortal;/, '');

// Actually, I'll just rebuild the end of the file from a known point.
// Find the Message Square Detail Modal end.
const splitContent = content.split('\n');
let lastGoodLine = -1;
for (let i = splitContent.length - 1; i >= 0; i--) {
    if (splitContent[i].includes('setSelectedMessage(null)')) {
        lastGoodLine = i + 5; // Close the button and its div
        break;
    }
}

if (lastGoodLine !== -1) {
    const newContent = splitContent.slice(0, lastGoodLine + 1);
    newContent.push('            )}'); // Close selectedMessage
    newContent.push('          </main>');
    newContent.push('        </div>');
    newContent.push('      );');
    newContent.push('};');
    newContent.push('export default AdminPortal;');
    content = newContent.join('\n');
}

// 2. Fix the Industries leak (4 tags)
// I'll search for the map closure.
content = content.replace(/(\s+)\}\)\)\}/, '$1  </div></div></div></div>$1  }))}');

// 3. Fix Home leak (1 tag)
content = content.replace(/(\s+)handleSaveData\(STORAGE_KEYS\.HOME, homeData\)([\s\S]*?)\n(\s+)\}\)/, '$1handleSaveData(STORAGE_KEYS.HOME, homeData)$2\n$3  </div>\n$3})');

// 4. Fix Content parent leak (2 tags + closure)
// This is trickier. I'll just add them after policies.
content = content.replace(/contentTab === 'policies' && \([\s\S]*?\}\)/, (match) => match + '\n              </div>\n            </div>\n          )}');

fs.writeFileSync(filePath, content);
console.log('Ultimate fix applied.');
