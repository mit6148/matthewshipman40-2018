<template>
  <div>
		<SlideShow></SlideShow> 
		<br>
		<div class="logout"><h1> You're Logged Out! </h1></div>
  </div>
	
</template>

<script>
import SlideShow from '@/components/SlideShow'

export default{
  name: 'Logout',
  components: {
      SlideShow
  },
}

</script>

<style scoped> 
	.banner{
		background-image: url("../../static/images/chicken_in_space.jpg");
    background-size: cover;
    height: 500px;
    width: 100%;
	}
	
	.logout{
		width: 100%;
		text-align: center
	}
</style>

