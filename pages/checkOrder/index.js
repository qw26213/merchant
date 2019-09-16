import { showAlert } from '../../utils/util';
import { service, apiUrl,checkUrl } from '../../service';
var app = getApp();
Page({
      data: {
          shopId: '',
          code: '',
          useList: [],
          pageNo: 1,
          ifBottom: false,
          curStoreId: '',
          storeName: '选择门店',
          storeId: '',
          isAdmin: false,
          picker: false,
          storelist: [{
              flex: 1,
              values: [],
              textAlign: 'center'
          }],
          isBack:false,
          isPull: true //是否满足下拉加载
      },
      getData: function() {
        service.getUselist({pageSize:10,storeId:this.data.curStoreId,pageNo:this.data.pageNo}).subscribe({
            next: res => {
                for (var i = 0; i < res.length; i++) {
                    var date = res[i].useTime;
                    res[i].useTime = date.split(' ')[1];
                    res[i].useDate = date.split(' ')[0];
                }
                this.setData({
                    useList: this.data.useList.concat(res),
                    ifBottom: res.length < 10 ? true : false
                });
            },
            error: err => console.log(err)
        });
      },
      onReachBottom: function() {
        if (this.data.ifBottom) { //已经到底部了
            return;
        } else {
            this.setData({
                pageNo: this.data.pageNo + 1
            })
            this.getData();
        }
      },
      getStorelist: function(defaultId) {
          wx.request({
              url: apiUrl + '/merchant/listStores.json',
              header: {
                'content-type': 'application/json',
                'Access-Token':wx.getStorageSync('accessToken')
              },
              success: (res) => {
                  if (res.data.errorCode == 0) {
                      if (!defaultId) {
                          var arr = [];
                          for (var i = 0; i < res.data.data.length; i++) {
                              arr.push(res.data.data[i].id);
                          }
                          this.setData({ curStoreId: arr.join(',') });
                          if (res.data.data.length == 1) {
                              this.setData({
                                  storeId: res.data.data[0].id,
                                  storeName: res.data.data[0].name
                              });
                          }
                      } else {
                          for (var i = 0; i < res.data.data.length; i++) {
                              if (res.data.data[i].id == defaultId) {
                                  this.setData({
                                      storeId: defaultId,
                                      curStoreId: defaultId,
                                      storeName: res.data.data[i].name
                                  });
                              }
                          }
                      }
                      this.getData();
                  }
              }
          })
      },
      getMyDetail: function() {
        service.getMyDetail().subscribe({
            next: res => {
                if (res.storeId == 'admin') {
                  this.setData({isAdmin: true});
                  this.getDefaultStoreId();
                } else {
                  this.setData({
                    isAdmin: false,
                    storeName: res.storeName,
                    storeId: res.storeId,
                    curStoreId: res.storeId
                  });
                  this.getData();
                }
            },
            error: err => console.log(err)
        });
    },
    submit: function() {
        if (this.data.storeId == "" && this.data.isAdmin) {
            showAlert("请选择核销门店");
            return;
        }
        if (this.data.code == "") {
            showAlert("核销码不能为空");
            return;
        }
        service.submitCheck({code:this.data.code}).subscribe({
            next: res => {
                if (res[0].num == 0) {
                    showAlert('该核销码已经使用过！');
                    return;
                }
                if (res[0].validDays < 0) {
                    showAlert('该核销码已过期！');
                    return;
                }
                this.saveStore(this.data.curStoreId);
            },
            error: err => showAlert(err)
        });
    },
    getDefaultStoreId: function() {
      wx.request({
          url: apiUrl + '/merchant/getVerifyStore.json',
          header: {
              'content-type': 'application/json',
              'Access-Token':wx.getStorageSync('accessToken')
          },
          success: (res) => {
            if (res.data.errorCode === '0') {
                this.setData({curStoreId:res.data.data.id});
                this.getStorelist(this.data.curStoreId);
            }
          }
      });
    },
    saveStore:function(id) {
      wx.request({
            url: apiUrl + '/merchant/saveVerifyStore.json?storeId=' + id,
            header: {
                'content-type': 'application/json',
                'Access-Token':wx.getStorageSync('accessToken')
            },
            success: (res) => {
              wx.navigateTo({url: '/pages/checkConfirm/index?code='+this.data.code+'&storeId='+this.data.storeId+'&storeName='+this.data.storeName});
            }
      });
    },
    scanCode: function() {
        wx.scanCode({
            success: (res) => {
                console.log("扫码结果");
                console.log(res);
                this.setData({code: res.result});
                this.submit();
            },
            fail: (res) => {
                console.log(res);
            }
        })
    },
    bindCode:function(e){
        this.setData({
            code: e.detail.value
        })
        if(this.data.code.length>=16){
          this.submit();
        }
    },
    toDetail:function(e){
      wx.navigateTo({url: '/pages/checkDetail/index?id='+e.currentTarget.dataset.id});
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({ title: '核销' });
        this.getMyDetail();
    },
    onHide: function() {
        this.setData({ isBack: true });
    },
    onShow:function(){
        if (this.data.isBack) {
            this.getData(); // 返回刷新
        }
    }
});