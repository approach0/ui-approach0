<template>
  <div class="topbar p-component p-toolbar p-d-flex p-ai-start p-jc-between p-grid">

    <div class="p-d-flex p-ai-center">
      <img :src="logo32" class="p-m-3" @click="onClickIcon"/>
      <div class="p-d-flex p-flex-column">
        <span class="logo-text">Approach Zero</span>
        <div class="logo-text">A math-aware search engine.</div>
      </div>
    </div>

    <div class="topbar-qrybox-first p-col p-mx-4" v-if="!sinking_qrybox">
      <qrybox v-model="qrybox_model" v-model:enterValue="qrybox_enter"/>
    </div>

    <div class="p-d-flex p-jc-end p-ai-center">
      <i class="fa fa-sun-o"></i>
      <InputSwitch v-model="nightTheme" class="p-m-3"/>
      <i class="fa fa-moon-o"></i>
    </div>

    <div class="topbar-qrybox-second p-col-12 p-mx-4" v-if="!sinking_qrybox">
      <qrybox v-model="qrybox_model" v-model:enterValue="qrybox_enter"/>
    </div>

  </div>

  <div class="p-d-flex p-jc-center p-ai-end" style="height: 50vh;" v-if="sinking_qrybox">
    <div style="width: 90%">
      <qrybox v-model="qrybox_model" v-model:enterValue="qrybox_enter"/>
    </div>
  </div>

  <div style="background-color: red; height: 1800px; width: 2px"></div>

</template>

<script>
const axios = require('axios')
import qrybox from './qrybox.vue'

export default {
  components: { qrybox },
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
      logo32: require('./resource/logo32.png'),
      nightTheme: false,
      sinking_qrybox: false,

      qrybox_enter: '',
      qrybox_model: {
        chips: [
          {type: "word", str: "hello world", boolop: 'OR'},
          {type: "tex", str: "\\frac a b", boolop: 'OR'}
        ]
      }
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
      this.sinking_qrybox = !this.sinking_qrybox
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

.logo-text {
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

.a0-color {
  background-color: #54c6c0 !important;
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
}

@media screen and (min-width: 1024px) {
  .topbar-qrybox-second {
    display: none;
  }
}
</style>
