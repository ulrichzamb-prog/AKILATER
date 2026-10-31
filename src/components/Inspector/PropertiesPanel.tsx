import React, { useState } from 'react';
import {
  Sliders,
  Type,
  Palette,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Layers,
  Image as ImageIcon,
  PenTool,
  Stamp,
  Trash2,
  Settings2,
} from 'lucide-react';
import {
  EmailTemplate,
  EmailBlock,
  EmailFontFamily,
  ExtractedAsset,
} from '../../types/template';

interface PropertiesPanelProps {
  template: EmailTemplate;
  selectedBlockId: string | null;
  extractedAssets: ExtractedAsset[];
  onUpdateGlobalSettings: (newSettings: Partial<EmailTemplate['globalSettings']>) => void;
  onUpdateSubjectAndPreheader: (subject: string, preheader: string, recipient: string) => void;
  onUpdateBlockData: (id: string, newData: any) => void;
  onUpdateBlockBg: (id: string, color: string) => void;
  onDeleteBlock: (id: string) => void;
  onOpenCropper: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  template,
  selectedBlockId,
  extractedAssets,
  onUpdateGlobalSettings,
  onUpdateSubjectAndPreheader,
  onUpdateBlockData,
  onUpdateBlockBg,
  onDeleteBlock,
  onOpenCropper,
}) => {
  const [activeTab, setActiveTab] = useState<'block' | 'global' | 'assets'>('block');

  const selectedBlock = template.blocks.find(b => b.id === selectedBlockId);

  // If no block is selected, default to global settings view
  const currentTab = !selectedBlock && activeTab === 'block' ? 'global' : activeTab;

  const fontOptions: { value: EmailFontFamily; label: string }[] = [
    { value: 'Arial, Helvetica, sans-serif', label: 'Arial (Recommandé Gmail)' },
    { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, serif', label: 'Georgia (Élégant)' },
    { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
    { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS' },
    { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
    { value: '"Courier New", Courier, monospace', label: 'Courier New' },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 overflow-hidden text-xs">
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/70 p-1 shrink-0">
        <button
          onClick={() => setActiveTab('block')}
          disabled={!selectedBlock}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-colors ${
            currentTab === 'block'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {selectedBlock ? `Bloc : ${selectedBlock.type}` : 'Bloc'}
        </button>

        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-colors ${
            currentTab === 'global' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Email & Style
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-1.5 px-2 rounded-md font-medium text-center transition-colors relative ${
            currentTab === 'assets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Éléments ({extractedAssets.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: BLOCK PROPERTIES */}
        {currentTab === 'block' && selectedBlock && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
                Type de bloc : {selectedBlock.type}
              </span>
              <button
                onClick={() => onDeleteBlock(selectedBlock.id)}
                className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            </div>

            {/* Background Color of block */}
            <div>
              <label className="block text-slate-600 font-medium mb-1">Couleur de fond du bloc</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedBlock.backgroundColor || '#ffffff'}
                  onChange={e => onUpdateBlockBg(selectedBlock.id, e.target.value)}
                  className="w-7 h-7 p-0 border border-slate-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedBlock.backgroundColor || 'transparent'}
                  onChange={e => onUpdateBlockBg(selectedBlock.id, e.target.value)}
                  placeholder="transparent ou #ffffff"
                  className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* BLOCK SPECIFIC CONTROLS */}
            {selectedBlock.type === 'header' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Logo URL ou élément découpé</label>
                  <input
                    type="text"
                    value={(selectedBlock.data as any).logoUrl || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        logoUrl: e.target.value,
                      })
                    }
                    placeholder="https://... ou choisissez un élément découpé"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 text-[11px]"
                  />
                  {extractedAssets.filter(a => a.category === 'logo').length > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] text-slate-400 block mb-1">Logos originaux détectés :</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {extractedAssets
                          .filter(a => a.category === 'logo')
                          .map(a => (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() =>
                                onUpdateBlockData(selectedBlock.id, {
                                  ...selectedBlock.data,
                                  logoUrl: a.dataUrl,
                                })
                              }
                              className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded text-[10px] font-medium hover:bg-blue-100"
                            >
                              Appliquer {a.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Largeur Logo (px)</label>
                    <input
                      type="number"
                      value={(selectedBlock.data as any).logoWidth || 180}
                      onChange={e =>
                        onUpdateBlockData(selectedBlock.id, {
                          ...selectedBlock.data,
                          logoWidth: Number(e.target.value),
                        })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Alignement</label>
                    <div className="flex items-center bg-slate-100 rounded p-0.5">
                      {(['left', 'center', 'right'] as const).map(align => (
                        <button
                          key={align}
                          onClick={() =>
                            onUpdateBlockData(selectedBlock.id, {
                              ...selectedBlock.data,
                              align,
                            })
                          }
                          className={`flex-1 py-1 rounded text-center transition-colors ${
                            (selectedBlock.data as any).align === align ? 'bg-white shadow-xs font-semibold' : ''
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Texte alternatif (Alt)</label>
                  <input
                    type="text"
                    value={(selectedBlock.data as any).logoAlt || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        logoAlt: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>
              </div>
            )}

            {selectedBlock.type === 'text' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Titre de section</label>
                  <input
                    type="text"
                    value={(selectedBlock.data as any).title || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        title: e.target.value,
                      })
                    }
                    placeholder="Titre de la section..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Couleur titre</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={(selectedBlock.data as any).titleColor || '#0f172a'}
                        onChange={e =>
                          onUpdateBlockData(selectedBlock.id, {
                            ...selectedBlock.data,
                            titleColor: e.target.value,
                          })
                        }
                        className="w-7 h-7 p-0 border border-slate-300 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={(selectedBlock.data as any).titleColor || '#0f172a'}
                        onChange={e =>
                          onUpdateBlockData(selectedBlock.id, {
                            ...selectedBlock.data,
                            titleColor: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-[10px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Taille titre (px)</label>
                    <input
                      type="number"
                      value={(selectedBlock.data as any).titleSize || 22}
                      onChange={e =>
                        onUpdateBlockData(selectedBlock.id, {
                          ...selectedBlock.data,
                          titleSize: Number(e.target.value),
                        })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    />
                  </div>
                </div>

                {/* Typography / Font Family */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Typographie (Police)</label>
                  <select
                    value={(selectedBlock.data as any).fontFamily || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        fontFamily: e.target.value || undefined,
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 bg-white"
                  >
                    <option value="">Hériter de l'email global ({template.globalSettings.fontFamily.split(',')[0].replace(/"/g, '')})</option>
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Taille texte (px)</label>
                    <input
                      type="number"
                      value={(selectedBlock.data as any).fontSize || 15}
                      onChange={e =>
                        onUpdateBlockData(selectedBlock.id, {
                          ...selectedBlock.data,
                          fontSize: Number(e.target.value),
                        })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Graisse (Style)</label>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateBlockData(selectedBlock.id, {
                          ...selectedBlock.data,
                          fontWeight: (selectedBlock.data as any).fontWeight === 'bold' ? 'normal' : 'bold',
                        })
                      }
                      className={`w-full py-1.5 px-2 border rounded font-medium transition-colors ${
                        (selectedBlock.data as any).fontWeight === 'bold'
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                          : 'border-slate-300 text-slate-700'
                      }`}
                    >
                      {(selectedBlock.data as any).fontWeight === 'bold' ? 'Gras (Bold)' : 'Normal'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Couleur texte</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={(selectedBlock.data as any).textColor || template.globalSettings.textColor}
                        onChange={e =>
                          onUpdateBlockData(selectedBlock.id, {
                            ...selectedBlock.data,
                            textColor: e.target.value,
                          })
                        }
                        className="w-7 h-7 p-0 border border-slate-300 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={(selectedBlock.data as any).textColor || template.globalSettings.textColor}
                        onChange={e =>
                          onUpdateBlockData(selectedBlock.id, {
                            ...selectedBlock.data,
                            textColor: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-[10px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Alignement</label>
                    <div className="flex items-center bg-slate-100 rounded p-0.5">
                      {(['left', 'center', 'right', 'justify'] as const).map(align => (
                        <button
                          key={align}
                          onClick={() =>
                            onUpdateBlockData(selectedBlock.id, {
                              ...selectedBlock.data,
                              align,
                            })
                          }
                          className={`flex-1 py-1 rounded text-center transition-colors ${
                            (selectedBlock.data as any).align === align ? 'bg-white shadow-xs font-semibold' : ''
                          }`}
                        >
                          {align[0].toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Contenu texte (Édition directe au clic possible)</label>
                  <textarea
                    rows={4}
                    value={(selectedBlock.data as any).content || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        content: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {selectedBlock.type === 'button' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Libellé du bouton</label>
                  <input
                    type="text"
                    value={(selectedBlock.data as any).text || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        text: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Lien de destination (URL)</label>
                  <input
                    type="url"
                    value={(selectedBlock.data as any).url || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        url: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Couleur bouton</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={(selectedBlock.data as any).buttonColor || '#1e40af'}
                        onChange={e =>
                          onUpdateBlockData(selectedBlock.id, {
                            ...selectedBlock.data,
                            buttonColor: e.target.value,
                          })
                        }
                        className="w-7 h-7 p-0 border border-slate-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={(selectedBlock.data as any).buttonColor || '#1e40af'}
                        onChange={e =>
                          onUpdateBlockData(selectedBlock.id, {
                            ...selectedBlock.data,
                            buttonColor: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Rayon bords (px)</label>
                    <input
                      type="number"
                      value={(selectedBlock.data as any).borderRadius ?? 6}
                      onChange={e =>
                        onUpdateBlockData(selectedBlock.id, {
                          ...selectedBlock.data,
                          borderRadius: Number(e.target.value),
                        })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedBlock.type === 'signature' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nom du signataire</label>
                  <input
                    type="text"
                    value={(selectedBlock.data as any).name || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Fonction & Société</label>
                  <input
                    type="text"
                    value={(selectedBlock.data as any).title || ''}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                {/* Cropped Signature Selection */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Signature manuscrite d'origine</label>
                  {extractedAssets.filter(a => a.category === 'signature').length > 0 ? (
                    <div className="space-y-1.5">
                      {extractedAssets
                        .filter(a => a.category === 'signature')
                        .map(a => (
                          <div
                            key={a.id}
                            onClick={() =>
                              onUpdateBlockData(selectedBlock.id, {
                                ...selectedBlock.data,
                                signatureImageUrl: a.dataUrl,
                              })
                            }
                            className={`flex items-center gap-2 p-1.5 border rounded cursor-pointer transition-colors ${
                              (selectedBlock.data as any).signatureImageUrl === a.dataUrl
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <img src={a.dataUrl} alt="" className="h-6 w-auto object-contain bg-white rounded p-0.5" />
                            <span className="text-[11px] font-medium text-slate-800">{a.label}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenCropper}
                      className="w-full py-2 px-3 border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-lg text-center font-medium"
                    >
                      Découper une signature originale
                    </button>
                  )}
                </div>

                {/* Cropped Stamp Selection */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cachet ou Sceau officiel</label>
                  {extractedAssets.filter(a => a.category === 'stamp').length > 0 ? (
                    <div className="space-y-1.5">
                      {extractedAssets
                        .filter(a => a.category === 'stamp')
                        .map(a => (
                          <div
                            key={a.id}
                            onClick={() =>
                              onUpdateBlockData(selectedBlock.id, {
                                ...selectedBlock.data,
                                stampImageUrl: a.dataUrl,
                              })
                            }
                            className={`flex items-center gap-2 p-1.5 border rounded cursor-pointer transition-colors ${
                              (selectedBlock.data as any).stampImageUrl === a.dataUrl
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <img src={a.dataUrl} alt="" className="h-6 w-auto object-contain bg-white rounded p-0.5" />
                            <span className="text-[11px] font-medium text-slate-800">{a.label}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenCropper}
                      className="w-full py-2 px-3 border border-dashed border-slate-300 bg-slate-50 text-slate-600 rounded-lg text-center font-medium hover:bg-slate-100"
                    >
                      Découper un cachet / tampon
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Common Paddings */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-slate-600 font-medium mb-1.5">Espacements verticaux (px)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">Marge Haut</span>
                  <input
                    type="number"
                    value={(selectedBlock.data as any).paddingTop ?? 16}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        paddingTop: Number(e.target.value),
                      })
                    }
                    className="w-full px-2 py-1 border border-slate-300 rounded text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Marge Bas</span>
                  <input
                    type="number"
                    value={(selectedBlock.data as any).paddingBottom ?? 16}
                    onChange={e =>
                      onUpdateBlockData(selectedBlock.id, {
                        ...selectedBlock.data,
                        paddingBottom: Number(e.target.value),
                      })
                    }
                    className="w-full px-2 py-1 border border-slate-300 rounded text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL EMAIL PROPERTIES */}
        {currentTab === 'global' && (
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block mb-2">
                Paramètres de l'email
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Objet de l'email (Sujet)</label>
                  <input
                    type="text"
                    value={template.subject}
                    onChange={e =>
                      onUpdateSubjectAndPreheader(e.target.value, template.preheader, template.recipientEmail)
                    }
                    placeholder="Sujet attrayant..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Texte d'aperçu (Pré-header)</label>
                  <input
                    type="text"
                    value={template.preheader}
                    onChange={e =>
                      onUpdateSubjectAndPreheader(template.subject, e.target.value, template.recipientEmail)
                    }
                    placeholder="Bref résumé visible dans la boîte de réception..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Destinataire par défaut (Optionnel)</label>
                  <input
                    type="email"
                    value={template.recipientEmail || ''}
                    onChange={e =>
                      onUpdateSubjectAndPreheader(template.subject, template.preheader, e.target.value)
                    }
                    placeholder="client@domaine.com"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block">
                Mise en page & Couleurs
              </span>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Police de caractères sûre</label>
                <select
                  value={template.globalSettings.fontFamily}
                  onChange={e =>
                    onUpdateGlobalSettings({ fontFamily: e.target.value as EmailFontFamily })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 bg-white"
                >
                  {fontOptions.map(f => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Largeur maximale du conteneur</label>
                <div className="grid grid-cols-3 gap-2">
                  {[600, 640, 650].map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => onUpdateGlobalSettings({ maxWidth: w })}
                      className={`py-1.5 px-2 rounded border font-mono text-center transition-colors ${
                        template.globalSettings.maxWidth === w
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Fond extérieur</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={template.globalSettings.backgroundColor}
                      onChange={e => onUpdateGlobalSettings({ backgroundColor: e.target.value })}
                      className="w-6 h-6 p-0 border border-slate-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={template.globalSettings.backgroundColor}
                      onChange={e => onUpdateGlobalSettings({ backgroundColor: e.target.value })}
                      className="w-full px-1.5 py-1 border border-slate-300 rounded font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Fond conteneur</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={template.globalSettings.containerColor}
                      onChange={e => onUpdateGlobalSettings({ containerColor: e.target.value })}
                      className="w-6 h-6 p-0 border border-slate-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={template.globalSettings.containerColor}
                      onChange={e => onUpdateGlobalSettings({ containerColor: e.target.value })}
                      className="w-full px-1.5 py-1 border border-slate-300 rounded font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXTRACTED GRAPHIC ASSETS */}
        {currentTab === 'assets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
                Éléments d'origine ({extractedAssets.length})
              </span>
              <button
                onClick={onOpenCropper}
                className="text-blue-600 hover:text-blue-800 font-medium text-[11px]"
              >
                + Nouvelle découpe
              </button>
            </div>

            {extractedAssets.length === 0 ? (
              <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-lg">
                <p className="text-xs mb-2">Aucun élément graphique découpé pour l'instant.</p>
                <button
                  onClick={onOpenCropper}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                >
                  Découper un logo ou une signature
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {extractedAssets.map(asset => (
                  <div
                    key={asset.id}
                    className="p-2 border border-slate-200 rounded-lg flex items-center justify-between gap-2 hover:border-blue-300 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center p-1">
                        <img src={asset.dataUrl} alt={asset.label} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-[11px]">{asset.label}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{asset.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
