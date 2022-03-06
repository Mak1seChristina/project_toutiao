import request from '@/utils/request'

export const getArticleDetailAPI = id => {
  return request.get(`/v1_0/articles/${id}`)
}

export const followUserAPI = authorId => {
  return request.post('/v1_0/user/followings', {
    target: authorId
  })
}

export const unfollowUserAPI = authorId => {
  return request.delete(`/v1_0/user/followings/${authorId}`)
}

export const addLikeAPI = artId => {
  return request.post('/v1_0/article/likings', {
    target: artId
  })
}

export const delLikeAPI = artId => {
  return request.delete(`/v1_0/article/likings/${artId}`)
}

export const getCmtListAPI = (artId, offset) => {
  return request.get('/v1_0/comments', {
    params: {
      // 评论的类型，a 表示对文章的评论
      type: 'a',
      // 文章的 id
      source: artId,
      // 评论数据的偏移量，值为评论的 id。表示从此 id 的数据向后取，不传表示从第一页开始读取数据
      offset
    }
  })
}

export const addLikeCmtAPI = cmtId => {
  return request.post('/v1_0/comment/likings', {
    target: cmtId
  })
}

export const delLikeCmtAPI = cmtId => {
  return request.delete(`/v1_0/comment/likings/${cmtId}`)
}

export const pubCommentAPI = (artId, content) => {
  return request.post('/v1_0/comments', {
    target: artId,
    content
  })
}
