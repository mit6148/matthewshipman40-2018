<template> 
  <v-dialog width='350px' persistent v-model="editDialog">
    <v-btn floating red darken-1 slot="activator" class="edit-button">
      <v-icon>edit</v-icon> EDIT
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Design</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="firstName"
                label="First Name"
                id="firstName"
                v-model="editedFirstName"
                required>
              </v-text-field>
              <v-text-field
                name="lastName"
                label="Last Name"
                id="lastName"
                v-model="editedLastName"
                required>
              </v-text-field>
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
          editedFirstName: this.design.firstName,
          editedLastName: this.design.lastName,
          editedTitle: this.design.lastName,
          editedDescription: this.design.description
            
        }
      },
      methods: {
        onSaveChanges(){
          if (this.editedFirstName.trim() ==='' ||
              this.editedLastName.trim() === '' ||
              this.editedTitle.trim() === '' ||
              this.editedDescription.trim() === ''){
            return         
          }
          this.editDialog = false 
          this.$store.dispatch('updateDesignData', {
              id: this.design.id, 
              firstName: this.editedFirstName, 
              lastName: this.editedLastName,
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