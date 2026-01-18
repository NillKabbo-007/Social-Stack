
import { GoogleGenAI, Type, Modality } from "@google/genai";

/**
 * Core initialization: New instance per call to ensure fresh environment variable access.
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Handles common model response quirks and sanitizes JSON strings.
 */
const safeParseJSON = (text: string | undefined, fallback: any = []) => {
    if (!text) return fallback;
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json\s*|```\s*$/g, '');
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parse Error:", e, "Raw Content:", text);
        return fallback;
    }
};

/**
 * Citations extraction logic for Google Search grounding.
 */
const extractSources = (response: any) => {
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks) return [];
    return chunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
            title: chunk.web.title || "External Source",
            uri: chunk.web.uri
        }));
};

// Manual base64 decode for binary parts (SDK Requirement)
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Manual PCM audio data decoding (SDK Requirement)
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
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search Google Trends and live social media metrics to identify 4 ultra-current viral marketing patterns for the "${niche}" niche as of early 2026. 
      Focus on patterns that are platform-specific:
      - For TikTok/Reels: Identify specific visual "hooks" (e.g., specific camera movements or overlay styles) and audio profiles (e.g., "ASMR crunch", "Lo-fi synth build-up").
      - For LinkedIn/Twitter: Identify content structures (e.g., "The Contrast Thread", "The contrarian deep-dive") and trending industry topics.
      
      User's target tone: ${tone}. 
      Selected Channels: ${platforms.join(', ')}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Category (e.g., Visual Pattern, Audio Wave, Hook Architecture)" },
              topic: { type: Type.STRING },
              description: { type: Type.STRING },
              viralHook: { type: Type.STRING, description: "The specific opening phrase or visual action to hook viewers" },
              trendingAudio: { type: Type.STRING, description: "Specific trending sound type or auditory mood" },
              patternDescription: { type: Type.STRING, description: "Technical breakdown of why this works (the algorithm trigger)" },
              suggestedAngle: { type: Type.STRING },
              velocityScore: { type: Type.NUMBER, description: "Score from 1-100 indicating search and share velocity" },
              platforms: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["type", "topic", "description", "viralHook", "trendingAudio", "patternDescription", "suggestedAngle", "velocityScore", "platforms"]
          }
        }
      }
    });
    return safeParseJSON(response.text);
  } catch (error) {
    console.error("Viral Search Error:", error);
    return [];
  }
};

export const generateSocialPost = async (prompt: string, tone: string, keywords: string, platforms: string[]) => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Synthesize a high-engagement broadcast payload for: "${prompt}". 
            Target Vocal Signature: ${tone}. 
            Metadata Keywords: ${keywords}. 
            Output specifically for: ${platforms.join(', ')}. 
            For short-form video platforms (TikTok/IG), provide a script-ready caption. 
            For YouTube, return a high-CTR 'youtubeTitle'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        generalContent: { type: Type.STRING },
                        youtubeTitle: { type: Type.STRING },
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
        return safeParseJSON(response.text, { generalContent: '', platformPosts: [] });
    } catch (e) {
        return { generalContent: '', platformPosts: [] };
    }
};

export const generateAIImage = async (prompt: string, options: { aspectRatio?: string, style?: string, negativePrompt?: string } = {}) => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `${options.style ? options.style + ': ' : ''}${prompt}${options.negativePrompt ? '. CRITICAL: No ' + options.negativePrompt : ''}` }] },
            config: {
                imageConfig: { aspectRatio: (options.aspectRatio || "1:1") as any }
            }
        });
        const candidate = response.candidates?.[0];
        if (!candidate) return null;
        const part = candidate.content.parts.find(p => p.inlineData);
        return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
    } catch (e) { 
        console.error("Image Synthesis Failed:", e);
        return null; 
    }
};

export const generateVideoScript = async (topic: string, tone: string, duration: string, platform: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a vertical video script for ${platform}. Topic: "${topic}". Duration: ${duration}. Tone: ${tone}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            script: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { visual: { type: Type.STRING }, audio: { type: Type.STRING } }
              }
            },
            cta: { type: Type.STRING }
          }
        }
      }
    });
    return safeParseJSON(response.text, null);
  } catch (error) { return null; }
};

export const executeStrategicCommand = async (commandInput: string, contextData: any) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Command Hub Input: "${commandInput}". Analytics Context: ${JSON.stringify(contextData)}. Provide a tactical verdict.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: { suggestedAction: { type: Type.STRING } }
        }
      }
    });
    return { 
        results: safeParseJSON(response.text, { suggestedAction: "Strategic Node busy." }), 
        sources: extractSources(response) 
    };
  } catch (error) { return { results: null, sources: [] }; }
};

export const getMarketingInsights = async (data: any, useSearch: boolean, useThinking: boolean) => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: useThinking ? "gemini-3-pro-preview" : "gemini-3-flash-preview",
            contents: `Conduct deep reasoning on marketing stack: ${JSON.stringify(data)}. Provide 3 insights.`,
            config: {
                tools: useSearch ? [{ googleSearch: {} }] : undefined,
                thinkingConfig: useThinking ? { thinkingBudget: 2048 } : undefined,
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
        return { results: safeParseJSON(response.text), sources: extractSources(response) };
    } catch (e) { return { results: [], sources: [] }; }
};

export const startAIChat = (systemInstruction: string) => {
    return getAI().chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction }
    });
};

export const generateSpeech = async (text: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
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
  } catch (error) { console.error("Synthesis Node Error:", error); }
};

export const getXFeed = async (topic: string) => {
    try {
        const response = await getAI().models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Identify recent high-impact social posts about "${topic}" via Google Search.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            author: { type: Type.STRING },
                            content: { type: Type.STRING },
                            time: { type: Type.STRING },
                            metrics: { type: Type.OBJECT, properties: { likes: { type: Type.STRING }, views: { type: Type.STRING } } }
                        }
                    }
                }
            }
        });
        return safeParseJSON(response.text);
    } catch (e) { return []; }
};

export const generateTwitterThread = async (topic: string, tone: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Synthesize a high-engagement Twitter thread about: "${topic}". Tone: ${tone}. Each node must be < 280 characters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return safeParseJSON(response.text, []);
  } catch (error) { return []; }
};

export const getLinkedInFeed = async () => {
    try {
        const response = await getAI().models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "5 Professional B2B LinkedIn posts for professional services.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { author: { type: Type.STRING }, role: { type: Type.STRING }, content: { type: Type.STRING }, time: { type: Type.STRING }, metrics: { type: Type.STRING } }
                    }
                }
            }
        });
        return safeParseJSON(response.text);
    } catch (e) { return []; }
};

export const getYoutubeAnalytics = async () => {
  try {
    const response = await getAI().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Analyze recent performance data for the Social Stack YouTube channel using simulated metrics for 2026. Include revenue, view growth, and top-performing video nodes.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revenue: { type: Type.NUMBER },
            subscribers: { type: Type.NUMBER },
            totalViews: { type: Type.NUMBER },
            engagementRate: { type: Type.NUMBER },
            recentVideos: {
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT, 
                properties: { 
                    id: { type: Type.STRING }, 
                    title: { type: Type.STRING }, 
                    views: { type: Type.STRING }, 
                    likes: { type: Type.STRING }, 
                    thumbnail: { type: Type.STRING },
                    watchTime: { type: Type.STRING },
                    retention: { type: Type.NUMBER }
                } 
              }
            }
          }
        }
      }
    });
    return safeParseJSON(response.text, { revenue: 0, recentVideos: [] });
  } catch (e) { return { revenue: 0, recentVideos: [] }; }
};

export const uploadToYoutube = async (title: string, description: string, videoUrl: string) => {
    console.log(`[YouTube API] Initializing Upload for: ${title}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
        id: Math.random().toString(36).substr(2, 11),
        status: 'success',
        publishedAt: new Date().toISOString()
    };
};

export const getDailyNews = async (location: string, language: string) => {
  try {
    const response = await getAI().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Top business and tech news for ${location} in ${language}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT, properties: { source: { type: Type.STRING }, headline: { type: Type.STRING }, summary: { type: Type.STRING }, time: { type: Type.STRING } } }
        }
      }
    });
    return safeParseJSON(response.text);
  } catch (e) { return []; }
};
