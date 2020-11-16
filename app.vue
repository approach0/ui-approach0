<template>
  <Toolbar class="topbar">
    <template v-slot:left>
      <img :src="logo32" class="p-mx-3"/>
      <div class="p-d-flex p-flex-column">
        <span class="logo-text">Approach Zero</span>
        <div class="logo-text">A math-aware search engine.</div>
      </div>
    </template>

    <template v-slot:right>
      <i class="las la-sun"></i>
      <InputSwitch v-model="nightTheme" class="p-mx-3"/>
      <i class="las la-moon"></i>
    </template>
  </Toolbar>

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

  <div class="p-d-flex p-ai-center p-jc-center p-flex-column" style="height: 80vh;">
    <div class="p-grid p-d-flex p-jc-center" style="width: 50%">
      <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-card" style="height: 3rem; margin: 0.5rem 0 0.5rem 0; max-width: 600px; flex-grow: 1">
        <input placeholder="Enter query keywords here, type $ for math formula." class="qrybox-editor">
      </div>
      <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
        <Button label="Search" class="p-button-raised a0-color" style="width: 100%;"/>
      </div>
    </div>

    <div class="p-grid p-d-flex p-jc-center" style="width: 50%">
      <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-jc-end" style="max-width: 600px; flex-grow: 1">
        <Button label="example" icon="las la-lightbulb" class="p-button-secondary p-button-text p-button-sm"/>
        <Button label="clear" icon="las la-times" class="p-button-secondary p-button-text p-button-sm"/>
      </div>
      <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      </div>
    </div>

  </div>

  <div style="background-color: grey; height: 1800px; width: 2px"></div>

</template>

<script>
const axios = require('axios')

module.exports = {
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
  width: 100%;
  z-index: 999;
}

/* CSS doodle */
.doodle {
  position: absolute;
  right: 10%;
  bottom: 0;
  z-index: -1;
}

/* line awesome */
.las,.lab {
  font-size: 1.5rem;
}

.a0-color {
  background-color: #54c6c0 !important;
}

.qrybox-editor {
  caret-color: var(--text-color);
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: var(--surface-e);
}

.p-button {
  max-height: 3rem;
}
</style>
