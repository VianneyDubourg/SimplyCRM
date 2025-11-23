// Fonction serverless Vercel pour tester la connexion SMTP
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Autoriser CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
    }

    try {
        // Configuration SMTP depuis les variables d'environnement Vercel
        const smtpConfig = {
            host: process.env.SMTP_HOST || 'mail.stelneo.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER || 'vianney@stelneo.com',
                pass: process.env.SMTP_PASSWORD
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

        // Tester la connexion
        await transporter.verify();

        return res.status(200).json({
            success: true,
            message: 'Connexion SMTP OK',
            config: {
                host: smtpConfig.host,
                port: smtpConfig.port,
                user: smtpConfig.auth.user
            }
        });

    } catch (error) {
        console.error('❌ Erreur de connexion SMTP:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Erreur de connexion SMTP'
        });
    }
};

