<template>
    <div class="learn">
    <Header />
    <div class="content">
   <!-- page title -->
    <div class="title">
        <h1 class="heading">Learn</h1>
        <p class="subheading">Master ASL basics at your own pace</p>
    </div>

       <!-- learning modules -->
    <div class="bodyContainer">
        <div class="cardContainer" v-on:click="router.push('/aslAlphabet')">
            <div class="imageContainer">
                <img class="aslImage" src="/public/images/ASL.png" alt="">
            </div>
               <!-- ASL alphabet -->
            <div class="aslBody">
                <div class="textblock"> 
                    <p class="type">Fundamentals</p> 
                    <span><i class="fa-solid fa-arrow-right-long"></i></span>
                </div>
                
                  <p class="ASL">ASL Alphabet</p>
            
            </div>

            <div class="progressContainer">
                <p class="sub">A-Z</p>
                <div class="progressbar">
                    <div class="completed" :style="{width: aslProgressPercent + '%'}"></div>
                </div>
                <p class="percentage">{{ aslProgressPercent }}% Completed</p>
            </div>
        </div>


        <div class="cardContainer" v-on:click="router.push('/commonWords')">
            <div class="imageContainer">
                <img src="/public/images/commonWords.png" alt="">
            </div>
             <!--  Common Words -->
            <div class="aslBody">
                 <div class="textblock"> 
                <p class="type">Fundamentals</p> 
                 <span><i class="fa-solid fa-arrow-right-long"></i></span>
                 </div>
                     <p class="ASL">Common Words</p>
            </div>

            <div class="progressContainer">
                <p class="sub">A-Z</p>
                <div class="progressbar">
                    <div class="completed" :style="{width: wordsProgressPercent + '%'}"></div>
                </div>
                
                <p class="percentage">{{ wordsProgressPercent }}% Completed</p>
            </div>
        </div>
    </div>
         <!--  section -->
        <div class="quiz" v-on:click="router.push('/quiz')">
            <p class="dailyP">Daily Practice</p>
            <div class="quizBlock">
                <span class="icon">
                    <i class="fa-solid fa-book-open-reader"></i>
                </span>
                <p>Quiz</p>
            </div>
        </div>
    </div>
        <NavBar />
    </div>
</template>

<script setup> 
// imports
import {useRouter} from 'vue-router'
import { ref, onMounted } from 'vue';
import NavBar from '../components/navBar.vue';
import Header from '../components/header.vue'
import { useUserStore } from '../stores/user';

const router  = useRouter()
const userStore = useUserStore()

// Progress state for modules
const aslProgressPercent = ref(0)
const wordsProgressPercent = ref(0)

// Fetch user progress from backend and calculate percentages
async function userProgress() {
    // Prevent API call if user is not logged in
    if(!userStore.user?._id) return

    try{
        const response = await fetch(`https://gestura-backend-production.up.railway.app/gestura/userStats/${userStore.user._id}`)
        const data = await response.json()

        // ASL alphabet progress
        const aslCompleted = data.modules?.['ASL Alphabet']?.length || 0
        aslProgressPercent.value = Math.round((aslCompleted / 26) * 100)

        // Common words progress
        const wordsCompleted = data.modules?.['Common Words']?.length || 0
        wordsProgressPercent.value = Math.round((wordsCompleted / 8) *100)
    } catch (err) {
        console.error("Error fetching user progress:", err)
    }
}

// fetch progress when component loads
onMounted(() => userProgress())

</script>

<style scoped>
   .learn {
    min-height: 100vh;
    background-color: var(--bg-primary);
    display: flex;
    flex-direction: column;


    max-width: 480px;
    width: 100%;
    margin: 0 auto;
    position: relative;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 0px 20px 20px;
  min-height: 0;
}

   .title {
    margin-top: 10px;
    margin-bottom: 24px;
   }

   .heading {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
     color: var(--text-primary);
  
   }

   .subheading {
    margin-top: 10px;
    color: var(--text-muted);
    font-size: 14px;
   }

   .bodyContainer {
    display: flex;
    flex-direction: column;
    gap: 20px;
   }

   .cardContainer {
    background: var(--bg-card);
    border-radius: 22px;
    padding: 18px;
    box-shadow: var(--shadow-card );
    
   }

   .imageContainer {
    width: 100%;
    height: 180px;
    background: var(--bg-primary);
   
    border-radius:16px ;

    justify-content: center;
    align-items: center;
    display: flex;

   }

   .imageContainer img {
    width: 75%;
    height: auto;

   }

   .imageContainer .aslImage {
    width: 58%;
   }

   .aslBody {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 14px;
  
   }

   .type {
    font-size: 12px;
    color: var(--text-muted);
   }

   .textblock {
    display: flex;
    justify-content: space-between;
    align-items: center;
   }

   .ASL {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
   }

   .aslBody span{
    font-size: 18px;
    color: var(--text-muted);
   }


   .progressContainer {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

   }

   .progressbar {
    width: 100%;
    height: 6px;
    background-color: #ddd;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
   }

   .completed {
    height: 100%;
    background: var(--accent);
    border-radius:10px ;
    transition: width 0.3s ease;
    min-width: 4px;
   }

   .percentage {
    font-size: 12px;
    color: var(--text-muted);
   }

   .quiz {
    margin-top: 24px;

   }

   .quiz .dailyP {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
   }


   .quizBlock{
    background: var(--bg-card);
    width: 150px;
    height: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--accent);
    border-radius: 10px;
    margin-top: 20px ;
    gap:2px; 
    box-shadow: var(--shadow-card );
   }

   .quizBlock i {
     font-size:30px;
   
    
   }

   .quizBlock span{
    background: var(--bg-primary);
    margin-top: 25px;
    padding: 20px;
    border-radius: 500px;

   }

   .quizBlock p {
    font-size: 20px;
    margin-top: 13px;
    font-weight: 500;
    color: var(--text-primary);
   }

   .sub {
    color: var(--text-dark);
   }

</style>