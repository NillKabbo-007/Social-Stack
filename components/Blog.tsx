
import React from 'react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Mastering TikTok's 2024 Algorithm: What's Changed?",
    excerpt: "TikTok's latest update focuses more on high-retention storytelling than just trending sounds. Here's how to adapt...",
    author: "Elena Vance",
    date: "Oct 12, 2024",
    image: "https://picsum.photos/seed/tiktok/600/400"
  },
  {
    id: 2,
    title: "Why Multi-Channel Marketing is the Only Way to Scale",
    excerpt: "In a world of fragmented attention, relying on a single ad platform is dangerous. Diversification is your shield...",
    author: "Marcus Aurelius",
    date: "Oct 10, 2024",
    image: "https://picsum.photos/seed/scale/600/400"
  },
  {
    id: 3,
    title: "AI & Marketing: Beyond the Hype",
    excerpt: "Using Gemini and GPT for your copy is just the beginning. The real power lies in predictive analytics and strategy...",
    author: "Sarah Chen",
    date: "Oct 08, 2024",
    image: "https://picsum.photos/seed/ai/600/400"
  }
];

const Blog: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold">Marketing Insights Blog</h2>
        <p className="text-slate-400">Deep dives into strategy, platform updates, and AI innovations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map(post => (
          <div key={post.id} className="glass-panel overflow-hidden rounded-3xl group cursor-pointer hover:border-indigo-500/50 transition-all">
            <div className="h-48 overflow-hidden relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                <span>{post.date}</span>
                <span>5 min read</span>
              </div>
              <h3 className="text-xl font-bold leading-tight group-hover:text-indigo-400 transition-colors">{post.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              <div className="pt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                <span className="text-xs font-semibold text-slate-300">By {post.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-12 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-transparent text-center">
        <h3 className="text-2xl font-bold mb-4">Want specialized strategy delivered weekly?</h3>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join 15,000+ top marketers who receive our proprietary channel performance reports.</p>
        <div className="flex max-w-md mx-auto gap-3">
          <input type="email" placeholder="Your best email..." className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 text-sm" />
          <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-colors">Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
