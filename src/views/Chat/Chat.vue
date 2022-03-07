<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item, index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="item.name === 'xs'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{ item.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ item.msg }}</div>
          <van-image fit="cover" round :src="userAvatar" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <template #button>
          <span @click="send()" style="font-size: 12px; color: #999">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { io } from 'socket.io-client'

let socket = null

export default {
  name: 'Chat',
  data() {
    return {
      // 用户输入的聊天内容
      word: '',
      // 所有聊天消息
      list: []
    }
  },
  computed: {
    ...mapGetters('userAbout', ['userAvatar'])
  },
  methods: {
    // 提交按钮的点击事件处理函数
    send() {
      // 如果输入的聊天内容为空，则 return 出去
      if (!this.word) return

      // 向服务器发送消息
      socket.emit('send', this.word)
      // 将用户发送的消息存到 list 中
      this.list.push({ name: 'me', msg: this.word })
      // 清空输入框
      this.word = ''
    },
    // 发送消息，自动滚动到底部
    scrollToBottom() {
      // 获取所有聊天 item
      const chatItem = document.querySelectorAll('.chat-item')
      // 获取聊天 item 最后一项
      const lastChatItem = chatItem[chatItem.length - 1]

      // 滚动对应元素的父元素，使此元素能被用户可见
      lastChatItem.scrollIntoView({
        // 定义动画过渡效果
        behavior: 'smooth',
        // 定义垂直方向的对齐（end 表示元素的底端将和其所在滚动区的可视区域的底端对齐）
        block: 'end'
      })
    }
  },
  watch: {
    list() {
      // 侦听器，检测 list 值变化
      // 值变化后，待 dom 元素渲染完毕，滚动到最底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  created() {
    // 在 created 生命周期中创建客户端 websocket 实例
    socket = io('ws://www.liulongbin.top:9999')

    // 接收服务器的消息
    socket.on('message', msg => {
      this.list.push({ name: 'xs', msg })
    })
  },
  beforeDestroy() {
    // 组件销毁之前清空 socket 对象
    // 关闭连接
    socket.close()
    // 销毁实例对象
    socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
