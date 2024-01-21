import { ButtplugBrowserWebsocketClientConnector, ButtplugClient, ButtplugError, type ButtplugClientDevice } from 'buttplug';

export const useButtplug = () => {
  const client = useState<ButtplugClient>('buttplug-client', () => new ButtplugClient("Plug13"));
  const devices = useState<ButtplugClientDevice[]>('buttplug-devices', () => []);
  const error = ref<Error | null>(null);
  const pending = ref(false);
  const connected = ref(client.value.connected);
  const isScanning = ref(client.value.isScanning);

  client.value.on('disconnect', () => {
    connected.value = client.value.connected;
    isScanning.value = client.value.isScanning;
    error.value = new Error('Соединение с Intiface Central потеряно');
  });
  client.value.on('deviceadded', () => devices.value = client.value.devices);
  client.value.on('deviceremoved', () => devices.value = client.value.devices);

  client.value.on('deviceadded', (...anything) => console.log('ondeviceadded', ...anything));
  client.value.on('deviceremoved', (...anything) => console.log('ondeviceremoved', ...anything));
  client.value.on('scanningfinished', () => { isScanning.value = client.value.isScanning; });


  const setPending   = () => { pending.value = true; error.value = null; }
  const resetPending = () => { pending.value = false; }

  const connect = async (address?: string) => {
    setPending();
    const connector = new ButtplugBrowserWebsocketClientConnector(address || "ws://127.0.0.1:12345/buttplug");
    try { await client.value.connect(connector); }
    catch (e) { error.value = createSimpleError(e as any, 'Не удалось подключиться к Intiface Central'); }
    // await new Promise(a => setTimeout(a, 2000));
    resetPending();
    connected.value = client.value.connected;
  }

  const disconnect = async () => {
    if (!client.value.connected) return;
    try {
      await client.value.stopAllDevices();
      await client.value.disconnect();
    } catch (e) { console.log(e); }
  }

  const startScanning = async () => {
    await client.value.startScanning();
    isScanning.value = client.value.isScanning;
  }
  const stopScanning = async () => {
    await client.value.stopScanning();
    isScanning.value = client.value.isScanning;
  }

  // const handlePageLeave = (event: Event) => {
  //   if (client.value.connected)
  //     event.preventDefault();
  // }

  // onMounted(() => { window.addEventListener('beforeunload', handlePageLeave) });
  // onUnmounted(() => { window.removeEventListener('beforeunload', handlePageLeave) });

  return {
    client: readonly(client),
    error: readonly(error),

    pending: readonly(pending),
    connected: readonly(connected),
    connect,
    disconnect,

    isScanning: readonly(isScanning),
    startScanning,
    stopScanning,

    devices: readonly(devices)
  };
}
