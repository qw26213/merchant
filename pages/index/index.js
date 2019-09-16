import { showAlert } from '../../utils/util';
import { service, apiUrl } from '../../service';
var app = getApp();
Page({
    data: {
        isLogin:true,
        dataInfo: {}
    },
    toCheck: function(e) {
        wx.navigateTo({ url: '../checkOrder/index' });
    },
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({isLogin:true});
        this.toLogin();
    },
    onLoad() {
        wx.setNavigationBarTitle({ title: '桔集商家服务' });
        wx.getSetting({
            success: (res) => {
                console.log('userInfoStatus=' + res.authSetting['scope.userInfo']);
                if (res.authSetting['scope.userInfo']) {
                    this.toLogin();
                }else{
                    this.setData({isLogin:false});
                }
            }
        });
    },
    toLogin: function() {
        wx.login({
            success: res => {
                this.getToken(res.code);
            },
            fail:res=>{
               wx.showModal({
                  title: '提示',
                  content: res.errMsg,
                  success:(res) => {
                    if (res.confirm) {
                      this.getToken('abcdefg');
                    } else if (res.cancel) {
                      console.log('用户点击取消');
                    }
                  }
                })
            }
        });
    },
    getToken(code){
        wx.request({
            url: apiUrl + '/mini/merchantLogin.json?code=' + code + '&appid=wx373625103afa430d',
            method: "POST",
            header: { 'content-type': 'application/json' },
            success: (res) => {
                wx.setStorageSync('accessToken', res.data.data.accessToken);
                this.getData();
            }
        })
    },
    getData() {
        service.getIndexData().subscribe({
            next: res => {
                if (res) {
                    this.setData({ dataInfo: res });
                }
            },
            error: err => console.log(err)
        });
    },
})