import { serve } from "inngest/next";
import { inngest } from "../../../lib/inngest-client";
import { renderAvatarVideo, fetchTrendingTopics, generateContentStrategy } from "../../../inngest/jobs";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    renderAvatarVideo,
    fetchTrendingTopics,
    generateContentStrategy
  ],
});
