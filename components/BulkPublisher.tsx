
import React, { useState, useMemo } from 'react';
import { PLATFORMS } from '../constants';
import { generateViralSuggestions, generateSocialPost, generateAIImage, getImportableContent } from '../services/geminiService';
import { MediaItem } from '../types';

interface BulkPublisherProps {
  mediaLibrary: MediaItem[];
  onUpdateLibrary: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

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
    
    if (post.platformId === 'twitter' || post.platformId === 'x') {
        const charCount = post.content?.length || 0;
        const isOverLimit = charCount > 280;

        return (
            <div className="bg-black text-white p-4 rounded-xl border border-slate-800 font-sans w-full max-w-[400px] mx-auto shadow-2xl relative overflow-hidden">
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
                        </div>
                        <div className="mt-1 text-[15px] whitespace-pre-wrap leading-normal text-slate-100">
                            <RichText text={post.content} />
                        </div>
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
                    </div>
                </div>
            </div>
        );
    }

    if (post.platformId === 'youtube') {
        return (
            <div className="bg-[#f9f9f9] dark:bg-[#0f0f0f] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden w-full max-w-[400px] mx-auto font-sans">
                <div className="w-full bg-slate-200 dark:bg-black aspect-video relative group">
                    {media ? (
                        isVideo ? <video src={media.url} className="w-full h-full object-cover" /> : <img src={media.url} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                             <i className="fa-brands fa-youtube text-4xl mb-2"></i>
                             <p className="text-[10px] font-bold uppercase">Video Node Required</p>
                        </div>
                    )}
                </div>
                <div className="p-4 space-y-3">
                    <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                             <img src="https://ui-avatars.com/api/?name=Brand&background=random" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">{post.metadata?.title || "Your Video Title Goes Here"}</h4>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">Your Brand • 0 views • Just now</div>
                        </div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 whitespace-pre-wrap">{post.content}</p>
                    </div>
                </div>
            </div>
        );
    }

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
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-[15px] leading-tight">Your Brand</p>
                                <div className="text-[12px] text-[#65676B] dark:text-[#B0B3B8]">Just now</div>
                            </div>
                        </div>
                        <div className="px-3 pb-3 text-[15px] whitespace-pre-wrap font-normal leading-normal">
                            <RichText text={post.content} highlightColor="text-[#1877F2] font-semibold" />
                        </div>
                        {media && (
                            <div className="w-full bg-black relative">
                                {isVideo ? <video src={media.url} className="w-full max-h-[400px] object-contain" controls /> : <img src={media.url} className="w-full h-auto object-cover" alt="Post media" />}
                            </div>
                        )}
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
                                <span className="text-[13px] font-semibold">yourbrand</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                            {media ? (isVideo ? <video src={media.url} className="w-full h-auto max-h-[450px] object-cover" controls /> : <img src={media.url} className="w-full h-auto object-cover" alt="Post media" />) : <div className="w-full aspect-square flex items-center justify-center text-slate-400 text-xs">No Media</div>}
                        </div>
                        <div className="p-3">
                            <div className="text-[13px]">
                                <span className="font-semibold mr-1">yourbrand</span>
                                <RichText text={post.content} className="whitespace-pre-wrap" highlightColor="text-[#00376B] dark:text-[#E0F1FF]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-[400px] mx-auto w-full relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 w-fit px-2 py-1 rounded-lg">
                <i className="fa-solid fa-layer-group"></i> {post.platformId} Preview
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-3">
                <RichText text={post.content} />
            </p>
            {media && <div className="rounded-lg overflow-hidden"><img src={media.url} className="w-full h-auto object-cover" /></div>}
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

