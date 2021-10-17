<template>
  <teleport to="body">
    <InfoWordDialog
      v-if="!dialogClosed"
      @close="closeDialog"
      :word="currentWord"
    />
  </teleport>
  <div class="word" @mouseover="hover = true" @mouseleave="hover = false">
    <section
      :class="{ hideControls: !hover }"
      class="controls"
      :ref="id + 'menu'"
    >
      <img
        v-if="id === '0'"
        class="add"
        src="@/assets/plus.svg"
        alt="Add word"
        @click="addStartInput"
      />
      <img
        :class="{ hideInfo: !isNotEmpty }"
        src="@/assets/info.svg"
        alt="Info word"
        class="info"
        @click="dialogClosed = false"
      />
      <img
        class="add"
        src="@/assets/plus.svg"
        alt="Add word"
        @click="addInput(true)"
      />
    </section>
    <input
      type="text"
      :ref="id"
      v-model="currentWord"
      @keydown.space="addInput(false)"
      @keyup.delete="deleteInput"
      @keydown="downKeyAction"
      @keyup="upKeyAction"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InfoWordDialog from "./UI/InfoWordDialog.vue";

export default defineComponent({
  name: "Word",
  components: {
    InfoWordDialog,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    word: {
      type: String,
      required: true,
      default: "",
    },
    isFocus: {
      type: Boolean,
      required: true,
      default: false,
    },
    isMoveLeft: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: [
    "updateWord",
    "addStartWord",
    "addWord",
    "deleteWord",
    "move",
    "stopedTyping",
    "enterKey",
  ],
  data() {
    return {
      currentWord: "" as string,
      hover: false as boolean,
      timer: 0 as number,
      timeoutVal: 1000 as number,
      dialogClosed: true as boolean,
    };
  },
  watch: {
    // Update word
    currentWord(value: string) {
      if (this.isMoveLeft === false) {
        this.currentWord = this.currentWord.trim();
      }
      if (this.currentWord === "")
        (this.$refs[this.id] as HTMLInputElement).style.width = 1 + "ch";
      else
        (this.$refs[this.id] as HTMLInputElement).style.width =
          value.length + "ch";
      (this.$refs[this.id + "menu"] as HTMLInputElement).style.width =
        (this.$refs[this.id] as HTMLInputElement).offsetWidth + "px";

      this.$emit("updateWord", this.id, value);
    },
  },
  computed: {
    isNotEmpty(): boolean {
      return this.currentWord.trim() !== "" && this.currentWord.trim() !== " ";
    },
  },
  methods: {
    // Only beginning input
    addStartInput() {
      this.$emit("addStartWord");
    },
    // Add input field
    addInput(isEnd: boolean) {
      let cursorPosition;
      if (isEnd) {
        cursorPosition = this.currentWord.length;
      } else {
        cursorPosition = (this.$refs[this.id] as HTMLInputElement)
          .selectionStart;
      }
      // console.log((this.$refs[this.id] as HTMLInputElement).selectionStart);
      this.$emit("addWord", this.id, cursorPosition);
    },
    // Delete input field
    deleteInput() {
      if (
        (this.$refs[this.id] as HTMLInputElement).value === "" ||
        (this.$refs[this.id] as HTMLInputElement).value === " "
      ) {
        this.$emit("deleteWord", this.id);
      } else if (
        (this.$refs[this.id] as HTMLInputElement).selectionStart === 0
      ) {
        this.$emit("deleteWord", this.id);
      }
    },
    // Move between fields
    downKeyAction(event: KeyboardEvent) {
      clearTimeout(this.timer);
      if (
        event.key === "ArrowLeft" &&
        (event.target as HTMLInputElement).selectionStart === 0
      ) {
        this.$emit("move", this.id, "left");
      }
      if (
        event.key === "ArrowRight" &&
        (event.target as HTMLInputElement).selectionStart! >=
          this.currentWord.length - 1
      ) {
        this.$emit("move", this.id, "right");
      }
      if (
        event.key === "Enter" &&
        (event.target as HTMLInputElement).selectionStart! >=
          this.currentWord.length - 1
      ) {
        this.currentWord = this.currentWord.trim();
        this.$emit("enterKey", this.id);
      }
    },
    upKeyAction() {
      clearTimeout(this.timer);
      this.timer = setTimeout(
        () => this.$emit("stopedTyping"),
        this.timeoutVal
      );
    },
    closeDialog() {
      this.dialogClosed = true;
    },
  },
  mounted() {
    this.currentWord = this.word;
    (this.$refs[this.id] as HTMLInputElement).style.width = 1 + "ch";
    (this.$refs[this.id + "menu"] as HTMLInputElement).style.width =
      (this.$refs[this.id] as HTMLInputElement).offsetWidth + "px";
    if (this.isFocus && this.isMoveLeft === true) {
      this.currentWord += " ";
      (this.$refs[this.id] as HTMLInputElement).focus();
    } else if (this.isFocus) {
      (this.$refs[this.id] as HTMLInputElement).focus();
    } else {
      this.currentWord = this.currentWord.trim();
    }
  },
  updated() {
    this.currentWord = this.word;
    if (this.isFocus) {
      (this.$refs[this.id] as HTMLInputElement).focus();
    }
  },
});
</script>

<style lang="scss" scoped>
.word {
  display: inline-block;
}
input {
  font-family: "Roboto Mono", monospace;
  font-size: 1em;
  font-weight: 300;
  text-align: center;
  padding-left: 0.8em;
  padding-right: 0.8em;
  margin-right: 4px;
  border-radius: 13px;
  outline: none;
  border: solid 1px #efaf96;
  background: #fffaf9;

  &:focus {
    outline: none;
    border: solid 1px #ec8e69;
    // box-shadow: 0px 0px 7px rgba(236, 142, 105, 0.7);
    background: #fff3ef;
    font-weight: 400;
  }
}
.controls {
  display: flex;
  justify-content: space-between;
  padding-left: 0.1em;
  margin-bottom: 0.1em;
}

.hideControls {
  visibility: hidden;
  display: flex;
  justify-content: space-between;
  padding-left: 0.1em;
  margin-bottom: 0.1em;
}

.info {
  width: 11px;
  height: 11px;
  cursor: pointer;
}
.hideInfo {
  visibility: hidden;
  pointer-events: none;
  width: 11px;
  height: 11px;
  cursor: pointer;
}
.add {
  width: 11px;
  height: 11px;
  margin-right: 0.2em;
  cursor: pointer;
}
</style>
