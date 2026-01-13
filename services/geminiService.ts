
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

const safeParseJSON = (text: string | undefined, fallback: any = []) => {
    if (!text) return fallback;
    try {
        return JSON.parse(text);
    } catch (e) {
        try {
            // Attempt to clean markdown code blocks if present
            const cleaned = text.replace(/```json\n?|```/g, '').trim();
            return JSON.parse(cleaned);
        } catch (e2) {
            console.error("Failed to parse JSON:", e2);
            return fallback;
        }
    }
};

// --- Mock Data Generators for Fallbacks ---
const getMockXFeed = () => [
    { author: "Elon Musk", handle: "@elonmusk", verified: true, content: "AI is moving faster than anyone realizes. Grok 2.0 coming soon.", time: "2h ago", metrics: { likes: "142k", retweets: "12k", replies: "8k", views: "12M" } },
    { author: "TechCrunch", handle: "@TechCrunch", verified: true, content: "BREAKING: New social media regulations proposed in EU affecting algorithm transparency.", time: "4h ago", metrics: { likes: "1.2k", retweets: "450", replies: "120", views: "500k" } },
    { author: "Marketing Dive", handle: "@MarketingDive", verified: true, content: "5 trends shaping Q4 ad spend: Video is king, but static images are making a comeback for conversion.", time: "5h ago", metrics: { likes: "890", retweets: "210", replies: "45", views: "120k" } },
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

      STEPS:
      1. **SEARCH**: Use Google Search to find the absolute latest trends (past 24h) for "${niche}" on Google Trends, TikTok Creative Center, and Instagram Reels Trends. Look for breakout queries and viral sounds.
      2. **ANALYZE**: Identify a specific viral pattern (e.g., specific audio, visual transition, or challenge) currently trending.
      3. **SYNTHESIZE**: Create 3 suggestions.
         - One based on a **Google Trend** (News/Search volume).
         - One based on a **Viral Pattern** (Audio/Visual format).
         - One based on a **Smart Angle** (Contrarian or Educational).

      Output JSON with the following schema for each item:
      - type: "Google Trend" | "Viral Pattern" | "Smart Angle"
      - topic: The specific trend or subject.
      - description: Brief context on why it's trending or valuable.
      - viralHook: Actionable instruction (e.g., "Use 'Spooky Scary Skeletons' audio", "Start with 'Stop doing X'").
      - suggestedAngle: The specific content idea/script angle.
      - platformContext: Specific advice for the selected platforms.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 2000,
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
    // Fallback if search quota exceeded
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('Quota exceeded')) {
        try {
            const ai = getAI();
            const fallbackResponse = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Generate 3 high-potential viral content ideas for: "${niche}". Tone: ${tone}.
                Return JSON with type, topic, description, viralHook, suggestedAngle, platformContext.`,
                config: { responseMimeType: "application/json", maxOutputTokens: 2000 }
            });
             return safeParseJSON(fallbackResponse.text); 
        } catch(e) { return []; }
    }
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
            Ensure the first tweet is a strong hook.
            Max 280 chars per tweet. Include hashtags in the last tweet.`,
            config: {
                maxOutputTokens: 2000,
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
        }
    };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        Analyze this user command: "${commandInput}"
        Context Data (ROI and Platforms): ${JSON.stringify(contextData)}
        
        Provide a strategic response with a market shift analysis, a tactical pivot suggestion, an expected outcome, and a specific next step action.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const results = safeParseJSON(response.text, {});
    
    return { results, sources };
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('Quota exceeded')) {
        try {
            const fallbackResponse = await ai.models.generateContent({
                model: "gemini-3-flash-preview", // Use flash for fallback
                contents: `Analyze this command: "${commandInput}". Provide strategic response with marketShift, tacticalPivot, expectedOutcome, suggestedAction.`,
                config: { responseMimeType: "application/json", responseSchema: schema, maxOutputTokens: 1000 }
            });
            return { results: safeParseJSON(fallbackResponse.text, {}), sources: [] };
        } catch(e) { return { results: null, sources: [] }; }
    }
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
                time: { type: Type.STRING, description: "e.g. '2 hours ago'" }
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Find the top 5 most important marketing, tech, AI, or business news stories from the last 24 hours specifically for location: ${location}. 
            Translate the content to language: ${language} if necessary.
            Summarize them with a punchy headline, brief summary (max 2 sentences), impact level (High/Medium), and a specific reputable source name.`,
            config: {
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 2000,
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        return safeParseJSON(response.text);
    } catch (error: any) {
        if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('Quota exceeded')) {
             console.warn("Search quota exceeded for News, falling back to simulation.");
             try {
                 const fallbackResponse = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: `Generate 5 plausible real-world style marketing/tech news headlines for ${location}. 
                    Based on general current trends (AI, Social Media, Tech).
                    Return JSON with headline, summary, impact, source, time.`,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: schema,
                        maxOutputTokens: 2000
                    }
                });
                return safeParseJSON(fallbackResponse.text);
             } catch (e) { return []; }
        }
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
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
            You are a social media trend monitoring agent connected to the X (Twitter) firehose via search.
            GOAL: Retrieve the 5 most relevant, recent, and high-impact X/Twitter conversations related to: "${topic}".
            Focus on QUALITY and RELEVANCE to "${topic}".
            `,
            config: {
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 2000,
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        return safeParseJSON(response.text);
    } catch (error: any) {
        // Robust fallback for Quota Limits
        if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('Quota exceeded')) {
             console.warn("Search quota exceeded for X Feed, using static fallback.");
             return getMockXFeed();
        }
        console.error("X Feed Error:", error);
        return getMockXFeed();
    }
};

