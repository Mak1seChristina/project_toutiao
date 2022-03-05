<template>
  <div>
    <!-- 文章信息 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <!-- 单张图片 -->
          <img class="thumb" v-if="article.cover.type === 1" v-lazy="article.cover.images[0]" />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img alt="" class="thumb" v-for="(item, index) in article.cover.images" :key="index" v-lazy="item" />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>作者：{{ article.aut_name }} &nbsp;&nbsp; {{ article.comm_count }}评论 &nbsp;&nbsp; 发布日期：{{ article.pubdate | dateFormat }}</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="showFIrst = true" v-if="closable" />
        </div>
      </template>
    </van-cell>

    <!-- 反馈面板 -->
    <van-action-sheet v-model="showFIrst" cancel-text="取消" :closeable="false" @closed="isFirst = true" get-container="body">
      <!-- 一级反馈 -->
      <van-cell :title="item.name" clickable v-for="item in actions" :key="item.name" class="center-title" @click="onCellClick(item.name)" />
    </van-action-sheet>

    <!-- 二级反馈 -->
    <van-action-sheet v-model="showSecond" cancel-text="返回" :closeable="false" @cancel="backToFirst" get-container="body">
      <van-cell :title="item.label" v-for="item in reports" :key="item.type" clickable class="center-title" @click="reportArticle(item.type)" />
    </van-action-sheet>
  </div>
</template>

<script>
import reports from '@/api/reports.js'

import { dislikeArtApi, reportArticleAPI } from '@/api/homeAPI.js'
import { Toast } from 'vant'

export default {
  name: 'ArtItem',
  props: {
    // 文章信息对象
    article: {
      type: Object
    },
    // 是否显示文章的关闭按钮
    closable: {
      type: Boolean,
      // 默认值为 true，默认显示关闭按钮
      default: true
    }
  },
  data() {
    return {
      // 是否显示一级反馈面板
      showFIrst: false,
      // 是否显示二级反馈面板
      showSecond: false,
      // 一级反馈可选项
      actions: [{ name: '不感兴趣' }, { name: '反馈垃圾内容' }, { name: '拉黑作者' }],
      // 控制是否为一级反馈
      isFirst: true,
      // 二级反馈的可选项列表
      reports
    }
  },
  methods: {
    backToFirst() {
      // 二级反馈面板返回至一级反馈面板
      this.showSecond = false
      this.showFIrst = true
    },
    async onCellClick(name) {
      if (name === '不感兴趣') {
        const { data: res } = await dislikeArtApi(this.artId)
        if (res.message === 'OK') {
          this.$emit('remove-article', res.data.target)
        }
        this.show = false
      } else if (name === '拉黑作者') {
        console.log('拉黑作者')
        this.show = false
      } else if (name === '反馈垃圾内容') {
        this.showSecond = true
        this.showFIrst = false
      }
    },
    async reportArticle(type) {
      const { data: res } = await reportArticleAPI(this.artId, type)
      if (res.message === 'OK') {
        this.$emit('remove-article', res.data.target)
        Toast.success({
          message: '举报成功',
          duration: 300
        })
      }
      // 关闭动作页面
      this.show = false
    }
  },
  computed: {
    // 文章的 id
    artId() {
      // 文章对象的 art_id 需要转换成字符串
      return this.article.art_id.toString()
    }
  }
}
</script>

<style lang="less" scoped>
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}

// 设置反馈单元格里面文字居中
.center-title {
  text-align: center;
}
</style>
