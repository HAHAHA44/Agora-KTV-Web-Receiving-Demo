<template>
  <div class="player">
    <Lyric :current-time="currentTime"></Lyric>
  </div>
</template>

<script>
import Lyric from "./Lryic.vue";
import {
  join,
  onStreamMessage,
  getMessageDecoding,
  bindEvents,
} from "../agora";

export default {
  name: "Player",
  components: { Lyric },
  data() {
    return {
      currentTime: 0,
    };
  },
  async mounted() {
    const appid = new URL(window.location.href).searchParams.get("appid");
    const channel = new URL(window.location.href).searchParams.get("channel");
    const token =
      new URL(window.location.href).searchParams.get("token") || null;

    bindEvents(async (user, mediaType) => {
      if (
        mediaType === "audio" &&
        user.audioTrack &&
        !user.audioTrack.isPlaying
      ) {
        user.audioTrack.play();
      }
    });
    join(appid, channel, token);
    onStreamMessage((uid, msg) => {
      const stringMsg = getMessageDecoding(msg);
      console.log("rcv stream message from " + uid + ": " + stringMsg);
      const jsonMsg = JSON.parse(stringMsg);
      if (jsonMsg.cmd === "setLrcTime") {
        this.currentTime =
          (Number(jsonMsg.time) + Number(jsonMsg.lrcOffset)) / 1000;
      }
      if (jsonMsg.cmd === "musicStopped") {
        // STOP
      }
    });
  },
};
</script>
