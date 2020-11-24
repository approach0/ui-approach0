<template>
  <div id="footer" class="footer no-select" :style="footerStyle">
    <div class="shape-separator">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#36a4a9" fill-opacity="0.5" d="M0,320L120,314.7C240,309,480,299,720,250.7C960,203,1200,117,1320,74.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
        <path fill="#263238" fill-opacity="0.7" d="M0,320L120,314.7C240,309,480,299,720,282.7C960,267,1200,245,1320,234.7L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
      </svg>
    </div>

    <div class="footer-main p-grid p-d-flex p-py-5 p-jc-around">

      <div class="p-lg-6 p-md-12 p-sm-12" style="padding: 0 3rem">
        <h2 class="ft-title p-d-flex p-jc-center p-ai-center">
          Special Thanks
        </h2>
        <div class="p-d-flex p-grid p-jc-around thank-banner">
          <a target="_blank" href="https://www.cs.rit.edu/~dprl/">
            <img src="https://www.cs.rit.edu/~dprl/assets/images/dprl-2019-350x116.jpg"/>
          </a>
          <a target="_blank" href="https://www.linode.com/">
            <img src="https://www.linode.com/wp-content/uploads/2018/10/linode-logo-blk-rgb-minified.svg"/>
          </a>
          <a target="_blank" href="https://math.stackexchange.com/users/8297">
            <img src="https://math.stackexchange.com/users/flair/8297.png"/>
          </a>
          <a target="_blank" href="https://math.stackexchange.com/users/290240">
            <img src="https://math.stackexchange.com/users/flair/290240.png"/>
          </a>
        </div>

        <div class="p-m-2 thanksgiving">
          <p>As a side project reaching this far, I am thankful to my advisor
          <a target="_blank" href="https://www.cs.rit.edu/~rlaz/">Richard Zanibbi</a> and my previous advisor
          <a target="_blank" href="https://www.eecis.udel.edu/~hfang/">Fang Hui</a> for supporting and encouraging
          me to work on the idea of creating a math-aware search engine. Also I am thankful to
          <a target="_blank" href="https://linode.com/">Linode</a> who covers our hosting cost and
          keeps this site staying on real axis. Furthermore, I want to shout out to
          <a target="_blank" href="https://math.stackexchange.com/users/8297">Martin Sleziak</a> for his very first
          donation to this project and all kinds of support. And shout to
          <a target="_blank" href="https://math.stackexchange.com/users/290240">@Sil</a> for his code contribution.
          There are others who have contributed to this project (including me!),
          kudos to them in <a target="_blank" href="/docs/content/en/contributors.html">this page</a>.
          </p>
        </div>
      </div>

      <div class="p-lg-3 p-md-6 p-sm-12 p-d-flex p-jc-center">
        <div class="ft-block">

          <h2 class="ft-title">Links</h2>
          <ul class="ft-items">
            <li title="About This Project">
              <i class="fa fa-id-card"></i>
              <a @click="onClick">About</a>
            </li>
            <li title="Community AD">
              <i class="fa fa-unsorted"></i>
              <a @click="onClick">Community AD</a>
            </li>
          </ul>

          <h2 class="ft-title">Contribute</h2>
          <ul class="ft-items">
            <li title="User Guide">
              <i class="fa fa-map-o"></i>
              <a @click="onClick">User Guide</a>
            </li>
            <li title="Source Code of This Page">
              <i class="fa fa-paint-brush"></i>
              <a @click="onClick">This Webpage</a>
            </li>
            <li title="Sponsor Me">
              <i class="fa fa-heart-o"></i>
              <a @click="onClick">Sponsorship</a>
            </li>
            <li title="Developer Documentation">
              <i class="fa fa-book"></i>
              <a @click="onClick">Developer Docs</a>
            </li>
          </ul>

        </div>
      </div>

      <div class="p-lg-3 p-md-6 p-sm-12 p-d-flex p-jc-center">
        <div class="ft-block">

          <h2 class="ft-title">Current Index</h2>
          <ul class="ft-items">
            <li class="p-d-flex p-ai-start" title="Math StackExchange">
              <img :src="icon_mse"/>
              <a @click="onClick">Math StackExchange</a>
            </li>
            <li class="p-d-flex p-ai-start" title="Art of Problem Solving">
              <img :src="icon_aops"/>
              <a @click="onClick">Art of Problem Solving</a>
            </li>
            <li class="p-d-flex p-ai-start" title="Add more data source">
              <i class="fa fa-lg fa-question" style="width: 56px;"></i>
              <a @click="onClick">Help to Add More ...</a>
            </li>
          </ul>

          <h2 class="ft-title">Open Source</h2>
          <ul class="ft-items">
            <li title="Backend of This Site">
              <i class="fa fa-cogs"></i>
              <a @click="onClick">Open Backend</a>
            </li>
            <li title="Search Engine">
              <i class="fa fa-motorcycle"></i>
              <a @click="onClick">Search Engine</a>
            </li>
            <li title="Simple Math Solver">
              <i class="fa fa-superscript"></i>
              <a @click="onClick">Step-by-Step Solver</a>
            </li>
          </ul>

        </div>
      </div>

    </div>

    <div class="p-pt-3 p-px-6 footer-bottom">
      <div class="p-d-grid p-d-flex p-jc-center p-pt-4 footer-copyleft">
        <div> Approach Zero - {{ new Date().getFullYear() }} </div>
      </div>
      <div class="p-d-grid p-d-flex p-jc-center p-py-4 social-icons">
        <a title="comment" @click="onClick"><i class="fa fa-lg fa-comment"></i></a>
        <a title="github"  @click="onClick"><i class="fa fa-lg fa-github"></i></a>
        <a title="twitter" @click="onClick"><i class="fa fa-lg fa-twitter"></i></a>
        <a title="reddit"   @click="onClick"><i class="fa fa-lg fa-reddit"></i></a>
        <a title="email" href="mailto:clock126@126.com"><i alt="email" class="fa fa-lg fa-envelope-o"></i></a>
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
  /* vertical-align: top; */
}

