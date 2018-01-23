<template>
	<div class="post-container">
		<DesignCard :design="design" modAvailable="true"></DesignCard>
		<CommentFeed></CommentFeed>
	</div>
</template>

<script>
import DesignCard from '@/components/designs/DesignCard'
import CommentFeed from '@/components/designs/CommentFeed'	

	export default {
		name: 'Post',
		props: ['design', 'modAvailable'],
		components: {
      DesignCard,
			CommentFeed
  	}, 
	}
</script>

<style scoped> 
	*{
			box-sizing:border-box;
	}
	
	.post-container{
		width: 350px;	
		margin-top: 10px; 
		margin-left: 10px; 
		margin-right: 10px;
		margin-bottom: 10px; 
	}
	
</style>