# ktv-demo

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Introduction

Agora KTV Demo for Web. Support receive the people voice and BGM from native KTV Demo(https://docs.agora.io/cn/online-ktv/downloads?platform=All%20Platforms).

to run the app in development mode, you can step the following:

1. replace the lyric file to your lyric file at public/lrc.xml. (just support one song)

2. yarn serve

3. visit this link with your AppID, Token, and Channel, if you do not need Token, not set it.
 http://localhost:8081/?appid=<YOUR_APPID>&token=<YOUR_TOKEN>&channel=<YOUR_CHANNEL>