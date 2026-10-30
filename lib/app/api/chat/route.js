import { GoogleGenAI } from "@google/genai";
import { routeMode } from "@/lib/route-mode";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const modelByMode = {
  fast: process.env.GEMINI_FAST_MODEL,
  deep: process.env.GEMINI_DEEP_MODEL,
  vision: process.env.GEMINI_VISION_MODEL,
};

export async function POST(request) {
  try {
    const body = await request.json();

    const message = String(body.message || "").trim();
    const selectedMode = body.mode || "auto";
    const hasFile = Boolean(body.hasFile);
    const hasImage = Boolean(body.hasImage);

    if (!message) {
      return Response.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    const mode = routeMode({
      selectedMode,
      message,
      hasFile,
      hasImage,
    });

    const model = modelByMode[mode];

    if (!model) {
      return Response.json(
        { error: `No Gemini model configured for ${mode} mode.` },
        { status: 500 }
      );
    }

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
      config: {
        systemInstruction: `
You are Nexora AI.

Current operating mode: ${mode}

Rules:
- Answer clearly and accurately.
- Match the user's language.
- Do not claim that you used a tool unless you actually used it.
- If information is uncertain, say so.
- For complex tasks, organize the answer into practical steps.
        `,
        temperature: mode === "fast" ? 0.5 : 0.25,
        maxOutputTokens: mode === "deep" ? 3500 : 1200,
      },
    });

    return Response.json({
      text: response.text || "No response generated.",
      mode,
      model,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "The Gemini neural engine is temporarily unavailable. Check your model, API key, or quota.",
      },
      { status: 500 }
    );
  }
}
