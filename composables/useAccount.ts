import { randomString } from "~/utils/simpleFunctions";

export const useAccount = () => {
  const route = useRoute();
  const router = useRouter();
  const { discordClientId, origin } = useRuntimeConfig().public;

  const isLoggedIn = shallowRef(false);
  // const pending = shallowRef(false);
  // const userAccount = shallowRef<User | null>(null);

  const { data: userAccount, pending, refresh } = useFetch('/api/account', {
    key: 'userdata',
    credentials: 'include',
    deep: false,
    immediate: false,
    onResponse(ctx) {
      if (ctx.error) { isLoggedIn.value = false; return; }
      if (ctx.response._data.id) { isLoggedIn.value = true; }
    }
  });
  
  const fetchUser = async () => {
    await refresh();
  }
  
  const openOauth2Page = () => {
    const state = randomString(RndStrAlphabet.useAll, 16);
    sessionStorage.setItem('discordState', state);

    const url = new URL('https://discord.com/api/oauth2/authorize');
    url.searchParams.append('client_id', discordClientId);
    url.searchParams.append('redirect_uri', `${origin}/`);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'identify');
    url.searchParams.append('prompt', 'none');
    url.searchParams.append('state', state);

    navigateTo(url.toString(), { external: true });
  }

  const logIn = async (code: string) => {
    if (process.server)
      throw Error('This function is supposed to run only on the client');

    if (isLoggedIn.value) return;

    const state = sessionStorage.getItem('discordState');
    if (!state || state !== route.query.state) return;

    try {
      const data = await $fetch('/api/auth', {
        key: 'userdata',
        method: 'POST',
        body: { code }
      });
      
      if (!data.id) return;

      router.replace({ query: {} });
      userAccount.value = data;
      isLoggedIn.value = true;
    } catch(e) { console.log("DataError", e); }
  }

  return {
    userAccount, isLoggedIn, pending,
    openOauth2Page, fetchUser, logIn
  }
}
