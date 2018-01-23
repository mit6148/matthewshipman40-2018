<template>
  <div class="cropper-container">
		<button class="btn-crop" @click.prevent="crop">Crop</button>
  	<div class="container-inner-left"></div>
  	<div class="container-inner-right"></div>
		<div 
      class="resize-container"
      v-bind:style="{ left: left + 'px', top: top + 'px' }">
      
			<span 
        class="resize-handle resize-handle-nw"
        @mousedown="startResize"></span>
      <span 
        class="resize-handle resize-handle-ne"
        @mousedown="startResize"></span>
      <img 
        :src="newImageUrl" 
        ref="uploadedImageTag" 
        id="image-target"
        @mousedown="startMoving">
      <span 
        class="resize-handle resize-handle-sw"
        @mousedown="startResize"></span>
      <span 
        class="resize-handle resize-handle-se"
        @mousedown="startResize"></span>
    </div>
    <div class="overlay">
      <div class="overlay-inner"></div>
    </div> 
  </div>
</template>


<script>
  export default {
	name: 'ImageCropper',
	props: ['imageUrl'],
    data() {
        return {
            eventState: {
                container_width: null, 
                container_height: null,
                container_left: null,
                container_top: null,
                mouse_x: null,
                mouse_y: null,
                evnt: null
            },
            container: null,
            imageTarget: null,
            width: null,
            height: null,
            left: 0,
            top: 0,
            mouseX: null,
            mouseY: null,
            orig_src: new Image(),
            newImageUrl: this.imageUrl,
						working_window_ref: null,
						working_window: null
        }
    },
    methods: {
      startResize(event) {
        event.preventDefault()
        event.stopPropagation()
				this.saveEventState(event)
        document.addEventListener('mousemove', this.resizing)
        document.addEventListener('mouseup', this.endResize)
        //Touch functionality?
        document.addEventListener('touchmove', this.resizing)
        document.addEventListener('touchend', this.endResize)
      },
      
      endResize(event){
        event.preventDefault()
        document.removeEventListener('mouseup', this.endResize)
        document.removeEventListener('mousemove', this.resizing)
        //Touch functionality?
        document.removeEventListener('touchend', this.endResize)//Maybe not needed
        document.removeEventListener('touchmove', this.resizing)//Maybe not needed

      },
        
      startMoving(event){
        console.log('start Moving!!')
        event.preventDefault()
        event.stopPropagation()
        this.saveEventState(event)
        document.addEventListener('mousemove', this.moving)
        document.addEventListener('mouseup', this.endMoving)
        //Touch functionality?
        document.addEventListener('touchmove', this.moving)
        document.addEventListener('touchend', this.endMoving)
      },
      
      endMoving(event){
        event.preventDefault()
        document.removeEventListener('mouseup', this.endMoving)
        document.removeEventListener('mousemove', this.moving)
        //Touch functionality?
        document.removeEventListener('touchend', this.endMoving)
        document.removeEventListener('touchmove', this.moving)
      },
      
      saveEventState(event) {
        this.eventState.container_width =  this.container.offsetWidth
        this.eventState.container_height = this.container.offsetHeight
        this.eventState.container_left = this.container.offsetLeft 
        this.eventState.container_top = this.container.offsetTop
        this.eventState.mouse_x = this.getMouseX() 
        this.eventState.mouse_y = this.getMouseY()
        this.eventState.evnt = event
      },
			
      getMouseX () {
				this.working_window_ref = this.working_window.getBoundingClientRect()
				return (event.clientX || event.pageX || event.touches[0].clientX) + window.scrollX - this.working_window_ref.x
			},
			
			getMouseY () {
				this.working_window_ref = this.working_window.getBoundingClientRect()
				return (event.clientY || event.pageY || event.touches[0].clientY) + window.scrollY - this.working_window_ref.y
				
			},
			
      resizing(event){
        this.mouseX = this.getMouseX()
        this.mouseY = this.getMouseY()
        // Position image differently depending on the corner dragged and constraints
        if(this.eventState.evnt.target.className == 'resize-handle resize-handle-se'){
            this.width = this.mouseX - this.eventState.container_left
            this.height = this.mouseY - this.eventState.container_top
            this.left = this.eventState.container_left
            this.top = this.eventState.container_top
        } else if(this.eventState.evnt.target.className == 'resize-handle resize-handle-sw'){
            this.width = this.eventState.container_width - (this.mouseX - this.eventState.container_left)
            this.height = this.mouseY  - this.eventState.container_top
            this.left = this.mouseX
            this.top = this.eventState.container_top
        } else if(this.eventState.evnt.target.className == 'resize-handle resize-handle-nw'){
            this.width = this.eventState.container_width - (this.mouseX - this.eventState.container_left)
            this.height = this.eventState.container_height - (this.mouseY - this.eventState.container_top)
            this.left = this.mouseX
            this.top = this.mouseY
            
        } else if(this.eventState.evnt.target.className == 'resize-handle resize-handle-ne'){
            this.width = this.mouseX - this.eventState.container_left
            this.height = this.eventState.container_height - (this.mouseY - this.eventState.container_top)
            this.left = this.eventState.container_left
            this.top = this.mouseY
        }
        if(this.width > 50 && this.height > 50){
            this.resizeImage()
        }

      },
        
      crop(){
				//.getBoundingClientRect() method returns the size of an element and its position relative to the viewpors as an object 
				//with properties .x .y .width .height
				
        this.saveEventState(event)
        let crop_canvas = document.createElement('canvas'),
           	left = (this.working_window_ref.width/2 - 103) - (this.container.getBoundingClientRect().x - this.working_window_ref.x) + window.scrollX, // 106 = 206 pixel cropping box divided by 2 *** 
            top =  (this.working_window_ref.height/2 - 103) - (this.container.getBoundingClientRect().y - this.working_window_ref.y) + window.scrollY, // 106 = 206 pixel cropping box divided by 2 ***
            width = 206, // equals the width of the cropping bow set via CSS terrible strategy when scaling to larger devices ***
            height = 206 // equals the height of the cropping bow set via CSS terrible strategy when scaling to larger devices *** FIX THIS GARBAGE
       
				
				crop_canvas.width = width,
        crop_canvas.height = height

        let croppedImage = new Image()
        croppedImage.src = this.newImageUrl
				console.log("x: " + this.container.getBoundingClientRect().x)
				console.log("y: " + this.container.getBoundingClientRect().y)
        crop_canvas.getContext('2d').drawImage(croppedImage, left, top, width, height, 0, 0, width, height)//<====Somthing Wrong
        this.newImageUrl = crop_canvas.toDataURL("image/jpg")
        this.$store.dispatch('cropImage', this.newImageUrl)
      },  
    
      resizeImage(){
        let resize_canvas = document.createElement('canvas')
        resize_canvas.width = this.width
        resize_canvas.height = this.height
        resize_canvas.getContext('2d').drawImage(this.orig_src, 0, 0, this.width, this.height)  
        this.newImageUrl = resize_canvas.toDataURL('image/jpg')
      },
        
      moving(event){
        let touches
        event.stopPropagation()
        touches = event.touches
        
        this.mouseX = this.getMouseX()
        this.mouseY = this.getMouseY()
        if(this.eventState.evnt.target.className !== 'resize-handle'){
            this.left = this.mouseX - ( this.eventState.mouse_x - this.eventState.container_left )
            this.top = this.mouseY - ( this.eventState.mouse_y - this.eventState.container_top ) 
        }

        // Watch for pinch zoom gesture while moving
        if(this.eventState.touches && this.eventState.touches.length > 1 && touches.length > 1){
            this.width = this.eventState.container_width
            this.height = this.eventState.container_height
            let a = this.eventState.touches[0].clientX - this.eventState.touches[1].clientX
            a = a * a 
            let b = this.eventState.touches[0].clientY - this.eventState.touches[1].clientY
            b = b * b 
            let dist1 = Math.sqrt( a + b )

            a = event.touches[0].clientX - touches[1].clientX
            a = a * a
            b = event.touches[0].clientY - touches[1].clientY
            b = b * b
            let dist2 = Math.sqrt( a + b )

            let ratio = dist2 /dist1

            this.width = this.width * ratio
            this.height = this.height * ratio
            // To improve performance you might limit how often resizeImage() is called
            resizeImage(width, height)
        }
      }
         
    },
      
    mounted() {
        this.image_target = document.getElementById("image-target")
				// get offset of the .cropper-containe rrelative to the viewport (does not include window scroll) 
				this.working_window = document.getElementsByClassName("cropper-container")[0]
				this.working_window_ref = this.working_window.getBoundingClientRect()
        this.container = this.image_target.parentElement
        this.orig_src.src = this.image_target.src
        let resizeHandles = document.getElementsByClassName('resize-handle')
        for (let handle = 0; handle < resizeHandles.length; handle++){
            resizeHandles[handle].addEventListener('touchstart', ()=>{
                this.startResize(event)
            })
        }
        this.image_target.addEventListener('touchstart', ()=>{
            this.startMoving(event)
        })
    },
  }
  
