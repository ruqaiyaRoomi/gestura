<template>
    <div class="translate">
    <header>
        <span class="close"  v-on:click="router.push(`/commonWords/${word}`)"><i class="fa-solid fa-xmark"></i></span>
        <span class="heading">Sign Letter {{ currentLetter }}</span>
        <span></span>
    </header>

    <div class="cameraInput">
        <video ref="videoRef" autoplay playsinline></video>

        <div class="progress">
            {{ index + 1 }} / {{ letters.length }}
        </div>
       <Transition name="fade">
            <div class="overlay" v-if="showCheck">
            <i class="fa-solid fa-circle-check"></i>
            </div>
       </Transition>
        
    </div>

    <div class="actions">
        <button class="btn-done" @click="handleNext">
            <span><i class="fa-solid fa-check"></i></span>Next</button>
        <button class="btn-retry" @click="retry"><span><i class="fa-solid fa-arrow-rotate-right"></i></span> Retry</button>
    </div>
    <NavBar />
    </div>


</template>

<script setup>
import {ref, onMounted, watch, nextTick, onUnmounted} from 'vue'
import {useRouter , useRoute} from 'vue-router'
import { practice } from '../composables/practice.js';
import NavBar from '../components/navBar.vue';
import { useUserStore } from '../stores/user.js';


const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

const word = route.params.word
const letters = (word || '').toUpperCase().replace(/\s/g,'').split("")
const index = ref(0)

const currentLetter = ref(letters[0])

const videoRef = ref(null)
const showCheck = ref(false)

const { startDetection, stopDetection, isMatch, detectionConfidence, nextLetter, detectedLabel} 
= practice(videoRef, currentLetter)

// start detection once camera is ready
onMounted( async () => {
    await nextTick()
    startDetection()
})
// Clean ML loop when leaving page

onUnmounted(() => {
    stopDetection()
})
// Detect correct sign match and validate confidence threshold
watch(isMatch ,(val) => {
    if(!val) return
    if(showCheck.value) return
    // prevent duplicate triggers or wrong letter matches
    if(detectedLabel.value !== currentLetter.value) return
    if(detectionConfidence.value < 85) return
    // Show success feedback before moving to next letter
    showCheck.value = true
    
    setTimeout(() => {
        showCheck.value = false
        // Advance through letters or finish word
        if(index.value < letters.length - 1){
            index.value++

            currentLetter.value = letters[index.value]
            nextLetter()
        } else{
            handleNext()
        }
    }, 400);
})

// reset practice session to first letter 
function retry() {
    index.value = 0
    currentLetter.value = letters[0]
    showCheck.value = false
    nextLetter()
    startDetection()
}

// move manually to next letter or complete word flow
async function handleNext(){
    if(index.value < letters.length - 1) {
        index.value++
        currentLetter.value = letters[index.value]
        showCheck.value = false
        nextLetter()
    } else {
        stopDetection()
        await markDone()
        router.push(`/commonWords`)
    }
}
// save completed word progress to backend
async function markDone() {
    if ( !userStore.user?._id) 
    return
    try {
        const response = await fetch('https://gestura-backend-production.up.railway.app/gestura/userStats', {

            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ 
                userId: userStore.user._id,
                module: 'Common Words',
                letter: word
            }),
            
        })
    }  catch (err) {
        console.error('Error saving word')
     } 
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

    .progress {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(0, 0, 0, 0.5);
        color: var(--bg-card);
        border-radius: 20px;
        font-size: 13px;
        padding: 4px 20px;     
    }

    .overlay {
        position: absolute;
        inset: 0;
        background-color: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 18px;
    }

    .overlay i {
        font-size: 100px;
        color: var(--bg-card);
    }

    .fade-enter-active {
        transition: opacity 0.2s ease;
    }

    .fade-leave-active {
        transition: opacity 0.6s ease;
    }

    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }

    @media (min-width: 768px) {
        .translate{
            max-width: 480px;
            margin: 0 auto;
        }
    }


</style>