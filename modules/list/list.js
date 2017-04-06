// 第一步定义模块
define(function(require, exports, module) {
	// 第五步 引入样式
	require('./list.css')
	// 第二步定义类
	var List = Backbone.View.extend({
		// 绑定事件
		events: {
			// 点击搜一搜按钮，搜索图片
			'tap .search span': 'searchImage',
			// 为每一个类别绑定tap事件
			'tap .nav li': 'getImageByType',
			// 点击返回顶部按钮，返回顶部
			'tap .go-top': 'goTop'
		},
		// 定义模板
		tpl: _.template('<a href="<%=link%>"><img style="<%=style%>" src="<%=src%>" alt="" /></a>'),
		// 我们定义两个变量来缓存dom的高度
		leftHeight: 0,
		rightHeight: 0,
		// 定义构造函数
		initialize: function () {
			var me = this;
			// 缓存一些必要的dom元素
			this.initDOM();
			// 订阅集合事件
			// this.collection.on('add', function () {})
			this.listenTo(this.collection, 'add', function (model, collection, option) {
				// 这里可以直接访问视图
				this.render(model)
			})
			// 定义节流方法
			var fn = _.throttle(function () {
				me.getData();
			}, 2000)
			// 绑定事件
			$(window).on('scroll', function () {
				// 判断加载条件
				if ($('body').height() < $(window).scrollTop() + $(window).height() + 200) {
					// 加载图片
					// me.getData();
					// 可以加载节流
					fn() 
				}
				me.checkShowGoTop()
			})
			// 让集合去请求数据
			this.getData();
		},
		/**
		 * 检测是否显示返回顶部按钮
		 **/
		checkShowGoTop: function () {
			// 滚动超过300像素显示
			if ($(window).scrollTop() > 300) {
				// 大于300 显示
				this.$el.find('.go-top').show()
			} else {
				// 小于300 隐藏
				this.$el.find('.go-top').hide()
			}
		},
		// 返回顶部
		goTop: function () {
			// 返回顶部
			window.scrollTo(0, 0)
		},
		// 请求集合数据
		getData: function () {
			// 通过集合请求数据
			this.collection.fetchData();
		},
		// 获取一些必要的元素
		initDOM: function () {
			// 获取左右容器元素
			this.leftDom = this.$el.find('.left-container')
			this.rightDom = this.$el.find('.right-container')
		},
		// 定义渲染方法
		render: function (model) {
			var height = model.get('viewHeight');
			// 1 获取元素
			// 2 获取数据
			var data = {
				// 定义链接地址
				link: '#layer/' + model.get('id'),
				// 定义图片地址
				src: model.get('url'),
				// 定义样式
				style: 'width: ' + model.get('viewWidth') + 'px; height: ' + height + 'px;'
			}
			// 3 定义模板
			var tpl = this.tpl;
			// 4 格式化模板
			var html = tpl(data);
			// 5 渲染到页面中
			// 我们应该向左边渲染还是右边渲染？
			// 我们要看左边容器和右边容器，谁更低
			if (this.leftHeight <= this.rightHeight) {
				// 向左边渲染
				this.renderLeft(html, height)
			} else {
				// 向右边渲染
				this.renderRight(html, height)
			}
		},
		/**
		 * 向左边渲染的方法
		 * @html 	渲染的内容（图片）
		 * @height 	更改的高度（图片的高度）
		 **/ 
		renderLeft: function(html, height) {
			// 渲染内容
			this.leftDom.append(html)
			// 更新高度 加上图片高度以及底边的边距
			this.leftHeight += height + 6
		},
		/**
		 * 向右边渲染的方法
		 * @html 	渲染的内容（图片）
		 * @height 	更改的高度（图片的高度）
		 **/ 
		renderRight: function (html, height) {
			// 渲染内容
			this.rightDom.append(html);
			// 更新高度
			this.rightHeight += height + 6;
		},
		// 获取搜索框内容
		getSearchVal: function () {
			return this.$el.find('.search input').val()
		},
		/**
		 * 校验搜索框内容是否合法
		 * @value 	搜索框的内容
		 * return 	是否有错误，有错误返回true
		 **/
		checkSearchValError: function (value) {
			// value不为 空
			if (/^\s*$/.test(value)) {
				alert('请输入内容')
				return true;
			} 
			// else {
			// 	return false
			// }
			return false;
		},
		/**
		 * 过滤集合的方法
		 * @value 	过滤的字段
		 * @type 	过滤的字段名称
		 * return 	符合条件的数组结果
		 **/ 
		collectionFilter: function (value, type) {
			// 调用集合的过滤方法过滤
			return this.collection.filter(function (model, index, models) {
				// 如果过滤type字段，我们判断属性值是否相等
				if (type === 'type') {
					return model.get('type') == value;
				}
				// 定义条件: title包含该字段
				return model.get('title').indexOf(value) > -1;
			})
			// return result
		},
		// collectionFilterType: function (value) {
		// 	return this.collection.filter(function (model) {
		// 		return model.get('type') == value;
		// 	})
		// },
		// 清空视图
		clearView: function () {
			// 清空左右容器的内容
			this.leftDom.html('')
			this.rightDom.html('')
			// 清空左右容器的高度
			this.leftHeight = 0;
			this.rightHeight = 0;
		},
		/**
		 * 渲染结果
		 * @result 	包含图片模型实例化对象的数组
		 **/ 
		renderResult: function (result) {
			var me = this;
			// 遍历模型渲染
			result.forEach(function (model, index) {
				// 全局作用域，所以要缓存作用
				me.render(model)
				// console.log(this)
			})
		},
		// 点击搜索按钮，搜索图片
		searchImage: function () {
			// 获取内容
			var value = this.getSearchVal();
			// 校验
			if(this.checkSearchValError(value)) {
				// 阻止后面程序继续执行
				return ;
			}
			// 处理内容
			// console.log(value)
			// 去除首尾空白符
			value = value.replace(/^\s+|\s+$/g, '')
			// console.log(value)
			// 集合过滤
			var result = this.collectionFilter(value)
			// console.log(result)
			// 清空视图
			this.clearView();
			// 渲染过滤后的图片
			this.renderResult(result)
		},
		/**
		 * 获取类别按钮的data-id数据
		 * return  类别id
		 **/
		getNavTypeValue: function (e) {
			// dom元素
			// console.log($(e.target).attr('data-id'))
			return $(e.target).data('id')
		},
		/**
		 * 点击类别按钮，过滤图片
		 **/ 
		getImageByType: function (e) {
			// 获取data-id数据
			var value = this.getNavTypeValue(e)
			// 过滤集合
			var result = this.collectionFilter(value, 'type')
			// 清空视图
			// console.log(result)
			this.clearView()
			// 渲染结果
			this.renderResult(result)

		}
	})

	// 第三步 暴漏接口
	module.exports = List;
	// return List
})