<script>
export default {
  name: 'App',
}
localStorage.setItem('secret', 'shhhared-secret')
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
