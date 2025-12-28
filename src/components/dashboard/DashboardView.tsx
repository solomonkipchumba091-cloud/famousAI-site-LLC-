import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Key, 
  Settings,
  Download,
  Star,
  Clock,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  ExternalLink
} from 'lucide-react';

type TabType = 'overview' | 'purchases' | 'prompts' | 'licenses' | 'settings';

export const DashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'prompts', label: 'My Prompts', icon: FileText },
    { id: 'licenses', label: 'Licenses', icon: Key },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  // Mock data
  const stats = [
    { label: 'Products Owned', value: '12', icon: Package, color: 'from-purple-500 to-pink-500' },
    { label: 'Prompts Created', value: '8', icon: FileText, color: 'from-cyan-500 to-blue-500' },
    { label: 'Total Downloads', value: '156', icon: Download, color: 'from-green-500 to-emerald-500' },
    { label: 'Active Licenses', value: '12', icon: Key, color: 'from-orange-500 to-yellow-500' }
  ];

  const recentPurchases = [
    { id: '1', name: 'Ultimate SaaS Kit', date: '2024-12-20', price: 299 },
    { id: '2', name: 'Code Review Assistant', date: '2024-12-18', price: 19 },
    { id: '3', name: 'Dashboard UI Kit', date: '2024-12-15', price: 79 }
  ];

  const recentPrompts = [
    { id: '1', name: 'API Documentation Generator', runs: 45, lastRun: '2 hours ago' },
    { id: '2', name: 'Bug Report Analyzer', runs: 23, lastRun: '1 day ago' },
    { id: '3', name: 'Code Refactoring Helper', runs: 12, lastRun: '3 days ago' }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-zinc-400">Manage your products, prompts, and licenses</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Purchases */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">Recent Purchases</span>
                  </div>
                  <button className="text-sm text-purple-400 hover:text-purple-300">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-zinc-800">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium text-white text-sm">{purchase.name}</div>
                        <div className="text-xs text-zinc-500">{purchase.date}</div>
                      </div>
                      <div className="text-sm font-medium text-white">${purchase.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Prompts */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white">Recent Prompts</span>
                  </div>
                  <button className="text-sm text-purple-400 hover:text-purple-300">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-zinc-800">
                  {recentPrompts.map((prompt) => (
                    <div key={prompt.id} className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium text-white text-sm">{prompt.name}</div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span>{prompt.runs} runs</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {prompt.lastRun}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 text-center">
              <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Your Purchases</h3>
              <p className="text-zinc-500 mb-4">
                Sign in to view your purchase history and download your products.
              </p>
            </div>
          </div>
        )}

        {/* Prompts Tab */}
        {activeTab === 'prompts' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 text-center">
              <FileText className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Your Prompts</h3>
              <p className="text-zinc-500 mb-4">
                Create and manage your AI prompts in the Workbench.
              </p>
            </div>
          </div>
        )}

        {/* Licenses Tab */}
        {activeTab === 'licenses' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 text-center">
              <Key className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Your Licenses</h3>
              <p className="text-zinc-500 mb-4">
                View and manage your product licenses.
              </p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full max-w-md px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full max-w-md px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
