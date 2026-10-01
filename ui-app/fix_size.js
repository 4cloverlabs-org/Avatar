const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

// Replace grid with flex
content = content.replace(
  "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>",
  "<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>"
);

// Reduce padding and icon size
content = content.replace(/padding: '12px 16px'/g, "padding: '6px 12px'");
content = content.replace(/width: 32, height: 32/g, "width: 24, height: 24");
content = content.replace(/fontSize: 15/g, "fontSize: 13");
content = content.replace(/<ChevronDown size=\{16\}/g, "<ChevronDown size={14}");
content = content.replace(/<User size=\{16\}/g, "<User size={12}");
content = content.replace(/<Mic size=\{16\}/g, "<Mic size={12}");
content = content.replace(/<Monitor size=\{16\}/g, "<Monitor size={12}");
content = content.replace(/<Smartphone size=\{16\}/g, "<Smartphone size={12}");
content = content.replace(/<Square size=\{16\}/g, "<Square size={12}");

// Reduce space-between gap inside the card
// Let's add a fixed gap between text and chevron instead of having them stretch all the way to the ends
content = content.replace(
  /justifyContent: 'space-between'/g,
  "justifyContent: 'flex-start', gap: '8px'"
);

fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log('Fixed size');
