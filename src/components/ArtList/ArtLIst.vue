<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="finished">
      <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
        <ArtItem v-for="item in artlist" :key="item.art_id" :article="item" @remove-article="removeArticle"></ArtItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArtListAPI } from '@/api/homeAPI.js'

import ArtItem from '@/components/ArtItem/ArtItem.vue'

export default {
  name: 'ArtList',
  components: {
    ArtItem
  },
  props: {
    channelId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 文章列表
      artlist: [],
      // 时间戳，默认值为当前时间戳
      timestamp: +new Date(),
      // 是否正砸进行上拉加载
      loading: false,
      // 数据是否全部加载完毕
      finished: false,
      // 是否正在进行下拉刷新
      isLoading: false
    }
  },
  methods: {
    // 初始化文章列表
    async initArtList(isRefresh) {
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      if (res.message === 'OK') {
        // 为时间戳赋值
        this.timestamp = res.data.pre_timestamp
        if (isRefresh) {
          // 更新文章列表（当上拉刷新数据时，新数据在前，旧数据在后）
          this.artlist = [...res.data.results, ...this.artlist]
          this.isLoading = false
        } else {
          // 更新文章列表（当下拉加载数据时，旧数据在前，新数据在后）
          this.artlist = [...this.artlist, ...res.data.results]
          // 重置 loading 为 false
          this.loading = false
        }
        // 判断数据是否全部加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      }
    },
    onLoad() {
      console.log('触发了上拉加载更多')
      this.initArtList()
    },
    onRefresh() {
      this.initArtList(true)
    },
    // 移除不感兴趣的文章
    removeArticle(id) {
      this.artlist = this.artlist.filter(item => item.art_id !== id)
      // 判断剩余数据的文章数量是否小于10，若小于10，则请求下一页数据
      if (this.artlist.length < 10) {
        this.initArtList()
      }
    }
  },
  created() {
    this.initArtList()
  }
}
</script>

<style lang="less" scoped></style>
