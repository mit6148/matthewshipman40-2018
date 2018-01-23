<template> 
	<div class="comment-container">
		<div 
			v-for="comment in design.comments" 
			class="comment"
			:key="comment.id">
			<p><b>{{ userName }}: </b> {{ comment.comment }}</p>
		</div>
		<div class="add-comment">
			<div class="inner-container">
			<v-text-field
              name="comment"
              label="Enter a comment..."
              single-line
							append-icon="input"
							:append-icon-cb="postComment"
							v-model="comment">
      </v-text-field>
			</div>
		</div>
	</div>
</template>

<script>  
	
  export default{
    name: 'CommentFeed',
		props: ['design'],
		data () { 
			return {
				comment: ''
			}
		},
		computed: {
			userName () {
				return this.$store.getters.user.userName
			},
		},
		methods: { 
			postComment(){
				this.$store.dispatch('addComment', {comment: this.comment, designId: this.design.id})
				this.comment = ''
			}
		}
  }
	
</script>


<style scoped>

	.comment-container{ 
		background-color: #f2f2f2;
		width: 100%; 
		border-radius: 10px; 
		margin-top: 5px;
		padding: 15px;
	}
	
	.comment{ 
		background-color: white; 
		width: 90%;
		border-radius: 15px;
		margin-top: 10px;
		margin-left: auto; 
		margin-right: auto;
	}
	
	.add-comment {
		background-color: white; 
		width: 95%;
		border-radius: 40px;
		margin: auto;
		margin-top: 20px;
		margin-left: 
	}
	
	.inner-container{
		width:80%;
		margin: auto;
	}
	
	p {
		font-size: 16px;
    padding: 2px;
		margin: 5px;	
	}
	
	b {
		color: dodgerblue;
	}
</style>