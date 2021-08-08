<template>
  <div id="draw">
    <div id="progress">计算中...</div>
    <canvas id="canvas" :width="width * 2" :height="height * 2" :style="{ width: `${width}px`, height: `${height}px`}" />
    <div id="result" :style="{ width: `${width}px`, height: `${height}px`}" v-if="result">
      <div>最佳效果: {{result.bestResult}}</div>
      <div>剥麻机位置: {{ JSON.stringify(result.bestResultMachine) }}</div>
      <div>仓库位置: {{ JSON.stringify(result.bestResultRepo) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Draw',
  data() {
    return {
      width: 600,
      height: 600
    }
  },
  computed: {
    geos() {
      return this.$store.state.geos
    },
    result() {
      return this.$store.state.result
    },
  },
  watch: {
    geos() {
      this.drawGeo()
    }
  },
  methods: {
    drawGeo() {
      const ctx = document.getElementById('canvas').getContext('2d')
      ctx.clearRect(0, 0, this.width * 2, this.height * 2)
      const row = this.geos.length
      const col = this.geos[0].length
      const baseSize = Math.min(this.width * 2 / col, this.height * 2 / row)
      ctx.font = `${baseSize / 3}px Avenir, Helvetica, Arial, sans-serif`;
      ctx.fillStyle = "#aaa";
      for (let i = 0; i <= row; i ++) {
        ctx.beginPath();
        ctx.moveTo(0, i * baseSize);
        ctx.lineTo(col * baseSize, i * baseSize);
        ctx.stroke();
      }
      for (let i = 0; i <= col; i ++) {
        ctx.beginPath();
        ctx.moveTo(i * baseSize, 0);
        ctx.lineTo(i * baseSize, row * baseSize)
        ctx.stroke();
      }
      for (let i = 0; i < row; i ++) {
        for (let j = 0; j < col; j ++) {
          const text = ctx.measureText(this.geos[i][j])
          const { width, fontBoundingBoxAscent, fontBoundingBoxDescent } = text
          const height = fontBoundingBoxDescent - fontBoundingBoxAscent
          ctx.fillText(this.geos[i][j], j * baseSize + (baseSize - width) / 2, i * baseSize + (baseSize - height) / 2)
        }
      }
    }
  }
}
</script>

<style scoped>
  #draw {
    margin: auto;
  }
  #progress {
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size: large;
    text-align: center;
    visibility: hidden;
  }
  #canvas {
    display: block;
    margin: auto;
    background: #eee;
  }
  #result {
    display: block;
    margin: auto;
  }
</style>
