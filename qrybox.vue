<template>
  <!-- Query line -->
  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-card input-wrapper input-stretch"
         :class="{ 'input-focus': focus_style }">

      <div class="chips-wrap" @click="onFocus()">
        <!-- Chips -->
        <div v-for="(chip, idx) in chips" :key="chip.str" class="p-mx-1">
          <div v-if="chip.type=='word'" class="chip-item p-tag p-tag-info">
            <span class="chip-word p-px-2">{{chip.str}}</span>
            <span class="p-badge chip-append-icon" @click="onDel(idx)"> <i class="fa fa-times"></i> </span>
          </div>
          <div v-else-if="chip.type=='tex'" class="chip-item p-tag p-tag-info math-chip">
            <span class="chip-tex p-px-3">[imath] {{chip.str}} [/imath]</span>
            <span class="p-badge chip-append-icon" @click="onEdit(idx)"> <i class="fa fa-pencil"></i> </span>
            <span class="p-badge chip-append-icon" @click="onDel(idx)"> <i class="fa fa-times"></i> </span>
          </div>
        </div>

        <!-- Editor -->
        <div class="p-mx-1">
          <span v-if="mq_dom" id="math-editor"></span>
          <span v-if="mq" class="p-mx-1 math-editor-info">
            You are editing <b>a math formula</b>. When you finish, press enter or click
            <a href="javascript: void(0)" @click="onFinishMathEdit()"> here</a>.
          </span>
          <input class="text-editor" type="text"
           @paste="onPaste" v-model="entering" @keyup="onKeyup" @keydown="onKeydown"
           placeholder="Enter keywords here, type $ for a math keyword." v-else/>
        </div>
      </div>

    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <Button label="Search" class="p-button-raised srch-btn" style="width: 100%" @click="onSearch()"/>
    </div>
  </div>

  <!-- Menu line -->
  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-jc-between input-stretch menu">
      <div>
        <Button label="Help" icon="fa fa-question-circle-o"  @click="menu_on = (menu_on === 'help' ? null : 'help')"
         :class="'p-button-secondary p-button-sm ' + (menu_on === 'help' ? 'p-button-outlined' : 'p-button-text')"/>

        <Button label="Raw Query" icon="fa fa-code" @click="menu_on = (menu_on === 'raw' ? null : 'raw')"
         :class="'p-button-secondary p-button-sm ' + (menu_on === 'raw' ? 'p-button-outlined' : 'p-button-text')"/>
      </div>
      <div>
        <Button label="Clear" icon="fa fa-times" @click="onClear()"
         class="p-button-secondary p-button-text p-button-sm"/>
      </div>

      <div style="position: absolute; left: 0; top: 3rem; width: 100%" v-if="menu_on">

        <div class="p-message p-component p-message-info" v-if="menu_on === 'help'">
          <div class="p-message-wrapper p-d-flex p-ai-center">
            <div class="p-message-text">
              <p>First time using this tool?
              Let's walk through our
              <a target="_blank" href="/guide"><i class="fa fa-external-link"></i> user guide </a>
              to get you started.
              Also, why not to try a few
              <a href="javascript: void(0)" @click="onExampleQuery"><i class="fa fa-lightbulb-o"></i>
              random queries </a>
              to get a sense?</p>

              <p>To quickly input math symbols, use the
              <a href="javascript: void(0)" @click="onPullKeyboard"><i class="fa fa-th"></i>
              symbol-keyboard</a>.</p>

            </div>
            <Button icon="fa fa-times" @click="menu_on = null"
              class="p-button-rounded p-button-text p-button-secondary"/>
          </div>
        </div>

        <div style="width: 100%; padding-top: 1rem;" v-else-if="menu_on === 'raw'">
          <span style="width: 100%" class="p-float-label sizes">
            <InputText id="rawqry" style="width: 100%" type="text"
             class="p-inputtext-sm" aria-describedby="rawqry-help" v-model="rawqry"/>
            <label for="rawqry">Enter raw query ...</label>
            <small id="rawqry-help" style="background-color: var(--surface-b)">
              In <i>raw query</i>, you can edit math keyword in TeX directly (separate keywords by commas).
            </small>
          </span>
        </div>

      </div>

    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <!-- Placeholder -->
    </div>
  </div>

  <!-- Math Keyboard -->
  <Button icon="fa fa-th" class="p-button-rounded p-button-secondary" @click="onPullKeyboard()"
          style="position: fixed; left: 2rem; bottom: 2rem; z-index: 99"/>

  <Sidebar :visible="keyboard_show" class="p-sidebar-md" :showCloseIcon="false" position="bottom" :modal="false">
    <div style="position: absolute; top: -1rem; right: 0; z-index: 100">
      <Button class="p-button-text" icon="fa fa-times" @click="keyboard_show = false"/>
    </div>

    <TabView style="overflow-y: auto; height: 100%;">
      <TabPanel :header="keyboard_keys[0].keyset">
        <Button v-for="key in keyboard_keys[0].buttons" :key="key.disp" :label="'[imath]' + key.disp + '[/imath]'"
         @click="mqCMD(key.cmd)" :alt="key.desc" class="p-button-outlined p-button-help p-p-2 p-m-2 keyboard-key"/>

        <Button v-for="key in keyboard_keys[1].buttons" :key="key.disp" :label="'[imath]' + key.disp + '[/imath]'"
         @click="mqCMD(key.cmd)" :alt="key.desc" class="p-button-outlined p-button-help p-p-2 p-m-2 keyboard-key"/>
      </TabPanel>

      <TabPanel :header="keyboard_keys[2].keyset">
        <Button v-for="key in keyboard_keys[2].buttons" :key="key.disp" :label="'[imath]' + key.disp + '[/imath]'"
         @click="mqCMD(key.cmd)" :alt="key.desc" class="p-button-outlined p-button-help p-p-2 p-m-2 keyboard-key"/>
      </TabPanel>

      <TabPanel :header="keyboard_keys[3].keyset">
        <Button v-for="key in keyboard_keys[3].buttons" :key="key.disp" :label="'[imath]' + key.disp + '[/imath]'"
         @click="mqCMD(key.cmd)" :alt="key.desc" class="p-button-outlined p-button-help p-p-2 p-m-2 keyboard-key"/>
      </TabPanel>

      <TabPanel :header="keyboard_keys[4].keyset">
        <Button v-for="key in keyboard_keys[4].buttons" :key="key.disp" :label="'[imath]' + key.disp + '[/imath]'"
         @click="mqCMD(key.cmd)" :alt="key.desc" class="p-button-outlined p-button-help p-p-2 p-m-2 keyboard-key"/>
      </TabPanel>
    </TabView>

  </Sidebar>
