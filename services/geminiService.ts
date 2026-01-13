
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getApiKey = () =>
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY ||
  process.env.VITE_GEMINI_API_KEY ||
  process.env.VITE_API_KEY;

const hasApiKey = () => Boolean(getApiKey());

const getAI = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing Gemini API key.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Robust JSON parser that handles common AI response issues
 */
const safeParseJSON = (text: string | undefined, fallback: any = []) => {
    if (!text) return fallback;
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json\s*|```\s*$/g, '');
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        return fallback;
    }
};

// Manual base64 decode as per coding guidelines
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Manual audio data decoding for raw PCM streams as per coding guidelines
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateViralSuggestions = async (niche: string, tone: string, platforms: string[] = []) => {
  try {
    if (!hasApiKey()) {
      return [
        {
          type: "Trend Pulse",
          topic: `${niche} quick-win hooks`,
          description: `Share 3 scroll-stopping ${tone.toLowerCase()} hooks tailored to ${niche}.`,
          viralHook: "Use a 5-second reveal + bold stat to spike watch time.",
          suggestedAngle: "Show the before/after in the first frame.",
          platforms: platforms.length ? platforms : ["Instagram", "TikTok", "YouTube Shorts"]
        },
        {
          type: "Community Spark",
          topic: `${niche} audience challenges`,
          description: "Turn a common pain point into a short challenge series.",
          viralHook: "Invite the audience to duet/stitch with their attempt.",
          suggestedAngle: "Offer a micro-reward + highlight the best entry.",
          platforms: platforms.length ? platforms : ["X", "Instagram", "TikTok"]
        },
        {
          type: "Authority Clip",
          topic: `${niche} myth busting`,
          description: "Break a popular myth with a punchy visual proof.",
          viralHook: "Start with a contrarian statement and back it with data.",
          suggestedAngle: "Use a graph overlay + fast captions.",
          platforms: platforms.length ? platforms : ["LinkedIn", "YouTube"]
        }
      ];
    }
    const ai = getAI();
    const platformList = platforms.length > 0 ? platforms.join(', ') : "All major Social Platforms";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      Role: Viral Content Strategist.
      Task: Provide 3 ultra-current content suggestions for: "${niche}".
      Target Platforms: ${platformList}.
      Tone: ${tone}.
      1. SEARCH: Look for real-time spikes in Google Trends.
      2. SEARCH: Identify viral hooks on TikTok.
      3. SYNTHESIZE: Create actionable ideas.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 2048,
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
              platforms: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["type", "topic", "description", "viralHook", "suggestedAngle", "platforms"]
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

export const generateSocialPost = async (prompt: string, tone: string, keywords: string, platforms: string[]) => {
    try {
        if (!hasApiKey()) {
            const platformPosts = platforms.length
                ? platforms.map((platformId) => ({
                    platformId,
                    content: `${prompt} — ${tone} mode. Keywords: ${keywords || 'growth, insights, momentum'}.`,
                    metadata: { title: `${platformId} spotlight`, tags: keywords || 'growth,insights' }
                }))
                : [];
            return {
                generalContent: `${prompt} — ${tone}. Highlight the core value and finish with a CTA.`,
                platformPosts
            };
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Create social content for: "${prompt}". Tone: ${tone}. Keywords: ${keywords}. Platforms: ${platforms.join(', ')}.`,
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
                                    content: { type: Type.STRING },
                                    metadata: { 
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING },
                                            tags: { type: Type.STRING }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return safeParseJSON(response.text, {});
    } catch (e) {
        return { generalContent: '', platformPosts: [] };
    }
};

