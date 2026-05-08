<template>
    <div v-if="showCameraError" class="camera-alert">
        <div class="alert-content">
            <h3>Camera Access Blocked</h3>
            <p>
                Gestura needs camera access to recognize your signs.
                Please allow camera permissions and try again
            </p>
        </div>

        <button v-on:click="$emit('retry')">Try Again</button>
    </div>
</template>

<script setup>
defineProps({
    showCameraError: {
        type: Boolean,
        default: false
    }
})

defineEmits(['retry'])

</script>

<style scoped>
.camera-alert {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid rgba(255, 80, 80, 0.35);
  border-radius: var(--radius-card);
  padding: 14px;
  margin: 12px 0;
  box-shadow: var(--shadow-card);

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-content h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.alert-content p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.camera-alert button {
  width: 100%;
  height: 44px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-card);
  font-size: 15px;
  font-weight: 600;
  box-shadow: var(--accent-shadow);
  transition: 0.2s ease;
}

.camera-alert button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}
</style>