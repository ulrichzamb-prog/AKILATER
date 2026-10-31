import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileImage,
  FileText,
  Code,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { ImportedDocument, DetectedElement } from '../../types/template';
import { processImageFile, processPdfFile, processHtmlFile } from '../../utils/documentProcessor';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportDocument: (doc: ImportedDocument, autoAnalyze?: boolean) => void;
}

function encodeSvg(svg: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

// Sample documents for 1-click test
const SAMPLE_DOCUMENTS: {
  name: string;
  type: 'image' | 'pdf' | 'html';
  description: string;
  dataUrl: string;
  width: number;
  height: number;
  detectedElements: DetectedElement[];
}[] = [
  {
    name: 'Facture_Fiduciaire_Cabinet_Beaumont.png',
    type: 'image',
    description: 'Document officiel comprenant logo en-tête, tableau de synthèse, signature manuscrite et tampon certifié.',
    width: 650,
    height: 820,
    // Valid encoded SVG data URL
    dataUrl: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="650" height="820" viewBox="0 0 650 820">
      <rect width="650" height="820" fill="%23ffffff" />
      <rect x="0" y="0" width="650" height="12" fill="%231e3a8a" />
      <!-- Logo En-tête -->
      <g id="logo_element">
        <circle cx="65" cy="65" r="24" fill="%231e40af" />
        <path d="M55 65 L65 52 L75 65 L70 78 L60 78 Z" fill="%23ffffff" />
        <text x="105" y="62" font-family="Helvetica, Arial, sans-serif" font-size="18" font-weight="bold" fill="%230f172a">CABINET BEAUMONT</text>
        <text x="105" y="78" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="%2364748b">AUDIT &amp; CONSEIL JURIDIQUE</text>
      </g>
      <!-- Facture Info -->
      <text x="460" y="55" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="%231e40af">FACTURE N° 2026-089</text>
      <text x="460" y="72" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="%2364748b">Date : 24 Octobre 2026</text>
      <text x="460" y="88" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="%2316a34a" font-weight="bold">STATUT : ACQUITTÉE</text>
      <line x1="40" y1="110" x2="610" y2="110" stroke="%23e2e8f0" stroke-width="1" />
      <!-- Destinataire -->
      <text x="40" y="140" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="%23334155">Facturé à :</text>
      <text x="40" y="160" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="%230f172a">Société Client Partenaire</text>
      <text x="40" y="176" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="%2364748b">128 Avenue de Wagram, 75017 Paris</text>
      <!-- Tableau de facturation -->
      <rect x="40" y="210" width="570" height="34" fill="%23f1f5f9" rx="4" />
      <text x="55" y="232" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="%23334155">Description de la mission</text>
      <text x="420" y="232" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="%23334155">Qté</text>
      <text x="530" y="232" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="%23334155">Total HT</text>
      <line x1="40" y1="280" x2="610" y2="280" stroke="%23f1f5f9" stroke-width="1" />
      <text x="55" y="268" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="%230f172a">Audit d'infrastructure et conformité réglementaire</text>
      <text x="430" y="268" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="%2364748b">1</text>
      <text x="530" y="268" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="%230f172a">1 450,00 €</text>
      <line x1="40" y1="320" x2="610" y2="320" stroke="%23f1f5f9" stroke-width="1" />
      <text x="55" y="308" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="%230f172a">Intégration des templates HTML sécurisés</text>
      <text x="430" y="308" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="%2364748b">1</text>
      <text x="540" y="308" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="%230f172a">850,00 €</text>
      <!-- Total -->
      <rect x="360" y="340" width="250" height="42" fill="%23f8fafc" rx="4" />
      <text x="380" y="366" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="%230f172a">Total TTC payé :</text>
      <text x="515" y="366" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="%231e40af">2 760,00 €</text>
      <!-- Zone Signature & Tampon -->
      <g id="signature_zone">
        <text x="40" y="470" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="%23334155">Pour faire valoir ce que de droit,</text>
        <text x="40" y="490" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="%2364748b">Jean-Marc Beaumont &middot; Associé Gérant</text>
        <!-- Signature Manuscrite Tracé Authentique -->
        <path d="M50 560 Q 70 510 110 525 T 160 540 T 190 510 Q 210 550 240 535" fill="none" stroke="%231e3a8a" stroke-width="3" stroke-linecap="round" />
        <path d="M70 545 Q 120 575 220 555" fill="none" stroke="%231e3a8a" stroke-width="2" />
        <!-- Cachet / Tampon Rond Officiel -->
        <g transform="translate(390, 480) rotate(-6)">
          <circle cx="50" cy="50" r="46" fill="none" stroke="%23b91c1c" stroke-width="3" stroke-dasharray="8 4" opacity="0.88" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="%23b91c1c" stroke-width="1.5" opacity="0.88" />
          <text x="50" y="36" font-family="Helvetica, Arial, sans-serif" font-size="8" font-weight="bold" fill="%23b91c1c" text-anchor="middle" letter-spacing="1">CABINET BEAUMONT</text>
          <text x="50" y="54" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="%23b91c1c" text-anchor="middle">CERTIFIÉ CONFORME</text>
          <text x="50" y="68" font-family="Helvetica, Arial, sans-serif" font-size="8" fill="%23b91c1c" text-anchor="middle">PARIS &middot; 2026</text>
        </g>
      </g>
      <!-- Pied de page -->
      <line x1="40" y1="740" x2="610" y2="740" stroke="%23e2e8f0" stroke-width="1" />
      <text x="325" y="765" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">Cabinet Beaumont &amp; Associés &middot; RCS Paris 849 203 112 &middot; 18 Rue Royale, 75008 Paris</text>
    </svg>`),
    detectedElements: [
      {
        id: 'det_logo',
        label: 'Logo Officiel Beaumont',
        box2d: [40, 50, 115, 420],
        description: 'Blason circulaire et raison sociale',
        category: 'logo',
      },
      {
        id: 'det_sig',
        label: 'Signature Manuscrite Originale',
        box2d: [500, 45, 595, 290],
        description: 'Tracé authentique encre bleue à la plume',
        category: 'signature',
      },
      {
        id: 'det_stamp',
        label: 'Tampon Certifié Conforme',
        box2d: [475, 380, 590, 505],
        description: 'Cachet rouge certifié officiel',
        category: 'stamp',
      },
    ],
  },
  {
    name: 'Banniere_Newsletter_Tech.png',
    type: 'image',
    description: 'Maquette de newsletter avec en-tête moderne, bannière hero et disposition en 2 colonnes.',
    width: 600,
    height: 700,
    dataUrl: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
      <rect width="600" height="700" fill="%23ffffff" />
      <rect x="0" y="0" width="600" height="70" fill="%230f172a" />
      <text x="30" y="44" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff">TECH PULSE</text>
      <!-- Banniere -->
      <rect x="30" y="90" width="540" height="200" fill="%232563eb" rx="8" />
      <text x="50" y="160" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23ffffff">L'Avenir des Emails HTML</text>
      <text x="50" y="195" font-family="sans-serif" font-size="14" fill="%23dbeafe">Découvrez notre étude annuelle sur les formats de messagerie</text>
      <!-- Colonnes -->
      <rect x="30" y="320" width="255" height="180" fill="%23f8fafc" stroke="%23e2e8f0" rx="8" />
      <text x="45" y="360" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">Délivrabilité 100%</text>
      <text x="45" y="390" font-family="sans-serif" font-size="12" fill="%2364748b">Optimisez vos en-têtes et évitez les filtres spam Gmail.</text>
      <rect x="315" y="320" width="255" height="180" fill="%23f8fafc" stroke="%23e2e8f0" rx="8" />
      <text x="330" y="360" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">Design Responsive</text>
      <text x="330" y="390" font-family="sans-serif" font-size="12" fill="%2364748b">Mise en page fluide compatible mobile et desktop.</text>
    </svg>`),
    detectedElements: [
      {
        id: 'det_tech_logo',
        label: 'Logo Tech Pulse',
        box2d: [15, 30, 80, 240],
        description: 'Wordmark blanc sur fond sombre',
        category: 'logo',
      },
      {
        id: 'det_tech_banner',
        label: 'Bannière Bleue Principale',
        box2d: [130, 40, 420, 960],
        description: 'Bannière hero avec titre',
        category: 'banner',
      },
    ],
  },
];

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportDocument }) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSafeClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // If modal is not open, do NOT render anything into the DOM
  if (!isOpen) return null;

  const handleSafeClose = () => {
    setLoading(false);
    setErrorMessage(null);
    onClose();
  };

  const handleProcessFile = async (file: File) => {
    setLoading(true);
    setErrorMessage(null);
    const fileName = file.name;
    const isPdf = file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
    const isHtml = file.type === 'text/html' || fileName.toLowerCase().endsWith('.html') || fileName.toLowerCase().endsWith('.htm');

    try {
      if (isHtml) {
        const text = await file.text();
        const { dataUrl, width, height, rawText } = processHtmlFile(text, fileName);
        const doc: ImportedDocument = {
          name: fileName,
          type: 'html',
          dataUrl,
          width,
          height,
          rawText,
        };
        setLoading(false);
        onImportDocument(doc, true);
        handleSafeClose();
      } else if (isPdf) {
        const { dataUrl, width, height, extractedText } = await processPdfFile(file);
        const doc: ImportedDocument = {
          name: fileName,
          type: 'pdf',
          dataUrl,
          width,
          height,
          rawText: extractedText,
        };
        setLoading(false);
        onImportDocument(doc, true);
        handleSafeClose();
      } else {
        // Image file (PNG, JPG, JPEG, WebP, etc.)
        const { dataUrl, width, height } = await processImageFile(file);
        const doc: ImportedDocument = {
          name: fileName,
          type: 'image',
          dataUrl,
          width,
          height,
        };
        setLoading(false);
        onImportDocument(doc, true);
        handleSafeClose();
      }
    } catch (err: any) {
      console.error('Erreur importation document:', err);
      setLoading(false);
      setErrorMessage("Impossible de traiter ce fichier : " + (err?.message || 'Erreur inconnue'));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_DOCUMENTS[0]) => {
    try {
      const doc: ImportedDocument = {
        name: sample.name,
        type: sample.type,
        dataUrl: sample.dataUrl,
        width: sample.width,
        height: sample.height,
        detectedElements: sample.detectedElements,
      };
      onImportDocument(doc, true);
    } catch (err) {
      console.error('Error applying sample:', err);
    } finally {
      handleSafeClose();
    }
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) {
          handleSafeClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Importer un document source
            </h3>
            <p className="text-xs text-slate-500">
              Images (PNG, JPG, JPEG), PDF ou fichiers HTML
            </p>
          </div>
          <button
            type="button"
            onClick={handleSafeClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Fermer (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Drag & Drop Area */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              dragOver
                ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
                : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/50 bg-slate-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.html,.htm"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
            </div>

            <h4 className="text-sm font-bold text-slate-800 mb-1">
              {loading ? 'Traitement et conversion du document...' : 'Glissez-déposez votre fichier ici, ou cliquez pour parcourir'}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {loading ? 'Conversion haute fidélité pour affichage et découpe...' : 'Formats supportés : PNG, JPG, JPEG, PDF, HTML (jusqu\'à 25 Mo)'}
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <FileImage className="w-3.5 h-3.5" /> Images
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> PDF
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> HTML
              </span>
            </div>
          </div>

          {/* Sample Documents (1-Click Test) */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ou essayez instantanément un modèle d'exemple prêt à l'emploi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_DOCUMENTS.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {sample.name}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        Découpes prêtes
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Charger et découper</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Règle absolue : Vos graphismes originaux sont conservés sans aucune déformation</span>
          <button
            type="button"
            onClick={handleSafeClose}
            className="px-4 py-1.5 text-slate-600 hover:text-slate-800 rounded-lg font-medium cursor-pointer transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
