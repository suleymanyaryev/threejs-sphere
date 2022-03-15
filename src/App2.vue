<template>
    <div id="#app">
        <div class="app">
            <div class="wrapper w-full bg-black">
                <div
                    class="fixed left-0 top-0 z-2 w-full h-full text-8xl text-white flex items-center justify-center"
                >
                    Hello world!
                </div>

                <div v-for="i in 8" :key="i" class="h-screen"></div>
            </div>

            <div class="fixed z-1 left-0 top-0 opacity-0 pointer-events-none">
                <img
                    src="@/assets/boardriders.jpg"
                    alt="Image of the sea"
                    class="project__item__img"
                />

                <img
                    src="@/assets/silviasguotti.jpg"
                    alt="Skater"
                    class="project__item__img"
                />
                <img
                    src="@/assets/playground.jpg"
                    alt="Abstract night"
                    class="project__item__img"
                />
                <img
                    src="@/assets/sisters.jpg"
                    alt="Hailey Bieber and Kelia Moniz"
                    class="project__item__img"
                />
                <img
                    src="@/assets/sustainability.jpg"
                    alt="Sea"
                    class="project__item__img"
                />
                <img
                    src="@/assets/originals.jpg"
                    alt="Mens facing the ocean"
                    class="project__item__img"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { Wave } from "@/utils/my-wave";

export default {
    mounted() {
        new Wave();
    },
};
</script>

<style>
.webgl {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    pointer-events: none;
}
</style>
