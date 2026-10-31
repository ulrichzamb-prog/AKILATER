import { EmailTemplate, EmailBlock, HeaderBlockData, HeroImageBlockData, TextBlockData, TwoColumnBlockData, ThreeColumnBlockData, ButtonBlockData, DividerBlockData, SpacerBlockData, ProductCardBlockData, SignatureBlockData, FooterBlockData, CustomHtmlBlockData } from '../types/template';

function escapeHtml(text?: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderHeaderBlock(block: EmailBlock<'header'>, globalFont: string): string {
  const data = block.data as HeaderBlockData;
  const align = data.align || 'center';
  const logoWidth = data.logoWidth || 180;

  return `
<!-- BLOC: EN-TÊTE / LOGO -->
<tr>
  <td align="${align}" style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 24}px; padding-bottom: ${data.paddingBottom ?? 24}px; padding-left: 24px; padding-right: 24px; font-family: ${globalFont};">
    ${
      data.logoUrl
        ? `<a href="${data.viewOnlineUrl || '#'}" target="_blank" style="text-decoration: none; border: 0;">
            <img src="${data.logoUrl}" alt="${escapeHtml(data.logoAlt || 'Logo')}" width="${logoWidth}" style="display: block; max-width: 100%; height: auto; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; margin: ${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0 auto 0 0'};" />
           </a>`
        : `<h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1e293b; letter-spacing: -0.5px;">${escapeHtml(data.logoAlt || 'Votre Entreprise')}</h1>`
    }
    ${
      data.viewOnlineText && data.viewOnlineUrl
        ? `<div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">
            <a href="${data.viewOnlineUrl}" target="_blank" style="color: #64748b; text-decoration: underline;">${escapeHtml(data.viewOnlineText)}</a>
           </div>`
        : ''
    }
  </td>
</tr>`;
}

function renderHeroBlock(block: EmailBlock<'hero_image'>, globalFont: string): string {
  const data = block.data as HeroImageBlockData;
  const paddingX = data.fullWidth ? 0 : 24;

  return `
<!-- BLOC: BANNIÈRE HERO -->
<tr>
  <td align="center" style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 16}px; padding-bottom: ${data.paddingBottom ?? 16}px; padding-left: ${paddingX}px; padding-right: ${paddingX}px; font-family: ${globalFont};">
    ${data.linkUrl ? `<a href="${data.linkUrl}" target="_blank" style="text-decoration: none; border: 0;">` : ''}
    <img src="${data.imageUrl || 'https://placehold.co/600x260/2563eb/ffffff?text=Banni%C3%A8re+Email'}" alt="${escapeHtml(data.altText || 'Bannière')}" width="${data.fullWidth ? 600 : 552}" style="display: block; width: 100%; max-width: ${data.fullWidth ? '600px' : '552px'}; height: auto; border-radius: ${data.fullWidth ? '0px' : '8px'}; border: 0; outline: none; -ms-interpolation-mode: bicubic;" />
    ${data.linkUrl ? `</a>` : ''}
    ${
      data.caption
        ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b; text-align: center; font-style: italic;">${escapeHtml(data.caption)}</p>`
        : ''
    }
  </td>
</tr>`;
}

function renderTextBlock(block: EmailBlock<'text'>, globalFont: string, globalColor: string): string {
  const data = block.data as TextBlockData;
  const align = data.align || 'left';
  const textColor = data.textColor || globalColor;
  const fontSize = data.fontSize || 16;
  const lineHeight = data.lineHeight || 1.6;
  const blockFont = data.fontFamily || globalFont;
  const fontWeight = data.fontWeight === 'bold' ? '700' : '400';

  // Process paragraphs and linebreaks
  const paragraphs = (data.content || '').split('\n').filter(p => p.trim() !== '');

  return `
<!-- BLOC: TEXTE -->
<tr>
  <td align="${align}" style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 16}px; padding-bottom: ${data.paddingBottom ?? 16}px; padding-left: ${data.paddingLeft ?? 24}px; padding-right: ${data.paddingRight ?? 24}px; font-family: ${blockFont};">
    ${
      data.title
        ? `<h2 style="margin: 0 0 12px 0; font-family: ${blockFont}; font-size: ${data.titleSize || 22}px; font-weight: 700; line-height: 1.3; color: ${data.titleColor || '#0f172a'}; text-align: ${align};">${data.title}</h2>`
        : ''
    }
    ${
      data.subtitle
        ? `<h3 style="margin: 0 0 12px 0; font-family: ${blockFont}; font-size: 16px; font-weight: 600; line-height: 1.4; color: #475569; text-align: ${align};">${data.subtitle}</h3>`
        : ''
    }
    ${paragraphs
      .map(
        p =>
          `<p style="margin: 0 0 12px 0; font-family: ${blockFont}; font-size: ${fontSize}px; font-weight: ${fontWeight}; line-height: ${lineHeight}; color: ${textColor}; text-align: ${align};">${p}</p>`
      )
      .join('\n')}
  </td>
