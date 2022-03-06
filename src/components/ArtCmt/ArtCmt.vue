<template>
  <div :class="isShowBox1 ? 'art-cmt-container-1' : 'art-cmt-container-2'">
    <!-- 评论列表 -->
    <van-list class="cmt-list" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
      <!-- 评论的 Item 项 -->
      <div class="cmt-item" v-for="item in cmtList" :key="item.com_id">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="item.aut_photo" alt="" class="avatar" />
            <span class="uname">{{ item.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon name="like" size="16" color="red" v-if="item.is_liking" @click="delLike(item)" />
            <van-icon name="like-o" size="16" color="gray" v-else @click="addLike(item)" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">{{ item.content }}</div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ item.pubdate | dateFormat }}</div>
      </div>
    </van-list>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowBox1">
      <van-icon name="arrow-left" size="18" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="showBox2">发表评论</div>
      <div class="icon-box">
        <van-badge :content="cmtCount" :max="99">
          <van-icon name="comment-o" size="20" @click="scrollToCmtList" />
        </van-badge>
        <van-icon name="star-o" size="20" />
        <van-icon name="share-o" size="20" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea placeholder="发一条友善的评论" @blur="hideBox2" ref="iptCmtB2" v-model.trim="cmt"></textarea>
      <van-button type="default" :disabled="cmt.length === 0" @click="pubCmt">发布</van-button>
    </div>
  </div>
</template>

<script>
import { getCmtListAPI, addLikeCmtAPI, delLikeCmtAPI, pubCommentAPI } from '@/api/articleAPI.js'

import { animate } from 'popmotion'

export default {
  name: 'ArtCmt',
  props: {
    // 从父组件中获取文章的 id
    artId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      // 文章评论列表
      cmtList: [],
      // 偏移量
      offset: null,
      loading: false,
      finished: false,
      // 是否显示评论区域1
      isShowBox1: true,
      // 总评论数
      cmtCount: 0,
      // 用户评论内容
      cmt: ''
    }
  },
  methods: {
    async initCmtList() {
      const { data: res } = await getCmtListAPI(this.artId, this.offset)
      if (res.message === 'OK') {
        // 获取文章的评论数
        this.cmtCount = res.data.total_count
        this.offset = res.data.last_id
        const newComList = res.data.results
        // 下拉刷新，旧数据在前，新数据在后
        if (this.cmtList.length <= 10 && this.cmtList.length > 0) {
          res.data.results = res.data.results.filter((item, index) => item.com_id !== this.cmtList[index].com_id)
        }
        this.cmtList = [...this.cmtList, ...res.data.results]
        // 将 loading 设为 false
        this.loading = false
        // 评论全部加载完后，设置 finished 为 true
        if (newComList.length === 0) {
          this.finished = true
        }
      }
    },
    onLoad() {
      this.initCmtList()
    },
    async addLike(cmt) {
      const { data: res } = await addLikeCmtAPI(cmt.com_id)
      if (res.message === 'OK') {
        cmt.is_liking = true
      }
    },
    async delLike(cmt) {
      const res = await delLikeCmtAPI(cmt.com_id)
      if (res.status === 204) {
        cmt.is_liking = false
      }
    },
    showBox2() {
      this.isShowBox1 = false

      // 点击 box1 后，box2 自动获得焦点
      this.$nextTick(() => {
        this.$refs.iptCmtB2.focus()
      })
    },
    hideBox2() {
      // 当评论区box2的文本框失去焦点时，延时100ms再隐藏该区域
      // 目的是让发布按钮能正常响应用户的点击事件
      setTimeout(() => {
        this.isShowBox1 = true
        this.cmt = ''
      }, 100)
    },
    // 发表评论
    async pubCmt() {
      const { data: res } = await pubCommentAPI(this.artId, this.cmt)
      if (res.message === 'OK') {
        // 评论数自增
        this.cmtCount++
        // 为新评论对象添加 is_liking 属性
        res.data.new_obj.is_liking = false
        // 将最新评论对象添加到评论列表
        this.cmtList.unshift(res.data.new_obj)
        // 提示用户评论成功
        this.$toast.success({
          message: '发表评论成功',
          duration: 500
        })
      }
    },
    scrollToCmtList() {
      // 当前滚动条的位置
      const now = window.pageYOffset
      // 目标位置，即文章区域的高度
      const dist = document.querySelector('.article-container').offsetHeight

      // 滚动动画
      animate({
        from: now,
        to: dist,
        onUpdate: latest => window.scrollTo(0, latest)
      })
    }
  },
  created() {
    this.initCmtList()
  }
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
