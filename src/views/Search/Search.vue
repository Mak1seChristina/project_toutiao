<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" @input="onInput" />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length != 0">
      <div class="sugg-item" v-for="(item, index) in suggestList" :key="index" v-html="item" @click="gotoSearchResult"></div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="history = []" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(item, index) in history" :key="index" @click="gotoSearchResult">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getSuggestListAPI } from '@/api/searchAPI.js'

export default {
  name: 'Search',
  data() {
    return {
      // 搜索关键词
      kw: '',
      // 延时器
      timerId: null,
      // 搜索建议列表
      suggestList: [],
      // 搜索历史
      history: JSON.parse(localStorage.getItem('history') || '[]')
    }
  },
  mounted() {
    // 搜索框自动获取焦点
    const input = document.querySelector('input[type="search"]')
    input && input.focus()
  },
  methods: {
    onInput() {
      // 每次开始前都清空上一次的延时器
      clearTimeout(this.timerId)

      // 如果输入框内容为空，则不开启延时器
      if (this.kw.length === 0) {
        // 清空搜索列表
        this.suggestList = []
        return
      }

      // 设置延时器实现搜索防抖
      this.timerId = setTimeout(() => {
        this.initSuggestList()
      }, 500)
    },
    async initSuggestList() {
      const { data: res } = await getSuggestListAPI(this.kw)
      if (res.message === 'OK') {
        // 判断搜索结果是否为空
        if (res.data.options[0] === null) {
          this.suggestList = []
        } else {
          // 调用 hlightKeyWords 方法
          this.hlightKeyWords(res.data.options)
          this.suggestList = res.data.options
        }

        // 将搜索关键词添加到历史中
        // 先要清除与本次关键词重复的历史记录，以避免重复
        const newHistory = this.history.filter(item => item !== this.kw)
        newHistory.unshift(this.kw)
        this.history = newHistory
      }
    },
    // 搜索结果列表 关键字高亮
    hlightKeyWords(arr) {
      // 根据关键词动态创建正则表达式
      const reg = new RegExp(this.kw, 'ig')

      // arr列表中关键词高亮
      arr.forEach((item, index) => {
        arr[index] = item.replace(reg, val => {
          return `<span style="color: red; font-weight: 700;">${val}</span>`
        })
      })
    },
    // 跳转到搜索结果页面
    gotoSearchResult(e) {
      const kw = e.currentTarget.innerText
      this.$router.push('/search/' + kw)
    }
  },
  watch: {
    // 侦听器，监听历史记录的变化，将新数据存入本地存储
    history(newVal) {
      localStorage.setItem('history', JSON.stringify(newVal))
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 16px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
