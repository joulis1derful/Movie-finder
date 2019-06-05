<script>
export default {
  name: 'Message',
  props: {
    type: String,
    message: String,
  },
}
</script>

<template>
  <div :class="['el-msg', type === 'error' ? 'error-msg' : type === 'success' ? 'success-msg' : '']">
    <p :class="['msg__text', type === 'error' ? 'error' : type === 'success' ? 'success' : '']">
      {{ message }}
    </p>
  </div>
</template>

<style scoped>
.el-msg {
  min-width: 380px;
  box-sizing: border-box;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: #ebeef5;
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  overflow: hidden;
  padding: 5px 5px 5px 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.error-msg {
  background-color: #f8e8ea;
  border-color: #f2d1d4;
}

.success-msg {
  background-color: #ecf3e9;
  border-color: #d9e7d4;
}

.msg__text.error {
  color: #bc192a;
  font-size: 14px;
  font-weight: 500;
}

.msg__text.success {
  color: #428527;
  font-size: 14px;
  font-weight: 500;
}
</style>