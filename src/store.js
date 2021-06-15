import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      token: null,
      electronicDatas: []
    }
  },
  mutations: {
    login(state, token) {
      state.token = token
    },
    logout(state) {
      state.token = null
    },
    setElecData(state, datas) {
      state.electronicDatas = datas
    }
  },
  getters: {

    electronicDatas: (state) => {
      const electronicDatas = state.electronicDatas
      return electronicDatas
    },
    stateDescription: (state) => (tabOption, elect) => {
      const now = elect[tabOption].value
      const upper2 = elect[tabOption].ai_power_upperbound2
      const lower2 = elect[tabOption].ai_power_lowerbound2
      const upper1 = elect[tabOption].ai_power_upperbound1
      const lower1 = elect[tabOption].ai_power_lowerbound1
      if (tabOption === "V") {
        if (now > upper2) {
          return "電壓狀態嚴重高於限制，可能造成設備損壞";
        } else if (now < lower2) {
          return "電壓狀態嚴重低於限制，可能造成設備損壞";
        } else if (now > upper1) {
          return "電壓狀態高於限制!";
        } else if (now < lower1) {
          return "電壓狀態低於限制!";
        } else {
          return "電壓狀態正常";
        }
      } else if (tabOption === "C") {
        if (now > upper2) {
          return "電流狀態嚴重高於限制";
        } else if (now > upper1) {
          return "電流在未來30分鐘將有高機率超出範圍!";
        } else {
          return "電流在在正常範圍";
        }
      } else if (tabOption === "P") {
        if (now > upper2) {
          console.log(electronicDatas[index])
          return "功率消耗異常，目前功率消耗高於預期";
        } else if (now < lower2) {
          return "功率消耗異常，目前功率消耗低於預期";
        } else if (now > upper1) {
          return "目前功率消耗高於預期";
        } else if (now < lower1) {
          return "目前功率消耗低於預期";
        } else {
          return "功率消耗正常";
        }
      }
    },
    now: (state) => (tabOption, index) => {
      const electronicDatas = state.electronicDatas
      return electronicDatas[index][tabOption].value
    },
    upper1: (state) => (tabOption, index) => {
      const electronicDatas = state.electronicDatas
      return electronicDatas[index][tabOption].ai_power_upperbound1
    },
    upper2: (state) => (tabOption, index) => {
      const electronicDatas = state.electronicDatas
      return electronicDatas[index][tabOption].ai_power_upperbound2
    },
    lower1: (state) => (tabOption, index) => {
      const electronicDatas = state.electronicDatas
      return electronicDatas[index][tabOption].ai_power_lowerbound1
    },
    lower2: (state) => (tabOption, index) => {
      const electronicDatas = state.electronicDatas
      return electronicDatas[index][tabOption].ai_power_lowerbound2
    },

    lastStateInfo: (state, getters) => (tabOption) => {
      const electronicDatas = state.electronicDatas
      const lastIndex = electronicDatas.length - 1
      const now = getters.now(tabOption, lastIndex)
      const upper2 = getters.upper2(tabOption, lastIndex)
      const lower2 = getters.lower2(tabOption, lastIndex)
      const upper1 = getters.upper1(tabOption, lastIndex)
      const lower1 = getters.lower1(tabOption, lastIndex)
      if (tabOption === "V") {
        if (now > upper2) {
          return "電壓狀態嚴重高於限制，可能造成設備損壞";
        } else if (now < lower2) {
          return "電壓狀態嚴重低於限制，可能造成設備損壞";
        } else if (now > upper1) {
          return "電壓狀態高於限制!";
        } else if (now < lower1) {
          return "電壓狀態低於限制!";
        } else {
          return "電壓狀態正常";
        }
      } else if (tabOption === "C") {
        if (now > upper2) {
          return "電流狀態嚴重高於限制";
        } else if (now > upper1) {
          return "電流在未來30分鐘將有高機率超出範圍!";
        } else {
          return "電流在在正常範圍";
        }
      } else if (tabOption === "P") {
        if (now > upper2) {
          return "功率消耗異常，目前功率消耗高於預期";
        } else if (now < lower2) {
          return "功率消耗異常，目前功率消耗低於預期";
        } else if (now > upper1) {
          return "目前功率消耗高於預期";
        } else if (now < lower1) {
          return "目前功率消耗低於預期";
        } else {
          return "功率消耗正常";
        }
      }
    }
  }
})

