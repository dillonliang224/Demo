/**
 * Created by liqp on 2017/4/12.
 */

$(function(){
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return decodeURI(r[2]);
		return null;
	}
	var code = getUrlParam('code')

	$.ajax({
		url:'/wechat/index',                //微信服务器请求地址
		data:{
			url: window.location.pathname,  //授权后跳转的url
			share_url: window.location.pathname+window.location.search,  //分享出去后地址
			subscribe: true,        //进入该页是否需要关注
			code: code,             //微信用户code
			path: '/test',          //api服务器路由
//                method: 'delete',       //api服务器请求方式
			data: {                 //当method为post  put时填写
				name: 'liqp',
				set: 'lskdj'
			},
		},
		type:'post',
		dataType:'json',
		success:function(obj){
			if (obj.access){   //如果需要授权
				return window.location.href=obj.accessUrl;
			}

			if (obj.subscribe){
				alert('需要关注')
			}

			wx.config({
				debug: true,
				appId: 'wx263fb30b721f7e0a',
				timestamp: obj.share_url.timestamp,
				nonceStr: obj.share_url.noncestr,
				signature: obj.share_url.signature,
				jsApiList: [
					'getLocation',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone'
				]
			});
			var config={
				title: '【169家庭】赢迪士尼双人双飞活动，速速来参与活动~', // 分享标题
				desc: '', // 分享描述
				link: 'http://liqingping.qingmh.com/wechat/h5/test.html', // 分享链接
				imgUrl: 'http://liqingping.qingmh.com/wechat/h5/demo.jpg', // 分享图标
				success: function () {
					alert('success')
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					alert('cancel')
					// 用户取消分享后执行的回调函数
				}
			}

			wx.ready(function(){
				wx.onMenuShareTimeline(config);
				wx.onMenuShareAppMessage(config);
				wx.onMenuShareQQ(config);
				wx.onMenuShareWeibo(config);
				wx.onMenuShareQZone(config);
			});

			$('#body').css('display','block')

		},error:function(r){
			console.log('error');
		}
	});
})