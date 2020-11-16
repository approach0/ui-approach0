<template>
  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-card input-wrapper input-stretch">

      <ul class="qry-li-wrap">
        <li class="qry-li-item p-tag p-tag-info" v-for="item in items" :key="item.str">
          {{item.type}}
        </li>
      </ul>
      <!--
      <input placeholder="Enter query keywords here, type $ for math formula."
       class="qrybox-editor" :value="editing_val" @input="$emit('update:editing_val', $event.target.value)">
      -->

    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <Button label="Search" class="p-button-raised a0-color" style="width: 100%" @click="onClickSearch()"/>
    </div>
  </div>

  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-jc-end input-stretch">
      <Button label="example" icon="las la-lightbulb" class="p-button-secondary p-button-text p-button-sm"/>
      <Button label="clear" icon="las la-times" class="p-button-secondary p-button-text p-button-sm"/>
    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <!-- Placeholder -->
    </div>
  </div>
</template>

<script>
export default {
  props : {
    editing_val: String
  },

  mounted: function() {
  },

  watch: {
  },

  data: function() {
    return {
      items: [
        {type: "word", str: "hello world", boolop: 'OR'},
        {type: "word-input", str: "", boolop: 'OR'}
      ],
    }
  },

  methods: {
    onClickSearch() {
      console.log(this.editing_val)
    }
  }
}
</script>

<style>
.input-wrapper {
  height: 3rem;
  margin: 0.5rem 0 0.5rem 0;
}

.input-stretch {
  max-width: 600px;
  flex-grow: 1 !important;
}

ul.qry-li-wrap {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

li.qry-li-item {
  margin: 0px 5px 8px 0;
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
  background-color: var(--surface-f);
}
</style>
