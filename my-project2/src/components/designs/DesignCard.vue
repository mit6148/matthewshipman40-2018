<template>
	<div class="submission-container"> 	
		<div class="design-details" :class="setClass">
			<div class="submission-content" @click="openDescription">
				<div class="image-container">
					<img :src="design.imageUrl" class="image">
					<v-btn v-if="userIsAuthenticated && modAvailable"
								 class="white--text blue darkent-1 modify-button"
								 @click="onLoadModifyStream(design.id)">Modify
					</v-btn>
				</div>
				<div class="text-container">  
					<div class="submission-info">    
						<div class="header blue--text darken-1">{{ design.title }}</div>
						<div class="data"><b>Creator:</b> {{ design.userName }}</div>
						<div class="data"><b>Submit Date:</b> {{ design.date }} </div>
						<div class="data"><b>Votes Received: </b> {{ design.votes }}</div>
						<div class="data"><b>Photo Key: </b> {{ design.id }}</div> 
					</div>
					<div v-if="userIsAuthenticated" class="vote-container">  
						<v-card-actions class="white">
							<v-btn icon @click.stop="onLikeDesign()">
								<v-icon standard>thumb_up</v-icon>
							</v-btn>
							<v-btn icon @click.stop="onHateDesign()">
								<v-icon standard>thumb_down</v-icon>
							</v-btn>
							<v-btn icon @click.stop="showCommentFeed">
								<v-icon standard>insert_comment</v-icon>
							</v-btn>
						</v-card-actions>
					</div>
				</div>    
			</div>
		</div>
		
		<div class ="expansion-panel" :class="design.id">
			<p>{{design.description}}</p>
		</div>
		<CommentFeed :design="design" :showComments="showComments"></CommentFeed>
	</div>	
</template>

<script>    
	import CommentFeed from '@/components/designs/CommentFeed'
	
  export default{
    name: 'DesignCard', 
		props: ['design', 'modAvailable'],
		components: {
			CommentFeed
		},
		data () {
			return {
				showComments: 'false'
			}
		},
    computed: {
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
			setClass: {
				get: function() {
					return this.$store.getters.userVote(this.design.id)
				},
				set: function() {
			
				}
			}
			
    },  
    methods: {
			openDescription() {
				
				let panel = document.getElementsByClassName(this.design.id)[0]
				if (panel.style.maxHeight){
					panel.style.maxHeight = null;
				} else {
					panel.style.maxHeight = panel.scrollHeight + "px";
    		} 
			},
      onLikeDesign() {
				let feedback = this.$store.getters.userVote(this.design.id)
				console.log(feedback)
				if (feedback == '' || feedback == undefined || feedback == null || feedback == 'hate'){
					feedback = 'like'
				} else {
					feedback = ''
				}
				let payload = {
					designId: this.design.id, 
					feedback: feedback
				}
				this.$store.dispatch('onFeedback', payload) 
				this.setClass = feedback
      },
			
      onHateDesign() {
				let feedback = this.$store.getters.userVote(this.design.id)
				console.log(feedback)
				if (feedback == '' || feedback == undefined || feedback == null || feedback == 'like'){
					feedback = 'hate'
				} else {
					feedback = ''
				}
				let payload = {
					designId: this.design.id, 
					feedback: feedback
				}
				this.$store.dispatch('onFeedback', payload) 
				 this.setClass = feedback
      },
			
      onLoadModifyStream(id){
          this.$router.push('/modifyStream/' + id)
      },
			showCommentFeed() {
				this.showComments = !this.showComments
		}
    },
  } 
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Gloria+Hallelujah');

    *{
        box-sizing:border-box;
    }
    
    .submission-container{
			width: 550px;
			margin: 10px;
    }
		
		.design-details{
			border: solid dodgerblue 5px;
		}
    
    .submission-content{
      display: flex; 
      flex-direction: row;
      justify-content: space-between;
			transition: 0.4s;
			background-color: white;
			cursor: pointer;
    }
    
    .image-container{
      display: flex; 
      flex-direction: column;   
      align-items: center;
      justify-content: center;
			
    }
    
    .image{
      height: 250px;
      width: 250px; 
    }
	
    .modify-button{
      width: 100%
    }
    .text-container{
      display: flex;
      flex-direction: column;
			justify-content: space-between;
			margin: 10px;
    }
    .submission-info{
      margin-left: 0px;
    }
	
    .vote-container{
      display: flex;
      flex-direction: row;
      align-self: flex-end;
        
    }
    .header{
      font-size: 20px;
      margin-bottom: 5px;
    }

    .data{
      font-size: 15px;
    }
    
		.expansion-panel {
			background-color: dodgerblue;
			color: white;
			width: 100%;
			max-height: 0;
    	overflow: hidden;
    	transition: max-height 0.2s ease-out;
			border-bottom-right-radius: 10px;
			border-bottom-left-radius: 10px;
		}
	
    .like{
      border: solid green 5px;
    }
    
    .hate{
      border: solid red 5px;
    }
	
		p {
			padding: 5px;	
		}

</style>