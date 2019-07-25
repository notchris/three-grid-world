<template>
  <div id="app">

<hsc-window-style-metal>
    <hsc-window
      v-for="(block,i) in activeBlock"
      :key="'object_'+i"
      :title="block.name || 'Object'"
      positionHint="-20 / 20"
    >
        <fieldset>
            <legend>Position</legend>
            <div>X: {{block.x}}</div>
            <div>Y: {{block.y}}</div>
            <div>Z: {{block.z}}</div>
        </fieldset>
        <fieldset>
            <legend>Size</legend>
            <div>Width: <vue-numeric-input @input="updateWidth($event,block)" :value="block.width" :min="1" :max="10" :step="1"></vue-numeric-input></div>
            <div>Height: <vue-numeric-input @input="updateHeight($event,block)" :value="block.height" :min="1" :max="10" :step="1"></vue-numeric-input></div>
            <div>Depth: <vue-numeric-input @input="updateDepth($event,block)" :value="block.depth" :min="1" :max="10" :step="1"></vue-numeric-input></div>
        </fieldset>
        <fieldset>
            <legend>Material</legend>
            <div>Color: {{block.color}} <input @input="updateColor(block,$event)" type="color" :value="block.color"/> </div>
            <div>Texture:
              <select @change="updateTexture(block,$event)">
                <option
                  v-for="(texture,j) in textures"
                  :key="'texture_'+j"
                  :value="texture"
                  :selected="texture === block.texture"
                >{{texture}}</option>
              </select>
            </div>
        </fieldset>


    </hsc-window>
</hsc-window-style-metal>

<div @dblclick="deselectAll" @click="selectBlock" @mousemove="raycast($event)" class="render">
  <vgl-renderer ref="renderer" class="renderer" scene="s" camera="c" antialias>
      <vgl-scene ref="scene" name="s" :fog="'#bfe4e9 '+1+' '+3000">
        <Sky/>
        <Terrain/>
        <Grid/>
        <Axes/>

        <Block
          v-for="(block,i) in blocks"
          type="block"
          :key="'block_'+i"
          :name="'block_'+i"
          :x="block.x"
          :y="block.y"
          :z="block.z"
          :width="block.width"
          :height="block.height"
          :depth="block.depth"
          :color="block.color"
          :texture="block.texture"
          :active="block.active"
          :ref="'block_'+i"
        />
        <MarkerTool
          ref="marker"
          :x="marker.x"
          :y="marker.y"
          :z="marker.z"
        />

        <vgl-ambient-light></vgl-ambient-light>
        <vgl-directional-light position="2 1 5"></vgl-directional-light>
      </vgl-scene>
      <vgl-perspective-camera ref="camera" orbit-position="10 1.4 1" name="c"></vgl-perspective-camera>
      <orbit-controls ref="orbit" camera="c"></orbit-controls>
    </vgl-renderer>
  </div>

  </div>
</template>

<script>
import UI from './components/UI';
import Axes from './components/Axes';
import Block from './components/Block';
import Grid from './components/Grid';
import Sky from './components/Sky';
import Terrain from './components/Terrain';
import MarkerTool from './components/Marker';
global.THREE = require('three');
const TransformControls = require('three-transform-ctrls');
let raycaster = new THREE.Raycaster();

export default {
  name: 'app',
  data () {
    return {
      blocks: [{
        x: 0,
        y: 0,
        z: 0,
        width: 1,
        height: 1,
        depth: 1,
        color: '#FFFFFF',
        texture: 'brick',
        active: false
      }],
      textures: ['brick','brick2','stone','wood','metal'],
      currentTarget: null,
      transformControls: null,
      marker: {
        x: 3,
        y: 0,
        z: 3
      }
    }
  },
  computed: {
    activeBlock () {
      let active = this.blocks.filter(function(block){
        return block.active === true;
      });
      return active;
    }
  },
  mounted () {

    this.$nextTick(() => {
      this.transformControls = new TransformControls(this.$refs.camera.inst, this.$refs.renderer.inst.domElement);
      this.$refs.scene.inst.add(this.transformControls);
      this.transformControls.setTranslationSnap(1);
      this.transformControls.setRotationSnap(Math.PI/4);
      this.transformControls.addEventListener('dragging-changed', (event) => {
        this.$refs.orbit.controls.enabled = ! event.value;
      });
      this.transformControls.addEventListener( 'change', (event) => {
        if (event.target.object) {
        if (event.target.object.position.y < 0) {
          event.target.object.position.y = 0;
        }
        let targetBlock = this.blocks[event.target.object.name.split('_')[1]];
        this.$refs.renderer.inst.render(this.$refs.scene.inst,this.$refs.camera.inst);

        targetBlock.x = event.target.object.position.x;
        targetBlock.y = event.target.object.position.y;
        targetBlock.z = event.target.object.position.z;
        }
      });
      //this.transformControls.setMode( "rotate" );
    })
  },
  methods: {
    selectBlock () {
      if (this.currentTarget) {
        this.transformControls.enabled = true;
        this.blocks.forEach((block) => {
          block.active = false;
        });
        this.currentTarget.active = true;

        this.transformControls.attach(this.currentObject)
      }
    },
    updateColor (block, event) {
      block.color = event.target.value;
    },
    updateTexture (block, event) {
      block.texture = event.target.value;
    },
    updateWidth (val, block) {
      block.oldVal = block.width;
      let diff = val - block.oldVal;
      block.width = val;
      block.x += diff/2
      this.blocks.forEach((block,i) => {
        if (block.active) {
          let geo = this.$refs['block_'+i][0].$children[0].$children[1].inst;
          geo.center()
          this.$refs.renderer.inst.render(this.$refs.scene.inst,this.$refs.camera.inst);
        }
      });
    },
    updateHeight (val, block) {
      block.height = val;
    },
    updateDepth (val, block) {
      block.depth = val;
    },
    deselectAll () {
      this.blocks.forEach((block) => {
        block.active = false;
      });

      this.transformControls.enabled = false;
      this.transformControls.detach()
      this.transformControls.visible = false;
    },
    raycast (event) {
      let vector = new THREE.Vector3();
      let dir = new THREE.Vector3();
      let camera = this.$refs.camera.inst;
      vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 ); // z = 0.5 important!
      vector.unproject( camera );
      raycaster.set( camera.position, vector.sub( camera.position ).normalize());
      let intersects = raycaster.intersectObjects( this.$refs.scene.inst.children, true );

      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name.includes('block')) {
          this.currentTarget = this.blocks[intersects[i].object.name.split('_')[1]];
          this.currentObject = intersects[i].object;
          return;
        } else if (intersects[i].object.name.includes('terrain')) {
          //console.log(this.$refs.marker.$children[0].$children[2].inst)
          this.marker.x = Math.round(intersects[i].point.x);
          this.marker.z = Math.round(intersects[i].point.z);
        } else {
          //console.log(intersects[i].object)
          this.currentTarget = null;
          this.currentObject = null;
        }
      }

    }
  },
  components: {
    Grid,
    Axes,
    Block,
    MarkerTool,
    Sky,
    Terrain,
    UI
  }
}
</script>