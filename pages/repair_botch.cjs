const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8').split('\n');

// Botched block starts around 1388
const startLine = 1387; // index 1387 is line 1388
const endLine = 1402;   // index 1401 is line 1402

const correctBlock = [
    '                        <button onClick={() => handleSaveData(\'privacy_policy\', { title: \'سياسة الخصوصية والاستخدام\', text: privacyPolicy })} className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-luxury text-sm">',
    '                          حفظ سياسة الخصوصية',
    '                        </button>',
    '                        <button onClick={() => handleSaveData(\'refund_policy\', { title: \'سياسة الاسترجاع\', text: refundPolicy })} className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-luxury text-sm">',
    '                          حفظ سياسة الاسترجاع',
    '                        </button>',
    '                      </div>',
    '                    </div>',
    '                  )}',
    '              </div>',
    '            </div>',
    '          )}'
];

content.splice(startLine, (endLine - startLine + 1), ...correctBlock);

// Also fix the Industries map end which might also be botched
for (let i = 0; i < content.length; i++) {
    if (content[i].includes('                          </div></div></div></div>')) {
        console.log(`Cleaning up Industries map hack at line ${i + 1}`);
        content[i] = '                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  ))}';
    }
}

// Final cleanup of the end of the file
const lastLine = content.length - 1;
if (content[lastLine].includes('export default AdminPortal;')) {
    // Ensure we have exactly root and main closures
    // Count total tags up to here? No, just look for the termination pattern.
}

fs.writeFileSync(filePath, content.join('\n'));
console.log('Botched fix repaired.');
