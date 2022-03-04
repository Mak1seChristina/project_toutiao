<template>
  <div class="popup-container">
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="14" color="white" @click="closePopup" />
      </template>
    </van-nav-bar>

    <!-- 弹出层的主体区域 -->
    <div class="pop-body">
      <!-- 我的频道 -->
      <div class="my-channel-box">
        <div class="channel-title">
          <div>
            <span class="title-bold">已添加频道：</span>
            <span class="title-gray">{{ isDel ? '点击移除频道' : '点击进入频道' }}</span>
          </div>
          <span class="btn-edit" @click="resetIsDel(!isDel)">{{ isDel ? '完成' : '编辑' }}</span>
        </div>
        <!-- 我的频道列表 -->
        <van-row type="flex">
          <van-col span="6" v-for="(item, index) in userChannel" :key="item.id">
            <!-- 用户的频道 Item 项 -->
            <div class="channel-item van-hairline--surround" @click="onUserChannelClick(item, index)">
              {{ item.name }}
              <van-badge class="cross-badge" color="transparent" v-if="isDel && item.name !== '推荐' && userChannel.length > 2">
                <template #content>
                  <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="12" />
                </template>
              </van-badge>
            </div>
          </van-col>
        </van-row>
      </div>

      <!-- 分隔线 -->
      <div class="van-hairline--top sp-line"></div>

      <!-- 更多频道 -->
      <div class="more-channel-box">
        <div class="channel-title">
          <div>
            <span class="title-bold">可添加频道：</span>
            <span class="title-gray">点击添加频道</span>
          </div>
        </div>
        <!-- 更多频道列表 -->
        <van-row type="flex">
          <van-col span="6" v-for="item in moreChannels" :key="item.id">
            <div class="channel-item van-hairline--surround" @click="addChannel(item)">{{ item.name }}</div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ChannelManage',
  computed: {
    ...mapState('channelAbout', ['isDel'])
  },
  props: {
    userChannel: {
      type: Array,
      required: true
    },
    moreChannels: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 新增频道
    addChannel(item) {
      this.$emit('add-channel', item)
    },
    // 从用户频道列表中，删除指定频道
    onUserChannelClick(channel, index) {
      if (this.isDel) {
        // 处于删除状态
        // “推荐”频道不允许删除，并且当用户频道列表只有两个频道时不允许再删除
        if (channel.name === '推荐' || this.userChannel.length <= 2) return
        this.$emit('remove-channel', channel)
      } else {
        // 不处于删除状态
        // 自定义事件，将index值传给父组件，并且关闭弹出层
        this.$emit('click-channel', index)
      }
    },
    // 关闭弹出层
    closePopup() {
      this.$emit('close-popup')
    },
    ...mapMutations('channelAbout', ['resetIsDel'])
  }
}
</script>

<style lang="less" scoped>
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>
