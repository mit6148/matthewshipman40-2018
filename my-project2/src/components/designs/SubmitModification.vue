<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <v-btn color="primary" dark slot="activator">Submit a Modification</v-btn>
      <v-card>
				
				<div class="form-container">
					<form @submit.prevent="onCreateModification" id='form'>
						<h2 class="blue--text darken-1"> Submit a Modification </h2>
						<v-text-field
							name="firstName"
							label="First Name"
							id="firstName"
							v-model="firstName"
							required>
						</v-text-field>
						<v-text-field
							name="lastName"
							label="Last Name"
							id="lastName"
							v-model="lastName"
							required>
						</v-text-field>
						<v-text-field
							name="title"
							label="Title"
							id="title"
							v-model="title"
							required>
						</v-text-field>
							<v-text-field
							name="description"
							label="Description"
							id="description"
							v-model="description">
						</v-text-field>
						<v-btn 
							raised 
							class="blue darken-1 white--text" 
							@click="onPickFile">Uplaod Image
						</v-btn>
						<input 
							class="input"
							id="input"
							type="file" 
							ref="fileInput" 
							accept="image/*"
							@change="onFilePicked">
						<div v-if="imageUrl && !croppedImageUrl"> 
							<ImageCropper :imageUrl="imageUrl"></ImageCropper>  
						</div> 

						<div v-if="croppedImageUrl">
								<img :src="croppedImageUrl">
						</div>
					</form>
	      </div>
				
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="onClose">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="onCreateModification">Save Mod</v-btn>
        </v-card-actions>
				
      </v-card>
    </v-dialog>
	</div>
</template>


<script> 
import ImageCropper from './ImageCropper'
  
  export default {
			name: 'SubmitModification',
			props: ['parentId'],
      components: {
        ImageCropper
      },
      data (){
          return {
						  dialog: false,
              firstName:'',
              lastName:'',
              imageUrl: this.croppedImageUrl,
              image: null,	
							title: '',
							description: '',
          }
      },
      computed: {
          //form validation code improvements needed
          formIsValid(){
              return this.firstName !== '' 
                  && this.lastName !== '' 
                  && this.imageUrl !== ''
									&& this.title !== ''
          },
          croppedImageUrl() {
            return this.$store.getters.croppedImageUrl
          },
          cropping() {
              if(this.imageUrl && !this.croppedImageUrl){
                  return true
              } else {
                  return false
              }
          }
      },
      methods: {
        onCreateModification () {
          if (!this.formIsValid){
            return
          }
          if (!this.image){
            return
          }
					this.image.src = this.croppedImageUrl
          const designData = {
            firstName: this.firstName,
            lastName: this.lastName,
						title: this.title,
						description: this.description,
            image: this.image,
            date: new Date(),
						parentId: this.parentId,
						imageUrl: this.croppedImageUrl
          }
					this.dialog = false
          this.$store.dispatch('createModification', designData)
					this.$router.push('/modifyStream/' + this.parentId)
					this.$store.dispatch('cropImage', null) // resets the image 
					this.imageUrl = ''
				},
			  onClose (){
						this.dialog = false
						this.$store.dispatch('cropImage', null) // resets the image 
						this.imageUrl = ''
				},
        onPickFile () {
          //this.image = null
          document.getElementById('input').value= null
          this.imageUrl = '' 
          this.$store.dispatch('cropImage', '')
          this.$refs.fileInput.click()
        },
        onFilePicked (event) {
          //this.$store.dispatch('setLoading', true)  
          const files = event.target.files
          let filename = files[0].name
          if (filename.lastIndexOf('.') <= 0) {
            return alert('Please add a valid image file')
          }
          const fileReader = new FileReader()
          fileReader.addEventListener('load', () => {
            //this.$store.dispatch('setLoading', false)
            this.imageUrl = fileReader.result 
          })
          fileReader.readAsDataURL(files[0])
          this.image = files[0] 
        },
      }
  }
</script>


<style scoped> 
	*{
        box-sizing:border-box;
    }
	
	h2 {
		text-align: center;
		margin-bottom: 10px;
	}
	
	.form-container{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 500px;
		
		align-items: center;
	}
	#form{
		width:60%;
		margin-top: 15px;
	}
  .input{
    display:none;
  }

</style>

