<template>
  <div class="footer">
    <div class="shape-separator">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#54c6c0" fill-opacity="0.3" d="M0,320L120,314.7C240,309,480,299,720,250.7C960,203,1200,117,1320,74.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
        <path fill="#54c6c0" fill-opacity="0.4" d="M0,320L120,314.7C240,309,480,299,720,282.7C960,267,1200,245,1320,234.7L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
      </svg>
    </div>

    <div class="footer-main">
    </div>
  </div>
</template>

<style>
div.footer {
  position: absolute;
  bottom: -25rem;
  width: 100%;
  z-index: -100 !important; /* otherwise keyboard event won't pass */
}

div.shape-separator svg {
  vertical-align:top;
}

div.footer-main {
  background-color: #4eb5b0;
  height: 10rem;
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
