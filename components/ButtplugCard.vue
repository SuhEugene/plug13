<script lang="ts" setup>
import { Loader2, Search, X, XCircle, Zap } from 'lucide-vue-next';

const {
  client, error, devices,
  pending, connected, connect, disconnect,
  isScanning, startScanning, stopScanning
} = useButtplug();
const wsAddress = ref<string>();

onUnmounted(() => disconnect());
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex flex-row items-center">
        <div class="flex-grow">Buttplug.io</div>
        <ButtonDialogDisconnectButtplug v-if="connected" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Transition name="fade-then-slide" mode="out-in">
        <div v-if="!connected">
          <p class="text-sm text-center font-bold">Подключение к Intiface Central</p>
          <Input class="block mx-auto mt-2 max-w-64" placeholder="ws://127.0.0.1:12345" :disabled="pending" v-model="wsAddress" />
          <Button class="block mx-auto mt-2" variant="secondary" :disabled="pending" @click="connect(wsAddress)">
            <Zap v-if="!pending" class="w-4 h-4 mr-2 inline-block" />
            <Loader2 v-else class="w-4 h-4 mr-2 inline-block animate-spin" />
            <span>Подключиться</span>
          </Button>
        </div>
        <div v-else>
          <div v-for="device in devices">{{ device.name }}</div>
          <Transition name="fade-then-slide" mode="out-in">
            <p v-if="!devices.length && !isScanning" class="text-sm text-center text-muted-foreground">Устройства не найдены</p>
            <p v-else-if="!devices.length && isScanning" class="text-sm text-center text-muted-foreground">
              <Loader2 class="w-4 h-4 mr-2 inline-block animate-spin" />
              <span>Поиск устройств...</span>
            </p>
          </Transition>
          <Button v-if="!isScanning" class="block mx-auto mt-2" variant="secondary" size="sm" @click="startScanning()">
            <Search class="w-4 h-4 mr-2 inline-block" />
            <span>Сканировать</span>
          </Button>
          <Button v-else class="block mx-auto mt-2" variant="secondary" size="sm" @click="stopScanning()">
            <span>Завершить сканирование</span>
          </Button>
        </div>
      </Transition>
      <Transition name="fade-then-slide">
        <Alert v-if="error" :key="error.message" variant="danger" class="mt-4">
          <XCircle class="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{{ error.message }}</AlertDescription>
        </Alert>
      </Transition>
    </CardContent>
  </Card>
</template>

<style lang="scss" scoped></style>
