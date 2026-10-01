const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

// Change Chevron colors
content = content.replace(/color="#EEEEEE"/g, 'color="#475569"');

// Change Plus button color
content = content.replace(/color: '#EEEEEE'/g, "color: '#475569'");

// Change Mic/Monitor icon colors
content = content.replace(/color="#64748b"/g, 'color="#475569"');

fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log('Fixed icon colors');
