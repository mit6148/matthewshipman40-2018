<template> 
  <v-dialog width='350px' persistent v-model="editDialog">
		<v-btn slot="activator" class="edit-button" icon>
			<v-icon standard color="white">create</v-icon>
		</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
						<v-card-title><b>Edit Design</b></v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="title"
                label=" Design Title"
                id="title"
                v-model="editedTitle"
                required>
              </v-text-field>
              <v-text-field
                name="description"
                label="Description"
                id="description"
                v-model="editedDescription"
                multi-line>
              </v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn 
                flat
                class="blue--text darken-1" 
                @click="editDialog = false">Close
              </v-btn>
              <v-btn 
                flat 
                class="blue--text darken-1" 
                @click="onSaveChanges">Save
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>      
    </v-card>
  </v-dialog>
</template>

<script> 
  export default {
      props: ['design'],
      data () { 
        return {
          editDialog: false,
          editedTitle: this.design.title,
          editedDescription: this.design.description,
        }
      },
      methods: {
        onSaveChanges(){
          if (this.editedTitle.trim() === '' ||
              this.editedDescription.trim() === ''){
            return         
          }
          this.editDialog = false
					console.log(this.design)
          this.$store.dispatch('updateDesignData', {
              id: this.design.id, 
              title: this.editedTitle,
              description: this.editedDescription
          })
        }
      }
  }
</script>


<style scoped> 
    .edit-button{
        margin-left: 0; 
    }
</style>