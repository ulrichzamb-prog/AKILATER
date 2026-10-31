/**
 * Generates and triggers download of a standalone, beautifully illustrated
 * HTML / PDF-ready guide document for Email Template Studio.
 */

export function generateIllustratedGuideHtml(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guide d'utilisation Illustré — Email Template Studio</title>
  <style>
    :root {
      --primary: #1e40af;
      --primary-dark: #1e3a8a;
      --primary-light: #eff6ff;
      --accent: #dc2626;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-600: #475569;
      --slate-400: #94a3b8;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --border: #e2e8f0;
      --success: #16a34a;
      --warning: #f59e0b;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: var(--slate-800);
      background-color: #f8fafc;
      padding: 32px 16px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      border: 1px solid var(--border);
      overflow: hidden;
    }
    /* Action Bar */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--slate-100);
      padding: 12px 24px;
      border-bottom: 1px solid var(--border);
    }
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #dbeafe;
      color: var(--primary);
      font-weight: 700;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .print-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--primary);
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .print-btn:hover {
      background: var(--primary-dark);
    }
    /* Header Cover */
    .header-cover {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: white;
      padding: 48px 36px;
      position: relative;
    }
    .header-cover h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 10px;
    }
    .header-cover p {
      font-size: 16px;
      color: #bfdbfe;
      max-width: 650px;
      line-height: 1.5;
    }
    /* Content sections */
    .content {
      padding: 40px 36px;
    }
    h2 {
      font-size: 22px;
      font-weight: 700;
      color: var(--slate-900);
      margin-top: 36px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    h2:first-of-type {
      margin-top: 0;
    }
    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--primary);
      color: white;
      font-size: 15px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    p, li {
      font-size: 14.5px;
      color: var(--slate-600);
      margin-bottom: 14px;
    }
    ul, ol {
      margin-left: 20px;
      margin-bottom: 18px;
    }
    li {
      margin-bottom: 8px;
    }
    /* Diagram & Visual Cards */
    .diagram-card {
      background: var(--slate-50);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0 28px 0;
    }
    .diagram-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--slate-400);
      margin-bottom: 16px;
    }
    /* Workflow Flex diagram */
    .workflow-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .workflow-item {
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .workflow-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      margin: 0 auto 12px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .workflow-item h4 {
      font-size: 14px;
      font-weight: 700;
      color: var(--slate-900);
      margin-bottom: 6px;
    }
    .workflow-item p {
      font-size: 12px;
      color: var(--slate-600);
      margin: 0;
    }
    /* Callouts */
    .callout {
      border-radius: 8px;
      padding: 16px 20px;
      margin: 20px 0;
      border-left: 4px solid var(--primary);
      background: var(--primary-light);
    }
    .callout.warning {
      border-left-color: var(--accent);
      background: #fef2f2;
    }
    .callout.success {
      border-left-color: var(--success);
      background: #f0fdf4;
    }
    .callout h4 {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .callout p {
      font-size: 13px;
      margin: 0;
    }
    /* UI Mockup illustration */
    .ui-mockup {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      margin: 16px 0;
      background: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .mockup-bar {
      background: #e2e8f0;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .mockup-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #94a3b8;
    }
    .mockup-body {
      display: flex;
      height: 200px;
      background: #f1f5f9;
    }
    .mockup-col-left {
      width: 50%;
      border-right: 1px dashed #cbd5e1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #ffffff;
    }
    .mockup-col-right {
      width: 50%;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
    }
    /* Print optimizations */
    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }
      .container {
        border: none;
        box-shadow: none;
        max-width: 100%;
      }
      .action-bar {
        display: none;
      }
      .header-cover {
        padding: 24px;
        background: #1e3a8a !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      h2 {
        page-break-after: avoid;
      }
      .diagram-card, .ui-mockup {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    <!-- Top Action Bar -->
    <div class="action-bar">
      <span class="badge-pill">
        📘 Guide Officiel Illustré
      </span>
      <button class="print-btn" onclick="window.print()">
        🖨️ Imprimer ou Enregistrer en PDF
      </button>
    </div>

    <!-- Hero Header Cover -->
    <header class="header-cover">
      <h1>Email Template Studio</h1>
      <p>Guide d'utilisation complet pour transformer des images, documents PDF et maquettes en emails HTML réactifs, compatibles avec Gmail et Outlook, sans altération graphique.</p>
    </header>

    <div class="content">

      <!-- Section 1 : Workflow -->
      <h2><span class="step-num">1</span> Les 3 Piliers du Processus</h2>
      <p>L'application est conçue pour garantir que les chartes graphiques de vos documents originaux sont respectées au pixel près, tout en produisant un code HTML de messagerie conforme aux normes XHTML 1.0 strictes.</p>

      <div class="diagram-card">
        <div class="diagram-title">Schéma du flux de travail</div>
        <div class="workflow-grid">
          <div class="workflow-item">
            <div class="workflow-icon" style="background: #e0f2fe; color: #0284c7;">📄</div>
            <h4>1. Importation</h4>
            <p>Glissez vos PDF, images PNG/JPG ou HTML. Le document s'affiche dans le visualiseur haute fidélité.</p>
          </div>
          <div class="workflow-item">
            <div class="workflow-icon" style="background: #fef3c7; color: #d97706;">✂️</div>
            <h4>2. Découpe réelle</h4>
            <p>Détourez manuellement logos, tampons et signatures manuscrites avec suppression du fond blanc.</p>
          </div>
          <div class="workflow-item">
            <div class="workflow-icon" style="background: #fee2e2; color: #dc2626;">✉️</div>
            <h4>3. Envoi Gmail</h4>
            <p>1 clic pour copier en HTML riche dans le presse-papier et coller dans Gmail sans perte de style.</p>
          </div>
        </div>
      </div>

      <!-- Section 2 : Interface Double Fenêtre -->
      <h2><span class="step-num">2</span> L'Espace de Travail Double Fenêtre (Split View)</h2>
      <p>L'espace de travail affiche côte-à-côte votre document de référence et l'éditeur d'email interactif :</p>

      <div class="ui-mockup">
        <div class="mockup-bar">
          <div class="mockup-dot"></div>
          <div class="mockup-dot"></div>
          <div class="mockup-dot"></div>
          <span style="font-size: 11px; color: #64748b; margin-left: 8px;">Aperçu de la disposition de travail</span>
        </div>
        <div class="mockup-body">
          <div class="mockup-col-left">
            <strong style="font-size: 13px; color: #1e3a8a; margin-bottom: 4px;">VOLET GAUCHE</strong>
            <span style="font-size: 11px; color: #64748b; text-align: center;">Document original importé<br>Zoom, outils de mesure &amp; découpe</span>
          </div>
          <div class="mockup-col-right">
            <strong style="font-size: 13px; color: #16a34a; margin-bottom: 4px;">VOLET DROIT</strong>
            <span style="font-size: 11px; color: #64748b; text-align: center;">Éditeur d'email HTML<br>Texte cliquable &amp; Blocs modulaires</span>
          </div>
        </div>
      </div>

      <!-- Section 3 : Règle d'or de la découpe -->
      <h2><span class="step-num">3</span> La Règle d'Or : Préservation des Éléments Authentiques</h2>
      <div class="callout warning">
        <h4 style="color: #991b1b;">Règle absolue : Aucune hallucination par IA</h4>
        <p>Les logos officiels, signatures manuscrites à la plume, cachets d'entreprise et sceaux administratifs ne sont <strong>jamais déformés, retracés ou réinventés par une IA</strong>. Ils sont directement prélevés depuis le document source.</p>
      </div>

      <p>Comment découper vos graphismes d'origine :</p>
      <ol>
        <li>Dans la vue du document de gauche, cliquez sur le bouton bleu <strong>« Découper »</strong>.</li>
        <li>Ajustez le cadre rectangulaire de sélection autour de votre élément graphique.</li>
        <li>Activez l'option <strong>« Rendre le fond blanc transparent »</strong> : l'algorithme élimine les pixels blancs du papier pour ne conserver que l'encre de la signature ou le rouge du tampon.</li>
        <li>Choisissez où injecter l'élément : <em>En-tête de l'email</em>, <em>Signature manuscrite</em>, ou <em>Tampon certifié</em>.</li>
        <li>Validez : l'élément s'insère instantanément à l'emplacement exact dans votre template.</li>
      </ol>

      <!-- Section 4 : Édition Visuelle et Code -->
      <h2><span class="step-num">4</span> Éditeur Visuel WYSIWYG &amp; Mode Code Synchronisé</h2>
      <p>L'éditeur propose deux modes synchronisés en temps réel :</p>
      <ul>
        <li><strong>Mode Visuel :</strong> Cliquez directement sur n'importe quel texte ou titre pour le modifier en direct. Réorganisez les blocs avec les flèches haut/bas, dupliquez-les ou supprimez-les au survol.</li>
        <li><strong>Mode Code HTML :</strong> Visualisez le code source compatible XHTML 1.0. Toutes les modifications effectuées dans le code sont répercutées sur le visuel, et inversement.</li>
        <li><strong>Inspecteur de droite :</strong> Ajustez les dimensions maximales (600px conseillé pour éviter les barres de défilement horizontal), les marges intérieures, les couleurs et les polices sécurisées.</li>
      </ul>

      <!-- Section 5 : Gmail Integration -->
      <h2><span class="step-num">5</span> L'Intégration Gmail en 1 Clic</h2>
      <p>Pour insérer le template dans votre messagerie Gmail sans altérer les tableaux et le CSS :</p>

      <div class="diagram-card">
        <div class="diagram-title">Procédure recommandée pour Gmail</div>
        <ol style="margin-bottom: 0;">
          <li>Cliquez sur le bouton rouge <strong>« Ouvrir dans Gmail »</strong> en haut à droite.</li>
          <li>Renseignez le destinataire et l'objet de votre email si souhaité.</li>
          <li>Cliquez sur <strong>« Copier l'email &amp; Ouvrir Gmail »</strong> : le template complet est copié au format <em>text/html enrichi</em> dans votre presse-papier système.</li>
          <li>Une nouvelle fenêtre de rédaction Gmail s'ouvre. Cliquez dans le corps de l'email et faites <strong>Ctrl + V</strong> (ou <strong>Cmd + V</strong> sur Mac).</li>
          <li>L'email apparaît instantanément avec ses tableaux, logos, boutons et styles parfaitement rendus !</li>
        </ol>
      </div>

      <!-- Section 6 : Diagnostic & Compatibilité -->
      <h2><span class="step-num">6</span> Diagnostic de Compatibilité &amp; Règle des 102 Ko</h2>
      <p>Cliquez sur <strong>« Aperçu &amp; Tests »</strong> pour vérifier votre email avant diffusion :</p>

      <div class="callout success">
        <h4 style="color: #14532d;">Contrôle anti-tronquage Gmail</h4>
        <p>Gmail tronque automatiquement tout email dont le code HTML dépasse <strong>102 Ko</strong> en masquant le bas du message derrière un lien <em>« Afficher l'intégralité du message »</em>. L'auditeur intégré surveille en permanence la taille de votre template pour éviter ce piège.</p>
      </div>

      <ul>
        <li><strong>Aperçu Mobile :</strong> Vérification de l'empilement vertical des colonnes sur smartphone.</li>
        <li><strong>Vérification des liens :</strong> Détection automatique des boutons pointant vers des ancres vides.</li>
        <li><strong>Balises Alt :</strong> Contrôle de l'accessibilité pour les images découpées.</li>
      </ul>

      <!-- Section 7 : Sauvegarde locale -->
      <h2><span class="step-num">7</span> Sauvegarde Locale &amp; Export</h2>
      <ul>
        <li><strong>Persistance IndexedDB :</strong> Toutes vos créations sont enregistrées sur votre ordinateur, sans abonnement, sans création de compte et sans fuite de données.</li>
        <li><strong>Export HTML autonome :</strong> Téléchargez le code propre pour une utilisation dans Mailchimp, Brevo, Sendgrid ou Outlook.</li>
        <li><strong>Export Archive ZIP :</strong> Téléchargez en 1 clic le fichier HTML avec l'ensemble des graphismes, logos et signatures découpés.</li>
      </ul>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center; font-size: 12px; color: var(--slate-400);">
        Email Template Studio &middot; Guide d'utilisation et d'automatisation Gmail &middot; Document interactif et imprimable
      </div>

    </div>
  </div>

</body>
</html>`;
}

/**
 * Downloads the illustrated guide as a standalone HTML file
 */
export function downloadIllustratedGuideFile() {
  const htmlContent = generateIllustratedGuideHtml();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Guide_Utilisation_Email_Template_Studio_Illustre.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
