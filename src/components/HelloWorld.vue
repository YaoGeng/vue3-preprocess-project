<script setup>
import { ref } from 'vue';
import test from "./aaa";

defineProps({
  msg: String
})
//@if DEBUG==false 
test()
//@endif
/* @if DEBUG */
console.log("DEBUG=true")
/*@endif*/

/*@if DEBUG==false */
console.log("DEBUG=false")
/*@endif*/
const count = ref(0)
console.log("/* @echo MAIN_CONFIG.project.alias */")
</script>

<template>
<!--@if DEBUG==false -->
  <h1>DEBUG=false</h1>
<!-- @else -->
  <h1>DEBUG=true</h1>
<!--@endif-->
  <p>
    MAIN_CONFIG.project.alias=<!-- @echo MAIN_CONFIG.project.alias -->
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