</tr>`;
}

function renderButtonBlock(block: EmailBlock<'button'>, globalFont: string): string {
  const data = block.data as ButtonBlockData;
  const align = data.align || 'center';
  const bgColor = data.buttonColor || '#1e40af';
  const textColor = data.textColor || '#ffffff';
  const radius = data.borderRadius ?? 6;
  const py = data.buttonPaddingY ?? 12;
  const px = data.buttonPaddingX ?? 24;

  return `
<!-- BLOC: BOUTON D'ACTION (BULLETPROOF VML + TABLE) -->
<tr>
  <td align="${align}" style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 16}px; padding-bottom: ${data.paddingBottom ?? 16}px; padding-left: 24px; padding-right: 24px; font-family: ${globalFont};">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: ${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0 auto 0 0'};">
      <tr>
        <td align="center" bgcolor="${bgColor}" style="border-radius: ${radius}px; background-color: ${bgColor};">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${data.url || '#'}" style="height:${py * 2 + 18}px;v-text-anchor:middle;width:auto;" arcsize="${Math.round((radius / 30) * 100)}%" strokecolor="${bgColor}" fillcolor="${bgColor}">
          <w:anchorlock/>
          <center style="color:${textColor};font-family:${globalFont};font-size:${data.fontSize || 15}px;font-weight:${data.bold ? 'bold' : 'normal'};">
            ${escapeHtml(data.text || 'Cliquez ici')}
          </center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-- -->
          <a href="${data.url || '#'}" target="_blank" style="display: inline-block; padding: ${py}px ${px}px; font-family: ${globalFont}; font-size: ${data.fontSize || 15}px; font-weight: ${data.bold ? '700' : '500'}; color: ${textColor}; text-decoration: none; border-radius: ${radius}px; background-color: ${bgColor}; border: 1px solid ${bgColor}; text-align: center; -webkit-text-size-adjust: none;">
            ${escapeHtml(data.text || 'Cliquez ici')}
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

