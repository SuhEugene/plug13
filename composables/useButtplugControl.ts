type EmotesObject = { [Property in AllowedEmote]: number};
type RecentEmotesObject = { [Property in AllowedEmote]: boolean};

const VIBRATION_LENGTH = 800;
const STRENGTH: { [Property in AllowedEmote]: number} = {
  face: 0.5,
  back: 0.8,
  front: 0.8,
  basic: 0.2
}

export const useButtplugControl = () => {
  const { deviceSettings } = useDeviceSettings();
  const { connected, devices } = useButtplug();


  type Device = (typeof devices.value)[number];
  type ActuatorSettingsArr = (typeof deviceSettings.value)[string][AllowedInteraction];
  type ActuatorSettings = Exclude<ActuatorSettingsArr, undefined>[number];

  const emotesUsed = useState<EmotesObject>('emotes-used', () => {
    let emotes: Partial<EmotesObject> = {};
    for (const emote of allowedEmoteTypes)
      emotes[emote] = 0;
    return (emotes as EmotesObject);
  });

  const getRecentEmotes = () => {
    const emoteDates = emotesUsed.value;
    const recentEmotes: Partial<RecentEmotesObject> = {};
    const now = Date.now();
    for (const emoteType in emoteDates) {
      const date = emoteDates[emoteType as AllowedEmote];
      recentEmotes[emoteType as AllowedEmote] = (now - date) < VIBRATION_LENGTH;
    }
    return (recentEmotes as RecentEmotesObject);
  }

  const findStrongestEmote = (settings: ActuatorSettings, recentEmotes: RecentEmotesObject) => {
    let max = 0;
    for (const emoteType of allowedEmoteTypes) {
      if (!settings[emoteType]) continue;
      if (!recentEmotes[emoteType]) continue;
      if (max > STRENGTH[emoteType]) continue;
      max = STRENGTH[emoteType];
    }
    return max;
  }

  const getInteractionsArray = (device: Device, recentEmotes: RecentEmotesObject, type: AllowedInteraction) => {
    const settings = deviceSettings.value[device.name][type];
    if (!settings) return false;

    const todo: number[] = [];
    todo.length = settings.length;
    for (let i = 0; i < settings.length; i++) {
      const actuator = settings[i];
      todo[i] = findStrongestEmote(actuator, recentEmotes);
    }
    return todo;
  }


  const registerEmote = (emoteType: AllowedEmote) => {
    if (!connected) return;
    emotesUsed.value[emoteType] = Date.now();
  }

  const sendInteractions = () => {
    const recentEmotes = getRecentEmotes();
    const currentDevices = devices.value;
    for (const device of currentDevices) {
      const settings = deviceSettings.value[device.name];
      if (!settings || !settings.enabled) continue;
      for (const interactionType of allowedInteractionTypes) {
        const sendObj = getInteractionsArray(device, recentEmotes, interactionType);
        if (!sendObj) continue;
        if (interactionType === "vibration") device.vibrate(sendObj);
        if (interactionType === "oscillation") device.oscillate(sendObj);
      }
    }
  }

  return { registerEmote, sendInteractions };
}
