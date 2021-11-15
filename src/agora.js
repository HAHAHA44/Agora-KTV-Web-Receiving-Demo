import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" });
client.on("user-published", async (user, mediaType) => {
  await client.subscribe(user, mediaType);
  if (events.onsubscribed) {
    events.onsubscribed(user, mediaType);
  }
});

const events = {
  "user-published": undefined,
  "user-unpublished": undefined,
  "user-joined": undefined,
  "user-left": undefined,
  onsubscribed: undefined,
};

export async function join(appid, channel, token, uid) {
  if (client.connectionState !== "DISCONNECTED") return;
  await client.join(appid, channel, token, uid);
}

export function getMessageDecoding(text) {
  const dec = new TextDecoder();
  return dec.decode(text);
}

export async function bindEvents(onsubscribed) {
  events.onsubscribed = onsubscribed;
}

export async function onStreamMessage(callback) {
  client.on("stream-message", callback);
}

export async function unbindEvents() {
  client.off("user-published", events["user-published"]);
  client.off("user-unpublished", events["user-unpublished"]);
  client.off("user-joined", events["user-joined"]);
  client.off("user-left", events["user-left"]);
}
