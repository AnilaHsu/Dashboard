<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <SideBar />
      </el-aside>
      <el-container>
        <el-header class="header">
          <TopBar />
        </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import SideBar from "../components/SideBar.vue";
import TopBar from "../components/TopBar.vue";
</script>

<style lang="scss">
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 70px;
  height: 70px !important;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .1);
  z-index: 10;
  padding: 0 30px 16px 20px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  box-shadow: 0 3px 6px;
}

.main {
  min-height: 100vh;
}
.el-card {
  border-radius: 8px !important;
}
</style>