import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

Vue.component('directory', {
  props: ['name', 'path', 'icon', 'mtime'],
  template: `
    <li class="files__directory menu-item columns">
      <div class="three-fourths column">
        <div class="files__icon-container">
          <span v-if="icon"
                class="octicon octicon-{{ icon }}"></span>
        </div>
        <a v-link="path">{{ name }}</a>
      </div>
      <div class="one-fourth column text-right">
        {{ mtime }}
      </div>
    </li>
  `,
});

Vue.component('file', {
  props: ['name', 'path', 'icon', 'mtime', 'size'],
  computed: {
    link: function() {
      return conf.address + this.path;
    },
  },
  template: `
    <li class="files__file menu-item columns">
      <div class="three-fourths column">
        <div class="files__icon-container">
          <span v-if="icon"
                class="octicon octicon-{{ icon }}"></span>
        </div>
        <a :href="link">{{ name }}</a>
      </div>
      <div class="one-fourth column text-right">
        {{ mtime }}
      </div>
    </li>
  `,
});

Vue.component('loading', {
  props: ['loading', 'failed'],
  template: `
    <div v-if="loading || failed"
         class="loading">
      <div class="container">
        <div v-if="loading" class="loading__spinner"></div>
        <div v-if="failed" class="loading__failed">
          Load failed.
        </div>
      </div>
    </div>
  `,
});

const App = Vue.extend({
  data() {
    return {
      path: '',
      conf: conf,
      files: null,
      loading: false,
      failed: false,
    };
  },

  computed: {
    pathArray: function() {
      return this.path.split('/').filter((e) => e !== '');
    },
  },

  methods: {
    fetchFileInfo() {
      this.failed = false;
      this.loading = true;

      const xhr = new XMLHttpRequest();
      const address = conf.address + this.path;
      xhr.open('GET', address);
      xhr.onloadend = () => {
        if (xhr.status !== 200) {
          this.failed = true;
          this.loading = false;
        }
        else {
          try {
            this.files = JSON.parse(xhr.responseText);
            this.loading = false;
          } catch(e) {
            this.failed = true;
            this.loading = false;
          }
        }
      };
      xhr.send();
    },
  },

  template: `
    <loading :loading="loading" :failed="failed"></loading>
    <div class="breadcrumb">
      <span class="breadcrumb__root">
        <a v-link="'/'">{{ conf.name }}</a>
      </span>
      <span class="breadcrumb__separator">/</span>
      <template v-for="(i, dir) in pathArray">
        <span class="breadcrumb__directory"
              :class="{ 'last-one': pathArray.length === i + 1}">
          <a v-link="'/' + pathArray.slice(0, i+1).join('/')">
            {{ dir }}
          </a>
        </span>
        <span class="breadcrumb__separator">/</span>
      </template>
    </div>
    <ul v-if="files !== null"
        class="files menu">
      <template v-if="pathArray.length > 0">
        <directory :name=".."
                   :path="'/' + pathArray.slice(0, -1).join('/')">
        </directory>
      </template>
      <template v-for="file in files">
        <directory v-if="file.type === 'directory'"
                   icon="file-directory"
                   :name="file.name"
                   :path="path + '/' + file.name"
                   :mtime="file.mtime">
         </directory>
        <file v-else
              icon="file-text"
              :path="path + '/' + file.name"
              :name="file.name"
              :mtime="file.mtime"
              :size="file.size">
        </file>
      </template>
    </ul>
  `,
});

const router = new VueRouter();
router.afterEach((transition) => {
  router.app.$set('path', transition.to.path);
  router.app.fetchFileInfo();
});
router.start(App, 'app');