function renderTwoColumnBlock(block: EmailBlock<'two_column'>, globalFont: string): string {
  const data = block.data as TwoColumnBlockData;

  return `
<!-- BLOC: 2 COLONNES RESPONSIVES -->
<tr>
  <td style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 16}px; padding-bottom: ${data.paddingBottom ?? 16}px; padding-left: 16px; padding-right: 16px; font-family: ${globalFont};">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <!-- Colonne 1 -->
        <td class="mobile-col" width="48%" valign="top" style="padding: 8px;">
          ${data.col1.imageUrl ? `<img src="${data.col1.imageUrl}" alt="" width="260" style="display: block; width: 100%; max-width: 260px; height: auto; border-radius: 6px; margin-bottom: 12px; border: 0;" />` : ''}
          ${data.col1.title ? `<h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #0f172a;">${escapeHtml(data.col1.title)}</h3>` : ''}
          <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5; color: #475569;">${escapeHtml(data.col1.content)}</p>
          ${data.col1.buttonText && data.col1.buttonUrl ? `<a href="${data.col1.buttonUrl}" target="_blank" style="display: inline-block; font-size: 13px; font-weight: 600; color: #1e40af; text-decoration: none;">${escapeHtml(data.col1.buttonText)} &rarr;</a>` : ''}
        </td>
        <!-- Espacement Desktop -->
        <td class="mobile-hide" width="4%" style="width: 4%; font-size: 1px; line-height: 1px;">&nbsp;</td>
        <!-- Colonne 2 -->
        <td class="mobile-col" width="48%" valign="top" style="padding: 8px;">
          ${data.col2.imageUrl ? `<img src="${data.col2.imageUrl}" alt="" width="260" style="display: block; width: 100%; max-width: 260px; height: auto; border-radius: 6px; margin-bottom: 12px; border: 0;" />` : ''}
          ${data.col2.title ? `<h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #0f172a;">${escapeHtml(data.col2.title)}</h3>` : ''}
          <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5; color: #475569;">${escapeHtml(data.col2.content)}</p>
          ${data.col2.buttonText && data.col2.buttonUrl ? `<a href="${data.col2.buttonUrl}" target="_blank" style="display: inline-block; font-size: 13px; font-weight: 600; color: #1e40af; text-decoration: none;">${escapeHtml(data.col2.buttonText)} &rarr;</a>` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

function renderThreeColumnBlock(block: EmailBlock<'three_column'>, globalFont: string): string {
  const data = block.data as ThreeColumnBlockData;

  const renderCol = (col: any) => `
    <td class="mobile-col" width="31%" valign="top" style="padding: 8px; text-align: center;">
      ${col.imageUrl ? `<img src="${col.imageUrl}" alt="" width="160" style="display: block; width: 100%; max-width: 160px; height: auto; border-radius: 6px; margin: 0 auto 10px auto; border: 0;" />` : ''}
      ${col.title ? `<h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #0f172a;">${escapeHtml(col.title)}</h4>` : ''}
      <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.4; color: #64748b;">${escapeHtml(col.content)}</p>
      ${col.buttonText && col.buttonUrl ? `<a href="${col.buttonUrl}" target="_blank" style="font-size: 12px; font-weight: 600; color: #1e40af; text-decoration: none;">${escapeHtml(col.buttonText)} &rarr;</a>` : ''}
    </td>
  `;

  return `
<!-- BLOC: 3 COLONNES FONCTIONNALITÉS -->
<tr>
  <td style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 16}px; padding-bottom: ${data.paddingBottom ?? 16}px; padding-left: 12px; padding-right: 12px; font-family: ${globalFont};">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        ${renderCol(data.col1)}
        <td class="mobile-hide" width="3%" style="width: 3%; font-size: 1px; line-height: 1px;">&nbsp;</td>
        ${renderCol(data.col2)}
        <td class="mobile-hide" width="3%" style="width: 3%; font-size: 1px; line-height: 1px;">&nbsp;</td>
        ${renderCol(data.col3)}
      </tr>
    </table>
  </td>
</tr>`;
}

function renderProductCardBlock(block: EmailBlock<'product_card'>, globalFont: string): string {
  const data = block.data as ProductCardBlockData;

  return `
<!-- BLOC: CARTE PRODUIT / OFFRE -->
<tr>
  <td align="center" style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 16}px; padding-bottom: ${data.paddingBottom ?? 16}px; padding-left: 24px; padding-right: 24px; font-family: ${globalFont};">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${data.cardBackground || '#f8fafc'}; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td align="center" style="padding: 24px;">
          ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${escapeHtml(data.title)}" width="220" style="display: block; max-width: 100%; height: auto; border-radius: 6px; margin-bottom: 16px; border: 0;" />` : ''}
          ${data.badge ? `<div style="display: inline-block; margin-bottom: 8px; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1e40af; background-color: #dbeafe; border-radius: 4px;">${escapeHtml(data.badge)}</div>` : ''}
          <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0f172a;">${escapeHtml(data.title)}</h3>
          <div style="margin-bottom: 12px;">
            <span style="font-size: 24px; font-weight: 700; color: #0f172a;">${escapeHtml(data.price)}</span>
            ${data.originalPrice ? `<span style="font-size: 14px; color: #94a3b8; text-decoration: line-through; margin-left: 8px;">${escapeHtml(data.originalPrice)}</span>` : ''}
          </div>
          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #64748b; max-width: 440px;">${escapeHtml(data.description)}</p>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" bgcolor="${data.buttonColor || '#1e40af'}" style="border-radius: 6px;">
                <a href="${data.buttonUrl || '#'}" target="_blank" style="display: inline-block; padding: 10px 24px; font-family: ${globalFont}; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: ${data.buttonColor || '#1e40af'};">
                  ${escapeHtml(data.buttonText || 'Découvrir')}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

function renderSignatureBlock(block: EmailBlock<'signature'>, globalFont: string): string {
  const data = block.data as SignatureBlockData;
  const align = data.align || 'left';

  return `
<!-- BLOC: SIGNATURE & CACHET OFFICIEL (CONSERVATION ÉLÉMENT GRAPHIQUE ORIGINAL) -->
<tr>
  <td align="${align}" style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 20}px; padding-bottom: ${data.paddingBottom ?? 20}px; padding-left: 24px; padding-right: 24px; font-family: ${globalFont};">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: ${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0 auto 0 0'};">
      <tr>
        <td valign="top" style="font-family: ${globalFont};">
          <!-- Signature manuscrite originale découpée -->
          ${
            data.signatureImageUrl
              ? `<div style="margin-bottom: 10px;">
                  <img src="${data.signatureImageUrl}" alt="Signature originale" width="160" style="display: block; max-width: 180px; height: auto; border: 0; outline: none; -ms-interpolation-mode: bicubic;" />
                 </div>`
              : ''
          }
          <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
            ${escapeHtml(data.name || 'Prénom Nom')}
          </div>
          <div style="font-size: 13px; color: #475569; margin-bottom: 4px;">
            ${escapeHtml(data.title || 'Directeur Général')}${data.company ? ` &middot; ${escapeHtml(data.company)}` : ''}
          </div>
          ${
            data.phone || data.email || data.website
              ? `<div style="font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 6px;">
                  ${data.phone ? `Tél : ${escapeHtml(data.phone)}<br/>` : ''}
                  ${data.email ? `Email : <a href="mailto:${data.email}" style="color: #1e40af; text-decoration: none;">${escapeHtml(data.email)}</a><br/>` : ''}
                  ${data.website ? `Web : <a href="${data.website}" target="_blank" style="color: #1e40af; text-decoration: none;">${escapeHtml(data.website)}</a>` : ''}
                 </div>`
              : ''
          }
        </td>
        ${
          data.stampImageUrl
            ? `<td valign="middle" style="padding-left: 20px;">
                <!-- Cachet / Tampon original découpé -->
                <img src="${data.stampImageUrl}" alt="Cachet officiel" width="100" style="display: block; max-width: 110px; height: auto; opacity: 0.95; border: 0;" />
               </td>`
            : ''
        }
      </tr>
    </table>
  </td>
</tr>`;
}

function renderDividerBlock(block: EmailBlock<'divider'>): string {
  const data = block.data as DividerBlockData;
  const style = data.style || 'solid';
  const color = data.color || '#e2e8f0';
  const thickness = data.thickness || 1;
  const width = data.widthPercent || 100;

  return `
<!-- BLOC: SÉPARATEUR -->
<tr>
  <td align="center" style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 16}px; padding-bottom: ${data.paddingBottom ?? 16}px; padding-left: 24px; padding-right: 24px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${width}%" style="max-width: ${width}%;">
      <tr>
        <td style="border-top: ${thickness}px ${style} ${color}; font-size: 1px; line-height: 1px;">&nbsp;</td>
      </tr>
    </table>
  </td>
</tr>`;
}

function renderSpacerBlock(block: EmailBlock<'spacer'>): string {
  const data = block.data as SpacerBlockData;
  const height = data.height || 20;

  return `
<!-- BLOC: ESPACEUR -->
<tr>
  <td height="${height}" style="height: ${height}px; font-size: 1px; line-height: 1px; background-color: ${block.backgroundColor || 'transparent'};">&nbsp;</td>
</tr>`;
}

function renderFooterBlock(block: EmailBlock<'footer'>, globalFont: string): string {
  const data = block.data as FooterBlockData;
  const textColor = data.textColor || '#64748b';

  return `
<!-- BLOC: PIED DE PAGE & LIENS LÉGAUX -->
<tr>
  <td align="center" style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 24}px; padding-bottom: ${data.paddingBottom ?? 32}px; padding-left: 24px; padding-right: 24px; font-family: ${globalFont};">
    ${
      data.showSocials && data.socials
        ? `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
            <tr>
              ${data.socials.linkedin ? `<td style="padding: 0 6px;"><a href="${data.socials.linkedin}" target="_blank" style="color: #1e40af; font-size: 12px; font-weight: 600; text-decoration: none;">LinkedIn</a></td>` : ''}
              ${data.socials.twitter ? `<td style="padding: 0 6px;"><a href="${data.socials.twitter}" target="_blank" style="color: #1e40af; font-size: 12px; font-weight: 600; text-decoration: none;">X / Twitter</a></td>` : ''}
              ${data.socials.facebook ? `<td style="padding: 0 6px;"><a href="${data.socials.facebook}" target="_blank" style="color: #1e40af; font-size: 12px; font-weight: 600; text-decoration: none;">Facebook</a></td>` : ''}
              ${data.socials.instagram ? `<td style="padding: 0 6px;"><a href="${data.socials.instagram}" target="_blank" style="color: #1e40af; font-size: 12px; font-weight: 600; text-decoration: none;">Instagram</a></td>` : ''}
              ${data.socials.website ? `<td style="padding: 0 6px;"><a href="${data.socials.website}" target="_blank" style="color: #1e40af; font-size: 12px; font-weight: 600; text-decoration: none;">Site Web</a></td>` : ''}
            </tr>
           </table>`
        : ''
    }
    <p style="margin: 0 0 6px 0; font-size: 12px; line-height: 1.5; color: ${textColor}; text-align: center;">
      ${escapeHtml(data.companyName || 'Votre Entreprise')} &middot; ${escapeHtml(data.address || '123 Avenue des Champs-Élysées, Paris')}
    </p>
    <p style="margin: 0 0 10px 0; font-size: 11px; line-height: 1.5; color: #94a3b8; text-align: center;">
      ${escapeHtml(data.copyright || '© Tous droits réservés.')}
    </p>
    <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #94a3b8; text-align: center;">
      <a href="${data.unsubscribeUrl || '#'}" target="_blank" style="color: #64748b; text-decoration: underline;">${escapeHtml(data.unsubscribeText || 'Se désinscrire')}</a>
      ${
        data.privacyUrl
          ? ` &middot; <a href="${data.privacyUrl}" target="_blank" style="color: #64748b; text-decoration: underline;">${escapeHtml(data.privacyText || 'Politique de confidentialité')}</a>`
          : ''
      }
    </p>
  </td>
</tr>`;
}

function renderCustomHtmlBlock(block: EmailBlock<'custom_html'>): string {
  const data = block.data as CustomHtmlBlockData;
  return `
<!-- BLOC: HTML SUR-MESURE -->
<tr>
  <td style="background-color: ${block.backgroundColor || 'transparent'}; padding-top: ${data.paddingTop ?? 12}px; padding-bottom: ${data.paddingBottom ?? 12}px; padding-left: 24px; padding-right: 24px;">
    ${data.html || '<!-- HTML personnalisé -->'}
  </td>
</tr>`;
}

export function generateEmailHtml(template: EmailTemplate): string {
  const { globalSettings, blocks, preheader } = template;
  const maxWidth = globalSettings.maxWidth || 600;
  const fontFamily = globalSettings.fontFamily || 'Arial, Helvetica, sans-serif';
  const bgOuter = globalSettings.backgroundColor || '#f1f5f9';
  const bgContainer = globalSettings.containerColor || '#ffffff';
  const defaultTextColor = globalSettings.textColor || '#1e293b';

  const renderedBlocks = blocks
    .map(block => {
      switch (block.type) {
        case 'header':
          return renderHeaderBlock(block as EmailBlock<'header'>, fontFamily);
        case 'hero_image':
          return renderHeroBlock(block as EmailBlock<'hero_image'>, fontFamily);
        case 'text':
          return renderTextBlock(block as EmailBlock<'text'>, fontFamily, defaultTextColor);
        case 'button':
          return renderButtonBlock(block as EmailBlock<'button'>, fontFamily);
        case 'two_column':
          return renderTwoColumnBlock(block as EmailBlock<'two_column'>, fontFamily);
        case 'three_column':
          return renderThreeColumnBlock(block as EmailBlock<'three_column'>, fontFamily);
        case 'product_card':
          return renderProductCardBlock(block as EmailBlock<'product_card'>, fontFamily);
        case 'signature':
          return renderSignatureBlock(block as EmailBlock<'signature'>, fontFamily);
        case 'divider':
          return renderDividerBlock(block as EmailBlock<'divider'>);
        case 'spacer':
          return renderSpacerBlock(block as EmailBlock<'spacer'>);
        case 'footer':
          return renderFooterBlock(block as EmailBlock<'footer'>, fontFamily);
        case 'custom_html':
          return renderCustomHtmlBlock(block as EmailBlock<'custom_html'>);
        default:
          return '';
      }
    })
    .join('\n');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="fr">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(template.subject || 'Email Template')}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles pour tous les clients email */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100%; background-color: ${bgOuter}; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    
    /* Media queries pour mobile */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .mobile-full { width: 100% !important; display: block !important; }
      .mobile-col { width: 100% !important; display: block !important; box-sizing: border-box !important; padding-left: 0 !important; padding-right: 0 !important; }
      .mobile-hide { display: none !important; }
      .mobile-center { text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: ${bgOuter}; font-family: ${fontFamily}; color: ${defaultTextColor};">
  
  <!-- PRÉ-HEADER CACHÉ DANS GMAIL & CLIENTS DE MESSAGERIE -->
  ${
    preheader
      ? `<div style="display: none; font-size: 1px; color: ${bgOuter}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
          ${escapeHtml(preheader)}
          &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy; &#847; &zwnj; &nbsp; &#8199; &shy;
        </div>`
      : ''
  }

  <!-- CONTENEUR GLOBAL CENTRÉ -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${bgOuter};">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="${maxWidth}">
        <tr>
        <td>
        <![endif]-->
        
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: ${maxWidth}px; background-color: ${bgContainer}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05); margin: 0 auto;">
          ${renderedBlocks}
        </table>

        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>

</body>
</html>`;
}
