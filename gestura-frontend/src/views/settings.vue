<template>
    <div class="settingsScreen">
        <Header />
        <div class="title">
            <span class="back" @click="router.back()"><i class="fa-solid fa-arrow-left"></i></span>
            <h1>Settings</h1>
            <p class="subheading">
                Manage your account and preferences
            </p>
        </div>
    

    <div class="bodyContainer">
        <!-- Account Section -->
        <div class="sectionLabel">Account</div>
        <div class="settingsCard" @click="router.push('/editProfile')">
            <div class="settingsLeft">
                <div class="iconContainer">
                    <span class="icon" @click="router.push('/editProfile')"><i class="fa-solid fa-user"></i></span>
                </div>
                <span class="settingsText">Edit Profile</span>
            </div>
            <span class="arrow" @click="router.push('/editProfile')"><i class="fa-solid fa-arrow-right-long"></i></span>
        </div>
        
           <!-- delete account -->
        <div class="settingsCard" @click="confirmDelete">
            <div class="settingsLeft">
                <div class="iconContainer red"><span class="icon"><i class="fa-solid fa-trash"></i></span></div>
                <span class="settingsText">Delete Account</span>
            </div>
            <span class="arrow"><i class="fa-solid fa-arrow-right-long"></i></span>
        </div>
           <!-- Accessibility Section -->
    <div class="sectionLabel">Accessibility</div>

       <!-- Dark Mode -->
        <div class="settingsCard">
            <div class="settingsLeft">
                <div class="iconContainer">
                    <span class="icon"><i class="fa-solid fa-moon"></i></span>
                </div>
                <span class="settingsText">Dark Mode</span>
            </div>
            <label class="toggle">
                <input type="checkbox" v-model="darkMode" @change="toggleDarkMode">
                <span class="slider"></span>
            </label>
        </div>
    
           <!-- Large Text -->
    <div class="settingsCard">
        <div class="settingsLeft">
            <div class="iconContainer"><span class="icon"><i class="fa-solid fa-text-height"></i></span></div>
            <span class="settingsText">Large Text</span>
        </div>

        <label class="toggle"><input type="checkbox" v-model="largeText" @change="toggleFontSize">
        <span class="slider"></span>
        </label>
    </div>

    <button class="logoutBtn" @click="handleLogout">Logout <i class="fa-solid fa-right-from-bracket"></i>
    </button>
</div>
<!-- Confirm delete modal -->
    <div class="modalOverlay" v-if="showDeleteModal">
        <div class="modal">
            <h2>Delete Account</h2>
            <p>Are you sure? This action cannot be undone.</p>
            <div class="modalButtons">
                <button class="cancelBtn" @click="showDeleteModal = false">Cancel</button>
                <button class="deleteBtn" @click="handleDelete">Delete</button>
            </div>
        </div>
    </div>
 </div>
</template>

<script setup>
import { ref , onMounted, watch} from 'vue';
import { useRouter } from 'vue-router';
import Header from '../components/header.vue';
import { useUserStore } from '../stores/user';
import { triggerGuestOverlay } from '../stores/guest';


const router = useRouter()
const userStore = useUserStore()
// UI
const showDeleteModal = ref(false)
const darkMode = ref(false)
const largeText = ref(false)


// Theme toggle
function toggleDarkMode( ) {
    document.documentElement.classList.toggle('dark', darkMode.value)
    localStorage.setItem('darkMode', darkMode.value)
}

// font size toggle
function toggleFontSize() {
    document.documentElement.style.fontSize = largeText.value ? '18px' : '16px'
    localStorage.setItem('largeText', largeText.value)
}

// Delete modal trigger
function confirmDelete() {
    showDeleteModal.value = true
}


// Delete account
async function handleDelete() {
    try {
        await fetch(`https://gestura-backend-production.up.railway.app/gestura/user/${userStore.user._id}`, {
            method:'DELETE'
        })
        
        userStore.logout()
        router.push('/login')
    } catch (err) {
        console.error('Error deleting account', err)
    }

}


// Logout flow
function handleLogout() {
    if(!userStore.user?._id) {
        triggerGuestOverlay()
        return
    }
    userStore.logout()
    router.push('/login')
}

// load saved preferences
onMounted (() => {
    const savedTheme = localStorage.getItem('darkMode')

    if (savedTheme === 'true') {
        darkMode.value = true
        document.documentElement.classList.add('dark')
    } else {
        darkMode.value = false
        document.documentElement.classList.remove('dark')
    }

    const changedFont = localStorage.getItem('largeText')

    if(changedFont === 'true') {
        largeText.value = true
        document.documentElement.classList.add('largeText')
    } else {
        largeText.value = false
        document.documentElement.classList.remove('largeText')
    }
})
</script>

<style scoped>
.settingsScreen {
    height: 100vh;
  max-height: 100vh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.back {
    font-size: 20px;
    color: var(--text-primary);
    margin-bottom:10px ;
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

.bodyContainer{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.subheading {
    color: var(--text-muted);
    font-size: 16px;
}

.sectionLabel {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0;
    margin-top: 10px;
    margin-bottom: 2px ;
}

.settingsCard {
    background-color: var(--bg-card);
    padding: 16px 20px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.settingsLeft {
    display: flex;
    align-items: center;
    gap: 14px;
}

.settingsText{
    font-size: 16px;
    font-weight: 500 ;
    color: var(--text-primary);
}

.iconContainer {
    background-color: var(--accent);
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.iconContainer.red{
    background-color: #e05c5c;
}

.icon {
    color: white;
    font-size: 18px;
}

.arrow {
    color: var(--text-dark);
    font-size: 16px;
}


.toggle {
   position: relative;
   display: inline-block;
   width: 48px;
   height: 26px;
}

.toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius:26px ;
    transition: 0.3s;
}

.slider::before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50% ;
    transition: 0.3s;

}

input:checked + .slider {
    background-color: var(--accent) ;
}

input:checked + .slider::before {
    transform: translateX(22px);
}

.logoutBtn {
    width: 100%;
    height: 56px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 8px 18px var(--accent-shadow);
}

.modalOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal {
    background-color: var(--bg-card);
    padding: 20px 24px;
    border-radius: 22px;
    width: 85%;
    max-width: 360px;
    text-align: center;
}

.modal h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 10px;
}

.modal p {
    font-size: 15px;
    color: var(--text-muted);
    margin: 0 0 24px;
}


.modalButtons{
    display: flex;
    gap: 12px;
}


.cancelBtn {
    flex: 1;
    height: 48px;
    background: #e0e0e0;
    color: #333;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    margin-top:0 ;
    box-shadow: none;

}



.deleteBtn{
    flex: 1;
    height: 48px;
    background: #e05c5c;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin-top:0 ;
    box-shadow: none;
}

</style>