<template>
  <div id="topbar" v-if="!footer_overshadow"
   class="topbar p-component p-toolbar p-d-flex p-ai-start p-jc-between p-grid">

    <div class="p-d-flex p-ai-center p-m-3" v-if="!qrybox_sinking">
      <img :src="logo32" class="p-m-1" @click="onClickIcon"/>
      <div class="p-d-flex p-flex-column">
        <span class="logo-text no-select">Approach Zero</span>
        <div class="logo-text no-select">A math-aware search engine.</div>
      </div>
    </div>

    <div class="topbar-qrybox-first p-col p-mx-4" v-if="!qrybox_sinking">
      <qrybox v-model="qrybox_model" @search="onSearch"/>
    </div>

    <div class="p-d-flex p-jc-end p-ai-center p-m-2">
      <i class="fa fa-sun-o"></i>
      <InputSwitch v-model="nightTheme" class="p-m-2"/>
      <i class="fa fa-moon-o"></i>
    </div>

    <!-- p-col-11 instead of 12 leaves nice padding in small device screen -->
    <div class="topbar-qrybox-second p-col-11 p-mx-4" v-if="!qrybox_sinking">
      <qrybox v-model="qrybox_model" @search="onSearch"/>
    </div>

  </div>

  <div id="sink_div" style="position: fixed; width: 100%;" v-if="qrybox_sinking"
    v-bind:style=" (footer_overshadow) ? 'z-index: -1' : 'z-index: 1'">

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
        <qrybox v-model="qrybox_model" @search="onSearch"/>
      </div>
    </div>
  </div>

  <div id="loading" style="position: fixed; width: 100%;" v-if="loading"
    v-bind:style=" (footer_overshadow) ? 'z-index: -1' : 'z-index: 1'">

    <div class="vspacer"/>

    <div class="p-d-flex p-jc-center">
      <ProgressSpinner />
    </div>
  </div>

  <div v-if="!qrybox_sinking" style="background-color: red; height: 1500px; width: 20px"></div>
  <Footer v-bind:footerStyle="footer_style"/>
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
    window.addEventListener("scroll", this.onScroll)

    /* update footer stickiness on mounting and window resizing */
    const vm = this
    this.footer_style = this.footerStickiness()
    $(window).resize(function() {
      vm.footer_style = vm.footerStickiness()
    })

    /* handle browser back/forward button */
    window.addEventListener('popstate', function(event) {
      const state = event.state
    })

    /* ensure we are at the top of the page */
    $("html, body").animate({ scrollTop: 0 })
  },

  watch: {
    nightTheme: function(val) {
      if (val) {
        this.changeTheme('night.css')
      } else {
        this.changeTheme('light.css')
      }
    },

    qrybox_sinking: function() {
      /* update footer stickiness on sinking state change */
      this.footer_style = this.footerStickiness()
    }
  },

  data: function() {
    return {
      logo128: require('./resource/logo128.png'),
      logo32: require('./resource/logo32.png'),
      nightTheme: false,
      qrybox_sinking: true,
      qrybox_model: '',
      anti_shake_timer: null,
      pagination_curpage: 0,
      footer_style: '',
      footer_overshadow: false
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

    onSearch(rawqry) {
      if (rawqry.trim() == '') return

      const encqry = encodeURIComponent(rawqry)
      const page = this.pagination_curpage

      $("html, body").animate({ scrollTop: 0 })
      this.qrybox_sinking = false
      this.loading = true

      console.log('Search', encqry, page)
    },

    onScroll() {
      /* get jQuery element */
      const ceil_ele = (this.qrybox_sinking) ? $('#sink_div') : $('#topbar')
      const footer_ele = $('#footer')
	    if (ceil_ele.offset() === undefined || footer_ele.offset() === undefined) { return }

      /* calculate opacity based on gaps */
	    const ceil_bottom = ceil_ele.offset().top + ceil_ele.outerHeight()
      const footer_top  = footer_ele.offset().top
      const over_depth = Math.max(0, ceil_bottom - footer_top)
      const grace_gaps = 150
      const opacity = 1 - Math.min(over_depth, grace_gaps) / grace_gaps
      ceil_ele.fadeTo(0, opacity)

      /* update footer_overshadow state (anti-shaking) */
      const vm = this
      if (this.anti_shake_timer) clearTimeout(this.anti_shake_timer)
      this.anti_shake_timer = setTimeout(function() {
        vm.footer_overshadow = (opacity < 0.5)
      }, 500)
    },

    footerStickiness() {
      if (this.qrybox_sinking) {
        const footer_ele = $('#footer')
	      const footer_height = footer_ele.outerHeight() || window.innerHeight
        return `position: absolute; bottom: -${footer_height}px;`
      } else {
        return 'position: static;'
      }
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
  color: rgb(202 103 136);
}

a:hover {
  cursor: pointer;
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
  bottom: -10vh;
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
    height: 15vh;
  }
}

@media screen and (min-width: 1024px) {
  .topbar-qrybox-second {
    display: none;
  }
}
</style>
