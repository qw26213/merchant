import {http} from 'utils/http';
let service = {};
const apiUrl = 'https://juji.juniuo.com';
const checkUrl = 'https://c.juniuo.com';

service.getIndexData = (data) => {
  let url = apiUrl + '/merchant/report/brief.json';//描述:获取首页数据
  return http.get(url, data);
}

service.getMyDetail = (data) => {
  let url = apiUrl + '/merchant/myDetail.json';//获取我的信息
  return http.get(url, data);
}

service.getUselist = (data) =>{
  let url = checkUrl + '/shopping/voucher/useList.json';//获取核销列表
  return http.get(url, data);
}

service.submitCheck = (data) =>{
  let url = checkUrl + '/shopping/voucher/listVouchers.json';//核销
  return http.get(url, data);
}

service.use = (data) => {
  let url = checkUrl + '/shopping/voucher/use.json';//核销信息
  return http.post(url, data);
}

service.getVoucherInfo = (data) => {
  let url = checkUrl + '/shopping/voucher/listVouchers.json';//获取核销信息
  return http.get(url, data);
}

service.getUseInfo = (data) => {
  let url = checkUrl + '/shopping/voucher/useInfo.json';//获取核销详情
  return http.get(url, data);
}

module.exports = {
  apiUrl:apiUrl,
  checkUrl:checkUrl,
  service: service
}