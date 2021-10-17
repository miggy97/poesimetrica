<template>
  <section>
    <h2>Pega un poema aquí:</h2>
    <textarea name="poem" id="poem" v-model="poemInput"></textarea>
    <button @click="transform">
      <img src="@/assets/transform.svg" alt="trash" /> Transformar
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextTransformArea",
  data() {
    return {
      poemInput: "" as string,
    };
  },
  methods: {
    transform() {
      console.log(this.poemInput);
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 32px;
  top: 0;

  h2 {
    font-family: "Roboto Mono", monospace;
    font-weight: 500;
    font-size: 0.95em;
    margin-bottom: 2px;
    color: #f4c7b5;
  }

  textarea {
    font-family: "Roboto Mono", monospace;
    font-size: 1em;
    font-weight: 300;
    resize: none;
    outline: none;
    border: 1px solid #f4c7b5;
    border-radius: 8px;
    width: calc(100vw - 40rem);
    height: 8.5rem;
    padding-top: 1em;
    padding-left: 1em;
    &:focus {
      border: 2px solid #f4c7b5;
    }
  }

  button {
    display: flex;
    width: 9em;
    margin-top: 7px;
    gap: 7px;
    align-items: center;
    justify-content: space-between;
    font-family: "Roboto Mono", monospace;
    color: white;
    font-weight: 400;
    font-size: 0.9em;
    height: 1.8em;
    border: none;
    background: rgb(255, 163, 79, 0.6);
    border-radius: 5px;
    cursor: pointer;
    img {
      width: 1.05em;
      height: auto;
    }
    &:hover {
      background: rgb(255, 163, 79, 0.9);
    }
  }
}
</style>
