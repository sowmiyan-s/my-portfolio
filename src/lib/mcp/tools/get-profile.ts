import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_profile",
  title: "Get Profile",
  description: "Get Sowmiyan S's professional profile: role, location, education, and contact links.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const profile = {
      name: "Sowmiyan S",
      title: "AI Engineer • Full Stack Developer • Founder",
      tagline: "Building intelligent systems that scale.",
      location: "Namakkal, Tamil Nadu, India",
      education: "VSB College of Engineering Technical Campus, Kandampalayam",
      links: {
        portfolio: "https://sowmiyan-s.vercel.app",
        github: "https://github.com/sowmiyan-s",
        resume: "https://drive.google.com/file/d/1NmangaAFo0eGT-KAsZi4VWOm6zI-KPk6/view?usp=sharing",
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: profile,
    };
  },
});
