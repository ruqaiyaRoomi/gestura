<template>
    <div class="header">
        <!-- gestura logo-->
       <div class="image"> <img  src="/images/gestura.png"/> </div>
        <!-- settings logo -->
        <span @click="router.push('/settings')"><i class="fa-solid fa-gear"></i></span>
    </div>
</template>

<script setup>
import {onMounted } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter()
const emit = defineEmits(['done'])

// emit 'done' after 3.6s 
onMounted(() => {
    setTimeout(() => {
    emit('done')} ,3600)
    
})

</script>

<style scoped>
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background-color: var(--bg-primary);
        width: 100w;
        position: sticky;
        top: 0;
        z-index: 10;
      
    }

   .image img{
    height: 40px;
    width: auto;
   }

    .fa-gear {
        font-size: 22px;
        color: var(--text-dark);
    }

    @media (min-width: 768px) {
        .header {
            padding: 20px 40px;
            max-width: 100%;
        }

        .image img {
            height: 50px;
            width: auto;
        }
    }

</style>