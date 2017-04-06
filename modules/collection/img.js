define(function (require, exports, module) {
	// 引入模型 
	var ImgModel = require('modules/model/img')
	// 拓展图片集合类
	var ImgCollection = Backbone.Collection.extend({
		// 设置集合
		model: ImgModel,
		// 模型id计数
		idNum: 0,
		// 实现拉去数据的方法，
			// 1 对返回的结果随机排序
			// 2 对每一个模型添加一个id
		// 定义拉去数据的方法
		fetchData: function () {
			var me = this;
			// 异步请求数据
			$.get('data/imageList.json', function (res) {
				// console.log(res)
				if (res && res.errno === 0) {
					// 对返回的数据随机排序
					res.data.sort(function (a, b) {
						// 乱序就是返回一个随机布尔值
						return Math.random() > 0.5 ? 1 : -1;
					})
					// 为每一个成员添加一个id
					res.data.forEach(function (obj) {
						// idNum加一再赋值
						obj.id = ++me.idNum
					})
					// 返回的数据添加到集合中
					me.add(res.data)
					// console.log(me.toJSON())
				}
			})
		}
	})

	// 暴漏接口
	module.exports = ImgCollection;

	// 测试一下
	// var ic = new ImgCollection();
	// // ic.fetch()
	// ic.fetchData();
})