
import React, { useState, useMemo, useEffect } from 'react';
import { PLATFORMS } from '../constants';
import { generateViralSuggestions, generateSocialPost, generateAIImage, uploadToYoutube } from '../services/geminiService';
import { MediaItem } from '../types';

interface DraftPost {
    id: string;
    platformId: string;
    content: string;
    mediaUrl?: string;
    title?: string;
    timestamp: string;
}

interface BulkPublisherProps {
  mediaLibrary: MediaItem[];
  onUpdateLibrary: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

interface PostStatus {
    platformId: string;
    status: 'idle' | 'pending' | 'success' | 'failed';
    error?: string;
}

interface ViralSuggestion {
    type: string;
    topic: string;
    description: string;
    viralHookText: string;
    trendingAudioProfile: string;
    algorithmReasoning: string;
    suggestedAngle: string;
    velocityScore: number;
    platforms: string[];
}

const PlatformPreview: React.FC<{ post: any; media: MediaItem | null; onSaveDraft: (platformId: string, content: string, title?: string) => void; youtubeTitle?: string }> = ({ post, media, onSaveDraft, youtubeTitle }) => {
    const isX = post.platformId === 'twitter' || post.platformId === 'x';
    const isMeta = post.platformId === 'meta' || post.platformId === 'facebook';
    const isIG = post.platformId === 'instagram';
    const isYT = post.platformId === 'youtube';
    const isTikTok = post.platformId === 'tiktok';
    const charCount = post.content.length;
    
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        onSaveDraft(post.platformId, post.content, isYT ? youtubeTitle : undefined);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    if (isTikTok) {
        return (
            <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-slate-900 mx-auto group">
                {/* Media Layer */}
                <div className="absolute inset-0 z-0">
                    {media ? (
                        <img src={media.url} className="w-full h-full object-cover" alt="TikTok Preview" />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-700">
                            <i className="fa-solid fa-video text-5xl mb-4"></i>
                            <p className="text-[10px] font-black uppercase tracking-widest">9:16 Node Required</p>
                        </div>
                    )}
                </div>

                {/* Overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10 p-4 flex flex-col justify-end">
                    {/* Top Bars */}
                    <div className="absolute top-6 left-0 right-0 flex justify-center gap-4 text-white text-[11px] font-bold opacity-80">
                        <span className="border-b-2 border-white pb-1">Following</span>
                        <span className="opacity-60">For You</span>
                    </div>

                    {/* Right Side Interactions */}
                    <div className="absolute right-2 bottom-20 flex flex-col items-center gap-5 text-white">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white">
                                <img src="https://ui-avatars.com/api/?name=SS&background=000&color=fff" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#fe2c55] rounded-full flex items-center justify-center text-[10px]">
                                <i className="fa-solid fa-plus"></i>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fa-solid fa-heart text-3xl drop-shadow-lg"></i>
                            <span className="text-[10px] font-bold mt-1">0</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fa-solid fa-comment-dots text-3xl drop-shadow-lg"></i>
                            <span className="text-[10px] font-bold mt-1">0</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fa-solid fa-bookmark text-3xl drop-shadow-lg"></i>
                            <span className="text-[10px] font-bold mt-1">0</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fa-solid fa-share text-3xl drop-shadow-lg"></i>
                            <span className="text-[10px] font-bold mt-1">0</span>
                        </div>
                        {/* Rotating Music Disc */}
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-[6px] border-slate-700 animate-spin-slow">
                            <img src="https://ui-avatars.com/api/?name=Music&background=111&color=fff" className="w-full h-full rounded-full" />
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="pr-16 space-y-2 mb-2">
                        <h4 className="text-white font-bold text-sm">@socialstack_official</h4>
                        <p className="text-white text-xs line-clamp-3 leading-relaxed drop-shadow-md">
                            {post.content}
                        </p>
                        <div className="flex items-center gap-2 text-white text-[11px] font-medium overflow-hidden">
                            <i className="fa-solid fa-music text-[10px]"></i>
                            <div className="whitespace-nowrap animate-marquee">
                                Original Sound - Social Stack Growth Core
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isYT) {
        return (
            <div className="bg-[#0f0f0f] text-white rounded-2xl border border-slate-800 shadow-2xl font-sans overflow-hidden max-w-[500px] mx-auto group">
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                    {media ? (
                        media.type === 'video' ? (
                            <video src={media.url} className="w-full h-full object-cover" />
                        ) : (
                            <img src={media.url} className="w-full h-full object-cover opacity-60 blur-sm" alt="Thumbnail" />
                        )
                    ) : (
                        <div className="text-slate-800 flex flex-col items-center gap-3">
                            <i className="fa-solid fa-clapperboard text-6xl"></i>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Video Node Required</p>
                        </div>
                    )}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-bold">12:42</div>
                </div>
                <div className="p-4 space-y-3">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden border border-white/5">
                            <img src="https://ui-avatars.com/api/?name=Social+Stack&background=6366f1&color=fff&bold=true" className="w-full h-full object-cover" alt="YT Channel" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[15px] leading-tight text-slate-100 line-clamp-2">{youtubeTitle || "Untitled Broadcast Node"}</h4>
                            <p className="text-[12px] text-slate-400 mt-1">Social Stack Hub • 0 views • Just now</p>
                        </div>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl">
                        <p className="text-[11px] text-slate-300 whitespace-pre-wrap line-clamp-3 font-medium">{post.content}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isX) {
        const xLimit = 280;
        const isOverLimit = charCount > xLimit;
        return (
            <div className={`bg-black text-white p-5 rounded-2xl border transition-all shadow-xl relative font-sans ${isOverLimit ? 'border-rose-500' : 'border-slate-800'}`}>
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden border border-white/10">
                        <img src="https://ui-avatars.com/api/?name=Social+Stack&background=6366f1&color=fff&bold=true" className="w-full h-full object-cover" alt="X Avatar" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 truncate">
                                <span className="font-bold text-[15px] text-white truncate">Social Stack</span>
                                <i className="fa-solid fa-circle-check text-[#1d9bf0] text-[12px]"></i>
                                <span className="text-slate-500 text-[14px] font-normal truncate">@socialstack · 1m</span>
                            </div>
                        </div>
                        <div className="mt-1 text-[15px] whitespace-pre-wrap leading-normal text-slate-100 font-normal tracking-tight">
                            {post.content}
                        </div>
                        {media && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-900">
                                <img src={media.url} className="w-full h-full object-cover" alt="X Media" />
                            </div>
                        )}
                        <div className="mt-4 flex items-center justify-between max-w-[400px] text-slate-500">
                            <div className="flex items-center gap-1.5 group cursor-pointer"><i className="fa-regular fa-comment text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-1.5 group cursor-pointer"><i className="fa-solid fa-retweet text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-1.5 group cursor-pointer"><i className="fa-regular fa-heart text-sm"></i> <span className="text-xs">0</span></div>
                            <i className="fa-regular fa-bookmark text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isMeta) {
        return (
            <div className="bg-white text-slate-900 rounded-xl border border-slate-200 shadow-xl font-sans overflow-hidden dark:bg-[#242526] dark:text-[#e4e6eb] dark:border-slate-700">
                <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center border border-slate-100 shadow-sm">
                            <i className="fa-solid fa-layer-group text-white text-xs"></i>
                        </div>
                        <div>
                            <p className="font-bold text-[15px] leading-tight hover:underline cursor-pointer">Social Stack Global</p>
                            <p className="text-[12px] text-slate-500 dark:text-[#b0b3b8] flex items-center gap-1 mt-0.5">Just now · <i className="fa-solid fa-earth-americas text-[10px]"></i></p>
                        </div>
                    </div>
                </div>
                <div className="px-4 pb-3 text-[15px] leading-snug whitespace-pre-wrap">{post.content}</div>
                {media && <div className="bg-black flex items-center justify-center border-y border-slate-100 dark:border-slate-700 max-h-[400px] overflow-hidden"><img src={media.url} className="w-full h-full object-contain" alt="FB Media" /></div>}
                <div className="p-3 border-t border-slate-100 dark:border-slate-700 flex justify-between">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-[#b0b3b8] hover:bg-slate-100 dark:hover:bg-white/5 px-2 py-1 rounded transition-colors"><i className="fa-regular fa-thumbs-up"></i> Like</span>
                        <span className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-[#b0b3b8] hover:bg-slate-100 dark:hover:bg-white/5 px-2 py-1 rounded transition-colors"><i className="fa-regular fa-comment"></i> Comment</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isIG) {
        return (
            <div className="bg-white text-black rounded-xl border border-slate-200 shadow-xl font-sans max-w-[450px] mx-auto overflow-hidden dark:bg-black dark:text-white dark:border-slate-800">
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"><div className="w-full h-full rounded-full bg-white dark:bg-black p-[1px]"><img src="https://ui-avatars.com/api/?name=SS&background=6366f1&color=fff" className="w-full h-full rounded-full" alt="IG Avatar" /></div></div>
                        <div>
                            <div className="flex items-center gap-1"><p className="font-bold text-[13px] leading-none">socialstack_global</p><i className="fa-solid fa-circle-check text-[#0095f6] text-[10px]"></i></div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sponsored</p>
                        </div>
                    </div>
                </div>
                <div className="aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center border-y border-slate-200 dark:border-slate-800">
                    {media ? <img src={media.url} className="w-full h-full object-cover" alt="IG Post" /> : <i className="fa-solid fa-image text-6xl opacity-10"></i>}
                </div>
                <div className="p-3">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-4 text-2xl"><i className="fa-regular fa-heart"></i><i className="fa-regular fa-comment"></i><i className="fa-regular fa-paper-plane"></i></div>
                        <i className="fa-regular fa-bookmark text-2xl"></i>
                    </div>
                    <div className="text-[13px] leading-snug"><span className="font-bold mr-2">socialstack_global</span><span className="whitespace-pre-wrap">{post.content}</span></div>
                </div>
            </div>
        );
    }

    return null;
};

const BulkPublisher: React.FC<BulkPublisherProps> = ({ mediaLibrary, onUpdateLibrary, onDeleteMedia }) => {
  const [prompt, setPrompt] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Viral / Hype');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['meta', 'tiktok', 'twitter', 'instagram', 'youtube']);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [mediaTab, setMediaTab] = useState<'upload' | 'trends' | 'drafts'>('trends');

  const [trendNiche, setTrendNiche] = useState('');
  const [isScanningTrends, setIsScanningTrends] = useState(false);
  const [viralSuggestions, setViralSuggestions] = useState<ViralSuggestion[]>([]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<PostStatus[]>([]);

  // Media Library Selection Filters & Sorting
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [mediaSortOption, setMediaSortOption] = useState<'date-desc' | 'date-asc' | 'size-desc' | 'size-asc'>('date-desc');

  const filteredAndSortedMedia = useMemo(() => {
    let items = mediaLibrary.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(mediaSearchQuery.toLowerCase());
        const matchesType = mediaTypeFilter === 'all' || m.type === mediaTypeFilter;
        return matchesSearch && matchesType;
    });

    items.sort((a, b) => {
        if (mediaSortOption.startsWith('date')) {
            const timeA = new Date(a.date).getTime();
            const timeB = new Date(b.date).getTime();
            return mediaSortOption === 'date-desc' ? timeB - timeA : timeA - timeB;
        } else {
            const sizeA = parseFloat(a.size || '0');
            const sizeB = parseFloat(b.size || '0');
            return mediaSortOption === 'size-desc' ? sizeB - sizeA : sizeA - sizeB;
        }
    });

    return items;
  }, [mediaLibrary, mediaSearchQuery, mediaTypeFilter, mediaSortOption]);

  const [drafts, setDrafts] = useState<DraftPost[]>(() => {
    const saved = localStorage.getItem('socialstack_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('socialstack_drafts', JSON.stringify(drafts));
  }, [drafts]);

  const handleScanTrends = async () => {
    if (!trendNiche) return;
    setIsScanningTrends(true);
    setViralSuggestions([]);
    const suggestions = await generateViralSuggestions(trendNiche, tone, selectedPlatforms);
    setViralSuggestions(suggestions);
    setIsScanningTrends(false);
  };

  const applySuggestion = (s: ViralSuggestion) => {
    setPrompt(`${s.topic}: ${s.description}. Strategic Hook: ${s.viralHookText}. Recommended Angle: ${s.suggestedAngle}.`);
    setKeywords(s.topic.split(' ').slice(0, 3).join(', '));
    if (s.velocityScore > 80) setTone('Viral / Hype');
  };

  const handleGeneratePost = async () => {
    if (!prompt) return;
    setIsGeneratingPost(true);
    setSyncResults([]);
    const content = await generateSocialPost(prompt, tone, keywords, selectedPlatforms);
    setGeneratedContent(content);
    if (content.youtubeTitle) setYoutubeTitle(content.youtubeTitle);
    setIsGeneratingPost(false);
  };

  const handleSynchronize = async () => {
    if (!generatedContent || isSyncing) return;
    setIsSyncing(true);
    const posts = generatedContent.platformPosts;
    const results: PostStatus[] = [];

    for (const post of posts) {
        const platformId = post.platformId;
        setSyncResults(prev => [...prev, { platformId, status: 'pending' }]);

        let error: string | undefined;
        let finalStatus: 'success' | 'failed' = 'success';

        try {
            if (platformId === 'youtube') {
                if (!selectedMedia || selectedMedia.type !== 'video') {
                    finalStatus = 'failed';
                    error = 'Video node required for YouTube.';
                } else {
                    await uploadToYoutube(youtubeTitle, post.content, selectedMedia.url);
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        } catch (e) {
            finalStatus = 'failed';
            error = 'Network timeout.';
        }

        results.push({ platformId, status: finalStatus, error });
        setSyncResults([...results]);
    }
    setIsSyncing(false);
  };

  const handleSaveDraft = (platformId: string, content: string, title?: string) => {
    const newDraft: DraftPost = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        platformId,
        content,
        title,
        mediaUrl: selectedMedia?.url,
        timestamp: new Date().toLocaleString()
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  const loadDraft = (draft: DraftPost) => {
      setPrompt(draft.content);
      if (draft.title) setYoutubeTitle(draft.title);
      setSelectedPlatforms([draft.platformId]);
      const matchedMedia = mediaLibrary.find(m => m.url === draft.mediaUrl);
      if (matchedMedia) setSelectedMedia(matchedMedia);
      setGeneratedContent(null);
  };

  const purgeDraft = (id: string) => {
      if(confirm('Authorize destructive purge of this draft node?')) {
          setDrafts(prev => prev.filter(d => d.id !== id));
      }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Broadcaster Core</h2>
          <p className="text-slate-400 font-medium mt-2">Provision and sync high-fidelity content across the global social graph.</p>
        </div>
        <div className="flex bg-slate-900/60 p-2 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-3xl overflow-x-auto max-w-full no-scrollbar">
            {PLATFORMS.filter(p => p.connected).map(p => (
                <button 
                    key={p.id} 
                    onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 group ${selectedPlatforms.includes(p.id) ? 'bg-indigo-600 text-white shadow-xl scale-110' : 'text-slate-600 hover:text-slate-200 hover:bg-white/5'}`}
                >
                    <i className={`${p.icon} text-lg group-hover:scale-110 transition-transform`}></i>
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-4 space-y-8 lg:sticky lg:top-24">
            <div className="glass-panel p-8 rounded-[3rem] space-y-10 relative overflow-hidden border-indigo-500/10 bg-indigo-600/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 blur-[80px] -mr-20 -mt-20"></div>
                <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-6">
                    <h3 className="text-[11px] font-tech text-indigo-400 uppercase tracking-[0.3em] font-black flex items-center gap-2">
                        <i className="fa-solid fa-microchip"></i> Strategy Lab
                    </h3>
                    <div className="flex gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
                        {['trends', 'upload', 'drafts'].map(tab => (
                            <button key={tab} onClick={() => setMediaTab(tab as any)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${mediaTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>{tab}</button>
                        ))}
                    </div>
                </div>

                {mediaTab === 'trends' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Niche Vector</label>
                            <div className="relative group">
                                <i className="fa-solid fa-magnifying-glass-chart absolute left-4 top-1/2 -translate-y-1/2 text-slate-700"></i>
                                <input type="text" value={trendNiche} onChange={e => setTrendNiche(e.target.value)} placeholder="e.g. Fintech, AI SaaS..." className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-10 pr-6 py-4 text-xs font-bold text-white shadow-inner focus:border-indigo-500/50 outline-none transition-all" />
                            </div>
                        </div>
                        <button onClick={handleScanTrends} disabled={isScanningTrends || !trendNiche} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 transition-all btn-3d">
                            {isScanningTrends ? <i className="fa-solid fa-satellite fa-spin mr-2"></i> : <i className="fa-solid fa-bolt-lightning mr-2"></i>}
                            Intelligence Scan
                        </button>
                        
                        <div className="space-y-4 max-h-[480px] overflow-y-auto no-scrollbar pr-1 scroll-smooth">
                            {viralSuggestions.map((s, i) => (
                                <div key={i} className="p-6 bg-slate-950/80 border border-white/5 rounded-3xl space-y-5 hover:border-indigo-500/30 transition-all group/trend shadow-inner relative overflow-hidden">
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-indigo-500 text-white text-[7px] font-black uppercase rounded-lg shadow-lg">{s.type}</span>
                                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">#{i + 1}</span>
                                            </div>
                                            <h4 className="text-[13px] font-black text-white uppercase tracking-tight leading-tight group-hover/trend:text-indigo-400 transition-colors">{s.topic}</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-slate-700 uppercase">Velocity</p>
                                            <p className="text-xs font-black text-emerald-400">{s.velocityScore}%</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => applySuggestion(s)} 
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all relative z-10 flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-indigo-400"></i>
                                        Apply Strategy Node
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : mediaTab === 'upload' ? (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-300 relative z-10">
                        <div className="space-y-4 p-2">
                             <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]"></i>
                                    <input 
                                        type="text" 
                                        value={mediaSearchQuery}
                                        onChange={e => setMediaSearchQuery(e.target.value)}
                                        placeholder="Search Assets..."
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl pl-8 pr-4 py-2 text-[10px] font-bold text-white shadow-inner focus:border-indigo-500/50 outline-none"
                                    />
                                </div>
                             </div>
                             <div className="flex gap-2 bg-slate-950/60 p-1 rounded-xl border border-white/5">
                                {['all', 'image', 'video'].map(type => (
                                    <button 
                                        key={type} 
                                        onClick={() => setMediaTypeFilter(type as any)}
                                        className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${mediaTypeFilter === type ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                             </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 max-h-[380px] overflow-y-auto no-scrollbar scroll-smooth pr-1">
                            {filteredAndSortedMedia.length > 0 ? filteredAndSortedMedia.map(item => (
                                <div key={item.id} onClick={() => setSelectedMedia(selectedMedia?.id === item.id ? null : item)} className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all relative group shadow-lg ${selectedMedia?.id === item.id ? 'border-indigo-500 scale-95 shadow-indigo-500/20 ring-4 ring-indigo-500/20' : 'border-slate-800 hover:border-slate-600'}`}>
                                    {item.type === 'video' ? <div className="w-full h-full bg-black flex items-center justify-center text-indigo-500"><i className="fa-solid fa-video text-xl"></i></div> : <img src={item.url} className="w-full h-full object-cover" loading="lazy" />}
                                </div>
                            )) : null}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[580px] overflow-y-auto no-scrollbar pr-1 scroll-smooth">
                        {drafts.length > 0 ? drafts.map((draft) => {
                            const platform = PLATFORMS.find(p => p.id === draft.platformId);
                            return (
                                <div key={draft.id} className="p-5 bg-slate-950/80 border border-white/5 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all group/draft shadow-inner relative overflow-hidden">
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover/draft:bg-indigo-600 group-hover/draft:text-white transition-all">
                                                <i className={platform?.icon || 'fa-solid fa-file'}></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">{draft.title || 'Untitled Draft'}</p>
                                                <p className="text-[7px] text-slate-600 font-tech uppercase tracking-widest">{draft.timestamp}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => purgeDraft(draft.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:text-rose-500 transition-colors">
                                            <i className="fa-solid fa-trash-can text-xs"></i>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => loadDraft(draft)} 
                                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[8px] font-black text-white uppercase tracking-[0.2em] transition-all"
                                    >
                                        Load into Hub
                                    </button>
                                </div>
                            );
                        }) : (
                            <div className="py-32 text-center space-y-6 opacity-20">
                                <i className="fa-solid fa-inbox text-5xl"></i>
                                <p className="text-[10px] font-tech uppercase tracking-[0.4em]">Vault Empty: 0 Draft Nodes</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        <div className="xl:col-span-8 space-y-10">
            <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 shadow-2xl relative overflow-hidden bg-gradient-to-br from-indigo-900/10 via-slate-950 to-transparent">
                <div className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[11px] font-tech text-slate-500 uppercase tracking-[0.4em] ml-1">Broadcast Payload (Main Body)</label>
                            <textarea 
                                value={prompt} 
                                onChange={e => setPrompt(e.target.value)} 
                                placeholder="Initialize broadcast sequence payload..."
                                className="w-full bg-slate-950/80 border border-white/10 rounded-[2.5rem] p-8 text-base text-white h-48 focus:ring-1 focus:ring-indigo-500 shadow-inner resize-none font-medium placeholder-slate-800 transition-all"
                            />
                        </div>
                        {selectedPlatforms.includes('youtube') && (
                            <div className="space-y-4 md:col-span-2 animate-in slide-in-from-top-4 duration-500">
                                <label className="text-[11px] font-tech text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-2 ml-1"><i className="fa-brands fa-youtube"></i> YouTube Node Metadata</label>
                                <input type="text" value={youtubeTitle} onChange={e => setYoutubeTitle(e.target.value)} placeholder="Video Title calibrated for network velocity..." className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white font-black shadow-inner" />
                            </div>
                        )}
                        <div className="space-y-3">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] ml-1">Context Tags</label>
                            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="#Growth, #Viral, #Identity" className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-xs text-indigo-400 font-tech shadow-inner outline-none" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] ml-1">Vocal Signature</label>
                            <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white font-black appearance-none outline-none focus:border-indigo-500/50 shadow-inner cursor-pointer">
                                <option>Viral / Hype</option>
                                <option>B2B Professional</option>
                                <option>Analytical Neutral</option>
                                <option>Storytelling Hook</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleGeneratePost} 
                        disabled={isGeneratingPost || !prompt}
                        className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-display font-black text-xl uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(79,70,229,0.3)] transition-all btn-3d disabled:opacity-50 flex items-center justify-center gap-6 group"
                    >
                        {isGeneratingPost ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-layer-group group-hover:rotate-12 transition-transform"></i>}
                        Authorize Broadcast Sequence
                    </button>
                </div>
            </div>

            {generatedContent && (
                <div className="animate-in slide-in-from-bottom-12 duration-1000 space-y-10">
                    <div className="flex items-center justify-between px-4 border-l-4 border-indigo-600 py-2">
                        <div><h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Transmission Previews</h3><p className="text-[10px] text-slate-500 font-tech uppercase tracking-widest mt-1">Multi-Channel Fidelity Audit</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 items-start">
                        {generatedContent.platformPosts?.map((post: any, i: number) => {
                            const result = syncResults.find(r => r.platformId === post.platformId);
                            return (
                                <div key={i} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                                    <div className="relative">
                                        <PlatformPreview post={post} media={selectedMedia} onSaveDraft={handleSaveDraft} youtubeTitle={youtubeTitle} />
                                        {result && (
                                            <div className={`absolute -top-4 -right-4 z-20 px-4 py-2 rounded-xl border-2 flex items-center gap-3 shadow-2xl animate-in zoom-in-50 duration-300 ${result.status === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : result.status === 'pending' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-rose-500 border-rose-400 text-white'}`}>
                                                <i className={`fa-solid ${result.status === 'success' ? 'fa-check' : result.status === 'pending' ? 'fa-satellite fa-spin' : 'fa-triangle-exclamation'}`}></i>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{result.status}</span>
                                            </div>
                                        )}
                                    </div>
                                    {result?.error && (
                                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 font-medium text-center">
                                            {result.error}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center pt-10"><button onClick={handleSynchronize} disabled={isSyncing} className="px-20 py-6 bg-white text-black rounded-full font-display font-black text-lg uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_30px_80px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-40 disabled:grayscale flex items-center gap-6">{isSyncing ? <i className="fa-solid fa-satellite fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}{isSyncing ? 'Synchronizing Frequencies...' : 'Authorize Global Sync'}</button></div>
                </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            animation: marquee 10s linear infinite;
        }
        .animate-spin-slow {
            animation: spin 5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BulkPublisher;
