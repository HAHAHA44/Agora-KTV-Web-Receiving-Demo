import xml2Js from "xml-js";

export async function getLrc(url) {
  return fetch(url).then((response) => response.text());
}

export class Lyrics {
  lrcGeneral = {
    name: {
      _text: "突然好想你",
    },
    singer: {
      _text: "五月天",
    },
    _comment: "歌曲的类型(1.快歌，2.慢歌)",
    type: {
      _text: "1",
    },
    mode_type: {
      _text: "chorus",
    },
  };

  midiLrc = undefined;
  currentTime = 0;

  constructor() {}

  get name() {
    return this.lrcGeneral.name._text;
  }

  get singer() {
    return this.lrcGeneral.singer._text;
  }

  get lyricText() {
    try {
      return this.midiLrc.paragraph.map((p) =>
        p.sentence.map((s) =>
          s.tone
            .map((t) => {
              return t.word._text;
            })
            .filter((w) => !!w)
        )
      );
    } catch (e) {
      return [[[]]];
    }
  }

  get lyricTextWithFlag() {
    try {
      return this.midiLrc.paragraph.map((p) =>
        p.sentence.map((s) =>
          s.tone
            .map((t) => {
              return {
                value: t.word._text,
                played: Number(t._attributes.begin) < this.currentTime,
                playing:
                  Number(t._attributes.begin) < this.currentTime &&
                  this.currentTime < Number(t._attributes.end),
              };
            })
            .filter((w) => !!w)
        )
      );
    } catch (e) {
      return [[[]]];
    }
  }

  parseXmlLrc(xml) {
    var res = xml2Js.xml2js(xml, { compact: true, spaces: 4 });
    this.lrcGeneral = res.song.general;
    this.midiLrc = res.song.midi_lrc;
    console.log(res);
  }

  updateCurrentTime(time) {
    this.currentTime = time;
  }
}

(async () => {
  const xmlLrc = await getLrc("./lrc.xml");
  const lrc = new Lyrics();
  lrc.parseXmlLrc(xmlLrc);
  window.xml = lrc;
})();
