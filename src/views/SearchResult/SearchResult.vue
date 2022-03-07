<template>
  <div>
    <van-nav-bar title="搜索结果" left-arrow fixed placeholder @click-left="$router.back()" />

    <!-- 文章列表 -->
    <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
      <ArtItem v-for="item in searchList" :key="item.art_id" :article="item" :closable="false"></ArtItem>
    </van-list>
  </div>
</template>

<script>
import { getSearchResultAPI } from '@/api/searchAPI.js'
import ArtItem from '@/components/ArtItem/ArtItem.vue'

export default {
  name: 'SearchResult',
  components: {
    ArtItem
  },
  props: ['kw'],
  data() {
    return {
      page: 1, // 页码值
      searchList: [], // 搜索结果列表数据
      loading: false,
      finished: false
    }
  },
  methods: {
    async initSearchList() {
      const { data: res } = await getSearchResultAPI(this.kw, this.page)

      if (res.message === 'OK') {
        // 上拉刷新页面，旧数据在前，新数据在后
        this.searchList = [...this.searchList, ...res.data.results]

        this.loading = false

        if (res.data.results.length === 0) return (this.finished = true)
      }

      this.page++
    },
    // 上拉刷新页面
    onLoad() {
      this.initSearchList()
    }
  },
  created() {
    this.initSearchList()
  },
  watch: {
    kw() {
      this.page = 1
      this.searchList = []
      this.loading = false
      this.finished = false

      this.initSearchList()
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
// 设置返回箭头的字体大小
/deep/ .van-icon-arrow-left {
  font-size: 0.48rem;
}
</style>
