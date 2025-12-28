import React, { useState } from 'react';
import { X, Play, Loader2, Copy, ShoppingCart, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { useCartStore } from '@/lib/store';

interface PromptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const PromptPreviewModal: React.FC<PromptPreviewModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!isOpen || !product) return null;

  // Parse variables from preview content
  const parseVariables = (content: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [...content.matchAll(regex)];
    return [...new Set(matches.map((m) => m[1]))];
  };

  const variableNames = product.preview_content
    ? parseVariables(product.preview_content)
    : [];

  const compilePrompt = (): string => {
    if (!product.preview_content) return '';
    let compiled = product.preview_content;
    Object.entries(variables).forEach(([name, value]) => {
      compiled = compiled.replace(
        new RegExp(`\\{\\{${name}\\}\\}`, 'g'),
        value || `[${name}]`
      );
    });
    return compiled;
  };

  const runPrompt = async () => {
    if (hasRun) {
      alert('You can only run this preview once. Purchase the prompt for unlimited runs!');
      return;
    }

    const compiledPrompt = compilePrompt();
    if (!compiledPrompt.trim()) return;

    setIsRunning(true);
    setOutput('');

    try {
      const { data, error } = await supabase.functions.invoke('run-prompt', {
        body: { prompt: compiledPrompt }
      });

      if (error) throw error;

      if (data.success) {
        setOutput(data.content);
        setHasRun(true);
      } else {
        setOutput(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setOutput(`Error: ${err.message || 'Failed to run prompt'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAddToCart = () => {
    addItem(product);
    onClose();
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">{product.name}</h2>
              <p className="text-sm text-zinc-400">Try this prompt (1 free run)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left - Prompt & Variables */}
            <div className="space-y-4">
              {/* Prompt Preview */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Prompt Template
                </label>
                <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                  <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono">
                    {product.preview_content}
                  </pre>
                </div>
              </div>

              {/* Variables */}
              {variableNames.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Fill in Variables
                  </label>
                  <div className="space-y-3">
                    {variableNames.map((name) => (
                      <div key={name}>
                        <label className="block text-xs text-zinc-500 mb-1">
                          {`{{${name}}}`}
                        </label>
                        <input
                          type="text"
                          value={variables[name] || ''}
                          onChange={(e) =>
                            setVariables((prev) => ({
                              ...prev,
                              [name]: e.target.value
                            }))
                          }
                          placeholder={`Enter ${name}...`}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Run Button */}
              <button
                onClick={runPrompt}
                disabled={isRunning || hasRun}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running...
                  </>
                ) : hasRun ? (
                  'Free Run Used'
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Prompt (1 Free)
                  </>
                )}
              </button>
            </div>

            {/* Right - Output */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-400">
                  Output
                </label>
                {output && (
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                )}
              </div>
              <div className="flex-1 min-h-[300px] p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-y-auto">
                {isRunning ? (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating response...</span>
                  </div>
                ) : output ? (
                  <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono">
                    {output}
                  </pre>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Fill in the variables and click "Run Prompt" to see the AI response.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div>
            <span className="text-2xl font-bold text-white">
              {formatPrice(product.price_cents)}
            </span>
            {product.compare_price_cents && product.compare_price_cents > product.price_cents && (
              <span className="ml-2 text-sm text-zinc-500 line-through">
                {formatPrice(product.compare_price_cents)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
