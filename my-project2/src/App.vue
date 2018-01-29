<template>
  <v-app>
      
    <v-toolbar dark class="blue darken-1">
      <v-toolbar-side-icon @click="sideNav = !sideNav"
      class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Units are in Chickens</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn 
          flat 
          v-for="item in menuItems" 
          :key="item.title"
          router
          :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn 
          flat 
          v-if="userIsAuthenticated"
          @click="onLogout">
          <v-icon left>lock</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
      
    <v-navigation-drawer absolute v-model="sideNav" dark class="blue darken-1 hidden-md-and-up">
      <v-list>
        <v-list-tile 
          v-for="item in menuItems" 
          :key="item.title"
          router
          :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile 
          flat 
          v-if="userIsAuthenticated"
          @click="onLogout"
          to="/logout">
          <v-list-tile-action> 
            <v-icon left>lock</v-icon>
          </v-list-tile-action>
           <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
      
    <main>
      <router-view></router-view>
    </main>
      
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false,
      }
    },
    computed: {
        menuItems (){
            let menuItems = [
                    {icon: 'face', title:'Sign up = () =>', link: '/signup'},
                    {icon: 'lock_open', title:'Sign in = () =>', link: '/signin'},
                ]
            if(this.userIsAuthenticated) {
                menuItems = [
                    {icon: 'home', title:'Home = () =>', link: '/home'},
                    {icon: 'backup', title:'Submit Design = () =>', link: '/submitdesign'},
                    {icon: 'face', title:'Profile = () =>', link: '/profile'},
										{icon: 'face', title:'Gallery = () =>', link: '/gallery'}
                ]
            }
            return menuItems
        },
        userIsAuthenticated () {
            return this.$store.getters.user !== null && this.$store.getters.user !== undefined
						console.log (this.$store.getters.user)
        }
    },
    methods: {
      onLogout () {
        console.log("logout initiated!")
        this.$store.dispatch('logout')
				this.$router.push('/logout')
      },
    },
  }
</script>

<style scoped>
      
</style>