export const generateAIImage = async (prompt: string, options: { aspectRatio?: string, style?: string, negativePrompt?: string, seed?: number } = {}) => {
    try {
        if (!hasApiKey()) {
          const ratio = options.aspectRatio || "1:1";
          const [widthRatio, heightRatio] = ratio.split(':').map(Number);
          const base = 512;
          const width = Math.max(1, Math.round(base * (widthRatio / Math.max(1, heightRatio))));
          const height = Math.max(1, Math.round(base * (heightRatio / Math.max(1, widthRatio))));
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="#e2e8f0">AI Preview</text><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="#94a3b8">${prompt.replace(/</g, '&lt;')}</text></svg>`;
          return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        }
        const ai = getAI();
        let finalPrompt = prompt;
        // Inject style and negative constraints into the prompt for the model
        if (options.style && options.style !== 'Standard') {
          finalPrompt = `Artistic Style: ${options.style}. Subject: ${finalPrompt}`;
        }
        if (options.negativePrompt) {
          finalPrompt += `. CRITICAL: Do NOT include: ${options.negativePrompt}`;
        }

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
      console.error("AI Image Generation Failed", e);
      return null; 
    }
};

export const executeStrategicCommand = async (commandInput: string, contextData: any) => {
  try {
    if (!hasApiKey()) {
      return {
        results: {
          suggestedAction: `Focus on ${commandInput} with a 7-day experiment and track top KPIs from context.`
        },
        sources: []
      };
    }
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `User Command: "${commandInput}". Context: ${JSON.stringify(contextData)}. Provide a strategic pivot.`,
      config: {
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                suggestedAction: { type: Type.STRING }
            }
        }
      }
    });
    return { results: safeParseJSON(response.text, {}), sources: [] };
  } catch (error) {
    return { results: null, sources: [] };
  }
};

export const getXFeed = async (topic: string = 'Marketing') => {
    try {
        if (!hasApiKey()) {
            return [
                {
                    author: "SocialStackHQ",
                    content: `Hot take: ${topic} wins when you repurpose one idea across 5 formats.`,
                    time: "2m ago",
                    metrics: { likes: "1.2K", views: "18.4K" }
                },
                {
                    author: "GrowthOps",
                    content: `Thread: 3 ways to sharpen ${topic} CTAs without sounding salesy.`,
                    time: "9m ago",
                    metrics: { likes: "842", views: "11.3K" }
                }
            ];
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `High-impact social posts about: "${topic}".`,
            config: {
                tools: [{ googleSearch: {} }],
                maxOutputTokens: 1024,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            author: { type: Type.STRING },
                            content: { type: Type.STRING },
                            time: { type: Type.STRING },
                            metrics: { 
                                type: Type.OBJECT,
                                properties: { likes: { type: Type.STRING }, views: { type: Type.STRING } }
                            }
                        }
                    }
                }
            }
        });
        return safeParseJSON(response.text);
    } catch (error) { return []; }
};

export const getMarketingInsights = async (data: any, useSearch: boolean, useThinking: boolean) => {
    try {
        if (!hasApiKey()) {
            return {
                results: [
                    {
                        category: "Channel Mix",
                        title: "Balance paid and organic bursts",
                        insight: "Paid spikes are tapering after 48 hours—pair them with community content.",
                        action: "Launch a 3-day organic series to extend lift."
                    },
                    {
                        category: "Creative",
                        title: "Lead with proof",
                        insight: "Top posts include a stat or quote in the first line.",
                        action: "Test 2 stat-led variants in the next campaign."
                    },
                    {
                        category: "Timing",
                        title: "Mid-week lift",
                        insight: "Engagement peaks Tues–Thurs between 10am–1pm.",
                        action: "Shift 60% of scheduling into those windows."
                    }
                ],
                sources: []
            };
        }
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: useThinking ? "gemini-3-pro-preview" : "gemini-3-flash-preview",
            contents: `Analyze marketing data: ${JSON.stringify(data)}. Return 3 strategic insights.`,
            config: {
                tools: useSearch ? [{ googleSearch: {} }] : undefined,
                thinkingConfig: useThinking ? { thinkingBudget: 2048 } : undefined,
                maxOutputTokens: 2048,
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
        return { results: safeParseJSON(response.text), sources: [] };
    } catch (e) { return { results: [], sources: [] }; }
};

export const startAIChat = (systemInstruction: string) => {
    if (!hasApiKey()) {
        return {
            sendMessageStream: async function* ({ message }: { message: string }) {
                const response = `Quick tip: For "${message}", start with a hook, add proof, and finish with a clear CTA.`;
                const chunks = response.match(/.{1,48}/g) || [response];
                for (const chunk of chunks) {
                    await new Promise(resolve => setTimeout(resolve, 40));
                    yield { text: chunk };
                }
            }
        };
    }
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction }
    });
};

// Fix: Implemented generateSpeech for text-to-speech tasks
export const generateSpeech = async (text: string) => {
  try {
    if (!hasApiKey()) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
      return;
    }
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
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("Speech Generation Error:", error);
  }
};

// Fix: Implemented getLinkedInFeed for professional content simulation
export const getLinkedInFeed = async () => {
  try {
    if (!hasApiKey()) {
      return [
        {
          author: "Ava Singh",
          role: "Growth Lead, Nimbus",
          content: "We cut CAC by 18% by tightening our onboarding emails to 3 steps. Simple wins compound fast.",
          time: "1h",
          metrics: "1,234 reactions"
        },
        {
          author: "Marco Li",
          role: "Founder, Lensify",
          content: "Tip: Swap vanity metrics for pipeline metrics in weekly standups.",
          time: "3h",
          metrics: "842 reactions"
        },
        {
          author: "Priya Rao",
          role: "Marketing Ops",
          content: "Your demand gen dashboard should show time-to-value, not just clicks.",
          time: "5h",
          metrics: "510 reactions"
        }
      ];
    }
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 professional LinkedIn posts about SaaS marketing and growth.",
      config: {
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
  } catch (error) { return []; }
};

// Fix: Implemented getYoutubeAnalytics for simulated channel metrics
export const getYoutubeAnalytics = async () => {
  try {
    if (!hasApiKey()) {
      return {
        revenue: 1842.55,
        recentVideos: [
          {
            id: "demo-1",
            title: "How to script viral short-form ads",
            views: "42.1K",
            likes: "3.8K",
            thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"
          },
          {
            id: "demo-2",
            title: "Marketing dashboard teardown",
            views: "30.7K",
            likes: "2.4K",
            thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=600"
          }
        ]
      };
    }
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Simulate a YouTube channel's analytics data including revenue and recent videos.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revenue: { type: Type.NUMBER },
            recentVideos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  views: { type: Type.STRING },
                  likes: { type: Type.STRING },
                  thumbnail: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return safeParseJSON(response.text, { revenue: 0, recentVideos: [] });
  } catch (error) { return { revenue: 0, recentVideos: [] }; }
};

// Fix: Implemented getDailyNews using search grounding
export const getDailyNews = async (location: string, language: string) => {
  try {
    if (!hasApiKey()) {
      return [
        {
          source: "Global Marketing Daily",
          headline: `${location} brands lean into short-form video in ${language}.`,
          summary: "Marketers are prioritizing faster creative cycles and vertical-first assets.",
          time: "Today"
        },
        {
          source: "Commerce Pulse",
          headline: "New affiliate disclosure rules roll out",
          summary: "Platforms now require clearer affiliate tag labeling in promotions.",
          time: "Today"
        }
      ];
    }
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for daily marketing and business news in ${location} in ${language}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING },
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              time: { type: Type.STRING }
            }
          }
        }
      }
    });
    return safeParseJSON(response.text);
  } catch (error) { return []; }
};
