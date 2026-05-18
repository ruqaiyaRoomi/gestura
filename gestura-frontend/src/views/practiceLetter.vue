<template>
    <div class="translate">
    <header>
        <span class="close"  v-on:click="router.push('/letterDetails')"><i class="fa-solid fa-xmark"></i></span>
        <span class="heading">Practice</span>
        <span></span>
    </header>
    <!-- Camera and Guidance-->
    <div class="cameraInput">
        <video ref="videoRef" autoplay playsinline></video>
        <!-- User instruction -->
        <div class="tip">
            <i class="fa-solid fa-circle-info"></i>
            <span>Place your hand in the center of the screen</span>
        </div>
        <!-- Current practice letter info -->
        <div class="practiceInfo">
            <p class="practiceTitle">Practice Letter {{ letter }}</p>
            <p class="practiceTip">Tip: {{currentLetter.tip }}</p>
        </div>
        <!-- Success feedback overlay -->
         <Transition name="fade">
        <div class="overlay" v-if="showCheck">
            <i class="fa-solid fa-circle-check"></i>
        </div>
        </Transition>
    </div>

    <!-- Action Buttons -->
    <div class="actions">
        <button class="btn-done" v-on:click="handleDone"><span><i class="fa-solid fa-check"></i></span> Done</button>
        <button class="btn-retry" @click="startDetection"><span><i class="fa-solid fa-arrow-rotate-right"></i></span> Retry</button>
    </div>
    <NavBar />
    </div>


</template>

<script setup>
//Import core vue reactivity and lifecycle hooks
import {ref, onMounted, nextTick, onUnmounted, watch} from 'vue'
import {useRouter , useRoute} from 'vue-router'

// Import UI and data dependencies
import NavBar from '../components/navBar.vue';
import {alphabetData} from '../data/alphabetData.js';
import { practice } from '../composables/practice.js';
import { useUserStore } from '../stores/user.js';

//Router instances for navigation control
const router = useRouter()
const route = useRoute()


// Get selected letter from route parameter
const letter = route.params.letter
const currentLetter = alphabetData[letter] || { tip: ''}
const videoRef = ref(null)
const showCheck = ref(false)
const isSaving = ref(false)
const userStore = useUserStore()

const translationHistory = ref([])


// Custom composable handling ML gesture detection logic
const {startDetection, stopDetection, isMatch, detectedLabel, detectionConfidence} 
= practice(videoRef, letter)

// Watch for successful gesture match
watch(isMatch, async (val) => {
    if(!val) return
    if(showCheck.value) return
    if( detectedLabel.value !== letter) return
    if(detectionConfidence.value < 85) return

    // show success overlay
    showCheck.value = true

    // Stop camera + detection logic
    stopDetection()

    //Save progress to backend
    await markDone()

    // Move to next letter after short delay
    setTimeout(() => {
        goNextLetter()
    }, 1000)
    
})

// Save completed letter progress to backend
async function markDone() {
    if ( !userStore.user?._id) {
    return; }

    isSaving.value = true
    try {
        const response = await fetch('https://gestura-backend-production.up.railway.app/gestura/userStats', {

            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ 
                userId: userStore.user._id,
                module: 'ASL Alphabet',
                letter: letter
            }),
            
        })
        const result = await response.json()
        // Store locally if not already recorded
        if (letter && !translationHistory.value.includes(letter)) {
            translationHistory.value.unshift(letter)
        }
    }  catch (err) {
        console.error('Error saving letter')
     } finally {
        isSaving.value = false
     }
}

// Navigate to next letter
function goNextLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const index = letters.indexOf(letter)

    if(index < letters.length - 1) {
        const next = letters[index + 1]
        router.push(`/aslAlphabet/${next}`)
    } else {
        router.push('/aslAlphabet')
    }

}

//Start camera + ML processes when component mounts
onMounted( async () => {
  await nextTick()
  startDetection()
})

// Clean up camera + ML processes when leaving page
onUnmounted(() => stopDetection())

async function handleDone (){
    stopDetection()

    await markDone()

    setTimeout(()=> {
        router.push({
        path:`/practiceLetterResult/${letter}`,
        query: {
            correct:isMatch.value,
            confidence: detectionConfidence.value,
            detected: detectedLabel.value
        }
        })
    }, 500)
    
}


</script>

<style scoped>
   
    .translate{
        background-color: var(--bg-primary);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 20px 16px;
        box-sizing: border-box;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .heading {
        color: var(--text-primary);
        font-size: 18px;
    }

    .close {
        font-size: 20px;
        color: var(--text-dark);
    }

    .title {
        font-size: 20px;
        font-weight: 700;
        color: var(--text-dark);
    }
    .arrow {
        margin: 0 4px;
    }

    .cameraInput {
        position: relative;
        flex: 1;
        border: 1.5px solid var(--text-dark);
        border-radius: 18px;
        overflow: hidden;
        margin-bottom: 24px;
        background-color: var(--bg-primary);

        aspect-ratio: 3/4;
     
    }

    .cameraInput video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1);
    }


    .tip {
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px ;
        font-size: 15px;
        color: var(--text-dark);
    }

    .practiceInfo {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;   
    }

    .practiceTitle {
        font-size: 20px;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0 0 4px 0;
    }

    .practiceTip {
        font-size: 18px;
        color: var(--text-muted);
        margin: 0;
    }

    .actions {
        display: flex;
        gap: 12px;
        margin-bottom: 80px;
    }

    .actions button {
        flex: 1;
        height: 54px;
        border-radius: 14px;
        font-size: 16px;
        font-weight: 600;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .btn-done {
    
        background-color: var(--accent);
        color: var(--bg-card);
        border: none;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.08);
        
    }

     .btn-retry {
        background-color: transparent;
        color:  var(--accent);
        border: 2px solid var(--accent);
      
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 60px;
        color: #4CAF50;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    @media (min-width: 768px) {
        .translate{
            max-width: 480px;
            margin: 0 auto;
        }
    }

</style>