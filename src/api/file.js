import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/file/lists',
    // url: '/vue-admin-template/branch/list',
    method: 'get',
    params
  })
}

export function updateFileInfo(params) {
  return request({
    url: '/file/update',
    method: 'get',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    params
  })
}

export function deleteFileInfo(params) {
  return request({
    url: '/file/delete',
    method: 'get',
    params
  })
}

export function createFileInfo(params) {
  return request({
    url: '/file/create',
    method: 'get',
    timeout: 50000, 
    params
  })
}

export function getVersions(params) {
  return request({
    url: '/file/versions',
    // url: '/vue-admin-template/branch/list',
    method: 'get',
    params
  })
}


export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}
