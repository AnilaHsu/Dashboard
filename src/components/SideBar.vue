<template>
  <div id="sidebar">

    <el-menu
      :router="true"
      :uniqueOpened="true"
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#F7F0DF"
      text-color="#6f6c68"
      active-text-color="#080808"
      collapse="Ture"
    >

    <i class="el-icon-copy-document" ></i>
      <el-menu-item index="1" route="/">
        <i class="el-icon-menu"></i>
        <template #title>首頁</template>
      </el-menu-item>

      <el-menu-item index="2" route="/report">
        <i class="el-icon-document"></i>
        <template #title>報表</template>
      </el-menu-item>

      <el-menu-item index="3" route="/contribution">
        <i class="el-icon-setting"></i>
        <template #title>貢獻</template>
      </el-menu-item>
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
  width: 80px;
  border-right: 0px;
}
.el-icon-copy-document{
  font-size: 22px;
    background: white;
    width: px;
    padding: 16px;
    border-radius: 50%;
    color: #121212;
}


</style>