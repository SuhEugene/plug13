<script lang="ts" setup>
import { Check, Copy, RefreshCw, Loader2, Trash, XCircle } from 'lucide-vue-next';

const {
  pending, connectionString, error,
  setConnectionString, generate, destroy,
} = useConnectionString();

const niceCode = computed(() => {
  const csv = connectionString.value;
  if (!csv) return '';
  return `${csv.value.slice(0, 5)}-${csv.value.slice(5)}`
});

function selectAll(event: MouseEvent) {
  const target = event.target as HTMLInputElement;
  target.select();
}


const codeCopiedShown = ref(false);
let codeCopiedShownTimeout: ReturnType<typeof setTimeout>;
function copyCode() {
  window.navigator.clipboard.writeText(niceCode.value);
  codeCopiedShown.value = true;

  clearTimeout(codeCopiedShownTimeout);
  codeCopiedShownTimeout = setTimeout(() => { codeCopiedShown.value = false; }, 3000)
}


const meaninglessCrap = ref<string>();
let meaninglessCrapInterval: ReturnType<typeof setInterval>;
function generateMeaninglessCrap() {
  meaninglessCrap.value = `${randomString(RndStrAlphabet.useSymbols, 5)}-${randomString(RndStrAlphabet.useSymbols, 5)}`;
}

watch(pending, (newValue) => {
  if (!newValue)
    return clearInterval(meaninglessCrapInterval);

  if (!connectionString.value) return;

  clearInterval(meaninglessCrapInterval);
  meaninglessCrapInterval = setInterval(generateMeaninglessCrap, 50);
});

onUnmounted(() => clearTimeout(codeCopiedShownTimeout));

interface EmoteData {
  type: AllowedEmote
  strength: number
  duration: number
  key: string
}
const {
  isConnected: isSocketConnected,
  connect: socketConnect,
  disconnect: socketDisconnect,
  onConnection: onSocketConnection
} = useSocket();
const { registerEmoteEvent, sendInteractions } = useButtplugControl();
onSocketConnection((socket) => {
  socket.on("ready", () => { socket.emit("get-connection"); });
  socket.on("connection-string", (data: ConnectionString) => { setConnectionString(data) });
  socket.on("update-connection", () => { socket.emit("get-connection"); });
  socket.on("emote", (emoteData: EmoteData) => {
    if (!allowedEmoteTypes.includes(emoteData.type)) return;
    if (emoteData.strength <= 0 || emoteData.strength > 1) return;
    if (emoteData.duration <= 0) return;

    registerEmoteEvent(emoteData.type, emoteData.strength, emoteData.duration);
  });
});

let interactionLoop: ReturnType<typeof setInterval>;

onMounted(() => {
  socketConnect();
  interactionLoop = setInterval(sendInteractions, 50);
})

onUnmounted(() => {
  clearInterval(interactionLoop);
  socketDisconnect();
});

</script>

<template>
  <Card class="relative">
    <template v-if="isSocketConnected">
      <CardHeader>
        <CardTitle>Код подключения</CardTitle>
        <CardDescription>Это код, предназначенный для подключения аккаунта игры к этому сайту</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-row gap-2">
        <template v-if="connectionString">
          <Input v-if="!pending" readonly class="text-center font-mono" :model-value="niceCode" @click="selectAll"  />
          <Input v-else readonly class="text-center font-mono" :model-value="meaninglessCrap" />
          <TooltipProvider :delay-duration="300" disableClosingTrigger>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline" size="icon" :disabled="pending" @click="copyCode"><Copy class="w-4 h-4" /></Button>
              </TooltipTrigger>
              <TooltipContent>Скопировать код</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="destructive" size="icon" :disabled="pending" @click="destroy"><Trash class="w-4 h-4" /></Button>
              </TooltipTrigger>
              <TooltipContent>Удалить код</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </template>
        <Button v-else class="w-full" @click="generate" :disabled="pending">
          <RefreshCw class="w-4 h-4 mr-2" :class="{'animate-spin': pending}" />
          <span>Создать новый код</span>
        </Button>
      </CardContent>
    </template>
    <template v-else>
      <CardHeader>
        <CardTitle class="flex flex-row items-center gap-2">
          <Loader2 class="animate-spin h-4 w-4" />
          <span>Подключение к сокету...</span>
        </CardTitle>
        <CardDescription>Чтобы как можно быстрее реагировать на происходящее в игре!</CardDescription>
      </CardHeader>
    </template>
    <Transition name="fade-then-slide">
      <CardFooter v-if="error">
        <Alert variant="danger" class="">
          <XCircle class="h-4 w-4" />
          <AlertTitle>Ошибка!</AlertTitle>
          <AlertDescription>{{ error?.data?.message || error?.message || 'Неизвестная ошибка!' }}</AlertDescription>
        </Alert>
      </CardFooter>
    </Transition>
    <Transition name="fade-then-slide">
      <Alert v-if="codeCopiedShown" class="absolute top-full mt-2">
        <Check class="h-4 w-4" />
        <span>Код скопирован!</span>
      </Alert>
    </Transition>
  </Card>
</template>

<style lang="scss" scoped></style>
