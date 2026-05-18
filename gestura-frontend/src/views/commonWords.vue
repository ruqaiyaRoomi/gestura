<template>
    <div class="commonWords">
          <Header/>
        <div class="pageHeader">
            <span class="back" v-on:click="router.push('/learn')"><i class="fa-solid fa-arrow-left"></i></span>
            <span class="title">Common Words</span>
            <span></span>
        </div>
        <!-- List of commone words displayed as clickable cards -->
        <div class="cardContainer">
            <!-- Loop through words array-->
            <div class="cards" v-for="word in words" :key="word.word" v-on:click="openWord(word.word)" :class="{ completed: completedWords.includes(word.word)}">
                <div class="cardLeft">
                    <span class="completedDot" v-if="completedWords.includes(word.word)"><i class="fa-solid fa-check"></i></span>
                    <p class="cardTitle">{{ word.word }}</p>
                </div>
                <span class="arrow">
                        <i class="fa-solid fa-arrow-right-long"></i>
                 </span>
            </div>
        </div>
    <NavBar/>
    </div>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import NavBar from '../components/navBar.vue';
import Header from '../components/header.vue';
import {useUserStore} from '../stores/user'

const router  = useRouter()
const userStore = useUserStore()
const completedWords = ref([])

// Staic list of common words for ASL learning
const words = [
    {word: 'Hello'},
    {word: 'Thank you'},
    {word: 'Youre welcome'},
    {word: 'Sorry'},
    {word: 'Yes'},
    {word: 'No'},
    {word: 'Help'},
    {word: 'Please'}
]


async function fetchCompletedWords() {
    if(!userStore.user?._id) return
    try {
        const response = await fetch(`https://gestura-backend-production.up.railway.app/gestura/userStats/${userStore.user._id}`)
        const data = await response.json()
        
        if (data.modules?.['Common Words']) {
            completedWords.value = data.modules['Common Words']
        }
    } catch (err) {
        console.error('Error fetching completed words', err)
    }
}



// Navigate to detailed view of selected word
function openWord(word){
    router.push(`/commonWords/${word}`)
}

onMounted(() => {
    fetchCompletedWords()
})
</script>

<style scoped>
   .commonWords {
        height: 100vh;
        max-height: 100vh;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        background-color: var(--bg-primary);
        display: flex;
        flex-direction: column;
        position: relative;
   }

   .pageHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
   }

    .title {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);

   }

   .back {
        font-size: 18px;
        color: var(--text-primary);
   }

   .cardContainer {
        display: flex;
        flex-direction: column;
        gap: 10px;
   }

   .cards{
     display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-card);
    width: 100%;
    padding: 20px 10px;
    border-radius: 14px;
    transition: transform 0.15s ease;
    box-shadow: 0 4px 10px rgba(0,0,0,0.06);
    box-sizing: border-box;
   }

   .cards:hover {
    transform: translateY(-1px);
   }

   .cards.completed {
    background: rgba(233, 150, 39, 0.12);
    border: 1.5px solid var(--accent);
   }

   .cardLeft {
    display: flex;
    align-items: center;
    gap: 10px;
   }

   .completedDot {
    color: var(--accent);
    font-size: 14px;
   }

   .cardTitle {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
   }

   .arrow {
    color: var(--text-muted);
    font-size: 16px;
    display: flex;
    align-items: center;
   }

   .cards.completed .arrow {
    color: var(--accent);
   }
   
   .cards p {
    margin-left: 13px;
   }

   .cards i {
    margin-right: 15px;
   }

   .cards:active{
    transform:  scale(0.98);
   }
   
   @media (min-width: 768px) {

    .commonWords {
        max-width: 480px;
        margin: 0 auto;
    }

    .cards{
        padding: 18px 20px;
    }

    .cardTitle {
        font-size: 17px;
    }
    
   }


</style>