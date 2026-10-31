import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
  MousePointer,
  Sparkles,
} from 'lucide-react';
import {
  EmailTemplate,
  EmailBlock,
  BlockType,
  HeaderBlockData,
  HeroImageBlockData,
  TextBlockData,
  TwoColumnBlockData,
  ThreeColumnBlockData,
  ButtonBlockData,
  DividerBlockData,
  SpacerBlockData,
  ProductCardBlockData,
  SignatureBlockData,
  FooterBlockData,
  CustomHtmlBlockData,
} from '../../types/template';

interface VisualEditorProps {
  template: EmailTemplate;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlockData: (id: string, newData: any) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onDuplicateBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlockAtIndex: (index: number, type: BlockType) => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  template,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlockData,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onAddBlockAtIndex,
}) => {
  const [insertPopoverIndex, setInsertPopoverIndex] = useState<number | null>(null);

  const { globalSettings, blocks } = template;
  const maxWidth = globalSettings.maxWidth || 600;
  const fontFamily = globalSettings.fontFamily || 'Arial, Helvetica, sans-serif';
  const bgOuter = globalSettings.backgroundColor || '#f8fafc';
  const bgContainer = globalSettings.containerColor || '#ffffff';

  const renderBlockContent = (block: EmailBlock) => {
    switch (block.type) {
      case 'header': {
        const d = block.data as HeaderBlockData;
        const align = d.align || 'center';
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 24}px`,
              paddingBottom: `${d.paddingBottom ?? 24}px`,
              textAlign: align,
            }}
          >
            {d.logoUrl ? (
              <img
                src={d.logoUrl}
                alt={d.logoAlt || 'Logo'}
                style={{
                  width: `${d.logoWidth || 180}px`,
                  display: 'inline-block',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            ) : (
              <h1
                contentEditable
                suppressContentEditableWarning
                onBlur={e => onUpdateBlockData(block.id, { ...d, logoAlt: e.currentTarget.innerText })}
                className="text-2xl font-bold text-slate-800 tracking-tight outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
              >
                {d.logoAlt || 'Nom de votre Entreprise'}
              </h1>
            )}
            {d.viewOnlineText && (
              <div className="text-[11px] text-slate-400 mt-2">
                <span className="underline">{d.viewOnlineText}</span>
              </div>
            )}
          </div>
        );
      }

      case 'hero_image': {
        const d = block.data as HeroImageBlockData;
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 16}px`,
              paddingBottom: `${d.paddingBottom ?? 16}px`,
              paddingLeft: d.fullWidth ? '0px' : '24px',
              paddingRight: d.fullWidth ? '0px' : '24px',
            }}
          >
            <img
              src={d.imageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80'}
              alt={d.altText || 'Bannière'}
              style={{
                width: '100%',
                borderRadius: d.fullWidth ? '0px' : '8px',
                display: 'block',
              }}
            />
            {d.caption && (
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={e => onUpdateBlockData(block.id, { ...d, caption: e.currentTarget.innerText })}
                className="text-xs text-slate-500 italic text-center mt-2 outline-none"
              >
                {d.caption}
              </p>
            )}
          </div>
        );
      }

      case 'text': {
        const d = block.data as TextBlockData;
        const align = d.align || 'left';
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 16}px`,
              paddingBottom: `${d.paddingBottom ?? 16}px`,
              paddingLeft: `${d.paddingLeft ?? 24}px`,
              paddingRight: `${d.paddingRight ?? 24}px`,
              textAlign: align,
              fontFamily: d.fontFamily || fontFamily,
            }}
          >
            {d.title !== undefined && (
              <h2
                contentEditable
                suppressContentEditableWarning
                onBlur={e => onUpdateBlockData(block.id, { ...d, title: e.currentTarget.innerText })}
                style={{
                  fontFamily: d.fontFamily || fontFamily,
                  fontSize: `${d.titleSize || 22}px`,
                  color: d.titleColor || '#0f172a',
                  fontWeight: 700,
                  marginBottom: '8px',
                  lineHeight: 1.3,
                  outline: 'none',
                }}
                className="hover:bg-blue-50/50 rounded px-1 transition-colors"
              >
                {d.title}
              </h2>
            )}

            {d.subtitle && (
              <h3
                contentEditable
                suppressContentEditableWarning
                onBlur={e => onUpdateBlockData(block.id, { ...d, subtitle: e.currentTarget.innerText })}
                style={{
                  fontFamily: d.fontFamily || fontFamily,
                  fontSize: '16px',
                  color: '#475569',
                  fontWeight: 600,
                  marginBottom: '10px',
                  outline: 'none',
                }}
                className="hover:bg-blue-50/50 rounded px-1 transition-colors"
              >
                {d.subtitle}
              </h3>
            )}

            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={e => onUpdateBlockData(block.id, { ...d, content: e.currentTarget.innerText })}
              style={{
                fontFamily: d.fontFamily || fontFamily,
                fontSize: `${d.fontSize || 15}px`,
                fontWeight: d.fontWeight === 'bold' ? 700 : 400,
                lineHeight: d.lineHeight || 1.6,
                color: d.textColor || globalSettings.textColor,
                outline: 'none',
                whiteSpace: 'pre-wrap',
              }}
              className="hover:bg-blue-50/50 rounded p-1 transition-colors"
            >
              {d.content}
            </div>
          </div>
        );
      }

      case 'button': {
        const d = block.data as ButtonBlockData;
        const align = d.align || 'center';
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 16}px`,
              paddingBottom: `${d.paddingBottom ?? 16}px`,
              textAlign: align,
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={e => onUpdateBlockData(block.id, { ...d, text: e.currentTarget.innerText })}
              style={{
                display: 'inline-block',
                backgroundColor: d.buttonColor || '#1e40af',
                color: d.textColor || '#ffffff',
                borderRadius: `${d.borderRadius ?? 6}px`,
                padding: `${d.buttonPaddingY ?? 12}px ${d.buttonPaddingX ?? 24}px`,
                fontSize: `${d.fontSize || 15}px`,
                fontWeight: d.bold ? 700 : 500,
                outline: 'none',
                cursor: 'pointer',
              }}
              className="shadow-xs hover:opacity-95"
            >
              {d.text || 'Cliquez ici'}
            </span>
          </div>
        );
      }

      case 'two_column': {
        const d = block.data as TwoColumnBlockData;
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 16}px`,
              paddingBottom: `${d.paddingBottom ?? 16}px`,
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-2 border border-slate-100 rounded-lg">
                {d.col1.imageUrl && (
                  <img
                    src={d.col1.imageUrl}
                    alt=""
                    className="w-full h-auto rounded mb-3"
                  />
                )}
                <h4
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e =>
                    onUpdateBlockData(block.id, {
                      ...d,
                      col1: { ...d.col1, title: e.currentTarget.innerText },
                    })
                  }
                  className="font-bold text-slate-900 mb-1 outline-none text-sm"
                >
                  {d.col1.title}
                </h4>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e =>
                    onUpdateBlockData(block.id, {
                      ...d,
                      col1: { ...d.col1, content: e.currentTarget.innerText },
                    })
                  }
                  className="text-xs text-slate-600 outline-none leading-relaxed"
                >
                  {d.col1.content}
                </p>
              </div>

              <div className="p-2 border border-slate-100 rounded-lg">
                {d.col2.imageUrl && (
                  <img
                    src={d.col2.imageUrl}
                    alt=""
                    className="w-full h-auto rounded mb-3"
                  />
                )}
                <h4
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e =>
                    onUpdateBlockData(block.id, {
                      ...d,
                      col2: { ...d.col2, title: e.currentTarget.innerText },
                    })
                  }
                  className="font-bold text-slate-900 mb-1 outline-none text-sm"
                >
                  {d.col2.title}
                </h4>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e =>
                    onUpdateBlockData(block.id, {
                      ...d,
                      col2: { ...d.col2, content: e.currentTarget.innerText },
                    })
                  }
                  className="text-xs text-slate-600 outline-none leading-relaxed"
                >
                  {d.col2.content}
                </p>
              </div>
            </div>
          </div>
        );
      }

      case 'three_column': {
        const d = block.data as ThreeColumnBlockData;
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 16}px`,
              paddingBottom: `${d.paddingBottom ?? 16}px`,
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
              {[d.col1, d.col2, d.col3].map((col, idx) => (
                <div key={idx} className="p-2 border border-slate-100 rounded-lg">
                  <h4 className="font-bold text-slate-900 mb-1 text-sm">{col.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{col.content}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'signature': {
        const d = block.data as SignatureBlockData;
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 20}px`,
              paddingBottom: `${d.paddingBottom ?? 20}px`,
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            <div className="flex items-center gap-6">
              <div>
                {d.signatureImageUrl ? (
                  <div className="mb-2">
                    <img
                      src={d.signatureImageUrl}
                      alt="Signature originale"
                      className="max-h-16 w-auto block object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-blue-600 italic mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Découpez votre signature manuscrite depuis le document source pour l'insérer ici</span>
                  </div>
                )}

                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => onUpdateBlockData(block.id, { ...d, name: e.currentTarget.innerText })}
                  className="font-bold text-slate-900 text-sm outline-none"
                >
                  {d.name || 'Prénom Nom'}
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => onUpdateBlockData(block.id, { ...d, title: e.currentTarget.innerText })}
                  className="text-xs text-slate-600 outline-none"
                >
                  {d.title || 'Fonction'} {d.company ? `· ${d.company}` : ''}
                </div>
                {(d.phone || d.email) && (
                  <div className="text-[11px] text-slate-500 mt-1">
                    {d.phone && <span>{d.phone} · </span>}
                    {d.email && <span className="text-blue-600">{d.email}</span>}
                  </div>
                )}
              </div>

              {d.stampImageUrl && (
                <div className="shrink-0 p-1 border border-dashed border-slate-300 rounded">
                  <img
                    src={d.stampImageUrl}
                    alt="Cachet certifié"
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'product_card': {
        const d = block.data as ProductCardBlockData;
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 16}px`,
              paddingBottom: `${d.paddingBottom ?? 16}px`,
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            <div
              style={{ backgroundColor: d.cardBackground || '#f8fafc' }}
              className="border border-slate-200 rounded-lg p-5 text-center"
            >
              {d.imageUrl && (
                <img
                  src={d.imageUrl}
                  alt={d.title}
                  className="max-h-36 mx-auto mb-3 object-contain rounded"
                />
              )}
              {d.badge && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded mb-2">
                  {d.badge}
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-900 mb-1">{d.title}</h3>
              <div className="text-xl font-bold text-slate-900 mb-2">{d.price}</div>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">{d.description}</p>
              <button
                className="px-5 py-2 text-xs font-semibold text-white rounded shadow-xs"
                style={{ backgroundColor: d.buttonColor || '#1e40af' }}
              >
                {d.buttonText || 'Découvrir'}
              </button>
            </div>
          </div>
        );
      }

      case 'divider': {
        const d = block.data as DividerBlockData;
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 16}px`,
              paddingBottom: `${d.paddingBottom ?? 16}px`,
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            <hr
              style={{
                borderTop: `${d.thickness || 1}px ${d.style || 'solid'} ${d.color || '#e2e8f0'}`,
                width: `${d.widthPercent || 100}%`,
                margin: '0 auto',
                borderBottom: 'none',
              }}
            />
          </div>
        );
      }

      case 'spacer': {
        const d = block.data as SpacerBlockData;
        return (
          <div
            style={{ height: `${d.height || 20}px` }}
            className="flex items-center justify-center text-[10px] text-slate-400 bg-slate-50/50 border border-dashed border-slate-200"
          >
            Espace {d.height || 20}px
          </div>
        );
      }

      case 'footer': {
        const d = block.data as FooterBlockData;
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 24}px`,
              paddingBottom: `${d.paddingBottom ?? 32}px`,
              paddingLeft: '24px',
              paddingRight: '24px',
              textAlign: 'center',
            }}
          >
            <p className="text-xs text-slate-600 mb-1 font-medium">{d.companyName} · {d.address}</p>
            <p className="text-[11px] text-slate-400 mb-2">{d.copyright}</p>
            <div className="text-[11px] text-slate-500">
              <span className="underline cursor-pointer">{d.unsubscribeText || 'Se désinscrire'}</span>
            </div>
          </div>
        );
      }

      case 'custom_html': {
        const d = block.data as CustomHtmlBlockData;
        return (
          <div
            style={{
              paddingTop: `${d.paddingTop ?? 12}px`,
              paddingBottom: `${d.paddingBottom ?? 12}px`,
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
            dangerouslySetInnerHTML={{ __html: d.html || '<p>HTML personnalisé</p>' }}
          />
        );
      }

      default:
        return <div>Bloc non reconnu</div>;
    }
  };

  const blockTypesAvailable: { type: BlockType; label: string }[] = [
    { type: 'header', label: 'En-tête / Logo' },
    { type: 'hero_image', label: 'Bannière Image' },
    { type: 'text', label: 'Texte & Titre' },
    { type: 'button', label: 'Bouton CTA' },
    { type: 'two_column', label: '2 Colonnes' },
    { type: 'three_column', label: '3 Colonnes' },
    { type: 'signature', label: 'Signature & Cachet' },
    { type: 'product_card', label: 'Carte Offre / Produit' },
    { type: 'divider', label: 'Séparateur' },
    { type: 'spacer', label: 'Espaceur' },
    { type: 'footer', label: 'Pied de page légal' },
    { type: 'custom_html', label: 'Code HTML sur-mesure' },
  ];

  return (
    <div
      className="min-h-full py-8 px-4 flex flex-col items-center justify-start overflow-y-auto"
      style={{ backgroundColor: bgOuter }}
      onClick={() => onSelectBlock(null)}
    >
      {/* Subject Line Pill (Quick info) */}
      <div className="mb-4 text-xs text-slate-600 bg-white/80 backdrop-blur-xs border border-slate-200/80 px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-2">
        <span className="font-semibold text-slate-700">Objet :</span>
        <span className="text-slate-900 font-medium">{template.subject || '(Sans objet défini)'}</span>
      </div>

      {/* Main Container Card */}
      <div
        className="w-full bg-white shadow-xl rounded-lg border border-slate-200/90 relative transition-all"
        style={{
          maxWidth: `${maxWidth}px`,
          backgroundColor: bgContainer,
          fontFamily,
        }}
        onClick={e => e.stopPropagation()}
      >
        {blocks.map((block, index) => {
          const isSelected = selectedBlockId === block.id;

          return (
            <div key={block.id} className="relative group">
              {/* Insert In-Between Button Trigger */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setInsertPopoverIndex(insertPopoverIndex === index ? null : index);
                  }}
                  className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 hover:scale-110 transition-transform"
                  title="Insérer un bloc ici"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* In-Between Insert Popover */}
              {insertPopoverIndex === index && (
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 w-80 grid grid-cols-2 gap-1.5 animate-in fade-in zoom-in-95"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="col-span-2 text-[11px] font-bold text-slate-700 px-1 pb-1 border-b border-slate-100 mb-1">
                    Insérer un nouveau bloc :
                  </div>
                  {blockTypesAvailable.map(item => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        onAddBlockAtIndex(index, item.type);
                        setInsertPopoverIndex(null);
                      }}
                      className="px-2.5 py-1.5 text-xs text-left rounded-lg hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Block Wrapper */}
              <div
                onClick={e => {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                }}
                className={`relative transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-blue-600 ring-offset-2 z-10'
                    : 'hover:outline-1 hover:outline-dashed hover:outline-blue-400'
                }`}
                style={{ backgroundColor: block.backgroundColor || 'transparent' }}
              >
                {/* Floating Block Actions Bar */}
                {isSelected && (
                  <div
                    className="absolute -top-8 right-2 z-30 bg-slate-900 text-white rounded-lg shadow-lg flex items-center gap-1 p-1 text-xs"
                    onClick={e => e.stopPropagation()}
                  >
                    <span className="text-[10px] text-slate-300 font-medium px-1.5 uppercase">
                      {block.type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => onMoveBlock(block.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                      title="Monter le bloc"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMoveBlock(block.id, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                      title="Descendre le bloc"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateBlock(block.id)}
                      className="p-1 hover:bg-slate-800 rounded"
                      title="Dupliquer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteBlock(block.id)}
                      className="p-1 hover:bg-red-600 rounded text-red-300 hover:text-white"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Actual Block Rendering */}
                {renderBlockContent(block)}
              </div>
            </div>
          );
        })}

        {/* Bottom Inserter */}
        <div className="p-4 text-center border-t border-dashed border-slate-200">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setInsertPopoverIndex(blocks.length);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une section à la fin</span>
          </button>

          {insertPopoverIndex === blocks.length && (
            <div
              className="mt-3 mx-auto bg-white border border-slate-200 rounded-xl shadow-xl p-3 max-w-sm grid grid-cols-2 gap-1.5"
              onClick={e => e.stopPropagation()}
            >
              {blockTypesAvailable.map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    onAddBlockAtIndex(blocks.length, item.type);
                    setInsertPopoverIndex(null);
                  }}
                  className="px-2.5 py-1.5 text-xs text-left rounded-lg hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
