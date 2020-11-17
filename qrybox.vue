<template>
  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-card input-wrapper input-stretch">

      <div class="chips-wrap">
        <div v-for="chip in modelValue.chips" :key="chip.str" class="p-mx-1">
          <div v-if="chip.type=='word'" class="chip-item p-tag p-tag-info">
            {{chip.str}}
            <span class="p-badge chip-append-icon"><i class="fa fa-times"></i></span>
          </div>
        </div>

        <div class="p-mx-1">
          <!-- Editor -->
          <span v-if="editing_math" id="math-editor"></span>
          <span v-if="editing_math" class="p-mx-1 math-editor-info">
            You are editing a math formula. When you finish, press enter or click
            <a href="javascript: void(0)" @click="onFinishMathEdit()"> here</a>.
          </span>
          <input id="text-editor" class="text-editor" type="text" :value="enterValue"
          @input="$emit('update:enterValue', $event.target.value)" @keyup="onKeyup"
          placeholder="Enter keywords here, type $ for math keyword editing."
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
      {{modelValue}}
    </div>
  </div>
</template>

<script>
export default {
  props : {
    modelValue: Object,
    enterValue: String
  },

  mounted: function() {
    this.MQ = MathQuill.getInterface(2)
  },

  watch: {
    editing_math: function(yes) {
      if (yes) {
        this.$nextTick(function() {
          this.mq_render()
        })
      }
    }
  },

  data: function() {
    return {
      editing_math: false,
      MQ: null,
      'specialChars': "+*/\\!^_%()[]:;{}=<>"
    }
  },

  methods: {
    onSearch() {
    },

    includesAnyChar(str, chars) {
      for (let i = 0; i < chars.length; i++) {
        if (str.indexOf(chars[i]) >= 0)
          return true
      }
      return false
    },

    pushChip(keyword) {
      if (keyword.trim().length === 0)
        return

      const chips = this.modelValue.chips
      chips.push({
        type: "word",
        str: keyword,
        boolop: 'OR'
      })
      this.$emit('update:modelValue', {chips})
      this.$emit('update:enterValue', '')
    },

    onKeyup(ev) {
      const chips = this.modelValue.chips
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

      } else if (ev.code === 'Backspace') {
        if (keyword === '') {
          chips.pop()
          this.$emit('update:modelValue', {chips})
        }

      } else if (keyword.includes('$')) {
        const popout = keyword.slice(0, -1)
        this.pushChip(popout)
        this.editing_math = true
      }
    },

    onFinishMathEdit() {
      const latex = this.enterValue
      console.log(latex)
      if (latex.length > 0) {
        this.pushChip(latex)
      }
      this.reset()
    },

    mq_render() {
      const vm = this
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

      if (mq) mq.focus()
    },

    onClear() {
      this.$emit('update:modelValue', {chips: []})
      this.$emit('update:enterValue', '')
      this.reset()
    },

    reset() {
      this.editing_math = false
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
  margin-left: 5px;
  line-height: 15px;
  height: 1rem;
  font-size: 13px;
  min-width: 1rem;
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
  font-size: 13px;
}
</style>
