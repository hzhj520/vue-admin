import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/branch/lists',
    // url: '/vue-admin-template/branch/list',
    method: 'get',
    params
  })
}

export function getProjects(params) {
  return request({
    url: '/branch/projects',
    method: 'get',
    params
  })
}

export function getOwners(params) {
  return request({
    url: '/branch/owners',
    method: 'get',
    params
  })
}

export function getRepos(params) {
  return request({
    url: '/branch/repos',
    method: 'get',
    params
  })
}

export function getBranchs(params) {
  return request({
    url: '/branch/branchs',
    method: 'get',
    params
  })
}
