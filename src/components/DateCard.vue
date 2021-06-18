<template>
  <div style="display: flex;">
    <el-card class="date" v-if="date">
      <p>{{ date.substring(0, 4) }}</p>
      <p>年</p>
    </el-card>
    <el-card class="date" v-if="date">
      <p>{{ date.substring(5, 7) }}</p>
      <p>月</p>
    </el-card>
    <el-card class="date" v-if="date">
      <p>{{ date.substring(8, 10) }}</p>
      <p>日</p>
    </el-card>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  date: String,
});
</script>

<style lang="scss" scoped>
.date {
  margin-right: 10px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  :deep .el-card__body {
    padding: 8px 20px;
    p {
      margin: auto !important;
      text-align: center;

      &:nth-child(2) {
        font-size: 12px;
        color: lightgray;
      }
    }
  }
}
.icon-data{
    margin-right: 10px;
    margin-top: 16px;
    font-size: 24px;
    }
</style>