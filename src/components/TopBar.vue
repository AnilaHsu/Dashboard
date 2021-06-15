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
    <el-drawer v-model="isDrawerOpen" :with-header="false" @open="updateData">
      <div v-if="list.length > 0">
        <el-card
          class="notice-card"
          shadow="hover"
          v-for="(item, i) in list"
          :key="i"
        >
          <div class="notice-title">
            <i :class="test(item.type)" :type="item.type"></i>
            {{ item.title }}
          </div>
          <div class="notice-content">
            {{ item.probeNo }} : {{ item.content }}
          </div>
        </el-card>
      </div>
      <div v-else>
        <i class="el-icon-circle-check ok-icon"></i>
        <p class="ok-text">一切正常</p>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { onUpdated, reactive, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const isDrawerOpen = ref(false);
const tab = ref("");
const state = ref("");
const probeNo = ref("");
const stateInfo = ref("");

function logout() {
  store.commit("logout");
}

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

const list = reactive([]);

function updateData() {
  const electAlarms = store.getters.electronicDatas.filter((electAlarm) => {
    return (
      electAlarm.V.alarm_level !== 0 ||
      electAlarm.C.alarm_level !== 0 ||
      electAlarm.P.alarm_level !== 0
    );
  });
  const test = electAlarms.flatMap((electAlarm, index) => {
    return [
      {
        type: electAlarm.V.alarm_level,
        title: generateAlarmText(electAlarm.V.alarm_level),
        content: store.getters.stateDescription("V", electAlarm),
        probeNo: `probe${electAlarm.V.probe}`,
      },
      {
        type: electAlarm.C.alarm_level,
        title: generateAlarmText(electAlarm.C.alarm_level),
        content: store.getters.stateDescription("C", electAlarm),
        probeNo: `probe${electAlarm.C.probe}`,
      },
      {
        type: electAlarm.P.alarm_level,
        title: generateAlarmText(electAlarm.P.alarm_level),
        content: store.getters.stateDescription("P", electAlarm),
        probeNo: `probe${electAlarm.P.probe}`,
      },
    ];
  });
  list.push(...test);
}

// tab.value = store.getters.tabOption
// stateNO.value = store.getters.stateNo(tabOption.value);
// stateInfo.value = store.getters.stateInfo(tabOption.value);
// probeNo.value = store.getters.probeNo(tabOption.value)

function generateAlarmText(stateNo) {
  switch (stateNo) {
    case 1:
      return "注意";
      break;
    case 2:
      return "異常";
      break;
    case 3:
      return "緊急";
      break;
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 28px;
  font-weight: bolder;
  color: rgba(0, 0, 0, 0.87);
  text-align: left;
}
.user-b {
  background-color: rgba(68, 68, 68, 0.795);
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
  background-color: #f35555da;

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
.ok-icon {
  font-size: 48px;
  color: green;
  margin-top: 64px;
}
.ok-text {
  line-height: normal;
  margin: 0;
  font-size: 24px;
}
</style>