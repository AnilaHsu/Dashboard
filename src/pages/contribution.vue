<template>
  <el-row>
    <el-col :span="24"><p class="header">Contribution</p></el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <div class="title">
        <p class="item">FrontEnd&ensp;:</p>
        <p></p>
        <p class="item">BackEnd&ensp;:</p>
        <p></p>
        <p class="item">Database&ensp;:</p>
        <p></p>
        <p class="item">Restful API&ensp;:</p>
        <p></p>
        <p class="item">AI Prediction&ensp;:</p>
        <p></p>
        <p class="item_data">Presentation&ensp;:</p>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="content">
        <p class="name">&ensp;許雅淑</p>
        <p></p>
        <p class="name">&ensp;徐偉翔、黃彥愷</p>
        <p></p>
        <p class="name">&ensp;顧宜峻、王綺</p>
        <p></p>
        <p class="name">&ensp;汪宣辰</p>
        <p></p>
        <p class="name">&ensp;岳俊廷、汪宣辰、黃彥愷</p>
        <p class="name">&ensp;王伯滔、徐偉翔、戴勤</p>
        <p></p>
        <p class="name">&ensp;岳俊廷、嚴子淇</p>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
</script>

<style scoped>
.header {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}
.title {
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: right;
}
.item {
  font-size: 20px;
  margin: 18px 2px;
}
.content {
  margin-top: 18px;
  margin-bottom: 30px;
  text-align: left;
}
.name {
  font-size: 18px;
  margin: 8px 2px;
}
.item_data {
  font-size: 20px;
  margin: 51px 2px;
}
</style>