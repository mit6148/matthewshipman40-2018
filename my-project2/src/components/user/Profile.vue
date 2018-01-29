<template> 
  <div class="profile-container">
		<div class="user-details">
			<h1 class="header-one"><b>Login Details</b></h1>
			<table>
					<tr>
						<td><b>User Name:</b></td>
						<td>{{userName}}</td>
						<td align="right"><v-icon>create</v-icon> Edit</td>
					</tr>
			</table>	
			<table>
				<tr>
					<td><b>Email:</b></td>
					<td>{{userEmail}}</td>
					<td align="right"><v-icon>create</v-icon> Edit</td>
				</tr>
			</table>
			<table>
				<tr>
					<td><b>Password:</b></td>
					<td>{{userPassword}}</td>
					<td align="right"><v-icon>create</v-icon> Edit</td>
				</tr>
			</table>
		</div>
		
		<div class="user-generated-content">
			
			<h1 class="header-two"><b>Your Submissions</b></h1>
			<div class="submission-stream">
				<div v-for="design in userDesigns" class="submission-container">
					<div class="design-container">
						<img :src="design.imageUrl" class="image">
						<div class="text-container">  
							<div class="submission-info">    
								<div class="header blue--text darken-1"><b>{{ design.title }}</b></div>
								<div class="data"><b>Creator:</b> {{ userName }}</div>
								<div class="data"><b>Submit Date:</b> {{ design.date }} </div>
								<div class="data"><b>Votes Received: </b> {{ design.votes }}</div>
								<div class="data"><b>Description: </b> {{ design.description }}</div>
							</div>	
						</div>
	        </div>	
					<div class="edit-container-outter">
						<div class="submit-date"><b>Submit Date:</b> {{ design.date }} </div>
						<div class="edit-container">
							<EditDesignData :design="design"></EditDesignData>
							<v-btn icon @click.stop="deleteDesign(design)">
								<v-icon standard color="white">delete</v-icon>
							</v-btn>
						</div>	
					</div>
				</div> 
			</div>

			<h1 class="header-two"><b>Your Comments</b></h1>
			<div class="comment-container">
				<div v-for="comment in userComments" class="comments">			
					<p><b>Comment: </b> {{comment.comment}}</p>
					<div class="edit-container">  
							<EditComment :comment="comment"></EditComment>
							<v-btn icon @click.stop="deleteComment(comment)">
								<v-icon standard color="white">delete</v-icon>
							</v-btn>
					</div>
				</div>
			</div>
			
			
		</div>
	</div>
</template>


<script>  
import DesignCard from '@/components/designs/DesignCard'
import EditDesignData from '@/components/designs/edit/EditDesignData'
import EditComment from '@/components/designs/edit/EditComment'
	
  export default{
    name: 'Profile',
		components: {
      DesignCard,
			EditDesignData,
			EditComment
  	}, 
    computed: {
			userName() {
				return this.$store.getters.user.userName
			},
			userEmail() {
				return this.$store.getters.user.email
			},
			userPassword() {
				return this.$store.getters.user.password
			},
			userDesigns() {
				return this.$store.getters.user.designSubmissions
			},
			userComments() {
				return this.$store.getters.user.comments
			}
    },
		methods: {
			deleteDesign(design) {
				this.$store.dispatch('deleteDesign', design)
			},
			deleteComment(comment) {
				this.$store.dispatch('deleteComment', comment)
			}
		}
		
  }
</script>


<style scoped>
	
@import url('https://fonts.googleapis.com/css?family=Gloria+Hallelujah');

	*{
			box-sizing:border-box;
	}

	.profile-container{ 
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: flex-start;
		margin-top:50px;
	}

	.user-details{
		margin-right: auto;
		margin-left: auto;
	}
	
	table {
		border-bottom: solid grey 2px;
		margin-top: 30px;
	}
	
	td {
		padding: 10px;
		width: 200px;
	}
	
	.submission-stream{
		display: flex;
		flex-direction: row; 
		flex-wrap: wrap;
		width: 100%;
		
	}
	
	.submission-container{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 500px;
		margin-top: 20px;
		background-color: white;
		border: solid dodgerblue 5px;
		margin-left: 50px;
	}
	
	.image { 
		float: left;
		width: 230px;
		height: 230px;
		margin-right: 5px
	}
		
	.text-container {
		margin-top: 11px;
		margin-left: 5px;
		margin-bottom: 5px;
		
	}

	.edit-container-outter {
		display:flex;
		justify-content: space-between;
		align-items: center;
		background-color: dodgerblue;
		color: white;
	}
	
  .edit-container {
		display: flex;
		align-self: flex-end;
	}

	.comment-container {
		display: flex; 
		flex-direction: row;
		flex-wrap: wrap;
		margin-right: 5px;
		width: 100%;
	}
	
	.comments {
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-color: dodgerblue;
		color: white;
		padding:10px;
		width: 500px;
		margin-left: 50px;
	}
	
	h1 {
		color: dodgerblue;
	}
	
	.header-one{
	 margin-left: 0;
	}
	.header-two {
		margin-top: 30px;
		margin-left: 50px;
	}
	.submit-date{
		margin-left: 5px;
	}
</style>

