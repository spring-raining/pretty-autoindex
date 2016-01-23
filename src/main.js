import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

Vue.component('directory', {
  props: ['name', 'path', 'mtime'],
  template: `
    <a v-link="path">{{ name }}</a>
  `,
});

Vue.component('file', {
  props: ['name', 'path', 'mtime', 'size'],
  computed: {
    link: function() {
      return conf.address + this.path;
    },
  },
  template: `
    <a :href="link">{{ name }}</a>
  `,
});

const App = Vue.extend({
  data() {
    return {
      path: '',
      conf: conf,
      files: null,
      fetching: false,
      fetchingFailed: false,
    };
  },

  computed: {
    pathArray: function() {
      return this.path.split('/').filter((e) => e !== '');
    },
  },

  methods: {
    fetchFileInfo() {
      this.fetchingFailed = false;
      this.fetching = true;

      const xhr = new XMLHttpRequest();
      const address = conf.address + this.path;
      xhr.open('GET', address);
      xhr.onloadend = () => {
        if (xhr.status !== 200) {
          this.fetchingFailed = true;
          this.fetching = false;
        }
        else {
          try {
            this.files = JSON.parse(xhr.responseText);
            this.fetching = false;
          } catch(e) {
            this.fetchingFailed = true;
            this.fetching = false;
          }
        }
      };
      xhr.send();
    },
  },

  template: `
    <div class="breadcrumb">
      <span class="breadcrumb__root">
        <a v-link="'/'">{{ conf.name }}</a>
      </span>
      <span class="breadcrumb__separator">/</span>
      <template v-for="(i, dir) in pathArray">
        <span class="breadcrumb__directory">
          <a v-link="'/' + pathArray.slice(0, i+1).join('/')">
            {{ dir }}
          </a>
        </span>
        <span class="breadcrumb__separator">/</span>
      </template>
    </div>
    <div v-if="fetching || fetchingFailed">
      <div v-if="fetching">Fetching...</div>
      <div v-if="fetchingFailed">Fetching failed.</div>
    </div>
    <div v-else>
      <ul>
        <li v-if="pathArray.length > 0">
          <directory :name=".."
                     :path="'/' + pathArray.slice(0, -1).join('/')">
          </directory>
        </li>
        <li v-for="file in files">
          <directory v-if="file.type === 'directory'"
                     :name="file.name"
                     :path="path + '/' + file.name">
           </directory>
          <file v-else
                :path="path + '/' + file.name"
                :name="file.name">
          </file>
        </li>
      </ul>
    </div>
  `,
});

const router = new VueRouter();
router.afterEach((transition) => {
  router.app.$set('path', transition.to.path);
  router.app.fetchFileInfo();
});
router.start(App, 'app');
