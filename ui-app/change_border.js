const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

// Replace border colors in the cards
content = content.replace(/border: '1px solid #e2e8f0'/g, "border: '1px solid #EEEEEE'");

// Also handle the hover state for the cards which might be #e2e8f0
content = content.replace(/e\.currentTarget\.style\.borderColor = '#e2e8f0'/g, "e.currentTarget.style.borderColor = '#EEEEEE'");

fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log("Updated borders");
