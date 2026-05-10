<template>
    <!-- Only render if valid letter exist -->
    <div v-if="currentLetter">
    <Header/>
    <!-- letter detail screen -->
    <div class="letterDetail">
         <Transition>
            <div v-if="showStatus" class="statusBanner">
                <i class="fa-solid fa-circle-info"></i>
                <span>{{ statusMessage }}</span>
            </div>
        </Transition>
        
        <div class="header">
            <span class="back" v-on:click="router.push('/learn')"><i class="fa-solid fa-xmark"></i></span>
            <span class="title">ASL Alphabet</span>
            <span></span>
        </div>
        <!-- Letter display -->
        <div class="card">
            <img :src="currentLetter.image" alt="" class="letterImage">
            <p class="letterLabel">{{letter}}</p>
        </div>
        <!-- Description -->
        <p class="description">
            {{ currentLetter.description }}
        </p>
       
        <!-- Practice -->
        <div class="tryIt">
            <p class="tryTitle">Try it yourself</p>
            <p class="tip"> {{ currentLetter.tip }}</p>
            <button class="button" v-on:click="router.push(`/practice/${letter}`)">
                Open Camera <i class="fa-solid fa-camera"></i>
            </button>

            <button
                class="markDoneButton"
                :class="{ completed: isCompleted }"
                @click="markDone"
                :disabled="isSaving">

                <span v-if="isSaving">Saving...</span>

                <span v-else-if="isCompleted">
                    Completed <i class="fa-solid fa-check"></i>
                </span>

                <span v-else>
                    Mark as Done
                </span>
            </button>
        </div>
    </div>

    <NavBar />
    </div>

    <div v-else>

        letter not found
    </div>
</template>

<script setup>
// imports
import { useRoute, useRouter } from 'vue-router';
import Header from '../components/header.vue';
import NavBar from '../components/navBar.vue';
import {alphabetData} from '../data/alphabetData.js';
import { useUserStore } from '../stores/user.js';
import { ref, computed } from 'vue';

const userStore = useUserStore()
const route = useRoute();
const router = useRouter();


// Track API request state 
const isSaving = ref(false)
const isCompleted = ref(false)
const showStatus = ref(false)
const statusMessage = ref('')
// Get letter from route and map to dataset
const letter = computed(() => route.params.letter)
const currentLetter = computed(() => alphabetData[letter.value])



function showStatusMessage(message) {
    statusMessage.value = message
    showStatus.value = true

    setTimeout(() => {
        showStatus.value = false
    }, 2200)
}


// Save progress for current letter
async function markDone() {
    if ( !userStore.user?._id) {
        showStatusMessage('Please log in to save your progress.')
        return; 
}

    isSaving.value = true
    try {
        const response = await fetch('https://gestura-backend-production.up.railway.app/gestura/userStats', {

            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ 
                userId: userStore.user._id,
                module: 'ASL Alphabet',
                letter: letter.value
            }),
            
        })
         const data = await response.json()
        // error handling
     if( data.saved) {
        isCompleted.value = true
        showStatusMessage('Progress saved successfully')
     } else{
        showStatusMessage('Could not save progress. Please try again')
     }
    }  catch (err) {
        console.error('Error saving letter')
     } finally {
        isSaving.value = false;
     }
}


console.log("letter:", letter)
console.log("currentLetter:", currentLetter)



</script>

<style scoped>
   .letterDetail {
    background: var( --bg-primary);
    min-height: 100vh;
    padding: 20px 16px 100px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;
   }

   .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
   }

   .back{
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
    flex-direction:column ;
    align-items: center;
    padding: 24px;
    box-shadow: var(--shadow-card);
    
   }

   .letterImage{
    width: 180px;
    height: 180px;
    object-fit: contain;
   }

   .letterLabel{
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

   .tryIt{
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

   .tip{
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

   @media (min-width: 768px) {
        .letterDetail {
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

.markDoneButton.completed {
    background-color: var(--accent) !important;
    color: white !important;
    border: none !important;
    box-shadow: 0 8px 18px var(--accent-shadow) !important;
}

</style>