import React, { useEffect } from 'react';
import {
  X,
  BookOpen,
  Download,
  Printer,
  CheckCircle,
  FileText,
  Scissors,
  Mail,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { downloadIllustratedGuideFile } from '../../utils/guideGenerator';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    // Open print dialog targeting the window
    window.print();
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Guide d'Utilisation Illustré</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
                  Document Officiel
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Consultez le guide pas à pas ou téléchargez-le pour vos équipes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              type="button"
              onClick={downloadIllustratedGuideFile}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Télécharger le document illustré autonome (.HTML / PDF imprimable)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger le document</span>
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Imprimer ou enregistrer en PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Imprimer</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
              title="Fermer (Échap)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Guide Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-50/40">
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
            <div className="max-w-2xl relative z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/30 text-blue-100 border border-blue-400/30 mb-3">
                <Sparkles className="w-3 h-3 text-amber-300" /> Guide de référence
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Email Template Studio
              </h1>
              <p className="text-sm text-blue-100 leading-relaxed mb-5">
                Transformez vos documents (factures, attestations, maquettes, PDF et images) en templates d'emails HTML professionnels, responsives et utilisables directement dans Gmail, sans jamais déformer vos graphismes originaux.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={downloadIllustratedGuideFile}
                  className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le guide illustré (.HTML)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Pillars Infographic */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <span>Le Workflow en 3 étapes clés</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Importation Source</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Glissez un PDF, une image (PNG/JPG) ou un fichier HTML. Le visualiseur haute fidélité affiche instantanément votre document de référence dans le volet gauche.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Scissors className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Découpe Authentique</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Détourez manuellement logos, signatures manuscrites et tampons avec détourage transparent. L'IA ne déforme ni ne réinvente jamais vos éléments officiels.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-red-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Envoi dans Gmail</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Copiez le template en HTML riche via le presse-papier et collez-le directement dans Gmail avec mise en page, tableaux et styles parfaitement conservés.
                </p>
              </div>
            </div>
          </div>

          {/* Double Viewport Illustration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <span>L'Espace de Travail Double Fenêtre (Split View)</span>
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Pour comparer la fidélité visuelle et prélever vos éléments sans quitter votre session, l'écran est scindé en deux volets synchronisés :
            </p>

            {/* Visual split diagram */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-100">
              <div className="bg-slate-200 px-3 py-1.5 flex items-center gap-1.5 border-b border-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-[11px] font-semibold text-slate-600 ml-2">Disposition en écran partagé</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 h-44 bg-slate-50">
                <div className="p-4 flex flex-col items-center justify-center text-center bg-white">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase mb-2">
                    Volet Gauche
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Document Original Importé</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Visualisation zoomable (50% à 250%) &amp; Outil de sélection de découpe au millimètre.
                  </p>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase mb-2">
                    Volet Droit
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Éditeur d'Email HTML Réactif</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Modification directe du texte en cliquant dessus (`contentEditable`) ou bascule en code source HTML/CSS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Absolute Rule on Authentic Elements */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6">
            <h2 className="text-base font-bold text-amber-950 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <span>Règle d'or : Préservation absolue des graphismes authentiques</span>
            </h2>
            <p className="text-xs text-amber-900 leading-relaxed mb-4">
              Dans un contexte contractuel, comptable ou juridique, <strong>l'IA ne doit jamais retracer, déformer ou réinventer un logo, une signature manuscrite ou un tampon certifié</strong>. L'outil de découpe extrait le pixel exact du document :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-900 block mb-1">🖋️ Signatures manuscrites</span>
                <span className="text-slate-500 text-[11px]">Détourage transparent automatique pour ne conserver que l'encre réelle sur fond blanc.</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-900 block mb-1">🔴 Cachets &amp; Tampons</span>
                <span className="text-slate-500 text-[11px]">Conservation de la patine, des pointillés et des sceaux officiels d'origine.</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-900 block mb-1">🏢 Logos &amp; En-têtes</span>
                <span className="text-slate-500 text-[11px]">Injection automatique dans le bloc En-tête à la dimension exacte voulue.</span>
              </div>
            </div>
          </div>

          {/* Section: Gmail Integration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center">4</span>
              <span>L'Intégration Gmail en 1 Clic (Copie HTML enrichie)</span>
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Pour éviter d'envoyer du code HTML brut dans Gmail, l'application utilise l'API standard <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-blue-700">ClipboardItem</code> :
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li>Cliquez sur le bouton rouge principal <strong>« Ouvrir dans Gmail »</strong> en haut à droite.</li>
              <li>Renseignez le destinataire et l'objet de l'email si souhaité.</li>
              <li>Cliquez sur <strong>« Copier l'email &amp; Ouvrir Gmail »</strong> : le rendu est copié dans le presse-papier et Gmail s'ouvre.</li>
              <li>Dans la fenêtre de composition de Gmail, collez simplement avec <strong>Ctrl + V</strong> (ou Cmd + V sur Mac).</li>
              <li>Le template complet avec ses tableaux et styles s'insère fidèlement dans votre message.</li>
            </ol>
          </div>

          {/* Section: 102KB Rule & Deliverability */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
            <h2 className="text-base font-bold text-emerald-950 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">5</span>
              <span>Délivrabilité &amp; Alerte anti-tronquage 102 Ko</span>
            </h2>
            <p className="text-xs text-emerald-900 leading-relaxed mb-3">
              Gmail tronque automatiquement tout email dont le code HTML dépasse <strong>102 Ko</strong> en masquant le bas du message derrière la mention <em>« Afficher l'intégralité du message »</em>.
            </p>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Auditeur de compatibilité intégré : calcule le poids réel en direct dans le modal <strong>« Aperçu &amp; Tests »</strong>.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Fichier téléchargeable en format HTML autonome, consultable hors-ligne et imprimable en PDF
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadIllustratedGuideFile}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger le guide illustré</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
