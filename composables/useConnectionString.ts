import { FetchError } from 'ofetch';

export const useConnectionString = () => {
  const connectionString = useState<ConnectionString | null>('connection-string', () => null);
  const pending = ref(false);
  const error = ref<FetchError | null>(null);

  const setPending   = () => { pending.value = true; error.value = null; }
  const resetPending = () => { pending.value = false; }

  const directFetch = async () => {
    setPending();
    try {
      const r = await $fetch('/api/connection', { credentials: 'include' });
      connectionString.value = r.connection;
    } catch (e) { error.value = createFetchError(e as any); }
    resetPending();
  }

  const setConnectionString = (data: ConnectionString) => { connectionString.value = data; }

  const generate = async () => {
    if (connectionString.value) return;
    setPending();
    try {
      const r = await $fetch('/api/connection', { credentials: 'include', method: 'POST' });
      connectionString.value = r.connection;
    } catch (e) { error.value = createFetchError(e as any); }
    resetPending();
  }

  const destroy = async () => {
    setPending();
    try {
      await $fetch('/api/connection', { credentials: 'include', method: 'DELETE' });
      connectionString.value = null;
    } catch (e) { error.value = createFetchError(e as any); }
    resetPending();
  }

  return {
    pending: readonly(pending),
    connectionString: readonly(connectionString),
    error: readonly(error),
    setConnectionString,
    directFetch, generate, destroy
  }
}
