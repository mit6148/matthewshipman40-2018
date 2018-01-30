<template>
  <div class="wrapper">
		<SlideShow class='banner'></SlideShow> 
		<div class="call-to-action-container">
			<div class="chick-logo-container">
					<img src="../../static/images/chick_final.png" class="chick-logo">
			</div>
			<div class="call-to-action">
				<h1>Welcome to the Units Are in Chickens</h1>
				<router-link class="router-link" to="/SubmitDesign">Submit your favorite science or technology meme <u>here</u></router-link>
				<h2>or</h2>
				<router-link class="router-link" to="/Gallery">Browse submited memes <u>here</u></router-link>
			</div>
		</div>
  </div>
</template>

<script>
import SlideShow from '@/components/SlideShow'

export default{
  name: 'Home',
  components: {
      SlideShow
  },
}

</script>

<style scoped> 
	@import url('https://fonts.googleapis.com/css?family=Gloria+Hallelujah');
	.wrapper{
		width:100%;
	}
	.chick-logo-container{
		margin:40px;
	}
	.chick-logo{
		width: 400px;
		float:left
	}
	
	.call-to-action-container{
		display: flex; 
		flex-direction: row;
	}
	h1{
		font-family:'gloria Hallelujah';
		color: dodgerblue;
		font-size: 50px;
	}
	h2{
		font-size: 35px;
		text-decoration: none;
	}
	
	.router-link{
		margin-top: 15px;
		font-size: 35px;
		text-decoration: none;
		color: black;
	}
	
	.call-to-action {
		margin-left: 0px;
		margin-top: 40px;
		margin-right: 40px;
		text-align: center;
	}
</style>