  // Media Management State
  const [mediaTab, setMediaTab] = useState<'upload' | 'ai'>('upload');
  const [sortCriteria, setSortCriteria] = useState<'date' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imgPrompt, setImgPrompt] = useState('');

  // Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importableItems, setImportableItems] = useState<any[]>([]);
  const [isLoadingImports, setIsLoadingImports] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleUpdatePlatformContent = (platformId: string, field: string, value: string) => {
      setGeneratedContent((prev: any) => {
          if (!prev) return prev;
          const updatedPosts = prev.platformPosts.map((p: any) => {
              if (p.platformId === platformId) {
                  if (field === 'content') return { ...p, content: value };
                  return { ...p, metadata: { ...p.metadata, [field]: value } };
              }
              return p;
          });
          return { ...prev, platformPosts: updatedPosts };
      });
  };

  const handleGenerateIdeas = async () => {
    if (!keywords && !prompt) { alert("Please enter a topic or keywords first."); return; }
    setIsGeneratingIdeas(true);
    const ideas = await generateViralSuggestions(keywords || prompt, tone, selectedPlatforms);
    setViralSuggestions(ideas);
    setIsGeneratingIdeas(false);
  };

  const handleGeneratePost = async () => {
    if (!prompt) { alert("Please enter a prompt."); return; }
    setPublishError(null);
    setIsGeneratingPost(true);
    const content = await generateSocialPost(prompt, tone, keywords, selectedPlatforms);
    setGeneratedContent(content);
    setIsGeneratingPost(false);
  };

  const handleGenerateImage = async () => {
      const finalPrompt = imgPrompt || prompt || "A futuristic marketing visual";
      setIsGeneratingImage(true);
      const url = await generateAIImage(finalPrompt, { aspectRatio: '1:1', style: 'Photorealistic' });
      if(url) {
          const newItem: MediaItem = { id: 'ai_' + Date.now(), url, name: `AI_Gen_${Date.now()}.png`, type: 'image', date: new Date().toISOString() };
          onUpdateLibrary(newItem);
          setSelectedMedia(newItem);
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
          setSelectedMedia({ id: `import_${item.id}`, url: item.media, name: `Imported`, type: item.type === 'video' ? 'video' : 'image', date: new Date().toISOString() });
          setMediaTab('upload');
      }
      setShowImportModal(false);
  };

  const handleBatchDelete = () => {
      if (selectedIds.size === 0) return;
      if (confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) {
          selectedIds.forEach(id => onDeleteMedia(id));
          setSelectedIds(new Set());
      }
  };

  const toggleBatchSelect = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  const sortedMedia = useMemo(() => {
      return [...mediaLibrary].sort((a, b) => {
          if (sortCriteria === 'date') {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
          } else {
              return a.type.localeCompare(b.type);
          }
      });
  }, [mediaLibrary, sortCriteria, sortOrder]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Unified Publisher Node</h2>
          <p className="text-slate-400">Broadcast high-fidelity content across all social nodes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-indigo-500/20">
                <h3 className="text-lg font-bold text-white mb-4">1. Target Nodes</h3>
                <div className="flex flex-wrap gap-3">
                    {PLATFORMS.filter(p => p.connected).map(p => (
                        <button key={p.id} onClick={() => togglePlatform(p.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${selectedPlatforms.includes(p.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                            <i className={p.icon}></i>
                            <span className="text-[10px] font-black uppercase">{p.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4">2. AI Logic Settings</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tone Node</label>
                        <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white"><option>Professional</option><option>Viral / Hype</option><option>Casual</option><option>Witty</option></select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Context Keywords</label>
                         <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. #Web3, #Growth" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white" />
                    </div>
                </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl border-indigo-500/20 bg-indigo-950/10">
                <button onClick={handleGenerateIdeas} disabled={isGeneratingIdeas} className="w-full py-3 bg-indigo-600 rounded-xl font-black text-[10px] uppercase text-white flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-500 transition-all">
                    {isGeneratingIdeas ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                    AI Ideation Node
                </button>
                <div className="mt-4 space-y-2">
                    {viralSuggestions.slice(0, 3).map((idea, i) => (
                        <div key={i} onClick={() => { setPrompt(idea.suggestedAngle); setKeywords(idea.viralHook); }} className="p-3 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-800 border border-slate-800/50 transition-all group">
                             <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">{idea.type}</p>
                             <p className="text-[11px] font-bold text-slate-200 line-clamp-1 group-hover:text-white">{idea.topic}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-slate-700/50 min-h-[600px] flex flex-col shadow-2xl">
                <div className="mb-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Content Prompt</label>
                        <button onClick={handleOpenImport} className="text-[9px] font-black text-indigo-400 uppercase hover:text-indigo-300 transition-colors">Recall History</button>
                    </div>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter the core message or content description..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-white h-24 focus:ring-1 focus:ring-indigo-500 resize-none font-medium" />
                </div>

                {/* Media Management Section */}
                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                        <div className="flex gap-4">
                            <button onClick={() => setMediaTab('upload')} className={`pb-2 px-2 text-[10px] font-black uppercase tracking-widest transition-all ${mediaTab === 'upload' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>Library & Upload</button>
                            <button onClick={() => setMediaTab('ai')} className={`pb-2 px-2 text-[10px] font-black uppercase tracking-widest transition-all ${mediaTab === 'ai' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>AI Vision Studio</button>
                        </div>
                        <div className="flex gap-3">
                            {mediaTab === 'upload' && mediaLibrary.length > 0 && (
                                <button onClick={() => alert("Packaging all assets for download...")} className="text-[9px] font-black text-emerald-400 uppercase hover:text-emerald-300 flex items-center gap-1.5 transition-colors">
                                    <i className="fa-solid fa-cloud-arrow-down"></i> Export Archive
                                </button>
                            )}
                            {mediaTab === 'upload' && selectedIds.size > 0 && (
                                <button onClick={handleBatchDelete} className="text-[9px] font-black text-rose-500 uppercase hover:text-rose-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1">
                                    <i className="fa-solid fa-trash"></i> Delete Selected ({selectedIds.size})
                                </button>
                            )}
                        </div>
                    </div>

                    {mediaTab === 'upload' ? (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                                    <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value as any)} className="bg-transparent text-[9px] font-black text-slate-500 uppercase px-2 outline-none">
                                        <option value="date">By Date</option>
                                        <option value="type">By Type</option>
                                    </select>
                                    <div className="w-px h-3 bg-slate-800 self-center"></div>
                                    <button onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')} className="px-2 text-[9px] font-black text-indigo-400 uppercase">
                                        {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                                    </button>
                                </div>
                                <button onClick={() => document.getElementById('file-upload')?.click()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg">
                                    <i className="fa-solid fa-cloud-arrow-up"></i> New Asset
                                    <input id="file-upload" type="file" className="hidden" onChange={(e) => { if(e.target.files?.[0]) onUpdateLibrary({id: Date.now().toString(), url:URL.createObjectURL(e.target.files[0]), name:e.target.files[0].name, type: e.target.files[0].type.startsWith('video') ? 'video' : 'image', date: new Date().toISOString()}); }} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                                {sortedMedia.map((item) => (
                                    <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-800 transition-all hover:border-indigo-500/50">
                                        {item.type === 'video' ? (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                <i className="fa-solid fa-video text-slate-700 text-xl"></i>
                                            </div>
                                        ) : (
                                            <img src={item.url} className="w-full h-full object-cover" alt={item.name} />
                                        )}
                                        
                                        {/* Selection Layer for Post */}
                                        <div 
                                            onClick={() => setSelectedMedia(selectedMedia?.id === item.id ? null : item)}
                                            className={`absolute inset-0 cursor-pointer transition-all ${selectedMedia?.id === item.id ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-500/20' : 'bg-transparent group-hover:bg-black/40'}`}
                                        >
                                            {selectedMedia?.id === item.id && (
                                                <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <i className="fa-solid fa-check text-[8px] text-white"></i>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions Layer */}
                                        <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleBatchSelect(item.id); }}
                                                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${selectedIds.has(item.id) ? 'bg-rose-500 text-white' : 'bg-black/60 text-white/50 border border-white/20'}`}
                                            >
                                                {selectedIds.has(item.id) ? <i className="fa-solid fa-check text-[10px]"></i> : <i className="fa-regular fa-square text-[10px]"></i>}
                                            </button>
                                            <a 
                                                href={item.url}
                                                download={item.name}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-5 h-5 bg-emerald-600 text-white rounded-md flex items-center justify-center shadow-lg hover:bg-emerald-500"
                                            >
                                                <i className="fa-solid fa-download text-[9px]"></i>
                                            </a>
                                        </div>
                                        
                                        <div className="absolute top-1 left-1 pointer-events-none">
                                            <span className="text-[7px] font-black text-white/40 bg-black/40 px-1 rounded uppercase">{item.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900 p-6 rounded-2xl space-y-4 border border-slate-800 animate-in fade-in zoom-in-95">
                             <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Concept</label>
                                <input type="text" value={imgPrompt} onChange={e => setImgPrompt(e.target.value)} placeholder="e.g. A futuristic workspace with holographic screens..." className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-xs text-white font-medium" />
                             </div>
                             <button onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full py-4 bg-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3">
                                {isGeneratingImage ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : <i className="fa-solid fa-sparkles text-lg"></i>}
                                {isGeneratingImage ? 'Synthesizing Visual...' : 'Generate New Creative Asset'}
                             </button>
                        </div>
                    )}
                </div>

                <button onClick={handleGeneratePost} disabled={isGeneratingPost || !prompt} className="w-full py-5 bg-slate-800 rounded-2xl font-black text-sm uppercase tracking-widest text-white mb-8 hover:bg-slate-700 transition-all flex items-center justify-center gap-3 shadow-lg group">
                    {isGeneratingPost ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-layer-group group-hover:scale-110 transition-transform"></i>}
                    {isGeneratingPost ? 'Processing...' : 'Orchestrate Multi-Channel Content'}
                </button>
                
                {publishError && <p className="p-4 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase rounded-xl mb-8 border border-rose-500/20">{publishError}</p>}

                {generatedContent && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {generatedContent.platformPosts?.map((post: any, i: number) => (
                                <div key={i} className="space-y-5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{post.platformId} Terminal</span>
                                        <button onClick={() => setEditingPlatformId(editingPlatformId === post.platformId ? null : post.platformId)} className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors">
                                            {editingPlatformId === post.platformId ? 'Lock Buffer' : 'Edit Source'}
                                        </button>
                                    </div>
                                    {editingPlatformId === post.platformId && (
                                        <div className="space-y-4 p-5 bg-slate-800/50 rounded-2xl border border-slate-700 animate-in zoom-in-95">
                                            {post.platformId === 'youtube' && (
                                                <input type="text" value={post.metadata?.title || ''} onChange={e => handleUpdatePlatformContent(post.platformId, 'title', e.target.value)} placeholder="Video Node Title" className="w-full bg-slate-900 p-3 rounded-xl text-xs text-white border border-slate-700 font-bold" />
                                            )}
                                            <textarea value={post.content} onChange={e => handleUpdatePlatformContent(post.platformId, 'content', e.target.value)} className="w-full bg-slate-900 p-3 rounded-xl text-xs text-white h-24 border border-slate-700 resize-none font-medium" />
                                            {post.platformId === 'youtube' && (
                                                <input type="text" value={post.metadata?.tags || ''} onChange={e => handleUpdatePlatformContent(post.platformId, 'tags', e.target.value)} placeholder="Tags (comma separated)" className="w-full bg-slate-900 p-3 rounded-xl text-[10px] text-slate-400 border border-slate-700 font-mono" />
                                            )}
                                        </div>
                                    )}
                                    <PlatformPreview post={post} media={selectedMedia} />
                                </div>
                            ))}
                        </div>
                        
                        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-64 space-y-1">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Deployment Time</label>
                                <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white w-full focus:ring-1 focus:ring-indigo-500" />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto md:ml-auto">
                                <button onClick={() => alert('Saved as draft.')} className="flex-1 px-8 py-4 bg-slate-800 rounded-xl font-black text-xs uppercase tracking-widest text-white hover:bg-slate-700 transition-all">Save Draft</button>
                                <button onClick={() => alert('Broadcasting stack...')} className="flex-1 px-8 py-4 bg-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest text-white hover:bg-emerald-500 shadow-xl shadow-emerald-900/20 whitespace-nowrap transition-all btn-3d">Authorize Broadcast</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative">
                  <button onClick={() => setShowImportModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                      <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                  <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">History Recall</h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Re-deploy or iterate on previously synchronized content nodes.</p>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                      {isLoadingImports ? (
                          <div className="text-center py-20 text-slate-500"><i className="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>
                      ) : importableItems.map(item => (
                          <div key={item.id} onClick={() => handleImportSelect(item)} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all flex gap-4 items-center group">
                               <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                                   {item.media ? <img src={item.media} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" /> : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-font text-slate-600"></i></div>}
                               </div>
                               <div className="flex-1 overflow-hidden">
                                   <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">{item.content}</p>
                                   <div className="flex gap-3 mt-2">
                                       <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{item.platform}</span>
                                       <span className="text-[8px] font-bold text-slate-500 uppercase">{item.date}</span>
                                   </div>
                               </div>
                               <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-indigo-500 transition-colors"></i>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default BulkPublisher;
