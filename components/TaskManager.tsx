
import React, { useState, useMemo } from 'react';
import { Task } from '../types';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Optimize TikTok Ad Creative', priority: 'High', dueDate: '2026-02-15', completed: false, category: 'Content' },
  { id: '2', title: 'Sync Meta Pixel with Checkout', priority: 'Medium', dueDate: '2026-02-12', completed: false, category: 'Technical' },
  { id: '3', title: 'Draft Twitter Thread for Launch', priority: 'Low', dueDate: '2026-02-20', completed: true, category: 'Social' },
  { id: '4', title: 'Audit SMM Panel Liquidity', priority: 'High', dueDate: '2026-02-10', completed: false, category: 'Finance' },
];

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, sortBy, sortOrder]);

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="glass-panel p-6 rounded-[2.5rem] border-slate-700/50 flex flex-col h-full overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
        <i className="fa-solid fa-list-check text-9xl"></i>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 relative z-10">
        <div>
          <h3 className="text-sm font-tech font-black text-white uppercase tracking-[0.2em]">Operational Stack</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Pending Campaign Actions</p>
        </div>
        
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 items-center">
            <span className="text-[9px] font-black text-slate-600 px-3 uppercase">Sort:</span>
            <button 
                onClick={() => {
                  if (sortBy === 'priority') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('priority'); setSortOrder('asc'); }
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${sortBy === 'priority' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
                onClick={() => {
                  if (sortBy === 'dueDate') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('dueDate'); setSortOrder('asc'); }
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${sortBy === 'dueDate' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pr-1 pb-4">
        {sortedTasks.map((task) => (
          <div key={task.id} className={`group p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center justify-between transition-all hover:border-white/10 ${task.completed ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button 
                onClick={() => toggleComplete(task.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-400' : 'border-slate-700 hover:border-indigo-500'}`}
              >
                {task.completed && <i className="fa-solid fa-check text-white text-[10px]"></i>}
              </button>
              <div className="truncate">
                <p className={`text-xs font-bold text-white tracking-tight uppercase ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                   <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                     task.priority === 'High' ? 'text-rose-400 border-rose-400/20 bg-rose-400/5' :
                     task.priority === 'Medium' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' :
                     'text-indigo-400 border-indigo-400/20 bg-indigo-400/5'
                   }`}>
                     {task.priority}
                   </span>
                   <span className="text-[8px] font-tech text-slate-600 uppercase tracking-tighter">
                     Due: {task.dueDate}
                   </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
               <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest hidden group-hover:inline opacity-0 group-hover:opacity-100 transition-opacity">ID:{task.id}</span>
               <button onClick={() => deleteTask(task.id)} className="text-slate-800 hover:text-rose-500 transition-colors">
                 <i className="fa-solid fa-trash-can text-[10px]"></i>
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_#6366f1] animate-pulse"></div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Sync: Frequency Locked</span>
         </div>
         <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
           <i className="fa-solid fa-plus mr-1"></i> Add Task
         </button>
      </div>
    </div>
  );
};

export default TaskManager;
