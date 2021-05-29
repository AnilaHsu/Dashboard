<template>
  <div id="sidebar">
    <el-menu
      :router="true"
      :uniqueOpened="true"
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1" route="/">
        <i class="el-icon-menu"></i>
        <template #title>首頁</template>
      </el-menu-item>

      <el-menu-item index="2" route="/report">
        <i class="el-icon-document"></i>
        <template #title>報表</template>
      </el-menu-item>

      <el-submenu index="3">
        <template #title>
          <i class="el-icon-setting"></i>
          <span>設定</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1">警告通知</el-menu-item>
          <el-menu-item index="3-2">自定閥值</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script setup>
function handleOpen(key, keyPath) {
  console.log(key, keyPath);
}

function handleClose(key, keyPath) {
  console.log(key, keyPath);
}
</script>

<style>
.el-menu.el-menu-vertical-demo {
  min-height: 100vh;
  position: fixed;
  width: 200px;
}
</style>