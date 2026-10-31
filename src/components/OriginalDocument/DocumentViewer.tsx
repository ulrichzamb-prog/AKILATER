import React, { useState } from 'react';
import {
  FileText,
  Scissors,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  CheckCircle,
  Eye,
  Plus,
  Trash2,
  Image as ImageIcon,
  PenTool,
  Stamp,
  Layers,
} from 'lucide-react';
import { ImportedDocument, ExtractedAsset, DetectedElement } from '../../types/template';
import { ElementCropperModal } from './ElementCropperModal';

interface DocumentViewerProps {
  document: ImportedDocument | null;
  extractedAssets: ExtractedAsset[];
  onOpenImportModal: () => void;
  onSaveExtractedAsset: (asset: ExtractedAsset, autoInsertLocation?: 'header_logo' | 'signature_ink' | 'signature_stamp' | 'hero_image') => void;
  onDeleteAsset: (id: string) => void;
  onApplyExtractedLayout?: (detectedElements: DetectedElement[], palette?: any, blocks?: any) => void;
  onInsertAssetIntoActiveBlock?: (asset: ExtractedAsset) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  extractedAssets,
  onOpenImportModal,
  onSaveExtractedAsset,
  onDeleteAsset,
  onApplyExtractedLayout,
  onInsertAssetIntoActiveBlock,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [selectedBox, setSelectedBox] = useState<[number, number, number, number] | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<ExtractedAsset['category']>('logo');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  // Auto-sanitize data URL if it contains unencoded SVG or invalid URI formatting
  const safeDataUrl = React.useMemo(() => {
    if (!document || !document.dataUrl) return '';
    const raw = document.dataUrl;
    if (raw.startsWith('data:image/svg+xml') && raw.includes('<svg')) {
      const parts = raw.split(',');
      if (parts.length >= 2) {
        const svgContent = parts.slice(1).join(',');
        try {
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(decodeURIComponent(svgContent).trim());
        } catch {
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent.trim());
        }
      }
    }
    return raw;
  }, [document?.dataUrl]);

  React.useEffect(() => {
    setImageError(false);
  }, [document?.dataUrl]);

  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
          <FileText className="w-7 h-7" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 mb-1">
          Aucun document source importé
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
          Importez une image (PNG, JPG), un fichier PDF ou un fichier HTML pour analyser son design et découper fidèlement vos logos et signatures d'origine.
        </p>
        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Importer un document original</span>
        </button>
      </div>
    );
  }

  const handleLaunchAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStatus('Analyse de la mise en page et détection des éléments originaux...');

    try {
      const response = await fetch('/api/analyze-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: document.dataUrl,
          mimeType: document.type === 'pdf' ? 'application/pdf' : 'image/png',
        }),
      });

      const res = await response.json();
      if (res.success && res.analysis) {
        const detected = res.analysis.detectedGraphicElements || [];
        setAnalysisStatus(`Analyse réussie ! ${detected.length} élément(s) graphiques originaux identifiés.`);
        if (onApplyExtractedLayout) {
          onApplyExtractedLayout(detected, res.analysis.palette, res.analysis.blocks);
        }
      } else {
        setAnalysisStatus('Analyse géométrique locale prête : découpez vos éléments au millimètre.');
      }
    } catch {
      setAnalysisStatus('Mode hors-ligne : vous pouvez découper vos éléments directement avec l\'outil précis.');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisStatus(null), 5000);
    }
  };

  const handleOpenCropperForDetected = (elem: DetectedElement) => {
    setSelectedBox(elem.box2d);
    setSelectedCategory(elem.category || 'logo');
    setIsCropperOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-slate-100/70 border-r border-slate-200 overflow-hidden">
      {/* Document Header Controls */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-slate-800 truncate" title={document.name}>
            {document.name}
          </span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
            {document.type.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs text-slate-600">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 15))}
              className="p-1 hover:text-slate-900 rounded"
              title="Dézoomer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] tabular-nums">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(250, z + 15))}
              className="p-1 hover:text-slate-900 rounded"
              title="Zoomer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Crop Tool Button */}
          <button
            onClick={() => {
              setSelectedBox(undefined);
              setSelectedCategory('logo');
              setIsCropperOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            title="Découper un logo, signature ou cachet original"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Découper</span>
          </button>

          {/* Quick Analysis button */}
          <button
            onClick={handleLaunchAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors disabled:opacity-50"
            title="Détecter automatiquement les zones et couleurs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Détecter</span>
          </button>
        </div>
      </div>

      {/* Analysis Status banner if any */}
      {analysisStatus && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-800 flex items-center justify-between">
          <span>{analysisStatus}</span>
          <button onClick={() => setAnalysisStatus(null)} className="text-blue-500 hover:text-blue-700">
            &times;
          </button>
        </div>
      )}

      {/* Main Document Canvas View */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center relative select-none">
        <div
          className="relative bg-white shadow-lg border border-slate-300 rounded transition-transform origin-top"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {imageError ? (
            <div style={{ width: `${document.width || 600}px` }} className="p-8 text-center bg-slate-50 border border-slate-200 rounded">
              <p className="text-xs text-slate-700 font-semibold mb-1">Aperçu du document : {document.name}</p>
              <p className="text-[11px] text-slate-500 mb-3">Le document source a été importé avec succès et ses blocs sont éditables dans l'éditeur à droite.</p>
              <button
                type="button"
                onClick={() => setImageError(false)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
              >
                Recharger l'aperçu
              </button>
            </div>
          ) : document.type === 'html' && document.rawText ? (
            <div style={{ width: `${document.width || 650}px` }} className="bg-white">
              <iframe
                title={document.name}
                srcDoc={document.rawText}
                className="w-full h-[750px] border-none bg-white block"
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <img
              src={safeDataUrl}
              alt={document.name}
              className="max-w-none block h-auto"
              style={{ width: `${document.width || 600}px` }}
              onError={() => {
                setImageError(true);
              }}
            />
          )}

          {/* Detected Elements Highlights */}
          {document.detectedElements &&
            document.detectedElements.map(elem => {
              const [ymin, xmin, ymax, xmax] = elem.box2d;
              return (
                <div
                  key={elem.id}
                  onClick={() => handleOpenCropperForDetected(elem)}
                  className="absolute border-2 border-dashed border-amber-500 bg-amber-500/20 hover:bg-amber-500/35 cursor-pointer transition-colors group"
                  style={{
                    top: `${ymin / 10}%`,
                    left: `${xmin / 10}%`,
                    height: `${(ymax - ymin) / 10}%`,
                    width: `${(xmax - xmin) / 10}%`,
                  }}
                  title={`Cliquer pour découper : ${elem.label}`}
                >
                  <span className="absolute -top-5 left-0 bg-amber-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-sm opacity-90 group-hover:opacity-100 whitespace-nowrap">
                    {elem.label}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Extracted Assets Bottom Tray */}
      <div className="px-4 py-3 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Éléments originaux découpés ({extractedAssets.length})</span>
          </div>
          <button
            onClick={() => {
              setSelectedBox(undefined);
              setIsCropperOpen(true);
            }}
            className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Nouvelle découpe</span>
          </button>
        </div>

        {extractedAssets.length === 0 ? (
          <p className="text-[11px] text-slate-400 italic">
            Aucun élément découpé pour l'instant. Utilisez l'outil Découper pour extraire votre vrai logo ou votre signature.
          </p>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {extractedAssets.map(asset => (
              <div
                key={asset.id}
                className="group relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 shrink-0 hover:border-blue-300 transition-colors"
              >
                <div className="w-10 h-10 bg-white rounded border border-slate-100 flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={asset.dataUrl}
                    alt={asset.label}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-left pr-1">
                  <div className="text-[11px] font-semibold text-slate-800 max-w-[90px] truncate">
                    {asset.label}
                  </div>
                  <div className="text-[9px] text-slate-400 capitalize">
                    {asset.category}
                  </div>
                </div>

                {onInsertAssetIntoActiveBlock && (
                  <button
                    onClick={() => onInsertAssetIntoActiveBlock(asset)}
                    className="text-[10px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded hover:bg-blue-100 transition-colors"
                    title="Insérer dans le bloc sélectionné"
                  >
                    Insérer
                  </button>
                )}

                <button
                  onClick={() => onDeleteAsset(asset.id)}
                  className="text-slate-400 hover:text-red-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer l'élément"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cropper Modal */}
      {isCropperOpen && (
        <ElementCropperModal
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          documentDataUrl={safeDataUrl}
          initialBox={selectedBox}
          initialCategory={selectedCategory}
          onSaveAsset={onSaveExtractedAsset}
        />
      )}
    </div>
  );
};
