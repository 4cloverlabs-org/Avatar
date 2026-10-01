const fs = require('fs');
const filePath = '/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all occurrences of #94a3b8 with #EEEEEE
content = content.replace(/#94a3b8/g, '#EEEEEE');

fs.writeFileSync(filePath, content);
console.log('Replaced icon colors');
