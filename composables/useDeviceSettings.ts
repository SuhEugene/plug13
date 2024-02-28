import type { ButtplugClientDevice } from "buttplug"

// number - число от 0 до 200, требует деления на 100
type ActuatorSettings = { [Property in AllowedEmote]: number};

type DeviceSettings = {
  [Property in AllowedInteraction]: ActuatorSettings[]
}
type UsableDeviceSettings = {
  enabled: boolean,
  actuators: Partial<DeviceSettings>
};

type DeviceSeetingsRecord = Record<number, UsableDeviceSettings>;

export const useDeviceSettings = () => {
  const deviceSettings = useState<DeviceSeetingsRecord>('device-settings', () => ({}));

  const sanitizeActuatorArray = (arr: ActuatorSettings[]) => {
    const out = [];
    for (const actuator of arr) {
      const emoteObj: Partial<ActuatorSettings> = {};
      for (const emoteType of allowedEmoteTypes)
        emoteObj[emoteType] = actuator[emoteType] ?? 0;
      out.push(emoteObj as ActuatorSettings);
    }
    if (out.length) return out;
    return false;
  }

  const sanitizeDeviceSettings = (settings: DeviceSeetingsRecord) => {
    let newSettings: DeviceSeetingsRecord = {};
    for (const deviceId in settings) {
      const device = settings[deviceId];
      if (device.enabled !== false && device.enabled !== true) continue;
      newSettings[deviceId] = { enabled: device.enabled, actuators: {} };

      const newActuators = newSettings[deviceId].actuators;
      for (const interactionType of allowedInteractionTypes) {
        const actuator = device.actuators[interactionType];
        if (actuator instanceof Array)
          newActuators[interactionType] = sanitizeActuatorArray(actuator) || undefined;
      }
    }
    return newSettings;
  }

  const tryDropOldSettings = () => localStorage.removeItem('deviceSettings');

  const loadDeviceSettings = () => {
    const settingsString = localStorage.getItem('device-settings');
    if (!settingsString) return tryDropOldSettings();
    try {
      const settingsJSON = JSON.parse(settingsString);
      deviceSettings.value = sanitizeDeviceSettings(settingsJSON);
    } catch(e) { console.error(e); }
  }

  const saveDeviceSettings = () => {
    localStorage.setItem('device-settings', JSON.stringify(deviceSettings.value));
  }

  const createDeviceActuators = (deviceSettings: UsableDeviceSettings, type: AllowedInteraction, amount: number) => {
    const arr: ActuatorSettings[] = [];
    for (let i = 0; i < amount; i++) {
      const emoteObj: Partial<ActuatorSettings> = {};
      for (const emoteType of allowedEmoteTypes)
        emoteObj[emoteType] = 100;
      arr.push(emoteObj as ActuatorSettings);
    }
    deviceSettings.actuators[type] = arr;
  }

  const createDevice = (device: ButtplugClientDevice) => {
    deviceSettings.value[device.index] = { enabled: false, actuators: {} };
    if (device.vibrateAttributes) createDeviceActuators(deviceSettings.value[device.index], 'vibration', device.vibrateAttributes.length);
    if (device.oscillateAttributes) createDeviceActuators(deviceSettings.value[device.index], 'oscillation', device.oscillateAttributes.length);
  }

  const setDeviceEnabled = (device: ButtplugClientDevice, value: boolean) => {
    if (!deviceSettings.value[device.index]) createDevice(device);
    deviceSettings.value[device.index].enabled = value;
    saveDeviceSettings();
  }

  const isDeviceEnabled = (device: ButtplugClientDevice) => deviceSettings.value[device.index]?.enabled ?? false;

  const getDeviceSettings = (device: ButtplugClientDevice) => {
    if (!deviceSettings.value[device.index]) createDevice(device);
    return deviceSettings.value[device.index];
  }

  onMounted(() => loadDeviceSettings());

  return {
    deviceSettings: readonly(deviceSettings),
    setDeviceEnabled, isDeviceEnabled,
    getDeviceSettings, saveDeviceSettings
  }
}
