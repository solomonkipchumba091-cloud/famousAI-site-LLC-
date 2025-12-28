import React, { useState } from 'react';
import { 
  Terminal, 
  Plus, 
  FileText, 
  Clock, 
  Star,
  Trash2,
  MoreVertical,
  Search
} from 'lucide-react';
import { PromptEditor } from './PromptEditor';

interface PromptItem {
  id: string;
  title: string;
  description: string;
  lastEdited: Date;
  isFavorite: boolean;
}

export const WorkbenchView: React.FC = () => {
  const [prompts, setPrompts] = useState<PromptItem[]>([
    {
      id: '1',
      title: 'Code Review Assistant',
      description: 'Comprehensive code review with security analysis',
      lastEdited: new Date(),
      isFavorite: true
    },
    {
      id: '2',
      title: 'Technical Documentation',
      description: 'Generate docs from code comments',
      lastEdited: new Date(Date.now() - 86400000),
      isFavorite: false
    },
    {
      id: '3',
      title: 'SQL Query Builder',
      description: 'Natural language to SQL',
      lastEdited: new Date(Date.now() - 172800000),
      isFavorite: true
    }
  ]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPromptModal, setShowNewPromptModal] = useState(false);

  const filteredPrompts = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewPrompt = () => {
    const newPrompt: PromptItem = {
      id: crypto.randomUUID(),
      title: 'Untitled Prompt',
      description: 'New prompt description',
      lastEdited: new Date(),
      isFavorite: false
    };
    setPrompts([newPrompt, ...prompts]);
    setSelectedPrompt(newPrompt.id);
  };

  const toggleFavorite = (id: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const deletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPrompt === id) {
      setSelectedPrompt(null);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Prompt Workbench</h1>
              <p className="text-zinc-400 text-sm">Build, test, and iterate on AI prompts</p>
            </div>
          </div>
          <button
            onClick={createNewPrompt}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            New Prompt
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Prompt List */}
          <div className="w-80 flex-shrink-0">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Prompt List */}
            <div className="space-y-2">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => setSelectedPrompt(prompt.id)}
                  className={`group p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPrompt === prompt.id
                      ? 'bg-purple-600/10 border-purple-500/50'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-zinc-500" />
                      <h3 className="font-medium text-white text-sm line-clamp-1">
                        {prompt.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prompt.id);
                        }}
                        className="p-1 hover:bg-zinc-700 rounded"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            prompt.isFavorite
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-zinc-500'
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePrompt(prompt.id);
                        }}
                        className="p-1 hover:bg-red-500/20 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1 mb-2">
                    {prompt.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-zinc-600">
                    <Clock className="w-3 h-3" />
                    {formatDate(prompt.lastEdited)}
                  </div>
                </div>
              ))}

              {filteredPrompts.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">No prompts found</p>
                  <button
                    onClick={createNewPrompt}
                    className="mt-3 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Create your first prompt
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 min-h-[600px]">
            {selectedPrompt ? (
              <PromptEditor
                initialContent={`You are an expert assistant. Your task is to {{task_description}}.

Context:
{{context}}

Requirements:
- {{requirement_1}}
- {{requirement_2}}

Please provide a detailed and helpful response.`}
                onSave={(content, variables) => {
                  console.log('Saved:', { content, variables });
                }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-zinc-900/30 border border-zinc-800 rounded-xl">
                <Terminal className="w-16 h-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Select or Create a Prompt
                </h3>
                <p className="text-zinc-500 text-sm mb-6 text-center max-w-md">
                  Choose a prompt from the sidebar to start editing, or create a new one to begin building your AI workflow.
                </p>
                <button
                  onClick={createNewPrompt}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Prompt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
