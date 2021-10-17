<template>
  <main>
    <section class="info-control">
      <button class="delete-all" @click="deleteAll">
        <img src="@/assets/trash.svg" alt="trash" /> Borrar todo
      </button>
      <div class="is-total">
        <div></div>
        <p>Sílabas totales</p>
      </div>
      <div class="is-meter">
        <div></div>
        <p>Sílabas métricas</p>
      </div>
    </section>

    <AddVerseButton @click="addVerse(-1)" class="add-button-top" />
    <div class="verse" v-for="verse in verseInStanza" :key="verse.key">
      <Verse
        :id="verse.id"
        :color="verse.color"
        :applyColor="verse.applyColor"
        :ref="'get' + verse.id"
        @new-verse="addVerse"
        @delete-verse="removeVerse"
        @send-rhyme="pushRhyme"
      />
      <AddVerseButton @click="addVerse(verse.id)" class="add-button" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Verse from "./Verse.vue";
import { verseInStanza, verseColor } from "../types";
import AddVerseButton from "./UI/AddVerseButton.vue";
import * as riman from "riman";
import * as randomColor from "randomcolor";

export default defineComponent({
  name: "Stanza",
  components: {
    Verse,
    AddVerseButton,
  },
  data() {
    return {
      verseCount: 0 as number,
      keyCount: 0 as number,
      verseInStanza: [
        {
          id: "0", //String that always contains a number
          lastWord: "",
          color: "#fffaf9",
          applyColor: 0,
          isEmpty: true,
          consonatRhyme: "",
          assonanceRhyme: "",
          meterSyllables: 0,
          totalSyllables: 0,
          key: 0,
        },
      ] as verseInStanza[],
      verseColor: [] as verseColor[],
      colors: randomColor({ luminosity: "light", count: 30 }),
      usedColors: [] as number[],
    };
  },
  methods: {
    //(this.$refs[verseId] as InstanceType<typeof Verse>).atLeastOneWord()
    addVerse(id: string) {
      this.verseCount++;
      this.keyCount++;
      const position = parseInt(id) + 1;
      this.verseInStanza.splice(position, 0, {
        id: position.toString(),
        lastWord: "",
        color: "#fffaf9",
        applyColor: 0,
        isEmpty: true,
        consonatRhyme: "",
        assonanceRhyme: "",
        meterSyllables: 0,
        totalSyllables: 0,
        key: this.keyCount,
      });
      if (this.verseInStanza[position + 1]) {
        this.readjustIds(position + 1, 1);
      }
      window.scrollTo(0, document.body.scrollHeight);
    },
    removeVerse(id: string) {
      this.clearIdColorRhyme(id);
      if (id === "0" && this.verseCount === 0) {
        (this.$refs["get" + id] as InstanceType<typeof Verse>).resetVerse();
        return;
      }
      this.verseCount--;
      this.verseInStanza = this.verseInStanza.filter(
        (verse) => verse.id !== id
      );
      const position = parseInt(id);
      if (this.verseInStanza[position]) {
        this.readjustIds(position, -1);
      }
      if (this.verseCount === 0) {
        (this.$refs["get0"] as InstanceType<typeof Verse>).focusFirstVerse();
      }
    },
    deleteAll() {
      (this.verseInStanza = [
        {
          id: "0", //String that always contains a number
          lastWord: "",
          color: "#fffaf9",
          applyColor: 0,
          isEmpty: true,
          consonatRhyme: "",
          assonanceRhyme: "",
          meterSyllables: 0,
          totalSyllables: 0,
          key: 0,
        },
      ]),
        (this.$refs["get0"] as InstanceType<typeof Verse>).resetVerse();
      (this.verseColor = []), (this.usedColors = []);
    },
    pushRhyme(id: string, word: string) {
      if (word.trim() === "") return;
      // this.verseInStanza[parseInt(id)].color = "#fffaf9";
      const rhyme = riman.analyzeWord(word);
      this.verseInStanza[parseInt(id)].lastWord = word;
      if (
        this.verseInStanza[parseInt(id)].consonatRhyme === rhyme.rimaConsonante
      ) {
        this.assignColor();
        return;
      }
      this.verseInStanza[parseInt(id)].consonatRhyme = rhyme.rimaConsonante;
      this.verseInStanza[parseInt(id)].assonanceRhyme = rhyme.rimaAsonante;
      let isRhyme = false;
      this.clearIdColorRhyme(id);
      // Add consonat rhyme
      for (let i = 0; i < this.verseColor.length; i++) {
        if (this.verseColor[i].consonatRhyme === rhyme.rimaConsonante) {
          this.verseColor[i].ids.push(id);
          isRhyme = true;
          if (
            this.verseColor[i].ids.length === 2 &&
            this.verseColor[i].color === -1
          ) {
            const color = this.getFreeColor();
            this.verseColor[i].color = color;
            this.usedColors.push(color);
          }
        }
      }
      // Add assonace rhyme
      if (isRhyme === false) {
        for (let i = 0; i < this.verseColor.length; i++) {
          if (this.verseColor[i].assonantRhyme === rhyme.rimaAsonante) {
            this.verseColor[i].ids.push(id);
            isRhyme = true;
            if (
              this.verseColor[i].ids.length === 2 &&
              this.verseColor[i].color === -1
            ) {
              const color = this.getFreeColor();
              this.verseColor[i].color = color;
              this.usedColors.push(color);
            }
          }
        }
      }
      // There is no rhyme - Add new rhyme
      if (isRhyme === false) {
        this.verseColor.push({
          consonatRhyme: rhyme.rimaConsonante,
          assonantRhyme: rhyme.rimaAsonante,
          ids: [id],
          color: -1,
        });
      }
      // console.log(this.verseColor);
      this.assignColor();
    },
    getFreeColor(): number {
      for (let i = 0; i < this.colors.length; i++) {
        if (this.usedColors.indexOf(i) === -1) return i;
      }
      return -2;
    },
    assignColor() {
      for (let vs of this.verseColor) {
        if (vs.ids.length === 1) {
          this.verseInStanza[parseInt(vs.ids[0])].color = "#fffaf9";
          this.verseInStanza[parseInt(vs.ids[0])].applyColor++;
        } else {
          for (let id of vs.ids) {
            this.verseInStanza[parseInt(id)].color = this.colors[vs.color];
            this.verseInStanza[parseInt(id)].applyColor++;
          }
        }
      }
    },
    // Delete Id
    clearIdColorRhyme(id: string) {
      for (let i = 0; i < this.verseColor.length; i++) {
        if (this.verseColor[i].ids.indexOf(id) !== -1) {
          // Delete hole rhyme + color
          if (this.verseColor[i].ids.length === 1) {
            if (this.usedColors.indexOf(this.verseColor[i].color) !== -1) {
              this.usedColors.splice(
                this.usedColors.indexOf(this.verseColor[i].color),
                1
              );
            }
            this.verseColor.splice(i, 1);
            i--;
          } else {
            // Delete specific rhyme id but keep rhyme
            this.verseColor[i].ids.splice(
              this.verseColor[i].ids.indexOf(id),
              1
            );
          }
        }
      }
    },
    readjustIds(positon: number, operation: number) {
      for (let i = positon; i <= this.verseCount; i++) {
        const newId = (
          parseInt(this.verseInStanza[i].id) + operation
        ).toString();
        this.verseInStanza[i].id = newId;
      }

      for (let i = 0; i < this.verseColor.length; i++) {
        for (let x = 0; x < this.verseColor[i].ids.length; x++) {
          if (
            operation === 1 &&
            parseInt(this.verseColor[i].ids[x]) >= positon - 1
          ) {
            this.verseColor[i].ids[x] = (
              parseInt(this.verseColor[i].ids[x]) + operation
            ).toString();
          }
          if (
            operation === -1 &&
            parseInt(this.verseColor[i].ids[x]) >= positon
          ) {
            this.verseColor[i].ids[x] = (
              parseInt(this.verseColor[i].ids[x]) + operation
            ).toString();
          }
        }
      }
      console.log("Verses:", this.verseInStanza);
      console.log(this.verseColor);
      this.$nextTick(() => {
        this.assignColor();
      });
    },
  },
});
</script>

