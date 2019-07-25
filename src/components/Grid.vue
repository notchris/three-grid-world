<template>
  <vgl-grid-helper
    name="grid"
    ref="grid"
    :size="size"
    :position="'-0.5 '+-0.45+' -0.5'"
    :divisions="divisions"
    :color-center-line="`#${[cr, cg, cb].map(v => parseInt(v).toString(16)).map(v => v.length < 2 ? '0' + v : v).join('')}`"
    :color-grid="`#${[gr, gg, gb].map(v => parseInt(v).toString(16)).map(v => v.length < 2 ? '0' + v : v).join('')}`"
  >
  </vgl-grid-helper>
</template>

<script>
export default {
  name: 'Grid',
  data () {
    return {
      size: 200,
      divisions: 200,
      cr: 255,
      cg: 255,
      cb: 0,
      gr: 255,
      gg: 255,
      gb: 255,
    }
  },
  mounted () {
    this.$refs.grid.inst.material.lights = false;
    this.$refs.grid.inst.material.fog = false;
    this.$refs.grid.inst.material.transparent = true;
    this.$refs.grid.inst.material.opacity = 0.5;
    this.$refs.grid.inst.material.needsUpdate = true;
  }
}
</script>