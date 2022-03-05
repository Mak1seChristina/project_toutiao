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
