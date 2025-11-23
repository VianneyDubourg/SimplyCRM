# SimplyCRM

Application CRM style WhatsApp avec envoi d'emails SMTP direct.

## 🚀 Déploiement Vercel

1. Importez ce dépôt sur Vercel
2. Configurez les variables d'environnement :
   - `SMTP_PASSWORD` - Mot de passe SMTP
   - `SMTP_HOST` - mail.stelneo.com
   - `SMTP_PORT` - 587
   - `SMTP_USER` - vianney@stelneo.com
   - `SMTP_FROM_NAME` - Vianney Stelneo
3. Deploy !

## 📁 Structure

- `simplycrm.html` - Application complète (frontend + CSS + JS)
- `api/` - Fonctions serverless Vercel
- `vercel.json` - Configuration Vercel
- `package.json` - Dépendances

## 💻 Développement local

```bash
npm install
npm start
```

Ouvrez http://localhost:3000

