type RecentEmotesObject = { [Property in AllowedEmote]: number};

interface EmoteEvent {
  id: number
  type: AllowedEmote
  strength: number
  duration: number
  timestamp: number
}

export const useButtplugControl = () => {
  const { deviceSettings } = useDeviceSettings();
  const { connected, devices } = useButtplug();


  type Device = (typeof devices.value)[number];
  type ActuatorSettingsArr = (typeof deviceSettings.value)[string][AllowedInteraction];
  type ActuatorSettings = Exclude<ActuatorSettingsArr, undefined>[number];

  const emoteEventArray = useState<EmoteEvent[]>('emote-event-array', () => []);

  const createRecentEmotesObject = () => {
    const recentEmotes: Partial<RecentEmotesObject> = {};
    for (const type of allowedEmoteTypes)
      recentEmotes[type] = 0;
    return (recentEmotes as RecentEmotesObject);
  }

  const checkForRecentEmotes = () => {
    const emoteEvents = emoteEventArray.value;
    const recentEmotes = createRecentEmotesObject();
    const now = Date.now();
    for (const event of emoteEvents) {
      if ((now - event.timestamp) > event.duration) {
        console.log("Found event of timestamp diff", now - event.timestamp, "and dur", event.duration);
        removeEmoteEvent(event.id);
        continue;
      }
      recentEmotes[event.type] = Math.max(recentEmotes[event.type], event.strength);
    }
    return recentEmotes;
  }

  const findStrongestEmote = (settings: ActuatorSettings, recentEmotes: RecentEmotesObject) => {
    let max = 0;
    for (const emoteType of allowedEmoteTypes) {
      if (!settings[emoteType]) continue;
      if (max > recentEmotes[emoteType]) continue;
      max = recentEmotes[emoteType];
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

  const registerEmoteEvent = (emoteType: AllowedEmote, strength: number, duration: number) => {
    if (!connected) return;
    if (strength <= 0 || strength > 1) return;
    duration = clamp(duration, 100, 8000);
    emoteEventArray.value.push({
      id: Math.floor(Math.random() * 100000),
      type: emoteType,
      timestamp: Date.now(),
      strength, duration
    });
    console.log("Pushed new emote to the loop", emoteEventArray.value);
  }

  const removeEmoteEvent = (eventId: number) => {
    const eventIndex = emoteEventArray.value.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;
    emoteEventArray.value.splice(eventIndex, 1);
  }

  const sendInteractions = () => {
    const recentEmotes = checkForRecentEmotes();
    // console.log(recentEmotes);
    const currentDevices = devices.value;
    for (const device of currentDevices) {
      const settings = deviceSettings.value[device.name];
      if (!settings || !settings.enabled) continue;
      for (const interactionType of allowedInteractionTypes) {
        const sendObj = getInteractionsArray(device, recentEmotes, interactionType);
        if (!sendObj) continue;
        if (interactionType === "vibration") device.vibrate(sendObj).catch(e => console.error("Tried 'vibration' interaction, but encountered an error:", e));
        if (interactionType === "oscillation") device.oscillate(sendObj).catch(e => console.error("Tried 'oscillation' interaction, but encountered an error:", e));
      }
    }
  }

  return {
    emoteEventArray: readonly(emoteEventArray),
    registerEmoteEvent,
    sendInteractions
  };
}
