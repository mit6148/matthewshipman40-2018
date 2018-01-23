import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import { store } from './store'
import * as firebase from 'firebase'
import App from './App'
import router from './router'
import AlertCmp from './components/shared/Alert'
import EditDesignData from './components/designs/edit/EditDesignData.vue'


Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.component('app-alert', AlertCmp)
Vue.component('edit-design-data', EditDesignData)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
  // Initialize Firebase
    firebase.initializeApp({
      apiKey: 'AIzaSyBT8RiJpa-5jTKEzdMPSbUOAYVsaW8ajF4',
      authDomain: 'theunitsareinchickens-6129f.firebaseapp.com',
      databaseURL: 'https://theunitsareinchickens-6129f.firebaseio.com',
      projectId: 'theunitsareinchickens-6129f',
      storageBucket: 'theunitsareinchickens-6129f.appspot.com',
      messagingSenderId: '458382896065'
    })
		let user = null
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user).then(() => {
				this.$store.dispatch('fetchUserData')
				this.$store.dispatch('loadDesigns')
				})
      }
    })
    this.$store.dispatch('loadDesigns')
  }
})