div.footer-main {
  color: white;
  /* background-color: #4eb5b0; */
  background-color: #263238;
}

.thanksgiving a {
  font-weight: bold;
}

h2.ft-title {
  font-size: 1.4rem;
  font-weight: bold;
  text-transform: uppercase;
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
  color: #ccc;
}

.footer a:hover {
  color: white;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

div.footer-bottom {
  background-color: #263238;
}

div.footer-copyleft {
  color: white;
  border-top: 2px #99dcd9 solid;
  font-weight: bold;
}

div.social-icons i {
  padding: 0 6px;
}

div.thank-banner > a > img {
  height: 65px;
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
  },

  methods: {
    onClick(elem) {
      const gotoURL = function(url) {
        window.open(url, '_blank')
      }
      const anchor = $(elem.target).parent()
      const alt = $(anchor).attr('title')

      switch (alt) {

      /* Links */
      case 'About This Project':
        gotoURL('/docs/content/en/about.html')
        break
      case 'Community AD':
        gotoURL('https://math.meta.stackexchange.com/questions/31296')
        break

      /* Contribute */
      case 'User Guide':
        gotoURL('/guide')
        break
      case 'Source Code of This Page':
        gotoURL('https://github.com/approach0/ui-approach0')
        break
      case 'Sponsor Me':
        gotoURL('https://github.com/sponsors/t-k-')
        break
      case 'Developer Documentation':
        gotoURL('/docs')
        break

      /* Current Index */
      case 'Math StackExchange':
        gotoURL('https://math.stackexchange.com/')
        break
      case 'Art of Problem Solving':
        gotoURL('https://artofproblemsolving.com/community')
        break
      case 'Add more data source':
        gotoURL('https://github.com/approach0/a0-crawlers')
        break

      /* Open Source */
      case 'Backend of This Site':
        gotoURL('/backend')
        break
      case 'Search Engine':
        gotoURL('https://github.com/approach0/search-engine')
        break
      case 'Simple Math Solver':
        gotoURL('https://github.com/approach0/mathsteps-v2')
        break

      /* Social Medium */
      case 'email':
        window.location.
        break
      case 'github':
        gotoURL('https://github.com/approach0/')
        break
      case 'reddit':
        gotoURL('http://www.reddit.com/submit?url=https%3A%2F%2Fwww.approach0.xyz&title=Check%20out%20this%20math-aware%20search%20engine!')
        break
      case 'twitter':
        gotoURL('https://twitter.com/approach0')
        break
      case 'comment':
        gotoURL('https://chat.stackexchange.com/rooms/46148/in-the-search-of-a-question')
        break

      }
    }
  }
}
</script>
