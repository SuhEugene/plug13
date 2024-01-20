import { FetchError } from 'ofetch';

export const useConnectionString = () => {
  const connectionString = shallowRef<ConnectionString | null>(null);
  const pending = ref(false);
  const error = ref<FetchError | null>(null);

  const setPending = () => {
    error.value = null;
    pending.value = true;
  }
  const resetPending = () => { pending.value = false; }

  const fetch = async () => {
    setPending();
    try {
      const r = await $fetch('/api/connection', { credentials: 'include' });
      connectionString.value = r.connection;
    } catch (e) {
      if (e instanceof FetchError) error.value = e;
      else error.value = Error((e as any)?.message || 'Неизвестная ошибка');
    }
    resetPending();
  }

  const generate = async () => {
    if (connectionString.value) return;
    setPending();
    try {
      const r = await $fetch('/api/connection', { credentials: 'include', method: 'POST' });
      connectionString.value = r.connection;
    } catch (e) {
      if (e instanceof FetchError) error.value = e;
      else error.value = Error((e as any)?.message || 'Неизвестная ошибка');
    }
    resetPending();
  }

  const destroy = async () => {
    setPending();
    try {
      await $fetch('/api/connection', { credentials: 'include', method: 'DELETE' });
      connectionString.value = null;
    } catch (e) {
      if (e instanceof FetchError) error.value = e;
      else error.value = Error((e as any)?.message || 'Неизвестная ошибка');
    }
    resetPending();
  }

  return {
    pending, connectionString, error,
    fetch, generate, destroy
  }
}
