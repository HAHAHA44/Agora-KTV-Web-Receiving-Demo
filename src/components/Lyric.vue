<template>
  <div class="lyric" ref="lyricRoot">
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
          :class="{ activeWord: word.playing }"
          :style="{ color: word.played ? 'blue' : 'grey' }"
          >{{ word.value }}</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import { getLrc, Lyrics } from "../utils/lrc";
let currentWordDom;

export default {
  name: "Lyric",
  data() {
    return {
      lyrics: new Lyrics(),
    };
  },
  props: {
    currentTime: Number,
  },
  methods: {
    scrollTheView() {
      const activeWordDom =
        this.$refs.lyricRoot.getElementsByClassName("activeWord")[0];
      if (activeWordDom === currentWordDom) return;
      currentWordDom = activeWordDom;
      console.log(
        "scrill the view, current active word: ",
        currentWordDom && currentWordDom.innerHTML
      );
      currentWordDom &&
        currentWordDom.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
    },
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

<style scoped>
span {
  transition: color 0.5s ease;
}
</style>
