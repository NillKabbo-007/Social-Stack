
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Audio playback helper
async function playAudio(base64String: string) {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    } catch (e) {
        console.error("Audio playback error", e);
    }
}

/**
 * Robust JSON parser that handles common AI response issues like markdown wrapping
 * and truncation at high token counts.
 */
const safeParseJSON = (text: string | undefined, fallback: any = []) => {
    if (!text) return fallback;
    let cleaned = text.trim();
    
    // Remove markdown code blocks if present (standard pattern for LLMs)
    cleaned = cleaned.replace(/^```json\s*|```\s*$/g, '');
    
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        // Attempt to repair truncated JSON by balancing braces and brackets
        // This handles cases where maxOutputTokens is reached mid-string.
        try {
            let attempt = cleaned;
            const openBraces = (attempt.match(/\{/g) || []).length;
            const closeBraces = (attempt.match(/\}/g) || []).length;
            const openBrackets = (attempt.match(/\[/g) || []).length;
            const closeBrackets = (attempt.match(/\]/g) || []).length;

            if (openBrackets > closeBrackets) attempt += ']'.repeat(openBrackets - closeBrackets);
            if (openBraces > closeBraces) attempt += '}'.repeat(openBraces - closeBraces);
            
            return JSON.parse(attempt);
        } catch (e2) {
            // Log as warning rather than error to avoid noise when fallbacks are intentional
            console.warn("AI returned malformed or truncated JSON. Using fallback storage.", { original: text, error: e2 });
            return fallback;
        }
    }
};

// --- Mock Data Generators for Fallbacks ---
const getMockXFeed = () => [
    { author: "Elon Musk", handle: "@elonmusk", verified: true, content: "AI is moving faster than anyone realizes. Grok 2.0 coming soon.", time: "2h ago", metrics: { likes: "142k", retweets: "12k", replies: "8k", views: "12M" } },
    { author: "TechCrunch", handle: "@TechCrunch", verified: true, content: "BREAKING: New social media regulations proposed in EU affecting algorithm transparency.", time: "4h ago", metrics: { likes: "1.2k", retweets: "450", replies: "120", views: "500k" } },
    { author: "Marketing Dive", handle: "@MarketingDive", verified: true, content: "5 trends shaping Q4 ad spend: Video is king, but static images are making a comeback.", time: "5h ago", metrics: { likes: "890", retweets: "210", replies: "45", views: "120k" } },
    { author: "Sam Altman", handle: "@sama", verified: true, content: "AGI will be the greatest marketing tool ever created.", time: "12h ago", metrics: { likes: "25k", retweets: "3k", replies: "1.5k", views: "2.1M" } },
    { author: "Growth Hacker", handle: "@GrowthHacker", verified: false, content: "Stop overcomplicating your funnel. Traffic -> Offer -> Convert. That's it.", time: "1d ago", metrics: { likes: "450", retweets: "80", replies: "22", views: "45k" } }
];

export const generateViralSuggestions = async (niche: string, tone: string, platforms: string[] = []) => {
  try {
    const ai = getAI();
    const platformContext = platforms.length > 0 ? `Target Platforms: ${platforms.join(', ')}` : "Target Platforms: All major social platforms (TikTok, Instagram, YouTube, LinkedIn, X)";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      Role: Viral Content Strategist.
      Task: Generate 3 high-potential content ideas for the topic: "${niche}".
      Settings: Tone: ${tone}. ${platformContext}.

      Output JSON with the following schema for each item:
      - type: "Google Trend" | "Viral Pattern" | "Smart Angle"
      - topic: The specific trend or subject.
      - description: Brief context.
      - viralHook: Actionable instruction.
      - suggestedAngle: The specific content idea.
      - platformContext: Specific advice for the selected platforms.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 4096, // Increased to prevent truncation
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              topic: { type: Type.STRING },
              description: { type: Type.STRING },
              viralHook: { type: Type.STRING },
              suggestedAngle: { type: Type.STRING },
              platformContext: { type: Type.STRING }
            },
            required: ["type", "topic", "description", "viralHook", "suggestedAngle", "platformContext"]
          }
        }
      }
    });
    return safeParseJSON(response.text);
  } catch (error: any) {
    console.error("Viral Suggestions Error:", error);
    return [];
  }
};

export const generateTwitterThread = async (topic: string, tone: string) => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Create a viral Twitter/X thread about: "${topic}". Tone: ${tone}.
            Format as JSON array of strings. Each string is one tweet.
            Ensure the first tweet is a strong hook. Max 280 chars per tweet.`,
            config: {
                maxOutputTokens: 4096,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return safeParseJSON(response.text);
    } catch (e) {
        console.error("Thread gen error", e);
        return [];
    }
};

export const executeStrategicCommand = async (commandInput: string, contextData: any) => {
  const ai = getAI();
  const schema = {
        type: Type.OBJECT,
        properties: {
            marketShift: { type: Type.STRING },
            tacticalPivot: { type: Type.STRING },
            expectedOutcome: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
        },
        required: ["marketShift", "tacticalPivot", "expectedOutcome", "suggestedAction"]
    };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        Analyze this user command: "${commandInput}"
        Context Data (ROI and Platforms): ${JSON.stringify(contextData)}
        Provide a strategic response with a market shift analysis, a tactical pivot suggestion, an expected outcome, and a next step action.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const results = safeParseJSON(response.text, {});
    
    return { results, sources };
  } catch (error: any) {
    console.error("Command Error:", error);
    return { results: null, sources: [] };
  }
};

export const getDailyNews = async (location: string = 'Global', language: string = 'English') => {
    const ai = getAI();
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                summary: { type: Type.STRING },
                impact: { type: Type.STRING },
                source: { type: Type.STRING },
                time: { type: Type.STRING }
            },
            required: ["headline", "summary", "impact", "source", "time"]
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Find the top 5 most important marketing/tech/AI news stories from the last 24h for location: ${location}. Language: ${language}. Summarize them in JSON.`,
            config: {
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 4096,
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        return safeParseJSON(response.text);
    } catch (error: any) {
        console.error("News Error:", error);
        return [];
    }
};

