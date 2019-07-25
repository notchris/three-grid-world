<template>
<vgl-object3d :position="'0 '+-0.5+' 0'" :rotation="-Math.PI/2 +' 0 0'">
      <vgl-texture src="img/terrain1.jpg" name="grass" repeat="128 128" wrap-s="repeat" wrap-t="repeat"></vgl-texture>
      <vgl-plane-geometry name="grassgeo" :width="2400" :height="2400"></vgl-plane-geometry>
      <vgl-mesh-basic-material map="grass" name="grassmat" :fog="true"></vgl-mesh-basic-material>
      <vgl-mesh name="terrain" geometry="grassgeo" material="grassmat"></vgl-mesh>
</vgl-object3d>
</template>

<script>
export default {
  name: 'Terrain',
  data () {
    return {

    }
  }
}
</script>