<template>
  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-card input-wrapper input-stretch">

      <div class="chips-wrap" @click="onFocus()">
        <div v-for="chip in modelValue.chips" :key="chip.str" class="p-mx-1">

          <div v-if="chip.type=='word'" class="chip-item p-tag p-tag-info">
            {{chip.str}}
            <span class="p-px-1"/>
            <span class="p-badge chip-append-icon"> <i class="fa fa-times"></i> </span>
          </div>
          <div v-else-if="chip.type=='tex'" class="chip-item p-tag p-tag-info math-chip">
            <span class="p-px-2"/>
            [imath] {{chip.str}} [/imath]
            <span class="p-px-2"/>
            <span class="p-badge chip-append-icon"> <i class="fa fa-pencil"></i> </span>
            <span class="p-badge chip-append-icon"> <i class="fa fa-times"></i> </span>
          </div>

        </div>

        <div class="p-mx-1">

          <!-- Editor -->
          <span v-if="mq_dom" id="math-editor"></span>
          <span v-if="mq" class="p-mx-1 math-editor-info">
            You are editing <b>a math formula</b>. When you finish, press enter or click
            <a href="javascript: void(0)" @click="onFinishMathEdit()"> here</a>.
          </span>
          <input id="text-editor" class="text-editor" type="text" :value="enterValue"
          @input="$emit('update:enterValue', $event.target.value)" @keyup="onKeyup" @keydown="onKeydown"
          placeholder="Enter keywords here, type $ for a math keyword."
          v-else/>

        </div>
      </div>

    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <Button label="Search" class="p-button-raised srch-btn" style="width: 100%" @click="onSearch()"/>
    </div>
  </div>

  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-jc-end input-stretch">

      <Button label="example" icon="fa fa-lightbulb-o" @click="onExample()"
       class="p-button-secondary p-button-text p-button-sm"/>

      <Button label="clear" icon="fa fa-times" @click="onClear()"
       class="p-button-secondary p-button-text p-button-sm"/>

    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <!-- Placeholder -->
      {{enterValue}}
    </div>
  </div>
</template>

<script>
const TeX_render = require('./tex-render.js')

export default {
  props : {
    modelValue: Object,
    enterValue: String
  },

  mounted: function() {
    this.MQ = MathQuill.getInterface(2)
    TeX_render.render_fast('.math-chip')
  },

  watch: {
    modelValue: function() {
      this.$nextTick(function() {
        TeX_render.render_fast('.math-chip')
      })
    }
  },

  data: function() {
    return {
      mq_dom: false,
      MQ: null,
      mq: null
    }
  },

  methods: {
    onSearch() {
      alert('Search Clicked!')
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

      const chips = this.modelValue.chips
      chips.push({
        type: type || "word",
        str: keyword,
        boolop: 'OR'
      })

      this.$emit('update:modelValue', {chips})
      this.$emit('update:enterValue', '')
    },

    onKeydown(ev) {
      const chips = this.modelValue.chips
      const keyword = this.enterValue.trim()

      if (ev.code === 'Backspace') {
        if (keyword === '') {
          chips.pop()
          this.$emit('update:modelValue', {chips})
        }
      }
    },

    onKeyup(ev) {
      const keyword = this.enterValue.trim()

      if (ev.code === 'Space') {
        /* split by this space */
        if (keyword.length > 0) {
          this.$nextTick(function() {
            this.pushChip(keyword)
          })
        } else {
          this.$emit('update:enterValue', '')
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
        vm.$emit('update:enterValue', '')
        vm.mqEditorCreate((mq) => {
          vm.mqEditorInput(mq, 'latex', '')
        })

      } else if (this.anySpecialChar(keyword)) {
        const vm = this
        vm.$emit('update:enterValue', keyword)
        vm.mqEditorCreate((mq) => {
          vm.mqEditorInput(mq, 'typing', keyword)
        })
      }
    },

    onFinishMathEdit() {
      const latex = this.enterValue
      if (latex.length > 0) {
        this.pushChip(latex, 'tex')
      }

      const vm = this
      setTimeout(() => {
        vm.reset()
      }, 2000)
    },

    mqEditorCreate(callbk) {
      const vm = this
      vm.mq_dom = true
      vm.mq = null
      this.$nextTick(() => {
        const mq = this.MQ.MathField(document.getElementById("math-editor"), {
          supSubsRequireOperand: true, // avoid _{_a}
          autoCommands: 'alpha beta gamma delta zeta eta theta kappa mu nu ' +
          // last two 'mod' and 'pmod' is added by forked version
          'xi rho sigma tau chi psi omega sqrt sum prod pi mod pmod',
          handlers: {
            edit: function() {
              let latex = mq.latex()
              vm.$emit('update:enterValue', latex)
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
        }
      })
    },

    mqEditorInput(mq, type, input) {
      if (type === 'latex') {
        /* consume LaTeX input */
        mq.latex(input)

      } else if (type === 'typing') {
        /* behave as if user are typing */
        console.log('|', input, '|')
        mq.typedText(input)

      } else if (type === 'stroke') {
        /* stroke sequence that handles TAB */
        for (let i = 0; i < input.length; i++) {
          let c = input[i]
          if (c === '\t') mq.keystroke('Tab')
          else mq.typedText(c)
        }

      } else {
        console.error('Undefined MQ Editor input.')
      }
    },

    onClear() {
      this.$emit('update:modelValue', {chips: []})
      this.$emit('update:enterValue', '')
      this.reset()
    },

    onFocus() {
      if (this.mq === null)
        $('#text-editor').focus()
      else
        this.mq.focus()
    },

    reset() {
      this.mq_dom = false
      this.mq = null
      this.$nextTick(function() {
        $('#text-editor').focus()
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

div.chips-wrap {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
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
  font-size: 0.75rem;
  font-weight: 400;
}

span.katex {
  font-size: 1.0rem;
  font-weight: 600;
}

span.katex-display {
  margin: 0.5em 0 !important;
}

div.math-chip {
  display: flex;
  align-items: center;
}
</style>
