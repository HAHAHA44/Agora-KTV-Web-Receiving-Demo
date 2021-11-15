<template>
  <div class="lyric">
    <div>
      <h1>{{ lyrics.name }}</h1>
      <h3>{{ lyrics.singer }}</h3>
    </div>
    <div
      v-for="paragraph in lyrics && lyrics.lyricTextWithFlag"
      :key="paragraph.index"
    >
      <p v-for="sentence in paragraph" :key="sentence.value">
        <span
          v-for="word in sentence"
          :key="word.index"
          :style="{ color: word.played ? 'blue' : 'grey' }"
          >{{ word.value }}</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import { getLrc, Lyrics } from "../utils/lrc";

export default {
  name: "Lryic",
  data() {
    return {
      lyrics: new Lyrics(),
    };
  },
  props: {
    currentTime: Number,
  },
  watch: {
    currentTime(cur) {
      this.lyrics.currentTime = cur;
    },
  },
  async mounted() {
    const xmlLrc = await getLrc("./lrc.xml");
    this.lyrics.parseXmlLrc(xmlLrc);
  },
};
</script>
