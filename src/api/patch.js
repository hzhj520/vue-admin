import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/patch/lists',
    // url: '/vue-admin-template/patch/list',
    method: 'get',
    params
  })
}

export function branchDiff(params) {
  return request({
    url: '/patch/branch_diff',
    method: 'get',
    params
  })
}

export function tagDiff(params) {
  return request({
    url: '/patch/tag_diff',
    method: 'get',
    params
  })
}

export function dateDiff(params) {
  return request({
    url: '/patch/date_diff',
    method: 'get',
    params
  })
}

export function getSubjects() {
  return request({
    url: '/patch/subjects',
    method: 'get',
  })
}

export function getOwners(params) {
  return request({
    url: '/patch/owners',
    method: 'get',
    params
  })
}

export function getTags(params) {
  return request({
    url: '/patch/tags',
    method: 'get',
    params
  })
}

export function getDiffByCommitID(params) {
  return request({
    url: '/patch/diff_content',
    method: 'get',
    params
  })
}
