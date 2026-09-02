const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'results', 'trash', 'video___gen_1788211658722_out.mp4___1788211658722');
try {
  fs.unlinkSync(target);
  console.log("Deleted successfully");
} catch (e) {
  console.error("Error:", e);
}
