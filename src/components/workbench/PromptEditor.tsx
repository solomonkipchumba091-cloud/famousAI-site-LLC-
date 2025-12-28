import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Play, 
  Save, 
  Copy, 
  Loader2, 
  Variable, 
  Plus,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEditorStore } from '@/lib/store';

interface VariableItem {
  id: string;
  name: string;
  value: string;
}

interface PromptEditorProps {
  initialContent?: string;
  onSave?: (content: string, variables: VariableItem[]) => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ initialContent = '', onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [variables, setVariables] = useState<VariableItem[]>([]);
  const [showVariableMenu, setShowVariableMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { isRunning, setIsRunning, output, setOutput, appendOutput, clearOutput } = useEditorStore();

  // Parse variables from content
  useEffect(() => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [...content.matchAll(regex)];
    const foundVars = matches.map((match) => match[1]);
    const uniqueVars = [...new Set(foundVars)];
    
    setVariables((prev) => {
      const newVars: VariableItem[] = uniqueVars.map((name) => {
        const existing = prev.find((v) => v.name === name);
        return existing || { id: crypto.randomUUID(), name, value: '' };
      });
      return newVars;
    });
  }, [content]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '{' && !e.shiftKey) {
      // Check if previous char is also {
      const pos = e.currentTarget.selectionStart;
      if (pos > 0 && content[pos - 1] === '{') {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const lineHeight = 24;
        const lines = content.substring(0, pos).split('\n');
        const currentLine = lines.length - 1;
        const charPos = lines[currentLine].length;
        
        setMenuPosition({
          top: rect.top + (currentLine * lineHeight) + 30,
          left: rect.left + (charPos * 8)
        });
        setCursorPosition(pos);
        setShowVariableMenu(true);
      }
    }
    
    if (e.key === 'Escape') {
      setShowVariableMenu(false);
    }
  }, [content]);

  // Insert variable at cursor
  const insertVariable = (varName: string) => {
    const before = content.substring(0, cursorPosition - 1); // Remove the first {
    const after = content.substring(cursorPosition);
    const newContent = `${before}{{${varName}}}${after}`;
    setContent(newContent);
    setShowVariableMenu(false);
    
    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = cursorPosition - 1 + varName.length + 4;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  // Add new variable
  const addNewVariable = () => {
    const name = `variable_${variables.length + 1}`;
    insertVariable(name);
  };

  // Update variable value
  const updateVariableValue = (id: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, value } : v))
    );
  };

  // Compile prompt with variable values
  const compilePrompt = (): string => {
    let compiled = content;
    variables.forEach((v) => {
      compiled = compiled.replace(new RegExp(`\\{\\{${v.name}\\}\\}`, 'g'), v.value || `[${v.name}]`);
    });
    return compiled;
  };

  // Run the prompt
  const runPrompt = async () => {
    const compiledPrompt = compilePrompt();
    if (!compiledPrompt.trim()) {
      setOutput('Error: Prompt is empty');
      return;
    }

    setIsRunning(true);
    clearOutput();
    setOutput('Running prompt...\n\n');

    try {
      const { data, error } = await supabase.functions.invoke('run-prompt', {
        body: { prompt: compiledPrompt }
      });

      if (error) throw error;

      if (data.success) {
        setOutput(data.content);
      } else {
        setOutput(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setOutput(`Error: ${err.message || 'Failed to run prompt'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Copy compiled prompt
  const copyCompiledPrompt = () => {
    navigator.clipboard.writeText(compilePrompt());
  };

  // Save prompt
  const handleSave = () => {
    if (onSave) {
      onSave(content, variables);
    }
  };

  const suggestedVariables = [
    'task_description',
    'context',
    'requirements',
    'input_data',
    'output_format',
    'tone',
    'language',
    'constraints'
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-700 rounded-t-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={addNewVariable}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Variable
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCompiledPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={runPrompt}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg text-sm text-white font-medium transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Run
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your prompt here...&#10;&#10;Use {{variable_name}} to create dynamic variables.&#10;Type {{ to see suggestions."
            className="w-full h-full p-4 bg-zinc-900 border border-t-0 border-zinc-700 rounded-b-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            style={{ minHeight: '300px' }}
          />

          {/* Variable Menu */}
          {showVariableMenu && (
            <div
              className="fixed z-50 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              <div className="p-2 border-b border-zinc-700">
                <p className="text-xs text-zinc-400">Insert Variable</p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {suggestedVariables.map((varName) => (
                  <button
                    key={varName}
                    onClick={() => insertVariable(varName)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-zinc-700 transition-colors text-left"
                  >
                    <Variable className="w-4 h-4 text-purple-400" />
                    {varName}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-zinc-700">
                <button
                  onClick={() => {
                    const name = prompt('Enter variable name:');
                    if (name) insertVariable(name);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-purple-400 hover:bg-zinc-700 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Custom variable...
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Variables & Output */}
      <div className="w-full lg:w-96 flex flex-col gap-4 min-h-0">
        {/* Variables Panel */}
        {variables.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 p-3 bg-zinc-800/50 border-b border-zinc-700">
              <Variable className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Variables</span>
              <span className="px-1.5 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded">
                {variables.length}
              </span>
            </div>
            <div className="p-3 space-y-3 max-h-48 overflow-y-auto">
              {variables.map((variable) => (
                <div key={variable.id}>
                  <label className="block text-xs text-zinc-400 mb-1">
                    {`{{${variable.name}}}`}
                  </label>
                  <input
                    type="text"
                    value={variable.value}
                    onChange={(e) => updateVariableValue(variable.id, e.target.value)}
                    placeholder={`Enter ${variable.name}...`}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Output Panel */}
        <div className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between p-3 bg-zinc-800/50 border-b border-zinc-700">
            <span className="text-sm font-medium text-white">Output</span>
            {output && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-zinc-400" />
              </button>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
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
                Click "Run" to execute your prompt and see the AI response here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
