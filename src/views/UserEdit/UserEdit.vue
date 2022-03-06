<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userProfile.photo" @click="$refs.fileRef.click()" />
          <!-- 文件选择框 -->
          <input type="file" accept="image/*" @change="onFileChange" v-show="false" ref="fileRef" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click="onNameCellClick" />
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="onBirthCellClick" />
    </van-cell-group>

    <!-- 修改姓名 -->
    <van-dialog v-model="showNameDialog" title="修改名称" show-cancel-button :before-close="beforeClose">
      <van-field v-model="name" placeholder="请输入用户名" input-align="center" maxlength="7" ref="nameRef" />
    </van-dialog>

    <!-- 修改生日的动作面板 -->
    <van-action-sheet v-model="showBirthday">
      <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate" @cancel="showBirthday = false" @confirm="updateBirthday" />
    </van-action-sheet>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { updateUserProfileAPI, updateUserAvatarAPI } from '@/api/userAPI.js'

import dayjs from 'dayjs'

export default {
  name: 'UserEdit',
  data() {
    return {
      // 是否显示修改用户名的对话框
      showNameDialog: false,
      name: '',
      // 是否显示修改生日的对话框
      showBirthday: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2050, 1, 31),
      currentDate: new Date()
    }
  },
  methods: {
    ...mapActions('userAbout', ['initUserProfile']),
    // 点击修改用户名
    onNameCellClick() {
      // 用户名赋值给 name，用以在对话框中显示用户名
      this.name = this.userProfile.name
      this.showNameDialog = true

      // 点开对话框后，输入框自动获得焦点
      this.$nextTick(() => {
        this.$refs.nameRef.focus()
      })
    },
    // 对话框关闭前的处理函数
    beforeClose(action, done) {
      // action有两个值：conform和cancel，用于判断点击了哪个按钮
      // 点击了 取消 按钮
      if (action === 'cancel') return done()

      // 判断用户输入的名称是否合法
      if (this.name === '' || this.name.length > 7) {
        // 提示 名称的长度为1-7个字符
        this.$notify({ type: 'warning', message: '名称的长度为1-7个字符', duration: 2000 })
        // 让文本框继续获得焦点
        this.$refs.nameRef.focus()
        // 阻止对话框关闭
        return done(false)
      }

      this.updateName(done)
    },
    // 更新用户简介
    async updateName(done) {
      try {
        const { data: res } = await updateUserProfileAPI({ name: this.name })
        if (res.message === 'OK') {
          // 关闭对话框
          done()
          // 更新 state 中的数据
          this.initUserProfile()
          // 提示用户更新成功
          this.$notify({ type: 'success', message: '名称修改成功', duration: 2000 })
        }
      } catch (e) {
        if (e.response.status === 409) {
          // 状态码409 表示用户名被占用
          this.$notify({ type: 'warning', message: '用户名被占用，请更换后重试', duration: 2000 })
          // 不关闭对话框
          done(false)
          // 文本框继续获得焦点
          this.$refs.nameRef.focus()
        } else {
          // 关闭对话框
          done()
          // 提示用户名更新失败
          this.$notify({ type: 'danger', message: '用户名更新失败', duration: 2000 })
        }
      }
    },
    // 点击显示修改生日对话框
    onBirthCellClick() {
      // 如果用户的生日存在，则初始值为用户生日，否则为当前日期
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()

      this.showBirthday = true
    },
    // 更新用户生日
    async updateBirthday(value) {
      // 关闭对话框
      this.showBirthday = false

      // 对日期进行格式化
      const dateStr = dayjs(value).format('YYYY-MM-DD')

      // 修改生日
      const { data: res } = await updateUserProfileAPI({ birthday: dateStr })
      if (res.message === 'OK') {
        this.initUserProfile()
        this.$notify({ type: 'success', message: '生日修改成功', duration: 2000 })
      }
    },
    // 文件发生变化
    async onFileChange(e) {
      // 获取文件列表
      const files = e.currentTarget.files
      // 如果没有选择文件，则不执行任何操作
      if (files.length === 0) return

      // 创建 FormData 对象
      const fd = new FormData()
      // 项 fd 中追加数据项
      fd.append('photo', files[0])

      const { data: res } = await updateUserAvatarAPI(fd)
      if (res.message === 'OK') {
        // 更新用户简介
        this.initUserProfile()
        // 提示更新成功
        this.$notify({ type: 'success', message: '更新头像成功', duration: 2000 })
      }
    }
  },
  computed: {
    ...mapState('userAbout', ['userProfile'])
  },
  created() {
    this.initUserProfile()
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
}

.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
