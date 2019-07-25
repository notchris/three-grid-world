<template>
    <vgl-group>
        <vgl-box-geometry name="markergeo" :width="1" :height="0.25" :depth="1"></vgl-box-geometry>
        <vgl-mesh-standard-material name="markermat" ref="markermat" color="#00FF00"></vgl-mesh-standard-material>
        <vgl-mesh material="markermat" geometry="markergeo" name="marker" :position="x+' '+-0.5+' '+z"></vgl-mesh>
    </vgl-group>
</template>

<script>
export default {
  name: 'MarkerTool',
  data () {
    return {

    }
  },
  mounted () {
      this.$refs.markermat.inst.transparent = true;
      this.$refs.markermat.inst.opacity = 0.5;
      this.$refs.markermat.inst.depthTest = false;
  },
  props: {
      x: Number,
      y: Number,
      z: Number,
  }
}
</script>