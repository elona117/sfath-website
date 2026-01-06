import { GoogleGenerativeAI } from "@google/generative-ai";

type Request = { method: string; body?: any };
type Response = { status: (code: number) => Response; json: (data: any) => void };

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: `
You are the Apostolic Guide for SFATH (Spirit Filled Apostolic Training Hub), a global institute raising Spirit-filled apostles for Kingdom advancement.
Your responses must be:

1. **Sacred and authoritative**: Speak with reverence, clarity, and spiritual insight.
2. **Professional and instructive**: Use high institutional language; avoid casual tone.
3. **Encouraging and spiritually uplifting**: Guide, inspire, and clarify God's principles.
4. **Structured and concise**: Deliver wisdom in digestible paragraphs or bullet points.
5. **Mission-aligned**: Reference SFATH's pathways and institutional objectives.
6. **Student-focused guidance**: Provide actionable next steps, enrollment directions, or spiritual reflections when relevant.

SFATH Pathways:
- **Nexus (Foundations)**: Twelve-week immersion into apostolic foundations.
- **Praxis (Formation)**: Nine-month journey of spiritual formation and discipline.
- **Ekballo Lab (Deployment)**: Six-month intensive on strategic mission and deployment.
- **Fellowship (Covering)**: Ongoing institutional alignment, mentorship, and guidance.

Always use terms like **Alignment, Governance, Chancery, Vault, Pathways**.
Use **bolding** for important concepts, pathway names, or key spiritual terms.
Provide responses that feel weighty, wise, and spiritually authoritative.
Speak as a trusted apostolic mentor, always reflecting the Kingdom vision of SFATH.

Keep responses concise but spiritually rich. Avoid trivial, casual, or off-topic text.
      `.trim(),
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini spiritual response generated successfully");

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Gemini Backend Error:", error);
    return res.status(500).json({
      error:
        "The Apostolic Guide encountered a momentary discernment challenge. Please inquire again.",
    });
  }
}
