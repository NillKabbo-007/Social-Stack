
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const generateVideoScript = async (topic: string, tone: string, duration: string, platform: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a highly engaging video script for ${platform} (Short-form vertical video).
      Topic: "${topic}"
      Tone: ${tone}
      Target Duration: ${duration}
      Format:
      - Title: Catchy Title
      - Hook: Grab attention immediately (0-3s).
      - Scenes: Breakdown of visual and audio track.
      - CTA: Clear instruction.
      `,
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
                properties: {
                  section: { type: Type.STRING },
                  visual: { type: Type.STRING },
                  audio: { type: Type.STRING }
                }
              }
            },
            cta: { type: Type.STRING }
          }
        }
      }
    });
    return safeParseJSON(response.text);
  } catch (error) {
    console.error("Script Gen Error", error);
    return null;
  }
};

export const executeStrategicCommand = async (commandInput: string, contextData: any) => {
  const ai = getAI();
  try {
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
    const ai = getAI();
    try {
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
    const ai = getAI();
    return ai.chats.create({
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

export const getLinkedInFeed = async () => {
  const ai = getAI();
  try {
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

export const getYoutubeAnalytics = async () => {
  const ai = getAI();
  try {
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

export const getDailyNews = async (location: string, language: string) => {
  const ai = getAI();
  try {
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
