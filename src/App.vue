<template>
  <header>
    <img src="@/assets/logo.svg" alt="logo feather" />
    <h1>
      <span class="poesi">Poesi</span><span class="metrica">Métrica</span>
    </h1>
  </header>
  <TextTransformArea />
  <Stanza />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Stanza from "./components/Stanza.vue";
import TextTransformArea from "./components/UI/TextTransformArea.vue";

export default defineComponent({
  name: "App",
  components: {
    Stanza,
    TextTransformArea,
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Nunito&display=swap");

body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

header {
  display: flex;
  align-items: flex-end;
  padding: 2em 0em 3em 2em;
  img {
    width: 4em;
    height: auto;
  }
  h1 {
    margin: 0;
    position: relative;
    .poesi {
      font-family: "Berkshire Swash", cursive;
      color: rgb(244, 199, 181);
      font-weight: 400;
      font-size: 1em;
    }
    .metrica {
      font-family: "Nunito", sans-serif;
      color: rgb(239, 175, 150);
      font-size: 1.2em;
      font-weight: 400;
    }

    &::after {
      position: absolute;
      content: "";
      bottom: 0;
      left: 30%;
      width: 4.3em;
      height: 3px;
      border-radius: 5px;
      background: rgb(244, 199, 181);
      background: linear-gradient(
        93deg,
        rgba(244, 199, 181, 1) 0%,
        rgba(239, 175, 150, 1) 100%
      );
    }
  }
}
</style>
