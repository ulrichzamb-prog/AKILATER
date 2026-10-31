import React from 'react';
import {
  Layout,
  Type,
  Image as ImageIcon,
  MousePointer,
  Columns2,
  Columns3,
  ShoppingBag,
  PenTool,
  Minus,
  MoveVertical,
  Sliders,
  Code2,
  Plus,
  Layers,
  Scissors,
} from 'lucide-react';
import { BlockType, ExtractedAsset } from '../../types/template';

interface BlockLibrarySidebarProps {
  onAddBlock: (type: BlockType) => void;
  extractedAssets: ExtractedAsset[];
  onOpenCropper: () => void;
  onOpenImportModal: () => void;
  hasDocument: boolean;
}

export const BlockLibrarySidebar: React.FC<BlockLibrarySidebarProps> = ({
  onAddBlock,
  extractedAssets,
  onOpenCropper,
  onOpenImportModal,
  hasDocument,
}) => {
  const blockItems: { type: BlockType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'header',
      label: 'En-tête & Logo',
      icon: <Layout className="w-4 h-4 text-blue-600" />,
      desc: 'Logo original centré ou aligné',
    },
    {
      type: 'hero_image',
      label: 'Bannière Visuelle',
      icon: <ImageIcon className="w-4 h-4 text-indigo-600" />,
      desc: 'Image hero pleine largeur',
    },
    {
      type: 'text',
      label: 'Titre & Paragraphes',
      icon: <Type className="w-4 h-4 text-emerald-600" />,
      desc: 'Textes avec tailles et styles',
    },
    {
      type: 'button',
      label: 'Bouton d\'Action',
      icon: <MousePointer className="w-4 h-4 text-rose-600" />,
      desc: 'Bouton bulletproof Gmail/Outlook',
    },
    {
      type: 'two_column',
      label: '2 Colonnes',
      icon: <Columns2 className="w-4 h-4 text-sky-600" />,
      desc: 'Disposition côte-à-côte responsive',
    },
    {
      type: 'three_column',
      label: '3 Colonnes',
      icon: <Columns3 className="w-4 h-4 text-teal-600" />,
      desc: 'Grille d\'avantages ou fonctionnalités',
    },
    {
      type: 'product_card',
      label: 'Carte Offre / Produit',
      icon: <ShoppingBag className="w-4 h-4 text-amber-600" />,
      desc: 'Image, prix, badge et CTA',
    },
    {
      type: 'signature',
      label: 'Signature & Cachet',
      icon: <PenTool className="w-4 h-4 text-purple-600" />,
      desc: 'Signature manuscrite et tampon',
    },
    {
      type: 'divider',
      label: 'Ligne Séparatrice',
      icon: <Minus className="w-4 h-4 text-slate-500" />,
      desc: 'Séparateur fin ou pointillé',
    },
    {
      type: 'spacer',
      label: 'Espaceur Vertical',
      icon: <MoveVertical className="w-4 h-4 text-slate-500" />,
      desc: 'Ajustement précis des marges',
    },
    {
      type: 'footer',
      label: 'Pied de Page Légal',
      icon: <Sliders className="w-4 h-4 text-slate-600" />,
      desc: 'Désinscription et coordonnées',
    },
    {
      type: 'custom_html',
      label: 'Code HTML Libre',
      icon: <Code2 className="w-4 h-4 text-orange-600" />,
      desc: 'Tableaux et balises personnalisés',
    },
  ];

  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden text-xs shrink-0 select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/50">
        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
          Bibliothèque de Blocs
        </h4>
        <p className="text-[11px] text-slate-400">
          Cliquez pour ajouter au template
        </p>
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {blockItems.map(item => (
          <button
            key={item.type}
            type="button"
            onClick={() => onAddBlock(item.type)}
            className="w-full p-2.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-xs transition-colors">
                {item.icon}
              </div>
              <div className="truncate">
                <div className="font-semibold text-slate-800 text-xs group-hover:text-blue-600 transition-colors">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {item.desc}
                </div>
              </div>
            </div>
            <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Original Elements Callout Box */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-blue-600" />
            <span>Découpe originale</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {extractedAssets.length} actif(s)
          </span>
        </div>

        <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
          {hasDocument
            ? 'Découpez vos logos et signatures réels depuis le document source.'
            : 'Importez un document original pour extraire vos vrais graphismes.'}
        </p>

        {hasDocument ? (
          <button
            type="button"
            onClick={onOpenCropper}
            className="w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded text-[11px] border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Scissors className="w-3 h-3" />
            <span>Ouvrir l'outil de découpe</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenImportModal}
            className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded text-[11px] border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3 h-3" />
            <span>Importer un document</span>
          </button>
        )}
      </div>
    </div>
  );
};
