<template>
    
    <div class="translate">
    <header>
        <span class="close"  v-on:click="exit"><i class="fa-solid fa-xmark"></i></span>
        <span class="subheading">Sign <span class="arrow"><i class="fa-solid fa-arrow-right-long"></i></span> Text</span>
        <span></span>
    </header>

    <cameraPermissionOverlay :show="cameraError" @retry="startCameraDetection"/>
    <div class="cameraInput">
        <video ref="videoRef" autoplay playsinline v-show="!frozen"></video>
        <canvas ref="snapShot" v-show="frozen" class="snapshot"></canvas>
        <div class="predicted" :class="{frozen: frozen}">
            <p class="translatedText">{{ predictedText }}</p>
        </div>
    </div>

    <div class="actions">
        <button class="btn-done" v-on:click="handleDone"><span><i class="fa-solid fa-check"></i></span> Done</button>
        <button class="btn-retry" v-on:click="retry"><span><i class="fa-solid fa-arrow-rotate-right"></i></span> Retry</button>
    </div>
    <NavBar />
    </div>


</template>

<script setup>
import {ref, onMounted, nextTick, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'

import NavBar from '../components/navBar.vue';
import { useGesture } from '../composables/useGesture';
import cameraPermissionOverlay from '../components/cameraPermissionOverlay.vue';

const cameraError = ref(false)

const router = useRouter()
const videoRef = ref(null)

// UI state: freezes camera + switches to snapshot view
const frozen = ref(false)
const snapShot = ref(null)

// ML gesture detection hook
const {predictedText, startDetection, stopDetection} = useGesture(videoRef)

onMounted( async () => {
    await nextTick()
    startCameraDetection()
    window.addEventListener('beforeunload', stopDetection)
})

onUnmounted(async () => {
    await nextTick()
    await stopDetection()
    window.removeEventListener('beforeunload', stopDetection)
})

// Captures current video frame into canvas for static preview
function captureFrame() {
    const video = videoRef.value
    const canvas = snapShot.value

    if (!video || video.videoWidth === 0 ) {
        console.log('video not ready')
        return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0,0, canvas.width, canvas.height)
}


// locks current prediction and freezes camera feed
function handleDone (){
    frozen.value = true
    captureFrame()
    stopDetection()

}

// Exit screen safely and stop ML processing
function exit() {
    stopDetection()
    router.back()
}


// Reset everything and restart detection loop
async function retry(){
    frozen.value = false
    predictedText.value = ''

    stopDetection()
    await new Promise(resolve => setTimeout(resolve, 300))
    try {
        const ctx = snapShot.value?.getContext('2d')
        if(ctx && snapShot.value) {
    ctx?.clearRect(0,0,snapShot.value.width, snapShot.value.handleDone)
        }} catch(err) {
            console.warn('Canvas clear failed:', err)
        }
    
    startDetection()
}


async function startCameraDetection() {
    try {
        cameraError.value = false
        await startDetection()

    } catch (err) {
        cameraError.value = true
        console.warn('Camera permission or detection failed: ', err)

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

    .subheading {
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
        flex: 1;
        border: 1.5px solid var(--text-dark);
        border-radius: 18px;
        overflow: hidden;
        margin-bottom: 24px;
        background-color: var(--bg-primary);
        position: relative;
        aspect-ratio: 3/4;
     
    }

    .cameraInput video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1);
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
        color: var(--accent);
        border: 2px solid var(--accent);
      
    }

    .predicted {
        position: absolute;
        bottom: 0;
        left: 0;
        right:0 ;
        background-color: rgba(233, 150, 39, 0.4);
        border-radius:18px ;
        padding: 24px;
        margin: 16px;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        font-size: 30px;
        letter-spacing: 5px;
    }

    .predicted.frozen {
        background-color: rgba(233, 150, 39, 0.5);
        font-weight: 900;
        font-size:34px ;
        letter-spacing: 5px;
    }


    .cameraInput canvas.snapshot {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 18px;
        opacity: 0.85;
        transform: scaleX(-1);
    }

    @media (min-width: 768px) {
        .translate {
            max-width: 480px;
            margin: 0 auto;
        }
    }

</style>