<template>
  <div class="player">
    <Lyric ref="lyricComponent" :current-time="currentTime"></Lyric>
    <div id="syncDelayContainer">
      <input type="checkbox" id="syncDelay" v-model="syncDelaySelected" />
      <label for="syncDelay">Sync Lyric With Audio Latency</label>
    </div>
    <div
      id="autoplayWindow"
      v-if="showAutoplayWindow"
      @click="handleAutoplayFailed"
    >
      <div id="autoplayButton">Play Audio</div>
    </div>
  </div>
</template>

<script>
import Lyric from "./Lyric.vue";
import {
  join,
  getMessageDecoding,
  bindEvents,
  getPlayoutDelay,
  getAudioTrack,
} from "../agora";

export default {
  name: "Player",
  components: { Lyric },
  data() {
    return {
      currentTime: 0,
      syncDelaySelected: true,
      messageQueue: [],
      showAutoplayWindow: false,
    };
  },
  methods: {
    updateLyric: function () {
      const playoutDelay = Number(getPlayoutDelay());
      if (!playoutDelay) return;
      const now = Date.now();
      let jsonMsg;
      let index;

      if (this.syncDelaySelected) {
        for (let i = 0; i < this.messageQueue.length; i++) {
          if (this.messageQueue[i].ts + playoutDelay <= now) {
            jsonMsg = this.messageQueue[i].msg;
            index = i;
          } else {
            break;
          }
        }
      } else {
        if (!this.messageQueue.length) return;
        jsonMsg = this.messageQueue[this.messageQueue.length - 1].msg;
        index = this.messageQueue.length;
      }

      if (!jsonMsg) return;
      this.messageQueue = this.messageQueue.slice(index);
      if (jsonMsg.cmd === "setLrcTime") {
        this.currentTime =
          (Number(jsonMsg.time) + Number(jsonMsg.lrcOffset)) / 1000;
      }
      this.$nextTick(() => {
        this.$refs.lyricComponent && this.$refs.lyricComponent.scrollTheView();
      });
      if (jsonMsg.cmd === "musicStopped") {
        // STOP
      }
    },
    handleAutoplayFailed: function () {
      this.showAutoplayWindow = false;
      const audioTrack = getAudioTrack();
      audioTrack && audioTrack.play();
    },
  },
  async mounted() {
    const appid = new URL(window.location.href).searchParams.get("appid");
    const channel = new URL(window.location.href).searchParams.get("channel");
    const token =
      new URL(window.location.href).searchParams.get("token") || null;
    const onsubscribed = async (user, mediaType) => {
      if (
        mediaType === "audio" &&
        user.audioTrack &&
        !user.audioTrack.isPlaying
      ) {
        user.audioTrack.play();
      }
    };

    const onstreammessage = (uid, msg) => {
      const stringMsg = getMessageDecoding(msg);
      console.log("rcv stream message from " + uid + ": " + stringMsg);
      const jsonMsg = JSON.parse(stringMsg);
      this.messageQueue.push({ msg: jsonMsg, ts: Date.now() });
    };

    const onautoplayfailed = () => {
      this.showAutoplayWindow = true;
    };

    bindEvents(onsubscribed, onstreammessage, onautoplayfailed);
    join(appid, channel, token).catch((e) => {
      console.log(e);
      this.$notify({
        title: "<h1>Join Failed</h1>",
        text: "<h2>" + e.toString() + "</h2>",
        type: "error",
      });
    });

    const draw = () => {
      setTimeout(() => {
        this.updateLyric();
        draw();
      }, 50);
    };
    draw();
  },
};
</script>
<style scoped>
#syncDelayContainer {
  position: fixed;
  left: 10px;
  top: 10px;
}
#autoplayWindow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  line-height: 100vh;
}
#autoplayButton {
  font-size: 48px;
  color: white;
  word-wrap: break-word;
}
</style>
