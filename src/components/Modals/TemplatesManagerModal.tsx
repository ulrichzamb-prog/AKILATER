import React, { useState } from 'react';
import {
  X,
  FolderOpen,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Download,
  FileArchive,
  Check,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import JSZip from 'jszip';
import { EmailTemplate } from '../../types/template';
import { generateEmailHtml } from '../../utils/htmlGenerator';

interface TemplatesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: EmailTemplate[];
  activeTemplateId: string;
  onSelectTemplate: (template: EmailTemplate) => void;
  onCreateNewTemplate: () => void;
  onDuplicateTemplate: (template: EmailTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onRenameTemplate: (id: string, newName: string) => void;
}

export const TemplatesManagerModal: React.FC<TemplatesManagerModalProps> = ({
  isOpen,
  onClose,
  templates,
  activeTemplateId,
  onSelectTemplate,
  onCreateNewTemplate,
  onDuplicateTemplate,
  onDeleteTemplate,
  onRenameTemplate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [downloadingZipId, setDownloadingZipId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRename = (template: EmailTemplate) => {
    setEditingId(template.id);
    setEditName(template.name);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      onRenameTemplate(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleDownloadHtml = (template: EmailTemplate) => {
    const html = generateEmailHtml(template);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async (template: EmailTemplate) => {
    setDownloadingZipId(template.id);
    try {
      const zip = new JSZip();
      const html = generateEmailHtml(template);
      zip.file('index.html', html);

      const assetsFolder = zip.folder('images');
      if (assetsFolder && template.extractedAssets && template.extractedAssets.length > 0) {
        template.extractedAssets.forEach((asset, idx) => {
          const base64Data = asset.dataUrl.replace(/^data:image\/\w+;base64,/, '');
          const filename = `${asset.category}_${idx + 1}_${asset.label.toLowerCase().replace(/\s+/g, '_')}.png`;
          assetsFolder.file(filename, base64Data, { base64: true });
        });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.toLowerCase().replace(/\s+/g, '_')}_package.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export zip:', err);
    } finally {
      setDownloadingZipId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mes Templates d'Email</h3>
              <p className="text-xs text-slate-500">
                Sauvegarde automatique locale et permanente (IndexedDB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onCreateNewTemplate();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau template</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Templates Grid List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(tmpl => {
              const isActive = tmpl.id === activeTemplateId;
              const dateStr = new Date(tmpl.updatedAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={tmpl.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top row with name and active badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {editingId === tmpl.id ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="text-xs font-semibold px-2 py-1 border border-blue-500 rounded flex-1"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveRename(tmpl.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveRename(tmpl.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {tmpl.name}
                          </h4>
                          <button
                            onClick={() => handleStartRename(tmpl)}
                            className="text-slate-400 hover:text-slate-600 p-0.5"
                            title="Renommer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {isActive && (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                          En cours
                        </span>
                      )}
                    </div>

                    {/* Subject line snippet */}
                    <p className="text-xs text-slate-600 mb-3 truncate" title={tmpl.subject}>
                      {tmpl.subject || '(Aucun objet)'}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{tmpl.blocks.length} blocs</span>
                      </span>
                      {tmpl.extractedAssets && tmpl.extractedAssets.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-blue-600 font-medium">
                            {tmpl.extractedAssets.length} découpe(s)
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onSelectTemplate(tmpl);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      {isActive ? 'Continuer' : 'Ouvrir'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadHtml(tmpl)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        title="Télécharger fichier HTML"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDownloadZip(tmpl)}
                        disabled={downloadingZipId === tmpl.id}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                        title="Télécharger le pack complet ZIP avec images"
                      >
                        <FileArchive className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDuplicateTemplate(tmpl)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                        title="Dupliquer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {templates.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer définitivement "${tmpl.name}" ?`)) {
                              onDeleteTemplate(tmpl.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>{templates.length} template(s) enregistré(s) localement</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-600 hover:text-slate-800 rounded-lg font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
