import request from '@/utils/request'

// 用户主页
export function getInfoByName(username, page, size) {
  return request({
    url: `/ums/user/username/${username}`,
    method: 'get',
    params: {
      pageNo: page,
      size: size
    }
  })
}
export function getInfoById(id){
  return request({
    url:`/ums/user/id/${id}`,
    method:'get'
  })
}
// 用户主页
export function getInfo() {
  return request({
    url: '/ums/user/info',
    method: 'get'
  })
}
// 更新
export function update(user) {
  return request({
    url: '/ums/user/update',
    method: 'post',
    data: user
  })
}


