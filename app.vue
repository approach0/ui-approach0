<template>
  <div class="topbar p-component p-toolbar p-grid flex-wrap-reverse">
    <div class="p-d-flex p-ai-center p-md-6 p-sm-12 p-xsm-12">
      <img :src="logo32" class="p-mx-3"/>
      <div class="p-d-flex p-flex-column">
        <span class="logo-text">Approach Zero</span>
        <div class="logo-text">A math-aware search engine.</div>
      </div>
    </div>

    <div class="p-d-flex p-jc-end p-ai-center p-md-6 p-sm-12 p-xsm-12 p-my-2">
      <i class="las la-sun"></i>
      <InputSwitch v-model="nightTheme" class="p-mx-3"/>
      <i class="las la-moon"></i>
    </div>
  </div>

  <css-doodle class="doodle rellax" data-rellax-speed="6">
    @grid: 40x2 / 60%;
    @place-cell: center;
    @size: calc(100% / @size * @i);

    transform: rotate(calc(@i * 5deg));

    border-radius: 30%;
    border: 1px solid hsla(
      calc(10 + 4 * @i), 70%, 68%, @r.8
    );
  </css-doodle>

  <div class="p-d-flex p-jc-center p-ai-end" style="height: 50vh;">
    <div style="width: 90%">
      <qrybox/>
    </div>
  </div>

  <div style="background-color: grey; height: 1800px; width: 2px"></div>

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
      inputBox: '',
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

/* line awesome */
.las,.lab {
  font-size: 1.5rem;
}

.a0-color {
  background-color: #54c6c0 !important;
}

@media screen and (max-width: 576px) {
  .p-xsm-12 {
    width: 100%;
  }
}

.flex-wrap-reverse {
  flex-wrap: wrap-reverse !important;
}
</style>
