<template>
  <span class="pagination">
    <a v-if="cur_page - 1 > 0" title="Previous page" @click="goto_page(cur_page - 1)">
      <i class="fa fa-angle-left" aria-hidden="true"></i>
    </a>

    <template v-if="-1 == pages.indexOf(1)">
      <a title="First page" @click="goto_page(1)"> 1 </a>
      <span v-if="-1 == pages.indexOf(2)"> ... </span>
    </template>

    <a v-for="p in pages" :key="p" @click="goto_page(p)" :title="'Go to page ' + p"
       :class="{active: p == cur_page}">{{p}}</a>

    <template v-if="-1 == pages.indexOf(tot_pages)">
      <span v-if="-1 == pages.indexOf(tot_pages - 1)"> ...  </span>
      <a title="Last page" @click="goto_page(tot_pages)"> {{tot_pages}} </a>
    </template>

    <a v-if="cur_page + 1 <= tot_pages" title="Next page" @click="goto_page(cur_page + 1)">
      <i class="fa fa-angle-right" aria-hidden="true"></i>
    </a>

  </span>
</template>

<style>
.pagination a {
  color: var(--text-color);
  padding: 0.5rem 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: background-color .3s;
  border-radius: 0.5rem;
}

.pagination a.active {
  background-color: #54c6c0;
  color: white;
  cursor: default;
}

.pagination a:hover:not(.active) {
  background-color: var(--surface-c);
}
</style>

<script>
export default {
  props : {
    cur_page: Number,
    tot_pages: Number
  },

  emits: ['goto'],

  computed: {
    pages() {
      const page = this.cur_page
      const tot_pages = this.tot_pages

      const wind = 5; /* better be odd for symmetry */
      const half = Math.ceil((wind - 1) / 2)
      let left = Math.max(1, page - half)
      let right = Math.min(tot_pages, page + half)

      if (left == 1)
        right = Math.min(tot_pages, left + wind - 1)
      else if (right == tot_pages)
        left = Math.max(1, right - wind + 1)

      const pages = []
      for (let i = left; i <= right; i++)
        pages.push(i)

      return pages
    }
  },

  methods: {
    goto_page(num) {
      this.$emit('goto', num)
    }
  }
}
</script>
