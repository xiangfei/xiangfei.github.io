(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"265":function(e,t,o){"use strict";o.d(t,"a",(function(){return r}));var n=o(4),_slicedToArray=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function sliceIterator(e,t){var o=[],n=!0,r=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(o.push(i.value),!t||o.length!==t);n=!0);}catch(e){r=!0,a=e}finally{try{!n&&s.return&&s.return()}finally{if(r)throw a}}return o}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},r=function useUpdateEffect(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],o=n.a.useState(!1),r=_slicedToArray(o,2),a=r[0],i=r[1];n.a.useEffect((function(){a?e():i(!0)}),t)}},"274":function(e,t,o){"use strict";var n=o(1),r=o(298),a=o(252),i=o(4),s=o(73),c=o.n(s),u=o(74),l=o.n(u),p=o(75),f=o.n(p),d=o(76),v=o.n(d),m=o(77),h=o.n(m),y=o(78),_=o.n(y),b=function(){function defineProperties(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,o){return t&&defineProperties(e.prototype,t),o&&defineProperties(e,o),e}}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var I=function(e){function TabBar(){_classCallCheck(this,TabBar);var e=_possibleConstructorReturn(this,(TabBar.__proto__||Object.getPrototypeOf(TabBar)).apply(this,arguments));return e.handleClick=function(t){var o=e.state.tabList;Object(a.c)({"url":o[t].path}),e.props.clickHook&&e.props.clickHook()},e.state={"tabList":[{"title":"移车","image":c.a,"selectedImage":l.a,"path":"/pages/moveCar/index"},{"title":"移车进程","image":f.a,"selectedImage":v.a,"path":"/pages/moveProcess/index?type=tab"},{"title":"我的","image":h.a,"selectedImage":_.a,"path":"/pages/userInfo/index"}]},e}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{"constructor":{"value":e,"enumerable":!1,"writable":!0,"configurable":!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(TabBar,e),b(TabBar,[{"key":"render","value":function render(){var e=this.state.tabList,t=this.props.current;return n.j.createElement(r.a,{"backgroundColor":"white","tabList":e,"fixed":!0,"onClick":this.handleClick,"current":t})}}]),TabBar}(i.a.Component);t.a=I},"318":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAABiCAMAAACPrLbIAAAA21BMVEUAAADG3//l7//i7v+Vtu+jwvTt9f/b6f/0+P/o8f/M3/vm8P/m8P/m8P/U5//m8f/l8P/m8P+Zu/Hl7//n8P/n8f/n8f/m7//m8P/m8P/n8f+YuvLr9f+Utu+Utu/m8P/m8P+Vtu/n8f/n8f/n8v+Vt/Dp8/+Ttu+Vt++Yu/HK3//l7//C2f/s8/+ew//d6v+Tte7y9//fmYuixv++1/+nyf/X5/+z0f+szf+51P/p8f/R4//K3//goJXjzdHFhHfl6vnk4ezhrKbi2eOosdjhtrLiv7/G1fTSoZuks5tmAAAAK3RSTlMAJeLh37/y4vlSENvEhwWg6dCtkXNdP/O5sWhTGO3QqpeUfEc3NC17ah3rYPD/TQAAA7NJREFUaN7s1m1X0zAUwHERBJ3y4PCZAwKKPNxmt6xp2rQVVBT9/p/I3PZudE2Kyc72Sv5vKPSc/JrALXv00EP/X4OVJbTlpIbREtpzSedPoiU0dFGnc1FSyui+1s4d1EEoJbM0GVFJmsle6tSWTuIwSqejdqnuodZs6iiIkgy1yqWTik+60tZ+CKX55PJMa53l/J12Ukddai8OoPJmG5GCAkEopWTzk8xF7W91h4qoECmNQAhRoNFQCJQpWxYVd0ZrEPtTWb1oSZIApgSU9QNoB9UZrTN/StdLKmSqgIbCkh4hkTYVn88OlT+V0p4UtiioL1DRvlIHdTo7VER5H19e4pQSUwqrlPZrUwczQ+VPJeaUInRSGNG2bIpHi4fKm9J8fA6Kj1Db1FF7qLwpWqxCqmAKmZpsK7Oo9mgNmfI7v1TdUQhMYV1Jty2qNVqD2JuSfH4mYVF8gtKmhtOh8qc0LYW9FGoHRQ2YOmDK80896lLFHUW71g7qjKkNbvXfXZildtbrnlLmS3O13rRh7l+stuKld5l6C95VZikUdZfU5FJwytwvwW47nCpnqe6VoPsK7A6Z2vGnFI1VG7icpWiwwNEuU4/BPzM4kimKqYlUZGauwNEmU88DKFqrsA+QKXoSvSiKTqi0D5Cpiu6Co2OmXgZQaJ47L3ooSM1rH1y9YuoFBERDWvVQtOVoQRRvK1GN1KEUvWzB2Qem3gEE/rZScOwKE9owOHsdSHEZWWhRqv53D/dT7yEsWjMp+X3EVFHRnn7+AXfPmPoYSGE+MmVKcEYs8xFJ1+Pb+6ltCC2bfpIWRQGlJIik6/H4Clx9mpuCKBk1JeaCr36T1GO9YeoQwkPNApdIhBtDmX7cfuuldmGeMMqnUB4hmG6+jhvMsj4ztQlzhmUlZVSVMOl7n/XFgwrsatz0C2ZbYeoYFtbNuG3Z1N9u6SVXQSgIwnDjjIco4W1IMEqc1BpI1OTuf0t3QoGcMeUJfhv406kusJ03W+tH7KbUBdt5jlNqxKdIkMKLrSdmS6oEbdZyr0oFKbacrWwSYluvv/G9lJyUWs3UHWpnpio49pw6MDVALWbqAbWMqQCOPacSpjqozakIas33Ui1TKdR6I6idfKRqiF2NzhDLv5c6GsVY23PqZpRBrPCRSiB28ZFqIFYatRALjXqILakTxO4+UleIVUY5xAajI8QePlI3iAVGBcQ6oxBiNuug1diihVRoi6CGUGKkXivubKWKIdJG5kjLPjtsLU7ywX7cP9Iaj1wOZVTBAAAAAElFTkSuQmCC"},"319":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAXVBMVEUAAACIiIiIiIiIiIiIiIiHh4eIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiHh4eHh4eJiYmIiIiJiYmJiYmGhoaMjIyIiIiKioqIiIiIiIiJiYmIiIiIiIiHh4eIiIgGfT//AAAAHnRSTlMAilnnZ194bvXufXMguYFUPbJiSjAUpyjar5fe1Mg95g8rAAADrUlEQVR42u3dgXKaQBSF4QMGC4iABcWY5L7/Y7ZmOlFcW3NlWS70fC+w889EyeDuXRARERERTa6IdqvVLiowc0kqn9IEs1bLlxozts/kS7bHfEVyJcJ8beXKFvO1kisrzJf0YL4YYg1DrGGINQyxhiHWMMQahlhjMqRryqYIGVL8XrCDb/WHnB3aUCHtQc4+anhVyh9pHiakTOWPHB51cpGHCMnlohvrbUg+fkg+0tuXTnrWY4espaeDL5U4JU+H6Duk8v5Rd0v0IfoOKeFLI7c244Vs5FYDXwpxS8YK2YijgDeHByWKEH3HAf60qTh+jBHyQxxpC49yUZe4IU91SAlMX+KE6DtywECJ9JjoANbievEZ8iKuNQALJdJjpENb4oZY6QA22hLp0XZscBGg5KePkJ+KjtAl7o+hhjruf0Um+JudXNnhbxLFV3v4EnfDgKmO+yUx7itS+ZIWuC/Wd4QvSeRLYq0DeFGU1Jl8ympFxwsUQpXso+1qtY32Fjvul1R4QqXtCFCStVBrszAdukfxK9ReHz5eXQFKYijFBjruPcZOUDrdebSG55a8QenNRIf7l/EOpfdn/zZHLimhVBrpuC1poNRY6eiXHKB2sNIBVNmgH20vj9MKE2tf5dN60AuN1xbTi09vx1ODJzWn49spBhEREREREZlzPn8u33A+o2557SSVb9KfUQ+5di0qNVTCrb3PREF/Rj3Y2pEoRdAJtfZWlLbQCbX2SpRW0PG69v8QshOlHXS8rv0/fNiLVFTSAjrB1k5EJYFSuLXrTPFIqqE07tru3hH5Bnd/yWOW1yYiIiIiIqLhquj4Xj6/8ax8P0aT7wO82gp4wFMOVrYCLmVzZjzsHOfaynbZpWxgjoeeVjCypTyWviOUjjY2+ScyOMTEsYtk+Kv5yMJBmJ8ezr1VBo4mLeWw2FKO7y3lQOW9jvjB3QoWj7hqOi53K9grURwD792tYO0YuKLj5m4FWyVLGZWwedyhv1shUQ7h4DiRxQ14WQ8buWNmdNBShiAtZSxVPsWgsBx9HN22uGF65ULGG7apODbwH4LNPwdOcgTo4oayVooveH2I+7ji4OJHmmlHSTfwpXO+2geE6B9aHbz5mHLc+gf8qaccgF+P8h9KWoa+kqCEV912mksith1866qyCnttx+8FO9hg8iIVhjDEEIZYwxBrGGINQ6xhiDUMsWYxF83f3K0wXzcbBubr5m6FGUsmn3et9vhuhZk7n1Hn+XMiIiIiMuEXx1NdK+jdN3wAAAAASUVORK5CYII="},"320":function(e,t,o){e.exports={"index":"index-module__index___3bJFD","statusWrap":"index-module__statusWrap___1dt11","statusIcon":"index-module__statusIcon___3Cf94","statusTitle":"index-module__statusTitle___3ZnTM","statusDescription":"index-module__statusDescription___3aSTc","noDataWrap":"index-module__noDataWrap___32on4","noDataIcon":"index-module__noDataIcon___3WrVf","noDataTitle":"index-module__noDataTitle___1t6yu","processListWrap":"index-module__processListWrap___3nj1O","scrollview":"index-module__scrollview___3wvcc","pullRefresh":"index-module__pullRefresh___1F3GN","loadingMore":"index-module__loadingMore___35pAd","loading":"index-module__loading___2nLjY","rotation":"index-module__rotation___2inuQ"}},"353":function(e,t,o){"use strict";o.r(t);var n=o(2),r=o.n(n),a=o(1),i=o(68),s=o(252),c=o(4),u=o(354),l=o(309),p=o(72),f=o(273),d=o(51),v=o(350),m=o(255),h=o(274),y=o(296),_=o(297),b=o.n(_),I=o(318),A=o.n(I),P=o(319),g=o.n(P),S=o(262),j=o(265),E=o(320),w=o.n(E),_slicedToArray=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function sliceIterator(e,t){var o=[],n=!0,r=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(o.push(i.value),!t||o.length!==t);n=!0);}catch(e){r=!0,a=e}finally{try{!n&&s.return&&s.return()}finally{if(r)throw a}}return o}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},O=function(){function defineProperties(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,t,o){return t&&defineProperties(e.prototype,t),o&&defineProperties(e,o),e}}(),T=function get(e,t,o){null===e&&(e=Function.prototype);var n=Object.getOwnPropertyDescriptor(e,t);if(void 0===n){var r=Object.getPrototypeOf(e);return null===r?void 0:get(r,t,o)}if("value"in n)return n.value;var a=n.get;return void 0!==a?a.call(o):void 0};function _asyncToGenerator(e){return function(){var t=e.apply(this,arguments);return new Promise((function(e,o){return function step(n,r){try{var a=t[n](r),i=a.value}catch(e){return void o(e)}if(!a.done)return Promise.resolve(i).then((function(e){step("next",e)}),(function(e){step("throw",e)}));e(i)}("next")}))}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}i.b,i.c,s.c;var x=c.a.navigateTo,C=(u.a,l.a),M=0,W=function(e){function MoveProcess(){var e,t,o;_classCallCheck(this,MoveProcess);for(var n=arguments.length,r=Array(n),a=0;a<n;a++)r[a]=arguments[a];return t=o=_possibleConstructorReturn(this,(e=MoveProcess.__proto__||Object.getPrototypeOf(MoveProcess)).call.apply(e,[this].concat(r))),o.config={"navigationBarTitleText":"移车进程"},_possibleConstructorReturn(o,t)}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{"constructor":{"value":e,"enumerable":!1,"writable":!0,"configurable":!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(MoveProcess,e),O(MoveProcess,[{"key":"render","value":function render(){var e=this,t=this.props,o=t.models,n=t.moveProcessList,i=t.moveProcess,u=t.ocrSave,l=t.carInfoSave,p=t.shareSave,_=t.userInfoSave,I=c.a.useState("tab"),P=_slicedToArray(I,2),E=P[0],O=P[1],T=c.a.useState(!0),W=_slicedToArray(T,2),D=W[0],K=W[1],U=c.a.useState(!0),V=_slicedToArray(U,2),k=V[0],N=V[1],R=c.a.useState(!1),H=_slicedToArray(R,2),Y=H[0],F=H[1],L=c.a.useState(0),B=_slicedToArray(L,2),G=B[0],J=B[1],Q=c.a.useState(0),q=_slicedToArray(Q,2),Z=q[0],X=q[1],z=c.a.useState(1),$=_slicedToArray(z,2),ee=$[0],te=$[1],oe=c.a.useState(0),ne=_slicedToArray(oe,2),re=ne[0],ae=(ne[1],c.a.useState(3)),ie=_slicedToArray(ae,2),se=ie[0],ce=ie[1],ue=c.a.useRouter().params,le=C();le.select("#scroll").boundingClientRect(),le.selectViewport().scrollOffset();var pe,fe,de=function _overLoading(){N(!1),J(0),X(0)},ve=(pe=_asyncToGenerator(r.a.mark((function _callee(t){return r.a.wrap((function _callee$(e){for(;;)switch(e.prev=e.next){case 0:N(!0),i({"current":t,"size":10}).then((function(e){de()}));case 2:case"end":return e.stop()}}),_callee,e)}))),function refresh(e){return pe.apply(this,arguments)}),me=(fe=_asyncToGenerator(r.a.mark((function _callee2(t){return r.a.wrap((function _callee2$(e){for(;;)switch(e.prev=e.next){case 0:G&&(F(!1),te(1),ve(1)),Z?n.length===10*ee?(F(!1),te(ee+1),ve(ee+1)):(F(!0),de()):de();case 2:case"end":return e.stop()}}),_callee2,e)}))),function onTouchEnd(e){return fe.apply(this,arguments)});c.a.useDidShow((function(){i({"current":1,"size":10}).then((function(e){de(),K(!1)}))})),Object(j.a)((function(){Object(S.b)(o)}),[o]),c.a.useEffect((function(){Object(s.a)(),Object(S.a)({"carInfoSave":l,"ocrSave":u,"shareSave":p,"userInfoSave":_})}),[]),c.a.useEffect((function(){O(ue.type)}),[ue]),c.a.useEffect((function(){if("move"===E){if(se>0)return void setTimeout((function(){ce(se-1)}),1e3);O("tab"),ce(3)}}),[se,E]);var he=a.j.createElement(f.a,{"id":"scroll","className":w.a.scrollview,"scrollY":!0,"scrollWithAnimation":!0,"onTouchStart":function onTouchStart(e){M=e.changedTouches[0].clientY},"onTouchEnd":me,"onTouchMove":function onTouchMove(e){var t=e.changedTouches[0].clientY-M;le.exec((function(e){var o=e[1],n=o.scrollTop,r=void 0===n?0:n,a=o.scrollHeight,i=void 0===a?0:a;r<15&&!k&&t>2&&t<55&&J(t),i-r<1e3&&!k&&t>-77&&t<0&&X(t)}))},"style":{"height":"calc(100% + "+(0-Z)+"px)"},"scrollTop":-Z+re},a.j.createElement(d.a,{"className":w.a.pullRefresh,"style":{"marginTop":G-25+"px"}},a.j.createElement(v.a,{"src":g.a,"className":w.a.loading})),n.map((function(e,t){return a.j.createElement(y.a,{"moveProcessItem":e,"hasEvaluate":!0,"onClick":function onClick(){String(t)&&x({"url":"/subPages/moveProcessDetail/index?index="+t})}})})),!Y&&a.j.createElement(d.a,{"className":w.a.loadingMore,"style":{"height":-Z-0+"px"}},a.j.createElement(v.a,{"src":g.a,"className":w.a.loading,"mode":"widthFix"}))),ye=a.j.createElement(d.a,{"className":w.a.noDataWrap},a.j.createElement(v.a,{"src":A.a,"className":w.a.noDataIcon,"mode":"widthFix"}),a.j.createElement(d.a,{"className":w.a.noDataTitle},"暂无移车进程")),_e=a.j.createElement(d.a,{"className":w.a.statusWrap},a.j.createElement(v.a,{"src":b.a,"className":w.a.statusIcon}),a.j.createElement(d.a,{"className":w.a.statusTitle},"移车申请提交成功（",se,"S）！"),a.j.createElement(d.a,{"className":w.a.statusDescription},"常熟12345将为您通知车主，请耐心等待，若车主长时间未处理，请联系110")),be=a.j.createElement(d.a,{"className":w.a.processListWrap},!D&&(0!==n.length?he:ye));return a.j.createElement(d.a,{"className":w.a.index},a.j.createElement(m.a,{"title":"移车进程"}),"move"===E?_e:be,a.j.createElement(h.a,{"current":1}))}},{"key":"componentDidMount","value":function componentDidMount(){T(MoveProcess.prototype.__proto__||Object.getPrototypeOf(MoveProcess.prototype),"componentDidMount",this)&&T(MoveProcess.prototype.__proto__||Object.getPrototypeOf(MoveProcess.prototype),"componentDidMount",this).call(this)}},{"key":"componentDidShow","value":function componentDidShow(){T(MoveProcess.prototype.__proto__||Object.getPrototypeOf(MoveProcess.prototype),"componentDidShow",this)&&T(MoveProcess.prototype.__proto__||Object.getPrototypeOf(MoveProcess.prototype),"componentDidShow",this).call(this)}},{"key":"componentDidHide","value":function componentDidHide(){T(MoveProcess.prototype.__proto__||Object.getPrototypeOf(MoveProcess.prototype),"componentDidHide",this)&&T(MoveProcess.prototype.__proto__||Object.getPrototypeOf(MoveProcess.prototype),"componentDidHide",this).call(this)}}]),MoveProcess}(c.a.Component);W.config={"navigationBarTitleText":"移车进程"};t.default=Object(p.b)((function mapStateToProps(e){var t=e.carInfo;return{"models":{"carInfo":t,"ocr":e.ocr,"share":e.share,"userInfo":e.userInfo},"moveProcessList":t.moveProcessList}}),(function mapDispatchToProps(e){return{"moveProcess":function moveProcess(t){return e({"type":"carInfo/moveProcess","payload":t})},"ocrSave":function ocrSave(t){return e({"type":"ocr/save","payload":t})},"carInfoSave":function carInfoSave(t){return e({"type":"carInfo/save","payload":t})},"shareSave":function shareSave(t){return e({"type":"share/save","payload":t})},"userInfoSave":function userInfoSave(t){return e({"type":"userInfo/save","payload":t})}}}))(W)}}]);