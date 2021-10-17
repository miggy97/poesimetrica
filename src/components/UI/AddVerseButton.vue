<template>
  <div class="circle">
    <div class="ver-line"></div>
    <div class="hor-line"></div>
  </div>
</template>

<script>
export default {
  name: "AddVerseButton",
};
</script>

<style lang="scss" scoped>
.circle {
  width: 1.2em;
  height: 1.2em;
  background: rgba(76, 175, 80, 0.5);
  border-radius: 50%;
  position: relative;
  cursor: pointer;

  &:hover {
    background: rgba(76, 175, 80, 0.8);
  }

  .hor-line {
    width: 0.8em;
    height: 2px;
    position: absolute;
    background: white;
    border-radius: 2px;
    left: 50%;
    margin-left: -0.4em;
    top: 50%;
    margin-top: -1px;
  }
  .ver-line {
    width: 2px;
    height: 0.8em;
    position: absolute;
    background: white;
    border-radius: 2px;
    left: 50%;
    margin-left: -1px;
    top: 50%;
    margin-top: -0.4em;
  }
}
</style>
