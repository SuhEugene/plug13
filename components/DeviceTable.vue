<script lang="ts" setup>
import { Cable, MoreHorizontal, X } from 'lucide-vue-next';

const { devices } = useButtplug();

interface Settings {
  enabled: boolean
  frontEmotes: boolean
  backEmotes: boolean
  faceEmotes: boolean
}

const deviceSettings: Record<string, Settings> = {};

function loadDeviceSettings() {
  const settingsString = localStorage.getItem('deviceSettings');
  if (!settingsString) return;
  try {
    const settingsJSON = JSON.parse(settingsString);
  } catch(e) { console.error(e); }
}

onMounted(() => loadDeviceSettings())
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-16 text-center"></TableHead>
        <TableHead>Устройство</TableHead>
        <TableHead class="w-16"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="device in devices" :key="device.name">
        <TableCell class="text-center"><Switch /></TableCell>
        <TableCell>{{ device.name }}</TableCell>
        <TableCell>
          <Popover side="left">
            <PopoverTrigger as-child>
              <Button size="icon" variant="ghost"><MoreHorizontal class="w-4 h-4" /></Button>
            </PopoverTrigger>
            <PopoverContent>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style lang="scss" scoped>

</style>
