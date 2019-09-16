import { showAlert } from '../../utils/util';
import { service, apiUrl, checkUrl } from '../../service';
var app = getApp();
Page({
    data: {
        bookNum:1,
        productNum:0,
        orderInfo:{},
        storeName:"",
        storeId:"",
        opUserId:'',
        opUserName:'',
    },
    getData: function(code) {
        service.getVoucherInfo({code:code}).subscribe({
            next: res => {
                console.log(res);
                this.setData({ orderInfo: res[0],productNum: res[0].num });
            },
            error: err => console.log(err)
        });
    },
    getMyDetail:function(){
        service.getMyDetail().subscribe({
            next: res => {
              this.setData({opUserId:res.id,opUserName:res.name});
            },
            error: err => showAlert(err)
        });
    },
    submit:function(){
        var codeArr = [];
        for(var i=0;i<this.data.bookNum;i++){
            codeArr.push(this.data.orderInfo.code);
        }
        var obj = {
          "codes": codeArr.join(','),
          "opUserId": this.data.opUserId,
          "opUserName": this.data.opUserName,
          "openId": this.data.orderInfo.openId,
          "useStoreId": this.data.storeId,
          "useStoreName": this.data.storeName
        };
        service.use(obj).subscribe({
            next: res => {
                wx.showToast({
                    title: '核销成功',
                    icon: 'success'
                });
                wmpf.printer({
                    data:[{
                        "type":"base_string",
                        "content":"订单号："+res.useOrderId,
                        "style": {
                            "fontSize":25,
                            "align":'left',
                            "lineSpacing": 1.5
                        }
                      },{
                        "type":"base_string",
                        "content":'门店:'+this.data.storeName,
                        "style": {
                            "fontSize":25,
                            "align":'left',
                            "lineSpacing": 1.1
                        }
                      },{
                        "type":"base_string",
                        "content":"商品:"+this.data.orderInfo.productName,
                        "style": {
                            "fontSize":25,
                            "align":'left',
                            "lineSpacing": 1.1
                        }
                      },{
                        "type":"base_string",
                        "content":"核销数:"+this.data.bookNum,
                        "style": {
                            "fontSize":25,
                            "align":'left',
                            "lineSpacing": 1.1
                        }
                      },{
                        "type":"base_string",
                        "content":"核销时间:"+res.useTime,
                        "style": {
                            "fontSize":25,
                            "align":'left',
                            "lineSpacing": 1.1
                        }
                      }]
                });
                wx.navigateBack();
            },
            error: err => showAlert(err)
        });
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({ title: '确认核销' });
        this.getMyDetail();
        this.getData(options.code);
        this.setData({storeName:options.storeName});
        this.setData({storeId:options.storeId});
    }
});