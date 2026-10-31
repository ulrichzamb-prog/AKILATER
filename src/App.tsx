/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { BlockLibrarySidebar } from './components/Sidebar/BlockLibrarySidebar';
import { VisualEditor } from './components/Editor/VisualEditor';
import { CodeEditor } from './components/Editor/CodeEditor';
import { PropertiesPanel } from './components/Inspector/PropertiesPanel';
import { DocumentViewer } from './components/OriginalDocument/DocumentViewer';
import { ElementCropperModal } from './components/OriginalDocument/ElementCropperModal';
import { GmailModal } from './components/Modals/GmailModal';
import { PreviewModal } from './components/Modals/PreviewModal';
import { TemplatesManagerModal } from './components/Modals/TemplatesManagerModal';
import { ImportModal } from './components/Modals/ImportModal';
import { GuideModal } from './components/Modals/GuideModal';
import { StorageManager, STARTER_TEMPLATES } from './utils/storage';
import {
  EmailTemplate,
  EmailBlock,
  BlockType,
  ImportedDocument,
  ExtractedAsset,
  DetectedElement,
} from './types/template';
import { generateBlocksFromDocument } from './utils/documentProcessor';

export default function App() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(STARTER_TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate>(STARTER_TEMPLATES[0]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [showDocumentSplit, setShowDocumentSplit] = useState<boolean>(true);
  const [mobilePane, setMobilePane] = useState<'document' | 'editor'>('editor');
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Modals state
  const [isGmailModalOpen, setIsGmailModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isCropperModalOpen, setIsCropperModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load templates from IndexedDB on startup
  useEffect(() => {
    StorageManager.getAllTemplates().then(list => {
      if (list && list.length > 0) {
        setTemplates(list);
        setCurrentTemplate(list[0]);
      }
    });
  }, []);

  const saveTimerRef = useRef<any>(null);

  // Persist template to IndexedDB/Storage cleanly
  const persistTemplate = useCallback((tmpl: EmailTemplate) => {
    setIsSaving(true);
    StorageManager.saveTemplate(tmpl).catch(err => {
      console.warn('StorageManager.saveTemplate error:', err);
    });
    setTemplates(prev => {
      const idx = prev.findIndex(t => t.id === tmpl.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = tmpl;
        return copy;
      }
      return [tmpl, ...prev];
    });
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setIsSaving(false), 500);
  }, []);

  // Update current template and schedule safe persistence outside render phase
  const updateTemplate = useCallback(
    (updater: (prev: EmailTemplate) => EmailTemplate) => {
      setCurrentTemplate(prev => {
        const next = updater(prev);
        setTimeout(() => persistTemplate(next), 0);
        return next;
      });
    },
    [persistTemplate]
  );

  // Update Block Data
  const handleUpdateBlockData = (blockId: string, newData: any) => {
    updateTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => (b.id === blockId ? { ...b, data: newData } : b)),
    }));
  };

  // Update Block Background
  const handleUpdateBlockBg = (blockId: string, backgroundColor: string) => {
    updateTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => (b.id === blockId ? { ...b, backgroundColor } : b)),
    }));
  };

  // Move Block Up / Down
  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    updateTemplate(prev => {
      const idx = prev.blocks.findIndex(b => b.id === blockId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.blocks.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const newBlocks = [...prev.blocks];
      const [removed] = newBlocks.splice(idx, 1);
      newBlocks.splice(targetIdx, 0, removed);

      return { ...prev, blocks: newBlocks };
    });
  };

  // Duplicate Block
  const handleDuplicateBlock = (blockId: string) => {
    let clonedId: string | null = null;
    updateTemplate(prev => {
      const idx = prev.blocks.findIndex(b => b.id === blockId);
      if (idx === -1) return prev;
      const original = prev.blocks[idx];
      const cloned: EmailBlock = {
        ...original,
        id: `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        data: JSON.parse(JSON.stringify(original.data)),
      };
      clonedId = cloned.id;
      const newBlocks = [...prev.blocks];
      newBlocks.splice(idx + 1, 0, cloned);
      return { ...prev, blocks: newBlocks };
    });
    if (clonedId) setSelectedBlockId(clonedId);
  };

  // Delete Block
  const handleDeleteBlock = (blockId: string) => {
    if (currentTemplate.blocks.length <= 1) {
      alert('Votre template doit comporter au moins un bloc.');
      return;
    }
    updateTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== blockId),
    }));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  };

  // Add Block at Specific Index or End
  const handleAddBlock = (type: BlockType, index?: number) => {
    const newId = `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let defaultData: any = {};

    switch (type) {
      case 'header':
        defaultData = {
          logoUrl: '',
          logoAlt: currentTemplate.name,
          logoWidth: 160,
          align: 'center',
          paddingTop: 24,
          paddingBottom: 20,
        };
        break;
      case 'hero_image':
        defaultData = {
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
          altText: 'Bannière visuelle',
          caption: '',
          fullWidth: false,
          paddingTop: 16,
          paddingBottom: 16,
        };
        break;
      case 'text':
        defaultData = {
          title: 'Nouveau titre de section',
          titleSize: 22,
          titleColor: '#0f172a',
          content: 'Rédigez ici votre message. Vous pouvez personnaliser la typographie, l\'alignement et les couleurs dans le panneau de droite.',
          align: 'left',
          fontSize: 15,
          lineHeight: 1.6,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
        };
        break;
      case 'button':
        defaultData = {
          text: 'Découvrir nos services',
          url: 'https://example.com',
          buttonColor: '#1e40af',
          textColor: '#ffffff',
          borderRadius: 6,
          align: 'center',
          paddingTop: 14,
          paddingBottom: 20,
          buttonPaddingY: 12,
          buttonPaddingX: 24,
          fullWidthMobile: false,
          fontSize: 15,
          bold: true,
        };
        break;
      case 'two_column':
        defaultData = {
          col1WidthPercent: 50,
          stackOnMobile: true,
          paddingTop: 16,
          paddingBottom: 16,
          col1: {
            title: 'Premier point clé',
            content: 'Détaillez ici un avantage concret ou une offre spécifique.',
          },
          col2: {
            title: 'Second point clé',
            content: 'Apportez une seconde information complémentaire.',
          },
        };
        break;
      case 'three_column':
        defaultData = {
          stackOnMobile: true,
          paddingTop: 16,
          paddingBottom: 16,
          col1: { title: '1. Analyse', content: 'Détection visuelle fidèle' },
          col2: { title: '2. Découpe', content: 'Logos et signatures réels' },
          col3: { title: '3. Envoi', content: 'Intégration directe Gmail' },
        };
        break;
      case 'product_card':
        defaultData = {
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
          badge: 'Offre Spéciale',
          title: 'Produit ou Forfait Entreprise',
          price: '199,00 €',
          description: 'Description claire de l\'offre avec toutes les garanties incluses.',
          buttonText: 'Commander',
          buttonUrl: 'https://example.com',
          buttonColor: '#1e40af',
          cardBackground: '#f8fafc',
          paddingTop: 16,
          paddingBottom: 16,
        };
        break;
      case 'signature':
        defaultData = {
          name: 'Jean Dupont',
          title: 'Directeur Général',
          company: 'Email Template Studio',
          phone: '+33 (0)1 23 45 67 89',
          email: 'contact@domaine.fr',
          align: 'left',
          paddingTop: 20,
          paddingBottom: 20,
        };
        break;
      case 'divider':
        defaultData = {
          style: 'solid',
          color: '#e2e8f0',
          thickness: 1,
          widthPercent: 100,
          paddingTop: 16,
          paddingBottom: 16,
        };
        break;
      case 'spacer':
        defaultData = { height: 24 };
        break;
      case 'footer':
        defaultData = {
          companyName: 'Votre Entreprise',
          address: 'Paris, France',
          unsubscribeText: 'Se désinscrire de ces communications',
          unsubscribeUrl: 'https://example.com/unsubscribe',
          copyright: '© 2026 Tous droits réservés.',
          textColor: '#64748b',
          showSocials: false,
          paddingTop: 24,
          paddingBottom: 32,
        };
        break;
      case 'custom_html':
        defaultData = {
          html: '<p style="margin: 0; font-size: 14px; color: #475569;">Bloc HTML personnalisé</p>',
          paddingTop: 12,
          paddingBottom: 12,
        };
        break;
    }

    const newBlock: EmailBlock = {
      id: newId,
      type,
      data: defaultData,
    };

    updateTemplate(prev => {
      const newBlocks = [...prev.blocks];
      if (typeof index === 'number') {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return { ...prev, blocks: newBlocks };
    });
    setSelectedBlockId(newId);
  };

  // Update Global Settings
  const handleUpdateGlobalSettings = (newSettings: Partial<EmailTemplate['globalSettings']>) => {
    updateTemplate(prev => ({
      ...prev,
      globalSettings: { ...prev.globalSettings, ...newSettings },
    }));
  };

  // Update Subject, Preheader, Recipient
  const handleUpdateSubjectAndPreheader = (subject: string, preheader: string, recipient: string) => {
    updateTemplate(prev => ({
      ...prev,
      subject,
      preheader,
      recipientEmail: recipient,
    }));
  };

  // Handle Document Import
  const handleImportDocument = (doc: ImportedDocument, autoAnalyze = true) => {
    try {
      // Generate blocks from the imported document structure
      const generatedBlocks = generateBlocksFromDocument(doc, currentTemplate.name);
      const friendlyName = doc.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

      const updated: EmailTemplate = {
        ...currentTemplate,
        name: friendlyName,
        subject: friendlyName,
        importedDocument: doc,
        blocks: generatedBlocks,
        updatedAt: Date.now(),
      };

      setCurrentTemplate(updated);
      setTimeout(() => persistTemplate(updated), 0);

      setShowDocumentSplit(true);
      setMobilePane('document');
      setImportNotification(
        `Document « ${doc.name} » importé avec succès ! Il s'affiche dans le volet de gauche. Découpez vos logos ou signatures réels.`
      );
      setTimeout(() => setImportNotification(null), 8000);
    } catch (err) {
      console.error('Erreur importation document:', err);
    }
  };

  // Save Extracted Authentic Asset (Logo, Signature, Stamp)
  const handleSaveExtractedAsset = (
    asset: ExtractedAsset,
    autoInsertLocation?: 'header_logo' | 'signature_ink' | 'signature_stamp' | 'hero_image'
  ) => {
    setCurrentTemplate(prev => {
      const updatedAssets = [...(prev.extractedAssets || []), asset];
      let updatedBlocks = [...prev.blocks];

      // Auto-insert if chosen
      if (autoInsertLocation === 'header_logo') {
        const headerBlock = updatedBlocks.find(b => b.type === 'header');
        if (headerBlock) {
          headerBlock.data = {
            ...headerBlock.data,
            logoUrl: asset.dataUrl,
            logoAlt: asset.label,
          };
        } else {
          updatedBlocks.unshift({
            id: `blk_header_${Date.now()}`,
            type: 'header',
            data: {
              logoUrl: asset.dataUrl,
              logoAlt: asset.label,
              logoWidth: Math.min(220, asset.width || 180),
              align: 'left',
              paddingTop: 24,
              paddingBottom: 20,
            },
          });
        }
      } else if (autoInsertLocation === 'signature_ink') {
        const sigBlock = updatedBlocks.find(b => b.type === 'signature');
        if (sigBlock) {
          sigBlock.data = {
            ...sigBlock.data,
            signatureImageUrl: asset.dataUrl,
          };
        } else {
          updatedBlocks.push({
            id: `blk_sig_${Date.now()}`,
            type: 'signature',
            data: {
              name: 'Direction Générale',
              title: 'Signature certifiée conforme',
              company: '',
              signatureImageUrl: asset.dataUrl,
              align: 'left',
              paddingTop: 20,
              paddingBottom: 24,
            },
          });
        }
      } else if (autoInsertLocation === 'signature_stamp') {
        const sigBlock = updatedBlocks.find(b => b.type === 'signature');
        if (sigBlock) {
          sigBlock.data = {
            ...sigBlock.data,
            stampImageUrl: asset.dataUrl,
          };
        }
      } else if (autoInsertLocation === 'hero_image') {
        const heroBlock = updatedBlocks.find(b => b.type === 'hero_image');
        if (heroBlock) {
          heroBlock.data = {
            ...heroBlock.data,
            imageUrl: asset.dataUrl,
            altText: asset.label,
          };
        }
      }

      return {
        ...prev,
        extractedAssets: updatedAssets,
        blocks: updatedBlocks,
      };
    });
  };

  // Delete Extracted Asset
  const handleDeleteAsset = (id: string) => {
    updateTemplate(prev => ({
      ...prev,
      extractedAssets: prev.extractedAssets.filter(a => a.id !== id),
    }));
  };

  // Insert asset into active block
  const handleInsertAssetIntoActiveBlock = (asset: ExtractedAsset) => {
    if (!selectedBlockId) return;
    const block = currentTemplate.blocks.find(b => b.id === selectedBlockId);
    if (!block) return;

    if (block.type === 'header') {
      handleUpdateBlockData(block.id, {
        ...block.data,
        logoUrl: asset.dataUrl,
        logoAlt: asset.label,
      });
    } else if (block.type === 'hero_image') {
      handleUpdateBlockData(block.id, {
        ...block.data,
        imageUrl: asset.dataUrl,
        altText: asset.label,
      });
    } else if (block.type === 'signature') {
      if (asset.category === 'stamp') {
        handleUpdateBlockData(block.id, {
          ...block.data,
          stampImageUrl: asset.dataUrl,
        });
      } else {
        handleUpdateBlockData(block.id, {
          ...block.data,
          signatureImageUrl: asset.dataUrl,
        });
      }
    } else if (block.type === 'product_card') {
      handleUpdateBlockData(block.id, {
        ...block.data,
        imageUrl: asset.dataUrl,
      });
    }
  };

  // Apply raw HTML from Code Editor
  const handleApplyRawHtml = (newHtml: string) => {
    updateTemplate(prev => ({
      ...prev,
      blocks: [
        {
          id: `blk_raw_${Date.now()}`,
          type: 'custom_html',
          data: {
            html: newHtml,
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      ],
    }));
  };

  // Template Manager Handlers
  const handleCreateNewTemplate = () => {
    const newTmpl = StorageManager.createNewTemplate('Mon Nouveau Template');
    setCurrentTemplate(newTmpl);
    persistTemplate(newTmpl);
  };

  const handleDuplicateTemplate = (templateToClone: EmailTemplate) => {
    const clone: EmailTemplate = {
      ...JSON.parse(JSON.stringify(templateToClone)),
      id: `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${templateToClone.name} (Copie)`,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    setCurrentTemplate(clone);
    persistTemplate(clone);
  };

  const handleDeleteTemplate = (id: string) => {
    StorageManager.deleteTemplate(id);
    setTemplates(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (currentTemplate.id === id && filtered.length > 0) {
        setCurrentTemplate(filtered[0]);
      }
      return filtered;
    });
  };

  const handleRenameTemplate = (id: string, newName: string) => {
    updateTemplate(prev => ({
      ...prev,
      name: newName,
    }));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Top Bar Header */}
      <Header
        editorMode={editorMode}
        onChangeEditorMode={setEditorMode}
        showDocumentSplit={showDocumentSplit}
        onToggleDocumentSplit={() => setShowDocumentSplit(s => !s)}
        onOpenGmailModal={() => setIsGmailModalOpen(true)}
        onOpenPreviewModal={() => setIsPreviewModalOpen(true)}
        onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onSaveTemplate={() => persistTemplate(currentTemplate)}
        isSaving={isSaving}
        templateName={currentTemplate.name}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Block Library Sidebar */}
        <BlockLibrarySidebar
          onAddBlock={type => handleAddBlock(type)}
          extractedAssets={currentTemplate.extractedAssets || []}
          onOpenCropper={() => setIsCropperModalOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          hasDocument={!!currentTemplate.importedDocument}
        />

        {/* Center: Split View (Original Document + Visual/Code Editor) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Notification banner on import */}
          {importNotification && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-900 flex items-center justify-between shrink-0 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
                <span className="font-medium">{importNotification}</span>
              </div>
              <button
                onClick={() => setImportNotification(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold ml-2"
              >
                &times;
              </button>
            </div>
          )}

          {/* Responsive View Switcher for mobile / smaller screens */}
          {showDocumentSplit && (
            <div className="md:hidden flex items-center justify-center bg-slate-100 p-1.5 border-b border-slate-200 shrink-0">
              <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 text-xs shadow-2xs">
                <button
                  type="button"
                  onClick={() => setMobilePane('document')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    mobilePane === 'document'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📄 Document original
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePane('editor')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    mobilePane === 'editor'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✏️ Éditeur d'email
                </button>
              </div>
            </div>
          )}

          {/* Panes Container */}
          <div className="flex-1 flex overflow-hidden">
            {/* Document Pane: on desktop (md:) visible if showDocumentSplit is true; on mobile visible if mobilePane === 'document' */}
            {showDocumentSplit && (
              <div
                className={`h-full border-r border-slate-200 ${
                  mobilePane === 'document' ? 'w-full block' : 'hidden'
                } md:block md:w-1/2`}
              >
                <DocumentViewer
                  document={currentTemplate.importedDocument || null}
                  extractedAssets={currentTemplate.extractedAssets || []}
                  onOpenImportModal={() => setIsImportModalOpen(true)}
                  onSaveExtractedAsset={handleSaveExtractedAsset}
                  onDeleteAsset={handleDeleteAsset}
                  onInsertAssetIntoActiveBlock={handleInsertAssetIntoActiveBlock}
                />
              </div>
            )}

            {/* Editor Pane (Visual or Code): on desktop takes remaining width; on mobile visible if !showDocumentSplit or mobilePane === 'editor' */}
            <div
              className={`h-full flex flex-col overflow-hidden ${
                showDocumentSplit
                  ? mobilePane === 'editor'
                    ? 'w-full block md:w-1/2'
                    : 'hidden md:block md:w-1/2'
                  : 'w-full'
              }`}
            >
              {editorMode === 'visual' ? (
                <VisualEditor
                  template={currentTemplate}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  onUpdateBlockData={handleUpdateBlockData}
                  onMoveBlock={handleMoveBlock}
                  onDuplicateBlock={handleDuplicateBlock}
                  onDeleteBlock={handleDeleteBlock}
                  onAddBlockAtIndex={(idx, type) => handleAddBlock(type, idx)}
                />
              ) : (
                <CodeEditor
                  template={currentTemplate}
                  onApplyRawHtml={handleApplyRawHtml}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: Properties Inspector Panel */}
        <div className="w-80 h-full hidden lg:block shrink-0">
          <PropertiesPanel
            template={currentTemplate}
            selectedBlockId={selectedBlockId}
            extractedAssets={currentTemplate.extractedAssets || []}
            onUpdateGlobalSettings={handleUpdateGlobalSettings}
            onUpdateSubjectAndPreheader={handleUpdateSubjectAndPreheader}
            onUpdateBlockData={handleUpdateBlockData}
            onUpdateBlockBg={handleUpdateBlockBg}
            onDeleteBlock={handleDeleteBlock}
            onOpenCropper={() => setIsCropperModalOpen(true)}
          />
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Gmail Integration Modal */}
      <GmailModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        template={currentTemplate}
        onUpdateRecipientAndSubject={(recipient, subject) =>
          handleUpdateSubjectAndPreheader(subject, currentTemplate.preheader, recipient)
        }
      />

      {/* 2. Preview & Compatibility Audit Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        template={currentTemplate}
      />

      {/* 3. Templates Manager Modal */}
      <TemplatesManagerModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        templates={templates}
        activeTemplateId={currentTemplate.id}
        onSelectTemplate={t => setCurrentTemplate(t)}
        onCreateNewTemplate={handleCreateNewTemplate}
        onDuplicateTemplate={handleDuplicateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onRenameTemplate={handleRenameTemplate}
      />

      {/* 4. Import Document Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportDocument={handleImportDocument}
      />

      {/* 5. Guide Illustré Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* 6. Element Cropper Modal (Standalone trigger from Sidebar / Properties) */}
      {isCropperModalOpen && currentTemplate.importedDocument && (
        <ElementCropperModal
          isOpen={isCropperModalOpen}
          onClose={() => setIsCropperModalOpen(false)}
          documentDataUrl={currentTemplate.importedDocument.dataUrl}
          onSaveAsset={handleSaveExtractedAsset}
        />
      )}
    </div>
  );
}
