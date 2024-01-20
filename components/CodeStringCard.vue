<script lang="ts" setup>
import { Check, Copy, RefreshCw, Trash, XCircle } from 'lucide-vue-next';

const {
  pending, connectionString, error,
  fetch, generate, destroy,
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

onMounted(() => { fetch(); })

</script>

<template>
  <Card class="relative">
    <Transition name="fade-then-slide">
      <Alert v-if="error" variant="danger" class="absolute bottom-full mb-4">
        <XCircle class="h-4 w-4" />
        <AlertTitle>Ошибка!</AlertTitle>
        <AlertDescription>{{ error?.data?.message || error?.message || 'Lorem ipsum' }}</AlertDescription>
      </Alert>
    </Transition>
    <CardHeader>
      <CardTitle class="flex flex-row items-center gap-2">Код подключения</CardTitle>
      <CardDescription>Это код, предназначенный для подключения аккаунта игры к этому сайту</CardDescription>
    </CardHeader>
    <CardContent class="flex flex-row gap-2">
      <template v-if="connectionString">
        <Input readonly class="text-center font-mono" :model-value="niceCode" @click="selectAll"  />
        <Button variant="secondary" size="icon" @click="copyCode"><Copy class="w-4 h-4" /></Button>
        <Button variant="destructive" size="icon" :disabled="pending" @click="destroy"><Trash class="w-4 h-4" /></Button>
      </template>
      <Button v-else class="w-full" @click="generate" :disabled="pending">
        <RefreshCw class="w-4 h-4 mr-2" :class="{'animate-spin': pending}" />
        <span>Создать новый код</span>
      </Button>
    </CardContent>
    <Transition name="fade-then-slide">
      <Alert v-if="codeCopiedShown" class="absolute top-full mt-4">
        <Check class="h-4 w-4" />
        <span>Код скопирован!</span>
      </Alert>
    </Transition>
  </Card>
</template>

<style lang="scss" scoped>
.fade-then-slide-enter-active,
.fade-then-slide-leave-active
{ transition: opacity 0.13s ease-in-out, transform 0.13s ease-in-out;}
.fade-then-slide-enter-from { opacity: 0; transform: translateY(0.5rem); }
.fade-then-slide-leave-to { opacity: 0; transform: translateY(-0.5rem); }
</style>