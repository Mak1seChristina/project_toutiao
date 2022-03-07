<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container" v-if="article">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="article.aut_name" :label="article.pubdate | dateFormat">
        <template #icon>
          <!-- 头像 -->
          <img :src="article.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button type="info" size="mini" v-if="article.is_followed" @click="setUnfollow">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="setFollow">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="article.attitude === 1" @click="setDislike">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="setLike">点赞</van-button>
      </div>
    </div>

    <!-- 文章评论组件 -->
    <ArtCmt :artId="id"></ArtCmt>
  </div>
</template>

<script>
import { getArticleDetailAPI, followUserAPI, unfollowUserAPI, addLikeAPI, delLikeAPI } from '@/api/articleAPI.js'

import ArtCmt from '@/components/ArtCmt/ArtCmt.vue'

// 导入 highlight.js 模块
import hljs from 'highlight.js'

export default {
  name: 'ArticleDetail',
  props: ['id'],
  data() {
    return {
      // 文章信息对象
      article: null
    }
  },
  components: {
    ArtCmt
  },
  methods: {
    async initArticle() {
      const { data: res } = await getArticleDetailAPI(this.id)
      if (res.message === 'OK') {
        this.article = res.data
      }
    },
    // 关注作者
    async setFollow() {
      const { data: res } = await followUserAPI(this.article.aut_id)
      if (res.message === 'OK') {
        // 提示关注成功
        this.$toast.success({
          message: '关注成功',
          duration: 500
        })
        // 更新关注状态
        this.article.is_followed = true
      }
    },
    // 取关作者
    async setUnfollow() {
      const res = await unfollowUserAPI(this.article.aut_id)
      // 状态码为204表示取关成功
      if (res.status === 204) {
        this.$toast.success({
          message: '取关成功',
          duration: 500
        })
        this.article.is_followed = false
      }
    },
    // 给文章点赞
    async setLike() {
      const { data: res } = await addLikeAPI(this.id)
      if (res.message === 'OK') {
        this.$toast.success({
          message: '点赞成功',
          duration: 500
        })
        this.article.attitude = 1
      }
    },
    // 给文章取消点赞
    async setDislike() {
      const res = await delLikeAPI(this.id)
      if (res.status === 204) {
        this.$toast.success({
          message: '取消点赞成功',
          duration: 500
        })
        this.article.attitude = -1
      }
    }
  },
  created() {
    this.initArticle()
  },
  updated() {
    if (this.article) {
      // 对文章内容进行高亮处理
      hljs.highlightAll()
    }
  },
  watch: {
    id() {
      // 只要 id 发生了变化，就重新获取文章详情数据
      this.article = null
      this.initArticle()
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.pageYOffset
    setTimeout(() => {
      next()
    }, 0)
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
