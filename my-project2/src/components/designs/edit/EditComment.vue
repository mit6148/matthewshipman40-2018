<template> 
  <v-dialog width='350px' persistent v-model="editDialog">
		<v-btn slot="activator" class="edit-button" icon>
			<v-icon standard color="white">create</v-icon>
		</v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
						<v-card-title><b>Edit Comment</b></v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="comment"
                label="Comment"
                id="comment"
                v-model="editedComment"
                required>
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
      props: ['comment'],
      data () { 
        return {
          editDialog: false,
          editedComment: this.comment.comment,
        }
      },
      methods: {
        onSaveChanges(){
          if (this.editedComment.trim() === '' ||
              this.editedComment.trim() === ''){
            return         
          }
          this.editDialog = false
          this.$store.dispatch('updateComment', {
              id: this.comment.id, 
              comment: this.editedComment,
							designId: this.comment.designId
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