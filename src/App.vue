<template>
  <n-config-provider :theme="darkTheme">
    <n-layout has-sider>
      <n-layout-sider :width="360">
        <Controll />
      </n-layout-sider>
      <n-layout>
          <Draw msg="Welcome to Your Vue.js App"/>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script>
import { NConfigProvider, NLayout, NLayoutSider, darkTheme } from 'naive-ui'
import Controll from './components/Controll.vue'
import Draw from './components/Draw.vue'

export default {
  name: 'App',
  components: {
    NConfigProvider,
    NLayout,
    NLayoutSider,
    Controll,
    Draw,
  },
  setup() {
    return {
      darkTheme
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
