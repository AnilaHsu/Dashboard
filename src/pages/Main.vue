<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <SideBar />
      </el-aside>
      <el-container>
        <el-header>
          <TopBar />
        </el-header>
        <el-main>
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

<style lang="scss" scoped>
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  z-index: 10;
  padding: 0 30px 0 20px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
</style>