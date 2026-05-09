<template>
    <Transition name="toast-slide">
        <div v-if="show && message" class="recognition-toast">
            <i class="fa-solid fa-circle-info"></i>
            <span>{{ message }}</span>
        </div>
    </Transition>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        default: ''
    },

    message: {
        type: Boolean,
        default: ''
    }
})
</script>

<style scoped>
.recognition-toast {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;

  width: calc(100% - 32px);
  max-width: 360px;
  min-height: 42px;

  background: rgba(255, 255, 255, 0.92);
  color: var(--text-primary);
  border: 1px solid rgba(233, 150, 39, 0.35);
  border-radius: 999px;
  padding: 10px 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  text-align: center;
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(8px);
}

.recognition-toast i {
  color: var(--accent);
  font-size: 14px;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.25s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>