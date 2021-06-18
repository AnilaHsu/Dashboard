<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="80px">
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
  z-index: 10;
  padding: 0 40px !important;
 
}

.el-row {
  margin: 0;
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
  background-color: #ffffff;
}
.el-card {
  border-radius: 8px !important;
}
.el-main {
  padding: 20px 55px !important;
}
</style>