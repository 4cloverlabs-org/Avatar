import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const trashDir = path.join(process.cwd(), '..', 'results', 'trash');
    if (!fs.existsSync(trashDir)) {
      return NextResponse.json({ success: true, items: [] });
    }

    const items = fs.readdirSync(trashDir);
    const validItems: any[] = [];
    const now = Date.now();

    for (const item of items) {
      // Ignore hidden files like .DS_Store
      if (item.startsWith('.')) continue;

      const itemPath = path.join(trashDir, item);
      const parts = item.split('___');
      
      // Expected format: type___id___timestamp
      if (parts.length === 3) {
        const type = parts[0];
        const originalId = parts[1];
        const timestampStr = parts[2];
        const timestamp = parseInt(timestampStr, 10);

        // Calculate days remaining
        const ageMs = now - timestamp;
        
        if (ageMs >= SEVEN_DAYS_MS) {
          // LAZY CLEANUP: If older than 7 days, delete permanently
          if (fs.statSync(itemPath).isDirectory()) {
            fs.rmSync(itemPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(itemPath);
          }
          console.log(`[Trash] Auto-deleted expired item: ${item}`);
          continue;
        }

        const daysRemaining = Math.ceil((SEVEN_DAYS_MS - ageMs) / (1000 * 60 * 60 * 24));
        
        validItems.push({
          trashId: item,
          type: type === 'avatar' ? 'Avatar' : 'Video',
          originalId,
          deletedAt: new Date(timestamp).toISOString(),
          daysRemaining
        });
      }
    }

    // Sort by most recently deleted first
    validItems.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

    return NextResponse.json({ success: true, items: validItems });
  } catch (error: any) {
    console.error("Trash API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const trashDir = path.join(process.cwd(), '..', 'results', 'trash');
    if (fs.existsSync(trashDir)) {
      // Empty the entire trash directory
      fs.rmSync(trashDir, { recursive: true, force: true });
      fs.mkdirSync(trashDir, { recursive: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Trash API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
