<script setup lang="ts">
useHead({
  htmlAttrs: { class: 'dark', lang: 'ru' }
});

const { pending, logIn, isLoggedIn, fetchUser } = useAccount();
const route = useRoute();

onMounted(async () => {
  await fetchUser();
  if (route.query.code)
    logIn(route.query.code as string);
})

</script>

<template>
  <div class="container min-h-screen h-full px-6 flex flex-col justify-center items-center">
    <LoadingCard v-if="pending" />
    <LogInCard v-else-if="!isLoggedIn" />
    <ManagementPanel v-else />
  </div>
</template>

<style>
* { box-sizing: border-box; }
html { scrollbar-gutter: stable; }
html, #__nuxt { height: 100%; }
html, body {
  max-width: 100vw;
  overflow-x: hidden;
}
body {
  min-height: 100%;
  min-height: 100vh;
}
::selection {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.fade-then-slide-enter-active,
.fade-then-slide-leave-active
{ transition: opacity 0.13s ease-in-out, transform 0.13s ease-in-out;}
.fade-then-slide-enter-from { opacity: 0; transform: translateY(0.5rem); }
.fade-then-slide-leave-to { opacity: 0; transform: translateY(-0.5rem); }
</style>
