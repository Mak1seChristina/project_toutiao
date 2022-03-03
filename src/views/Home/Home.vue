<template>
  <div>
    <van-nav-bar fixed placeholder>
      <!-- 左侧插槽 -->
      <template #left>
        <img src="@/assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧插槽 -->
      <template #right>
        <van-icon name="search" size="18" color="white" />
      </template>
    </van-nav-bar>
    <van-tabs v-model="active" sticky swipeable offset-top="1.22666667rem">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <ArtList :channelId="item.id"></ArtList>
      </van-tab>
    </van-tabs>
    <!-- 频道管理图标 -->
    <van-icon name="plus" size="0.42666667rem" class="plus" />
  </div>
</template>

<script>
import { getUserChannelAPI } from '@/api/homeAPI.js'

import ArtList from '@/components/ArtList/ArtLIst.vue'

export default {
  name: 'Home',
  components: {
    ArtList
  },
  data() {
    return {
      // 标签页激活项的索引
      active: 0,
      // 频道列表
      userChannel: []
    }
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
      }
    }
  },
  created() {
    this.initUserChannel()
  }
}
</script>

<style lang="less" scoped>
.logo {
  height: 80%;
}
// 为 tabs 栏设置右padding
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background: #fff;
}
// 频道管理图标定位
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
</style>