export const getLinkedInFeed = async () => {
     try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Generate 3 simulated professional LinkedIn posts about B2B marketing or leadership. Include author, role, time, content, and metrics.",
            config: {
                maxOutputTokens: 2000,
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
            contents: `
            Task: Create unified social media post content based on the prompt: "${prompt}".
            Tone: ${tone}. 
            Keywords: ${keywords}.
            
            1. Create a "General Content" master version suitable for all networks.
            2. Create specific optimized variations for these platforms: ${platforms.join(', ')}.
            3. For X (Twitter), provide a condensed tweet version with hashtags and a strong hook.
            
            Output JSON with:
            - generalContent: string
            - platformPosts: array of objects { platformId: string, content: string }
            `,
            config: {
                maxOutputTokens: 2000,
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
        
        if (options.style && options.style !== 'None') {
            finalPrompt = `${options.style} style image of ${finalPrompt}. `;
        }
        
        if (options.negativePrompt) {
            finalPrompt += ` Do NOT include: ${options.negativePrompt}.`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: finalPrompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: (options.aspectRatio || "1:1") as any
                },
                seed: options.seed
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Image gen error", e);
        return null;
    }
};

export const getTrendingTopics = async (niche: string) => {
    const ai = getAI();
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                topic: { type: Type.STRING },
                reason: { type: Type.STRING },
                angle: { type: Type.STRING }
            }
        }
    };
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Find 3 top trending topics related to ${niche} right now.`,
            config: {
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 1000,
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        return safeParseJSON(response.text);
    } catch (e: any) { 
        if (e?.message?.includes('429') || e?.status === 'RESOURCE_EXHAUSTED' || e?.message?.includes('Quota exceeded')) {
             try {
                 const fallback = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: `Generate 3 trending topics related to ${niche} based on general knowledge.`,
                    config: { responseMimeType: "application/json", responseSchema: schema, maxOutputTokens: 1000 }
                 });
                 return safeParseJSON(fallback.text);
             } catch { return []; }
        }
        return []; 
    }
};

export const getMarketingInsights = async (data: any, useSearch: boolean, useThinking: boolean) => {
    try {
        const ai = getAI();
        const tools = useSearch ? [{ googleSearch: {} }] : undefined;
        // Thinking disabled by default to save tokens if not explicitly needed, or handle if model doesn't support it
        const thinkingConfig = useThinking ? { thinkingConfig: { thinkingBudget: 2048 } } : undefined;
        
        const response = await ai.models.generateContent({
            model: useThinking ? "gemini-3-pro-preview" : "gemini-3-flash-preview",
            contents: `Analyze this marketing data and provide 3 strategic insights. Data: ${JSON.stringify(data)}. 
            If search is enabled, look for external factors affecting these metrics.
            Return JSON with category, title, insight, and action.`,
            config: {
                tools,
                ...thinkingConfig,
                maxOutputTokens: 2000,
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
        if (e?.message?.includes('429') || e?.status === 'RESOURCE_EXHAUSTED' || e?.message?.includes('Quota exceeded')) {
             // Return fallback insights
             return { results: [
                 { category: "System Note", title: "API Limit Reached", insight: "The AI reasoning engine is currently at capacity.", action: "Please try again in a few moments." }
             ], sources: [] };
        }
        console.error(e);
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
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            await playAudio(base64Audio);
        }
    } catch (e) {
        console.error("TTS error", e);
    }
};

export const startAIChat = (systemInstruction: string) => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction
        }
    });
};

export const getImportableContent = async (platformId: string) => {
    // Mock data based on platform to simulate fetching from APIs
    const mockData = [
        { id: 'p1', platform: 'twitter', content: 'Just launched our new summer collection! 🌞 #SummerVibes', media: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400', type: 'image', date: '2 days ago', engagement: 'High' },
        { id: 'p2', platform: 'linkedin', content: 'Excited to announce our Series B funding round led by TechVentures. This milestone allows us to scale...', media: null, type: 'text', date: '1 week ago', engagement: 'Medium' },
        { id: 'p3', platform: 'instagram', content: 'Behind the scenes at our annual retreat. Team building at its finest! 🏔️', media: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400', type: 'image', date: '3 days ago', engagement: 'Very High' },
        { id: 'p4', platform: 'tiktok', content: '5 tips for better productivity you need to know today.', media: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400', type: 'video', date: 'Yesterday', engagement: 'High' },
        { id: 'p5', platform: 'facebook', content: 'Join our webinar tomorrow at 2 PM EST. We will be discussing the future of AI in marketing.', media: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400', type: 'image', date: '5 days ago', engagement: 'Low' }
    ];
    
    return new Promise((resolve) => setTimeout(() => resolve(mockData), 800));
};
