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
  <Card class="flex flex-col">
    <CardHeader>
      <CardTitle class="flex flex-row items-center">
        <div class="flex-grow">Buttplug.io</div>
        <ButtonDialogDisconnectButtplug v-if="connected" />
      </CardTitle>
    </CardHeader>
    <CardContent class="h-full">
      <Transition name="fade-then-slide" mode="out-in">
        <div v-if="!connected" class="h-full flex flex-col items-center justify-center lg:pb-16">
          <p class="text-sm text-center font-bold">Подключение к Intiface Central</p>
          <Input class="block mx-auto mt-2 max-w-64" placeholder="ws://127.0.0.1:12345" :disabled="pending" v-model="wsAddress" />
          <Button class="block mx-auto mt-2" variant="secondary" :disabled="pending" @click="connect(wsAddress)">
            <Zap v-if="!pending" class="w-4 h-4 mr-2 inline-block" />
            <Loader2 v-else class="w-4 h-4 mr-2 inline-block animate-spin" />
            <span>Подключиться</span>
          </Button>
        </div>
        <div v-else-if="!devices.length" class="h-full flex flex-col items-center justify-center lg:pb-16">
          <Transition name="fade-then-slide" mode="out-in">
            <p v-if="!isScanning" class="text-sm text-center text-muted-foreground">Устройства не найдены</p>
            <p v-else-if="isScanning" class="text-sm text-center text-muted-foreground">
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
        <div v-else>
          <div v-for="device in devices" @click="device.vibrate(1);device.stop()" @dblclick="">{{ device.name }}</div>
          <Button v-if="!isScanning" class="block mx-auto mt-2" variant="secondary" size="sm" @click="startScanning()">
            <Search class="w-4 h-4 mr-2 inline-block" />
            <span>Сканировать</span>
          </Button>
          <Button v-else class="block mx-auto mt-2" variant="secondary" size="sm" @click="stopScanning()">
              <Loader2 class="w-4 h-4 mr-2 inline-block animate-spin" />
            <span>Завершить сканирование</span>
          </Button>
        </div>
      </Transition>
    </CardContent>
    <Transition name="fade-then-slide">
      <CardFooter v-if="error" :key="error.message">
          <Alert variant="danger" class="mt-4">
            <XCircle class="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{{ error.message }}</AlertDescription>
          </Alert>
      </CardFooter>
    </Transition>
  </Card>
</template>

<style lang="scss" scoped></style>
