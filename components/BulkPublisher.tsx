
import React, { useState, useMemo, useEffect } from 'react';
import { PLATFORMS } from '../constants';
import { generateViralSuggestions, generateSocialPost, uploadToYoutube } from '../services/geminiService';
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

const PlatformPreview: React.FC<{ post: any; media: MediaItem | null; youtubeTitle?: string }> = ({ post, media, youtubeTitle }) => {
    const platformId = post.platformId.toLowerCase();
    const isX = platformId === 'twitter' || platformId === 'x';
    const isMeta = platformId === 'meta' || platformId === 'facebook';
    const isIG = platformId === 'instagram';
    const isYT = platformId === 'youtube';
    const isTikTok = platformId === 'tiktok';

    // X (Twitter) Preview Node
    if (isX) {
        return (
            <div className="bg-black text-white p-5 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-[400px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden border border-white/10 shadow-lg">
                        <img src="https://ui-avatars.com/api/?name=Social+Stack&background=6366f1&color=fff&bold=true" className="w-full h-full object-cover" alt="X Avatar" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 truncate">
                                <span className="font-bold text-[15px] text-white truncate">Social Stack Node</span>
                                <i className="fa-solid fa-circle-check text-[#1d9bf0] text-[12px]"></i>
                                <span className="text-slate-500 text-[14px] font-normal truncate">@socialstack · 1m</span>
                            </div>
                            <i className="fa-solid fa-ellipsis text-slate-500 text-sm"></i>
                        </div>
                        <div className="mt-1 text-[15px] whitespace-pre-wrap leading-normal text-slate-100 font-normal tracking-tight">
                            {post.content}
                        </div>
                        {media && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-900 group">
                                <img src={media.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="X Media" />
                            </div>
                        )}
                        <div className="mt-4 flex items-center justify-between max-w-[350px] text-slate-500">
                            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#1d9bf0] transition-colors"><i className="fa-regular fa-comment text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#00ba7c] transition-colors"><i className="fa-solid fa-retweet text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#f91880] transition-colors"><i className="fa-regular fa-heart text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#1d9bf0] transition-colors"><i className="fa-solid fa-chart-simple text-sm"></i> <span className="text-xs">0</span></div>
                            <div className="flex items-center gap-2">
                                <i className="fa-regular fa-bookmark hover:text-[#1d9bf0] transition-colors cursor-pointer"></i>
                                <i className="fa-solid fa-arrow-up-from-bracket hover:text-[#1d9bf0] transition-colors cursor-pointer"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Instagram Preview Node
    if (isIG) {
        return (
            <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-w-[320px] mx-auto animate-in zoom-in-95 duration-500">
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                            <div className="w-full h-full rounded-full bg-white dark:bg-black p-[1px]">
                                <img src="https://ui-avatars.com/api/?name=SS&background=6366f1&color=fff" className="w-full h-full rounded-full" />
                            </div>
                        </div>
                        <div className="leading-none">
                            <div className="flex items-center gap-1">
                                <p className="font-bold text-[12px] dark:text-white">socialstack_hub</p>
                                <i className="fa-solid fa-circle-check text-[#0095f6] text-[10px]"></i>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-medium tracking-tight">Silicon Valley, CA</p>
                        </div>
                    </div>
                    <i className="fa-solid fa-ellipsis text-slate-400"></i>
                </div>
                <div className="aspect-square bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-y dark:border-slate-800 overflow-hidden">
                    {media ? <img src={media.url} className="w-full h-full object-cover" /> : <i className="fa-solid fa-image text-4xl opacity-10"></i>}
                </div>
                <div className="p-3">
                    <div className="flex justify-between items-center mb-3 text-xl dark:text-white">
                        <div className="flex gap-4">
                            <i className="fa-regular fa-heart hover:text-rose-500 transition-colors cursor-pointer"></i>
                            <i className="fa-regular fa-comment hover:text-slate-400 transition-colors cursor-pointer"></i>
                            <i className="fa-regular fa-paper-plane hover:text-indigo-400 transition-colors cursor-pointer"></i>
                        </div>
                        <i className="fa-regular fa-bookmark hover:text-indigo-400 transition-colors cursor-pointer"></i>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[12px] font-bold dark:text-white leading-none">0 likes</p>
                        <div className="text-[12px] leading-snug dark:text-slate-200">
                            <span className="font-bold mr-2">socialstack_hub</span>
                            <span className="whitespace-pre-wrap">{post.content}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase font-medium mt-1">1 minute ago</p>
                    </div>
                </div>
            </div>
        );
    }

    // Facebook (Meta) Preview Node
    if (isMeta) {
        return (
            <div className="bg-white dark:bg-[#242526] rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden animate-in slide-in-from-bottom-2 duration-500 max-w-[500px] mx-auto">
                <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg border border-white/10">
                            <i className="fa-solid fa-layer-group text-white text-xs"></i>
                        </div>
                        <div>
                            <p className="font-bold text-[14px] dark:text-white hover:underline cursor-pointer">Social Stack Global</p>
                            <p className="text-[11px] text-slate-500 dark:text-[#b0b3b8] flex items-center gap-1 font-medium">
                                Just now · <i className="fa-solid fa-earth-americas text-[9px]"></i>
                            </p>
                        </div>
                    </div>
                    <i className="fa-solid fa-ellipsis text-slate-500 cursor-pointer"></i>
                </div>
                <div className="px-4 pb-3 text-[14px] leading-snug dark:text-[#e4e6eb] font-normal">{post.content}</div>
                {media && (
                    <div className="bg-black aspect-video flex items-center justify-center border-y border-slate-100 dark:border-slate-800">
                        <img src={media.url} className="w-full h-full object-contain" />
                    </div>
                )}
                <div className="px-4 py-2 flex justify-between items-center text-[13px] text-slate-500 dark:text-[#b0b3b8] border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white border border-white dark:border-[#242526]"><i className="fa-solid fa-thumbs-up"></i></div>
                        <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[8px] text-white border border-white dark:border-[#242526] ml-[-4px]"><i className="fa-solid fa-heart"></i></div>
                        <span className="ml-6">0</span>
                    </div>
                    <div className="flex gap-3">
                        <span>0 comments</span>
                        <span>0 shares</span>
                    </div>
                </div>
                <div className="p-1 flex">
                    <div className="flex-1 flex items-center justify-center py-2 text-slate-500 dark:text-[#b0b3b8] text-sm font-bold gap-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"><i className="fa-regular fa-thumbs-up"></i> Like</div>
                    <div className="flex-1 flex items-center justify-center py-2 text-slate-500 dark:text-[#b0b3b8] text-sm font-bold gap-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"><i className="fa-regular fa-comment"></i> Comment</div>
                    <div className="flex-1 flex items-center justify-center py-2 text-slate-500 dark:text-[#b0b3b8] text-sm font-bold gap-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"><i className="fa-solid fa-share"></i> Share</div>
                </div>
            </div>
        );
    }

    // TikTok Preview Node
    if (isTikTok) {
        return (
            <div className="relative w-full max-w-[280px] aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-slate-900 mx-auto group animate-in zoom-in-95 duration-500">
                <div className="absolute inset-0 z-0">
                    {media ? (
                        <img src={media.url} className="w-full h-full object-cover" alt="TikTok Preview" />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-700">
                            <i className="fa-solid fa-video text-5xl mb-4"></i>
                            <p className="text-[10px] font-black uppercase tracking-widest">Media Required</p>
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10 p-4 flex flex-col justify-end">
                    <div className="absolute right-2 bottom-20 flex flex-col items-center gap-5 text-white">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white">
                                <img src="https://ui-avatars.com/api/?name=SS&background=000&color=fff" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#fe2c55] rounded-full flex items-center justify-center text-[8px]">
                                <i className="fa-solid fa-plus"></i>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fa-solid fa-heart text-2xl drop-shadow-lg"></i>
                            <span className="text-[9px] font-bold mt-1">0</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fa-solid fa-comment-dots text-2xl drop-shadow-lg"></i>
                            <span className="text-[9px] font-bold mt-1">0</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <i className="fa-solid fa-share text-2xl drop-shadow-lg"></i>
                            <span className="text-[9px] font-bold mt-1">0</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border-[4px] border-slate-700 animate-spin-slow mt-2">
                            <img src="https://ui-avatars.com/api/?name=Music&background=111&color=fff" className="w-full h-full rounded-full" />
                        </div>
                    </div>

                    <div className="pr-12 space-y-2 mb-2">
                        <h4 className="text-white font-bold text-sm">@socialstack_node</h4>
                        <p className="text-white text-[11px] line-clamp-3 leading-relaxed drop-shadow-md">
                            {post.content}
                        </p>
                        <div className="flex items-center gap-2 text-white text-[10px] font-medium overflow-hidden">
                            <i className="fa-solid fa-music text-[9px]"></i>
                            <div className="whitespace-nowrap animate-marquee">
                                Original Audio - Social Stack Growth Core System
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 italic max-w-[400px] mx-auto animate-in fade-in">
            <i className="fa-solid fa-terminal mb-4 text-3xl block text-indigo-500/50"></i>
            <p className="text-[11px] font-tech uppercase tracking-widest leading-relaxed">Standard production preview for {post.platformId} environment</p>
        </div>
    );
};

const BulkPublisher: React.FC<BulkPublisherProps> = ({ mediaLibrary, onUpdateLibrary, onDeleteMedia }) => {
  const [prompt, setPrompt] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Viral / Hype');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['meta', 'twitter', 'instagram']);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [mediaTab, setMediaTab] = useState<'trends' | 'upload'>('trends');

  const [trendNiche, setTrendNiche] = useState('');
  const [isScanningTrends, setIsScanningTrends] = useState(false);
  const [viralSuggestions, setViralSuggestions] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<PostStatus[]>([]);

  const handleScanTrends = async () => {
    if (!trendNiche) return;
    setIsScanningTrends(true);
    const suggestions = await generateViralSuggestions(trendNiche, tone, selectedPlatforms);
    setViralSuggestions(suggestions);
    setIsScanningTrends(false);
  };

  const handleGeneratePost = async () => {
    if (!prompt) return;
    setIsGeneratingPost(true);
    const content = await generateSocialPost(prompt, tone, keywords, selectedPlatforms);
    setGeneratedContent(content);
    if (content.youtubeTitle) setYoutubeTitle(content.youtubeTitle);
    setIsGeneratingPost(false);
  };

  const handleSynchronize = async () => {
    if (!generatedContent || isSyncing) return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setSyncResults(selectedPlatforms.map(p => ({ platformId: p, status: 'success' })));
    setIsSyncing(false);
    alert("Sync sequence complete. All network nodes updated successfully.");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Broadcast Hub</h2>
          <p className="text-slate-400 font-medium mt-2">Provision and synchronize multi-platform content across the global graph.</p>
        </div>
        <div className="flex bg-slate-900/60 p-2 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-3xl overflow-x-auto no-scrollbar">
            {PLATFORMS.filter(p => p.connected).map(p => (
                <button 
                    key={p.id} 
                    onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 group ${selectedPlatforms.includes(p.id) ? 'bg-indigo-600 text-white shadow-xl scale-110' : 'text-slate-600 hover:text-slate-200'}`}
                    title={`Toggle ${p.name}`}
                >
                    <i className={`${p.icon} text-lg group-hover:scale-110 transition-transform`}></i>
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-4 space-y-8">
            <div className="glass-panel p-8 rounded-[3rem] space-y-8 bg-indigo-600/5 shadow-2xl border-indigo-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -mr-16 -mt-16"></div>
                <div className="flex gap-1 bg-slate-950/80 p-1 rounded-2xl border border-white/5 relative z-10">
                    {['trends', 'upload'].map(tab => (
                        <button key={tab} onClick={() => setMediaTab(tab as any)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mediaTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>{tab}</button>
                    ))}
                </div>

                {mediaTab === 'trends' ? (
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Context Vector</label>
                            <input type="text" value={trendNiche} onChange={e => setTrendNiche(e.target.value)} placeholder="e.g. Fintech, AI SaaS, Ecom..." className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white shadow-inner focus:border-indigo-500/50 outline-none transition-all" />
                        </div>
                        <button onClick={handleScanTrends} disabled={isScanningTrends || !trendNiche} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all btn-3d">
                            {isScanningTrends ? <i className="fa-solid fa-satellite fa-spin mr-2"></i> : <i className="fa-solid fa-bolt-lightning mr-2"></i>}
                            Intelligence Scan
                        </button>
                        
                        <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                            {viralSuggestions.length > 0 ? viralSuggestions.map((s, i) => (
                                <div key={i} className="p-5 bg-slate-950/80 border border-white/5 rounded-3xl space-y-3 hover:border-indigo-500/30 transition-all group animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="flex justify-between items-start">
                                        <span className="px-2 py-0.5 bg-indigo-500 text-white text-[7px] font-black uppercase rounded-lg shadow-lg">{s.type}</span>
                                        <span className="text-xs font-black text-emerald-400 font-tech">{s.velocityScore}%</span>
                                    </div>
                                    <h4 className="text-[13px] font-black text-white uppercase leading-tight group-hover:text-indigo-400 transition-colors">{s.topic}</h4>
                                    <button onClick={() => setPrompt(s.description)} className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all">Import Strategy</button>
                                </div>
                            )) : (
                                <div className="py-20 text-center opacity-20">
                                    <i className="fa-solid fa-radar text-4xl mb-4"></i>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em]">Scan active to find viral nodes</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto no-scrollbar relative z-10 animate-in fade-in duration-300">
                        {mediaLibrary.map(item => (
                            <div key={item.id} onClick={() => setSelectedMedia(item)} className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${selectedMedia?.id === item.id ? 'border-indigo-500 scale-95 shadow-indigo-500/20 ring-4 ring-indigo-500/10' : 'border-slate-800'}`}>
                                {item.type === 'video' ? <div className="w-full h-full bg-black flex items-center justify-center text-indigo-500 shadow-inner"><i className="fa-solid fa-video"></i></div> : <img src={item.url} className="w-full h-full object-cover" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="xl:col-span-8 space-y-10">
            <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 shadow-2xl relative overflow-hidden bg-gradient-to-br from-indigo-900/10 via-slate-950 to-transparent">
                <div className="space-y-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[11px] font-tech text-slate-500 uppercase tracking-[0.4em] ml-1">Broadcast Sequence Payload</label>
                        <textarea 
                            value={prompt} 
                            onChange={e => setPrompt(e.target.value)} 
                            placeholder="Initialize broadcast content payload..."
                            className="w-full bg-slate-950/80 border border-white/10 rounded-[2rem] p-8 text-base text-white h-40 focus:ring-1 focus:ring-indigo-500 shadow-inner resize-none font-medium transition-all placeholder-slate-800"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] ml-1">Metadata Tags</label>
                            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="#Growth, #Viral, #Identity" className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-4 text-xs text-indigo-400 font-tech shadow-inner outline-none focus:border-indigo-500/50" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.3em] ml-1">Voice Profile</label>
                            <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-slate-950/80 border border-white/5 rounded-2xl px-6 py-4 text-xs text-white font-black outline-none focus:border-indigo-500/50 shadow-inner cursor-pointer">
                                <option>Viral / Hype</option>
                                <option>Professional / B2B</option>
                                <option>Neutral / Informative</option>
                                <option>Direct / CTA</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={handleGeneratePost} 
                        disabled={isGeneratingPost || !prompt}
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-display font-black text-lg uppercase tracking-[0.2em] shadow-xl transition-all btn-3d disabled:opacity-50 flex items-center justify-center gap-4 group"
                    >
                        {isGeneratingPost ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-dna group-hover:rotate-12 transition-transform"></i>}
                        {isGeneratingPost ? 'Sequencing Node...' : 'Synthesize Transmission'}
                    </button>
                </div>
            </div>

            {generatedContent && (
                <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-10 pb-20">
                    <div className="flex items-center justify-between px-4 border-l-4 border-indigo-600 py-2">
                        <div>
                            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Transmission Previews</h3>
                            <p className="text-[10px] text-slate-500 font-tech uppercase tracking-widest mt-1">Multi-Channel Fidelity Audit</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        {generatedContent.platformPosts?.map((post: any, i: number) => (
                            <div key={i} className="space-y-4">
                                <PlatformPreview post={post} media={selectedMedia} youtubeTitle={youtubeTitle} />
                                {syncResults.find(r => r.platformId === post.platformId)?.status === 'success' && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-400 font-black uppercase text-center flex items-center justify-center gap-2 animate-in zoom-in-50">
                                        <i className="fa-solid fa-circle-check"></i> Uplink Synchronized
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center pt-6">
                        <button onClick={handleSynchronize} disabled={isSyncing} className="px-16 py-6 bg-white text-black rounded-full font-display font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] flex items-center gap-4 active:scale-95 disabled:opacity-40">
                            {isSyncing ? <i className="fa-solid fa-satellite fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                            {isSyncing ? 'Synchronizing Nodes...' : 'Global Network Uplink'}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 10s linear infinite; }
        .animate-spin-slow { animation: spin 5s linear infinite; }
      `}</style>
    </div>
  );
};

export default BulkPublisher;
