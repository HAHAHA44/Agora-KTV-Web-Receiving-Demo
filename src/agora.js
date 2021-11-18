import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({
  codec: "vp8",
  mode: "live",
  role: "audience",
});

client.on("user-published", async (user, mediaType) => {
  await client.subscribe(user, mediaType);
  if (events.onsubscribed) {
    events.onsubscribed(user, mediaType);
  }
});

const events = {
  onstreammessage: undefined,
  onautoplayfailed: undefined,
  onsubscribed: undefined,
};

export async function join(appid, channel, token, uid) {
  if (client.connectionState !== "DISCONNECTED") return;
  await client.join(appid, channel, token, uid);
}

export function getPlayoutDelay() {
  const stats = Object.values(client.getRemoteAudioStats())[0];
  return stats && stats.receiveDelay;
}

export function getMessageDecoding(text) {
  const dec = new TextDecoder();
  return dec.decode(text);
}

export async function bindEvents(
  onsubscribed,
  onstreammessage,
  onautoplayfailed
) {
  events.onsubscribed = onsubscribed;
  events.onstreammessage = onstreammessage;
  client.on("stream-message", onstreammessage);
  events.onautoplayfailed = onautoplayfailed;
  AgoraRTC.onAutoplayFailed = onautoplayfailed;
}

export async function unbindEvents() {
  client.off("stream-message", events.onstreammessage);
  AgoraRTC.onAutoplayFailed = undefined;
}

export function getAudioTrack() {
  const user = client.remoteUsers[0];
  if (user) return user.audioTrack;
}
