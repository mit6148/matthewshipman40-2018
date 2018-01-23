<template>
  <div>
    <div v-if="loading">
        <v-progress-circular 
          indeterminate 
          color="red"
          :width="7"
          :size="70">    
        </v-progress-circular>
    </div>
    <div v-else class="stream-container">
			<DesignCard
				v-for="design in designs" 
				:design="design"
				:modAvailable="true"
				:key="design.id">
			</DesignCard>    
    </div>
  </div>
</template>


<script>  
import DesignCard from '@/components/designs/DesignCard'	
	
  export default{
    name: 'PhotoStream',
		components: {
      DesignCard
  	}, 
    computed: {
      loading() {
        return this.$store.getters.loading
      },
      designs() {
        return this.$store.getters.featuredDesigns
      },
    },  
  }
</script>




<style scoped>
@import url('https://fonts.googleapis.com/css?family=Gloria+Hallelujah');

    *{
        box-sizing:border-box;
    }
    
    .stream-container{ 
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
				justify-content: center;
				align-items: center;
    }
    
</style>