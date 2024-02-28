<script lang="ts" setup>
import type { ButtplugClientDevice } from 'buttplug';
import { Settings2 } from 'lucide-vue-next';

const { devices } = useButtplug();
const {
  setDeviceEnabled,
  isDeviceEnabled
} = useDeviceSettings();

const emit = defineEmits<{
  (e: 'settings', device: ButtplugClientDevice): void
}>();

</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-24 text-center">Вкл/Выкл</TableHead>
        <TableHead>Устройство</TableHead>
        <TableHead class="w-16"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="device in devices" :key="device.name">
        <TableCell class="text-center">
          <Switch
            :checked="isDeviceEnabled(device as ButtplugClientDevice)"
            @update:checked="(value) => setDeviceEnabled(device as ButtplugClientDevice, value)"
          />
        </TableCell>
        <TableCell>{{ device.displayName || device.name }}</TableCell>
        <TableCell>
          <Button size="icon" variant="ghost" @click="emit('settings', device as ButtplugClientDevice)">
            <Settings2 class="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style lang="scss" scoped>

</style>
