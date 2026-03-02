const fs = require('fs');
const filePath = 'c:/Users/VIP/Downloads/B.U.I.L.D/BUILD-Master-System/baseerah-ai-saas-platform/pages/AdminPortal.tsx';
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

function getLineBalance(line) {
    let div = (line.match(/<div(\s|>|$)/g) || []).length;
    div -= (line.match(/<\/div>/g) || []).length;
    return div;
}

let currentDiv = 0;
let output = [];

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    currentDiv += getLineBalance(line);
    output.push(line);

    // 1. Home end (Check for Save Home button then next )}
    if (line.includes('handleSaveData(STORAGE_KEYS.HOME, homeData)')) {
        while (i + 1 < lines.length && !lines[i + 1].includes(')}')) {
            i++;
            line = lines[i];
            currentDiv += getLineBalance(line);
            output.push(line);
        }
        if (i + 1 < lines.length && lines[i + 1].includes(')}')) {
            // Target balance for tab end: 4 (Root + Main + Content + Child)
            while (currentDiv > 4) {
                output.push('                  </div>');
                currentDiv--;
            }
            while (currentDiv < 4) {
                // (Shouldn't happen, but for safety)
                output.pop();
                currentDiv++;
            }
        }
    }

    // 2. About end
    if (line.includes('handleSaveData(\'about_content\', aboutData)')) {
        while (i + 1 < lines.length && !lines[i + 1].includes(')}')) {
            i++;
            line = lines[i];
            currentDiv += getLineBalance(line);
            output.push(line);
        }
        if (i + 1 < lines.length && lines[i + 1].includes(')}')) {
            while (currentDiv > 4) {
                output.push('                  </div>');
                currentDiv--;
            }
        }
    }

    // 3. Industries end
    if (line.includes('contentTab === \'industries\' && (')) {
        while (i + 1 < lines.length && !lines[i + 1].includes('contentTab === \'policies\'')) {
            i++;
            line = lines[i];
            currentDiv += getLineBalance(line);
            output.push(line);
        }
        if (i + 1 < lines.length && lines[i + 1].includes('contentTab === \'policies\'')) {
            // Correcting indices (go back to the closure before policies)
            let lastIdx = output.length - 1;
            while (lastIdx > 0 && !output[lastIdx].includes(')}')) lastIdx--;
            if (lastIdx > 0) {
                // Re-calculate balance up to lastIdx
                // Actually, I'll just force the balance before 'policies' tab starts.
                while (currentDiv > 4) {
                    output.splice(lastIdx, 0, '                </div>');
                    currentDiv--;
                }
            }
        }
    }
}

// Final cleanup of the whole file at the end
// Root 1, Main 1.
// After Content ends (1337 area) -> 2.
// After Messages ends (1596 area) -> 1.
// At L1763 area -> 0.

fs.writeFileSync(filePath, output.join('\n'));
console.log('Ultimate balancer complete.');
