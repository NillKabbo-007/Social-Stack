
import React, { useState, useMemo } from 'react';
import { PLATFORMS } from '../constants';
import { generateViralSuggestions, generateSocialPost, generateAIImage, getImportableContent } from '../services/geminiService';
import { MediaItem } from '../types';

interface BulkPublisherProps {
  mediaLibrary: MediaItem[];
  onUpdateLibrary: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

interface QueueItem {
  id: string;
  content: string;
  platforms: string[];
  status: 'Draft' | 'Scheduled' | 'Published';
  scheduledTime: string;
  mediaUrl?: string;
}

const PROMPT_SUGGESTIONS = [
  { label: 'Product Launch', text: 'Create a high-energy post announcing our new eco-friendly water bottle. Focus on sustainability and design.' },
  { label: 'Flash Sale', text: 'Urgent flash sale alert! 50% off for the next 24 hours only. Use code FLASH50.' },
  { label: 'Educational', text: '5 tips to improve your productivity working from home.' },
  { label: 'Behind the Scenes', text: 'A sneak peek into our design process for the upcoming collection.' },
  { label: 'Customer Love', text: 'Sharing a heartfelt testimonial from one of our top users.' }
];

const ART_STYLES = [
    'None', 'Photorealistic', 'Cinematic', 'Anime', 'Digital Art', 
    'Oil Painting', 'Cyberpunk', 'Minimalist', '3D Render', 'Vintage',
    'Watercolor', 'Pixel Art', 'Pop Art', 'Sketch', 'Neon', 'Isometric',
    'Surrealism', 'Fantasy', 'Cybernetic', 'Steampunk', 'Abstract',
    'Studio Ghibli', 'Vaporwave', 'Noir', 'Low Poly', 'Origami'
];

const ASPECT_RATIOS = ['1:1', '9:16', '16:9', '4:3', '3:4'];

// Helper to highlight hashtags and mentions
const RichText = ({ text, className = "", highlightColor = "text-[#1d9bf0]" }: { text: string, className?: string, highlightColor?: string }) => {
    if (!text) return null;
    const parts = text.split(/(\s+)/);
    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('#') || part.startsWith('@')) {
                    return <span key={i} className={highlightColor}>{part}</span>;
                }
                return part;
            })}
        </span>
    );
};

