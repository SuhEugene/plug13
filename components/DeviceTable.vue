<script lang="ts" setup>
import type { ButtplugClientDevice } from 'buttplug';
import { MoreHorizontal } from 'lucide-vue-next';

const { devices } = useButtplug();
const { deviceSettings, setDeviceEnabled, toggleActuatorSetting } = useDeviceSettings();

const attributeTypes = {
  'vibrateAttributes': { name: 'Вибрирующий', key: 'vibration' },
  'oscillateAttributes': { name: 'Колеблющийся', key: 'oscillation' }
} as const;

const emoteTypes = {
  'frontEmotes': 'Пах',
  'backEmotes': 'Зад',
  'faceEmotes': 'Лицо'
} as const;

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
        <TableCell class="text-center">
          <Switch
            :checked="deviceSettings[device.name]?.enabled ?? false"
            @update:checked="(value) => setDeviceEnabled(device as ButtplugClientDevice, value)"
          />
        </TableCell>
        <TableCell>{{ device.name }}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button size="icon" variant="ghost"><MoreHorizontal class="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Тип привода</DropdownMenuLabel>
              <DropdownMenuGroup v-for="(actuatorType, attributeType) in attributeTypes">
                <DropdownMenuSub v-for="actuator in device[attributeType]">
                  <DropdownMenuSubTrigger>{{actuatorType.name}} {{ actuator.Index+1 }}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuLabel>Тип эмоута</DropdownMenuLabel>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuCheckboxItem
                      v-for="(emoteVal, emoteKey) in emoteTypes"
                      :checked="deviceSettings[device.name]?.[actuatorType.key]?.[actuator.Index][emoteKey] ?? false"
                      @select="toggleActuatorSetting(device as ButtplugClientDevice, actuatorType.key, actuator.Index, emoteKey)"
                    >
                      {{ emoteVal }}
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style lang="scss" scoped>

</style>
