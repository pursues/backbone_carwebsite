// 定义图片模型模块
define(function (require, exports, module) {
	// 容器宽度 窗口宽度一半，减去左边的边距，右边边距
	var w = $(window).width() / 2 - 6 - 3;
	// console.log(w)

	// 定义模型类
	var Img = Backbone.Model.extend({
		// 定义构造函数
		initialize: function () {
			// console.log(1111)
			// 我们要求小图片的高度，求完，还要为实例化对象赋值，所以我们可以在构造函数里面执行 
			// H / W * w
			var h = this.attributes.height / this.attributes.width * w;
			// console.log(h)
			// 添加宽高 给元素添加属性
			this.attributes.viewWidth = w;
			this.attributes.viewHeight = h; 
		}
	})


	// 暴漏图片模型接口
	module.exports = Img;

})