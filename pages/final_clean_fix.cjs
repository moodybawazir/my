const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8').split('\n');

// 1. Home tab fix (776-823)
for (let i = 810; i < 840; i++) {
    if (content[i] && content[i].includes('                  </div>') && content[i + 1] && content[i + 1].includes('                )}')) {
        console.log(`Fixing Home tab at line ${i + 1}`);
        content[i] = '                    </div>\n                  </div>';
        break;
    }
}

// 2. Industries sub-tab fix (1000-1297)
// Fix package container (1122)
for (let i = 1285; i < 1300; i++) {
    if (content[i] && content[i].includes('                                </div>') && content[i + 1] && content[i + 1].includes('                            )}')) {
        console.log(`Fixing Industries package container at line ${i + 1}`);
        content[i] = '                                </div>\n                              </div>';
        break;
    }
}

// Fix glass panel (981)
for (let i = 1290; i < 1305; i++) {
    if (content[i] && content[i].includes('                      ))}')) {
        console.log(`Fixing Industries glass panel at line ${i + 1}`);
        content[i] = '                        </div>\n                      ))}';
        break;
    }
}

// 3. Content parent fix (748-1333)
// Fix glass (775) and space-y-16 (749)
for (let i = 1320; i < 1340; i++) {
    if (content[i] && content[i].includes('            </div>') && content[i + 1] && content[i + 1].includes('          </div>') && content[i + 2] && content[i + 2].includes('        )}')) {
        console.log(`Fixing Content parent containers at line ${i + 1}`);
        content[i] = '                </div>\n              </div>\n            </div>';
        break;
    }
}

fs.writeFileSync(filePath, content.join('\n'));
console.log('Zero balance fix applied.');
