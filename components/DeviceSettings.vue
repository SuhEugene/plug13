<script lang="ts" setup>
import type { ButtplugClientDevice } from 'buttplug';

const { devices } = useButtplug();
const { getDeviceSettings, saveDeviceSettings } = useDeviceSettings();

interface Props { device: ButtplugClientDevice }
const props = defineProps<Props>();

const deviceSettings = computed(() => getDeviceSettings(props.device));

const actuatorTypes = {
  'vibration': 'Вибрирующий',
  'oscillation': 'Колеблющийся'
} as const;

const emoteTypes = {
  'front': 'Пах',
  'back': 'Зад',
  'chest': 'Грудь',
  'face': 'Лицо',
  'basic': 'Обычный',
  'masochism': 'Мазохизм'
} as const;

</script>

<template>
  <div>
    <template v-for="(actuators, actuatorType) in deviceSettings.actuators" :key="actuatorType">
      <template v-for="(actuator, index) in actuators" :key="`ac-${index}`">
        <h4 class="text-lg font-semibold tracking-tight mb-4 mt-6 first:mt-0">{{ actuatorTypes[actuatorType] }} {{ index }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div class="" v-for="(emote, emoteType) in actuator" :key="emoteType">
            <h6 class="text-sm font-semibold tracking-tight mb-2 mt-4 first:mt-0">{{ emoteTypes[emoteType] }}</h6>
            <div class="flex flex-row gap-4">
              <Slider
                :max="200"
                :min="0"
                :step="5"
                v-model="deviceSettings.actuators[actuatorType]![index][emoteType]"
                @value-commit="saveDeviceSettings"
              />
              <Input
                class="basis-16"
                type="number"
                :max="200"
                :min="0"
                :step="1"
                v-model="deviceSettings.actuators[actuatorType]![index][emoteType]"
                @change="saveDeviceSettings"
              />
            </div>
          </div>
        </div>
      </template>
    </template>
    <!-- <Slider v-model="deviceSettings"/> -->
  </div>
</template>

<style lang="scss" scoped>

</style>
