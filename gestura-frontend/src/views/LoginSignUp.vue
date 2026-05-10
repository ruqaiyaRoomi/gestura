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
  overflow: hidden;
}

.header {
  padding: 16px 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gestura {
  height: 32px;
  width: 32px;
}

.logo span {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
}

.top {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration {
  width: 95%;
  max-width: 420px;
  object-fit: contain;
  margin-top: 10px;
}

.wave {
  position: absolute;
  bottom: -3px;
  width: 100%;
}

.body {
  background-color: var(--bg-primary);
  padding: 30px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.createAccount {
  width: 100%;
  height: 56px;
  background-color: var(--accent);
  color: var(--bg-card);
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 8px 18px var(--accent-shadow);
  transition: 0.2s ease;
}

.createAccount:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.or {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.line {
  flex: 1;
  height: 1px;
  background-color: #ddd;
}

.login {
  width: 100%;
  height: 56px;
  background-color: transparent;
  color: var(--accent);
  border: 2px solid var(--accent);
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  transition: 0.2s ease;
}

.guest {
  margin: 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

.guest:hover {
  color: var(--text-muted);
}

@media (min-width: 768px) {
  .screen {
    max-width: 480px;
    margin: 0 auto;
  }
}
</style>
