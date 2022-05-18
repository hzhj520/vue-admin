import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/file/lists',
    method: 'get',
    params
  })
}
export function fetchSoftList(params) {
  return request({
    url: '/file/soft_lists',
    method: 'get',
    params
  })
}

export function fetchFileDetailList(params) {
  // 安装包列表
  return request({
    url: '/file/file_details',
    method: 'get',
    params
  })
}

export function updateFileInfo(params) {
  return request({
    url: '/file/update',
    method: 'get',
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

export function getNames(params) {
  return request({
    url: '/file/names',
    method: 'get',
    params
  })
}

export function getVersionsCheckbox(params) {
  return request({
    url: '/file/versions_checkbox',
    method: 'get',
    params
  })
}

export function getVersions(params) {
  return request({
    url: '/file/versions',
    method: 'get',
    params
  })
}
export function getTitles(params) {
  return request({
    url: '/file/titles',
    method: 'get',
    params
  })
}

// export function download(filepath) {
//   return request({
//     url: '/file/download',
//     method: 'get',
//     params: { filepath },
//     // data: filepath,
//     responseType: 'blob',
//   })
// }

export function getFileInfoByVersion(params) {
  return request({
    url: '/file/get_file_by_version',
    method: 'get',
    params,
  })
}

export function deleteFileDetail(params) {
  return request({
    url: '/file/delete_file_detail',
    method: 'get',
    params
  })
}