module.exports = {
	project: {
		alias: "some",
		name: "some",
		campusId: 111
	},

	serverUrl: {
		http: "https://www.api.com/a/",
		httpNews:"https://www.api.com/b/",
		httpInterface:"https://www.api.com/c/"
	},

	/* UI配置 */
	ui: {
		themeColor:"#ffffff",
		bodyBgColor:"#000000"
	},
	
	/* 模块配置 */
	pages: {
		login:{
			hasForgetPWD:true, //显示忘记密码
		}
	}
};
