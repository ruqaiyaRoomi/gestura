<template>
    <div class="quiz">
        <Header/>
         <div class="header">
            <span class="back" v-on:click="router.back()"><i class="fa-solid fa-arrow-left"></i></span>
            <span class="title">Quiz</span>
            <span></span>
        </div>
        <!-- Progress indicator -->
        <div class="progress">
            <span>Question {{ current }} of  {{ total }}</span>
            <span>{{ Math.round((current/total) * 100) }}% Complete</span>
        </div>

        <div class="progressBar">
            <div class="fill" :style="{width: `${(current / total) * 100}%`}"></div>
        </div>
        <!-- Question and camera  -->
        <div  class="questionBox">
            <div class="timerRow">
                 <span class="question">{{ current }}. Sign the Letter  {{ currentLetter }}</span>
                 <span class="timer" :class="{urgent: timeLeft <=3}">{{ timeLeft }}s</span>
            </div>

            <!-- time bar -->
            <div class="timeBar">
                <div class="timerFill" :style="{width: `${(timeLeft / timeLimit) * 100}%`}"></div>
            </div>

            <!-- camera feed -->
            <div class="cameraArea">
            <div class="cameraWrapper">
                <video ref="videoRef" autoplay playsinline></video>
                <!-- correct answers only -->
                    <Transition name="fade">
                        <div class="overlay" v-if="showCheck">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                    </Transition>
                <!-- Countdown before each question -->
                <div  v-if="!isReady" class="prepOverlay">
                    <p>Get Ready...</p>
                    <h1>{{ prepTime }}</h1>
                </div>
            </div>
                
            </div>
        </div>
        <!-- Progress indicator -->
       <div class="buttonActions">
         <p class="skip" v-on:click="skip">Skip</p>
         <button class="doneBtn" @click="correct">✓ Submit</button>
       </div>
    </div>
    <NavBar/>
</template>

<script setup>
import { ref , onMounted, nextTick, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { practice } from '../composables/practice';
import Header from '../components/header.vue';
import NavBar from '../components/navBar.vue';


const router = useRouter();
const route = useRoute();

const total = parseInt(route.params.total)
const current = ref(1)
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const shuffle = [...letters].sort(() => Math.random() -0.5).slice(0, total)
const currentLetter = ref(shuffle[0])
const videoRef =  ref(null)
const results = ref([])
const startTime = Date.now()
const correctCount = ref(0)



const showCheck = ref(false)
const timeLimit = 10
const timeLeft = ref(timeLimit)
let countDownId = null

const isReady = ref(false)
const prepTime = ref(3)
const detectionActive = ref(false)

const {isMatch, detectedLabel, startDetection, stopDetection, nextLetter, detectionConfidence} = practice(videoRef, currentLetter, detectionActive)


onMounted (async () => {
    await nextTick()
    startPrepCountdown()
    startDetection()
})

onUnmounted(() =>{
    stopDetection()
    clearInterval(countDownId)
})

function recordResult({correct, skipped}) {
    results.value.push({
        letter: currentLetter.value,
        signed: detectedLabel.value,
        correct,
        skipped
    })

    if(correct){
        correctCount.value++
    }
}


function startPrepCountdown() {
    isReady.value = false
    detectionActive.value = false
    prepTime.value = 3
    const prepInterval = setInterval(() => {
        prepTime.value--

        if(prepTime.value <= 0) {
            clearInterval(prepInterval)
            isReady.value = true
            detectionActive.value = true
            startCountDown()
        }
    } ,1000)
}


function startCountDown() {
    timeLeft.value = timeLimit
    clearInterval(countDownId)

    countDownId = setInterval(() =>{
        timeLeft.value--
        if(timeLeft.value <= 0 ) {
            clearInterval(countDownId)

            recordResult({
                correct: false,
                skipped: false
            })
            next()
        }
    }, 1000)

}

watch(isMatch, (val) => {
    if(!val) return
    if(!isReady.value) return
    if(showCheck.value) return

    if(detectedLabel.value !== currentLetter.value) return
    if(detectionConfidence.value < 85) return

    clearInterval(countDownId)
    showCheck.value = true

    recordResult({correct: true, skipped: false})

    setTimeout(()=>{
        showCheck.value = false
        next()
    },800)


})


function skip () {
    clearInterval(countDownId)
     recordResult({
        correct: false,
        skipped: true,
    })
    next()
}


function correct() {
    clearInterval(countDownId)

    const isActuallyCorrect = detectedLabel.value === currentLetter.value
    recordResult({
        correct: isActuallyCorrect,
        skipped: false
    })
    next()
}

 async function next() {
    if (current.value < total){
        current.value++
        currentLetter.value = shuffle[current.value - 1]

        showCheck.value = false
        timeLeft.value = timeLimit

        nextLetter()
        startPrepCountdown()
    } else {
        finish()
    }
}


function finish() {
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const mins = Math.floor(timeTaken/60)
    const secs = timeTaken % 60
    const timeString = `${mins}:${secs.toString().padStart(2,'0')}`

    router.push({
        path:'/quizResult',
        query: {
            score: correctCount.value,
            total: total,
            time: timeString,
            results: JSON.stringify(results.value)
        }
    })
}


</script>

<style scoped>
   .quiz{
     background: var(--bg-primary);
        min-height: 100vh;
        padding: 16px 16px 100px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
    }

    .progress {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: var(--text-muted);
    }

    .progressBar {
        width: 100%;
        height: 6px;
        background: #ddd;
        border-radius: 10px;
        overflow: hidden;
    }

    .fill {
        height: 100%;
        background: var(--accent) ;
        border-radius: 10px;
        transition: width 0.3s ease;
    }

    .questionBox{
        border: 1.5px dashed #aaa;
        border-radius: 16px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: var(--bg-primary);
    }

    .question {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .cameraArea {
        width: 100%;
        aspect-ratio: 3/4;
        border-radius: 12px;
        overflow: hidden;
        background-color: var(--bg-card);

    }

    .skip {
        text-align: center;
        color: var(--text-muted);
        font-size: 15px;
        margin-top: 8px;
    }


    .doneBtn {
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

    .timerRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .timer {
        font-size: 16px;
        font-weight: 700;
        color: var(--accent);
        transition: color 0.3s;
    }

    .timer.urgent {
        color: #e74c3c;
    }

    .timeBar {
        width: 100%;
        height: 4px;
        background: #ddd;
        border-radius: 10px;
        overflow: hidden;
    }

    .timerFill {
        height: 100%;
        background: var(--accent);
        border-radius: 10px ;
        transition: width 1s linear, background 0.3s;
    }

    .cameraWrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .cameraWrapper.blurred video {
        backdrop-filter: blur(6px);
        transform: scaleX(-1) scale(1.05);
    }

    .cameraWrapper video {
        width: 100%;
        height: 100%;
        aspect-ratio: 3/4;
        object-fit: cover;
        transform: scaleX(-1);
        transition: filter 0.3s ease;
    }
    .prepOverlay {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: var(--bg-card);
        z-index: 2;
        text-align: center;
    }


    .prepOverlay h1 {
        font-size: 48px;
        margin: 0;
    }

    .prepOverlay p {
        font-size: 16px;
        opacity: 0.9;
    }

    .back {
        color: var(--text-primary);
        font-size: 18px;
    }

    @media (min-width: 768px) {
        .quiz {
            max-width: 480px;
            margin: 0 auto;
        }
    }

</style>