</script> 

<style scoped> 
    
    .cropper-container {
        position: absolute;
        z-index: 999;
        border: solid grey 3px;
        background-color: white;
        border-radius:0px;
        opacity: 1;
        width: 100%; 
        height: 100%;
        top: 0px; 
        left: 0px;
        overflow: hidden;
    }
    
    .cropper-container:before{
        pointer-events: none;
        content: '';
        position: absolute;
        display: block;
        top: 0;
        background-color: lightblue;
        height: calc(50% - 100px);
        width:100%;
        opacity:.6;
        z-index: 999;
    }

    .cropper-container:after{
        pointer-events: none;
        content: '';
        position: absolute;
        display: block;
        bottom: 0;
        background-color: lightblue;
        height: calc(50% - 106px);
        width:100%;
        opacity:.6;
    }
    
    .container-inner-left{
        pointer-events: none;
        content: '';
        top:50%;
        left:0;
        margin-top: -100px;
        position: absolute;
        display: block;
        z-index: 999;
        width: calc(50% - 100px);
        height: 206px;
        background-color: lightblue;
        opacity:.6;
    }

    .container-inner-right{
        pointer-events: none;
        content: '';
        top:50%;
        right:0;
        margin-top: -100px;
        position: absolute;
        display: block;
        z-index: 999;
        width: calc(50% - 106px);
        height: 206px;
        background-color: lightblue;
        opacity:.6;
    }

    .resize-container {
        position: relative;
        display: inline-block;
        cursor: move;
        margin: 0 auto;
    }

    .resize-container img {
        display: block;
    }

    .resize-container:hover img,
    .resize-container:active img {
        outline: 2px dashed rgba(222,60,80,.9);
    }

    .resize-handle-ne,
    .resize-handle-ne,
    .resize-handle-se,
    .resize-handle-nw,
    .resize-handle-sw {
        position: absolute;
        display: block;
        width: 10px;
        height: 10px;
        background: rgba(222,60,80,.9);
        z-index: 999;
    }

    .resize-handle-nw {
        top: -5px;
        left: -5px;
        cursor: nw-resize;
    }

    .resize-handle-sw {
        bottom: -5px;
        left: -5px;
        cursor: sw-resize;
    }

    .resize-handle-ne {
        top: -5px;
        right: -5px;
        cursor: ne-resize;
    }

    .resize-handle-se {
        bottom: -5px;
        right: -5px;
        cursor: se-resize;
    }
.overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -100px;
    z-index: 999;
    width: 200px;
    height: 200px;
    border: dashed 3px grey;
    box-sizing: content-box;
    pointer-events: none;
}

.btn-crop {
    position: absolute;
    vertical-align: bottom;
    right: 5px;
    bottom: 5px;
    padding: 6px 10px;
    z-index: 999;
    background-color: rgb(222,60,80);
    border: none;
    border-radius: 5px;
    color: #FFF;
}
</style>