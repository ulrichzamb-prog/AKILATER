# Email Template Studio

Application web professionnelle permettant de convertir des maquettes visuelles, images (PNG, JPG), fichiers PDF et fichiers HTML en templates d'emails HTML responsive haute fidélité, compatibles avec **Gmail**, **Outlook** et **Apple Mail**.

---

## 🚀 Fonctionnalités Principales

### 1. Importation & Vue Scindée (Split-Screen)
- Support des fichiers **PNG, JPG, JPEG**, **PDF** et **HTML**.
- Visualisation comparative côte-à-côte : document original d'un côté, éditeur de template de l'autre.
- Modèles d'exemples intégrés (Facture avec cachet et signature, Newsletter B2B) accessibles en 1 clic.

### 2. Conservation Rigoureuse des Graphismes Originaux (Règle Absolue)
- **Outil de Découpe Haute Précision** : Cadre de sélection interactif sur le document d'origine pour isoler les logos, signatures manuscrites à la plume, cachets officiels et sceaux sans aucune altération par IA.
- **Filtre de transparence intelligent** : Suppression optionnelle du fond blanc pour les signatures et tampons, garantissant un rendu authentique sur tout fond d'email.
- Assignation directe en 1 clic : Logo d'en-tête, Signature, Tampon, Bannière.

### 3. Éditeur Bi-Directionnel (Visuel WYSIWYG & Code HTML)
- **Mode Visuel** : Édition directe des textes (`contentEditable`), réorganisation des blocs par flèches haut/bas, duplication, suppression et ajout rapide inter-blocs.
- **Mode Code** : Éditeur HTML et CSS inline avec coloration, numérotation des lignes, recalcul de taille et synchronisation immédiate vers le rendu visuel.
- **Panneau de Propriétés** : Typographies safe pour l'email (Arial, Helvetica, Georgia, etc.), marges, largeurs (600-650px), boutons pare-balles (Bulletproof buttons).

### 4. Moteur de Génération HTML Email Compatible Gmail & Outlook
- Tableaux imbriqués stricts (`role="presentation"`, `cellpadding="0"`, `cellspacing="0"`).
- Commentaires conditionnels Microsoft Outlook (`<!--[if (gte mso 9)|(IE)]>`).
- VML pour les boutons arrondis sous Outlook (`<v:roundrect>`).
- Media queries responsives pour mobiles (`@media only screen and (max-width: 620px)`).
- Respect du seuil critique Gmail de **102 Ko** pour éviter le tronquage `[Message tronqué]`.

### 5. Intégration Gmail Intégrale
- **Bouton Principal « Ouvrir dans Gmail »** :
  1. Copie automatique en **HTML Enrichi** dans le presse-papiers (`ClipboardItem` avec types `text/html` et `text/plain`).
  2. Ouverture immédiate de l'écran de rédaction Gmail (`mail.google.com/mail/?view=cm`) avec préremplissage du sujet et des destinataires.
  3. Un simple **Ctrl + V** (ou **Cmd + V**) colle le template complet avec 100% de ses styles, tableaux et images.
- **Générateur Google Apps Script** : Code `GmailApp.createDraft()` prêt à exécuter pour automatiser les campagnes ou intégrations backend.
- **Favori / Bookmarklet 1-Clic** : Injection directe du HTML dans toute fenêtre active de rédaction Gmail.

### 6. Persistance & Gestionnaire de Modèles
- Sauvegarde locale automatique via **IndexedDB** (avec secours LocalStorage).
- Fonctionnalités : Renommer, Dupliquer, Supprimer, Exporter en `.html`, et Exporter un package **ZIP** complet avec images découpées.

### 7. Module d'Aperçu & Audit de Compatibilité
- Aperçu Ordinateur (600-650px).
- Aperçu Smartphone iPhone (375px responsive).
- Simulation de la boîte de réception Gmail Web.
- **Audit de délivrabilité** : Contrôle des liens vides, analyse du poids du code, détection des balises interdites (`<script>`, `display: grid`), textes alternatifs `alt` manquants, score sur 100.

---

## 🛠️ Stack Technique
- **Frontend** : React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Stockage** : IndexedDB + LocalStorage (100% autonome, zéro compte obligatoire).
- **Backend** : Express, Vite middleware (`server.ts`), `@google/genai` (pour l'assistance de détection géométrique optionnelle).
