<script setup lang="ts">
import { GithubLogoIcon } from '@radix-icons/vue';

const metadata = {
  shortTitle: 'Plug13',
  title: 'Plug13 - SpaceStation13 + Buttplug.io',
  description: 'Погрузитесь в увлекательный мир SpaceStation13 намного глубже, позволив Buttplug.io передавать приятные эмоции персонажа прямиком через игрушку!',
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


const { public: { version } } = useRuntimeConfig();
onMounted(() => {
  console.log(
    `%cPlug13 %c v${version}`,
    'background-color:hsl(346.8 61% 49%);color:hsl(355.7 100% 97.3%);padding:2px 2px 2px 10px;font-weight:bold;border:1px solid hsl(240 3.7% 10.9%);border-radius:6px 0 0 6px;border-right:none;',
    'background-color:hsl(240 3.7% 15.9%);color:hsl(0 0% 98%);padding:2px 10px 2px 2px;font-weight:bold;border:1px solid hsl(240 3.7% 10.9%);border-radius:0 6px 6px 0;border-left:none;'
  );
});

</script>

<template>
  <div class="container min-h-screen h-full px-6 flex flex-col justify-center items-center">
    <LoadingCard v-if="pending" />
    <LogInCard v-else-if="!isLoggedIn" />
    <ManagementPanel v-else />
    <a
      class="fixed bottom-0 left-0 p-2 border-t border-r rounded-tr-xl transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      href="https://github.com/SuhEugene/plug13">
      <GithubLogoIcon class="w-4 h-4" />
    </a>
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
