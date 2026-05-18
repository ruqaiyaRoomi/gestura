<template>
   <div class="navbar">
    <div class="nav-item">
        <!-- Home Button-->
        <button v-on:click="router.push('/index')" :class="{active: route.path === '/index'}">
            <i class="fa-solid fa-house"></i>
            <p class="label">Home</p>
        </button>
        
    </div>
    <div class="nav-item">
         <!-- translate Button-->
        <button v-on:click="router.push('/translate')" :class="{active: route.path === '/translate'}" >
            <i class="fa-solid fa-language"></i>
            <p class="label">Translate</p>
        </button>
    </div>
    <div class="nav-item">
         <!-- Learn Button-->
        <button v-on:click="router.push('/learn')" :class="{active: route.path === '/learn'}">
            <i class="fa-solid fa-book-open"></i>
            <p class="label">Learn</p>
        </button>
      
    </div>
    <div class="nav-item">
         <!-- Profile Button-->
        <button v-on:click="profileView" :class="{active: route.path === '/profile'}">
        <i class="fa-solid fa-user"></i>
        <p class="label">Profile</p>
        </button>
    </div>

    
   </div>
</template>

<script setup>
    import { useRouter, useRoute } from 'vue-router'
    import { triggerGuestOverlay } from '../stores/guest';
    import { useUserStore } from "../stores/user";
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()

// redirect to profile or show guest overlay if not authenticated
function profileView(){ 
    if (!userStore.user?._id) {
        triggerGuestOverlay()
        return
    } else {
         router.push('/profile')
    }
   
}


</script>

<style scoped>
    .navbar{
        position: sticky;
        bottom: 0;
        margin-top: auto;
        width: 100%;
        flex-shrink: 0;

        display: flex;
        justify-content: space-around;
        align-items: center;
        
        background: var(--bg-primary);
        padding: 10px 0;

        border-top: 1px solid var(--text-muted);
        z-index: 1000;   

        box-shadow: 0 -3px 12px rgba(0, 0, 0 , 0.08);
        overflow: hidden;

        margin: 0;
        box-sizing: border-box;
    }


    .nav-item i {
        font-size: 20px;
        margin-bottom: 4px;
    }

    .nav-item p {
        margin: 0;
    }

   .nav-item button.active {
        color: var(--accent) !important;
        transform: translateY(-1px) !important;

    }

    .nav-item button {
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        color: var(--text-muted);

        background-color: transparent;
        border: none;
        transition: 0.2s ease;
    }
</style>