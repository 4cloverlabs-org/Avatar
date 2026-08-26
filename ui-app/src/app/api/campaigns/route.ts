import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { campaign } from '../../../db/schema';
import { auth } from '../../../lib/auth';
import { headers } from 'next/headers';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch campaigns with their leads
    const userCampaigns = await db.query.campaign.findMany({
      where: eq(campaign.userId, session.user.id),
      with: {
        leads: true
      },
      orderBy: [desc(campaign.createdAt)]
    });

    const formattedCampaigns = userCampaigns.map(c => {
      const totalGenerated = c.leads.filter(l => l.status === 'Ready').length;
      
      const delivered = c.leads.filter(l => l.deliveredAt).length;
      const viewed = c.leads.filter(l => l.viewedAt).length;
      const clicked = c.leads.filter(l => l.clickedAt).length;

      const deliveryRate = totalGenerated > 0 ? (delivered / totalGenerated) * 100 : 0;
      const viewRate = delivered > 0 ? (viewed / delivered) * 100 : 0;
      const ctr = viewed > 0 ? (clicked / viewed) * 100 : 0;

      return {
        id: c.id,
        name: c.name,
        totalGenerated,
        deliveryRate: parseFloat(deliveryRate.toFixed(1)),
        viewRate: parseFloat(viewRate.toFixed(1)),
        ctr: parseFloat(ctr.toFixed(1)),
      };
    });

    return NextResponse.json({ success: true, campaigns: formattedCampaigns });
  } catch (error: any) {
    console.error("GET /api/campaigns error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
