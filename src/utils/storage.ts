import { EmailTemplate, EmailBlock } from '../types/template';

const DB_NAME = 'EmailTemplateStudioDB';
const STORE_NAME = 'templates';
const DB_VERSION = 1;

// Sample Starter Templates
export const STARTER_TEMPLATES: EmailTemplate[] = [
  {
    id: 'starter_newsletter',
    name: 'Newsletter Entreprise & Tech',
    subject: 'Les dernières actualités & innovations du mois',
    preheader: 'Découvrez notre sélection exclusive et nos conseils d\'experts.',
    recipientEmail: '',
    globalSettings: {
      backgroundColor: '#f8fafc',
      containerColor: '#ffffff',
      maxWidth: 600,
      fontFamily: 'Arial, Helvetica, sans-serif',
      textColor: '#334155',
      linkColor: '#2563eb',
    },
    blocks: [
      {
        id: 'b_header_1',
        type: 'header',
        data: {
          logoUrl: '',
          logoAlt: 'STUDIO NEWS',
          logoWidth: 160,
          align: 'left',
          paddingTop: 28,
          paddingBottom: 20,
          viewOnlineText: 'Ouvrir dans le navigateur',
          viewOnlineUrl: 'https://example.com/view',
        },
      },
      {
        id: 'b_hero_1',
        type: 'hero_image',
        data: {
          imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
          altText: 'Équipe en réunion de travail créative',
          caption: 'Édition spéciale : Stratégies numériques et retours d\'expérience',
          fullWidth: false,
          paddingTop: 10,
          paddingBottom: 16,
          linkUrl: 'https://example.com/article',
        },
      },
      {
        id: 'b_text_1',
        type: 'text',
        data: {
          title: 'Transformer vos documents en emails professionnels',
          titleSize: 22,
          titleColor: '#0f172a',
          subtitle: 'Guide pratique pour une délivrabilité optimale sous Gmail et Outlook',
          content: 'Chers lecteurs,\n\nNous sommes ravis de vous partager nos dernières découvertes en matière de design HTML email. Grâce à l\'utilisation rigoureuse de tableaux HTML et de styles inline compatibles, vos messages conservent une fidélité visuelle absolue sur tous les écrans.\n\nRetrouvez ci-dessous nos dossiers du mois préparés par nos experts.',
          align: 'left',
          fontSize: 15,
          lineHeight: 1.6,
          paddingTop: 12,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
      {
        id: 'b_btn_1',
        type: 'button',
        data: {
          text: 'Lire l\'analyse complète',
          url: 'https://example.com/article',
          buttonColor: '#1e40af',
          textColor: '#ffffff',
          borderRadius: 6,
          align: 'left',
          paddingTop: 8,
          paddingBottom: 20,
          buttonPaddingY: 12,
          buttonPaddingX: 24,
          fullWidthMobile: false,
          fontSize: 15,
          bold: true,
        },
      },
      {
        id: 'b_div_1',
        type: 'divider',
        data: {
          style: 'solid',
          color: '#e2e8f0',
          thickness: 1,
          widthPercent: 100,
          paddingTop: 12,
          paddingBottom: 16,
        },
      },
      {
        id: 'b_two_col_1',
        type: 'two_column',
        data: {
          col1WidthPercent: 50,
          stackOnMobile: true,
          paddingTop: 12,
          paddingBottom: 16,
          col1: {
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
            title: 'Audit de compatibilité',
            content: 'Détectez en un clic les polices non supportées et les règles CSS incompatibles avec Gmail.',
            buttonText: 'En savoir plus',
            buttonUrl: 'https://example.com/audit',
          },
          col2: {
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
            title: 'Export & Automatisation',
            content: 'Intégrez directement votre template dans Gmail sans perdre la moindre mise en forme.',
            buttonText: 'Découvrir l\'outil',
            buttonUrl: 'https://example.com/export',
          },
        },
      },
      {
        id: 'b_footer_1',
        type: 'footer',
        data: {
          companyName: 'Email Template Studio Inc.',
          address: '42 Avenue de l\'Opéra, 75002 Paris',
          unsubscribeText: 'Gérer mes préférences de réception',
          unsubscribeUrl: 'https://example.com/unsubscribe',
          privacyText: 'Protection des données',
          privacyUrl: 'https://example.com/privacy',
          copyright: '© 2026 Email Template Studio. Tous droits réservés.',
          textColor: '#64748b',
          showSocials: true,
          socials: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            website: 'https://example.com',
          },
          paddingTop: 24,
          paddingBottom: 32,
        },
      },
    ],
    extractedAssets: [],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'starter_facture',
    name: 'Facture & Reçu avec Signature Manuscrite',
    subject: 'Votre facture N° FAC-2026-089 — Confirmation de règlement',
    preheader: 'Veuillez trouver ci-joint les détails de votre facturation et l\'attestation signée.',
    recipientEmail: 'client@entreprise.fr',
    globalSettings: {
      backgroundColor: '#f1f5f9',
      containerColor: '#ffffff',
      maxWidth: 640,
      fontFamily: 'Helvetica, Arial, sans-serif',
      textColor: '#1e293b',
      linkColor: '#0284c7',
    },
    blocks: [
      {
        id: 'b_f_header',
        type: 'header',
        data: {
          logoUrl: '',
          logoAlt: 'CABINET FIDUCIAIRE & CONSEIL',
          logoWidth: 200,
          align: 'left',
          paddingTop: 24,
          paddingBottom: 16,
        },
      },
      {
        id: 'b_f_text1',
        type: 'text',
        data: {
          title: 'Facture d\'honoraires N° FAC-2026-089',
          titleSize: 20,
          titleColor: '#0f172a',
          subtitle: 'Date d\'émission : 24 octobre 2026 · Statut : Acquittée',
          content: 'Madame, Monsieur,\n\nNous vous remercions pour votre confiance. Nous vous confirmons la bonne réception de votre règlement relatif à la prestation de conseil juridique et fiscal.\n\nVous trouverez ci-dessous le récapitulatif détaillé ainsi que l\'attestation signée par la direction.',
          align: 'left',
          fontSize: 14,
          lineHeight: 1.6,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
      {
        id: 'b_f_custom_table',
        type: 'custom_html',
        data: {
          paddingTop: 8,
          paddingBottom: 16,
          html: `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; font-family: Helvetica, Arial, sans-serif; font-size: 13px;">
            <thead>
              <tr style="background-color: #f8fafc; color: #475569; text-align: left;">
                <th style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Désignation</th>
                <th style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; text-align: center;">Qté</th>
                <th style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; text-align: right;">Montant HT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">Audit d'infrastructure et conformité</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #64748b;">1</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 500;">1 450,00 €</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">Déploiement des templates HTML sécurisés</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #64748b;">1</td>
                <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 500;">850,00 €</td>
              </tr>
              <tr style="background-color: #f8fafc; font-weight: 700;">
                <td colspan="2" style="padding: 10px 14px; text-align: right; color: #0f172a;">Total TTC payé :</td>
                <td style="padding: 10px 14px; text-align: right; color: #1e40af; font-size: 15px;">2 760,00 €</td>
              </tr>
            </tbody>
          </table>`,
        },
      },
      {
        id: 'b_f_signature',
        type: 'signature',
        data: {
          name: 'Jean-Marc Beaumont',
          title: 'Associé Gérant',
          company: 'Cabinet Beaumont & Associés',
          phone: '+33 (0)1 40 50 60 70',
          email: 'contact@beaumont-conseil.fr',
          website: 'https://beaumont-conseil.fr',
          align: 'left',
          paddingTop: 16,
          paddingBottom: 24,
        },
      },
      {
        id: 'b_f_footer',
        type: 'footer',
        data: {
          companyName: 'Cabinet Beaumont & Associés SARL',
          address: 'RCS Paris 849 203 112 · 18 Rue Royale, 75008 Paris',
          unsubscribeText: 'Télécharger le justificatif fiscal en PDF',
          unsubscribeUrl: 'https://example.com/receipt.pdf',
          copyright: 'Document certifié conforme et archivé légalement.',
          textColor: '#94a3b8',
          showSocials: false,
          paddingTop: 16,
          paddingBottom: 24,
        },
      },
    ],
    extractedAssets: [],
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 43200000,
  },
  {
    id: 'starter_onboarding',
    name: 'Bienvenue & Onboarding Nouveau Client',
    subject: 'Bienvenue à bord ! Voici vos accès et vos premiers pas',
    preheader: 'Votre espace de travail est prêt. Découvrez vos avantages en 3 étapes rapides.',
    recipientEmail: '',
    globalSettings: {
      backgroundColor: '#f8fafc',
      containerColor: '#ffffff',
      maxWidth: 600,
      fontFamily: 'Arial, Helvetica, sans-serif',
      textColor: '#1e293b',
      linkColor: '#2563eb',
    },
    blocks: [
      {
        id: 'b_on_h',
        type: 'header',
        data: {
          logoUrl: '',
          logoAlt: 'Email Template Studio',
          logoWidth: 170,
          align: 'center',
          paddingTop: 32,
          paddingBottom: 20,
        },
      },
      {
        id: 'b_on_t',
        type: 'text',
        data: {
          title: 'Ravi de vous compter parmi nous ! 👋',
          titleSize: 24,
          titleColor: '#0f172a',
          subtitle: 'Votre compte professionnel est actif',
          content: 'Bonjour,\n\nToute notre équipe est ravie de vous accueillir. Avec votre nouvel espace, transformez vos fichiers PDF, captures d\'écran et maquettes graphiques en emails prêts à être envoyés depuis votre messagerie Gmail.',
          align: 'center',
          fontSize: 15,
          lineHeight: 1.6,
          paddingTop: 12,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
      {
        id: 'b_on_b',
        type: 'button',
        data: {
          text: 'Accéder à mon espace de travail',
          url: 'https://example.com/dashboard',
          buttonColor: '#2563eb',
          textColor: '#ffffff',
          borderRadius: 8,
          align: 'center',
          paddingTop: 8,
          paddingBottom: 24,
          buttonPaddingY: 14,
          buttonPaddingX: 32,
          fullWidthMobile: false,
          fontSize: 16,
          bold: true,
        },
      },
      {
        id: 'b_on_3col',
        type: 'three_column',
        data: {
          stackOnMobile: true,
          paddingTop: 16,
          paddingBottom: 24,
          col1: {
            title: '1. Importez',
            content: 'Déposez votre document PDF ou image d\'origine.',
          },
          col2: {
            title: '2. Découpez',
            content: 'Conservez vos vrais logos, signatures et sceaux.',
          },
          col3: {
            title: '3. Ouvrez Gmail',
            content: '1 clic pour coller avec styles & tableaux préservés.',
          },
        },
      },
      {
        id: 'b_on_f',
        type: 'footer',
        data: {
          companyName: 'Email Template Studio',
          address: 'Paris & Télé-travail international',
          unsubscribeText: 'Paramètres du compte',
          unsubscribeUrl: 'https://example.com/settings',
          copyright: '© 2026 Email Template Studio',
          textColor: '#94a3b8',
          showSocials: true,
          paddingTop: 20,
          paddingBottom: 28,
        },
      },
    ],
    extractedAssets: [],
    createdAt: Date.now() - 21600000,
    updatedAt: Date.now() - 21600000,
  },
];

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Storage Manager
export const StorageManager = {
  async getAllTemplates(): Promise<EmailTemplate[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result as EmailTemplate[];
          if (!list || list.length === 0) {
            // Seed starter templates if empty
            this.seedStarterTemplates().then(resolve).catch(() => resolve(STARTER_TEMPLATES));
          } else {
            resolve(list.sort((a, b) => b.updatedAt - a.updatedAt));
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      // LocalStorage fallback
      try {
        const raw = localStorage.getItem('email_templates');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('LocalStorage read error', e);
      }
      return STARTER_TEMPLATES;
    }
  },

  async seedStarterTemplates(): Promise<EmailTemplate[]> {
    for (const starter of STARTER_TEMPLATES) {
      await this.saveTemplate(starter);
    }
    return STARTER_TEMPLATES;
  },

  async getTemplate(id: string): Promise<EmailTemplate | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      const all = await this.getAllTemplates();
      return all.find(t => t.id === id) || null;
    }
  },

  async saveTemplate(template: EmailTemplate): Promise<void> {
    const toSave: EmailTemplate = {
      ...template,
      updatedAt: Date.now(),
    };

    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(toSave);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // LocalStorage fallback with quota safety
      try {
        const all = await this.getAllTemplates();
        const idx = all.findIndex(t => t.id === template.id);
        if (idx >= 0) all[idx] = toSave;
        else all.push(toSave);
        localStorage.setItem('email_templates', JSON.stringify(all));
      } catch (err) {
        console.warn('LocalStorage save failed, trying lightweight save:', err);
        try {
          // If storage full, strip oversized dataUrls from imported documents before saving
          const lightweight: EmailTemplate = {
            ...toSave,
            importedDocument: toSave.importedDocument
              ? {
                  ...toSave.importedDocument,
                  dataUrl: toSave.importedDocument.dataUrl.length > 50000 ? '' : toSave.importedDocument.dataUrl,
                }
              : undefined,
          };
          localStorage.setItem('email_templates', JSON.stringify([lightweight]));
        } catch (subErr) {
          console.warn('LocalStorage completely unavailable or full:', subErr);
        }
      }
    }
  },

  async deleteTemplate(id: string): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      try {
        const all = await this.getAllTemplates();
        const filtered = all.filter(t => t.id !== id);
        localStorage.setItem('email_templates', JSON.stringify(filtered));
      } catch (err) {
        console.error('Failed to delete from localStorage', err);
      }
    }
  },

  createNewTemplate(name = 'Nouveau Template'): EmailTemplate {
    return {
      id: `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      subject: 'Votre message important',
      preheader: 'Aperçu du contenu de votre message',
      recipientEmail: '',
      globalSettings: {
        backgroundColor: '#f8fafc',
        containerColor: '#ffffff',
        maxWidth: 600,
        fontFamily: 'Arial, Helvetica, sans-serif',
        textColor: '#1e293b',
        linkColor: '#2563eb',
      },
      blocks: [
        {
          id: `blk_${Date.now()}_1`,
          type: 'header',
          data: {
            logoUrl: '',
            logoAlt: name,
            logoWidth: 160,
            align: 'center',
            paddingTop: 28,
            paddingBottom: 20,
          },
        },
        {
          id: `blk_${Date.now()}_2`,
          type: 'text',
          data: {
            title: 'Titre de votre email',
            titleSize: 22,
            titleColor: '#0f172a',
            content: 'Cliquez sur ce texte pour le modifier directement ou ajustez ses propriétés dans le panneau de droite.\n\nVous pouvez importer une image ou un PDF pour découper vos logos et signatures réels.',
            align: 'left',
            fontSize: 15,
            lineHeight: 1.6,
            paddingTop: 12,
            paddingBottom: 16,
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
        {
          id: `blk_${Date.now()}_3`,
          type: 'button',
          data: {
            text: 'Bouton d\'action',
            url: 'https://example.com',
            buttonColor: '#1e40af',
            textColor: '#ffffff',
            borderRadius: 6,
            align: 'center',
            paddingTop: 12,
            paddingBottom: 24,
            buttonPaddingY: 12,
            buttonPaddingX: 24,
            fullWidthMobile: false,
            fontSize: 15,
            bold: true,
          },
        },
        {
          id: `blk_${Date.now()}_4`,
          type: 'footer',
          data: {
            companyName: 'Votre Société',
            address: 'Votre Adresse, Ville, Pays',
            unsubscribeText: 'Se désinscrire',
            unsubscribeUrl: 'https://example.com/unsubscribe',
            copyright: '© 2026 Tous droits réservés.',
            textColor: '#64748b',
            showSocials: false,
            paddingTop: 24,
            paddingBottom: 32,
          },
        },
      ],
      extractedAssets: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },
};
