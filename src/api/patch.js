import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/patch/lists',
    // url: '/vue-admin-template/patch/list',
    method: 'get',
    params
  })
}

// export function getSubjects() {
//   return request({
//     url: '/patch/subjects',
//     method: 'get',
//   })
// }

// export function getProjects() {
//   return request({
//     url: '/branch/projects',
//     method: 'get',
//   })
// }

// export function getRepos() {
//   return request({
//     url: '/patch/repos',
//     method: 'get',
//   })
// }

// export function getBranchs() {
//   return request({
//     url: '/patch/branchs',
//     method: 'get',
//   })
// }

export function getOwners(params) {
  return request({
    url: '/patch/owners',
    method: 'get',
    params
  })
}