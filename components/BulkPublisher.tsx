
import React, { useState } from 'react';
import { PLATFORMS } from '../constants';
import { generateViralSuggestions, generateSocialPost, generateAIImage } from '../services/geminiService';
import { MediaItem } from '../types';

interface BulkPublisherProps {
  mediaLibrary: MediaItem[];
  onUpdateLibrary: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

const PlatformPreview: React.FC<{ post: any; media: MediaItem | null }> = ({ post, media }) => {
    const isX = post.platformId === 'twitter' || post.platformId === 'x';
    const charCount = post.content.length;
    const xLimit = 280;
    const isOverLimit = isX && charCount > xLimit;

    if (isX) {
        return (
            <div className={`bg-black text-white p-5 rounded-2xl border transition-all shadow-2xl relative font-sans ${isOverLimit ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-800'}`}>
                {isOverLimit && (
                    <div className="absolute -top-3 right-4 px-2 py-1 bg-rose-600 text-[9px] font-black uppercase rounded-md shadow-lg animate-bounce">
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
                            <div className="ml-auto text-slate-500 hover:text-[#1d9bf0] cursor-pointer">
                                <i className="fa-solid fa-ellipsis"></i>
                            </div>
                        </div>
                        <div className="mt-1 text-[14px] whitespace-pre-wrap leading-tight text-slate-100 font-normal tracking-tight">
                            {post.content}
                        </div>
                        
                        {media && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 shadow-xl aspect-video bg-slate-900 flex items-center justify-center">
                                <img src={media.url} className="w-full h-full object-cover" alt="X Media Content" />
                            </div>
                        )}

                        <div className="mt-4 flex items-center justify-between max-w-[320px] text-slate-500">
                            <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors cursor-pointer group">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10">
                                    <i className="fa-regular fa-comment text-sm"></i>
                                </div>
                                <span className="text-[11px]">0</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-[#00ba7c] transition-colors cursor-pointer group">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#00ba7c]/10">
                                    <i className="fa-solid fa-retweet text-sm"></i>
                                </div>
                                <span className="text-[11px]">0</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-[#f91880] transition-colors cursor-pointer group">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#f91880]/10">
                                    <i className="fa-regular fa-heart text-sm"></i>
                                </div>
                                <span className="text-[11px]">0</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors cursor-pointer group">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10">
                                    <i className="fa-solid fa-chart-simple text-sm"></i>
                                </div>
                                <span className="text-[11px]">0</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors cursor-pointer group">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10">
                                    <i className="fa-regular fa-bookmark text-sm"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-xl w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-[8px] font-tech uppercase rounded-lg border border-indigo-500/20">{post.platformId} Channel</div>
                <span className="text-[10px] font-tech text-slate-500">{charCount} chars</span>
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
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['meta', 'tiktok', 'twitter']);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [mediaTab, setMediaTab] = useState<'upload' | 'ai'>('upload');

  // AI Laboratory State
  const [imagePrompt, setImagePrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [artStyle, setArtStyle] = useState('Photorealistic');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleGeneratePost = async () => {
    if (!prompt) return;
    setIsGeneratingPost(true);
    const content = await generateSocialPost(prompt, tone, keywords, selectedPlatforms);
    setGeneratedContent(content);
    setIsGeneratingPost(false);
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Broadcaster Core</h2>
          <p className="text-slate-400 font-medium">Provision and sync high-fidelity content across the global graph.</p>
        </div>
        <div className="flex bg-slate-900 border border-white/5 p-1.5 rounded-2xl shadow-2xl">
            {PLATFORMS.filter(p => p.connected).map(p => (
                <button 
                    key={p.id} 
                    onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedPlatforms.includes(p.id) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
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
                    <div className="flex gap-4">
                        <button onClick={() => setMediaTab('upload')} className={`text-[9px] font-black uppercase transition-all ${mediaTab === 'upload' ? 'text-indigo-400' : 'text-slate-600'}`}>Vault</button>
                        <button onClick={() => setMediaTab('ai')} className={`text-[9px] font-black uppercase transition-all ${mediaTab === 'ai' ? 'text-indigo-400 underline underline-offset-8' : 'text-slate-600'}`}>Creator</button>
                    </div>
                </div>

                {mediaTab === 'ai' ? (
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
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Style DNA</label>
                                <select value={artStyle} onChange={e => setArtStyle(e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-300 outline-none">
                                    <option>Photorealistic</option>
                                    <option>Comic / Anime</option>
                                    <option>Cyberpunk</option>
                                    <option>Low Poly 3D</option>
                                    <option>Minimalist</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-tech text-slate-500 uppercase tracking-widest ml-1">Negative Node</label>
                            <input value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder="Blur, low res, watermark..." className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] font-tech text-indigo-400/50 shadow-inner" />
                        </div>
                        <button onClick={handleGenerateImage} disabled={isGeneratingImage || !imagePrompt} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all btn-3d disabled:opacity-50">
                            {isGeneratingImage ? <i className="fa-solid fa-dna fa-spin mr-2"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>}
                            Synthesize Image
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto no-scrollbar">
                        {mediaLibrary.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => setSelectedMedia(selectedMedia?.id === item.id ? null : item)}
                                className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${selectedMedia?.id === item.id ? 'border-indigo-500 scale-95 shadow-lg' : 'border-slate-800 hover:border-slate-600'}`}
                            >
                                <img src={item.url} className="w-full h-full object-cover" />
                            </div>
                        ))}
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
                    <div className="flex items-center gap-3 px-2">
                        <i className="fa-solid fa-eye text-indigo-400"></i>
                        <h3 className="text-lg font-display font-black text-white uppercase tracking-tighter">Transmission Previews</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {generatedContent.platformPosts?.map((post: any, i: number) => (
                            <PlatformPreview key={i} post={post} media={selectedMedia} />
                        ))}
                    </div>
                    <div className="flex justify-center pt-8">
                        <button 
                            disabled={generatedContent.platformPosts?.some((p: any) => p.platformId === 'twitter' && p.content.length > 280)}
                            className="px-16 py-5 bg-white text-black rounded-full font-display font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 disabled:opacity-50 disabled:grayscale"
                        >
                            Authorize Global Synchronization
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