</template>

<script>
const TeX_render = require('./tex-render.js')
const symbol_keys = require('./symbol-keyboard.js').symbol_keys

export default {
  props : {
    modelValue: String
  },

  emits: ['update:modelValue', 'search'],

  mounted: function() {
    /* create MathQuill constructor */
    this.MQ = MathQuill.getInterface(2)

    TeX_render.render_fast('.chip-tex')
    TeX_render.render_fast('.keyboard-key .p-button-label')

    this.registerFocusBlurWatcher()

    /* get component property upon mounting */
    this.rawqry = this.modelValue
    this.rawstr2chips()
  },

  watch: {
    chips: {
      handler() {
        this.$nextTick(function() {
          TeX_render.render_fast('.chip-tex')
        })
      },
      deep: true,
    },

    mq: function(math_editor) {
      if (math_editor === null) {
        this.registerFocusBlurWatcher()
      }
    },

    keyboard_show: function(show) {
      if (show) {
        this.$nextTick(function() {
          TeX_render.render_fast('.keyboard-key .p-button-label')
        })
      }
    },

    rawqry: function() {
      this.rawstr2chips()
      /* update props */
      this.$emit('update:modelValue', this.rawqry)
    },

    modelValue: function(newVal) {
      this.rawqry = this.rawqry
    }
  },

  data: function() {
    return {
      focus_style: false,
      chips: [
        /*{type: "word", str: "hello world", boolop: 'OR'},
          {type: "tex", str: "\\frac a b", boolop: 'OR'} */
      ],
      entering: '',
      rawqry: '',
      mq_dom: false,
      MQ: null,
      mq: null,
      menu_on: null,
      keyboard_keys: symbol_keys,
      keyboard_show: false
    }
  },

  methods: {
    registerFocusBlurWatcher() {
      this.$nextTick(function() {
        const vm = this
        $('.text-editor').focus(function() {
          vm.focus_style = true
        })

        $('.text-editor').blur(function() {
          vm.focus_style = false
        })
      })
    },

    onSearch() {
      this.$emit('search', this.rawqry)
      this.focus_style = false

      const entering = this.entering
      if (this.mq) {
        this.pushChip(entering, 'tex')
        this.clearEntering(true)
      } else {
        this.pushChip(entering)
      }
    },

    onPullKeyboard() {
      this.menu_on = null
      this.keyboard_show = true
    },

    anySpecialChar(str, chars) {
      const specialChars = "+*/\\!^_%()[]:;{}=<>"
      for (let i = 0; i < specialChars.length; i++) {
        if (str.indexOf(specialChars[i]) >= 0)
          return true
      }
      return false
    },

    pushChip(keyword, type) {
      if (keyword.trim().length === 0)
        return

      this.chips.push({
        type: type || "word",
        str: keyword,
        boolop: 'OR'
      })

      this.entering = ''
      this.chips2rawstr()
    },

    onKeydown(ev) {
      const keyword = this.entering.trim()

      if (ev.code === 'Backspace') {
        if (keyword === '') {
          this.chips.pop()
        }
      }
    },

    onPaste(ev) {
      if (ev.type === 'paste') {
        /* stop data actually being pasted into <input/> */
        ev.stopPropagation()
        ev.preventDefault()

        /* get pasted data via clipboard API */
        const clipboardData = ev.clipboardData || window.clipboardData
        const pastedData = clipboardData.getData('Text')

        const rawstr = this.rawqry.trim()
        if (rawstr === '')
          this.rawqry = pastedData
        else
          this.rawqry = `${rawstr}, ${pastedData}`

        this.rawstr2chips()
        this.$nextTick(function() {
          this.clearEntering()
        })
      }
    },

    onKeyup(ev) {
      const keyword = this.entering.trim()

      if (ev.code === 'Space') {
        /* split by this space */
        if (keyword.length > 0) {
          this.pushChip(keyword)
        } else {
          this.entering = ''
        }

      } else if (ev.code === 'Enter') {
        if (keyword === '') {
          /* search signal */
          this.onSearch()
        } else {
          this.pushChip(keyword)
        }

      } else if (keyword.includes('$')) {
        const vm = this
        const pushin = keyword.slice(0, -1)
        vm.pushChip(pushin)
        vm.entering = ''
        vm.mqEditorCreate((mq) => {
          vm.mqEditorInput(mq, 'latex', '')
        })

      } else if (this.anySpecialChar(keyword)) {
        const vm = this
        vm.entering = keyword
        vm.mqEditorCreate((mq) => {
          vm.mqEditorInput(mq, 'typing', keyword)
        })
      }

      this.chips2rawstr()
    },

    onFinishMathEdit() {
      const latex = this.entering
      if (latex.length > 0) {
        this.pushChip(latex, 'tex')
        this.clearEntering()
      }
    },

    mqEditorCreate(callbk) {
      const vm = this
      vm.mq_dom = true
      vm.mq = null

      this.$nextTick(() => {
        const ele = document.getElementById("math-editor")
        const mq = this.MQ.MathField(ele, {
          supSubsRequireOperand: true, // avoid _{_a}
          autoCommands: 'alpha beta gamma delta zeta eta theta kappa mu nu ' +
          // last two 'mod' and 'pmod' is added by forked version
          'xi rho sigma tau chi psi omega sqrt sum prod pi mod pmod',
          handlers: {
            edit: function() {
              let latex = mq.latex()
              vm.entering = latex
              vm.chips2rawstr()

              /* user finishes math editing with a dollar */
              if (-1 != latex.indexOf("$")) {
                latex = latex.replace(/\\\$/g, ' ')
                mq.latex(latex)
                this.enter()
              }
            },
            enter: function() {
              vm.onFinishMathEdit()
            }
          }
        })

        if (mq) {
          this.mq = mq
          callbk && callbk(mq)

          mq.focus()
          this.focus_style = true
        }
      })
    },

    mqEditorInput(mq, type, input) {
      if (type === 'latex') {
        /* consume LaTeX input */
        mq.latex(input)

      } else if (type === 'typing') {
        /* behave as if user are typing */
        mq.typedText(input)

      } else if (type === 'stroke') {
        /* stroke sequence that handles TAB */
        for (let i = 0; i < input.length; i++) {
          let c = input[i]
          if (c === "\t") {
            mq.keystroke('Tab')
          } else {
            /* uncomment for debugging */
            //setTimeout(()=>{
            mq.typedText(c)
            //}, i * 500)
          }
        }

      } else {
        console.error('Undefined MQ Editor input.')
      }
    },

    mqCMD(cmd) {
      const mq = this.mq
      const vm = this
      const cmd_ = cmd + ' '
      vm.mqEditorCreate((mq) => {
        vm.mqEditorInput(mq, 'stroke', cmd_)
      })
    },

    onClear() {
      this.chips = []
      this.entering = ''
      this.clearEntering()
      this.chips2rawstr()
    },

    onFocus() {
      if (this.mq === null)
        $('.text-editor').focus()
      else
        this.mq.focus()
    },

    onDel(chipIdx) {
      this.chips.splice(chipIdx, 1)
    },

    onEdit(chipIdx) {
      const chip = this.chips.splice(chipIdx, 1)[0]
      const vm = this
      vm.entering = chip.str
      vm.mqEditorCreate((mq) => {
        vm.mqEditorInput(mq, 'latex', chip.str)
      })
    },

    correct_mathtex(tex) {
      /* correct common mistakes in math-mode TeX */
      tex = tex.replace(/_\{[ ]*\}/g, " ")
      tex = tex.replace(/\^\{[ ]*\}/g, " ")
      tex = tex.replace(/\{_/g, "{")
      return tex
    },

    chips2rawstr() {
      const vm = this
      const arr = this.chips.map(chip => {
        if (chip.type === 'tex') {
          const tex = vm.correct_mathtex(chip.str)
          return `$${tex}$`
        } else {
          return chip.str
        }
      })

      if (this.entering.trim().length > 0) {
        if (this.mq_dom === null) {
          arr.push(this.entering)
        } else {
          const tex = vm.correct_mathtex(this.entering)
          arr.push(`$${tex}$`)
        }
      }

      this.rawqry = arr.join(', ')
    },

    rawstr2chips() {
      let chips = []
      let expect_comma = false
      let dollar_open = false
      let keyword = ''

      const wrapup = function() {
        if (keyword.trim() !== '') {
          chips.push(keyword.trim())
          keyword = ''
        }
      }

      /* block here if user is typing on query box */
      if (this.entering) { return }

      const rawstr = this.rawqry
      for (let i = 0; i < rawstr.length; i++) {
        if (rawstr[i] == '$' && i + 1 < rawstr.length && rawstr[i + 1] == '$')
          /* this is a double dollar, trim this $ */
          continue

        if (rawstr[i] == '$') {
          dollar_open = !dollar_open

          /* $ is just closed, looking for a comma ahead */
          if (!dollar_open)
            expect_comma = true

          /* encounter "word [.] $tex$" case, user forgets comma? */
          if (dollar_open && keyword.trim() !== '') { wrapup() }

          /* fall through to push this dollar sign */

        } else {

          if (this.anySpecialChar(rawstr[i])) {
            /* encounter "word [t]ex" case, user forgets dollar? */
            dollar_open = true
          }

          /* NOT in dollar-enclosed chip */
          if (!dollar_open) {

            if (rawstr[i] == ',') {
              /* skip this comma and wrap up this keyword */
              expect_comma = false
              wrapup()
              continue

            } else if (expect_comma && rawstr[i] != ' ') {
              /* encounter "$tex$ [w]ord" case, user forgets comma? */
              expect_comma = false

              /* wrap up this keyword */
              wrapup()
            }
          }
        }

        /* concatenate */
        keyword += rawstr[i]
      } /* end loop */

      /* wrap up the remaining, if any */
      wrapup()
      //console.log(chips.join(' | ')); return /* DEBUG */

      /* enforce chip to have specified structure */
      const vm = this
      let missing_dollar = false
      this.chips = chips.map(keyword => {
        if (keyword[0] == '$' || vm.anySpecialChar(keyword)) {
          if (keyword[0] != '$') { missing_dollar = true }

          const trim_dollar = keyword.replace(/^\$|\$$/g, "")
          return { 'type': 'tex', 'str': trim_dollar, 'boolop': 'OR' }
        } else {

          return { 'type': 'word', 'str': keyword, 'boolop': 'OR' }
        }
      })

      /* help user correct raw string due to some missing dollar */
      if (missing_dollar) {
        console.log('[auto correct]', chips)
        this.chips2rawstr()
      }
    },

    clearEntering(left_blur) {
      this.mq_dom = false
      this.$nextTick(function() {
        /* mq set to null later, we want to wait until `Enter' event
         * goes away, otherwise text-editor will receive the event */
        this.mq = null
        const vm = this
        setTimeout(function() {
          left_blur || vm.onFocus()
        }, 300)
      })
    }
  }
}
</script>

<style>
div.input-wrapper {
  margin: 0.5rem 0 0.5rem 0;
  background-color: var(--surface-f);
}

div.input-stretch {
  max-width: 600px;
  flex-grow: 1 !important;
}

div.input-focus {
  box-shadow: none;
  outline: 2px solid var(--primary-color);
  outline-offset: 0;
}

div.menu {
  position: relative;
  color: var(--primary-color);
}

div.chips-wrap {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  overflow: hidden; /* in case of long <input/> placeholder */
}

div.chip-item {
  margin: 0px 5px 8px 0;
}

span.chip-append-icon {
  line-height: 15px;
  height: 1rem;
  min-width: 1rem;
  font-size: 0.75rem;
}

span.chip-append-icon:hover {
  color: red;
  cursor: pointer;
}

Button.srch-btn {
  height: 3rem;
  background-color: #54c6c0 !important;
  margin: 0.5rem 0;
}

input.text-editor {
  color: var(--text-color);
  caret-color: var(--text-color);
  width: 100%;
  border: none;
  outline: none;
  background-color: var(--surface-f);
  min-width: 350px;
  height: 1.5rem;
}

span.math-editor-info {
  color: var(--text-color);
  opacity: 0.6;
  font-size: 0.85rem;
  font-weight: 300;
}

span.katex {
  font-size:  1rem;
  font-weight: 600;
}

span.katex-display {
  margin: 0.5em 0 !important;
}

div.math-chip {
  display: flex;
  align-items: center;
}

.p-float-label label {
  top: 1.5rem !important;
}

div.p-sidebar-content {
  height: calc(100%);
}

div.p-fieldset-content {
  display: flex !important;
  flex-wrap: wrap;
}

button.keyboard-key {
  line-height: 1;
  width: 1.7rem;
  height: 2.7rem;
}

.p-tag {
  font-size: 1.0rem !important;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 0.5em !important;
}

.p-tabview .p-tabview-panels {
  padding: 0.5em 0 !important;
}

.mq-editable-field .mq-cursor {
  border-left: 1px solid var(--text-color) !important;
}

.p-button.p-button-outlined {
  border: none !important;
  outline: 1px solid #F48FB1 !important;
}
</style>
