<template>
  <div class="editProfile">
     <Header />
    <div class="title">
      <span class="back" @click="router.back()"
        ><i class="fa-solid fa-arrow-left"></i
      ></span>
      <h1>Edit Profile</h1>
      <p class="subheading">Update your account details</p>
    </div>

    <div class="avatarSection">
      <div class="avatar">
        <i class="fa-solid fa-user"></i>
      </div>
    </div>

    <div class="form">
      <div class="row">
        <div class="input">
          <label>First Name</label>
          <input type="text" v-model="firstName" placeholder="First Name" />
        </div>

        <div class="input">
          <label>Last Name</label>
          <input type="text" v-model="lastName" placeholder="Last Name" />
        </div>
      </div>

      <div class="input">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Email" />
      </div>

      <button v-on:click="saveChanges" :disabled="!isFormFilled">
        Save Changes
      </button>
    </div>

    <div class="modalOverlay" v-if="showSuccessModal">
      <div class="modal">
        <div class="modalIcon">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2>Profile Updated</h2>
        <p>The email or password you entered is incorrect. Please try again.</p>
        <button class="doneBtn" @click="handleDone">Done</button>
      </div>
    </div>
    <NavBar />
  </div>
</template>

<script setup lang="ts">
import Header from "../components/header.vue";
import NavBar from "../components/navBar.vue";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../stores/user";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

// Reactive from state
const firstName = ref(userStore.user?.firstName || "");
const lastName = ref(userStore.user?.lastName || "");
const email = ref(userStore.user?.email || "");
const showSuccessModal = ref(false);


// Ensures all fields are filled before enabling submit
const isFormFilled = computed(() => {
  return (
    email.value.trim().length > 0 &&
    firstName.value.trim().length > 0 &&
    lastName.value.trim().length > 0
  );
});


// sends updated data to backend and update store
async function saveChanges() {
  try {
  
    const response = await fetch(`https://gestura-backend-production.up.railway.app/gestura/user/${userStore.user._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
        }),
      },
    );
    const data = await response.json();

    if (data.updated) {
      userStore.setUser({
        ...userStore.user,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      });
      showSuccessModal.value = true;
    }
  } catch (error) {
    console.error("Error updating profile", error);
  }
}
// Closes modal and redirects to profile page
function handleDone() {
  showSuccessModal.value = false;
  router.push("/profile");
}
</script>

<style scoped>
.editProfile {
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  padding: 0px 20px 120px;
}

.back {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 10px;
  display: inline-block;
}

.title {
  margin: 20px 0 30px;
}

.title h1 {
  font-size: 30px;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.subheading {
  color: var(--text-muted);
  font-size: 16px;
}

.avatarSection {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--text-muted);
  background: var(--bg-card);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.row .input {
  flex: 1;
  min-width: 0;
  width: 0;
}

.input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

label {
  font-size: 16px;
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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
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

.doneBtn {
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
</style>
