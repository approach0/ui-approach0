<template>
  <Toolbar class="topbar">
    <template v-slot:left>
      <img :src="logo32" class="p-mx-3"/>
      <h3>Approach Zero</h3>
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
      nightTheme: false
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
  overflow-x: hidden;
}

body {
  color: var(--text-color);
  background-color: var(--surface-b);
  background-image: url("./resource/stars.png");
  background-size: cover;
  background-repeat: no-repeat;
}

.topbar {
  position: fixed;
  top: 0;
  width: 100%;
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
  font-size: 1.5em;
}
</style>
