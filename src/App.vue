<template>
  <div id="app">
    <img alt="Pic" src="./assets/avatar.jpeg" />
    <Player />
    <notifications position="top right" width="400px" :duration="2000000" />
  </div>
</template>

<script>
import Player from "./components/Player.vue";

export default {
  name: "App",
  components: {
    Player,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  overflow: scroll;
}
</style>
