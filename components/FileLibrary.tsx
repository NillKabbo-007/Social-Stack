
import React, { useState, useRef } from 'react';
import { MediaItem } from '../types';

interface FileLibraryProps {
  mediaLibrary: MediaItem[];
  onUpdateLibrary: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

const FileLibrary: React.FC<FileLibraryProps> = ({ mediaLibrary, onUpdateLibrary, onDeleteMedia }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = mediaLibrary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      Array.from(e.target.files).forEach((fileVal, index) => {
        const file = fileVal as File;
        setTimeout(() => {
          let type: 'image' | 'video' | 'document' = 'document';
          if (file.type.startsWith('image/')) type = 'image';
          else if (file.type.startsWith('video/')) type = 'video';
          
          const url = URL.createObjectURL(file);
          const newItem: MediaItem = {
            id: (Date.now() + index).toString(),
            url,
            name: file.name,
            type: type,
            date: new Date().toISOString().split('T')[0],
            size: `${(file.size / 1024).toFixed(1)} KB`
          };
          onUpdateLibrary(newItem);
          if (e.target.files && index === e.target.files.length - 1) setIsUploading(false);
        }, 500 * (index + 1));
      });
    }
  };

  const getFileIcon = (fileName: string, type: string) => {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (type === 'image') return 'fa-regular fa-image';
      if (type === 'video') return 'fa-solid fa-video';
      if (ext === 'pdf') return 'fa-solid fa-file-pdf';
      if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'fa-solid fa-file-csv';
      if (['doc', 'docx'].includes(ext || '')) return 'fa-solid fa-file-word';
      return 'fa-solid fa-file';
  };

  const getFileColor = (fileName: string, type: string) => {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (type === 'image') return 'text-purple-400';
      if (type === 'video') return 'text-rose-400';
      if (ext === 'pdf') return 'text-red-500';
      if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'text-emerald-500';
      if (['doc', 'docx'].includes(ext || '')) return 'text-blue-500';
      return 'text-slate-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Data & Asset Hub</h2>
          <p className="text-slate-400 text-sm font-medium">Centralized storage for creative assets and data imports.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleUpload} 
            multiple 
            accept="image/*,video/*,.pdf,.csv,.xlsx,.xls,.doc,.docx,.txt"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-3 bg-cyan-600 rounded-xl font-bold text-white text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all flex items-center gap-2 shadow-lg"
          >
            {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            {isUploading ? 'Importing...' : 'Import Data / File'}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-64">
           <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
           <input 
             type="text" 
             value={search} 
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search contacts, pdfs, images..."
             className="w-full bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500"
           />
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
           {['all', 'document', 'image', 'video'].map(ft => (
             <button 
               key={ft} 
               onClick={() => setFilterType(ft as any)}
               className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${filterType === ft ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
             >
               {ft === 'document' ? 'Data / Docs' : ft}
             </button>
           ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-all shadow-lg flex flex-col">
              
              {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              ) : item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
              ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/80 p-4">
                      <i className={`${getFileIcon(item.name, item.type)} text-6xl mb-2 ${getFileColor(item.name, item.type)}`}></i>
                  </div>
              )}

              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded bg-white/20 backdrop-blur-md text-white`}>
                        {item.name.split('.').pop()}
                    </span>
                </div>
                <div>
                    <p className="text-white text-xs font-bold truncate mb-1" title={item.name}>{item.name}</p>
                    <p className="text-[9px] text-slate-400 mb-3">{item.size || 'Unknown Size'}</p>
                    <div className="flex justify-between items-center gap-2">
                        <a href={item.url} download={item.name} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-1.5 rounded-lg text-[10px] font-bold uppercase text-center transition-colors">Download</a>
                        <button 
                            onClick={() => {
                                if(confirm('Delete this file?')) onDeleteMedia(item.id);
                            }}
                            className="text-rose-400 hover:text-rose-300 px-2"
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
              </div>
              
              {/* Type Badge for static view */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur rounded px-2 py-1 text-[9px] font-bold text-white uppercase pointer-events-none group-hover:opacity-0 transition-opacity">
                {item.type === 'document' ? 'DOC' : item.type}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
          <i className="fa-solid fa-cloud-arrow-up text-4xl mb-4 opacity-50"></i>
          <p className="text-sm font-bold uppercase tracking-widest">Import Content, Contacts, or Docs.</p>
          <p className="text-xs mt-2">Supports .CSV, .PDF, .XLS, .JPG, .MP4</p>
        </div>
      )}
    </div>
  );
};

export default FileLibrary;
