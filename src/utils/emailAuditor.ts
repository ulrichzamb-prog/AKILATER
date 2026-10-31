import { EmailTemplate, AuditReport, AuditIssue } from '../types/template';
import { generateEmailHtml } from './htmlGenerator';

export function auditEmailTemplate(template: EmailTemplate): AuditReport {
  const issues: AuditIssue[] = [];
  let passedCount = 0;

  // 1. Audit Subject & Preheader
  if (!template.subject || template.subject.trim() === '') {
    issues.push({
      id: 'sub_empty',
      type: 'warning',
      category: 'compatibility',
      message: 'Sujet d\'email manquant',
      detail: 'Définissez un objet percutant pour maximiser le taux d\'ouverture dans Gmail.',
    });
  } else if (template.subject.length > 70) {
    issues.push({
      id: 'sub_length',
      type: 'info',
      category: 'compatibility',
      message: 'Sujet relativement long (> 70 caractères)',
      detail: 'Sur mobile, Gmail tronque souvent les objets après 50-60 caractères.',
    });
  } else {
    passedCount++;
  }

  if (!template.preheader || template.preheader.trim() === '') {
    issues.push({
      id: 'pre_empty',
      type: 'info',
      category: 'accessibility',
      message: 'Pré-header vide',
      detail: 'Le pré-header s\'affiche à côté de l\'objet dans la boîte de réception Gmail.',
    });
  } else {
    passedCount++;
  }

  // 2. Audit Blocks & Width
  if (template.globalSettings.maxWidth > 650) {
    issues.push({
      id: 'width_large',
      type: 'warning',
      category: 'compatibility',
      message: `Largeur de conteneur élevée (${template.globalSettings.maxWidth}px)`,
      detail: 'La largeur recommandée pour Gmail et Outlook est comprise entre 600px et 650px.',
    });
  } else {
    passedCount++;
  }

  // 3. Audit Images
  let totalImages = 0;
  let imagesWithoutAlt = 0;
  let largeBase64Images = 0;

  template.blocks.forEach(block => {
    if (block.type === 'header') {
      const d = block.data as any;
      if (d.logoUrl) {
        totalImages++;
        if (!d.logoAlt) imagesWithoutAlt++;
        if (d.logoUrl.startsWith('data:') && d.logoUrl.length > 500000) largeBase64Images++;
      }
    } else if (block.type === 'hero_image') {
      const d = block.data as any;
      if (d.imageUrl) {
        totalImages++;
        if (!d.altText) imagesWithoutAlt++;
        if (d.imageUrl.startsWith('data:') && d.imageUrl.length > 800000) largeBase64Images++;
      } else {
        issues.push({
          id: `img_missing_${block.id}`,
          type: 'error',
          category: 'images',
          message: 'Bannière hero sans URL d\'image',
          detail: 'Veuillez renseigner une image valide ou supprimer le bloc.',
          blockId: block.id,
        });
      }
    } else if (block.type === 'signature') {
      const d = block.data as any;
      if (d.signatureImageUrl) {
        totalImages++;
      }
      if (d.stampImageUrl) {
        totalImages++;
      }
    } else if (block.type === 'two_column') {
      const d = block.data as any;
      if (d.col1?.imageUrl) totalImages++;
      if (d.col2?.imageUrl) totalImages++;
    } else if (block.type === 'product_card') {
      const d = block.data as any;
      if (d.imageUrl) totalImages++;
    }
  });

  if (imagesWithoutAlt > 0) {
    issues.push({
      id: 'alt_missing',
      type: 'warning',
      category: 'accessibility',
      message: `${imagesWithoutAlt} image(s) sans texte alternatif (alt)`,
      detail: 'Ajoutez un texte alternatif descriptif pour l\'accessibilité et les lecteurs d\'écran si les images sont désactivées.',
    });
  } else {
    passedCount++;
  }

  if (largeBase64Images > 0) {
    issues.push({
      id: 'base64_large',
      type: 'warning',
      category: 'images',
      message: 'Images base64 volumineuses détectées (> 500 Ko)',
      detail: 'Gmail peut tronquer les messages dont le poids HTML total dépasse 102 Ko. Privilégiez des images compressées ou hébergées.',
    });
  } else {
    passedCount++;
  }

  // 4. Audit Links
  let totalLinks = 0;
  let emptyLinks = 0;

  template.blocks.forEach(block => {
    if (block.type === 'button') {
      const d = block.data as any;
      totalLinks++;
      if (!d.url || d.url === '#' || d.url === 'https://example.com') {
        emptyLinks++;
      }
    } else if (block.type === 'footer') {
      const d = block.data as any;
      totalLinks += 2;
      if (!d.unsubscribeUrl || d.unsubscribeUrl === '#') {
        emptyLinks++;
      }
    }
  });

  if (emptyLinks > 0) {
    issues.push({
      id: 'empty_links',
      type: 'warning',
      category: 'links',
      message: `${emptyLinks} lien(s) pointent vers des URLs par défaut ou vides (#)`,
      detail: 'Pensez à mettre à jour les URLs de redirection de vos boutons et liens légaux avant l\'envoi réel.',
    });
  } else {
    passedCount++;
  }

  // 5. Audit Generated HTML code (Gmail compatibility)
  const fullHtml = generateEmailHtml(template);
  const htmlSizeKb = Math.round(new Blob([fullHtml]).size / 1024);

  if (htmlSizeKb > 102) {
    issues.push({
      id: 'gmail_clip',
      type: 'error',
      category: 'compatibility',
      message: `Poids de l'email élevé : ${htmlSizeKb} Ko (Seuil Gmail : 102 Ko)`,
      detail: 'Gmail tronque les emails de plus de 102 Ko et affiche "[Message tronqué] Afficher l\'intégralité". Compressez vos images découpées.',
    });
  } else {
    passedCount++;
  }

  // Check for forbidden keywords in email HTML
  if (/<script/i.test(fullHtml)) {
    issues.push({
      id: 'js_detected',
      type: 'error',
      category: 'compatibility',
      message: 'Balise JavaScript détectée dans le HTML',
      detail: 'Tous les clients email bloquent immédiatement les scripts JavaScript.',
    });
  } else {
    passedCount++;
  }

  if (/display:\s*grid/i.test(fullHtml)) {
    issues.push({
      id: 'css_grid',
      type: 'warning',
      category: 'compatibility',
      message: 'CSS Grid détecté',
      detail: 'CSS Grid n\'est pas supporté par Outlook ni plusieurs versions de Gmail. Les tableaux HTML <table> restent la norme fiable.',
    });
  } else {
    passedCount++;
  }

  const score = Math.max(
    0,
    Math.min(
      100,
      100 -
        issues.filter(i => i.type === 'error').length * 25 -
        issues.filter(i => i.type === 'warning').length * 10 -
        issues.filter(i => i.type === 'info').length * 4
    )
  );

  return {
    score,
    passedCount,
    issues,
    gmailCompatible: issues.filter(i => i.category === 'compatibility' && i.type === 'error').length === 0,
    outlookCompatible: !issues.some(i => i.id === 'css_grid'),
    mobileResponsive: true,
  };
}
