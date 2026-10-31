import React, { useState, useRef, useEffect } from 'react';
import { X, Crop, Check, Sparkles, Move, Scissors, Stamp, PenTool, Image as ImageIcon } from 'lucide-react';
import { ExtractedAsset } from '../../types/template';

interface ElementCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentDataUrl: string;
  initialBox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  initialCategory?: ExtractedAsset['category'];
  onSaveAsset: (asset: ExtractedAsset, autoInsertLocation?: 'header_logo' | 'signature_ink' | 'signature_stamp' | 'hero_image') => void;
}

export const ElementCropperModal: React.FC<ElementCropperModalProps> = ({
  isOpen,
  onClose,
  documentDataUrl,
  initialBox,
  initialCategory = 'logo',
  onSaveAsset,
}) => {
  const [category, setCategory] = useState<ExtractedAsset['category']>(initialCategory);
  const [label, setLabel] = useState<string>('Logo officiel');
  const [removeWhiteBg, setRemoveWhiteBg] = useState<boolean>(initialCategory === 'signature' || initialCategory === 'stamp');
  const [autoInsert, setAutoInsert] = useState<'none' | 'header_logo' | 'signature_ink' | 'signature_stamp' | 'hero_image'>('none');
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  // Auto-sanitize data URL if it contains unencoded SVG or invalid URI formatting
  const safeDocumentUrl = React.useMemo(() => {
    if (!documentDataUrl) return '';
    if (documentDataUrl.startsWith('data:image/svg+xml') && documentDataUrl.includes('<svg')) {
      const parts = documentDataUrl.split(',');
      if (parts.length >= 2) {
        const svgContent = parts.slice(1).join(',');
        try {
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(decodeURIComponent(svgContent).trim());
        } catch {
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent.trim());
        }
      }
    }
    return documentDataUrl;
  }, [documentDataUrl]);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Selection in relative normalized coordinates (0 to 1)
  const [cropRect, setCropRect] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0.1,
    y: 0.05,
    width: 0.35,
    height: 0.15,
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<'move' | 'create' | 'resize-se' | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initialRect: typeof cropRect }>({
    startX: 0,
    startY: 0,
    initialRect: { ...cropRect },
  });

  // Sync initial box if provided
  useEffect(() => {
    if (initialBox) {
      const [ymin, xmin, ymax, xmax] = initialBox;
      const x = Math.max(0, Math.min(1, xmin / 1000));
      const y = Math.max(0, Math.min(1, ymin / 1000));
      const width = Math.max(0.05, Math.min(1 - x, (xmax - xmin) / 1000));
      const height = Math.max(0.05, Math.min(1 - y, (ymax - ymin) / 1000));
      setCropRect({ x, y, width, height });
    }
  }, [initialBox]);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
      if (initialCategory === 'logo') {
        setLabel('Logo officiel original');
        setAutoInsert('header_logo');
        setRemoveWhiteBg(false);
      } else if (initialCategory === 'signature') {
        setLabel('Signature manuscrite originale');
        setAutoInsert('signature_ink');
        setRemoveWhiteBg(true);
      } else if (initialCategory === 'stamp') {
        setLabel('Cachet / Tampon certifié');
        setAutoInsert('signature_stamp');
        setRemoveWhiteBg(true);
      } else if (initialCategory === 'banner') {
        setLabel('Bannière visuelle');
        setAutoInsert('hero_image');
        setRemoveWhiteBg(false);
      }
    }
  }, [initialCategory]);

  // Update preview canvas whenever cropRect or removeWhiteBg changes
  useEffect(() => {
    if (!imgRef.current || !imgRef.current.naturalWidth) return;
    const img = imgRef.current;

    const sourceX = Math.round(cropRect.x * img.naturalWidth);
    const sourceY = Math.round(cropRect.y * img.naturalHeight);
    const sourceWidth = Math.max(1, Math.round(cropRect.width * img.naturalWidth));
    const sourceHeight = Math.max(1, Math.round(cropRect.height * img.naturalHeight));

    const canvas = document.createElement('canvas');
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

    // Optional background transparency for stamps/signatures
    if (removeWhiteBg) {
      const imgData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If near white, make transparent with soft feathering
        if (r > 225 && g > 225 && b > 225) {
          const brightness = (r + g + b) / 3;
          const alphaFactor = Math.max(0, 1 - (brightness - 225) / 30);
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    setCroppedPreview(canvas.toDataURL('image/png'));
  }, [cropRect, removeWhiteBg, safeDocumentUrl]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;

    // Check if inside existing crop rect
    const isInside =
      mouseX >= cropRect.x &&
      mouseX <= cropRect.x + cropRect.width &&
      mouseY >= cropRect.y &&
      mouseY <= cropRect.y + cropRect.height;

    // Check if bottom-right corner resize
    const isCorner =
      Math.abs(mouseX - (cropRect.x + cropRect.width)) < 0.04 &&
      Math.abs(mouseY - (cropRect.y + cropRect.height)) < 0.04;

    dragStartRef.current = {
      startX: mouseX,
      startY: mouseY,
      initialRect: { ...cropRect },
    };
    setIsDragging(true);

    if (isCorner) {
      setDragMode('resize-se');
    } else if (isInside) {
      setDragMode('move');
    } else {
      setDragMode('create');
      setCropRect({
        x: Math.max(0, Math.min(1, mouseX)),
        y: Math.max(0, Math.min(1, mouseY)),
        width: 0.02,
        height: 0.02,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;

    const dx = mouseX - dragStartRef.current.startX;
    const dy = mouseY - dragStartRef.current.startY;
    const init = dragStartRef.current.initialRect;

    if (dragMode === 'move') {
      const newX = Math.max(0, Math.min(1 - init.width, init.x + dx));
      const newY = Math.max(0, Math.min(1 - init.height, init.y + dy));
      setCropRect(prev => ({ ...prev, x: newX, y: newY }));
    } else if (dragMode === 'resize-se') {
      const newWidth = Math.max(0.04, Math.min(1 - init.x, init.width + dx));
      const newHeight = Math.max(0.04, Math.min(1 - init.y, init.height + dy));
      setCropRect(prev => ({ ...prev, width: newWidth, height: newHeight }));
    } else if (dragMode === 'create') {
      const x = Math.min(dragStartRef.current.startX, mouseX);
      const y = Math.min(dragStartRef.current.startY, mouseY);
      const width = Math.abs(mouseX - dragStartRef.current.startX);
      const height = Math.abs(mouseY - dragStartRef.current.startY);
      setCropRect({
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.min(1 - x, Math.max(0.03, width)),
        height: Math.min(1 - y, Math.max(0.03, height)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const handleConfirmSave = () => {
    if (!croppedPreview) return;
    const newAsset: ExtractedAsset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: label.trim() || 'Élément découpé',
      category,
      dataUrl: croppedPreview,
      width: Math.round(cropRect.width * (imgRef.current?.naturalWidth || 600)),
      height: Math.round(cropRect.height * (imgRef.current?.naturalHeight || 400)),
      createdAt: Date.now(),
    };

    onSaveAsset(newAsset, autoInsert === 'none' ? undefined : autoInsert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Découpe d'éléments originaux (Logo, Signature, Cachet)
              </h3>
              <p className="text-xs text-slate-500">
                Préserve fidèlement les éléments graphiques authentiques sans aucune modification par IA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Document Preview Canvas (Left) */}
          <div className="lg:col-span-8 p-6 bg-slate-100/80 overflow-auto flex flex-col items-center justify-center min-h-[420px] select-none">
            <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
              <Move className="w-3.5 h-3.5" />
              <span>Glissez pour déplacer ou redimensionner le cadre de sélection sur l'élément à extraire</span>
            </div>

            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative max-w-full max-h-[58vh] bg-white shadow-md rounded border border-slate-300 cursor-crosshair overflow-hidden"
              style={{ userSelect: 'none' }}
            >
              <img
                ref={imgRef}
                src={safeDocumentUrl}
                alt="Document original"
                className="max-h-[58vh] w-auto object-contain block pointer-events-none"
                onLoad={() => {
                  // Trigger initial preview computation
                  setCropRect(r => ({ ...r }));
                }}
              />

              {/* Crop Box Overlay */}
              <div
                className="absolute border-2 border-blue-600 bg-blue-500/15 shadow-sm transition-shadow pointer-events-auto cursor-move"
                style={{
                  left: `${cropRect.x * 100}%`,
                  top: `${cropRect.y * 100}%`,
                  width: `${cropRect.width * 100}%`,
                  height: `${cropRect.height * 100}%`,
                }}
              >
                {/* Crosshair tag */}
                <div className="absolute top-1 left-1 bg-blue-700 text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm">
                  {label || 'Zone'}
                </div>

                {/* Resize Handle SE */}
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 border border-white cursor-se-resize rounded-tl-sm shadow-sm"
                  title="Redimensionner"
                />
              </div>
            </div>
          </div>

          {/* Properties & Preview (Right) */}
          <div className="lg:col-span-4 p-6 border-l border-slate-200 bg-white flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Type d'élément
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('logo');
                      setLabel('Logo original');
                      setAutoInsert('header_logo');
                      setRemoveWhiteBg(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border text-left font-medium transition-colors ${
                      category === 'logo'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('signature');
                      setLabel('Signature manuscrite');
                      setAutoInsert('signature_ink');
                      setRemoveWhiteBg(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border text-left font-medium transition-colors ${
                      category === 'signature'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <PenTool className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Signature</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('stamp');
                      setLabel('Cachet / Tampon');
                      setAutoInsert('signature_stamp');
                      setRemoveWhiteBg(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border text-left font-medium transition-colors ${
                      category === 'stamp'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Stamp className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Cachet / Sceau</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('banner');
                      setLabel('Bannière visuelle');
                      setAutoInsert('hero_image');
                      setRemoveWhiteBg(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border text-left font-medium transition-colors ${
                      category === 'banner'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Crop className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Bannière</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nom de l'élément
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="Ex: Logo officiel, Signature PDG..."
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
                />
              </div>

              {/* Cropped Result Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Aperçu de l'élément extrait
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center min-h-[110px] relative overflow-hidden">
                  {croppedPreview ? (
                    <img
                      src={croppedPreview}
                      alt="Aperçu découpe"
                      className="max-h-24 max-w-full object-contain filter drop-shadow-xs"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Sélectionnez une zone sur l'image</span>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeWhiteBg}
                    onChange={e => setRemoveWhiteBg(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Rendre le fond blanc transparent (Idéal signatures et sceaux)
                  </span>
                </label>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Action automatique après découpe
                  </label>
                  <select
                    value={autoInsert}
                    onChange={e => setAutoInsert(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white"
                  >
                    <option value="none">Sauvegarder dans la galerie d'éléments</option>
                    <option value="header_logo">Remplacer le Logo d'en-tête de l'email</option>
                    <option value="signature_ink">Insérer comme Signature manuscrite</option>
                    <option value="signature_stamp">Insérer comme Cachet officiel</option>
                    <option value="hero_image">Insérer comme Bannière Hero</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-200 mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={!croppedPreview}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                <span>Valider et extraire l'élément</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
