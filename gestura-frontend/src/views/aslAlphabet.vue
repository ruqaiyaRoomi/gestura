<template>
  <div class="aslAlphabet">
      <Header />
    <!-- Search Bar -->
    <div class="search">
      <span><i class="fa-solid fa-magnifying-glass"></i></span>
      <input type="search" placeholder="Search" />
    </div>

    <!-- grid of all 26 ASL letter cards -->
    <div class="grid">
      <div
        class="card"
        v-for="letter in alphabets"
        :key="letter.alphabet"
        v-on:click="router.push(`/aslAlphabet/${letter.alphabet}`)"
      >
        <div class="imageContainer">
          <img :src="letter.image" :alt="letter.alphabet" />
        </div>
        <div class="cardBody">
          <p class="name">{{ letter.alphabet }}</p>
        </div>
      </div>
    </div>
  </div>
  <NavBar />
</template>

<script setup>
import { useRouter } from "vue-router";
import NavBar from "../components/navBar.vue";
import Header from "../components/header.vue";
import { computed, ref } from "vue";

const router = useRouter();

const searchQuery = ref('');
const filteredAlphabets = computed (() => {
  if(!searchQuery.value) return alphabets
    return alphabets.filter(letter => 
      letter.alphabet.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase())
    )
})

// static data for all 26 ASL fingerspelling letters with their reference images
const alphabets = [
  {
    alphabet: "A",
    image: "/images/A.png",
  },

  {
    alphabet: "B",
    image: "/images/B.png",
  },

  {
    alphabet: "C",
    image: "/images/C.png",
  },
  {
    alphabet: "D",
    image: "/images/D.png",
  },
  {
    alphabet: "E",
    image: "/images/E.png",
  },
  {
    alphabet: "F",
    image: "/images/F.png",
  },
  {
    alphabet: "G",
    image: "/images/G.png",
  },
  {
    alphabet: "H",
    image: "/images/H.png",
  },
  {
    alphabet: "I",
    image: "/images/I.png",
  },
  {
    alphabet: "J",
    image: "/images/J.png",
  },
  {
    alphabet: "K",
    image: "/images/K.png",
  },
  {
    alphabet: "L",
    image: "/images/L.png",
  },
  {
    alphabet: "M",
    image: "/images/M.png",
  },
  {
    alphabet: "N",
    image: "/images/N.png",
  },
  {
    alphabet: "O",
    image: "/images/O.png",
  },
  {
    alphabet: "P",
    image: "/images/P.png",
  },
  {
    alphabet: "Q",
    image: "/images/Q.png",
  },
  {
    alphabet: "R",
    image: "/images/R.png",
  },
  {
    alphabet: "S",
    image: "/images/S.png",
  },
  {
    alphabet: "T",
    image: "/images/T.png",
  },
  {
    alphabet: "U",
    image: "/images/U.png",
  },
  {
    alphabet: "V",
    image: "/images/V.png",
  },
  {
    alphabet: "W",
    image: "/images/W.png",
  },
  {
    alphabet: "X",
    image: "/images/X.png",
  },
  {
    alphabet: "Y",
    image: "/images/Y.png",
  },
  {
    alphabet: "Z",
    image: "/images/Z.png",
  },
];
</script>

<style scoped>
.aslAlphabet {
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.search {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: 20px;
  padding: 10px 20px;
  margin-bottom: 18px;
}

.search span {
  color: var(--text-muted);
  margin-right: 8px;
}

.search input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  background: transparent;
  color: var(--text-primary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-small);
}

.imageContainer {
  height: 110px;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
}

.imageContainer img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cardBody {
  background: var(--bg-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 0;
}

.name {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
}

@media (min-width: 768px) {
  .aslAlphabet {
    max-width: 480px;
    margin: 0 auto;
    padding: 24px 20px 100px;
  }

  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .imageContainer {
    height: 140px;
  }

  .name {
    font-size: 26px;
  }
}
</style>
