import { serve } from "inngest/next";
import { inngest } from "../../../lib/inngest-client";
import { renderAvatarVideo } from "../../../inngest/jobs";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    renderAvatarVideo
  ],
});