const PlatformPreview = ({ post, media }: { post: any, media: MediaItem | null }) => {
    const [metaTab, setMetaTab] = useState<'fb' | 'ig'>('fb');
    const isVideo = media?.type === 'video';
    
    // X (Twitter) Style
    if (post.platformId === 'twitter' || post.platformId === 'x') {
        const charCount = post.content?.length || 0;
        const isOverLimit = charCount > 280;

        return (
            <div className="bg-black text-white p-4 rounded-xl border border-slate-800 font-sans w-full max-w-[400px] mx-auto shadow-2xl relative overflow-hidden">
                {/* X Logo Watermark */}
                <div className="absolute top-4 right-4 text-slate-800 opacity-20 text-4xl pointer-events-none">
                    <i className="fa-brands fa-x-twitter"></i>
                </div>

                <div className="flex gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 border border-slate-600 overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=Brand&background=random" className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 truncate text-[15px]">
                                <span className="font-bold text-slate-100">Your Brand</span>
                                <i className="fa-solid fa-certificate text-[#1d9bf0] text-[12px]"></i>
                                <span className="text-slate-500 text-[14px] ml-1">@yourbrand · 1m</span>
                            </div>
                            <i className="fa-solid fa-ellipsis text-slate-500 text-sm"></i>
                        </div>
                        <div className="mt-1 text-[15px] whitespace-pre-wrap leading-normal text-slate-100">
                            <RichText text={post.content} />
                        </div>
                        
                        {/* Character Count Indicator */}
                        <div className={`text-[10px] font-bold mt-2 flex justify-end ${isOverLimit ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`}>
                            <span>{charCount}/280</span>
                        </div>

                        {media && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 relative">
                                {isVideo ? (
                                    <video src={media.url} className="w-full h-auto max-h-[300px] object-cover" controls />
                                ) : (
                                    <img src={media.url} className="w-full h-auto object-cover max-h-[300px]" alt="Post media" />
                                )}
                            </div>
                        )}
                        <div className="flex justify-between mt-3 text-slate-500 text-[13px] pr-4 pt-1">
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0] transition-colors"><i className="fa-regular fa-comment p-2 rounded-full group-hover:bg-[#1d9bf0]/10"></i> 12</div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#00ba7c] transition-colors"><i className="fa-solid fa-retweet p-2 rounded-full group-hover:bg-[#00ba7c]/10"></i> 4</div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#f91880] transition-colors"><i className="fa-regular fa-heart p-2 rounded-full group-hover:bg-[#f91880]/10"></i> 89</div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0] transition-colors"><i className="fa-solid fa-chart-simple p-2 rounded-full group-hover:bg-[#1d9bf0]/10"></i> 1.2k</div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0] transition-colors"><i className="fa-solid fa-arrow-up-from-bracket p-2 rounded-full group-hover:bg-[#1d9bf0]/10"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Meta (FB & IG) Style
    if (post.platformId === 'meta') {
        return (
            <div className="flex flex-col gap-4 max-w-[400px] mx-auto w-full">
                <div className="flex bg-slate-800/50 p-1 rounded-xl self-center mb-1 border border-slate-700/50">
                    <button onClick={() => setMetaTab('fb')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${metaTab === 'fb' ? 'bg-[#1877F2] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                        <i className="fa-brands fa-facebook"></i> Facebook
                    </button>
                    <button onClick={() => setMetaTab('ig')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${metaTab === 'ig' ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                        <i className="fa-brands fa-instagram"></i> Instagram
                    </button>
                </div>

                {metaTab === 'fb' ? (
                    <div className="bg-white dark:bg-[#242526] text-[#050505] dark:text-[#E4E6EB] rounded-xl border border-slate-200 dark:border-slate-700/50 font-sans shadow-2xl overflow-hidden relative">
                        <div className="p-3 flex gap-2 items-start">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 border border-slate-100 dark:border-slate-600 overflow-hidden relative">
                                <img src="https://ui-avatars.com/api/?name=Brand&background=random" className="w-full h-full object-cover" alt="Avatar" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1877F2] border-2 border-white dark:border-[#242526] rounded-full flex items-center justify-center text-[6px] text-white">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-[15px] leading-tight">Your Brand</p>
                                <div className="text-[12px] text-[#65676B] dark:text-[#B0B3B8] flex items-center gap-1">
                                    <span>Just now</span> · <i className="fa-solid fa-earth-americas text-[10px]"></i>
                                </div>
                            </div>
                            <i className="fa-solid fa-ellipsis text-[#65676B] dark:text-[#B0B3B8] p-2"></i>
                        </div>
                        <div className="px-3 pb-3 text-[15px] whitespace-pre-wrap font-normal leading-normal">
                            <RichText text={post.content} highlightColor="text-[#1877F2] font-semibold" />
                        </div>
                        {media && (
                            <div className="w-full bg-black relative">
                                {isVideo ? (
                                    <video src={media.url} className="w-full max-h-[400px] object-contain" controls />
                                ) : (
                                    <img src={media.url} className="w-full h-auto object-cover" alt="Post media" />
                                )}
                            </div>
                        )}
                        <div className="px-3 py-2">
                            <div className="flex justify-between items-center text-[#65676B] dark:text-[#B0B3B8] text-[13px] py-2">
                                <div className="flex items-center gap-1">
                                    <div className="flex -space-x-1">
                                        <div className="w-4 h-4 bg-[#1877F2] rounded-full flex items-center justify-center text-[8px] text-white ring-1 ring-white dark:ring-[#242526]"><i className="fa-solid fa-thumbs-up"></i></div>
                                        <div className="w-4 h-4 bg-[#F02849] rounded-full flex items-center justify-center text-[8px] text-white ring-1 ring-white dark:ring-[#242526]"><i className="fa-solid fa-heart"></i></div>
                                    </div>
                                    <span className="hover:underline cursor-pointer ml-1">42</span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="hover:underline cursor-pointer">5 Comments</span>
                                    <span className="hover:underline cursor-pointer">1 Share</span>
                                </div>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-[#CED0D4] dark:border-[#3E4042]">
                                <button className="flex-1 flex items-center justify-center gap-2 text-[#65676B] dark:text-[#B0B3B8] font-semibold text-[14px] hover:bg-slate-100 dark:hover:bg-[#3A3B3C] rounded py-1.5 transition-colors"><i className="fa-regular fa-thumbs-up"></i> Like</button>
                                <button className="flex-1 flex items-center justify-center gap-2 text-[#65676B] dark:text-[#B0B3B8] font-semibold text-[14px] hover:bg-slate-100 dark:hover:bg-[#3A3B3C] rounded py-1.5 transition-colors"><i className="fa-regular fa-message"></i> Comment</button>
                                <button className="flex-1 flex items-center justify-center gap-2 text-[#65676B] dark:text-[#B0B3B8] font-semibold text-[14px] hover:bg-slate-100 dark:hover:bg-[#3A3B3C] rounded py-1.5 transition-colors"><i className="fa-solid fa-share"></i> Share</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-black text-black dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 font-sans shadow-2xl overflow-hidden relative">
                        <div className="p-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-black border-2 border-transparent relative overflow-hidden">
                                        <img src="https://ui-avatars.com/api/?name=Brand&background=random" className="w-full h-full object-cover" alt="Avatar" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[13px] font-semibold block leading-none">yourbrand</span>
                                    {media && <span className="text-[10px] text-slate-500 dark:text-slate-400">Original Audio</span>}
                                </div>
                            </div>
                            <i className="fa-solid fa-ellipsis"></i>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                            {media ? (
                                isVideo ? (
                                    <video src={media.url} className="w-full h-auto max-h-[450px] object-cover" controls />
                                ) : (
                                    <img src={media.url} className="w-full h-auto object-cover" alt="Post media" />
                                )
                            ) : (
                                <div className="w-full aspect-square flex items-center justify-center text-slate-400 text-xs bg-slate-100 dark:bg-slate-900">No Media</div>
                            )}
                        </div>
                        <div className="p-3">
                            <div className="flex justify-between items-center text-[22px] mb-3">
                                <div className="flex gap-4">
                                    <i className="fa-regular fa-heart hover:text-slate-500 cursor-pointer transition-transform active:scale-90"></i>
                                    <i className="fa-regular fa-comment hover:text-slate-500 cursor-pointer transition-transform active:scale-90"></i>
                                    <i className="fa-regular fa-paper-plane hover:text-slate-500 cursor-pointer transition-transform active:scale-90"></i>
                                </div>
                                <i className="fa-regular fa-bookmark hover:text-slate-500 cursor-pointer transition-transform active:scale-90"></i>
                            </div>
                            <p className="text-[13px] font-semibold mb-2">1,248 likes</p>
                            <div className="text-[13px]">
                                <span className="font-semibold mr-1">yourbrand</span>
                                <RichText text={post.content} className="whitespace-pre-wrap" highlightColor="text-[#00376B] dark:text-[#E0F1FF]" />
                            </div>
                            <p className="text-[13px] text-slate-500 mt-1 cursor-pointer">View all 12 comments</p>
                            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">2 HOURS AGO</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // LinkedIn Style
    if (post.platformId === 'linkedin') {
        return (
            <div className="bg-white dark:bg-[#1b273d] max-w-[400px] mx-auto w-full rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xl overflow-hidden font-sans">
                <div className="p-3 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-start">
                    <div className="flex gap-2">
                        <div className="w-12 h-12 rounded bg-slate-200 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Brand&background=random" className="w-full h-full object-cover" alt="Avatar" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Your Brand</p>
                            <p className="text-[11px] text-slate-500">12,450 followers</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">1h • <i className="fa-solid fa-earth-americas"></i></p>
                        </div>
                    </div>
                    <i className="fa-solid fa-ellipsis text-slate-500"></i>
                </div>
                <div className="p-3 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    <RichText text={post.content} highlightColor="text-[#0A66C2] font-semibold" />
                </div>
                {media && (
                    <div className="w-full bg-slate-100 dark:bg-black">
                        {isVideo ? (
                            <video src={media.url} className="w-full h-auto object-cover max-h-[400px]" controls />
                        ) : (
                            <img src={media.url} className="w-full h-auto object-cover" alt="Post media" />
                        )}
                    </div>
                )}
                <div className="px-3 py-2 flex items-center gap-2 text-[11px] text-slate-500 border-b border-slate-100 dark:border-slate-700/50">
                    <i className="fa-solid fa-thumbs-up text-[#0A66C2]"></i>
                    <i className="fa-solid fa-heart text-[#df704d]"></i>
                    <span className="hover:text-[#0A66C2] hover:underline cursor-pointer">148</span>
                    <span className="ml-auto hover:text-[#0A66C2] hover:underline cursor-pointer">12 comments • 4 reposts</span>
                </div>
                <div className="flex justify-between px-2 py-1">
                    <button className="flex items-center gap-2 px-3 py-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 font-semibold text-xs transition-colors"><i className="fa-regular fa-thumbs-up text-lg"></i> Like</button>
                    <button className="flex items-center gap-2 px-3 py-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 font-semibold text-xs transition-colors"><i className="fa-regular fa-comment-dots text-lg"></i> Comment</button>
                    <button className="flex items-center gap-2 px-3 py-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 font-semibold text-xs transition-colors"><i className="fa-solid fa-retweet text-lg"></i> Repost</button>
                    <button className="flex items-center gap-2 px-3 py-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 font-semibold text-xs transition-colors"><i className="fa-solid fa-paper-plane text-lg"></i> Send</button>
                </div>
            </div>
        );
    }

    // TikTok Style
    if (post.platformId === 'tiktok') {
        return (
            <div className="bg-black text-white max-w-[300px] mx-auto w-full h-[550px] rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden font-sans">
                {/* Simulated Content Layer */}
                <div className="absolute inset-0 bg-slate-900">
                    {media ? (
                        isVideo ? (
                            <video src={media.url} className="w-full h-full object-cover" autoPlay muted loop />
                        ) : (
                            <img src={media.url} className="w-full h-full object-cover" alt="Post media" />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 flex-col gap-2">
                            <i className="fa-brands fa-tiktok text-4xl"></i>
                            <span className="text-xs font-bold uppercase">No Media</span>
                        </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                {/* Right Actions */}
                <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4 z-10">
                    <div className="w-10 h-10 rounded-full border border-white overflow-hidden bg-slate-800 mb-2">
                        <img src="https://ui-avatars.com/api/?name=Brand&background=random" className="w-full h-full object-cover" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><i className="fa-solid fa-plus text-white"></i></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <i className="fa-solid fa-heart text-white text-2xl drop-shadow-lg"></i>
                        <span className="text-[10px] font-bold">12.4K</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <i className="fa-solid fa-comment-dots text-white text-2xl drop-shadow-lg"></i>
                        <span className="text-[10px] font-bold">842</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <i className="fa-solid fa-bookmark text-white text-2xl drop-shadow-lg"></i>
                        <span className="text-[10px] font-bold">1.2K</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <i className="fa-solid fa-share text-white text-2xl drop-shadow-lg"></i>
                        <span className="text-[10px] font-bold">Share</span>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-4 left-4 right-16 z-10 text-left">
                    <h4 className="font-bold text-shadow-sm mb-1">@yourbrand</h4>
                    <p className="text-xs leading-snug text-shadow-sm line-clamp-3 opacity-90">
                        <RichText text={post.content} highlightColor="font-bold" />
                    </p>
                    <div className="mt-2 flex items-center gap-2 opacity-80">
                        <i className="fa-solid fa-music text-xs animate-spin-slow"></i>
                        <div className="text-[10px] overflow-hidden w-32">
                            <p className="whitespace-nowrap animate-marquee">Original Sound - Your Brand Music • </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default / Generic Style
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-[400px] mx-auto w-full relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-3 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 w-fit px-2 py-1 rounded-lg">
                <i className="fa-solid fa-layer-group"></i> Generic Preview
            </div>
            <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Brand&background=random" className="w-full h-full object-cover" alt="Avatar" />
                </div>
                <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Your Brand</p>
                    <p className="text-xs text-slate-500">Marketing Manager</p>
                </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-3 leading-relaxed">
                <RichText text={post.content} />
            </p>
            {media && (
                <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {isVideo ? (
                        <video src={media.url} className="w-full h-auto object-cover max-h-64" controls />
                    ) : (
                        <img src={media.url} className="w-full h-auto object-cover max-h-64" alt="Post media" />
                    )}
                </div>
            )}
            <div className="flex gap-6 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-400 text-sm">
                <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors"><i className="fa-regular fa-thumbs-up"></i> <span className="text-xs font-bold">Like</span></div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors"><i className="fa-regular fa-comment"></i> <span className="text-xs font-bold">Comment</span></div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors"><i className="fa-solid fa-share"></i> <span className="text-xs font-bold">Share</span></div>
            </div>
        </div>
    );
};

const BulkPublisher: React.FC<BulkPublisherProps> = ({ mediaLibrary, onUpdateLibrary, onDeleteMedia }) => {
  const [prompt, setPrompt] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['meta', 'tiktok']);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  const [viralSuggestions, setViralSuggestions] = useState<any[]>([]);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // AI Image Gen State
  const [mediaTab, setMediaTab] = useState<'upload' | 'ai'>('upload');
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgStyle, setImgStyle] = useState('Photorealistic');
  const [imgRatio, setImgRatio] = useState('1:1');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imgSeed, setImgSeed] = useState<number | ''>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Import State & Refining Filters
  const [showImportModal, setShowImportModal] = useState(false);
  const [importableItems, setImportableItems] = useState<any[]>([]);
  const [isLoadingImports, setIsLoadingImports] = useState(false);
  const [importSearch, setImportSearch] = useState('');
  const [importFilterPlatform, setImportFilterPlatform] = useState('All');
  const [importSort, setImportSort] = useState<'newest' | 'oldest' | 'engagement'>('newest');

  // Queue State
  const [queue, setQueue] = useState<QueueItem[]>([
      { id: 'q1', content: 'Summer Sale is live! ☀️ #SummerVibes', platforms: ['meta', 'twitter'], status: 'Scheduled', scheduledTime: '2024-10-25 10:00 AM', mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200' },
      { id: 'q2', content: 'Check out our new AI features 🤖', platforms: ['linkedin'], status: 'Draft', scheduledTime: 'Unscheduled' },
      { id: 'q3', content: 'Behind the scenes at the office 🏢', platforms: ['tiktok', 'meta'], status: 'Scheduled', scheduledTime: '2024-10-26 02:00 PM' }
  ]);
  const [selectedQueueIds, setSelectedQueueIds] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleUpdatePlatformContent = (platformId: string, newContent: string) => {
      setGeneratedContent((prev: any) => {
          if (!prev) return prev;
          const updatedPosts = prev.platformPosts.map((p: any) => 
              p.platformId === platformId ? { ...p, content: newContent } : p
          );
          return { ...prev, platformPosts: updatedPosts };
      });
  };

  const handleGenerateIdeas = async () => {
    if (!keywords && !prompt) {
        alert("Please enter a topic or keywords first.");
        return;
    }
    setIsGeneratingIdeas(true);
    const ideas = await generateViralSuggestions(keywords || prompt, tone, selectedPlatforms);
    setViralSuggestions(ideas);
    setIsGeneratingIdeas(false);
  };

  const handleGeneratePost = async () => {
    if (!prompt) {
        alert("Please enter a prompt.");
        return;
    }
    setPublishError(null);
    setIsGeneratingPost(true);
    const content = await generateSocialPost(prompt, tone, keywords, selectedPlatforms);
    setGeneratedContent(content);
    setIsGeneratingPost(false);
  };

  const handleGenerateImage = async () => {
      const finalPrompt = imgPrompt || prompt || "A futuristic marketing visual";
      if(!finalPrompt) return;
      
      setIsGeneratingImage(true);
      const url = await generateAIImage(finalPrompt, { 
          aspectRatio: imgRatio, 
          style: imgStyle,
          negativePrompt: negativePrompt,
          seed: imgSeed ? Number(imgSeed) : undefined
      });
      
      if(url) {
          const newItem: MediaItem = {
              id: 'ai_' + Date.now(),
              url,
              name: `AI_Gen_${Date.now()}.png`,
              type: 'image',
              date: new Date().toISOString()
          };
          onUpdateLibrary(newItem);
          setSelectedMedia(newItem);
      } else {
          alert("Image generation failed. Please try again.");
      }
      setIsGeneratingImage(false);
  };

  const handleOpenImport = async () => {
    setShowImportModal(true);
    if(importableItems.length === 0) {
        setIsLoadingImports(true);
        const items: any = await getImportableContent('all');
        setImportableItems(items);
        setIsLoadingImports(false);
    }
  };

  const handleImportSelect = (item: any) => {
      setPrompt(item.content);
      if (item.media) {
          setSelectedMedia({
              id: `import_${item.id}`,
              url: item.media,
              name: `Imported from ${item.platform}`,
              type: item.type === 'video' ? 'video' : 'image',
              date: new Date().toISOString()
          });
          setMediaTab('upload');
      }
      setShowImportModal(false);
  };

  const handleAddToQueue = (status: 'Draft' | 'Scheduled') => {
    if (!generatedContent) return;
    setPublishError(null);

    const twitterPost = generatedContent.platformPosts?.find((p: any) => p.platformId === 'twitter') || 
                        (selectedPlatforms.includes('twitter') ? { content: generatedContent.generalContent } : null);

    // Robust Error Handling for X (Twitter)
    if (twitterPost && selectedPlatforms.some(p => p === 'twitter' || p === 'x')) {
        const content = twitterPost.content || '';
        
        // Character Limit
        if (content.length > 280) {
            setPublishError(
                `❌ Post Failed: X (Twitter) Limit Exceeded\n` +
                `Current length: ${content.length} chars (Limit: 280).\n` +
                `Reason: The text is too long for a single tweet.\n` +
                `Fix: Shorten the content using the AI 'Witty' tone or edit manually.`
            );
            return;
        }

        // Media Validation (Simulated - Empty Tweet)
        if (!content.trim() && !selectedMedia) {
             setPublishError(`⚠️ Platform Restriction (X/Twitter): Tweet cannot be empty. Please add text or media.`);
             return;
        }
    }

    // Schedule Check
    if (status === 'Scheduled') {
        if (!scheduleDate) {
            setPublishError("❌ Schedule Error: Missing Deployment Time.\nPlease select a valid date and time to schedule this stack.");
            return;
        }
        const selectedTime = new Date(scheduleDate).getTime();
        if (selectedTime < Date.now()) {
             setPublishError("❌ Schedule Error: Invalid Time.\nYou cannot schedule posts in the past. Please select a future time.");
             return;
        }
    }
    
    const newItem: QueueItem = {
        id: `q_${Date.now()}`,
        content: generatedContent.generalContent,
        platforms: selectedPlatforms,
        status: status,
        scheduledTime: status === 'Scheduled' ? new Date(scheduleDate).toLocaleString() : 'Unscheduled',
        mediaUrl: selectedMedia?.url
    };

    setQueue([newItem, ...queue]);
    setGeneratedContent(null);
    setPrompt('');
    setViralSuggestions([]);
    setSelectedMedia(null);
    setScheduleDate('');
    alert(`Post added to queue as ${status}!`);
  };

  // Queue Management
  const handleSelectAll = () => {
      if (selectedQueueIds.length === queue.length) {
          setSelectedQueueIds([]);
      } else {
          setSelectedQueueIds(queue.map(i => i.id));
      }
  };

  const toggleQueueItem = (id: string) => {
      setSelectedQueueIds(prev => 
          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
  };

  const bulkDelete = () => {
      if(confirm(`Delete ${selectedQueueIds.length} items?`)) {
          setQueue(prev => prev.filter(i => !selectedQueueIds.includes(i.id)));
          setSelectedQueueIds([]);
      }
  };

  const bulkUpdatePlatform = (platformId: string) => {
      setQueue(prev => prev.map(item => {
          if (selectedQueueIds.includes(item.id)) {
              const hasPlatform = item.platforms.includes(platformId);
              return {
                  ...item,
                  platforms: hasPlatform 
                      ? item.platforms.filter(p => p !== platformId)
                      : [...item.platforms, platformId]
              };
          }
          return item;
      }));
  };

  // Filtered & Sorted Import Content
  const filteredImportItems = useMemo(() => {
      let result = [...importableItems];
      
      if (importSearch) {
          result = result.filter(item => 
              item.content.toLowerCase().includes(importSearch.toLowerCase()) ||
              item.platform.toLowerCase().includes(importSearch.toLowerCase())
          );
      }
      
      if (importFilterPlatform !== 'All') {
          result = result.filter(item => item.platform.toLowerCase() === importFilterPlatform.toLowerCase());
      }
      
      if (importSort === 'newest') {
          // Assuming date is something like "2 days ago" etc from mock, in real apps we'd parse ISO
          // For mock, we'll just keep it as is since newest is usually first
      } else if (importSort === 'engagement') {
          const engRank: Record<string, number> = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          result.sort((a, b) => (engRank[b.engagement] || 0) - (engRank[a.engagement] || 0));
      }
      
      return result;
  }, [importableItems, importSearch, importFilterPlatform, importSort]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Unified Publisher Node</h2>
          <p className="text-slate-400">Create, optimize, and broadcast content to all channels simultaneously.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Configuration */}
        <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-indigo-500/20">
                <h3 className="text-lg font-bold text-white mb-4">1. Select Target Nodes</h3>
                <div className="flex flex-wrap gap-3">
                    {PLATFORMS.filter(p => p.connected).map(p => (
                        <button
                            key={p.id}
                            onClick={() => togglePlatform(p.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                                selectedPlatforms.includes(p.id) 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                            }`}
                        >
                            <i className={p.icon}></i>
                            <span className="text-xs font-bold uppercase">{p.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4">2. Context & Settings</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tone of Voice</label>
                        <select 
                            value={tone} 
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500"
                        >
                            <option>Professional</option>
                            <option>Viral / Hype</option>
                            <option>Casual</option>
                            <option>Witty</option>
                            <option>Urgent</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Keywords</label>
                         <input 
                            type="text" 
                            value={keywords} 
                            onChange={(e) => setKeywords(e.target.value)} 
                            placeholder="e.g. #Summer, Tech, AI" 
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500" 
                        />
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-indigo-500/20 bg-gradient-to-br from-indigo-900/20 to-transparent">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">3. Viral Intelligence</h3>
                    <button 
                        onClick={handleGenerateIdeas} 
                        disabled={isGeneratingIdeas}
                        className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg font-bold uppercase transition-all flex items-center gap-2"
                    >
                        {isGeneratingIdeas ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                        Generate Ideas
                    </button>
                </div>
                
                {viralSuggestions.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                        {viralSuggestions.map((idea, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => {
                                    setPrompt(idea.suggestedAngle);
                                    setKeywords(idea.viralHook);
                                }}
                                className="p-3 bg-slate-900/80 border border-slate-700/50 rounded-xl cursor-pointer hover:border-indigo-500 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{idea.type}</span>
                                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-600 group-hover:text-white transition-colors"></i>
                                </div>
                                <p className="text-xs font-bold text-white leading-snug">{idea.topic}</p>
                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{idea.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-slate-500">
                        <i className="fa-solid fa-lightbulb text-2xl mb-2 opacity-30"></i>
                        <p className="text-xs">Enter keywords and generate ideas to see trending hooks.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right: Content Creation */}
        <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-slate-700/50 min-h-[600px] flex flex-col">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Content Prompt</label>
                        <button onClick={handleOpenImport} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-indigo-500/10">
                            <i className="fa-solid fa-clock-rotate-left"></i> Import from History
                        </button>
                    </div>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what you want to post..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-white resize-none h-32 focus:ring-1 focus:ring-indigo-500"
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {PROMPT_SUGGESTIONS.map((s, i) => (
                        <button key={i} onClick={() => setPrompt(s.text)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-400 hover:text-white font-bold rounded-lg border border-slate-700 transition-all">
                            {s.label}
                        </button>
                      ))}
                    </div>
                </div>

                <div className="mb-6 space-y-4">
                    <div className="flex gap-4 border-b border-slate-700/50 pb-1">
                        <button onClick={() => setMediaTab('upload')} className={`pb-2 px-2 text-xs font-bold uppercase tracking-wider transition-all ${mediaTab === 'upload' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>
                            Upload Media
                        </button>
                        <button onClick={() => setMediaTab('ai')} className={`pb-2 px-2 text-xs font-bold uppercase tracking-wider transition-all ${mediaTab === 'ai' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>
                            AI Creator
                        </button>
                    </div>

                    {mediaTab === 'upload' ? (
                        <button 
                            onClick={() => document.getElementById('media-upload-trigger')?.click()}
                            className="w-full h-40 bg-slate-800/50 border border-slate-700 border-dashed hover:border-indigo-500 hover:bg-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group relative overflow-hidden"
                        >
                             <input 
                                id="media-upload-trigger" 
                                type="file" 
                                className="hidden" 
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    if(e.target.files?.[0]) {
                                        const file = e.target.files[0];
                                        const url = URL.createObjectURL(file);
                                        setSelectedMedia({ id: 'temp', url, name: file.name, type: file.type.includes('video') ? 'video' : 'image', date: new Date().toISOString() });
                                    }
                                }}
                            />
                            {selectedMedia ? (
                                <div className="absolute inset-0 w-full h-full">
                                    <img src={selectedMedia.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-xs font-bold text-white bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-xl">Change Media</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-cloud-arrow-up text-indigo-400 text-lg"></i>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 group-hover:text-white">Drop file or Click to Upload</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Visual Prompt</label>
                                        <textarea 
                                            value={imgPrompt}
                                            onChange={(e) => setImgPrompt(e.target.value)}
                                            placeholder={prompt || "Describe the image..."}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none h-20 focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Art Style</label>
                                            <select 
                                                value={imgStyle}
                                                onChange={(e) => setImgStyle(e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-white focus:ring-1 focus:ring-indigo-500"
                                            >
                                                {ART_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Aspect Ratio</label>
                                            <select
                                                value={imgRatio}
                                                onChange={(e) => setImgRatio(e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-white focus:ring-1 focus:ring-indigo-500"
                                            >
                                                {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Negative Prompt (Exclude)</label>
                                        <input 
                                            type="text" 
                                            value={negativePrompt}
                                            onChange={(e) => setNegativePrompt(e.target.value)}
                                            placeholder="blurry, text, watermark..."
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Seed (Optional)</label>
                                        <input 
                                            type="number" 
                                            value={imgSeed}
                                            onChange={(e) => setImgSeed(e.target.value === '' ? '' : parseInt(e.target.value))}
                                            placeholder="Random if empty"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleGenerateImage}
                                        disabled={isGeneratingImage}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isGeneratingImage ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic"></i>}
                                        Generate Image
                                    </button>
                                </div>
                                
                                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center relative overflow-hidden h-64 md:h-auto group">
                                    {selectedMedia && selectedMedia.id.startsWith('ai_') ? (
                                        <>
                                            <img src={selectedMedia.url} className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <a href={selectedMedia.url} download="generated-image.png" className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 text-white"><i className="fa-solid fa-download"></i></a>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-slate-500">
                                            <i className="fa-regular fa-image text-3xl mb-2 opacity-30"></i>
                                            <p className="text-[10px] font-bold uppercase">Preview Area</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleGeneratePost}
                        disabled={isGeneratingPost || !prompt}
                        className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all flex flex-col items-center justify-center gap-2 border border-slate-700"
                    >
                        {isGeneratingPost ? <i className="fa-solid fa-spinner fa-spin text-xl"></i> : <i className="fa-solid fa-pen-nib text-xl"></i>}
                        {isGeneratingPost ? 'Crafting Text...' : 'Generate Text'}
                    </button>
                </div>

                {publishError && (
                    <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl animate-in fade-in slide-in-from-top-2">
                        <p className="text-xs font-bold text-rose-400 whitespace-pre-wrap">{publishError}</p>
                    </div>
                )}

                {generatedContent && (
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-lg">Platform Simulation</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wide border border-indigo-500/30">{selectedPlatforms.length} Channels Ready</span>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="p-5 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Master Copy Strategy</p>
                                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{generatedContent.generalContent}</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {generatedContent.platformPosts?.map((post: any, i: number) => (
                                    <div key={i} className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                {post.platformId === 'twitter' ? <i className="fa-brands fa-x-twitter"></i> : 
                                                 post.platformId === 'meta' ? <i className="fa-brands fa-facebook"></i> : 
                                                 post.platformId === 'linkedin' ? <i className="fa-brands fa-linkedin"></i> :
                                                 post.platformId === 'tiktok' ? <i className="fa-brands fa-tiktok"></i> :
                                                 <i className="fa-solid fa-share-nodes"></i>}
                                                {post.platformId}
                                            </span>
                                            <button 
                                                onClick={() => setEditingPlatformId(editingPlatformId === post.platformId ? null : post.platformId)}
                                                className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${editingPlatformId === post.platformId ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                                            >
                                                {editingPlatformId === post.platformId ? 'Done' : 'Edit'}
                                            </button>
                                        </div>

                                        {editingPlatformId === post.platformId && (
                                            <div className="animate-in fade-in slide-in-from-top-2">
                                                <textarea 
                                                    value={post.content}
                                                    onChange={(e) => handleUpdatePlatformContent(post.platformId, e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 h-32 resize-y"
                                                    placeholder={`Customize content for ${post.platformId}...`}
                                                />
                                                <div className="flex justify-end mt-1">
                                                    <span className={`text-[10px] font-bold ${((post.platformId === 'twitter' || post.platformId === 'x') && post.content.length > 280) ? 'text-rose-500' : 'text-slate-500'}`}>
                                                        {post.content.length} chars
                                                        {(post.platformId === 'twitter' || post.platformId === 'x') && ' / 280'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <PlatformPreview post={post} media={selectedMedia} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-black uppercase">Deploy At:</span>
                                <input 
                                    type="datetime-local" 
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-24 pr-4 py-3 text-xs text-white focus:ring-1 focus:ring-indigo-500" 
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleAddToQueue('Draft')}
                                    className="px-6 py-3 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                                >
                                    Save Draft
                                </button>
                                <button 
                                    onClick={() => handleAddToQueue('Scheduled')}
                                    disabled={isPublishing}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                                >
                                    {isPublishing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-clock"></i>}
                                    {isPublishing ? 'Scheduling...' : 'Schedule All'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Scheduled Queue Section */}
      <div className="glass-panel p-8 rounded-[2.5rem] border-slate-700/50 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white text-lg">
                      <i className="fa-solid fa-layer-group"></i>
                  </div>
                  <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Scheduled Queue</h3>
                      <p className="text-xs text-slate-400">{queue.length} items waiting for broadcast</p>
                  </div>
              </div>
              
              {selectedQueueIds.length > 0 && (
                  <div className="flex items-center gap-3 bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-xl animate-in slide-in-from-right-4">
                      <span className="text-xs font-bold text-indigo-400">{selectedQueueIds.length} Selected</span>
                      <div className="h-4 w-px bg-indigo-500/30"></div>
                      <button onClick={bulkDelete} className="text-slate-400 hover:text-rose-400 transition-colors" title="Delete Selected">
                          <i className="fa-solid fa-trash-can"></i>
                      </button>
                      <div className="relative">
                          <button onClick={() => setShowBulkEdit(!showBulkEdit)} className="text-slate-400 hover:text-white transition-colors" title="Edit Platforms">
                              <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          {showBulkEdit && (
                              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-2">
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2 mb-2">Toggle Platform</p>
                                  {PLATFORMS.filter(p => p.connected).map(p => (
                                      <button 
                                          key={p.id}
                                          onClick={() => bulkUpdatePlatform(p.id)}
                                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                                      >
                                          <i className={p.icon}></i> {p.name}
                                      </button>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              )}
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="border-b border-slate-800/50">
                          <th className="p-4 w-10">
                              <input 
                                  type="checkbox" 
                                  checked={queue.length > 0 && selectedQueueIds.length === queue.length}
                                  onChange={handleSelectAll}
                                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-offset-slate-900" 
                              />
                          </th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Preview</th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Platforms</th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Scheduled For</th>
                          <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                      {queue.map(item => (
                          <tr key={item.id} className={`group hover:bg-slate-800/20 transition-colors ${selectedQueueIds.includes(item.id) ? 'bg-indigo-600/5' : ''}`}>
                              <td className="p-4">
                                  <input 
                                      type="checkbox" 
                                      checked={selectedQueueIds.includes(item.id)}
                                      onChange={() => toggleQueueItem(item.id)}
                                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-offset-slate-900" 
                              />
                              </td>
                              <td className="p-4">
                                  <div className="flex items-center gap-4">
                                      {item.mediaUrl ? (
                                          <img src={item.mediaUrl} className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                                      ) : (
                                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600 text-xs">
                                              <i className="fa-solid fa-align-left"></i>
                                          </div>
                                      )}
                                      <p className="text-xs font-bold text-slate-300 line-clamp-1 max-w-[200px]">{item.content}</p>
                                  </div>
                              </td>
                              <td className="p-4">
                                  <div className="flex gap-1">
                                      {item.platforms.map(pid => {
                                          const pData = PLATFORMS.find(p => p.id === pid);
                                          return (
                                              <div key={pid} className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400 text-[10px]" title={pData?.name}>
                                                  <i className={pData?.icon || 'fa-solid fa-share-nodes'}></i>
                                              </div>
                                          );
                                      })}
                                  </div>
                              </td>
                              <td className="p-4 text-xs font-mono text-slate-400">{item.scheduledTime}</td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${item.status === 'Scheduled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                      {item.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                      {queue.length === 0 && (
                          <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-500 text-xs uppercase tracking-widest font-bold">Queue is empty</td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-slate-700 w-full max-w-3xl rounded-[2.5rem] p-0 shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden group/modal">
                <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
                    <i className="fa-solid fa-file-import text-9xl text-white"></i>
                </div>

                {/* Modal Header */}
                <div className="p-8 pb-4 flex justify-between items-center relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <i className="fa-solid fa-history text-indigo-500 icon-4d"></i>
                            Import History
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Select previous nodes for redeployment</p>
                    </div>
                    <button onClick={() => setShowImportModal(false)} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-500 transition-all flex items-center justify-center">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
                
                {/* Modal Filters & Search */}
                <div className="px-8 pb-6 pt-2 space-y-4 relative z-10">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                            <input 
                                type="text" 
                                placeholder="Search past campaigns, copy or tags..." 
                                value={importSearch}
                                onChange={(e) => setImportSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-xs text-white focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                            {['All', 'Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok'].map(plat => (
                                <button
                                    key={plat}
                                    onClick={() => setImportFilterPlatform(plat)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                                        importFilterPlatform === plat 
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                                        : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-white'
                                    }`}
                                >
                                    {plat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded-xl border border-slate-800/50">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-600 uppercase">Sort by:</span>
                                <select 
                                    value={importSort}
                                    onChange={(e) => setImportSort(e.target.value as any)}
                                    className="bg-transparent text-[10px] font-black text-indigo-400 uppercase tracking-widest outline-none cursor-pointer"
                                >
                                    <option value="newest">Recent First</option>
                                    <option value="engagement">Engagement Rank</option>
                                    <option value="oldest">Historical</option>
                                </select>
                            </div>
                        </div>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{filteredImportItems.length} Result{filteredImportItems.length !== 1 && 's'}</span>
                    </div>
                </div>

                {/* Modal Content List */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4 no-scrollbar relative z-10">
                    {isLoadingImports ? (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Accessing Vault Nodes...</p>
                        </div>
                    ) : filteredImportItems.length > 0 ? (
                        filteredImportItems.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => handleImportSelect(item)} 
                                className="p-5 bg-slate-800/30 border border-slate-700/50 rounded-[1.5rem] hover:border-indigo-500/50 hover:bg-slate-800/80 cursor-pointer group transition-all flex gap-5 items-start relative overflow-hidden"
                            >
                                {/* Platform Indicator Badge */}
                                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-500/5 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                                
                                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex-shrink-0 overflow-hidden border border-slate-800 group-hover:scale-105 transition-transform duration-300 shadow-xl relative">
                                    {item.media ? (
                                        <img src={item.media} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700"><i className="fa-solid fa-align-left text-2xl"></i></div>
                                    )}
                                    <div className="absolute bottom-1 right-1">
                                        <i className={`fa-brands fa-${item.platform.toLowerCase()} text-[10px] text-white p-1 rounded bg-black/60`}></i>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{item.platform}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">{item.date}</span>
                                        </div>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                            item.engagement === 'Very High' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                            item.engagement === 'High' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                        }`}>
                                            {item.engagement} ROI
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-200 font-medium line-clamp-2 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                                    
                                    {/* Action Reveal */}
                                    <div className="mt-3 flex items-center gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Deploy to workspace</span>
                                        <i className="fa-solid fa-arrow-right-long animate-pulse"></i>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-600 gap-4 border-2 border-dashed border-slate-800 rounded-[2rem]">
                            <i className="fa-solid fa-magnifying-glass-chart text-4xl opacity-20"></i>
                            <p className="text-xs font-black uppercase tracking-widest">No matching history nodes found</p>
                            <button onClick={() => {setImportSearch(''); setImportFilterPlatform('All');}} className="text-[10px] font-bold text-indigo-500 hover:text-white uppercase transition-colors">Clear All Filters</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BulkPublisher;
