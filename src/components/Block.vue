<template>
    <vgl-group>
        <vgl-texture v-if="texture" :src="'texture/'+texture+'.jpg'" :name="texture"></vgl-texture>
        <vgl-box-geometry :name="'blockgeo_'+name" :width="width" :height="height" :depth="depth"></vgl-box-geometry>
        <vgl-mesh-standard-material ref="mat" :color="color" :map="texture || null" :name="'texture_'+texture"></vgl-mesh-standard-material>
        <vgl-mesh ref="mesh" :material="'texture_'+texture" :geometry="'blockgeo_'+name" :name="name" :position="x+' '+y+' '+z"></vgl-mesh>
    </vgl-group>
</template>

<script>
export default {
  name: 'Block',
  data () {
    return {
    }
  },
  mounted () {
      this.$refs.mat.inst.transparent = true;
      
  },
  watch: {
    active () {
      if (this.active) {
        this.$refs.mat.inst.emissive.setHex( 0xff0000 );
      } else {
        this.$refs.mat.inst.emissive.setHex(this.$refs.mat.inst.currentHex);
      }
    }
  },
  props: {
      name: String,
      type: String,
      x: Number,
      y: Number,
      z: Number,
      width: Number,
      height: Number,
      depth: Number,
      color: String,
      texture: String,
      active: Boolean
  }
}
</script>