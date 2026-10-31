import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, RefreshCw, Code2, AlertCircle } from 'lucide-react';
import { EmailTemplate } from '../../types/template';
import { generateEmailHtml } from '../../utils/htmlGenerator';

interface CodeEditorProps {
  template: EmailTemplate;
  onApplyRawHtml: (newHtml: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ template, onApplyRawHtml }) => {
  const [code, setCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Sync code whenever template changes
  useEffect(() => {
    setCode(generateEmailHtml(template));
    setHasChanges(false);
  }, [template]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '_') || 'email_template'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyChanges = () => {
    onApplyRawHtml(code);
    setHasChanges(false);
  };

  // Compute line count
  const lines = code.split('\n');

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-mono text-xs">
      {/* Code Editor Header */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-200">Mode Code HTML & CSS Inline</span>
          <span className="text-[10px] text-slate-400">({lines.length} lignes)</span>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleApplyChanges}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Appliquer au visuel</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            title="Copier tout le code HTML"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors"
            title="Télécharger le fichier .html"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger .html</span>
          </button>
        </div>
      </div>

      {/* Code Workspace with Line Numbers */}
      <div className="flex-1 overflow-auto flex relative bg-slate-900">
        {/* Line Numbers column */}
        <div className="select-none py-4 px-3 text-right bg-slate-950 text-slate-600 font-mono text-xs border-r border-slate-800 shrink-0">
          {lines.map((_, i) => (
            <div key={i} className="leading-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={e => {
            setCode(e.target.value);
            setHasChanges(true);
          }}
          spellCheck={false}
          className="flex-1 p-4 bg-transparent text-slate-200 font-mono text-xs leading-5 resize-none outline-hidden whitespace-pre overflow-auto"
        />
      </div>

      {/* Bottom Bar Info */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>HTML XHTML 1.0 Strict + CSS Inliné conforme Gmail/Outlook</span>
        </div>
        <div>
          <span>{Math.round(new Blob([code]).size / 1024)} Ko</span>
        </div>
      </div>
    </div>
  );
};
