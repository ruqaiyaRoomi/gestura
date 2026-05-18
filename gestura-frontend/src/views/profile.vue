<template>
    <div class="profile">
       <Header />
    <!-- User info section -->
     <div class="content">
        <div class="top">
        <p class="pageTitle">Profile</p>
        <div class="profileImg">
            <div class="avatar">
            <i class="fa-solid fa-user"></i>
            </div>
            <p class="name">{{ userStore.user?.firstName}} {{ userStore.user?.lastName }}</p>
        </div>
        </div>

      <!-- User stats section -->
        <div class="section">
        <p class="sectionTitle">Learning Progress</p>
        <div class="progressCards">
            <div class="progressCard">
            <span class="icon">🔥</span>
            <span class="stat">0 Days</span>
            </div>
            <div class="progressCard">
            <span class="icon">🤚</span>
            <span class="stat">{{ completedLetters }}/ {{ totalLetters }}</span>
            </div>
        </div>
        </div>

        <!-- history section -->
        <div class="section">
        <p class="sectionTitle">Recently Learned</p>
        <div class="recentGrid">
            <div class="recentCard" v-for="(recentlySigned, index) in userStats" :key="index">
            <img :src="`/images/${recentlySigned.letter}.png`" />
            <p>{{ recentlySigned.letter }}</p>
            </div>
        </div>
        </div>

    
        <div class="section">
        <p class="sectionTitle">Quiz History</p>
        <div class="quizCard" v-for="(history, index) in quizHistory.slice(-5).reverse()" :key="index">
            <div class="quizIcon">
            <i class="fa-solid fa-circle-question"></i>
            </div>
            <span class="quizName">Fingerspelling Quiz</span>
            <span class="quizScore">{{ history.score }}/{{ history.numberOfQuestions }} </span>
        </div>
        </div>
    </div>
    <NavBar />
    </div>
</template>

<script setup>
// imports
import NavBar from '../components/navBar.vue';
import { ref , onMounted } from 'vue';
import Header from '../components/header.vue';
import { useUserStore } from '../stores/user';


const userStore = useUserStore();
// reactive data stores
const quizHistory = ref([])
const userStats = ref([])


const completedLetters = ref(0)
const totalLetters = 26

// fetch data on mount

onMounted(async () =>{
  if(!userStore.user?._id) {
      console.warn('No user found')
      return
  }

  getQuizHistory()
  getUserStats()
  
})

// fetch quiz history for user
async function getQuizHistory() {
   try{

      const response = await fetch(`https://gestura-backend-production.up.railway.app/gestura/quizHistory?userId=${userStore.user._id}`)
      const data = await response.json()
      quizHistory.value = Array.isArray(data) ? data : []
      console.log('quiz history', data)

  } catch (err) {
    console.error(err)
  }
}

// fetch ASL progress + recent letters
async function getUserStats() {
    try{
    const response = await fetch(`https://gestura-backend-production.up.railway.app/gestura/userStats/${userStore.user._id}`)
    const data = await response.json()
    
    const letters = data.modules?.['ASL Alphabet'] || []
    // Total progress count
    completedLetters.value = letters.length

    // Recent 5 letters
    if (data.modules?.['ASL Alphabet']) {
        userStats.value = [...data.modules['ASL Alphabet']].slice(-5).reverse().map(letter =>({
            letter,
            moduleName: 'ASL Alphabet'
        }))
    }

  } catch (err) {
    console.error(err)
  }
}



</script>

<style scoped>
   
.profile {
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

.pageTitle {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 16px;
  color: var(--text-primary);
}

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--text-muted);
  background: var(--bg-card);
}

.profileImg{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name {
  font-size: 18px;
  font-weight: 600;
  margin: 12px 0 0;
  color: var(--text-primary);
}

.sectionTitle {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px;
}

.progressCards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.progressCard {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}

.icon {
  font-size: 24px;
}

.stat {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
}

.recentGrid {
  display: flex;
  gap: 12px;
  flex-direction: row;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  align-items: center;
  padding-right: 10px;
  
}

.recentGrid::-webkit-scrollbar{
  display: none;
}

.recentCard {
  min-width: 120px;
  flex-shrink: 0;
  scroll-snap-align: start;

  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
 
}

.recentCard img {
  width: 80px;
  height: 80px;
  object-fit: contain; 
}

.recentCard p {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 8px 0 0;
}

.quizCard {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  margin-bottom: 10px;
}

.quizIcon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 18px;
}

.quizName {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.quizScore {
  font-size: 14px;
  color: var(--text-muted);
}

</style>