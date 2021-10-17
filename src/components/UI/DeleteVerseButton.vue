<template>
  <div class="circle">
    <div class="lineOne"></div>
    <div class="lineTwo"></div>
  </div>
</template>

<script>
export default {
  name: "DeleteVerseButton",
};
</script>

<style lang="scss" scoped>
.circle {
  width: 1.2em;
  height: 1.2em;
  background: rgba(255, 79, 88, 0.5);
  border-radius: 50%;
  position: relative;
  cursor: pointer;

  &:hover {
    background: rgba(255, 79, 88, 0.8);
  }

  .lineOne {
    width: 0.8em;
    height: 2px;
    position: absolute;
    background: white;
    border-radius: 2px;
    left: 50%;
    margin-left: -0.4em;
    top: 50%;
    margin-top: -1px;
    transform: rotate(45deg);
  }
  .lineTwo {
    width: 0.8em;
    height: 2px;
    position: absolute;
    background: white;
    border-radius: 2px;
    left: 50%;
    margin-left: -0.4em;
    top: 50%;
    margin-top: -1px;
    transform: rotate(-45deg);
  }
}
</style>
