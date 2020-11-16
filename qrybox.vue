<template>
  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-card" style="height: 3rem; margin: 0.5rem 0 0.5rem 0; max-width: 600px; flex-grow: 1">
      <input placeholder="Enter query keywords here, type $ for math formula." class="qrybox-editor">
    </div>
    <div class="p-d-flex p-lg-fixed p-md-12 p-sm-12" style="width: 150px;">
      <Button label="Search" class="p-button-raised a0-color" style="width: 100%;"/>
    </div>
  </div>

  <div class="p-grid p-d-flex p-jc-center">
    <div class="p-d-flex p-lg-1 p-md-12 p-sm-12 p-p-2 p-jc-end" style="max-width: 600px; flex-grow: 1">
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
  mounted: function() {
  },

  watch: {
  },

  data: function() {
    return {
      inputBox: '',
    }
  },

  methods: {
  }
}
</script>

<style>
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
</style>
