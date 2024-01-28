import { version } from './package.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/global.scss'],
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  runtimeConfig: {
    jwtSecret: 'super-secret',
    byondSecret: 'very-secret',
    discordClientSecret: 'super-secret',
    public: {
      version,
      discordClientId: '1197984072862007417',
      origin: 'http://localhost:3000'
    }
  }
})
