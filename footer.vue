<template>
  <div id="footer" class="footer no-select" :style="footerStyle">
    <div class="shape-separator">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#54c6c0" fill-opacity="0.3" d="M0,320L120,314.7C240,309,480,299,720,250.7C960,203,1200,117,1320,74.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
        <path fill="#54c6c0" fill-opacity="0.4" d="M0,320L120,314.7C240,309,480,299,720,282.7C960,267,1200,245,1320,234.7L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
      </svg>
    </div>

    <div class="footer-main p-grid p-d-flex p-py-5 p-jc-around">

      <div class="p-lg-6 p-md-12 p-sm-12" style="padding: 0 3rem">
        <h2 class="ft-title p-d-flex p-jc-center p-ai-center">
          Special Thanks
        </h2>
        <div class="p-d-flex p-grid p-jc-around">
          <a><img src="https://www.cs.rit.edu/~dprl/assets/images/dprl-2019-350x116.jpg"/></a>
          <img src="https://www.linode.com/wp-content/uploads/2018/10/linode-logo-blk-rgb-minified.svg"/>
          <a><img src="https://math.stackexchange.com/users/flair/8297.png"/></a>
          <a><img src="https://math.stackexchange.com/users/flair/290240.png"/></a>
        </div>

        <div class="p-m-2 thanksgiving">
          <p>As a side project reaching this far, I am thankful to my advisor
          <a>Richard Zanibbi</a> and my previous advisor
          <a>Fang Hui</a> for supporting and encouraging me to work on the idea of creating a math-aware search engine.
          Also thankful to <a>Linode</a> who covers our hosting cost and makes this site staying on real axis.
          Furthermore, I want to shout out to <a>Martin Sleziak</a> for his very first kind donation and various help,
          and shout to <a>@Sil</a> for his code contribution.
          There are others who have contributed to this project (including me!),
          kudos to them in <a target="_blank" href="/docs/content/en/contributors.html">this page</a>.
          </p>
        </div>
      </div>

      <div class="p-lg-3 p-md-6 p-sm-12 p-d-flex p-jc-center">
        <div class="ft-block">
          <h2 class="ft-title">Contribute</h2>
          <ul class="ft-items">
            <li>
              <i class="fa fa-heart-o"></i>
              <a href="#">Sponsorship</a>
            </li>
            <li>
              <i class="fa fa-map-o"></i>
              <a href="#">User Guide</a>
            </li>
            <li>
              <i class="fa fa-book"></i>
              <a href="#">Developer Docs</a>
            </li>
            <li>
              <i class="fa fa-paint-brush"></i>
              <a href="#">This Webpage</a>
            </li>
            <li>
              <i class="fa fa-cogs"></i>
              <a href="#">Automation</a>
            </li>
            <li>
              <i class="fa fa-motorcycle"></i>
              <a href="#">Search Engine</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="p-lg-3 p-md-6 p-sm-12 p-d-flex p-jc-center">
        <div class="ft-block">
          <h2 class="ft-title">Current Index</h2>
          <ul class="ft-items">
            <li class="p-d-flex p-ai-start">
              <img :src="icon_mse"/>
              <a href="#">Math StackExchange</a>
            </li>
            <li class="p-d-flex p-ai-start">
              <img :src="icon_aops"/>
              <a href="#">Art of Problem Solving</a>
            </li>
            <li class="p-d-flex p-ai-start">
              <i class="fa fa-lg fa-question" style="width: 56px;"></i>
              <a href="#">Help to Add More ...</a>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <div class="footer-copyleft p-pt-3 p-px-6">
      <div class="p-d-grid p-d-flex p-jc-between p-py-4" style="border-top: 1px #99dcd9 solid;">
        <div></div>
        <div> <strong>Approach Zero - {{ new Date().getFullYear() }}</strong> </div>
        <div class="social-icons">
          <a><i class="fa fa-lg fa-comment"></i></a>
          <a><i class="fa fa-lg fa-github"></i></a>
          <a><i class="fa fa-lg fa-twitter"></i></a>
          <a><i class="fa fa-lg fa-reddit"></i></a>
          <a><i class="fa fa-lg fa-envelope-o"></i></a>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
div.footer {
  width: 100%;
  line-height: 1.5;
}

div.shape-separator svg {
  vertical-align: top;
}

div.footer-main {
  color: var(--surface-f);
  /* background-color: #4eb5b0; */
  background-color: #39928e;
}

.thanksgiving a {
  font-weight: bold;
}

h2.ft-title {
  font-size: 1.4rem;
  font-weight: bold;
}

.p-grid {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

ul.ft-items > li {
  margin: 10px 0;
}

ul.ft-items > li > i,img {
  padding: 4px 1rem;
  margin: 2px 0;
  max-width: 220px;
}

ul.ft-items > li > img {
  width: 56px;
}

.ft-block {
  width: 15rem;
}

div.footer a {
  text-decoration: none;
  color: var(--surface-e);
}

.footer a:hover {
  color: #376552;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 1.2rem;
}

div.footer-copyleft {
  color: var(--surface-e);
  background-color: #39928e;
}

div.social-icons i {
  padding: 0 6px;
}
</style>

<script>
export default {
  props : {
    footerStyle: String
  },
  data: function() {
    return {
      icon_mse: require('./resource/mse.png'),
      icon_aops: require('./resource/aops.png')
    }
  }
}
</script>