export const getXFeed = async (topic: string = 'Marketing Trends') => {
    const ai = getAI();
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                author: { type: Type.STRING },
                handle: { type: Type.STRING },
                verified: { type: Type.BOOLEAN },
                content: { type: Type.STRING },
                time: { type: Type.STRING },
                metrics: { 
                    type: Type.OBJECT,
                    properties: {
                        likes: { type: Type.STRING },
                        retweets: { type: Type.STRING },
                        replies: { type: Type.STRING },
                        views: { type: Type.STRING }
                    }
                }
            },
            required: ["author", "handle", "content", "time"]
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Search for high-impact X (Twitter) conversations about: "${topic}". Return the top 5 in JSON format.`,
            config: {
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 4096,
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        return safeParseJSON(response.text, getMockXFeed());
    } catch (error: any) {
        console.error("X Feed Error:", error);
        return getMockXFeed();
    }
};

export const getLinkedInFeed = async () => {
     try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Generate 3 simulated professional LinkedIn posts about B2B marketing. Return JSON format.",
            config: {
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            author: { type: Type.STRING },
                            role: { type: Type.STRING },
                            content: { type: Type.STRING },
                            time: { type: Type.STRING },
                            metrics: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return safeParseJSON(response.text);
    } catch (error) {
        return [];
    }
};

export const generateSocialPost = async (prompt: string, tone: string, keywords: string, platforms: string[]) => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Create social media content for: "${prompt}". Tone: ${tone}. Keywords: ${keywords}. Platforms: ${platforms.join(', ')}. Return structured JSON.`,
            config: {
                maxOutputTokens: 4096,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        generalContent: { type: Type.STRING },
                        platformPosts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    platformId: { type: Type.STRING },
                                    content: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return safeParseJSON(response.text, {});
    } catch (e) {
        console.error("Gen Post Error", e);
        return { generalContent: '', platformPosts: [] };
    }
};

export const generateAIImage = async (prompt: string, options: { aspectRatio?: string, style?: string, negativePrompt?: string, seed?: number } = {}) => {
    try {
        const ai = getAI();
        let finalPrompt = prompt;
        if (options.style && options.style !== 'None') finalPrompt = `${options.style} style image of ${finalPrompt}`;
        if (options.negativePrompt) finalPrompt += `. Do NOT include: ${options.negativePrompt}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: finalPrompt }] },
            config: {
                imageConfig: { aspectRatio: (options.aspectRatio || "1:1") as any },
                seed: options.seed
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        return null;
    } catch (e) {
        console.error("Image gen error", e);
        return null;
    }
};

export const getTrendingTopics = async (niche: string) => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Find 3 trending topics for ${niche} right now. Return JSON.`,
            config: {
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: { type: Type.STRING },
                            reason: { type: Type.STRING },
                            angle: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return safeParseJSON(response.text);
    } catch (e: any) { 
        return []; 
    }
};

export const getMarketingInsights = async (data: any, useSearch: boolean, useThinking: boolean) => {
    try {
        const ai = getAI();
        const tools = useSearch ? [{ googleSearch: {} }] : undefined;
        const thinkingConfig = useThinking ? { thinkingConfig: { thinkingBudget: 2048 } } : undefined;
        
        const response = await ai.models.generateContent({
            model: useThinking ? "gemini-3-pro-preview" : "gemini-3-flash-preview",
            contents: `Analyze marketing data and provide 3 strategic insights in JSON format. Data: ${JSON.stringify(data)}.`,
            config: {
                tools,
                ...thinkingConfig,
                maxOutputTokens: 4096,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING },
                            title: { type: Type.STRING },
                            insight: { type: Type.STRING },
                            action: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const results = safeParseJSON(response.text);
        return { results, sources };
    } catch (e: any) {
        return { results: [], sources: [] };
    }
};

export const generateSpeech = async (text: string) => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) await playAudio(base64Audio);
    } catch (e) {
        console.error("TTS error", e);
    }
};

export const startAIChat = (systemInstruction: string) => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction }
    });
};

export const getImportableContent = async (platformId: string) => {
    const mockData = [
        { id: 'p1', platform: 'twitter', content: 'Just launched our new summer collection! 🌞 #SummerVibes', media: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400', type: 'image', date: '2 days ago', engagement: 'High' },
        { id: 'p2', platform: 'linkedin', content: 'Excited to announce our Series B funding round...', media: null, type: 'text', date: '1 week ago', engagement: 'Medium' },
        { id: 'p3', platform: 'instagram', content: 'Behind the scenes at our annual retreat...', media: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400', type: 'image', date: '3 days ago', engagement: 'Very High' },
        { id: 'p4', platform: 'tiktok', content: '5 tips for better productivity...', media: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400', type: 'video', date: 'Yesterday', engagement: 'High' },
        { id: 'p5', platform: 'facebook', content: 'Join our webinar tomorrow at 2 PM EST...', media: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400', type: 'image', date: '5 days ago', engagement: 'Low' }
    ];
    return new Promise((resolve) => setTimeout(() => resolve(mockData), 800));
};
