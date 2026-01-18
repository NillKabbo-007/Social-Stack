
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
    suggestedAngle: string;
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

    // X (Twitter) Preview
    if (isX) {
        const xLimit = 280;
        const isOverLimit = charCount > xLimit;
        return (
            <div className={`bg-black text-white p-5 rounded-2xl border transition-all shadow-2xl relative font-sans ${isOverLimit ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-800'}`}>
                {isOverLimit && (
                    <div className="absolute -top-3 right-4 px-2 py-1 bg-rose-600 text-[9px] font-black uppercase rounded-md shadow-lg animate-bounce z-10">
                        Limit Exceeded: {charCount}/{xLimit}
                    </div>
                )}
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden border border-white/10">
                        <img src="https://ui-avatars.com/api/?name=Social+Stack&background=6366f1&color=fff&bold=true" className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[13px]">
                            <span className="font-bold truncate text-white">Social Stack</span>
                            <i className="fa-solid fa-circle-check text-[#1d9bf0] text-[10px]"></i>
                            <span className="text-slate-500 font-normal truncate">@socialstack · 1m</span>
                            <button 
                                onClick={handleSave}
                                className={`ml-auto text-xs font-black uppercase tracking-tighter transition-colors ${isSaved ? 'text-emerald-400' : 'text-slate-500 hover:text-[#1d9bf0]'}`}
                            >
                                {isSaved ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-bookmark"></i>}
                            </button>
                        </div>
                        <div className="mt-1 text-[14px] whitespace-pre-wrap leading-snug text-slate-100 font-normal tracking-tight">
                            {post.content}
                        </div>
                        
                        {media && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 shadow-xl aspect-video bg-slate-900 flex items-center justify-center">
                                <img src={media.url} className="w-full h-full object-cover" alt="X Media Content" />
                            </div>
                        )}

                        <div className="mt-4 flex items-center justify-between max-w-[320px] text-slate-500">
                            <i className="fa-regular fa-comment text-sm hover:text-[#1d9bf0] cursor-pointer transition-colors"></i>
                            <i className="fa-solid fa-retweet text-sm hover:text-[#00ba7c] cursor-pointer transition-colors"></i>
                            <i className="fa-regular fa-heart text-sm hover:text-[#f91880] cursor-pointer transition-colors"></i>
                            <i className="fa-solid fa-chart-simple text-sm hover:text-[#1d9bf0] cursor-pointer transition-colors"></i>
                            <i className="fa-regular fa-bookmark text-sm hover:text-[#1d9bf0] cursor-pointer transition-colors"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Facebook (Meta) Preview
    if (isMeta) {
        return (
            <div className="bg-[#242526] text-[#e4e6eb] rounded-xl border border-slate-700 shadow-2xl font-sans overflow-hidden">
                <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center border border-white/10">
                            <i className="fa-solid fa-layer-group text-white text-xs"></i>
                        </div>
                        <div>
                            <p className="font-bold text-[14px] leading-tight hover:underline cursor-pointer">Social Stack</p>
                            <p className="text-[12px] text-[#b0b3b8] flex items-center gap-1">1m · <i className="fa-solid fa-earth-americas text-[10px]"></i></p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className={`${isSaved ? 'text-emerald-400' : 'text-[#b0b3b8]'} hover:bg-white/5 w-8 h-8 rounded-full flex items-center justify-center`}>
                            <i className={isSaved ? "fa-solid fa-check" : "fa-solid fa-bookmark"}></i>
                        </button>
                        <i className="fa-solid fa-ellipsis text-[#b0b3b8] cursor-pointer p-2 hover:bg-white/5 rounded-full leading-none"></i>
                    </div>
                </div>
                <div className="px-4 pb-3 text-[14px] leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>
                {media && (
                    <div className="bg-black flex items-center justify-center border-y border-slate-700 aspect-video overflow-hidden">
                        <img src={media.url} className="w-full h-full object-cover" alt="FB Content" />
                    </div>
                )}
                <div className="p-1 px-4">
                    <div className="flex justify-between py-3 border-b border-slate-700 text-[#b0b3b8] text-[12px]">
                        <div className="flex items-center gap-1">
                            <span className="flex items-center justify-center w-4 h-4 bg-[#1877f2] rounded-full text-[8px] text-white">
                                <i className="fa-solid fa-thumbs-up"></i>
                            </span>
                            0
                        </div>
                        <div>0 comments · 0 shares</div>
                    </div>
                    <div className="grid grid-cols-3 py-1">
                        <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-md text-[#b0b3b8] font-bold text-[13px]">
                            <i className="fa-regular fa-thumbs-up"></i> Like
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-md text-[#b0b3b8] font-bold text-[13px]">
                            <i className="fa-regular fa-comment"></i> Comment
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded-md text-[#b0b3b8] font-bold text-[13px]">
                            <i className="fa-solid fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Instagram Preview
    if (isIG) {
        return (
            <div className="bg-black text-white rounded-xl border border-slate-800 shadow-2xl font-sans max-w-[400px] mx-auto overflow-hidden">
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                            <div className="w-full h-full rounded-full bg-black p-[2px]">
                                <img src="https://ui-avatars.com/api/?name=SS&background=6366f1&color=fff" className="w-full h-full rounded-full" alt="IG Avatar" />
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-[13px] leading-none">socialstack_global</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Silicon Valley, CA</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className={isSaved ? 'text-emerald-400' : 'text-white'}>
                            <i className={isSaved ? "fa-solid fa-check" : "fa-regular fa-bookmark"}></i>
                        </button>
                        <i className="fa-solid fa-ellipsis cursor-pointer"></i>
                    </div>
                </div>
                <div className="aspect-square bg-slate-900 overflow-hidden flex items-center justify-center border-y border-slate-800">
                    {media ? (
                        <img src={media.url} className="w-full h-full object-cover" alt="IG Post" />
                    ) : (
                        <div className="text-slate-700 flex flex-col items-center gap-2">
                            <i className="fa-solid fa-image text-4xl"></i>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Media</p>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-4 text-xl">
                            <i className="fa-regular fa-heart hover:text-rose-500 cursor-pointer transition-colors"></i>
                            <i className="fa-regular fa-comment hover:text-slate-400 cursor-pointer transition-colors"></i>
                            <i className="fa-regular fa-paper-plane hover:text-slate-400 cursor-pointer transition-colors"></i>
                        </div>
                        <i className="fa-regular fa-bookmark text-xl cursor-pointer"></i>
                    </div>
                    <p className="text-[13px] font-bold mb-1">0 likes</p>
                    <div className="text-[13px] leading-snug">
                        <span className="font-bold mr-2">socialstack_global</span>
                        <span className="whitespace-pre-wrap">{post.content}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-medium mt-2 tracking-tight">1 MINUTE AGO</p>
                </div>
            </div>
        );
    }

    // Generic Fallback
    return (
        <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-xl w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-[8px] font-tech uppercase rounded-lg border border-indigo-500/20">{post.platformId} Channel</div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-tech text-slate-500">{charCount} chars</span>
                    <button 
                        onClick={handleSave}
                        className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${isSaved ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}
                    >
                        {isSaved ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-bookmark" />}
                    </button>
                </div>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap mb-4 font-medium">{post.content}</div>
            {media && <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-video bg-slate-900"><img src={media.url} className="w-full h-full object-cover" /></div>}
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

  // Intelligence State
  const [trendNiche, setTrendNiche] = useState('');
  const [isScanningTrends, setIsScanningTrends] = useState(false);
  const [viralSuggestions, setViralSuggestions] = useState<ViralSuggestion[]>([]);

  // Transmission State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<PostStatus[]>([]);

  // Drafts State
  const [drafts, setDrafts] = useState<DraftPost[]>(() => {
    const saved = localStorage.getItem('socialstack_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('socialstack_drafts', JSON.stringify(drafts));
  }, [drafts]);

  // AI Laboratory State
  const [imagePrompt, setImagePrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [artStyle, setArtStyle] = useState('Photorealistic');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Script Generator State
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptDuration, setScriptDuration] = useState('30s');
  const [scriptPlatform, setScriptPlatform] = useState('TikTok');
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  // Sorting & Multi-select State
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'type'>('newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const sortedMedia = useMemo(() => {
    const list = [...mediaLibrary];
    if (sortBy === 'newest') {
        return list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'oldest') {
        return list.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortBy === 'type') {
        return list.sort((a, b) => a.type.localeCompare(b.type));
    }
    return list;
  }, [mediaLibrary, sortBy]);

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
        setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
        setSelectedIds(prev => [...prev, id]);
    }
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
    setPrompt(`${s.topic}: ${s.description}. Key Hook: ${s.viralHook}. Angle: ${s.suggestedAngle}`);
    setKeywords(s.topic.split(' ').join(', '));
    alert("Trending intelligence imported to Operational Prompt.");
  };

  const handleGeneratePost = async () => {
    if (!prompt) return;
    setIsGeneratingPost(true);
    setSyncResults([]); // Clear previous sync results
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

        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay

        let error: string | undefined;
        let finalStatus: 'success' | 'failed' = 'success';

        // X (Twitter) Specific Enforcement & Error Handling
        if (platformId === 'twitter' || platformId === 'x') {
            if (post.content.length > 280) {
                finalStatus = 'failed';
                error = 'Char limit violation (X requires < 280). Sync aborted.';
            } else if (selectedMedia && selectedMedia.type === 'video') {
                // Simulate a tier restriction error
                finalStatus = 'failed';
                error = 'X API Reject: Video nodes require Enterprise Identity tier.';
            } else if (!localStorage.getItem('socialstack_connected_apps')?.includes('twitter')) {
                finalStatus = 'failed';
                error = 'Identity Node Error: X OAuth token missing or expired.';
            }
        }

        const res: PostStatus = { platformId, status: finalStatus, error };
        results.push(res);
        setSyncResults([...results]);
    }

    setIsSyncing(false);
  };

  const handleSaveDraft = (platformId: string, content: string) => {
    const newDraft: DraftPost = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        platformId,
        content,
        mediaUrl: selectedMedia?.url,
        timestamp: new Date().toLocaleString()
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  const handleDeleteDraft = (id: string) => {
    if (confirm('Authorize draft deletion?')) {
        setDrafts(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleLoadDraft = (draft: DraftPost) => {
    setPrompt(draft.content);
    // Find media in library if possible
    if (draft.mediaUrl) {
        const media = mediaLibrary.find(m => m.url === draft.mediaUrl);
        if (media) setSelectedMedia(media);
    }
    setSelectedPlatforms([draft.platformId]);
    alert(`Draft loaded into composer for ${draft.platformId.toUpperCase()}.`);
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

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsGeneratingScript(true);
    const script = await generateVideoScript(scriptTopic, tone, scriptDuration, scriptPlatform);
    setGeneratedScript(script);
    setIsGeneratingScript(false);
  };

  const handleSaveScriptAsDraft = () => {
    if (!generatedScript) return;
    const content = `[VIDEO SCRIPT: ${generatedScript.title}]\n\nHOOK: ${generatedScript.hook}\n\n` + 
                    generatedScript.script.map((s: any, i: number) => `Scene ${i+1}:\nVisual: ${s.visual}\nAudio: ${s.audio}`).join('\n\n') +
                    `\n\nCTA: ${generatedScript.cta}`;
    
    handleSaveDraft(scriptPlatform.toLowerCase(), content);
    alert("Full script matrix saved to Drafts Vault.");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Broadcaster Core</h2>
          <p className="text-slate-400 font-medium">Provision and sync high-fidelity content across the global graph.</p>
        </div>
        <div className="flex bg-slate-900 border border-white/5 p-1.5 rounded-2xl shadow-2xl overflow-x-auto no-scrollbar max-w-full">
            {PLATFORMS.filter(p => p.connected).map(p => (
                <button 
                    key={p.id} 
                    onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${selectedPlatforms.includes(p.id) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
                >
                    <i className={p.icon}></i>
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-panel p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/5 blur-3xl rounded-full"></div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.2em]">Asset Laboratory</h3>
                    <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                        <button onClick={() => setMediaTab('upload')} className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase transition-all shrink-0 ${mediaTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}>Vault</button>
                        <button onClick={() => setMediaTab('trends')} className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase transition-all shrink-0 ${mediaTab === 'trends' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}>Trends</button>
                        <button onClick={() => setMediaTab('ai')} className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase transition-all shrink-0 ${mediaTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}>Creator</button>
                        <button onClick={() => setMediaTab('script')} className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase transition-all shrink-0 ${mediaTab === 'script' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}>Script</button>
                        <button onClick={() => setMediaTab('drafts')} className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase transition-all shrink-0 ${mediaTab === 'drafts' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}>Drafts</button>
                    </div>
                </div>

                {mediaTab === 'trends' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-3">
                            <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Niche Radar</label>
                            <input 
                                type="text" 
                                value={trendNiche} 
                                onChange={e => setTrendNiche(e.target.value)} 
                                placeholder="e.g. AI SaaS, Fitness, Web3..." 
                                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-xs font-medium text-white focus:ring-1 focus:ring-indigo-500" 
                            />
                        </div>
                        <button 
                            onClick={handleScanTrends} 
                            disabled={isScanningTrends || !trendNiche}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
                        >
                            {isScanningTrends ? <i className="fa-solid fa-satellite-dish fa-spin mr-2"></i> : <i className="fa-solid fa-magnifying-glass-chart mr-2"></i>}
                            Scan Viral Pulse
                        </button>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                            {viralSuggestions.map((s, i) => (
                                <div key={i} className="p-5 bg-slate-900/60 border border-white/5 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
                                    <div className="flex justify-between items-start">
                                        <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 text-[8px] font-black uppercase rounded border border-indigo-500/20">{s.type}</span>
                                        <div className="flex gap-1">
                                            {s.platforms.slice(0, 3).map(p => (
                                                <span key={p} className="w-1.5 h-1.5 rounded-full bg-slate-700" title={p}></span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white leading-tight mb-1">{s.topic}</h4>
                                        <p className="text-[10px] text-slate-400 line-clamp-2 italic">"{s.viralHook}"</p>
                                    </div>
                                    <button 
                                        onClick={() => applySuggestion(s)}
                                        className="w-full py-2 bg-slate-800 hover:bg-white hover:text-black rounded-xl text-[9px] font-black uppercase transition-all"
                                    >
                                        Import to Composer
                                    </button>
                                </div>
                            ))}
                            {viralSuggestions.length === 0 && !isScanningTrends && (
                                <div className="py-10 text-center opacity-20">
                                    <i className="fa-solid fa-bolt-lightning text-4xl mb-3"></i>
                                    <p className="text-[9px] font-black uppercase tracking-widest">No Intelligence Scanned</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : mediaTab === 'drafts' ? (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 max-h-[500px] overflow-y-auto no-scrollbar">
                        {drafts.length > 0 ? drafts.map(draft => (
                            <div key={draft.id} className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3 group hover:border-indigo-500/30 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                        <span className="text-[9px] font-tech text-indigo-400 uppercase font-black">{draft.platformId} Draft</span>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleLoadDraft(draft)} className="text-slate-400 hover:text-white"><i className="fa-solid fa-arrow-up-from-bracket text-[10px]"></i></button>
                                        <button onClick={() => handleDeleteDraft(draft.id)} className="text-slate-600 hover:text-rose-500"><i className="fa-solid fa-trash text-[10px]"></i></button>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed font-medium italic">"{draft.content}"</p>
                                <div className="flex justify-between items-center text-[8px] text-slate-600 font-tech uppercase tracking-widest pt-2 border-t border-white/5">
                                    <span>{draft.timestamp}</span>
                                    <span className="font-black">ID:{draft.id}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center space-y-4 opacity-30">
                                <i className="fa-solid fa-folder-open text-4xl"></i>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em]">No drafts archived</p>
                            </div>
                        )}
                    </div>
                ) : mediaTab === 'ai' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-3">
                            <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Synthesis Prompt</label>
                            <textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="Cyberpunk skyline, neon rain..." className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-xs font-medium text-white h-24 focus:ring-1 focus:ring-indigo-500 resize-none shadow-inner" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Aspect Ratio</label>
                                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-300 outline-none">
                                    <option value="1:1">1:1 Square</option>
                                    <option value="16:9">16:9 Landscape</option>
                                    <option value="9:16">9:16 Portrait</option>
                                    <option value="4:3">4:3 Desktop</option>
                                    <option value="3:4">3:4 Mobile</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Style DNA</label>
                                <select value={artStyle} onChange={e => setArtStyle(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-300 outline-none">
                                    <option>Photorealistic</option>
                                    <option>Cartoon / 3D Render</option>
                                    <option>Abstract Expressionism</option>
                                    <option>Cinematic Lighting</option>
                                    <option>Oil Painting</option>
                                    <option>Comic / Anime</option>
                                    <option>Vector Minimalist</option>
                                    <option>Cyberpunk Neon</option>
                                    <option>Low Poly 3D</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Negative Node (Restrictions)</label>
                            <input value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder="Blur, low res, watermark, letters..." className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-tech text-indigo-400/50 shadow-inner" />
                        </div>
                        <button onClick={handleGenerateImage} disabled={isGeneratingImage || !imagePrompt} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all btn-3d disabled:opacity-50">
                            {isGeneratingImage ? <i className="fa-solid fa-dna fa-spin mr-2"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>}
                            Synthesize Image
                        </button>
                    </div>
                ) : mediaTab === 'script' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        {generatedScript ? (
                            <div className="space-y-4">
                                <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] max-h-[450px] overflow-y-auto custom-scrollbar font-sans shadow-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-black text-white text-base leading-tight">{generatedScript.title}</h4>
                                        <button onClick={handleSaveScriptAsDraft} className="text-indigo-400 hover:text-white transition-colors text-xs font-black uppercase flex items-center gap-2"><i className="fa-solid fa-bookmark"></i> Save</button>
                                    </div>
                                    <div className="mb-6 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                                        <span className="text-[8px] font-tech text-indigo-400 uppercase font-black tracking-widest block mb-1">THE HOOK (0-3s)</span>
                                        <p className="text-xs text-indigo-100 font-medium italic">"{generatedScript.hook}"</p>
                                    </div>
                                    <div className="space-y-4">
                                        {generatedScript.script?.map((scene: any, i: number) => (
                                            <div key={i} className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5">
                                                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 flex-shrink-0 font-black border border-white/5">{i+1}</div>
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <i className="fa-regular fa-eye text-emerald-400 text-[10px]"></i>
                                                        <p className="text-[9px] text-emerald-400 font-black uppercase tracking-tight">{scene.visual}</p>
                                                    </div>
                                                    <p className="text-xs text-slate-300 leading-relaxed">"{scene.audio}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                                        <span className="text-[8px] font-tech text-slate-500 uppercase font-black tracking-widest block mb-1">CLOSING CALL TO ACTION</span>
                                        <p className="text-xs text-white font-bold">{generatedScript.cta}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setGeneratedScript(null)} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">New Script</button>
                                    <button onClick={handleSaveScriptAsDraft} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">Archive Draft</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Script Topic / Objective</label>
                                    <textarea value={scriptTopic} onChange={e => setScriptTopic(e.target.value)} placeholder="e.g. 5 SaaS Marketing Secrets that actually work..." className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-xs font-medium text-white h-28 focus:ring-1 focus:ring-indigo-500 resize-none shadow-inner" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Target Platform</label>
                                        <select value={scriptPlatform} onChange={e => setScriptPlatform(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-300 outline-none appearance-none">
                                            <option>TikTok</option>
                                            <option>Instagram Reels</option>
                                            <option>YouTube Shorts</option>
                                            <option>Facebook Reels</option>
                                            <option>Snapchat Spotlight</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Time Limit</label>
                                        <select value={scriptDuration} onChange={e => setScriptDuration(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-300 outline-none appearance-none">
                                            <option value="15s">15 Seconds</option>
                                            <option value="30s">30 Seconds</option>
                                            <option value="60s">60 Seconds</option>
                                            <option value="90s">90 Seconds</option>
                                        </select>
                                    </div>
                                </div>
                                <button onClick={handleGenerateScript} disabled={isGeneratingScript || !scriptTopic} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all btn-3d disabled:opacity-50">
                                    {isGeneratingScript ? <i className="fa-solid fa-scroll fa-spin mr-2"></i> : <i className="fa-solid fa-scroll mr-2"></i>}
                                    Synthesize Script
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex gap-2">
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-slate-900 border border-white/5 text-[9px] font-tech font-black text-slate-400 uppercase rounded-lg px-2 py-1 outline-none"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="type">By Type</option>
                                </select>
                            </div>
                            <button 
                                onClick={() => { setIsMultiSelectMode(!isMultiSelectMode); setSelectedIds([]); }}
                                className={`text-[9px] font-tech font-black uppercase transition-all ${isMultiSelectMode ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                                {isMultiSelectMode ? 'Cancel Selection' : 'Multi-Select'}
                            </button>
                        </div>

                        {selectedIds.length > 0 && (
                            <div className="flex items-center justify-between bg-indigo-600/10 border border-indigo-500/20 p-3 rounded-xl animate-in slide-in-from-top-2 duration-300">
                                <span className="text-[10px] font-tech font-black text-indigo-400 uppercase">{selectedIds.length} Assets Targeted</span>
                                <button 
                                    onClick={handleBatchDelete}
                                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[9px] font-black uppercase transition-all"
                                >
                                    Batch Purge
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto no-scrollbar">
                            {sortedMedia.map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => {
                                        if (isMultiSelectMode) {
                                            handleToggleSelect(item.id);
                                        } else {
                                            setSelectedMedia(selectedMedia?.id === item.id ? null : item);
                                        }
                                    }}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all relative group/item ${
                                        isMultiSelectMode 
                                            ? (selectedIds.includes(item.id) ? 'border-indigo-500 scale-95 shadow-xl ring-2 ring-indigo-500/30' : 'border-slate-800')
                                            : (selectedMedia?.id === item.id ? 'border-indigo-500 scale-95 shadow-lg' : 'border-slate-800 hover:border-slate-600')
                                    }`}
                                >
                                    <img src={item.url} className="w-full h-full object-cover" />
                                    {isMultiSelectMode && (
                                        <div className={`absolute top-1 right-1 w-4 h-4 rounded-full border border-white/20 flex items-center justify-center transition-all ${selectedIds.includes(item.id) ? 'bg-indigo-500 border-indigo-400' : 'bg-black/60'}`}>
                                            {selectedIds.includes(item.id) && <i className="fa-solid fa-check text-[8px] text-white"></i>}
                                        </div>
                                    )}
                                    <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/60 backdrop-blur rounded text-[6px] font-tech text-slate-400 uppercase pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        {item.type}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="xl:col-span-8 space-y-8">
            <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 shadow-2xl relative overflow-hidden group bg-gradient-to-br from-indigo-900/10 to-transparent">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="flex-1 w-full space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em]">Operational Prompt</label>
                                <span className="text-[10px] font-tech text-indigo-400 bg-indigo-600/10 px-3 py-1 rounded-xl">Node Sync: Ready</span>
                            </div>
                            <textarea 
                                value={prompt} 
                                onChange={e => setPrompt(e.target.value)} 
                                placeholder="Initialize broadcast sequence..."
                                className="w-full bg-slate-950 border border-white/5 rounded-[2rem] p-8 text-sm text-white h-48 focus:ring-1 focus:ring-indigo-500 shadow-inner resize-none font-medium placeholder-slate-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest ml-1">Context Keywords</label>
                                <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="#Growth, #AI" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs text-indigo-400 font-tech shadow-inner" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-tech text-slate-500 uppercase tracking-widest ml-1">Vocal Identity</label>
                                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs text-white font-bold appearance-none shadow-inner">
                                    <option>Viral / Hype</option>
                                    <option>Dense / Technical</option>
                                    <option>Professional</option>
                                    <option>Analytical</option>
                                </select>
                            </div>
                        </div>

                        <button 
                            onClick={handleGeneratePost} 
                            disabled={isGeneratingPost || !prompt}
                            className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-display font-black text-lg uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] btn-3d disabled:opacity-50 flex items-center justify-center gap-4"
                        >
                            {isGeneratingPost ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-layer-group"></i>}
                            Authorize Broadcast
                        </button>
                    </div>

                    <div className="w-full md:w-64 space-y-6">
                        <div className="p-6 bg-slate-950/60 border border-white/5 rounded-[2.5rem] text-center space-y-4">
                            <p className="text-[10px] font-tech text-slate-500 uppercase tracking-widest">Stack Manifest</p>
                            <div className="space-y-2 font-tech">
                                <div className="flex justify-between text-[11px] text-slate-400 px-2"><span>Nodes</span><span className="text-white">{selectedPlatforms.length}</span></div>
                                <div className="flex justify-between text-[11px] text-slate-400 px-2"><span>Media</span><span className={selectedMedia ? 'text-emerald-400' : 'text-slate-600'}>{selectedMedia ? 'Ready' : 'None'}</span></div>
                                <div className="flex justify-between text-[11px] text-slate-400 px-2"><span>Model</span><span className="text-indigo-400">G3.0</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {generatedContent && (
                <div className="animate-in slide-in-from-bottom-12 duration-700 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-eye text-indigo-400"></i>
                            <h3 className="text-lg font-display font-black text-white uppercase tracking-tighter">Transmission Previews</h3>
                        </div>
                        {syncResults.length > 0 && (
                            <div className="px-4 py-2 bg-slate-900 border border-white/5 rounded-2xl flex items-center gap-3 text-[10px] font-tech animate-in zoom-in-95">
                                <span className="text-slate-500 uppercase">Batch Sync State:</span>
                                <div className="flex gap-1.5">
                                    {syncResults.map((res, i) => (
                                        <div key={i} title={`${res.platformId}: ${res.status}${res.error ? ' - ' + res.error : ''}`} className={`w-3 h-3 rounded-full ${res.status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : res.status === 'failed' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-slate-700 animate-pulse'}`}></div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {generatedContent.platformPosts?.map((post: any, i: number) => {
                            const result = syncResults.find(r => r.platformId === post.platformId);
                            return (
                                <div key={i} className="space-y-4">
                                    <PlatformPreview post={post} media={selectedMedia} onSaveDraft={handleSaveDraft} />
                                    {result && result.status === 'failed' && (
                                        <div className="p-4 bg-rose-950/30 border border-rose-500/20 rounded-2xl animate-in slide-in-from-top-2">
                                            <p className="text-[10px] font-black text-rose-400 uppercase flex items-center gap-2">
                                                <i className="fa-solid fa-triangle-exclamation"></i> Sync Error
                                            </p>
                                            <p className="text-[11px] text-slate-300 mt-1 font-medium italic">"{result.error}"</p>
                                        </div>
                                    )}
                                    {result && result.status === 'success' && (
                                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl animate-in slide-in-from-top-2 flex items-center justify-between">
                                            <p className="text-[9px] font-black text-emerald-400 uppercase flex items-center gap-2">
                                                <i className="fa-solid fa-circle-check"></i> Node Synchronized
                                            </p>
                                            <span className="text-[8px] font-tech text-slate-600 uppercase">TX:{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="flex justify-center pt-8">
                        <button 
                            onClick={handleSynchronize}
                            disabled={isSyncing || generatedContent.platformPosts?.some((p: any) => p.platformId === 'twitter' && p.content.length > 280)}
                            className="px-16 py-5 bg-white text-black rounded-full font-display font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-4"
                        >
                            {isSyncing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                            {isSyncing ? 'Synchronizing Frequencies...' : 'Authorize Global Synchronization'}
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
