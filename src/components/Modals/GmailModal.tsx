import React, { useState } from 'react';
import {
  X,
  Send,
  ExternalLink,
  Copy,
  Check,
  Code,
  Bookmark,
  Sparkles,
  Info,
  Layers,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EmailTemplate } from '../../types/template';
import { GmailIntegration } from '../../utils/gmailIntegration';

interface GmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate;
  onUpdateRecipientAndSubject: (recipient: string, subject: string) => void;
}

export const GmailModal: React.FC<GmailModalProps> = ({
  isOpen,
  onClose,
  template,
  onUpdateRecipientAndSubject,
}) => {
  const [recipient, setRecipient] = useState<string>(template.recipientEmail || '');
  const [subject, setSubject] = useState<string>(template.subject || '');
  const [activeTab, setActiveTab] = useState<'instant' | 'apps_script' | 'bookmarklet'>('instant');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [hasTriggeredOpen, setHasTriggeredOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLaunchInGmail = async () => {
    // Sync back
    onUpdateRecipientAndSubject(recipient, subject);

    // 1. Copy rich HTML to clipboard
    const result = await GmailIntegration.copyRichHtmlToClipboard(template);

    // 2. Open Gmail compose window
    GmailIntegration.openGmailCompose(recipient, subject);

    // 3. Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setHasTriggeredOpen(true);
    setCopiedStatus(result.message);
  };

  const handleCopyRichOnly = async () => {
    const res = await GmailIntegration.copyRichHtmlToClipboard(template);
    setCopiedStatus(res.message);
    setTimeout(() => setCopiedStatus(null), 4000);
  };

  const appsScriptCode = GmailIntegration.generateAppsScriptCode({
    ...template,
    recipientEmail: recipient,
    subject,
  });

  const bookmarkletCode = GmailIntegration.generateBookmarkletCode();

  const handleCopyAppsScript = async () => {
    await navigator.clipboard.writeText(appsScriptCode);
    setCopiedStatus('Script Google Apps Script copié !');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Google / Gmail styling */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-red-50/40 via-white to-blue-50/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
              {/* Official Gmail M Logo SVG */}
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.605l8.073-6.112C21.69 2.279 24 3.434 24 5.457z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ouvrir et envoyer dans Gmail
              </h3>
              <p className="text-xs text-slate-500">
                Intégration HTML enrichi sans perte de styles, de tableaux ni d'images
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

        {/* Recipient & Subject pre-fill */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Destinataire(s)
              </label>
              <input
                type="email"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="client@entreprise.com"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Objet de l'email
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Sujet de votre email..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-4 text-xs font-medium text-slate-500">
          <button
            onClick={() => setActiveTab('instant')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'instant'
                ? 'border-red-600 text-red-600 font-semibold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            Méthode Directe (Presse-papiers HTML Enrichi)
          </button>
          <button
            onClick={() => setActiveTab('apps_script')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'apps_script'
                ? 'border-red-600 text-red-600 font-semibold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            Google Apps Script (Automatisation)
          </button>
          <button
            onClick={() => setActiveTab('bookmarklet')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'bookmarklet'
                ? 'border-red-600 text-red-600 font-semibold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            Favori d'injection 1-Clic
          </button>
        </div>

        {/* Body based on tab */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'instant' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-950 space-y-1">
                  <div className="font-semibold text-blue-900">
                    Comment fonctionne l'insertion HTML dans Gmail ?
                  </div>
                  <p className="leading-relaxed text-blue-800">
                    Le protocole Web standard de Gmail interdit aux pages web tierces d'injecter du code arbitraire directement dans votre session connectée sans votre consentement.
                    Notre bouton copie instantanément votre email au format <strong>text/html enrichi</strong> et vous ouvre Gmail : un simple <strong>Ctrl + V</strong> (ou <strong>Cmd + V</strong>) colle immédiatement le rendu complet avec 100% des couleurs, tableaux et graphismes !
                  </p>
                </div>
              </div>

              {hasTriggeredOpen && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate-in fade-in">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <div className="font-bold mb-1">
                      Fenêtre Gmail ouverte &amp; HTML copié dans le presse-papiers !
                    </div>
                    <p className="leading-relaxed text-emerald-800">
                      Cliquez dans le corps de votre nouveau message Gmail et faites <strong>Ctrl + V</strong> (ou <strong>Cmd + V</strong> sur Mac).
                    </p>
                  </div>
                </div>
              )}

              {/* Main Action Callout */}
              <div className="pt-2 flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleLaunchInGmail}
                  className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all transform active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Ouvrir dans Gmail &amp; Copier le template enrichi</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyRichOnly}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier uniquement le rendu HTML sans ouvrir Gmail</span>
                </button>
              </div>

              {copiedStatus && (
                <p className="text-center text-xs text-emerald-600 font-medium">
                  {copiedStatus}
                </p>
              )}
            </div>
          )}

          {activeTab === 'apps_script' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Vous souhaitez créer automatiquement un brouillon dans votre compte Gmail sans copier-coller ?
                Copiez ce script prêt à l'emploi et exécutez-le dans <strong>Google Apps Script</strong>.
              </p>

              <div className="relative">
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                  {appsScriptCode}
                </pre>
                <button
                  onClick={handleCopyAppsScript}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-medium flex items-center gap-1 shadow-sm"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copier le script</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Utilise le service natif GmailApp.createDraft()</span>
                <a
                  href="https://script.google.com/home/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Ouvrir script.google.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'bookmarklet' && (
            <div className="space-y-4 text-xs text-slate-600">
              <p className="leading-relaxed">
                Glissez ce bouton vers votre barre de favoris de navigateur. Lorsque vous serez dans Gmail en train de rédiger un message, un simple clic sur le favori injectera votre template :
              </p>

              <div className="p-4 bg-slate-100 rounded-xl text-center">
                <a
                  href={bookmarkletCode}
                  onClick={e => e.preventDefault()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:bg-blue-700"
                  title="Glissez-déposez ce bouton dans votre barre de favoris"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Glisser vers les Favoris : Injecter Template</span>
                </a>
                <p className="text-[11px] text-slate-500 mt-2">
                  Astuce : Glissez ce bouton directement dans la barre de favoris de votre navigateur (Chrome / Firefox / Safari).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            100% conforme aux spécifications HTML Gmail &amp; Outlook
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
