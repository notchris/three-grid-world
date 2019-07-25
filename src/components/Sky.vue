<template>
<vgl-group>
      <vgl-texture src="img/skydome.jpg" name="sky" wrap-s="repeat" wrap-t="repeat"></vgl-texture>
      <vgl-sphere-geometry name="sphere" :radius="2000 * 0.95" :width-segments="32" :height-segments="16" :theta-length="Math.PI / 2.0" :rotation="Math.PI / 2.0+' '+0+' '+Math.PI"></vgl-sphere-geometry>
      <vgl-mesh-basic-material map="sky" :fog="false" name="skymat" color="#FFFFFF" side="back"></vgl-mesh-basic-material>
      <vgl-mesh geometry="sphere" material="skymat"></vgl-mesh>
</vgl-group>
</template>

<script>
export default {
  name: 'Sky',
  data () {
    return {

    }
  }
}
</script>