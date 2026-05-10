<template>
  <div class="screen">
    <div class="header">
      <div class="logo">
        <img class="gestura" src="/images/gestura.png" />
        <span>Gestura</span>
      </div>
    </div>

    <div class="top">
      <img class="illustration" src="/images/loginSignUp.png" />
      <img class="wave" src="/images/wave1.png" />
    </div>

    <div class="body">
      <div class="title">Welcome to Gestura</div>
      <div class="buttons">
        <button class="createAccount" v-on:click="router.push('/signup')">
          Create an Account
        </button>
        <div class="or">
          <span class="line"></span>
          <p>or</p>
          <span class="line"></span>
        </div>
        <button class="login" v-on:click="router.push('/login')">Login</button>
        <p class="guest" @click="continueAsGuest">Continue as Guest</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// imports
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showGuestMessage = ref(false);

// handles guest login flow
function continueAsGuest() {
  // stores guest flag locally
  localStorage.setItem("isGuest", JSON.stringify(true));

  // trigger feedback state
  showGuestMessage.value = true;

  // redirect after delay
  setTimeout(() => {
    router.push("/index");
  }, 1500);
}
</script>
<style scoped>
.screen {
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.letterDetail {
  background: var(--bg-primary);
  min-height: 100vh;
  padding: 20px 16px 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back {
  font-size: 20px;
  color: var(--text-primary);
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.card {
  background: var(--bg-card);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  box-shadow: var(--shadow-card);
}

.letterImage {
  width: 180px;
  height: 180px;
  object-fit: contain;
}

.letterLabel {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 12px 0 0;
}

.description {
  font-size: 18px;
  color: var(--text-primary);
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.tryIt {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 15px;
}

.tryTitle {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.tip {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.tryIt button {
  width: 100%;
  height: 56px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 8px 18px var(--accent-shadow);
  transition: 0.2s ease;
  margin-top: 20px;
  justify-content: center;
}

.markDoneButton {
  background: transparent !important;
  color: var(--accent);
  border: 1.5px solid var(--accent) !important;
  box-shadow: none !important;
}

.markDoneButton.completed {
  background-color: var(--accent) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 8px 18px var(--accent-shadow) !important;
}

.statusBanner {
  width: 100%;
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1.5px solid rgba(233, 150, 39, 0.45);
  border-radius: 999px;
  padding: 12px 16px;
  box-shadow: var(--shadow-card);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.statusBanner i {
  color: var(--accent);
}

.status-slide-enter-active,
.status-slide-leave-active {
  transition: all 0.25s ease;
}

.status-slide-enter-from,
.status-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 768px) {
  .screen {
    max-width: 480px;
    margin: 0 auto;
  }

  .letterImage {
    width: 220px;
    height: 220px;
  }

  .letterLabel {
    font-size: 56px;
  }
}
</style>

