
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
  const [filterDate, setFilterDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = mediaLibrary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesDate = !filterDate || item.date === filterDate;
    return matchesSearch && matchesType && matchesDate;
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

  const clearFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterDate('');
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
      if (type === 'image') return 'text-brand-primary';
      if (type === 'video') return 'text-brand-secondary';
      if (ext === 'pdf') return 'text-rose-500';
      if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'text-emerald-500';
      if (['doc', 'docx'].includes(ext || '')) return 'text-blue-500';
      return 'text-slate-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Data & Asset Hub</h2>
          <p className="text-slate-400 text-sm font-medium">Centralized storage for creative nodes and operational data.</p>
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
            className="px-8 py-4 bg-indigo-600 rounded-2xl font-display font-black text-white text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-3 shadow-xl btn-3d"
          >
            {isUploading ? <i className="fa-solid fa-sync fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            {isUploading ? 'Syncing...' : 'Provision Asset'}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 p-6 bg-slate-950/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
        <div className="relative flex-1 group">
           <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"></i>
           <input 
             type="text" 
             value={search} 
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search node name, type, or extension..."
             className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:ring-1 focus:ring-indigo-500 shadow-inner font-tech"
           />
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5 shadow-inner">
              {['all', 'document', 'image', 'video'].map(ft => (
                <button 
                  key={ft} 
                  onClick={() => setFilterType(ft as any)}
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-tech font-black uppercase transition-all whitespace-nowrap ${filterType === ft ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {ft === 'document' ? 'Data' : ft}
                </button>
              ))}
           </div>

           <div className="relative group">
              <input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-[10px] font-tech font-black text-white uppercase outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner appearance-none min-w-[160px] cursor-pointer"
              />
              {!filterDate && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-[10px]">
                  <i className="fa-solid fa-calendar-day"></i>
                </div>
              )}
           </div>

           {(search || filterType !== 'all' || filterDate) && (
              <button 
                onClick={clearFilters}
                className="px-5 py-3 text-[10px] font-tech font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-trash-can-arrow-up"></i> Flush Filters
              </button>
           )}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col animate-in zoom-in-95 duration-300">
              
              {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              ) : item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
              ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4">
                      <i className={`${getFileIcon(item.name, item.type)} text-5xl mb-3 ${getFileColor(item.name, item.type)}`}></i>
                  </div>
              )}

              <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                    <span className="text-[8px] font-tech font-black uppercase px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white shadow-lg">
                        {item.name.split('.').pop()}
                    </span>
                    <span className="text-[8px] font-tech font-black text-slate-500 uppercase tracking-widest">{item.date}</span>
                </div>
                <div>
                    <p className="text-white text-[11px] font-tech font-bold truncate mb-1" title={item.name}>{item.name}</p>
                    <p className="text-[9px] text-slate-500 font-tech mb-4 tracking-tighter">{item.size || 'Unchecked'}</p>
                    <div className="flex justify-between items-center gap-2">
                        <a href={item.url} download={item.name} className="flex-1 bg-white hover:bg-slate-200 text-black py-2 rounded-xl text-[9px] font-tech font-black uppercase text-center transition-all">Download</a>
                        <button 
                            onClick={() => {
                                if(confirm('Initiate destructive asset purge?')) onDeleteMedia(item.id);
                            }}
                            className="w-9 h-9 flex items-center justify-center bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                        >
                            <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-lg px-2 py-1 text-[8px] font-tech font-black text-white uppercase pointer-events-none group-hover:opacity-0 transition-opacity border border-white/10">
                {item.type === 'document' ? 'DATA' : item.type}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 glass-panel rounded-[3.5rem] border-dashed border-white/10">
          <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] border border-white/5 flex items-center justify-center mx-auto mb-6 text-slate-800">
            <i className="fa-solid fa-box-open text-3xl"></i>
          </div>
          <p className="text-slate-500 font-tech font-black uppercase tracking-widest">No active asset nodes detected</p>
          <p className="text-[10px] text-slate-700 mt-2 font-medium">ADJUST DEPLOYMENT FILTERS OR UPLOAD NEW SOURCE DATA</p>
          <button onClick={clearFilters} className="mt-8 text-indigo-400 font-tech font-black text-[10px] uppercase tracking-[0.2em] hover:text-indigo-300 transition-colors">Reset Global Logic</button>
        </div>
      )}
    </div>
  );
};

export default FileLibrary;
