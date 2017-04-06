//定义app模块
define(function(require,exports,module){

	//引入视图文件
	//引入列表页面
	var List = require('modules/list/list');
	//引入大图页面
	var Layer = require('modules/layer/layer');
	//引入登录模块
	//var Logins = require('modules/logins/logins');
	//引入集合模块
	var ImageCollection = require('modules/collection/img')
	//实例化集合
	var ic = new ImageCollection();
	//实例化视图类
	var layer = new Layer({
		el:$('#layer'),
		collection:ic
	})
	var list = new List({
		el:$('#list'),
		collection:ic
	})
	// var logins = new Logins({
	// 	el:$('#logins'),
	// 	//collection:ic
	// })


	//路由
	//拓展类
	var Router = Backbone.Router.extend({
		//定义路由规则
		routes:{
			//大图页面
			'layer/:num':'showLayer',
			//定义列表页
			'*other':'showList'
			//'logins':'showLogins'
		},
		//展示大图页面
		showLayer:function(num){
			// 当进入大图页，渲染大图页，将大图页显示
			// 根据num从集合中选择model实例化对象
			layer.render(num)
			layer.$el.show()
		},
		//展示列表页
		showList:function(){
			// 进入列表页，将大图页隐藏
			layer.$el.hide()
			//如果不注释掉 list.js:81 表明get是没有定义的
			//list.render()
		}
		// //展示登录页面
		// showLogins:function(){
		// 	layer.$el.hide()
		// }
	})
	//实例化路由
	var router = new Router();
	//开启路由
	Backbone.history.start()
})