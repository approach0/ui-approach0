<template>
  <div class="topbar p-component p-toolbar p-d-flex p-ai-start p-jc-between p-grid">

    <div class="p-d-flex p-ai-center p-m-3" v-if="!qrybox_sinking">
      <img :src="logo32" class="p-m-1" @click="onClickIcon"/>
      <div class="p-d-flex p-flex-column">
        <span class="logo-text no-select">Approach Zero</span>
        <div class="logo-text no-select">A math-aware search engine.</div>
      </div>
    </div>

    <div class="topbar-qrybox-first p-col p-mx-4" v-if="!qrybox_sinking">
      <qrybox v-model="qrybox_model"/>
    </div>

    <div class="p-d-flex p-jc-end p-ai-center p-m-2">
      <i class="fa fa-sun-o"></i>
      <InputSwitch v-model="nightTheme" class="p-m-2"/>
      <i class="fa fa-moon-o"></i>
    </div>

    <!-- p-col-11 instead of 12 leaves nice padding in small device screen -->
    <div class="topbar-qrybox-second p-col-11 p-mx-4" v-if="!qrybox_sinking">
      <qrybox v-model="qrybox_model"/>
    </div>

  </div>

  <div style="position: fixed; width: 100%;" v-if="qrybox_sinking">
    <div class="vspacer"/>

    <div class="rellax" style="height: 100%;" data-rellax-speed="1">
      <div class="p-d-flex p-jc-center p-mb-6">
        <img class="sinking-logo" :src="logo128" @click="onClickIcon"/>
        <div class="p-d-flex p-flex-column p-jc-center p-mx-3">
          <span class="logo-text-large no-select">Approach Zero</span>
          <div class="logo-text-large no-select">A math-aware search engine.</div>
        </div>
      </div>
    </div>

    <div class="p-d-flex p-jc-center">
      <div class="p-mx-3" style="width: 100%;">
        <qrybox v-model="qrybox_model"/>
      </div>
    </div>
  </div>

  <div v-if="!qrybox_sinking" style="background-color: red; height: 3000px; width: 20px"></div>
  <Footer v-bind:useAbsPos="qrybox_sinking" style="z-index: -1"/>
</template>

<script>
const axios = require('axios')
import qrybox from './qrybox.vue'
import footer from './footer.vue'

export default {
  components: { qrybox, Footer: footer },
  mounted: function() {
    this.attachDefaultTheme()
    new Rellax('.rellax')
  },

  watch: {
    nightTheme: function (val) {
      if (val) {
        this.changeTheme('night.css')
      } else {
        this.changeTheme('light.css')
      }
    }
  },

  data: function() {
    return {
      logo128: require('./resource/logo128.png'),
      logo32: require('./resource/logo32.png'),
      nightTheme: false,
      qrybox_sinking: false,
      qrybox_model: ''
    }
  },

  methods: {
    changeTheme(cssFile) {
      let theme = document.getElementById("theme")
      theme.href = cssFile
    },

    attachDefaultTheme() {
      const theme = document.createElement('link')
      theme.type = "text/css"
      theme.rel = "stylesheet"
      theme.id = "theme"
      theme.href = 'light.css' /* default */
      document.head.appendChild(theme)
    },

    onClickIcon() {
      this.qrybox_sinking = !this.qrybox_sinking
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

body {
  color: var(--text-color);
  background-color: var(--surface-b);
  background-image: url("./resource/stars.png");
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;
}

a {
  text-decoration: none;
  color: rgb(255, 128, 128);
}

.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.logo-text:first-child {
  font-size: 1.2rem;
}

.logo-text:last-child {
  font-size: 0.8rem;
}

.logo-text-large:first-child {
  font-size: 2.0rem;
  text-shadow: 1px 1px #4eb5b0;
  font-weight: bold;
}

.logo-text-large:last-child {
  font-size: 1.0rem;
}

img.sinking-logo {
  height: 5rem;
}

div.p-toolbar {
  background-color: var(--surface-c);
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 999;
}

/* CSS doodle */
.doodle {
  position: absolute;
  right: 10%;
  bottom: -100px;
  z-index: -1;
}

div.vspacer {
  height: 25vh;
}

/* query box layout media CSS */
@media screen and (max-width: 576px) {
  .p-sm-12 {
    -webkit-box-flex: 0;
    flex: 0 0 auto;
    padding: 0.5rem;
    width: 100%;
  }
}

@media screen and (max-width: 1024px) {
  .topbar-qrybox-first {
    display: none;
  }

  div.vspacer {
    height: 5vh;
  }
}

@media screen and (min-width: 1024px) {
  .topbar-qrybox-second {
    display: none;
  }
}
</style>
