<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import GameController from '@/classes/gameController'

export default {
  name: 'Game',
  components: {},
  data () {
    return {
      gameField: null
    }
  },
  mounted () {
    this.gameField = new GameController(this.$refs.canvas.getContext('2d'))
  }
}
</script>

<style scoped lang="scss">
  canvas {
    cursor: none;
  }

  body {
    overflow:hidden;
  }

  @font-face {
    font-family: "digitalix";
    src: url("./../assets/fonts/digitalix.ttf");
  }
</style>
