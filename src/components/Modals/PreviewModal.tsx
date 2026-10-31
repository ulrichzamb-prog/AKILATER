import React, { useState, useMemo } from 'react';
import {
  X,
  Monitor,
  Smartphone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Info,
  RefreshCw,
} from 'lucide-react';
import { EmailTemplate } from '../../types/template';
import { generateEmailHtml } from '../../utils/htmlGenerator';
import { auditEmailTemplate } from '../../utils/emailAuditor';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, template }) => {
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile' | 'gmail' | 'audit'>('desktop');

  const htmlContent = useMemo(() => generateEmailHtml(template), [template]);
  const auditReport = useMemo(() => auditEmailTemplate(template), [template]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Aperçu &amp; Diagnostic de Compatibilité
            </h3>
            <span className="text-xs text-slate-500 hidden sm:inline">
              · {template.name}
            </span>
          </div>

          {/* Device / Mode Segmented Controller */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl gap-1 text-xs font-medium">
            <button
              onClick={() => setActiveDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeDevice === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Ordinateur</span>
            </button>

            <button
              onClick={() => setActiveDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeDevice === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>

            <button
              onClick={() => setActiveDevice('gmail')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeDevice === 'gmail'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-red-500" />
              <span>Rendu Gmail Web</span>
            </button>

            <button
              onClick={() => setActiveDevice('audit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeDevice === 'audit'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audit ({auditReport.score}/100)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewports */}
        <div className="flex-1 overflow-hidden bg-slate-100 flex items-center justify-center p-4">
          {/* 1. DESKTOP VIEW */}
          {activeDevice === 'desktop' && (
            <div className="w-full h-full flex flex-col items-center justify-start overflow-auto">
              <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg border border-slate-300 overflow-hidden flex flex-col my-auto">
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span className="ml-2 font-mono text-[11px] text-slate-600">Client Mail Ordinateur (600-650px)</span>
                  </div>
                  <span className="text-[11px]">{template.subject}</span>
                </div>
                <iframe
                  title="Desktop Preview"
                  srcDoc={htmlContent}
                  className="w-full h-[65vh] border-none bg-white"
                />
              </div>
            </div>
          )}

          {/* 2. MOBILE VIEW */}
          {activeDevice === 'mobile' && (
            <div className="h-full flex items-center justify-center py-2">
              <div className="w-[375px] h-[95%] bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col relative overflow-hidden">
                {/* Speaker Notch */}
                <div className="w-32 h-4 bg-slate-900 rounded-b-xl mx-auto absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Simulated Phone Screen */}
                <div className="flex-1 bg-white rounded-[30px] overflow-hidden flex flex-col">
                  {/* Phone Status Bar */}
                  <div className="h-6 bg-slate-100 px-4 flex items-center justify-between text-[10px] text-slate-600 font-mono pt-1">
                    <span>09:41</span>
                    <div className="flex items-center gap-1">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <iframe
                    title="Mobile Preview"
                    srcDoc={htmlContent}
                    className="flex-1 w-full border-none bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. GMAIL WEB SIMULATED VIEW */}
          {activeDevice === 'gmail' && (
            <div className="w-full h-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-300 flex flex-col overflow-hidden my-auto">
              {/* Simulated Gmail Header */}
              <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    ETS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {template.subject || 'Mon Template Professionnel'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      De : <strong>Email Template Studio</strong> &lt;notifications@entreprise.com&gt; à <strong>{template.recipientEmail || 'Moi'}</strong>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <span>Aujourd'hui, 10:45</span>
                </div>
              </div>

              {/* Email Content Frame */}
              <iframe
                title="Gmail Simulated View"
                srcDoc={htmlContent}
                className="flex-1 w-full border-none bg-white"
              />
            </div>
          )}

          {/* 4. AUDIT & DIAGNOSTIC REPORT */}
          {activeDevice === 'audit' && (
            <div className="w-full h-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-300 p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Rapport de Conformité HTML &amp; Délivrabilité
                  </h4>
                  <p className="text-xs text-slate-500">
                    Analyse des règles de compatibilité pour Gmail, Outlook, Apple Mail et clients mobiles
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Score de conformité</div>
                    <div className="text-2xl font-black text-blue-600 font-mono tabular-nums">
                      {auditReport.score} / 100
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      auditReport.score >= 90
                        ? 'bg-emerald-100 text-emerald-800'
                        : auditReport.score >= 70
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {auditReport.score >= 90 ? 'A+' : auditReport.score >= 70 ? 'B' : 'C'}
                  </div>
                </div>
              </div>

              {/* Status Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-900">Compatibilité Gmail</div>
                    <div className="text-slate-500">Inline CSS &amp; Tableaux validés</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-900">Compatibilité Outlook</div>
                    <div className="text-slate-500">Balises conditionnelles MSO</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-900">Affichage Mobile</div>
                    <div className="text-slate-500">Colonnes fluides responsive</div>
                  </div>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Points de contrôle et recommandations ({auditReport.issues.length})
                </h5>

                {auditReport.issues.length === 0 ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Félicitations ! Votre template respecte l'ensemble des règles de compatibilité pour tous les clients de messagerie.</span>
                  </div>
                ) : (
                  auditReport.issues.map(issue => (
                    <div
                      key={issue.id}
                      className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                        issue.type === 'error'
                          ? 'bg-red-50 border-red-200 text-red-950'
                          : issue.type === 'warning'
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : 'bg-blue-50 border-blue-200 text-blue-950'
                      }`}
                    >
                      {issue.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      ) : issue.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}

                      <div className="text-xs">
                        <div className="font-bold">{issue.message}</div>
                        <div className="text-slate-600 mt-0.5 leading-relaxed">{issue.detail}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Rendu en temps réel généré à partir du moteur table XHTML 1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Fermer l'aperçu
          </button>
        </div>
      </div>
    </div>
  );
};
