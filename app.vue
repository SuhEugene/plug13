<script setup lang="ts">
const metadata = {
  shortTitle: 'Plug13',
  title: 'Plug13 - SpaceStation13 + Buttplug.io',
  description: 'Экспериментальная интеграция SpaceStation13 с buttplug.io в веб-приложении! Погрузитесь в увлекательный мир космических приключений намного глубже, позволив buttplug.io передавать приятные эмоции персонажа прямиком через игрушку!',
  siteName: 'WetSkrell',
  image: '/favicon.png',
  url: 'https://plug13.wetskrell.ru',
  themeColor: '#C93152'
} as const;

useHead({
  htmlAttrs: { class: 'dark', lang: 'ru' },
  title: 'Plug13',
  link: [{ type: 'image/png', rel: 'icon', href: '/favicon.png' }],
  meta: [{ name: 'theme-color', content: metadata.themeColor }]
});

useSeoMeta({
  title: metadata.shortTitle,
  description: metadata.description,

  ogTitle: metadata.title,
  ogDescription: metadata.description,
  ogSiteName: metadata.siteName,
  ogImage: metadata.image,
  ogUrl: metadata.url,

  twitterTitle: metadata.title,
  twitterDescription: metadata.description,
  twitterImage: metadata.image,
  twitterCard: 'summary'
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
