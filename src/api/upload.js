import request from '@/utils/request'

export function writeFileDetail(params) {
  return request({
    url: '/file/write_file_detail',
    method: 'get',
    params
  })
}

// 然后在接口中，将参数传过去
export function uploadFile(obj, onUploadProgress) {
  return request({
    url: '/file/upload',
    method: 'POST',
    timeout: 50000, // request timeout
    data: obj,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  })
}