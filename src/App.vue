<template>
    <div id="app">
        <div class="main"></div>
    </div>
</template>

<script>
import { F } from "./utils/three";

export default {
    name: "App",

    mounted() {
        new F();
    },
};
</script>

<style>
.main {
    position: relative;
    height: 100vh;
    min-width: 100vw;
    max-width: 100vw;
    overflow: hidden;
    z-index: 1;
}
</style>
