<template>
  <!-- progress bar (only for measuring snippet TeX render progress currently) -->
  <ProgressBar :value="loading_percentage" class="progressbar" v-if="search_results !== null"/>

  <!-- Top bar (menu and secondary query boxes) -->
  <div id="topbar" class="topbar p-component p-toolbar p-d-flex p-ai-start p-jc-between p-grid">

    <div class="p-d-flex p-ai-center" v-if="!qrybox_sinking">
      <img :src="logo32" class="logo p-m-2" style="width: 32px; height: 32px;"
           @click="onClickIcon" alt="logo"/>
      <div class="p-d-flex p-flex-column">
        <span class="logo-text no-select">Approach Zero</span>
        <div class="logo-text no-select">A math-aware search engine</div>
      </div>
    </div>

    <div class="topbar-qrybox-first p-col p-mx-4" v-if="!qrybox_sinking">
      <qrybox v-model="qrybox_model" @search="onClickSearch"/>
    </div>

    <div class="p-d-flex p-jc-end p-ai-center p-m-2">
      <i class="fa fa-sun-o"></i>
      <InputSwitch v-model="nightTheme" class="p-m-2"/>
      <i class="fa fa-moon-o"></i>
    </div>

    <!-- p-col-11 instead of 12 leaves nice padding in small device screen -->
    <div class="topbar-qrybox-second p-col-11 p-mx-4" v-if="!qrybox_sinking && !collapse">
      <qrybox v-model="qrybox_model" @search="onClickSearch"/>
    </div>

    <i class="fa collapse" :class="collapse ? 'fa-chevron-down': 'fa-chevron-up'"
       @click="onToggleCollapse" v-if="!qrybox_sinking"></i>
  </div>

  <!-- Initial query box -->
  <div v-if="qrybox_sinking">

    <div class="vspacer" v-if="!qrybox_squeeze"/>

    <div style="height: 100%;" v-if="!qrybox_squeeze"
         class="rellax" data-rellax-speed="1">
      <div class="p-d-flex p-jc-center p-mb-5">
        <img :src="logo128" class="logo p-mx-3" style="width: 64px; height: 64px;"
         @click="onClickIcon" alt="logo"/>
        <div class="p-d-flex p-flex-column p-jc-center p-mx-1">
          <span class="logo-text-large no-select">Approach Zero</span>
          <div class="logo-text-large no-select">A math-aware search engine</div>
        </div>
      </div>
    </div>

    <div class="p-d-flex p-jc-center p-mt-1">
      <div class="p-mx-3" style="width: 100%;">
        <qrybox v-model="qrybox_model" v-model:squeeze="qrybox_squeeze" @search="onClickSearch"/>
      </div>
    </div>

    <div class="vspacer" v-if="!qrybox_squeeze"/>

    <div class="ad">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">🚀 Research News! 🚀<br><br>Announcing S3D, a memory-saving LLM acceleration technique from my work at LG. It achieves one of the best token generation speeds per GPU VRAM in low-memory settings.<br><br>Check out my Arxiv paper: <a href="https://t.co/fPGpZykBfb">https://t.co/fPGpZykBfb</a></p>&mdash; Approach Zero (@approach0) <a href="https://twitter.com/approach0/status/1796551960100733398?ref_src=twsrc%5Etfw">May 31, 2024</a></blockquote> <component :is="'script'" async src="https://platform.twitter.com/widgets.js" charset="utf-8"></component>
    </div>



  </div>

  <!-- Spinner loader and error message -->
  <div style="position: fixed; width: 100%;" v-if="loading"
      :style="emerge_style(1)">

    <div class="vspacer"/>

    <div class="p-d-flex p-jc-center">
      <ProgressSpinner v-if="loading_error.length == 0"/>

      <div class="p-message p-component p-message-warn" v-else>
        <div class="p-message-wrapper p-d-flex">
          <span class="p-message-icon fa fa-exclamation-triangle"></span>
          <div class="p-message-text" style="max-width: 20rem;">
            {{loading_error}}
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Loader height placeholder -->
  <div style="height: 100vh; width: 0px;" v-if="loading">
  </div>

  <!-- Search results -->
  <div v-if="search_results !== null">
    <div class="p-d-flex p-flex-column p-ai-center p-jc-center">
      <div v-for="(hit, idx) in search_results" :key="hit.docid"
           class="p-p-4 p-m-3 p-card search-res">
        <span class="docid"> {{hit.docid}} </span>
        <span class="score"> {{hit.score}} </span>
        <a class="title" target="_blank" :href="hit.field_url" rel="noopener"
         v-html="hit.field_title" @click="onClickURL(idx)" @click.middle="onClickURL(idx)">
        </a>
        <span class="url">
          <img v-if="hit.field_url.indexOf('math.stackexchange') >= 0" :src="logo_mse"/>
          <img v-else-if="hit.field_url.indexOf('artofproblemsolving') >= 0" :src="logo_aops"/>
          {{hit.field_url}}
        </span>
        <div class="snippet">
          <p v-html="snippetPreprocess(idx, hit.field_content)"></p>
        </div>
        <div class="tags">
          <Tag v-for="tag in splitTags(hit.field_tags)" class="p-m-1"
               style="font-size: 0.9rem !important; font-weight: 500 !important;"
               @click="onClickTag(tag)" :key="tag" :value="'⋅ ' + tag" rounded>
          </Tag>
        </div>
      </div>

      <div style="margin-top: 4rem; p-d-flex; p-grid;">
        <paging style="" @goto="onGotoPage" :cur_page="pagination_curpage" :tot_pages="pagination_totpage"/>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <Footer v-bind:footerStyle="footer_style"/>
