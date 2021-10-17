<template>
  <main ref="back">
    <section ref="panel">
      <div class="title">
        <h1 class="word">
          <span>{{ cleanWord }}</span>
        </h1>
      </div>

      <div class="content">
        <!--RAE Button definition-->
        <div class="definiton">
          <div class="raebtn" @click="goToDefiniton">
            <p>Definición RAE</p>
            <img src="@/assets/link.svg" alt="link icon" />
          </div>
        </div>

        <!--Consonat and Assonance Rhyme-->
        <div class="rhyme">
          <div class="consonant">
            <h3>Rima consonante</h3>
            <p>{{ consonantRhyme }}</p>
          </div>
          <div class="assonance">
            <h3>Rima asonante</h3>
            <p>{{ assonanceRhyme }}</p>
          </div>
        </div>

        <!--Syllables-->
        <div class="syllables">
          <h3>Sílabas</h3>
          <div class="syll">
            <span v-for="syll in syllables" :key="syll">{{ syll }}</span>
          </div>
        </div>

        <!--Number Syllables and Accent-->
        <div class="extra-info">
          <div class="num-syll">
            <h3>Número sílabas</h3>
            <p>{{ numSyllables }}</p>
          </div>
          <div class="accent">
            <h3>Acentuación</h3>
            <p>{{ accent }}</p>
          </div>
        </div>
      </div>

      <footer>
        <button class="btnClose" @click="closeDialog">Cerrar</button>
      </footer>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as riman from "riman";

export default defineComponent({
  name: "InfoWordDialog",
  props: {
    word: {
      type: String,
      required: true,
    },
  },
  emits: ["close"],
  data() {
    return {
      cleanWord: "" as string,
      consonantRhyme: "" as string,
      assonanceRhyme: "" as string,
      numSyllables: 0 as number,
      syllables: "" as string,
      accent: "" as string,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    goToDefiniton() {
      window.open(`https://dle.rae.es/${this.word.trim()}`, "_blank");
    },
  },
  mounted() {
    const resultRiman = riman.analyzeWord(this.word);
    this.cleanWord = resultRiman.palabra;
    this.consonantRhyme = resultRiman.rimaConsonante;
    this.assonanceRhyme = resultRiman.rimaAsonante;
    this.numSyllables = resultRiman.numSilabas;
    this.syllables = resultRiman.silabas;
    this.accent =
      resultRiman.acentuacion === "Grave (Llana)"
        ? "Llana"
        : resultRiman.acentuacion;
  },
});
</script>

<style lang="scss" scoped>
main {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(135, 90, 84, 0.43);
}
section {
  position: fixed;
  background-color: white;
  width: 500px;
  border-radius: 10px;
}

.title {
  height: 5em;
  line-height: 5em;
  box-shadow: 1px 0px 3px rgba(135, 90, 84, 0.3);
}

.content {
  height: 55vh;
  overflow-y: scroll;
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background: transparent;
  }
  &::-webkit-scrollbar {
    width: 10px;
    background: transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(239, 175, 150, 0.7);
  }
}

footer {
  height: 5em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.word {
  text-align: center;
  margin: 0;
  span {
    font-family: "Roboto Mono", monospace;
    font-size: 1.5em;
    font-weight: 300;
    background-color: #fffaf9;
    padding-left: 0.5em;
    padding-right: 0.5em;
    border-radius: 0.8em;
    border: solid 1px #efaf96;
  }
}
.definiton {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  .raebtn {
    width: 18em;
    height: 4em;
    font-family: "Roboto Mono", monospace;
    font-size: 1em;
    font-weight: 400;
    color: #837978;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background: #fffaf9;
    border-radius: 1em;
    border: solid 2px #efaf96;
    cursor: pointer;

    img {
      width: 2em;
      height: auto;
      padding: 3px;
      margin-left: 1em;
      background: #fffaf9;
      border-radius: 50%;
      z-index: 2;
    }

    p {
      z-index: 2;
    }

    &::after {
      content: "";
      position: absolute;
      display: block;
    }

    &:hover {
      color: white;
      &:after {
        width: 18em;
        height: 4em;
        border-radius: 1em;
        border: solid 2px #efaf96;
        background: #efaf96;
        animation: circle 0.7s ease-in-out;
      }
    }
  }
}

@keyframes circle {
  0% {
    width: 1em;
    height: 1em;
    border-radius: 50%;
  }
  25% {
    width: 4em;
    height: 4em;
    border-radius: 1em;
  }
  100% {
    width: 18em;
    height: 4em;
    border-radius: 1em;
  }
}

.rhyme,
.extra-info {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;

    h3 {
      font-family: "Roboto Mono", monospace;
      font-weight: 500;
      color: #efaf96;
    }

    p {
      font-family: "Roboto Mono", monospace;
      font-size: 1.3em;
      font-weight: 300;
      background-color: #fffaf9;
      padding-left: 0.5em;
      padding-right: 0.5em;
      border-radius: 0.8em;
      border: solid 1px #efaf96;
      margin-top: 0px;
    }
  }
}

.syllables {
  margin-top: 20px;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  h3 {
    font-family: "Roboto Mono", monospace;
    font-weight: 500;
    color: #efaf96;
  }
  .syll {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    span {
      font-family: "Roboto Mono", monospace;
      font-size: 1.3em;
      font-weight: 300;
      background-color: #fffaf9;
      padding-left: 0.5em;
      padding-right: 0.5em;
      border-radius: 0.8em;
      border: solid 1px #efaf96;
      margin-bottom: 8px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}

.btnClose {
  float: right;
  height: 2em;
  width: 6em;
  margin-top: 1em;
  margin-right: 1.5em;
  font-family: "Roboto Mono", monospace;
  font-size: 1em;
  font-weight: 400;
  background: #efaf96;
  color: white;
  border: none;
  border-radius: 1em;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 1px 2px 2px rgba(135, 90, 84, 0.3);
  }
}
</style>
