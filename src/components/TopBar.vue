<template>
  <el-row>
    <el-col :span="4" class="title">Dashboard</el-col>
    <el-col :span="8"></el-col>
    <el-col :span="8"></el-col>
    <el-col class="btns" :span="4"
      ><el-button @click="drawer()" class="mes-b" icon="el-icon-message" circle>
      </el-button>
      <el-dropdown trigger="click">
        <el-button class="user-b" circle>
          <i class="el-icon-user"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>資訊</el-dropdown-item>
            <el-dropdown-item @click="logout()">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>

  <div>
    <el-drawer v-model="isDrawerOpen" :with-header="false">
      <el-card
        class="notice-card"
        shadow="hover"
        v-for="(item, i) in list"
        :key="i"
      >
        <div class="notice-title">
          <i :class="test(item.type)" :type="color(item.type)"></i>
          {{ item.tab }}:{{ item.state }}
        </div>
        <div class="notice-content">
          {{ item.probeNo }}:{{ item.stateInfo }}
        </div>
      </el-card>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const isDrawerOpen = ref(false);
const tab = ref("");
const state = ref("");
const probeNo = ref("");
const stateInfo = ref("");
function logout() {
  store.commit("logout");
};
function drawer() {
  isDrawerOpen.value = true;
}

function test(type) {
  if (type == 1) {
    return "el-icon-question";
  } else if (type == 2) {
    return "el-icon-info";
  } else if (type == 3) {
    return "el-icon-warning";
  }
}

const list = [
  { type: "1", title: "注意", content: "內容" },
  { type: "2", title: "異常", content: "內容" },
  { type: "3", title: "緊急", content: "內容" },
];

// tab.value = store.getters.tabOption
// stateNO.value = store.getters.stateNo(tabOption.value);
// stateInfo.value = store.getters.stateInfo(tabOption.value);
// probeNo.value = store.getters.probeNo(tabOption.value)

// switch (stateNo) {
//   case 0:
//       state.value = "安全";
//       break;
//     case 1:
//       state.value = "注意";
//       break;
//     case 2:
//       state.value = "異常";
//       break;
//     case 3:
//       state.value = "緊急";
//       break;
// }
</script>

<style lang="scss" scoped>
.title {
  font-size: 22px;
  font-weight: bolder;
  color: rgb(104, 104, 104);
  text-align: left;
}
.user-b {
  background-color: rgba(96, 100, 107, 0.858);
  margin: 0 0 0 8px;

  i {
    color: #f6f8fb;
  }

  &:focus,
  &:hover {
    color: #f6f8fb;
    border-color: rgb(165, 166, 168);
    background-color: rgb(165, 166, 168);
  }
}
.mes-b {
  background-color: #f56c6cec;

  :deep i {
    color: #f6f8fb;
  }

  &:focus,
  &:hover {
    color: #f6f8fb;
    border-color: #f78989;
    background-color: #f78989;
  }
}
.btns {
  text-align: right;
}
.el-card {
  display: inline-block;
  width: 80%;
}
.notice-card {
  line-height: 20px;
}
.notice-title {
  font-weight: bold;
  text-align: left;
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #464646;
}
.notice-content {
  font-weight: normal;
  font-size: 13.5px;
  color: #464646;
}
:deep .el-drawer {
  padding: 30px 0;
}
</style>