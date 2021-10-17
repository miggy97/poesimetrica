<template>
  <button><img src="@/assets/trash.svg" alt="trash" /> Borrar todo</button>
</template>

<script>
export default {
  name: "DeleteAllButton",
};
</script>

<style lang="scss" scoped>
button {
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
</style>
