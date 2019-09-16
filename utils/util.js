const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const showAlert = (str) => {
    wx.showModal({
        title: '温馨提示',
        content: str,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#666666'
    });
}

module.exports = {
    formatTime: formatTime,
    formatNumber: formatNumber,
    showAlert:showAlert
}