// Fonction serverless Vercel pour envoyer des emails
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Toujours définir les en-têtes JSON en premier
    res.setHeader('Content-Type', 'application/json');
    
    // Autoriser CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).json({ success: true });
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
    }

    try {
        const { to, subject, message, replyTo } = req.body;

        // Validation (subject peut être vide)
        if (!to || !message) {
            return res.status(400).json({
                success: false,
                error: 'Paramètres manquants: to et message requis'
            });
        }
        
        // Utiliser un objet par défaut si vide
        const emailSubject = subject && subject.trim() !== '' ? subject.trim() : '(Sans objet)';

        // Configuration SMTP depuis les variables d'environnement Vercel
        const smtpConfig = {
            host: process.env.SMTP_HOST || 'mail.stelneo.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465', // true pour port 465, false pour 587
            auth: {
                user: process.env.SMTP_USER || 'vianney@stelneo.com',
                pass: process.env.SMTP_PASSWORD // ⚠️ À configurer dans Vercel
            },
            tls: {
                rejectUnauthorized: false
            }
        };

        // Vérifier que le mot de passe est configuré
        if (!smtpConfig.auth.pass) {
            return res.status(500).json({
                success: false,
                error: 'SMTP_PASSWORD non configuré. Configurez-le dans les variables d\'environnement Vercel.'
            });
        }

        // Créer le transporteur
        const transporter = nodemailer.createTransport(smtpConfig);

        // Configuration de l'email
        const mailOptions = {
            from: {
                name: process.env.SMTP_FROM_NAME || 'Vianney Stelneo',
                address: smtpConfig.auth.user
            },
            to: to,
            subject: emailSubject,
            text: message,
            html: message.replace(/\n/g, '<br>'),
            replyTo: replyTo || smtpConfig.auth.user
        };

        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email envoyé:', info.messageId);
        console.log('   À:', to);
        console.log('   Sujet:', subject);

        return res.status(200).json({
            success: true,
            messageId: info.messageId,
            message: 'Email envoyé avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de l\'envoi de l\'email'
        });
    }
};

