import instance from './instance'

export const get = function(uri, data) {
  return instance.request({
    method: 'GET',
    uri,
    data
  })
}

export const post = function(uri, data) {
  return instance.request({
    method: 'POST',
    uri,
    data
  })
}