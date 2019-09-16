import { showAlert } from '../../utils/util';
import { service, apiUrl, checkUrl } from '../../service';
Page({
    data: {
        orderId:'',
        orderInfo: {}
    },
    getData: function(orderId) {
        console.log("获取数据")
        service.getUseInfo({ orderId: orderId }).subscribe({
            next: res => {
                if (res) {
                    this.setData({ orderInfo: res });
                }
            },
            error: err => console.log(err)
        });
    },
    printOrder:function() {
        wmpf.printer({
            data:[{
                "type":"base_string",
                "content":"订单号："+this.data.orderId,
                "style": {
                    "fontSize":25,
                    "align":'left',
                    "lineSpacing": 1.5
                }
              },{
                "type":"base_string",
                "content":'门店:'+this.data.orderInfo.useStoreName,
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
                "content":"核销数:"+this.data.orderInfo.usedNum,
                "style": {
                    "fontSize":25,
                    "align":'left',
                    "lineSpacing": 1.1
                }
              },{
                "type":"base_string",
                "content":"核销时间:"+this.data.orderInfo.useTime,
                "style": {
                    "fontSize":25,
                    "align":'left',
                    "lineSpacing": 1.1
                }
              }]
        })

        // wx.request({
        //     url: 'http://127.0.0.1:8080/printtext',
        //     method: "POST",
        //     data: {
        //         content: '打印内容打印内容打印内容',
        //         fontsize: '14',
        //         fontstyle: '0'
        //     },
        //     header: {
        //         'content-type': 'application/json'
        //     },
        //     success: (res) => {
        //         wx.showToast({
        //             title: "调用成功",
        //             icon: "none"
        //         })
        //         wx.request({
        //             url: 'http://127.0.0.1:8080/submit',
        //             header: {
        //                 'content-type': 'application/json'
        //             },
        //             success: (res) => {
        //                 wx.showToast({
        //                     title: "打印成功",
        //                     icon: "none"
        //                 })
        //             }
        //         });
        //     },
        //     fail:(res)=>{
        //         showAlert(res.errMsg);
        //     }
        // });
    },
    showTips: function() {
        showAlert('打印机未连接！');
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({ title: '核销详情' });
        this.setData({orderId:options.id});
        this.getData(options.id);
    }
});