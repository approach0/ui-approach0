<template>
  <div class="shape-separator">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#54c6c0" fill-opacity="0.3" d="M0,320L120,314.7C240,309,480,299,720,250.7C960,203,1200,117,1320,74.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
      <path fill="#54c6c0" fill-opacity="0.4" d="M0,320L120,314.7C240,309,480,299,720,282.7C960,267,1200,245,1320,234.7L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
    </svg>
    <div class="footer">
    </div>
  </div>

</template>

<style>
div.shape-separator {
  position: fixed;
  bottom: 0;
  width: 100%;
}

div.shape-separator svg {
  margin: 0;
  vertical-align:top;
}

div.shape-separator .footer {
  margin: 0;
  background-color: #54c6c0;
  height: 10vh;
}
</style>

<script>
export default {
  props : {
  },
  data: function() {
    return {}
  }
}
</script>
