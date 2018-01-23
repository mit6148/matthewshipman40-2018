<template>
    <div class="slideshow-container">
      <div 
        v-for="article in news" 
        class="fade banner" 
        v-show="index % news.length == article.i">
        <img 
          :src="article.imageUrl"
          v-on:mouseover="stopRotation"
          v-on:mouseout="startRotation">
        <div class="headline">{{article.headline}}</div>
      </div>
      <a class="prev" @click="next">&#10094;</a>
      <a class="next" @click="prev">&#10095;</a> 
      <div class="dotContainer">
        <div 
          v-for="article in news"
          style="display:inline-block">
          <span
            @click="goto(article.i)"         
            v-if="index % news.length == article.i"
            class="dot active">
          </span>
          <span  
            @click="goto(article.i)"
            v-else-if="index % news.length !== article.i"
            class="dot">
          </span>
        </div>  
      </div>
    </div>
</template>

<script>

export default{
  name: 'SlideShow',
  computed: {
    news() {
        return this.$store.getters.featuredNews 
    }      
  },   
  
  data () {
    return {
      index: 0, 
      timer: null,
      isAcitve: false
    }
  },
    
  created: function() {
    this.startRotation()
  },
    
  methods: {
    startRotation: function() {
      this.timer = setInterval(this.next, 5000)    
    }, 
    stopRotation: function(){
        clearTimeout(this.timer)
        this.timer = null
    },
    next: function() {
      this.index = Math.abs(this.index + 1)
      this.stopRotation()
      this.startRotation()
    },
    prev: function() {
      this.index = Math.abs(this.index - 1) 
      this.stopRotation()
      this.startRotation()
    },
    goto: function(i) {
      this.index = i
      this.stopRotation()
      this.startRotation()
    },
  }

}

</script>


<style scoped> 
@import url('https://fonts.googleapis.com/css?family=Gloria+Hallelujah');
    
    * {
      box-sizing: border-box;
    }
    
    p{
      text-align: center;
    }
    
    .slideshow-container {
      width: 100%;
      position: relative;
      margin: auto;
      margin-top: 0px;
    }

    /* Hide the images by default */
    img {
        width:100%;
        height:300px;
    }
    
    .headline{
        position: absolute; 
        top:20px; 
        left:20px;
        color:lightblue;
        font-family:'gloria Hallelujah';
    }
    
    .dotContainer{
        text-align: center;
    }
    
    /* Next & previous buttons */
    .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 16px;
      color: lightblue;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
    }

    /* Position the "next button" to the right */
    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }

    /* On hover, add a black background color with a little bit see-through */
    .prev:hover, .next:hover {
      background-color: rgba(0,0,0,0.8);
    }

    /* Caption text */

    /* Number text (1/3 etc) */

    /* The dots/bullets/indicators */
    .dot {
      cursor:pointer;
      height: 15px;
      width: 15px;
      margin: 0 2px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
      transition: background-color 0.6s ease;
    }

    .active, .dot:hover {
      background-color: #717171;
    }

    /* Fading animation */
    .fade {
      -webkit-animation-name: fade;
      -webkit-animation-duration: 1.5s;
      animation-name: fade;
      animation-duration: 1.5s;
    }

    @-webkit-keyframes fade {
      from {opacity: .4} 
      to {opacity: 1}
    }

    @keyframes fade {
      from {opacity: .4} 
      to {opacity: 1}
    }
</style>