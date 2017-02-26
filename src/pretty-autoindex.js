import Vue from 'vue';
import VueRouter from 'vue-router';
import Helper from './helper.js';

import packageJson from '../package.json';

Vue.use(VueRouter);
Vue.use(Helper);

Vue.component('directory', {
  props: ['name', 'path', 'icon', 'mtime'],
  computed: {
    visibilityOptions: function() {
      return conf.visibilityOptions;
    },
  },
  methods: {
    showPropertyWrapper: function(propertyName, propertyConfig, property) {
      return Vue.showProperty(propertyName, propertyConfig, property);
    },
  },
  template: `
    <li class="files__directory menu-item columns">
      <div class="flex-table-item flex-table-item-primary">
        <div class="files__icon-container">
          <span v-if="icon"
                class="octicon octicon-{{ icon }}"></span>
        </div>
        <a v-link="path">{{ name }}</a>
      </div>
      <div v-for="(propertyName, propertyConfig) in visibilityOptions"
           class="flex-table-item pr-1 text-right">
        <template v-if="propertyConfig['use']">
          {{ showPropertyWrapper(propertyName, propertyConfig, {date: this.mtime}) }}
        </template>
      </div>
    </li>
  `,
});

Vue.component('file', {
  props: ['name', 'path', 'icon', 'mtime', 'size'],
  computed: {
    visibilityOptions: function() {
      return conf.visibilityOptions;
    },
    link: function() {
      return conf.address + this.path;
    },
  },
  methods: {
    showPropertyWrapper: function(propertyName, propertyConfig, property) {
      return Vue.showProperty(propertyName, propertyConfig, property);
    },
  },
  template: `
    <li class="files__file menu-item flex-table">
      <div class="flex-table-item flex-table-item-primary">
        <div class="files__icon-container">
          <span v-if="icon"
                class="octicon octicon-{{ icon }}"></span>
        </div>
        <a :href="link">{{ name }}</a>
      </div>
      <div v-for="(propertyName, propertyConfig) in visibilityOptions"
           class="flex-table-item pr-1 text-right">
        <template v-if="propertyConfig['use']">
          {{ showPropertyWrapper(propertyName, propertyConfig, {date: this.mtime, size: this.size}) }}
        </template>
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
      packageJson: packageJson,
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
    <div class="app">
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
    </div>

    <footer class="footer">
      <div class="footer__text">
        Generated with
        <a href="{{ packageJson.homepage }}"
           class="muted-link">
          {{ packageJson.name }}
        </a>
        {{ packageJson.version }}.
      </div>
      <div class="footer__mark">
        <a href="{{ packageJson.homepage }}"
           class="muted-link">
          <span class="octicon octicon-mark-github"></span>
        </a>
      </div>
    </footer>
  `,
});

const router = new VueRouter();
router.afterEach((transition) => {
  router.app.$set('path', transition.to.path);
  router.app.fetchFileInfo();
});
router.start(App, 'app');
