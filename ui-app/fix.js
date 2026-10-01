const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

const pillsRegex = /\{\/\* Avatar Pill \*\/\}([\s\S]*?)\{\/\* Avatar Modal Overlay \*\/\}/;

const match = content.match(pillsRegex);
if (!match) process.exit(1);

const pillsCode = match[0];
content = content.replace(pillsCode, "{/* Avatar Modal Overlay */}");

const topSpot = /<div style=\{\{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' \}\}>\s*<\/div>/;

content = content.replace(topSpot, `<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>\n${pillsCode.replace("{/* Avatar Modal Overlay */}", "")}\n</div>`);

fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log("Fixed!");
