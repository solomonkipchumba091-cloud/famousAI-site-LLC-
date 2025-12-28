import React from 'react';
import { ArrowRight, Sparkles, Code2, Zap, Users } from 'lucide-react';
import { useUIStore } from '@/lib/store';

const HERO_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/693b8b2371778ea8841619f8_1766436247231_b7c9984f.jpg';

export const HeroSection: React.FC = () => {
  const setActiveView = useUIStore((state) => state.setActiveView);

  const stats = [
    { icon: Code2, value: '100+', label: 'Products' },
    { icon: Users, value: '10K+', label: 'Developers' },
    { icon: Zap, value: '50K+', label: 'Downloads' }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>The Developer's AI Arsenal</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Ship Faster with{' '}
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Premium Dev Tools
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-400 mb-8 max-w-2xl">
            Discover 100+ curated SaaS starters, AI prompts, UI kits, and Cursor rules. 
            Build your next project in hours, not weeks.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => {
                const storeSection = document.getElementById('store-section');
                storeSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/25"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('workbench')}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-lg transition-all"
            >
              <Code2 className="w-5 h-5" />
              Try Prompt Builder
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
