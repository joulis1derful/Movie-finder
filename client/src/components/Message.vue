<script>
export default {
  name: 'Message',
  mounted: function() {
    this.visible = true
    this.startTimer()
  },
  data: function() {
    return {
      visible: false,
      message: '',
      duration: 3000,
      type: 'info',
      timer: null,
    }
  },
  methods: {
    handleAfterLeave() {
      this.visible = false
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    startTimer() {
      if (this.duration > 0) {
        setTimeout(() => {
          this.handleAfterLeave()
        }, this.duration)
      }
    },
  },
}
</script>

<template>
  <div
    v-show="visible"
    :class="['el-msg', `${this.type}-msg`]"
  >
    <p :class="['msg__text', `${this.type}`]">
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

.info-msg {
  border-color: #ebeefa;
  background-color: #edf2fc;
}

.warning-msg {
  border-color: #fbe3cc;
  background-color: #fdf1e6;
}

.msg__text.error {
  color: #bc192a;
  font-size: 15px;
  font-weight: 500;
}

.msg__text.success {
  color: #428527;
  font-size: 15px;
  font-weight: 500;
}

.msg__text.info {
  color: #6b797f;
  font-size: 15px;
  font-weight: 500;
}

.msg__text.warning {
  color: #e97500;
  font-size: 15px;
  font-weight: 500;
}
</style>