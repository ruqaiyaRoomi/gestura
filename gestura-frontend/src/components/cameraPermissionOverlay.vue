<template>
  <div v-if="showCameraError" class="overlay">
    <div class="modal">
        <span class="close" v-on:click="router.back()"><i class="fa-solid fa-xmark"></i></span>
      <h2 class="heading">Camera Access Blocked</h2>

      <p class="description">
        Gestura needs camera access to recognize your signs.
        Please allow camera permissions and try again.
      </p>

      <button @click="$emit('retry')">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
const router = useRouter()

defineProps({
  showCameraError: {
    type: Boolean,
    default: false
  }
})



defineEmits(['retry', 'close'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: var(--bg-card);
  padding: 28px 22px;
  border-radius: var(--radius-card);
  width: 90%;
  max-width: 360px;
  text-align: center;
  box-shadow: var(--shadow-card);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.heading {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.close {
        font-size: 20px;
        color: var(--text-dark);
    }

.description {
  font-size: 16px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.35;
}

.modal button {
  width: 100%;
  height: 50px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-card);
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  box-shadow: var(--accent-shadow);
  transition: 0.2s ease;
}

.modal button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.modal .closeBtn {
  background-color: var(--bg-secondary);
  color: var(--text-muted);
  box-shadow: none;
}
</style>