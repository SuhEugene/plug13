import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

type SocketInitFunction = (socket: Socket) => any;

export const useSocket = () => {
  const socket = useState<Socket | null>('socket-io-client', () => null);
  const isConnected = useState('socket-io-connected', () => false);
  const setupConnection = ref<SocketInitFunction>(() => null);

  const connect = () => {
    if (socket.value && socket.value.connected) return;

    socket.value = io(`${location.protocol === 'https:' ? 'wss://' : 'ws://' }${location.host}`);
    socket.value.on("connect", () => {
      if (!socket.value) return;
      setupConnection.value(socket.value);
      isConnected.value = true;
    });
    socket.value.on("disconnect", disconnect);
  }

  const disconnect = () => {
    if (socket.value) {
      if (socket.value.connected)
        socket.value.disconnect();
      socket.value.removeAllListeners();
    }
    isConnected.value = false;
  }

  const onConnection = (fn: SocketInitFunction) => { setupConnection.value = fn; }

  return {
    socket: readonly(socket),
    isConnected: readonly(isConnected),
    connect, disconnect,
    onConnection
  }
}
