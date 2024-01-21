<script lang="ts" setup>
import { Check, Copy, RefreshCw, Trash, XCircle } from 'lucide-vue-next';

const {
  pending, connectionString, error,
  fetch, generate, destroy,
} = useConnectionString();

const meaninglessCrap = ref<string>();

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
})

onMounted(() => { fetch(); });

onUnmounted(() => {
  clearTimeout(codeCopiedShownTimeout);
});

</script>

<template>
  <Card class="relative">
    <CardHeader>
      <CardTitle class="flex flex-row items-center gap-2">Код подключения</CardTitle>
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
    <Transition name="fade-then-slide">
      <CardFooter v-if="error">
        <Alert variant="danger" class="">
          <XCircle class="h-4 w-4" />
          <AlertTitle>Ошибка!</AlertTitle>
          <AlertDescription>{{ error?.data?.message || error?.message || 'Lorem ipsum' }}</AlertDescription>
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
