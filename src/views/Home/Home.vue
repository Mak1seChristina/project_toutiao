<template>
  <div>
    <van-nav-bar fixed placeholder>
      <!-- 左侧插槽 -->
      <template #left>
        <img src="@/assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧插槽 -->
      <template #right>
        <van-icon name="search" size="18" color="white" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>
    <van-tabs v-model="active" sticky swipeable offset-top="1.22666667rem" :before-change="beforeTabsChange" @change="onTabsChange">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <ArtList :channelId="item.id"></ArtList>
      </van-tab>
    </van-tabs>
    <!-- 频道管理图标 -->
    <van-icon name="plus" size="0.42666667rem" class="plus" @click="show = true" />

    <!-- 弹出层，用于管理频道 -->
    <van-popup v-model="show" :close-on-click-overlay="false" @closed="resetIsDel(false)">
      <ChannelManage :userChannel="userChannel" :moreChannels="moreChannels" @add-channel="addChannel" @remove-channel="removeChannel" @close-popup="closePopup" @click-channel="clickChannel"></ChannelManage>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelAPI, getAllChannelAPI, updateUserChannelAPI } from '@/api/homeAPI.js'

import ArtList from '@/components/ArtList/ArtLIst.vue'
import ChannelManage from '@/components/ChannelManage/ChannelManage.vue'

import { mapMutations, mapState } from 'vuex'

// 频道名称 和 滚动条位置 对应关系
const nameToTop = {}

export default {
  name: 'Home',
  components: {
    ArtList,
    ChannelManage
  },
  data() {
    return {
      // 标签页激活项的索引
      active: 0,
      // 用户选择的频道列表数据
      userChannel: [],
      // 弹出层是否显示
      show: false,
      // 所有的频道列表数据
      allChannel: []
    }
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.userChannel = res.data.channels
      }
    },
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI()
      if (res.message === 'OK') {
        this.allChannel = res.data.channels
      }
    },
    async updateChannel() {
      const channels = this.userChannel
        .filter(item => item.name !== '推荐')
        .map((item, index) => {
          return {
            id: item.id,
            seq: index + 1
          }
        })
      const { data: res } = await updateUserChannelAPI(channels)
      if (res.message === 'OK') {
        // 提示用户频道列表更新成功
        this.$notify({ type: 'success', message: '更新成功', duration: 1000 })
      }
    },
    addChannel(item) {
      // 将用户新增的频道添加到用户频道
      this.userChannel.push(item)
      // 将最新的频道列表数据提交到后端
      this.updateChannel()
    },
    // 自定义事件，从用户频道列表中删除指定频道
    removeChannel(channel) {
      this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
      // 将更新后的频道列表提交给服务器保存
      this.updateChannel()
    },
    closePopup() {
      this.show = false
    },
    clickChannel(index) {
      // 修改 Tabs 激活项的索引值
      this.active = index
      // 关闭弹出层
      this.show = false
    },
    // tabs 发生切换之前触发此方法
    beforeTabsChange() {
      // 把当前的 频道名称 对应的 滚动条位置 记录到 nameToTop 对象中
      const name = this.userChannel[this.active].name
      nameToTop[name] = window.pageYOffset

      // return true 表示允许进行标签页的切换
      return true
    },
    // tabs 切换完毕后，触发此方法
    onTabsChange() {
      // dom 更新完毕后再进行滚动
      this.$nextTick(() => {
        const name = this.userChannel[this.active].name
        window.scrollTo(0, nameToTop[name] || 0)
      })
    },
    ...mapMutations('channelAbout', ['resetIsDel'])
  },
  created() {
    this.initUserChannel()
    this.initAllChannel()
  },
  computed: {
    moreChannels() {
      // 从全部频道列表数组中过滤掉用户已经选择的频道列表
      return this.allChannel.filter(item => {
        const index = this.userChannel.findIndex(ele => ele.id === item.id)
        if (index === -1) return true
      })
    },
    // 弹出层是否显示
    ...mapState('channelAbout', ['popupShow'])
  },
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.pageYOffset
    next()
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

.van-popup {
  width: 100%;
  height: 100%;
}
</style>
