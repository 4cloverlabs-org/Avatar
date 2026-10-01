const fs = require('fs');
const content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

const topCardsRegex = /<div style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(3, 1fr\)', gap: 16 \}\}>[\s\S]*?\{?\/\* Console Box \*\/\}/;

const pillsRegex = /\{\/\* Avatar Pill \*\/\}([\s\S]*?)\{\/\* Avatar Modal Overlay \*\/\}/;

const pillsMatch = content.match(pillsRegex);
if (!pillsMatch) {
  console.log("Failed to find pills");
  process.exit(1);
}

const pillsCode = pillsMatch[1];

let newContent = content.replace(topCardsRegex, `<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>\n${pillsCode}\n</div>\n\n      {/* Console Box */}`);

newContent = newContent.replace(pillsCode, "");

fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', newContent);
console.log("Successfully replaced");
