
import React, { useState, useMemo, useEffect } from 'react';
import { PLATFORMS } from '../constants';
import { generateViralSuggestions, generateSocialPost, generateAIImage, generateVideoScript } from '../services/geminiService';
import { MediaItem } from '../types';

interface DraftPost {
    id: string;
    platformId: string;
    content: string;
    mediaUrl?: string;
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
    viralHook: string;
    trendingAudio: string;
    patternDescription: string;
    suggestedAngle: string;
    velocityScore: number;
    platforms: string[];
}

const PlatformPreview: React.FC<{ post: any; media: MediaItem | null; onSaveDraft: (platformId: string, content: string) => void }> = ({ post, media, onSaveDraft }) => {
    const isX = post.platformId === 'twitter' || post.platformId === 'x';
    const isMeta = post.platformId === 'meta' || post.platformId === 'facebook';
    const isIG = post.platformId === 'instagram';
    const charCount = post.content.length;
    
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        onSaveDraft(post.platformId, post.content);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    // X (Twitter) High-Fidelity Preview
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
                            <i className="fa-solid fa-ellipsis text-slate-500 text-xs"></i>
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
                            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#1d9bf0]"><i className="fa-regular fa-comment text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#00ba7c]"><i className="fa-solid fa-retweet text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#f91880]"><i className="fa-regular fa-heart text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#1d9bf0]"><i className="fa-solid fa-chart-simple text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-3">
                                <i className="fa-regular fa-bookmark text-sm hover:text-[#1d9bf0] cursor-pointer"></i>
                                <i className="fa-solid fa-arrow-up-from-bracket text-sm hover:text-[#1d9bf0] cursor-pointer"></i>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Char Count Overlay for X */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className={`w-1 h-4 rounded-full ${isOverLimit ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500 opacity-20'}`}></div>
                    <span className={`text-[10px] font-tech ${isOverLimit ? 'text-rose-500' : 'text-slate-600'}`}>{charCount}/280</span>
                </div>
            </div>
        );
    }

    // Facebook (Meta) High-Fidelity Preview
    if (isMeta) {
        return (
            <div className="bg-[#242526] text-[#e4e6eb] rounded-xl border border-slate-700 shadow-xl font-sans overflow-hidden">
                <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center border border-white/10">
                            <i className="fa-solid fa-layer-group text-white text-xs"></i>
                        </div>
                        <div>
                            <p className="font-bold text-[15px] leading-tight hover:underline cursor-pointer">Social Stack Global</p>
                            <p className="text-[12px] text-[#b0b3b8] flex items-center gap-1 mt-0.5">Just now · <i className="fa-solid fa-earth-americas text-[10px]"></i></p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className={`${isSaved ? 'text-emerald-400' : 'text-[#b0b3b8]'} hover:bg-white/5 p-2 rounded-full transition-all`}>
                            <i className={isSaved ? "fa-solid fa-check" : "fa-solid fa-bookmark"}></i>
                        </button>
                        <i className="fa-solid fa-ellipsis text-[#b0b3b8] cursor-pointer p-2 hover:bg-white/5 rounded-full"></i>
                    </div>
                </div>
                <div className="px-4 pb-3 text-[15px] leading-snug whitespace-pre-wrap">
                    {post.content}
                </div>
                {media && (
                    <div className="bg-black flex items-center justify-center border-y border-slate-700 max-h-[400px] overflow-hidden">
                        <img src={media.url} className="w-full h-full object-contain" alt="FB Media" />
                    </div>
                )}
                <div className="px-4 py-2 border-t border-slate-700/50 mt-2">
                    <div className="flex justify-between py-2 text-[#b0b3b8] text-[13px]">
                        <div className="flex items-center gap-1">
                            <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white">
                                <i className="fa-solid fa-thumbs-up"></i>
                            </span>
                            0
                        </div>
                        <div>0 comments · 0 shares</div>
                    </div>
                    <div className="grid grid-cols-3 border-t border-slate-700/50 pt-1">
                        <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-md text-[#b0b3b8] font-bold text-sm transition-colors">
                            <i className="fa-regular fa-thumbs-up text-lg"></i> Like
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-md text-[#b0b3b8] font-bold text-sm transition-colors">
                            <i className="fa-regular fa-comment text-lg"></i> Comment
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-md text-[#b0b3b8] font-bold text-sm transition-colors">
                            <i className="fa-solid fa-share text-lg"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Instagram High-Fidelity Preview
    if (isIG) {
        return (
            <div className="bg-black text-white rounded-xl border border-slate-800 shadow-xl font-sans max-w-[450px] mx-auto overflow-hidden">
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                            <div className="w-full h-full rounded-full bg-black p-[1px]">
                                <img src="https://ui-avatars.com/api/?name=SS&background=6366f1&color=fff" className="w-full h-full rounded-full" alt="IG Avatar" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <p className="font-bold text-[13px] leading-none">socialstack_global</p>
                                <i className="fa-solid fa-circle-check text-[#0095f6] text-[10px]"></i>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">San Francisco, CA</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleSave} className={`${isSaved ? 'text-emerald-400' : 'text-white'} transition-all`}>
                            <i className={isSaved ? "fa-solid fa-check" : "fa-regular fa-bookmark"}></i>
                        </button>
                        <i className="fa-solid fa-ellipsis cursor-pointer"></i>
                    </div>
                </div>
                <div className="aspect-square bg-slate-900 overflow-hidden flex items-center justify-center border-y border-slate-800">
                    {media ? (
                        <img src={media.url} className="w-full h-full object-cover" alt="IG Post" />
                    ) : (
                        <div className="text-slate-800 flex flex-col items-center gap-3">
                            <i className="fa-solid fa-image text-6xl"></i>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Media Placeholder</p>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-4 text-2xl">
                            <i className="fa-regular fa-heart hover:text-rose-500 cursor-pointer"></i>
                            <i className="fa-regular fa-comment hover:text-slate-400 cursor-pointer"></i>
                            <i className="fa-regular fa-paper-plane hover:text-slate-400 cursor-pointer"></i>
                        </div>
                        <i className="fa-regular fa-bookmark text-2xl cursor-pointer"></i>
                    </div>
                    <p className="text-[13px] font-bold mb-1.5">1,240 likes</p>
                    <div className="text-[13px] leading-snug">
                        <span className="font-bold mr-2">socialstack_global</span>
                        <span className="whitespace-pre-wrap">{post.content}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-2 tracking-tighter">1 MINUTE AGO</p>
                </div>
            </div>
        );
    }

    // Default Fallback Preview
    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl w-full bg-slate-900/50">
            <div className="flex items-center justify-between mb-4">
                <div className="px-4 py-1 bg-indigo-600/20 text-indigo-400 text-[10px] font-tech uppercase rounded-lg border border-indigo-500/20 tracking-widest">{post.platformId} Preview</div>
                <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-tech ${charCount > 1000 ? 'text-amber-500' : 'text-slate-500'}`}>{charCount} Chars</span>
                    <button 
                        onClick={handleSave}
                        className={`text-[10px] font-black uppercase tracking-tighter transition-all ${isSaved ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}
                    >
                        {isSaved ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-bookmark" />}
                    </button>
                </div>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap mb-4 font-medium">{post.content}</div>
            {media && <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 aspect-video bg-slate-950 flex items-center justify-center"><img src={media.url} className="w-full h-full object-cover" /></div>}
        </div>
    );
};

const BulkPublisher: React.FC<BulkPublisherProps> = ({ mediaLibrary, onUpdateLibrary, onDeleteMedia }) => {
  const [prompt, setPrompt] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Viral / Hype');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['meta', 'tiktok', 'twitter', 'instagram']);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [mediaTab, setMediaTab] = useState<'upload' | 'ai' | 'script' | 'trends' | 'drafts'>('upload');

  const [trendNiche, setTrendNiche] = useState('');
  const [isScanningTrends, setIsScanningTrends] = useState(false);
  const [viralSuggestions, setViralSuggestions] = useState<ViralSuggestion[]>([]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<PostStatus[]>([]);

  const [drafts, setDrafts] = useState<DraftPost[]>(() => {
    const saved = localStorage.getItem('socialstack_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('socialstack_drafts', JSON.stringify(drafts));
  }, [drafts]);

  const [imagePrompt, setImagePrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [artStyle, setArtStyle] = useState('Photorealistic');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'type'>('newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const sortedMedia = useMemo(() => {
    const list = [...mediaLibrary];
    if (sortBy === 'newest') return list.sort((a, b) => b.id.localeCompare(a.id));
    if (sortBy === 'oldest') return list.sort((a, b) => a.id.localeCompare(b.id));
    if (sortBy === 'type') return list.sort((a, b) => a.type.localeCompare(b.type));
    return list;
  }, [mediaLibrary, sortBy]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBatchDelete = () => {
    if (confirm(`Authorize destructive purge of ${selectedIds.length} assets?`)) {
        selectedIds.forEach(id => onDeleteMedia(id));
        setSelectedIds([]);
        setIsMultiSelectMode(false);
    }
  };

  const handleScanTrends = async () => {
    if (!trendNiche) return;
    setIsScanningTrends(true);
    const suggestions = await generateViralSuggestions(trendNiche, tone, selectedPlatforms);
    setViralSuggestions(suggestions);
    setIsScanningTrends(false);
  };

  const applySuggestion = (s: ViralSuggestion) => {
    setPrompt(`${s.topic}: ${s.description}. Key Hook: ${s.viralHook}. Visual Pattern: ${s.patternDescription}. Angle: ${s.suggestedAngle}`);
    setKeywords(s.topic.split(' ').join(', '));
  };

  const handleGeneratePost = async () => {
    if (!prompt) return;
    setIsGeneratingPost(true);
    setSyncResults([]);
    const content = await generateSocialPost(prompt, tone, keywords, selectedPlatforms);
    setGeneratedContent(content);
    setIsGeneratingPost(false);
  };

  const handleSynchronize = async () => {
    if (!generatedContent || isSyncing) return;
    setIsSyncing(true);
    setSyncResults([]);

    const posts = generatedContent.platformPosts;
    const results: PostStatus[] = [];

    for (const post of posts) {
        const platformId = post.platformId;
        const currentResults = [...results, { platformId, status: 'pending' as const }];
        setSyncResults(currentResults);

        await new Promise(resolve => setTimeout(resolve, 1500));

        let error: string | undefined;
        let finalStatus: 'success' | 'failed' = 'success';

        if ((platformId === 'twitter' || platformId === 'x') && post.content.length > 280) {
            finalStatus = 'failed';
            error = 'Char limit violation (X requires < 280).';
        }

        const res: PostStatus = { platformId, status: finalStatus, error };
        results.push(res);
        setSyncResults([...results]);
    }
    setIsSyncing(false);
  };

  const handleSaveDraft = (platformId: string, content: string) => {
    const newDraft: DraftPost = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        platformId,
        content,
        mediaUrl: selectedMedia?.url,
        timestamp: new Date().toLocaleString()
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    const imageUrl = await generateAIImage(imagePrompt, { aspectRatio, style: artStyle, negativePrompt });
    if (imageUrl) {
        const newItem: MediaItem = {
            id: Date.now().toString(),
            url: imageUrl,
            name: `AI_SYNTH_${Date.now()}.png`,
            type: 'image',
            date: new Date().toISOString().split('T')[0]
        };
        onUpdateLibrary(newItem);
        setSelectedMedia(newItem);
    }
    setIsGeneratingImage(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Broadcaster Core</h2>
          <p className="text-slate-400 font-medium mt-2">Provision and sync high-fidelity content across the global graph.</p>
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
        {/* ASSET CONTROL PANEL */}
        <div className="xl:col-span-4 space-y-8 lg:sticky lg:top-24">
            <div className="glass-panel p-8 rounded-[3rem] space-y-10 relative overflow-hidden border-indigo-500/10 bg-indigo-500/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 blur-[80px] -mr-20 -mt-20"></div>
                <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-6">
                    <h3 className="text-[11px] font-tech text-indigo-400 uppercase tracking-[0.3em] font-black flex items-center gap-2">
                        <i className="fa-solid fa-microchip"></i> Laboratory
                    </h3>
                    <div className="flex gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5">
                        {['upload', 'trends', 'ai', 'drafts'].map(tab => (
                            <button key={tab} onClick={() => setMediaTab(tab as any)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${mediaTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>{tab}</button>
                        ))}
                    </div>
                </div>

                {mediaTab === 'upload' ? (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-300 relative z-10">
                        <div className="flex items-center justify-between px-1">
                            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-slate-900 border border-white/10 text-[10px] font-black text-slate-400 uppercase rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50">
                                <option value="newest">Recent Nodes</option>
                                <option value="type">By Modality</option>
                            </select>
                            <button onClick={() => { setIsMultiSelectMode(!isMultiSelectMode); setSelectedIds([]); }} className={`text-[10px] font-black uppercase transition-all ${isMultiSelectMode ? 'text-rose-500' : 'text-slate-500 hover:text-indigo-400'}`}>{isMultiSelectMode ? 'Cancel' : 'Multi-Select'}</button>
                        </div>
                        <div className="grid grid-cols-4 gap-4 max-h-[420px] overflow-y-auto no-scrollbar scroll-smooth pr-1">
                            {sortedMedia.map(item => (
                                <div key={item.id} onClick={() => isMultiSelectMode ? handleToggleSelect(item.id) : setSelectedMedia(selectedMedia?.id === item.id ? null : item)} className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all relative group shadow-lg ${isMultiSelectMode ? (selectedIds.includes(item.id) ? 'border-indigo-500 scale-95 ring-4 ring-indigo-500/20' : 'border-slate-800') : (selectedMedia?.id === item.id ? 'border-indigo-500 scale-95 shadow-indigo-500/20 ring-4 ring-indigo-500/20' : 'border-slate-800 hover:border-slate-600')}`}>
                                    <img src={item.url} className="w-full h-full object-cover" loading="lazy" />
                                    {isMultiSelectMode && <div className={`absolute top-2 right-2 w-5 h-5 rounded-lg border border-white/20 flex items-center justify-center transition-all ${selectedIds.includes(item.id) ? 'bg-indigo-500 border-indigo-400' : 'bg-black/60'}`}>{selectedIds.includes(item.id) && <i className="fa-solid fa-check text-[10px] text-white"></i>}</div>}
                                </div>
                            ))}
                        </div>
                        {isMultiSelectMode && selectedIds.length > 0 && <button onClick={handleBatchDelete} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl animate-in fade-in zoom-in-95">Purge {selectedIds.length} Nodes</button>}
                    </div>
                ) : mediaTab === 'trends' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest ml-1">Trend Radar (Real-time)</label>
                            <input type="text" value={trendNiche} onChange={e => setTrendNiche(e.target.value)} placeholder="e.g. Fintech, Skincare, AI Tools..." className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-1 focus:ring-indigo-500 shadow-inner placeholder-slate-800" />
                        </div>
                        <button onClick={handleScanTrends} disabled={isScanningTrends || !trendNiche} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 transition-all btn-3d">
                            {isScanningTrends ? <i className="fa-solid fa-satellite fa-spin mr-2"></i> : <i className="fa-solid fa-bolt-lightning mr-2"></i>}
                            Initialize Intelligence Scan
                        </button>
                        <div className="space-y-6 max-h-[480px] overflow-y-auto no-scrollbar pr-1">
                            {viralSuggestions.map((s, i) => (
                                <div key={i} className="p-6 bg-slate-950 border border-white/5 rounded-3xl space-y-4 group hover:border-indigo-500/40 transition-all shadow-inner relative overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xs font-black text-white leading-tight uppercase group-hover:text-indigo-400 transition-colors flex-1 pr-4">{s.topic}</h4>
                                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{s.velocityScore}% Vel</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white/5 rounded-xl space-y-1">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Viral Hook</p>
                                            <p className="text-[10px] text-slate-200 font-medium italic leading-relaxed">"{s.viralHook}"</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl space-y-1">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pattern/Visuals</p>
                                            <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{s.patternDescription}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] text-indigo-400 font-black uppercase">
                                            <i className="fa-solid fa-music"></i>
                                            <span>{s.trendingAudio}</span>
                                        </div>
                                    </div>

                                    <button onClick={() => applySuggestion(s)} className="w-full py-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-indigo-500/20">Import Trend Logic</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center opacity-30 animate-pulse">
                        <i className="fa-solid fa-terminal text-6xl mb-6"></i>
                        <p className="text-[11px] font-tech uppercase tracking-[0.4em]">Sector Idle</p>
                    </div>
                )}
            </div>
        </div>

        {/* MAIN COMPOSER HUB */}
        <div className="xl:col-span-8 space-y-10">
            <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 shadow-2xl relative overflow-hidden bg-gradient-to-br from-indigo-900/10 via-slate-950 to-transparent">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="space-y-10 relative z-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[11px] font-tech text-slate-500 uppercase tracking-[0.4em]">Operational Prompt</label>
                            <span className="text-[10px] font-tech font-black text-indigo-400 bg-indigo-600/10 px-4 py-1.5 rounded-full border border-indigo-500/20">Frequency: Synced</span>
                        </div>
                        <textarea 
                            value={prompt} 
                            onChange={e => setPrompt(e.target.value)} 
                            placeholder="Initialize broadcast sequence payload..."
                            className="w-full bg-slate-950/80 border border-white/10 rounded-[2.5rem] p-10 text-base text-white h-56 focus:ring-1 focus:ring-indigo-500 shadow-inner resize-none font-medium placeholder-slate-800 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] ml-2">Context Tags</label>
                            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="#Growth, #Viral, #Identity" className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-xs text-indigo-400 font-tech shadow-inner" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] ml-2">Vocal Signature (Tone)</label>
                            <div className="relative group">
                                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-5 text-xs text-white font-black appearance-none shadow-inner outline-none focus:border-indigo-500/50 hover:bg-slate-900 transition-colors">
                                    <option>Viral / Hype</option>
                                    <option>Dense / Technical</option>
                                    <option>B2B Professional</option>
                                    <option>Analytical Neutral</option>
                                    <option>Aggressive / Urgent</option>
                                </select>
                                <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] pointer-events-none group-hover:text-white transition-colors"></i>
                            </div>
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

            {/* TRANSMISSION PREVIEWS */}
            {generatedContent && (
                <div className="animate-in slide-in-from-bottom-12 duration-1000 space-y-10">
                    <div className="flex items-center justify-between px-4 border-l-4 border-indigo-600 py-2">
                        <div>
                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Transmission Previews</h3>
                            <p className="text-[10px] text-slate-500 font-tech uppercase tracking-widest mt-1">Multi-Channel Fidelity Audit</p>
                        </div>
                        {syncResults.length > 0 && (
                            <div className="flex gap-2">
                                {syncResults.map((res, i) => (
                                    <div key={i} title={res.platformId} className={`w-3 h-3 rounded-full ${res.status === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : res.status === 'failed' ? 'bg-rose-500 animate-pulse' : 'bg-slate-700 animate-pulse'}`}></div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {generatedContent.platformPosts?.map((post: any, i: number) => {
                            const result = syncResults.find(r => r.platformId === post.platformId);
                            return (
                                <div key={i} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                                    <PlatformPreview post={post} media={selectedMedia} onSaveDraft={handleSaveDraft} />
                                    {result && (
                                        <div className={`p-5 rounded-2xl border-2 animate-in zoom-in-95 duration-300 flex items-center justify-between shadow-xl ${result.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${result.status === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                                                    <i className={`fa-solid ${result.status === 'success' ? 'fa-check' : 'fa-triangle-exclamation'}`}></i>
                                                </div>
                                                <div>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${result.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>{result.status === 'success' ? 'Node Synchronized' : 'Sync Error'}</p>
                                                    {result.error && <p className="text-[11px] text-slate-300 font-medium italic mt-1 leading-snug">"{result.error}"</p>}
                                                </div>
                                            </div>
                                            {result.status === 'success' && <span className="text-[9px] font-tech text-slate-600 uppercase">Hash:{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="flex justify-center pt-10">
                        <button 
                            onClick={handleSynchronize}
                            disabled={isSyncing || generatedContent.platformPosts?.some((p: any) => p.platformId === 'twitter' && p.content.length > 280)}
                            className="px-20 py-6 bg-white text-black rounded-full font-display font-black text-lg uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_30px_80px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-40 disabled:grayscale flex items-center gap-6"
                        >
                            {isSyncing ? <i className="fa-solid fa-satellite fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                            {isSyncing ? 'Synchronizing Frequencies...' : 'Authorize Global Sync'}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BulkPublisher;
