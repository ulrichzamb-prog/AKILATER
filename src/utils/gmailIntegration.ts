import { EmailTemplate } from '../types/template';
import { generateEmailHtml } from './htmlGenerator';

export interface CopyToClipboardResult {
  success: boolean;
  method: 'clipboard_item' | 'legacy_exec_command' | 'plain_fallback';
  message: string;
}

export const GmailIntegration = {
  /**
   * Copies rich HTML to clipboard so the user can paste it directly into Gmail with 100% fidelity.
   */
  async copyRichHtmlToClipboard(template: EmailTemplate): Promise<CopyToClipboardResult> {
    const html = generateEmailHtml(template);
    const plainText = template.blocks
      .map(b => {
        if ('title' in b.data && b.data.title) return `${b.data.title}\n`;
        if ('content' in b.data && b.data.content) return `${b.data.content}\n`;
        return '';
      })
      .filter(Boolean)
      .join('\n');

    try {
      if (typeof window !== 'undefined' && 'clipboard' in navigator && window.ClipboardItem) {
        const htmlBlob = new Blob([html], { type: 'text/html' });
        const textBlob = new Blob([plainText || 'Template Email'], { type: 'text/plain' });
        const item = new window.ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        });
        await navigator.clipboard.write([item]);
        return {
          success: true,
          method: 'clipboard_item',
          message: 'Template copié en HTML enrichi dans le presse-papiers !',
        };
      }
    } catch (err) {
      console.warn('ClipboardItem non supporté ou bloqué, passage au fallback:', err);
    }

    // Fallback: create temporary contenteditable div and use execCommand('copy')
    try {
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = html;
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);
      container.focus();

      const range = document.createRange();
      range.selectNodeContents(container);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        const successful = document.execCommand('copy');
        selection.removeAllRanges();
        document.body.removeChild(container);

        if (successful) {
          return {
            success: true,
            method: 'legacy_exec_command',
            message: 'Template copié en HTML enrichi !',
          };
        }
      }
      document.body.removeChild(container);
    } catch (err2) {
      console.warn('execCommand copy fallback failed:', err2);
    }

    // Fallback to standard text copy
    try {
      await navigator.clipboard.writeText(html);
      return {
        success: true,
        method: 'plain_fallback',
        message: 'Code HTML copié dans le presse-papiers.',
      };
    } catch {
      return {
        success: false,
        method: 'plain_fallback',
        message: 'Impossible de copier automatiquement dans le presse-papiers.',
      };
    }
  },

  /**
   * Generates direct Gmail compose URL with recipient and subject.
   */
  getGmailComposeUrl(recipient = '', subject = ''): string {
    const params = new URLSearchParams();
    params.set('view', 'cm');
    params.set('fs', '1');
    params.set('tf', '1');
    if (recipient) params.set('to', recipient);
    if (subject) params.set('su', subject);
    return `https://mail.google.com/mail/?${params.toString()}`;
  },

  /**
   * Opens Gmail compose window in new tab.
   */
  openGmailCompose(recipient = '', subject = ''): Window | null {
    const url = this.getGmailComposeUrl(recipient, subject);
    return window.open(url, '_blank', 'noopener,noreferrer');
  },

  /**
   * Generates a ready-to-run Google Apps Script snippet for creating a draft in Gmail with HTML body.
   */
  generateAppsScriptCode(template: EmailTemplate): string {
    const html = generateEmailHtml(template);
    // Sanitize string for Apps Script literal
    const safeHtml = JSON.stringify(html);
    const safeSubject = JSON.stringify(template.subject || 'Mon Template Email');
    const safeRecipient = JSON.stringify(template.recipientEmail || '');

    return `/**
 * Google Apps Script — Création automatique de brouillon Gmail
 * Exécutez ce script sur https://script.google.com pour créer un brouillon dans votre compte Gmail.
 */
function createEmailTemplateDraft() {
  var recipient = ${safeRecipient};
  var subject = ${safeSubject};
  var htmlBody = ${safeHtml};
  
  // Création du brouillon avec mise en forme HTML intégrale
  var draft = GmailApp.createDraft(
    recipient, 
    subject, 
    "Veuillez activer l'affichage HTML pour lire ce message.", 
    {
      htmlBody: htmlBody
    }
  );
  
  Logger.log("Brouillon créé avec succès dans Gmail ! ID: " + draft.getId());
  return draft.getId();
}`;
  },

  /**
   * Generates a Bookmarklet code for 1-click injection in Gmail compose box.
   */
  generateBookmarkletCode(): string {
    return `javascript:(function(){
      var activeEl = document.querySelector('div[aria-label="Corps du message"], div[aria-label="Message Body"], div[role="textbox"]');
      if(!activeEl){
        alert("Ouvrez d'abord une fenêtre de rédaction de message dans Gmail, puis cliquez sur ce favori.");
        return;
      }
      navigator.clipboard.read().then(function(items){
        for(var i=0; i<items.length; i++){
          if(items[i].types.includes('text/html')){
            items[i].getType('text/html').then(function(blob){
              blob.text().then(function(html){
                activeEl.focus();
                document.execCommand('insertHTML', false, html);
              });
            });
            return;
          }
        }
        alert("Veuillez d'abord copier votre template depuis Email Template Studio.");
      }).catch(function(){
        alert("Collez simplement avec Ctrl+V (ou Cmd+V) dans le corps du message !");
      });
    })();`.replace(/\s+/g, ' ');
  },
};
