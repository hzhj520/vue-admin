import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/branch/lists',
    // url: '/vue-admin-template/branch/list',
    method: 'get',
    params
  })
}

export function getProjects() {
  return request({
    url: '/branch/projects',
    method: 'get',
  })
}

export function getOwners() {
  return request({
    url: '/branch/owners',
    method: 'get',
  })
}

export function getDepositorys() {
  return request({
    url: '/branch/depositorys',
    method: 'get',
  })
}

export function getBranchs() {
  return request({
    url: '/branch/branchs',
    method: 'get',
  })
}
