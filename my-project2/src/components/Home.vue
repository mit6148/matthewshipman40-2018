<template>
  <div>
    <!--<div class="banner"></div>-->	
		<SlideShow></SlideShow> 
  </div>
</template>

<script>
import PhotoStream from '@/components/designs/PhotoStream'
import SlideShow from '@/components/SlideShow'

export default{
  name: 'Home',
  components: {
      PhotoStream, 
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
</style>

