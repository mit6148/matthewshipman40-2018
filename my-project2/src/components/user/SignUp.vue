<template> 
  <v-container>
    <v-layout row v-if="error" justify-space-around>
      <v-flex xs12 sm8 md6 lg4>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout justify-space-around>
      <v-flex xs12 sm8 md6 lg4>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignup">  
								<v-layout row> 
                  <v-flex xs12>
                    <v-text-field 
                      name="userName"
                      label="UserName"
                      id="userName"
                      v-model="userName"
                      type="userName"
                      required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row> 
                  <v-flex xs12>
                    <v-text-field 
                      name="email"
                      label="Mail"
                      id="email"
                      v-model="email"
                      type="email"
											:rules="emailRules"
                      required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row> 
                  <v-flex xs12>
                    <v-text-field 
                      name="password"
                      label="password"
                      id="password"
                      v-model="password"
                      type="password"
                      required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row> 
                  <v-flex xs12>
                    <v-text-field 
                      name="confirmPassword"
                      label="confirmPassword"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      type="password"
                      :rules="passwordRules"
                      >
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout> 
                  <v-flex xs12>
                    <v-btn type="submit"
                      :disabled="disabled"
                      :loading="loading"> Sign Up
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container> 
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script> 

export default {
    data() {
        return {
            email: '',
            password: '',
            confirmPassword: '',
						userName: '',
        }
    },
    methods: {
        onSignup() {
            //use vuex
            this.$store.dispatch('signUserUp', {email: this.email, password: this.password, userName: this.userName})
        }, 
        onDismissed (){
            console.log('Dismissed Alert!')
            this.$store.dispatch('clearError')
        }
    },
    computed: {
        user () {
          return this.$store.getters.user    
        },
        error () {
          return this.$store.getters.error
        },
        loading () {
          return this.$store.getters.loading
        },
				disabled () {
					if(!this.loading && 
						 this.passwordRules[0] == true && 
						 this.passwordRules[1] == true &&
						 this.emailRules[0] == true)
					{
						return false
					}
					return true
				},
			  passwordRules () {
					return [
						this.password == this.confirmPassword || 'Passwords dont match',
						this.password !== '' || ''
					]
				},
				emailRules() {
					return [
						/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) || 'E-mail must be valid'
					]
				}
    },
    watch: {
        user (value) {
            if (value !== null && value !== undefined){
                this.$router.push('/')
            }
        }
    }
}


</script>

<style scoped>
    
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
    
</style>








