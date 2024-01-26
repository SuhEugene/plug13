import type { ButtplugClientDevice } from "buttplug"

type ActuatorSettings = { [Property in AllowedEmote]: boolean};

type DeviceSettings = {
  [Property in AllowedInteraction]: ActuatorSettings[]
}
type UsableDeviceSettings = { enabled: boolean } & Partial<DeviceSettings>;

type DeviceSeetingsRecord = Record<string, UsableDeviceSettings>;

export const useDeviceSettings = () => {
  const deviceSettings = useState<DeviceSeetingsRecord>('device-settings', () => ({}));

  const sanitizeActuatorArray = (arr: ActuatorSettings[]) => {
    const out = [];
    for (const actuator of arr) {
      const emoteObj: Partial<ActuatorSettings> = {};
      for (const emoteType of allowedEmoteTypes)
        emoteObj[emoteType] = actuator[emoteType];
      out.push(emoteObj as ActuatorSettings);
    }
    if (out.length) return out;
    return false;
  }

  const sanitizeDeviceSettings = (settings: DeviceSeetingsRecord) => {
    let newSettings: DeviceSeetingsRecord = {};
    for (const deviceName in settings) {
      const device = settings[deviceName];
      if (device.enabled !== false && device.enabled !== true) continue;
      newSettings[deviceName] = { enabled: device.enabled };


      if (device.vibration instanceof Array)
        newSettings[deviceName].vibration = sanitizeActuatorArray(device.vibration) || undefined;

      if (device.oscillation instanceof Array)
        newSettings[deviceName].oscillation = sanitizeActuatorArray(device.oscillation) || undefined;
    }
    return newSettings;
  }

  const loadDeviceSettings = () => {
    const settingsString = localStorage.getItem('deviceSettings');
    if (!settingsString) return;
    try {
      const settingsJSON = JSON.parse(settingsString);
      deviceSettings.value = sanitizeDeviceSettings(settingsJSON);
    } catch(e) { console.error(e); }
  }

  const saveDeviceSettings = () => {
    localStorage.setItem('deviceSettings', JSON.stringify(deviceSettings.value));
  }

  const createDeviceActuators = (obj: UsableDeviceSettings, type: AllowedInteraction, amount: number) => {
    const arr: ActuatorSettings[] = [];
    for (let i = 0; i < amount; i++) {
      const emoteObj: Partial<ActuatorSettings> = {};
      for (const emoteType of allowedEmoteTypes)
        emoteObj[emoteType] = false;
      arr.push(emoteObj as ActuatorSettings);
    }
    obj[type] = arr;
  }

  const createDevice = (device: ButtplugClientDevice) => {
    deviceSettings.value[device.name] = { enabled: false };
    if (device.vibrateAttributes) createDeviceActuators(deviceSettings.value[device.name], 'vibration', device.vibrateAttributes.length);
    if (device.oscillateAttributes) createDeviceActuators(deviceSettings.value[device.name], 'oscillation', device.oscillateAttributes.length);
  }

  const setDeviceEnabled = (device: ButtplugClientDevice, value: boolean) => {
    if (!deviceSettings.value[device.name]) createDevice(device);
    deviceSettings.value[device.name].enabled = value;
  }

  const toggleActuatorSetting = (device: ButtplugClientDevice, actuator: 'vibration' | 'oscillation', index: number, setting: keyof ActuatorSettings) => {
    if (!deviceSettings.value[device.name]) createDevice(device);
    if (!deviceSettings.value[device.name][actuator]) createDevice(device);
    if (!deviceSettings.value[device.name][actuator]![index]) createDevice(device);

    // Playful way to fuck with JS
    const value = deviceSettings.value[device.name][actuator]![index];
    value[setting] = !value[setting];

    saveDeviceSettings();
  }

  onMounted(() => loadDeviceSettings());

  return {
    deviceSettings: readonly(deviceSettings),
    setDeviceEnabled,
    toggleActuatorSetting
  }
}
