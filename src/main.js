/* jshint esversion: 9 */
import Vue from 'vue';
import App from './App.vue';
import './assets/css/style.css';
import * as VueWindow from '@hscmap/vue-window';
import VueNumericInput from 'vue-numeric-input';

import OrbitControls from 'orbit-controls-es6';
import * as VueGL from "vue-gl";

Object.keys(VueGL).forEach(name => {
    Vue.component(name, VueGL[name]);
});

Vue.component('OrbitControls', {
  inject: ['vglNamespace'],
  props: ['camera'],
  computed: {
    cmr () {
      return this.vglNamespace.cameras[this.camera];
    }
  },
  watch: {
    cmr: {
      handler(cmr) {
        this.$nextTick(() => {
          const controls = new OrbitControls(cmr, document.querySelector('canvas'));
          controls.enabled = true;
          controls.maxDistance = 15;
          controls.minDistance = 5;
          controls.maxPolarAngle = Math.PI /2;
          controls.minPolarAngle = 0;
          controls.addEventListener('change', () => {
            this.vglNamespace.update();
          });
          this.controls = controls;
        });
      },
      immediate: true,
    }
  },
  render(h) {
    return h('div');
  },
});

Vue.use(VueWindow);
Vue.use(VueNumericInput);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
