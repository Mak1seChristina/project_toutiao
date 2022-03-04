import request from '@/utils/request.js'

export const getUserChannelAPI = () => {
  return request.get('/v1_0/user/channels')
}

export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id,
      timestamp: time
    }
  })
}

// 文章不感兴趣
export const dislikeArtApi = id => {
  return request.post('/v1_0/article/dislikes', { target: id })
}

// 举报文章
export const reportArticleAPI = (target, type) => {
  return request.post('/v1_0/article/reports', { target, type })
}
