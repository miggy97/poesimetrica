<template>
  <section :ref="'verse' + id">
    <div class="word" v-for="(word, index) in wordsInVerse" :key="word.key">
      <Word
        v-if="index === focusField"
        :id="word.id"
        :word="word.word"
        :isFocus="true"
        :isMoveLeft="isMoveLeft"
        @update-word="saveWord"
        @add-start-word="addStartField"
        @add-word="addField"
        @delete-word="deleteField"
        @move="moveArrowKeys"
        @stoped-typing="analyzeMetricaRhyme"
        @enter-key="newVerse"
      />
      <Word
        v-else
        :id="word.id"
        :word="word.word"
        :isFocus="false"
        :isMoveLeft="isMoveLeft"
        @update-word="saveWord"
        @add-word="addField"
        @delete-word="deleteField"
        @move="moveArrowKeys"
      />
    </div>
    <p class="totalsyll">{{ totalSyllables }}</p>
    <p class="metersyll">{{ meterSyllables }}</p>
    <DeleteVerseButton @click="deleteVerse" class="deletebtn" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Word from "./Word.vue";
import { wordsInVerse } from "../types";
import * as metrica from "metrica-verso";
import DeleteVerseButton from "./UI/DeleteVerseButton.vue";

export default defineComponent({
  name: "Verse",
  components: {
    Word,
    DeleteVerseButton,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    applyColor: {
      type: Number,
      required: true,
    },
  },
  emits: ["newVerse", "updateToStanza", "deleteVerse", "sendRhyme"],
  data() {
    return {
      wordCount: 0 as number,
      focusField: 0 as number,
      keyCount: 0 as number,
      isMoveLeft: false as boolean,
      meterSyllables: 0 as number,
      totalSyllables: 0 as number,
      wordsInVerse: [
        {
          id: "0", //String that always contains a number
          word: "",
          key: 0,
        },
      ] as wordsInVerse[],
    };
  },
  watch: {
    applyColor() {
      const lastWord =
        (this.$refs["verse" + this.id] as HTMLElement).getElementsByClassName(
          "word"
        ).length - 1;
      for (let i = 0; i < lastWord; i++) {
        (this.$refs["verse" + this.id] as HTMLElement)
          .getElementsByClassName("word")
          [i].getElementsByTagName("input")[0].style.background = "#fffaf9";
        (this.$refs["verse" + this.id] as HTMLElement)
          .getElementsByClassName("word")
          [i].getElementsByTagName("input")[0].style.fontWeight = "300";
      }
      (this.$refs["verse" + this.id] as HTMLElement)
        .getElementsByClassName("word")
        [lastWord].getElementsByTagName(
          "input"
        )[0].style.background = this.color;
      (this.$refs["verse" + this.id] as HTMLElement)
        .getElementsByClassName("word")
        [lastWord].getElementsByTagName("input")[0].style.fontWeight = "400";
    },
  },
  methods: {
    //Saves word into wordsInVerse when change
    saveWord(id: string, word: string) {
      this.isMoveLeft = false;
      const index = this.wordsInVerse.findIndex((x) => x.id === id);
      this.wordsInVerse[index].word = word;
    },
    //Only for adding de start field and focus it
    addStartField() {
      this.isMoveLeft = false;
      this.wordCount++;
      this.keyCount++;
      this.wordsInVerse.unshift({
        id: "0",
        word: "",
        key: this.keyCount,
      });
      this.focusField = 0;
      this.readjustIds(1, 1);
      this.analyzeMetricaRhyme();
    },
    //Add field and focus it
    addField(id: string, cursorPosition: number) {
      this.isMoveLeft = false;
      this.wordCount++;
      this.keyCount++;
      const position = parseInt(id) + 1;
      let newWordContent = "";
      if (cursorPosition < this.wordsInVerse[parseInt(id)].word.length) {
        newWordContent = this.wordsInVerse[parseInt(id)].word.slice(
          cursorPosition
        );
        this.wordsInVerse[parseInt(id)].word = this.wordsInVerse[
          parseInt(id)
        ].word.slice(0, cursorPosition);
      }
      this.wordsInVerse.splice(position, 0, {
        id: position.toString(),
        word: newWordContent,
        key: this.keyCount,
      });
      this.focusField = position;
      if (this.wordsInVerse[position + 1]) {
        this.readjustIds(position + 1, 1);
      }
      this.analyzeMetricaRhyme();
    },

    deleteField(id: string) {
      this.isMoveLeft = false;
      if (id === "0" && this.wordCount === 0) return;
      this.wordCount--;
      if (id !== "0") {
        this.wordsInVerse[parseInt(id) - 1].word = this.wordsInVerse[
          parseInt(id) - 1
        ].word.concat(this.wordsInVerse[parseInt(id)].word);
      }
      this.wordsInVerse = this.wordsInVerse.filter((word) => word.id !== id);
      const position = parseInt(id);
      if (this.wordsInVerse[position]) {
        this.readjustIds(position, -1);
      }
      if (id !== "0") {
        this.focusField = position - 1;
      } else this.focusField = 0;
      this.analyzeMetricaRhyme();
    },
    // operation can only be 1 or -1
    readjustIds(positon: number, operation: number) {
      for (let i = positon; i <= this.wordCount; i++) {
        this.wordsInVerse[i].id = (
          parseInt(this.wordsInVerse[i].id) + operation
        ).toString();
      }
    },
    moveArrowKeys(id: string, moveTo: string) {
      if (moveTo === "left") {
        if (id === "0") return;
        this.isMoveLeft = true;
        this.focusField = parseInt(id) - 1;
      }
      if (moveTo === "right") {
        this.isMoveLeft = false;
        if (parseInt(id) === this.wordsInVerse.length - 1) return;
        this.focusField = parseInt(id) + 1;
      }
    },
    newVerse(id: string) {
      if (this.isLastWord(id)) {
        this.wordsInVerse = this.wordsInVerse.filter(
          (wordInfo) => wordInfo.word.trim() !== ""
        );
        if (this.wordsInVerse.length === 0) {
          this.wordsInVerse.push({
            id: "0",
            word: "",
            key: this.keyCount,
          });
        }
        for (let i = 0; i < this.wordsInVerse.length; i++) {
          this.wordsInVerse[i].id = i.toString();
        }
        this.wordCount = this.wordsInVerse.length - 1;
        this.analyzeMetricaRhyme();
        this.$emit("newVerse", this.id);
      }
    },
    isLastWord(id: string): boolean {
      if (this.wordCount.toString() === id) return true;
      let islast = true;
      for (let x = parseInt(id) + 1; x <= this.wordCount; x++) {
        if (this.wordsInVerse[x].word.trim() !== "") {
          islast = false;
          break;
        }
      }
      return islast;
    },
    atLeastOneWord(): boolean {
      let isWordFound = false;
      for (let wordInfo of this.wordsInVerse) {
        if (wordInfo.word.trim() !== "" && wordInfo.word.trim() !== " ") {
          isWordFound = true;
        }
      }
      return isWordFound;
    },
    // updateToStanza(property: string, value: any) {
    //   this.$emit("updateToStanza", this.id, property, value);
    // },
    deleteVerse() {
      this.$emit("deleteVerse", this.id);
    },
    resetVerse() {
      this.wordCount = 0;
      this.focusField = 0;
      this.keyCount = 0;
      this.isMoveLeft = false;
      this.meterSyllables = 0;
      this.totalSyllables = 0;
      this.wordsInVerse = [
        {
          id: "0", //String that always contains a number
          word: "",
          key: 0,
        },
      ];
      this.focusField = 0;
    },
    focusFirstVerse() {
      document.getElementsByTagName("input")[this.wordCount].focus();
    },
    analyzeMetricaRhyme() {
      // Analyze metrica
      let verse = "";
      for (let w of this.wordsInVerse) {
        verse += w.word + " ";
      }
      try {
        const meter = metrica.analyze(verse);
        this.meterSyllables = meter.metricaSilabas;
        this.totalSyllables = meter.totalSilabas;
      } catch (error) {
        //console.log(error);
        this.meterSyllables = 0;
        this.totalSyllables = 0;
      }

      //Emit and Check Rhyme
      this.$emit("sendRhyme", this.id, this.wordsInVerse[this.wordCount].word);
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  display: flex;
  align-items: baseline;
}
.word {
  display: inline;
}
.totalsyll {
  font-family: "Roboto Mono", monospace;
  font-size: 1em;
  font-weight: 400;
  background-color: #8fc0a9;
  color: white;
  text-align: center;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  padding-right: 0.5em;
  padding-left: 0.5em;
  border-radius: 13px;
  margin-right: 4px;
}

.metersyll {
  font-family: "Roboto Mono", monospace;
  font-size: 1em;
  font-weight: 400;
  background-color: #ffaa89;
  color: white;
  text-align: center;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  padding-right: 0.5em;
  padding-left: 0.5em;
  border-radius: 13px;
}

.deletebtn {
  margin-left: 5px;
  align-self: center;
}
</style>
