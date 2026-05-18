<template>
    <div class="quiz">
         <Header/>
         <div class="header">
            <span class="back" v-on:click="router.back()"><i class="fa-solid fa-arrow-left"></i></span>
            <span class="title">Quiz</span>
            <span></span>
        </div>

        <div class="body">
            
        <div class="image">
            <img src="/images/quiz.png" alt="quiz illustration">
        </div>
        <!-- Quiz description -->
        <div class="textBlock">
            <p class="blockTitle">Fingerspelling Quiz</p>
            <p class="subheading">Sign the correct Alphabet</p>
        </div>

        <!-- Question selector -->
        <div class="questions">
            <p class="questionTitle">Number of Questions</p>
    
            <div class="noQuestions">
                <!-- sliding selector indicator -->
                <div class="slider" :style="{transform: `translateX(${[5,10,15].indexOf(selected) * 100}%)`}"></div>
                <button :class="{active: selected === 5}" v-on:click="selected = 5">5</button>
                <button :class="{active: selected === 10}" v-on:click="selected= 10">10</button>
                <button :class="{active: selected === 15}" v-on:click="selected = 15">15</button>
            </div>
            <!-- start quiz -->
            <button class="startQuiz" v-on:click="router.push(`/quizQuestion/${selected}`)">
                Start Quiz
            </button>
        </div>
        </div>
    </div>

    <NavBar/>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '../components/navBar.vue';
import Header from '../components/header.vue';

const router = useRouter();
const selected = ref(5)

</script>

<style scoped>

    .quiz {
        background: var(--bg-primary);
        min-height: 100vh;
        padding: 20px 16px 100px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
   
 .title {
    font-size: 20px;
    margin-top: 10px;
    margin-bottom: 24px;
    color: var(--text-primary);

   }

   .back {
    margin-left: 5px;
    margin-right: 8px;
    color: var(--text-primary);
    font-size: 18px;
   }

   .textBlock {
    display: flex;
    flex-direction: column;
    gap: 2px;
    justify-content: center;
    align-items: center;
   }

   .textBlock .blockTitle {
    font-size: 25px;
    text-align: center;
    margin-bottom: 0;
    color: var(--text-primary);
   }

   .textBlock .subheading {
    font-size: 15px;
    color: var(--text-muted);
   }

   .questions{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
   }

   .noQuestions{
    position: relative;
     width: 100%;
     height: 55px;
     border-radius: 12px;
     display: flex;
     justify-content: center;
     align-items: center;
     padding: 4px;
     box-sizing: border-box;
     background: var(--bg-card);
    box-shadow: var(--shadow-small); 

   }

   .slider {
    position: absolute;
    width: calc(33.33% - 3px);
    height: calc(100% - 8px);
    background-color: var(--accent);
    border-radius: 10px;
    transition: transform 0.3s ease; 
    left: 4px;
   }

   .noQuestions button {
   position: relative;
   z-index: 1;
   border-radius: 10px;
   border: none;
   height: 100%;
   width: 33.33%;
   background-color: transparent;
   color: var(--text-muted);
   font-weight: 600;
   font-size: 15px;
   transition: 0.3s ease;
   box-shadow: none;

   }

   .noQuestions button.active {
    background: var(--accent);
    color: var(--bg-card);
   }

   .startQuiz {
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

   .questions .questionTitle {
        text-align: center;
        font-size:20px ;
        color: var(--text-primary);
   }

   .image{
    text-align: center;
   }
   @media (min-width: 768px) {
        .quiz {
            max-width: 480px;
            margin: 0 auto;
        }
   }


</style>