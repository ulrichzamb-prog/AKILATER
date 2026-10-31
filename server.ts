import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Email Template Studio' });
  });

  // Server-side Gemini layout analysis (strictly respects no-drawing rule for original logos/signatures)
  app.post('/api/analyze-template', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({
          success: false,
          fallback: true,
          message: 'Clé GEMINI_API_KEY non détectée. Passage automatique au moteur d\'analyse géométrique local.',
        });
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Tu es un expert mondial en intégration d'emails HTML (Gmail, Outlook, Apple Mail).
Analyse la structure visuelle de ce document pour concevoir un template d'email HTML responsive professionnel.

RÈGLE ABSOLUE & FONDAMENTALE :
NE JAMAIS recréer, modifier, déformer ou redessiner les éléments graphiques originaux (logos, signatures manuscrites, sceaux, cachets, timbres, pictogrammes officiels).
Tu dois uniquement :
1. Extraire la palette de couleurs réelles (fond global, fond conteneur, texte principal, couleur d'accent).
2. Détecter les textes (titre principal, sous-titres, corps de texte, libellés de boutons) sans les altérer.
3. Détecter les coordonnées des éléments graphiques originaux (logos, signatures, cachets, illustrations) sous forme de boîte [ymin, xmin, ymax, xmax] normalisée de 0 à 1000 pour permettre à l'utilisateur de les découper fidèlement depuis le document source.
4. Structurer l'email en une suite de blocs adaptés au format HTML Email pour Gmail (largeur max 600-650px).

Réponds UNIQUEMENT en JSON valide avec la structure suivante :
{
  "subject": "Objet suggéré pour l'email",
  "preheader": "Court texte d'aperçu d'en-tête (pré-header)",
  "palette": {
    "backgroundColor": "#f8fafc",
    "containerColor": "#ffffff",
    "primaryColor": "#1e40af",
    "textColor": "#1e293b",
    "accentColor": "#2563eb"
  },
  "detectedGraphicElements": [
    {
      "label": "Logo entreprise" | "Signature originale" | "Cachet / Sceau" | "Icône" | "Bannière",
      "box2d": [ymin, xmin, ymax, xmax],
      "description": "Description concise de l'élément à découper"
    }
  ],
  "blocks": [
    {
      "type": "header" | "hero_image" | "text" | "two_column" | "button" | "divider" | "signature" | "footer",
      "title": "Titre détecté",
      "content": "Paragraphe détecté",
      "buttonText": "Action détectée",
      "align": "left" | "center" | "right"
    }
  ]
}`;

      const rawBase64 = (imageBase64 || '').replace(/^data:[^;]+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/png',
                  data: rawBase64,
                },
              },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      let parsed = {};
      try {
        parsed = JSON.parse(responseText);
      } catch (pErr) {
        console.error('Erreur de parsing JSON Gemini:', pErr);
      }

      return res.json({ success: true, analysis: parsed });
    } catch (err: any) {
      console.error('Erreur API /api/analyze-template:', err);
      return res.status(200).json({ success: false, error: err.message, fallback: true });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Email Template Studio] Serveur prêt sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
