<template>
  <div>
    <!-- 路由占位符 -->
    <router-view></router-view>

    <van-tabbar v-model="active" placeholder>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less" scoped></style>
