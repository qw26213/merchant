import xs from '../lib/xstream/index';
import {apiUrl} from '../service';
import {showAlert} from 'util'

let http = {}

http.get = (url, data = {}) => {
    for (let objName in data) {
        if (data[objName] === undefined || data[objName] === 'undefined') {
            data[objName] = '';
        }
    }
    return http_request(url, 'GET', data);
}

http.post = (url, data = {}) => {
    for (let objName in data) {
        if (data[objName] === undefined || data[objName] === 'undefined') {
            data[objName] = '';
        }
    }
    return http_request(url, 'POST', data);
}

function http_request(url, method, data) {
    const producer = {
        start: listener => {
            if (!wx.getStorageSync('accessToken')) {
                console.log('开始执行接口交互');
                wx.login({
                    success: res => {
                        wx.request({
                            url: apiUrl + '/mini/merchantLogin.json?code=' + res.code + '&appid=wx373625103afa430d',
                            method: 'POST',
                            header: { 'content-type': 'application/json' },
                            success: (obj) => {
                                console.log(obj);
                                if (res.data.errorCode === '0'||res.data.errorCode == "200") {
                                    wx.setStorageSync('accessToken', obj.data.data.token);
                                    console.log('登录成功，拿到token');
                                    wx.request({
                                        url: url,
                                        data: data,
                                        header: { 'content-type': 'application/json', 'Access-Token': wx.getStorageSync('accessToken') },
                                        method: method,
                                        success: res => {
                                            if (res.data.errorCode === '0'||res.data.errorCode == "200") {
                                                return listener.next(res.data.data);
                                            } else {
                                                if (res.data.errorCode === 'LOGIN_EXPIRE' || res.data.errorCode === 'TOKEN_ERROR' || res.data.errorCode === 'TOKEN_NOT_EXIST') {
                                                    console.log('调用重新登录');
                                                    wx.reLaunch({
                                                        url: '/pages/index/index',
                                                    });
                                                } else {
                                                    return listener.error(res.data.errorInfo);
                                                }
                                            }
                                        },
                                        fail: res => listener.error(res.errMsg),
                                        complete: () => listener.complete()
                                    })
                                } else {
                                    errDialog('登录失败，错误码:' + obj.data.errorCode + ' 返回错误: ' + obj.data.errorInfo);
                                }
                            },
                            fail: res => {},
                            complete: () => {}
                        });
                    }
                });

            } else {
              wx.request({
                  url: url,
                  data: data,
                  header: { 'content-type': 'application/json', 'Access-Token': wx.getStorageSync('accessToken') },
                  method: method,
                  success: res => {
                      if (res.data.errorCode === '0'||res.data.errorCode == "200") {
                          return listener.next(res.data.data);
                      } else {
                          if (res.data.errorCode === 'LOGIN_EXPIRE' || res.data.errorCode === 'TOKEN_ERROR' || res.data.errorCode === 'TOKEN_NOT_EXIST') {
                              console.log('调用重新登录');
                              wx.reLaunch({
                                  url: '/pages/index/index?isToken=0',
                              });
                          } else {
                              return listener.error(res.data.errorInfo);
                          }
                      }
                  },
                  fail: res => listener.error(res.errMsg),
                  complete: () => listener.complete()
              })
            }
          },
        stop: () => {}
    }
    return xs.create(producer)
}

module.exports = {
    http: http
}