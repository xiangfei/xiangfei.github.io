(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{"255":function(e,t,n){"use strict";var r=n(1),o=n(68),i=n(4),a=n(143),c=n(51),u=n(16),_slicedToArray=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function sliceIterator(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&c.return&&c.return()}finally{if(o)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},s=function(){function defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&defineProperties(e.prototype,t),n&&defineProperties(e,n),e}}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var p={"常熟移车":"/pages/moveCar/index","移车进程":"/pages/moveProcess/index","我的":"/pages/userInfo/index","我的车辆":"/subPages/myCar/index","我的移车码":"/subPages/myShiftCode/index","用户须知":"/subPages/notice/index","移车详情":"/subPages/moveProcessDetail/index","车辆位置":"/subPages/carPosition/index","移车评价":"/subPages/evaluate/index"},l=function(e){function TitleBar(){return _classCallCheck(this,TitleBar),_possibleConstructorReturn(this,(TitleBar.__proto__||Object.getPrototypeOf(TitleBar)).apply(this,arguments))}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{"constructor":{"value":e,"enumerable":!1,"writable":!0,"configurable":!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(TitleBar,e),s(TitleBar,[{"key":"render","value":function render(){var e=this.props,t=e.title,n=(e.hasBack,e.bgColor,e.fontColor,o.c),s=i.a.useState(0),l=_slicedToArray(s,2),f=(l[0],l[1]),A=i.a.useState(0),d=_slicedToArray(A,2),h=(d[0],d[1]),g=i.a.useState(0),v=_slicedToArray(g,2),y=(v[0],v[1]);i.a.useDidShow((function(){p[t]&&m(),b()}));var m=function saveRouters(){var e=(n("routers")||["/pages/moveCar/index"]).filter((function(e){return e!==p[t]}))||[];"常熟移车"===t||Object(u.e)(e)?Object(u.d)("routers",["/pages/moveCar/index"]):Object(u.d)("routers",[].concat(function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(e),[p[t]]))},b=function getTitleBarHeight(){var e=Object(a.a)(),t=e.top,n=e.height;f(t+n+10),h(t),y(n)};return r.j.createElement(c.a,{"style":{"position":"relative"}},void 0)}}]),TitleBar}(i.a.Component);t.a=l},"281":function(e,t){e.exports="data:image/png;base64,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"},"282":function(e,t,n){e.exports=n.p+"static/images/initBack.png"},"300":function(e,t,n){e.exports={"index":"index-module__index___15flX","initLogo":"index-module__initLogo___3ocSR","initBack":"index-module__initBack___1KHPI"}},"365":function(e,t,n){"use strict";n.r(t);var r=n(2),o=n.n(r),i=n(1),a=n(4),c=n(68),u=n(51),s=n(350),p=n(72),l=n(255),f=n(281),A=n.n(f),d=n(282),h=n.n(d),g=n(16),v=new Promise((function(e,t){try{i.j.createElement("reference",{"path":"jquery-3.4.1.min.js"});/kan_chang_shu_app/i.test(navigator.userAgent);var n=/android/i.test(navigator.userAgent),r=!1,o=null,a=function _kcsapp_get_client_version(){if(/\d\.\d(\.\d)?$/.test(navigator.userAgent)){var e=/\d\.\d(\.\d)?$/.exec(navigator.userAgent)[0];return e=e.replace(/\./g,""),e=parseInt(e)}return/v看常熟/.test(navigator.userAgent)&&n?137:999},c=function _kcsapp_goto_login(){0==r&&(r=!0,n?a()<139?(SYSJSBridge.gotoLogin(),setTimeout((function(){return e("sucess")}),2e3)):SYSJSBridge.gotoLogin((function(){setTimeout((function(){return e("sucess")}),2e3)}),(function(){})):a()<25||SYSJSBridge.gotoLogin({"success":function success(){setTimeout((function(){return e("sucess")}),2e3)},"failure":function failure(){}}))},u=function _kcsapp_get_userinfo(){if(null!=o)return function _kcsapp_get_userinfo_callback(){JSON.stringify(o);e({"data":o})}(),!1;n?a()<139?SYSJSBridge.checkLogin("_kcsapp_get_userinfo_by_android_less139"):SYSJSBridge.getUserInfo((function(e){o=JSON.parse(e)}),(function(){c()})):SYSJSBridge.getUserInfo({"success":function success(e){o=JSON.parse(e)},"failure":function failure(){c()}}),setTimeout((function(){_kcsapp_get_userinfo()}),300)};u()}catch(t){e({"data":"非 app"})}})),y=function kcs_app_userinfo(){return window.navigator.userAgent.includes("kan_chang_shu_app")?v:new Promise((function(e,t){e({"data":"非 app"})}))},m=n(300),b=n.n(m),O=function(){function defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&defineProperties(e.prototype,t),n&&defineProperties(e,n),e}}(),P=function get(e,t,n){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,t);if(void 0===r){var o=Object.getPrototypeOf(e);return null===o?void 0:get(o,t,n)}if("value"in r)return r.value;var i=r.get;return void 0!==i?i.call(n):void 0};function _asyncToGenerator(e){return function(){var t=e.apply(this,arguments);return new Promise((function(e,n){return function step(r,o){try{var i=t[r](o),a=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(a).then((function(e){step("next",e)}),(function(e){step("throw",e)}));e(a)}("next")}))}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var E=function(e){function Init(){var e,t,n;_classCallCheck(this,Init);for(var r=arguments.length,o=Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=n=_possibleConstructorReturn(this,(e=Init.__proto__||Object.getPrototypeOf(Init)).call.apply(e,[this].concat(o))),n.config={"navigationBarTitleText":"常熟移车"},_possibleConstructorReturn(n,t)}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{"constructor":{"value":e,"enumerable":!1,"writable":!0,"configurable":!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(Init,e),O(Init,[{"key":"render","value":function render(){var e,t=this,n=this.props.login,r=(a.a.reLaunch,c.c),p=c.a,f=(e=_asyncToGenerator(o.a.mark((function _callee2(){var e,n;return o.a.wrap((function _callee2$(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,r("userInformation");case 2:if(t.t0=t.sent,t.t0){t.next=5;break}t.t0={};case 5:return e=t.t0,t.next=8,r("Authorization");case 8:if(t.t1=t.sent,t.t1){t.next=11;break}t.t1="";case 11:return n=t.t1,t.next=14,p();case 14:return t.next=16,Object(g.d)("Authorization",n);case 16:return t.next=18,Object(g.d)("userInformation",e);case 18:return t.abrupt("return",e.phone||"");case 19:case"end":return t.stop()}}),_callee2,t)}))),function getPhoneAndClearALLStorage(){return e.apply(this,arguments)});return a.a.useDidShow((function(){f().then((function(e){return function checkAuthorization_h5(){var e;return y().then((e=_asyncToGenerator(o.a.mark((function _callee(e){var r,i,a,c,u=e.data,s=void 0===u?{}:u;return o.a.wrap((function _callee$(e){for(;;)switch(e.prev=e.next){case 0:if(r=s.userId,i=void 0===r?"":r,a=s.phone,!(c=void 0===a?"":a)){e.next=8;break}return e.next=4,n({"userId":i,"phone":c,"type":3}).then((function(e){var t=e.data,n=(void 0===t?{}:t).oauthToken,r=void 0===n?"":n;Object(g.d)("Authorization",r)}));case 4:return e.next=6,Object(g.d)("userInformation",{"phone":c});case 6:e.next=9;break;case 8:Object(g.d)("Authorization","");case 9:window.location.replace("/movecar-h5/pages/moveCar/index");case 10:case"end":return e.stop()}}),_callee,t)}))),function(t){return e.apply(this,arguments)}))}(e)}))})),i.j.createElement(u.a,{"className":b.a.index},i.j.createElement(l.a,{"title":"常熟移车"}),i.j.createElement(s.a,{"className":b.a.initLogo,"src":A.a}),i.j.createElement(s.a,{"className":b.a.initBack,"src":h.a}))}},{"key":"componentDidMount","value":function componentDidMount(){P(Init.prototype.__proto__||Object.getPrototypeOf(Init.prototype),"componentDidMount",this)&&P(Init.prototype.__proto__||Object.getPrototypeOf(Init.prototype),"componentDidMount",this).call(this)}},{"key":"componentDidShow","value":function componentDidShow(){P(Init.prototype.__proto__||Object.getPrototypeOf(Init.prototype),"componentDidShow",this)&&P(Init.prototype.__proto__||Object.getPrototypeOf(Init.prototype),"componentDidShow",this).call(this)}},{"key":"componentDidHide","value":function componentDidHide(){P(Init.prototype.__proto__||Object.getPrototypeOf(Init.prototype),"componentDidHide",this)&&P(Init.prototype.__proto__||Object.getPrototypeOf(Init.prototype),"componentDidHide",this).call(this)}}]),Init}(a.a.Component);E.config={"navigationBarTitleText":"常熟移车"};t.default=Object(p.b)(null,(function mapDispatchToProps(e){return{"login":function login(t){return e({"type":"userInfo/login","payload":t})}}}))(E)}}]);