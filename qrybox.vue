<template>
  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-card input-wrapper input-stretch">

      <ul class="qry-li-wrap">
        <li v-for="chip in modelValue.chips" :key="chip.str" class="p-m-1">
          <div v-if="chip.type=='word'" class="qry-li-item p-tag p-tag-info">
            {{chip.str}}
            <span class="p-badge chip-append-icon"><i class="fa fa-times"></i></span>
          </div>
        </li>

        <li style="width: 100%">
          <input class="qrybox-editor" placeholder="Enter query keywords here, type $ for math formula."
                :value="enterValue" @input="$emit('update:enterValue', $event.target.value)"/>
        </li>
      </ul>

    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <Button label="Search" class="p-button-raised a0-color" style="width: 100%" @click="onClickSearch()"/>
    </div>
  </div>

  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-jc-end input-stretch">
      <Button label="example" icon="fa fa-lightbulb-o" class="p-button-secondary p-button-text p-button-sm"/>
      <Button label="clear" icon="fa fa-times" class="p-button-secondary p-button-text p-button-sm"/>
    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <!-- Placeholder -->
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
  },

  watch: {
  },

  data: function() {
    return {
    }
  },

  methods: {
    onClickSearch() {
    }
  }
}
</script>

<style>
div.input-wrapper {
  height: 3rem;
  margin: 0.5rem 0 0.5rem 0;
  background-color: var(--surface-f);
  overflow: hide;
}

.input-stretch {
  max-width: 600px;
  flex-grow: 1 !important;
}

ul.qry-li-wrap {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
  display: flex;
  align-content: start;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  overflow: hidden;
}

li.qry-li-item {
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

.a0-color {
  background-color: #54c6c0 !important;
}

.qrybox-editor {
  display: inline-block;
  color: var(--text-color);
  caret-color: var(--text-color);
  width: 100%;
  border: none;
  outline: none;
  background-color: var(--surface-f);
}
</style>
