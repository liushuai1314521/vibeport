import { GoogleGenAI, Type } from "@google/genai";
import mql from "@microlink/mql";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function polishIdeaStory(rawStory: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a world-class product storyteller. Refine the following product idea story to make it more inspiring, authentic, and "builder-centric". Keep it concise but impactful. Use a "cool but warm" tone.
    
    Raw Story: ${rawStory}`,
    config: {
      temperature: 0.7,
    },
  });
  return response.text;
}

export async function extractMetadataFromMicrolink(url: string) {
  const { data } = await mql(url, { meta: true });
  const tags: string[] = [];
  if (data.author) tags.push(data.author);
  if (data.publisher) tags.push(data.publisher);
  if (data.lang) tags.push(data.lang);
  const coverImage = data.image?.url || data.logo?.url || data.screenshot?.url || "";
  const description = data.description || "";
  return {
    name: data.title || "",
    tagline: description,
    description: description,
    tags,
    cover_image: coverImage,
  };
}

export async function extractMetadata(url: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are a product discovery expert. Analyze the website at this URL: ${url}.
    
    Extract and refine the following information to make it compelling for a product discovery platform:
    1. Product Name: The official name of the product.
    2. Tagline: A catchy, one-line value proposition (max 10 words).
    3. Description: A clear, engaging summary of what it does and why it's cool (max 30 words).
    4. Tags: 3-5 relevant industry or technology tags (e.g., "AI", "SaaS", "Open Source").
    5. Cover Image: Find a representative image URL if possible (e.g., from og:image or main hero). If not found, return an empty string.
    
    Use the provided URL context and Google Search to find the most accurate and up-to-date information.
    
    Return as JSON.`,
      config: {
        tools: [{ urlContext: {} }, { googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tagline: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            cover_image: { type: Type.STRING },
          },
          required: ["name", "tagline", "description", "tags", "cover_image"],
        },
      },
    });
    return JSON.parse(response.text);
  } catch {
    return extractMetadataFromMicrolink(url);
  }
}
