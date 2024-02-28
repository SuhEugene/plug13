<script lang="ts" setup>
import type { ButtplugClientDevice } from 'buttplug';
import { ChevronLeft, Loader2, Search, XCircle, Zap } from 'lucide-vue-next';

const {
  error, devices,
  pending, connected, connect, disconnect,
  isScanning, startScanning, stopScanning
} = useButtplug();
const wsAddress = ref<string>();

const selectedDevice = ref<ButtplugClientDevice | null>(null);

onUnmounted(() => disconnect());
</script>

<template>
  <Card class="flex flex-col">
    <CardHeader>
      <Transition name="fade-then-slide" mode="out-in">
        <CardTitle v-if="selectedDevice === null" class="flex flex-row items-center">
            <div class="flex-grow">Buttplug.io</div>
            <ButtonDialogDisconnectButtplug v-if="connected" />
        </CardTitle>
        <CardTitle v-else class="flex flex-row items-center">
          <div class="flex-grow">{{ selectedDevice.displayName || selectedDevice.name }}</div>
          <Button variant="outline" size="sm" @click="selectedDevice = null">
              <ChevronLeft class="w-4 h-4 mr-2" />
              <span>Назад</span>
            </Button>
        </CardTitle>
      </Transition>
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
          <Transition :name="`fade-then-slide-${selectedDevice ? 'left' : 'right'}`" mode="out-in">
            <DeviceSettings
              v-if="selectedDevice !== null"
              :device="(selectedDevice as ButtplugClientDevice)"
            />
            <div v-else>
              <DeviceTable @settings="(device) => selectedDevice = device" />
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
