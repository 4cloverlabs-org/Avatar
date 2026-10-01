const fs = require('fs');
let content = fs.readFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', 'utf8');

// Replace top container padding
content = content.replace(
  "padding: '32px 32px 0 32px'",
  "padding: '16px 16px 0 16px'"
);

// Replace card wrapper margin
content = content.replace(
  "{/* YOUR LATEST PROJECTS section */}\n      <div style={{ marginBottom: 20 }}>",
  "{/* YOUR LATEST PROJECTS section */}\n      <div style={{ marginBottom: 16 }}>"
);

// Replace text box negative margins
content = content.replace(
  "marginBottom: 0,\n        marginLeft: -32,\n        marginRight: -32,",
  "marginBottom: 0,\n        marginLeft: -16,\n        marginRight: -16,"
);

fs.writeFileSync('/Users/sohith/Desktop/Avatar/ui-app/src/app/(dashboard)/dashboard/page.tsx', content);
console.log('Fixed padding');
