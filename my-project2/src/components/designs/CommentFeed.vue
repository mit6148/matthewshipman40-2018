<template> 
	<div class="comment-container">
		<div v-if="showComments" class="userComments">
			<div 
				v-for="comment in design.comments.slice(0,loadedComments)" 
				class="comment"
				:key="comment.id">
				<p><b>{{ comment.userName }}: </b> {{ comment.comment }}</p>
			</div>
			<div class="expander-container">
				<v-icon standard @click='openMoreComments' v-if="loadedComments < design.comments.length">expand_more</v-icon>
				<v-icon standard @click='closeComments' v-if='loadedComments > 5'>expand_less</v-icon>
			</div>
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
		props: ['design', 'showComments'],
		data () { 
			return {
				comment: '',
				loadedComments: 5
			}
		},
		computed: {
			userName () {
				return this.$store.getters.user.userName
			},
		},
		methods: { 
			postComment(){
				let payload = {
					comment: this.comment, 
					designId: this.design.id,
				}
				this.$store.dispatch('addComment', payload)
				this.comment = ''
			},
			openMoreComments() {
				this.loadedComments = this.loadedComments + 5
			},
			closeComments() {
				this.loadedComments = 5
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
		padding: 5px;
	}
	
	.userComments{ 
		text-align: left;
	}
	
	.expander-container { 
		text-align: center;
	}
	
	.comment{ 
		background-color: white; 
		width: 90%;
		border-radius: 15px;
		margin-top: 5px;
		margin-left: auto; 
		margin-right: auto;
	}
	
	.add-comment {
		background-color: white; 
		width: 95%;
		border-radius: 40px;
		margin: auto;
		margin-top: 5px;
	
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