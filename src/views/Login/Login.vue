<template>
  <div>
    <van-nav-bar title="登录" fixed placeholder />
    <!-- 登录的表单 -->
    <van-form @submit="login">
      <van-field v-model="form.mobile" type="tel" label="手机号码" placeholder="请输入手机号码" required :rules="rules.mobile" />
      <van-field v-model="form.code" type="password" label="密码" placeholder="请输入登录密码" required :rules="rules.code" />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入 userAPI
import { loginAPI } from '@/api/userAPI.js'

// 导入映射
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据对象
      form: {
        // 用户手机号
        mobile: '',
        // 登录密码
        code: ''
      },
      // 表单的校验规则对象
      rules: {
        // 手机号校验规则
        mobile: [
          { required: true, message: '请填写您的手机号', trigger: 'onBlur' },
          { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请填写正确的手机号', trigger: 'onBlur' }
        ],
        // 登录密码的校验规则
        code: [{ required: true, message: '请填写您的密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    ...mapMutations('userAbout', ['updateTokenInfo']),

    async login() {
      const { data: res } = await loginAPI(this.form)
      console.log(res)

      if (res.message === 'OK') {
        // 把登录成功的结果存储到 state 中
        this.updateTokenInfo(res.data)
        // 登录成功后跳转到主页
        const navPath = this.$route.query.pre || '/'
        this.$router.replace(navPath)
      }
    }
  },
  mounted() {
    // console.log(this.updateTokenInfo)
    // console.log(this.$store)
  }
}
</script>

<style lang="less" scoped></style>
