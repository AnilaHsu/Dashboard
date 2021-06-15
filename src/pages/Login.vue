<template>
  <div class="auth-form">
    <div>
      <div class="auth-header">
        <h1>Sign in to Dashboard</h1>
      </div>
      <el-card class="box-card">
        <el-form :model="ruleForm" :rules="rules" ref="form">
          <el-form-item label="Username or email address" prop="account">
            <el-input
              type="account"
              v-model="ruleForm.account"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              class="btn-submit"
              type="primary"
              @click="submitForm('ruleForm')"
            >
              送出
            </el-button>
            <el-button class="btn-reset" @click="resetForm('ruleForm')"
              >清除</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import axios from 'axios';

const store = useStore();

const ruleForm = reactive({
  account: "",
  password: "",
});
const form = ref(null);

const validateAccount = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("帳號不能為空"));
  } else {
    return callback();
  }
};

const validatePassword = (rule, value, callback) => {
  if (value === "") {
    return callback(new Error("請輸入密碼"));
  } else {
    return callback();
  }
};

const rules = {
  account: [{ validator: validateAccount, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
};

function submitForm() {
  form.value.validate((valid) => {
    if (valid) {
      axios
        .post("https://api.wasay.cc/login", {
          username: ruleForm.account,
          password: ruleForm.password,
        })
        .then((res) => {
          const token = res.data["access_token"];
          store.commit("login", token);
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
}
function resetForm() {
  form.value.resetFields();
}
</script>

<style lang="scss" scoped>
.auth-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.box-card {
  width: 380px;
  border-radius: 10px;
  margin: 0 0 80px 0;
}

h1 {
  color: rgba(59, 59, 59, 0.858);
  font-size: 22px;
  font-weight: 50;
  letter-spacing: 0.2px;
  text-align: center;
}
.btn-submit {
  color: #f6f8fb;
  border-radius: 8px;
  background-color: rgba(121, 122, 123, 0.858);
  border-color: #f6f8fb;

  &:focus,
  &:hover {
    color: #f6f8fb;
    border-color: rgb(111, 111, 111);
    background-color: rgb(111, 111, 111);
  }
}

.btn-reset {
  border-radius: 8px;

  &:focus,
  &:hover {
    color: rgb(111, 111, 111);
    background-color: #f6f8fb;
    border-color: rgb(191, 191, 191);
  }
}
</style>