<template>
  <Main v-if="store.state.token != null" />
  <Login v-else />
</template>

<script setup>
import Main from "./pages/Main.vue"
import Login from "./pages/Login.vue"
import { useStore } from "vuex";

const store = useStore();
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500;700&family=Ubuntu:wght@500;700&display=swap');
html,
body {
  margin: 0;
  height: 100%;
  background-color: #f0f2f5;
  font-family: 'Ubuntu', 'Noto Sans TC', Helvetica, Arial, "文泉驛正黑", "WenQuanYi Zen Hei", "儷黑 Pro",
    "LiHei Pro", "黑體-繁", "Heiti TC", "微軟正黑體", "Microsoft JhengHei",
    sans-serif;
}
.el-header{
  background-color: rgb(255, 255, 255);
}

</style>
