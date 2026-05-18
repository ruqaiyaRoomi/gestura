<template>
  <div class="loginScreen">
    <div class="content">
      <div class="top">
        <!-- Gestura logo and title page-->
        <img class="logo" src="/images/gestura.png" />
        <h1>Login</h1>
      </div>

      <div class="form">
        <!--Email input field bound to reactive email ref-->
        <div class="input">
          <label for="">Email</label>
          <input type="email" placeholder="Enter Email" v-model="email" />
        </div>

        <div class="input">
          <!--Password input with toggle visibility functionality-->
          <label for="">Password</label>
          <div class="password">
            <!-- Dynamically switches between text and password type based on showPassword-->
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter Password"
              v-model="password"
            />
            <!-- Eye icon toggles password visibility on click-->
            <span class="eye" @click="togglePassword"
              ><i
                :class="showPassword ? 'fa-regular fa-eye' : 'fa-solid fa-eye-slash'"
              ></i>
            </span>
          </div>
        </div>
      </div>
      <!-- Triggers login function on click -->
      <button v-on:click="login()" :disabled="!isFormFilled">Login</button>
      <!-- Navigation link to sign up page for new users-->
      <p class="bottomText">
        Don't have an Account?
        <a v-on:click="router.push('/signup')" class="link">Sign Up!</a>
      </p>
    </div>
    <img class="wave" src="/images/wav2.png" />
  </div>

  <div class="modalOverlay" v-if="showErrorModal">
    <div class="modal">
      <div class="modalIcon">
        <i class="fa-solid fa-circle-exclamation"></i>
      </div>
      <h2>Incorrect Credentials</h2>
      <p>The email or password you entered is incorrect. Please try again.</p>
      <button class="tryAgainBtn" @click="showErrorModal = false">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
const router = useRouter();

// reactive ref for form inputs
const email = ref("");
const password = ref("");
const showErrorModal = ref(false);

// Access the Pinia user store to persist authenticated user data
const userStore = useUserStore();

// Controls whether password is visible or not
const showPassword = ref(false);

// Toggles the password visibility state
function togglePassword() {
  showPassword.value = !showPassword.value;
}

const isFormFilled = computed(() => {
  return email.value.trim().length > 0 && password.value.trim().length > 0;
});

async function login() {
  // Send POST request to backend login endpoint with user credentials
  try {
    const response = await fetch(
      "https://gestura-backend-production.up.railway.app/gestura/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      },
    );
    const data = await response.json();

    if (data.login) {
      // Store user data in Pinia store and redirect to home screen
      userStore.setUser(data);
      router.push("/index");
    } else {
      //Notify user if credentials are incorrect
      showErrorModal.value = true;
    }
  } catch (err) {
    // Handle network or server errors
    console.error("Login error:", err);
    showErrorModal.value = true;
  }
}
</script>

<style scoped>
.loginScreen {
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}


.content {
  width: 100%;
  min-height: 100vh;
  max-width: 520px;
  margin: 0 auto;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  position: relative;
  z-index: 1;
}

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
  margin-top: 70px;
}

.logo {
  height: 50px;
  width: 50px;
}

.top h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.input {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input:focus {
  outline: 2px solid var(--accent);
}

.password {
  position: relative;
  display: flex;
  align-items: center;
}

.password input {
  width: 100%;
  padding-right: 40px;
}

.eye {
  position: absolute;
  right: 14px;
  color: var(--text-muted);
}

input {
  height: 52px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 15px;
  background-color: var(--bg-card);
  color: var(--text-primary);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}

input:focus {
  outline: none;
  border-color: var(--accent);
  background-color: var(--bg-card);
}

label {
  font-size: 16px;
  color: var(--text-muted);
}

button {
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

button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

button:disabled {
  opacity: 0.5;
  transform: none;
}
.bottomText {
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}

.link {
  font-weight: 600;
  text-decoration: underline;
  color: var(--text-dark);
}

.wave {
   position: absolute;
  bottom: 0;
  left: 0;

  width: 100%;
  max-width: 100%;
  height: auto;

  display: block;
  z-index: 0;
}

.modalOverlay {
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

.modalIcon {
  font-size: 48px;
  color: #e05c5c;
  font-weight: 700;
}

.modal h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal p {
  font-size: 15px;
  color: var(--text-muted);
  margin: 0;
}

.tryAgainBtn {
  width: 100%;
  height: 50px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-card);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  box-shadow: var(--accent-shadow);
  transition: 0.2s ease;
}

@media (min-width: 768px) {
  .top {
    margin-top: 100px;
  }
}
</style>