</template>

<script>
const TeX_render = require('./tex-render.js')
const example_queries = require('./example-queries.js').example_queries

import qrybox from './qrybox.vue'
import paging from './paging.vue'
import footer from './footer.vue'

export default {
  components: { qrybox, Footer: footer, paging },

  mounted: function() {
    /* some setups */
    this.attachDefaultTheme()
    new Rellax('.rellax')

    /* scroll event listener */
    window.addEventListener("scroll", this.onScroll)

    /* window resizing listener */
    const vm = this
    $(window).resize(function() {
      vm.onResize()
    })

    /* handle browser back/forward button */
    window.addEventListener('popstate', function(event) {
      vm.onPopState(event.state)
    })

    /* ensure we are at the top of the page */
    $("html, body").animate({ scrollTop: 0 })

    /* take URI Query parameters (if any) */
    const getUriQueryParam = function(key, defaultVal) {
      const params = window.location.search
      const match = params.match(new RegExp(`${key}=([^&]+)`, 'i'))
      if (match && match[1]) {
        return decodeURIComponent(match[1])
      } else {
        return defaultVal
      }
    }
    const rawqry = getUriQueryParam('q', null)
    const page = parseInt(getUriQueryParam('p', 1))

    /* set initial state */
    if (rawqry != null) {
      this.qrybox_model = rawqry
      /*
       * Sometimes user has a math without a dollar,
       * qrybox component will auto-correct it and update
       * qrybox_model, in this case, wait the nextTick()
       */
      vm.onClickSearch()
    } else {
      this.pushState()
    }

    /* detect back button click and rerender TeX in Carousel */
    window.addEventListener('popstate', () => {
      TeX_render.render('.carousel-content')
    })

    this.$nextTick(function() {
      TeX_render.render('.carousel-content')
      this.footer_style = this.footerStickiness()
    })
  },

  watch: {
    nightTheme: function(val) {
      if (val) {
        this.changeTheme('night.css')
      } else {
        this.changeTheme('light.css')
      }
    },

    search_results: function() {
      this.loading_percentage = 100

      this.$nextTick(function() {
        TeX_render.render('.search-res > .title')
        TeX_render.render('.search-res > .snippet', (a, b) => {
          let percentage = Math.ceil((a * 100) / b)
          if (percentage > 90) percentage = 100
          this.loading_percentage = percentage
        })
      })
    },

    qrybox_sinking: function() {
      /* update footer stickiness on sinking state change */
      this.footer_style = this.footerStickiness()
    },

    qrybox_squeeze: function(val) {
      if (val) $("html, body").animate({ scrollTop: 0 })
    }
  },

  data: function() {
    return {
      logo128: require('./resource/logo128.png'),
      logo32: require('./resource/logo32.png'),
      logo_mse: require('./resource/mse.png'),
      logo_aops: require('./resource/aops.png'),

      nightTheme: false,
      collapse: false,
      example_queries: example_queries
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .concat(null),
      carousel_opts: [
        {
          breakpoint: '1024px',
          numVisible: 2,
          numScroll: 1
        }
      ],

      qrybox_sinking: true,
      qrybox_model: '',
      qrybox_squeeze: false, /* avoid small screen keyboard out-of-space */
      static_rawqry: '',

      loading: false,
      loading_error: '',
      loading_percentage: 100,

      search_results: null,
      pagination_curpage: 1,
      pagination_totpage: 0,

      ceil_opacity: 1,
      footer_style: ''
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

    emerge_style(defaultZIndex) {
      return {
        'z-index': (this.ceil_opacity == 0 ? '-1' : `${defaultZIndex || 0}`),
        'visibility': (this.ceil_opacity < 0.5 ? 'hidden': 'visible')
      }
    },

    resetSearchResults() {
      this.search_results = null
      this.loading_error = ''
      this.loading = false
    },

    onPopState(state) {
      if (state) {
        const rawqry = state.rawqry
        this.qrybox_model = rawqry || ''
        /* update static_rawqry */
        this.static_rawqry = rawqry || ''

        if (rawqry === undefined) {
          this.qrybox_sinking = true
          this.resetSearchResults()
        } else {
          const page = state.page
          this.qrybox_sinking = false
          this.performSearch(rawqry, page)
        }

        $("html, body").animate({ scrollTop: 0 })
      }
    },

    pushState(rawqry, page_) {
      if (rawqry === undefined) {
        /* initial landing page */
        history.pushState({}, '', '')
      } else {
        const page = page_ || 1
        const searchState = {
          "rawqry": rawqry,
          "page": page
        }
        const title = JSON.stringify(searchState)
        const encqry = encodeURIComponent(rawqry)
        history.pushState(searchState, title, "?q=" + encqry + "&p=" + page)
        /* update static_rawqry */
        this.static_rawqry = rawqry
        this.qrybox_model = rawqry
      }
    },

    onGotoPage(page) {
      const rawqry = this.static_rawqry
      $("html, body").animate({ scrollTop: 0 })
      this.performSearch(rawqry, page)
      this.pushState(rawqry, page)
    },

    performSearch(rawqry, page) {
      /* setup loading page */
      const vm = this
      const encqry = encodeURIComponent(rawqry)
      this.resetSearchResults()
      this.loading = true

      /* perform search */
      setTimeout(function() {
        $.ajax({
          url: A0_RELAY_URL,
          data: `p=${page}&q=${encqry}`,
          dataType: 'json'

        }).done(function(res) {
          const ret_code = (res['ret_code'] === undefined) ? 101 : res['ret_code']
          if (ret_code == 0) {
            const ret_hits = res['hits']
            const tot_pages = res['tot_pages']
            vm.search_results = ret_hits
            vm.pagination_totpage = tot_pages
            vm.pagination_curpage = page
            vm.loading = false

          } else {
            const ret_str = res['ret_str'] || 'Invalid AJAX JSON'
            vm.loading_error = `${ret_str} (return code: #${ret_code}).`
          }

        }).fail(function(res, err) {
          console.error('[search ajax failed]', err)
          vm.loading_error = "Oops! Seems like server is down, please come back later."
        })
      }, 0) /* change timeout to debug loading */
    },

    snippetPreprocess(idx, snippet) {
      /* ensure $a<b$ is converted into $a < b$, otherwise it may render incorrectly */
      snippet = snippet.replace(/\[imath\]([\s\S]+?)\[\/imath\]/g, function (match, group) {
        return '[imath]' + group.split('<').join(' < ') + '[/imath]'
      })

      /* remove leading unpaired [imath] such as "bla bla [/imath]" */
      snippet = snippet.replace(/^(.*?)\[\/imath\]/, function (match, group) {
        if (group.indexOf('[imath]') == -1) {
          return '... '
        } else {
          return match
        }
      })

      /* remove trailing unpaired [imath] such as "[imath] bla bla" */
      const lastOpenTag = snippet.lastIndexOf('[imath]')
      if (lastOpenTag !== -1) {
        const headstring = snippet.slice(0, lastOpenTag)
        const tailstring = snippet.substring(lastOpenTag)
        if (tailstring.indexOf('[/imath]') === -1) {
          snippet = headstring + ' ...'
        }
      }

      return snippet
    },

    splitTags(tags_field) {
      tags_field = tags_field.trim()
      if (tags_field == '') {
        return []
      } else {
        return tags_field.split(' ')
      }
    },

    onClickSearch() {
      const rawqry = this.qrybox_model
      if (rawqry.trim() == '') return

      /* NOTE: The canonicalizedQueryArr() function requires updated chips in
       * qrybox (need one cycle of conversion from qrybox_model raw string). */
      this.$nextTick(function() {
        /* canonicalize what is inside of the qrybox */
        const arr = window.$qrybox.canonicalizedQueryArr(false)
        const canonicalized_rawqry = arr.join(', ')
        console.log(canonicalized_rawqry)

        /* move viewbox and querybox on top */
        $("html, body").animate({ scrollTop: 0 })
        this.qrybox_sinking = false

        /* actually perform search */
        this.performSearch(canonicalized_rawqry, 1)
        this.pushState(canonicalized_rawqry, 1)
      })
    },

    onClickURL(idx) {
      let results = this.search_results || []
      let page = this.pagination_curpage
      let qry = this.qrybox_model

      /* collect click-through data */
      const clicks = []
      for (let i = 0; i <= Math.min(results.length - 1, idx); i++) {
        let res = results[i]
        let url = res.field_url
        let rank = res.rank || 0
        let clicked = (i == idx) ? 1 : 0;
        clicks.push([rank, page, url, clicked])
      }

      /* send click-through data */
      $.post(`${A0_RELAY_URL}/click-relay.php`,
        JSON.stringify({qry, clicks}) /* transfer JSON */
      ).fail(function(res, err) {
        console.error('[click-through ajax failed]', err)
      })
    },

    onClickTag(tag) {
      /* append and rewrite current query */
      let arr = this.qrybox_model.split(',')
      arr.push(`AND tags:${tag}`)
      this.qrybox_model = arr.join(', ')

      this.onClickSearch()
    },

    onClickShowcase(carousel_item) {
      /* rewrite current query */
      const keywords = carousel_item.keywords
      this.qrybox_model = keywords

      this.onClickSearch()
    },

    onScroll() {
      /* get jQuery element */
      const ceil_ele = (this.qrybox_sinking) ? $('#keyboard-btn') : $('#topbar')
      const footer_ele = $('#footer')

      /* calculate opacity based on gaps */
      const ceil_bottom = (ceil_ele.offset() === undefined) ?
        window.pageYOffset : ceil_ele.offset().top + ceil_ele.outerHeight()
      const footer_top  = footer_ele.offset().top
      const over_depth = Math.max(0, ceil_bottom - footer_top)
      const grace_gaps = 150
      const opacity = 1 - Math.min(over_depth, grace_gaps) / grace_gaps

      ceil_ele.length && ceil_ele.fadeTo(0, opacity)
      this.ceil_opacity = opacity
    },

    onResize() {
      this.footer_style = this.footerStickiness()
      this.onScroll()
    },

    footerStickiness() {
      if (this.qrybox_sinking) {
        const footer_ele = $('#footer')
        const footer_height = footer_ele.outerHeight() || window.innerHeight
        const offset = 100 + footer_height
        return `position: absolute; bottom: -${offset}px;`
      } else {
        return 'position: static;'
      }
    },

    onClickIcon() {
      window.location.href = window.location.pathname
    },

    onToggleCollapse() {
      this.collapse = !this.collapse
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
  font-family: var(--font-family);
  background-color: var(--surface-b);
  background-image: url("./resource/stars.png");
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;
}

.progressbar {
  top: 0;
  z-index: 1000; /* 999 + 1 */
  width: 100%;
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
  text-shadow: 1px 1px #4eb5b0;
}

.logo-text:last-child {
  font-size: 0.7rem;
}

.logo-text-large:first-child {
  font-size: 1.8rem;
  font-weight: bold;
}

.logo-text-large:last-child {
  font-size: 1.0rem;
}

img.logo {
  cursor: pointer;
}

div.p-toolbar {
  background-color: var(--surface-d);
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
  bottom: -20vh;
  z-index: -1;
}

div.vspacer {
  height: 15vh;
}

i.collapse {
  display: none;
}

.carousel-overlay {
  pointer-events: none; /* let through keyboard btn clicks */
  display: flex;
  justify-content: center;
}

.ad {
  display: flex;
  justify-content: center;
}

.carousel-container {
  width: 80vw;
  border-radius: 12px;
  border: 2px solid var(--surface-c);
  padding-left: 1rem;
  backdrop-filter: blur(3px);
  pointer-events: auto; /* accept clicks again */
}

/*
 * For some unknown reason, it has to use non-vueprime
 * button here. Otherwise the first hover on these
 * buttons will make the entire carousel disappear.
 */
.carousel-srchbtn {
  cursor: pointer;
  width: 2.357rem;
  border-radius: 50%;
  height: 2.357rem;
  background: #54c6c0;
  color: var(--primary-color-text);
  border: none;
  margin: 0;
  user-select: none;
  text-align: center;
  font-size: 1rem;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
}

/* query box layout media CSS */
@media screen and (max-width: 576px) {
  .p-sm-12 {
    -webkit-box-flex: 0;
    flex: 0 0 auto;
    padding: 0.5rem;
    width: 100%;
  }

  .logo-text:last-child {
    display: none !important;
  }
}

@media screen and (max-width: 768px) {
  i.collapse {
    color: gray;
    position: absolute;
    bottom: -5px;
    right: 1rem;
    display: inline-block !important;
  }

  div.carousel-container {
    display: none !important;
  }
}

@media screen and (max-width: 1024px) {
  .topbar-qrybox-first {
    display: none;
  }

  .carousel-container {
    width: 100vw;
  }
}

/* a min-width to hide second qrybox after search is performed */
@media screen and (min-width: 1024px) {
  .topbar-qrybox-second {
    display: none;
  }
}

.search-res {
  max-width: 728px; /* 768 - 40 */
  width: 100%;
}

.search-res > .docid,.score {
  display: none;
}

.search-res > a.title {
  text-decoration: none;
  font-size: 1.2em;
  display: block;
  word-break: break-all;
  color: var(--primary-color);
  font-weight: bold;
  padding-bottom: 1rem;
}

.search-res > a.title {
  overflow-x: auto;
}

.search-res > a.title:visited {
  color: #753d90;
}

.search-res > span.url > img {
  vertical-align: text-top;
  width: 16px;
  height: 16px;
  margin-right: 3px;
}

.search-res > span.url {
  color: #006d21;
  display: block;
  word-break: break-all;
}

.search-res > div.snippet {
  overflow-x: auto;
}

.search-res > div.snippet > p {
  line-height: 1.5;
}

.search-res > div.tags {
  word-break: break-word;
  vertical-align: middle;
}

div.tags > span {
  display: inline-block;
  cursor: pointer;
}

em.hl > span > svg {
  background-color: #FFC;
  color: black;
}

em.hl {
  background-color: #FFC;
  color: black;
  font-style: normal;
}

.carousel-title, .carousel-tags, .carousel-content {
  user-select: none;
}

.p-carousel-prev:before {
  display:inline-block;
  font:normal normal normal 14px/1 FontAwesome;
  font-size:inherit;
  text-rendering:auto;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  content:"\f053"
}

.p-carousel-next:before {
  display:inline-block;
  font:normal normal normal 14px/1 FontAwesome;
  font-size:inherit;
  text-rendering:auto;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  content:"\f054"
}
</style>