<style lang="scss" scoped>
main {
  margin-left: 3em;
  padding-bottom: 5em;
}

.info-control {
  margin-left: -1.5em;
  margin-bottom: 1.5em;
  display: flex;
  align-items: center;
  gap: 1.2em;
  .delete-all {
    display: flex;
    width: 9em;
    align-items: center;
    justify-content: space-between;
    font-family: "Roboto Mono", monospace;
    color: white;
    font-weight: 400;
    font-size: 0.9em;
    height: 1.8em;

    border: none;
    background: rgba(255, 79, 88, 0.5);
    border-radius: 5px;
    cursor: pointer;
    img {
      width: 0.7em;
      height: auto;
    }
    &:hover {
      background: rgba(255, 79, 88, 0.8);
    }
  }
  .is-total {
    display: flex;
    align-items: center;
    gap: 0.4em;
    div {
      width: 0.9em;
      height: 0.9em;
      border-radius: 50%;
      background: #8fc0a9;
    }
    p {
      font-family: "Roboto Mono", monospace;
      font-weight: 300;
      font-size: 0.9em;
    }
  }

  .is-meter {
    display: flex;
    align-items: center;
    gap: 0.4em;
    div {
      width: 0.9em;
      height: 0.9em;
      border-radius: 50%;
      background: #ffaa89;
    }
    p {
      font-family: "Roboto Mono", monospace;
      font-weight: 300;
      font-size: 0.9em;
    }
  }
}

.add-button-top {
  margin-left: -1.5em;
  margin-bottom: -0.6em;
}

.verse {
  margin-bottom: -0.5em;
  padding-bottom: 0;
  position: relative;

  .add-button {
    position: absolute;
    top: 75%;
    margin-left: -1.5em;
  }
}
</style>
