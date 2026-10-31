import React from 'react';
import {
  Mail,
  Eye,
  FolderOpen,
  Upload,
  Code2,
  Columns,
  Download,
  Save,
  Scissors,
  Check,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  editorMode: 'visual' | 'code';
  onChangeEditorMode: (mode: 'visual' | 'code') => void;
  showDocumentSplit: boolean;
  onToggleDocumentSplit: () => void;
  onOpenGmailModal: () => void;
  onOpenPreviewModal: () => void;
  onOpenTemplatesModal: () => void;
  onOpenGuideModal: () => void;
  onOpenImportModal: () => void;
  onSaveTemplate: () => void;
  isSaving: boolean;
  templateName: string;
}

export const Header: React.FC<HeaderProps> = ({
  editorMode,
  onChangeEditorMode,
  showDocumentSplit,
  onToggleDocumentSplit,
  onOpenGmailModal,
  onOpenPreviewModal,
  onOpenTemplatesModal,
  onOpenGuideModal,
  onOpenImportModal,
  onSaveTemplate,
  isSaving,
  templateName,
}) => {
  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between gap-6 shrink-0 z-20 select-none">
      {/* Zone 1: Brand title wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Mail className="w-4 h-4" />
          </div>
          <span>Email Template Studio</span>
        </a>
        <span className="hidden xl:inline text-xs text-slate-400 font-normal">
          / {templateName}
        </span>
      </div>

      {/* Zone 2: Single-line navigation links and workspace mode toggles */}
      <nav className="flex items-center gap-2 sm:gap-3 text-xs font-medium text-slate-600">
        {/* Visual vs Code Mode Segmented Control */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => onChangeEditorMode('visual')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 font-medium ${
              editorMode === 'visual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visuel
          </button>
          <button
            onClick={() => onChangeEditorMode('code')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 font-medium ${
              editorMode === 'code'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code HTML</span>
          </button>
        </div>

        {/* Document Split view toggle */}
        <button
          onClick={onToggleDocumentSplit}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
            showDocumentSplit
              ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          title="Afficher/Masquer le document original importé pour comparer et découper"
        >
          <Columns className="w-3.5 h-3.5" />
          <span>{showDocumentSplit ? 'Doc source (Actif)' : 'Doc source'}</span>
        </button>

        {/* Import Document Button */}
        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          <Upload className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Importer</span>
        </button>

        {/* Aperçu & Tests Button */}
        <button
          onClick={onOpenPreviewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          <span>Aperçu &amp; Tests</span>
        </button>

        {/* Mes Templates Button */}
        <button
          onClick={onOpenTemplatesModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Mes templates</span>
        </button>

        {/* Guide Illustré Button (Juste à côté de Mes templates) */}
        <button
          onClick={onOpenGuideModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap shrink-0 font-medium"
          title="Consulter et télécharger le guide d'utilisation illustré"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Guide illustré</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action - Ouvrir dans Gmail */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onSaveTemplate}
          disabled={isSaving}
          className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          title="Sauvegarder les modifications"
        >
          {isSaving ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Enregistré' : 'Enregistrer'}</span>
        </button>

        <button
          onClick={onOpenGmailModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
          title="Ouvrir directement dans Gmail avec mise en forme HTML intégrale"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Ouvrir dans Gmail</span>
        </button>
      </div>
    </header>
  );
};
