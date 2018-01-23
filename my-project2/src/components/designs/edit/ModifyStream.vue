<template>
  <div class="asdf">  
		<div class="submit-modification">
		  <SubmitModification :parentId="id"></SubmitModification>
	  </div>
		<div v-if="loading">
        <v-progress-circular 
          indeterminate 
          color="red"
          :width="7"
          :size="70">    
        </v-progress-circular>
    </div>
    <div v-else id="stream-container">
			<DesignCard :design="design"></DesignCard>
			<DesignCard 
									v-for="mod in design.modifications" 
									:design="mod"
									:key="mod.id">
			</DesignCard>    
    </div>	
	</div>	
</template>

<script>
import DesignCard from '@/components/designs/DesignCard'	
import SubmitModification from '@/components/designs/SubmitModification'	

export default{
	props: ['id'],
	components: {
      DesignCard,
			SubmitModification
  }, 
  computed: {
    design() {
    	return this.$store.getters.loadedDesign(this.id)	  
    },
		loading() {
        return this.$store.getters.loading
    },
  },
}   
    
</script>

<style scoped>

    *{
        box-sizing:border-box;
    }
	.asdf{
		display:flex;
		flex-direction: column;
		align-items: center;
		margin-left: auto;
		margin-right: auto;
		
	}
    .stream-container{ 
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
				justify-content: center;
				align-items: center;
    }
    
</style>