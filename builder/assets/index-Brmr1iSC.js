var Lc={exports:{}},wa={};var fm;function Ip(){if(fm)return wa;fm=1;var i=Symbol.for("react.transitional.element"),u=Symbol.for("react.fragment");function c(o,f,h){var m=null;if(h!==void 0&&(m=""+h),f.key!==void 0&&(m=""+f.key),"key"in f){h={};for(var d in f)d!=="key"&&(h[d]=f[d])}else h=f;return f=h.ref,{$$typeof:i,type:o,key:m,ref:f!==void 0?f:null,props:h}}return wa.Fragment=u,wa.jsx=c,wa.jsxs=c,wa}var dm;function Pp(){return dm||(dm=1,Lc.exports=Ip()),Lc.exports}var g=Pp(),Bc={exports:{}},ue={};var mm;function eh(){if(mm)return ue;mm=1;var i=Symbol.for("react.transitional.element"),u=Symbol.for("react.portal"),c=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),h=Symbol.for("react.consumer"),m=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),v=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),S=Symbol.for("react.activity"),C=Symbol.iterator;function G(T){return T===null||typeof T!="object"?null:(T=C&&T[C]||T["@@iterator"],typeof T=="function"?T:null)}var L={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w=Object.assign,P={};function V(T,k,$){this.props=T,this.context=k,this.refs=P,this.updater=$||L}V.prototype.isReactComponent={},V.prototype.setState=function(T,k){if(typeof T!="object"&&typeof T!="function"&&T!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,T,k,"setState")},V.prototype.forceUpdate=function(T){this.updater.enqueueForceUpdate(this,T,"forceUpdate")};function ne(){}ne.prototype=V.prototype;function de(T,k,$){this.props=T,this.context=k,this.refs=P,this.updater=$||L}var Te=de.prototype=new ne;Te.constructor=de,w(Te,V.prototype),Te.isPureReactComponent=!0;var ge=Array.isArray;function Z(){}var X={H:null,A:null,T:null,S:null},ae=Object.prototype.hasOwnProperty;function Q(T,k,$){var F=$.ref;return{$$typeof:i,type:T,key:k,ref:F!==void 0?F:null,props:$}}function I(T,k){return Q(T.type,k,T.props)}function ie(T){return typeof T=="object"&&T!==null&&T.$$typeof===i}function se(T){var k={"=":"=0",":":"=2"};return"$"+T.replace(/[=:]/g,function($){return k[$]})}var j=/\/+/g;function Y(T,k){return typeof T=="object"&&T!==null&&T.key!=null?se(""+T.key):k.toString(36)}function B(T){switch(T.status){case"fulfilled":return T.value;case"rejected":throw T.reason;default:switch(typeof T.status=="string"?T.then(Z,Z):(T.status="pending",T.then(function(k){T.status==="pending"&&(T.status="fulfilled",T.value=k)},function(k){T.status==="pending"&&(T.status="rejected",T.reason=k)})),T.status){case"fulfilled":return T.value;case"rejected":throw T.reason}}throw T}function M(T,k,$,F,re){var ye=typeof T;(ye==="undefined"||ye==="boolean")&&(T=null);var je=!1;if(T===null)je=!0;else switch(ye){case"bigint":case"string":case"number":je=!0;break;case"object":switch(T.$$typeof){case i:case u:je=!0;break;case x:return je=T._init,M(je(T._payload),k,$,F,re)}}if(je)return re=re(T),je=F===""?"."+Y(T,0):F,ge(re)?($="",je!=null&&($=je.replace(j,"$&/")+"/"),M(re,k,$,"",function(Ll){return Ll})):re!=null&&(ie(re)&&(re=I(re,$+(re.key==null||T&&T.key===re.key?"":(""+re.key).replace(j,"$&/")+"/")+je)),k.push(re)),1;je=0;var tt=F===""?".":F+":";if(ge(T))for(var qe=0;qe<T.length;qe++)F=T[qe],ye=tt+Y(F,qe),je+=M(F,k,$,ye,re);else if(qe=G(T),typeof qe=="function")for(T=qe.call(T),qe=0;!(F=T.next()).done;)F=F.value,ye=tt+Y(F,qe++),je+=M(F,k,$,ye,re);else if(ye==="object"){if(typeof T.then=="function")return M(B(T),k,$,F,re);throw k=String(T),Error("Objects are not valid as a React child (found: "+(k==="[object Object]"?"object with keys {"+Object.keys(T).join(", ")+"}":k)+"). If you meant to render a collection of children, use an array instead.")}return je}function H(T,k,$){if(T==null)return T;var F=[],re=0;return M(T,F,"","",function(ye){return k.call($,ye,re++)}),F}function K(T){if(T._status===-1){var k=T._result;k=k(),k.then(function($){(T._status===0||T._status===-1)&&(T._status=1,T._result=$)},function($){(T._status===0||T._status===-1)&&(T._status=2,T._result=$)}),T._status===-1&&(T._status=0,T._result=k)}if(T._status===1)return T._result.default;throw T._result}var q=typeof reportError=="function"?reportError:function(T){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var k=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof T=="object"&&T!==null&&typeof T.message=="string"?String(T.message):String(T),error:T});if(!window.dispatchEvent(k))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",T);return}console.error(T)},ee={map:H,forEach:function(T,k,$){H(T,function(){k.apply(this,arguments)},$)},count:function(T){var k=0;return H(T,function(){k++}),k},toArray:function(T){return H(T,function(k){return k})||[]},only:function(T){if(!ie(T))throw Error("React.Children.only expected to receive a single React element child.");return T}};return ue.Activity=S,ue.Children=ee,ue.Component=V,ue.Fragment=c,ue.Profiler=f,ue.PureComponent=de,ue.StrictMode=o,ue.Suspense=v,ue.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=X,ue.__COMPILER_RUNTIME={__proto__:null,c:function(T){return X.H.useMemoCache(T)}},ue.cache=function(T){return function(){return T.apply(null,arguments)}},ue.cacheSignal=function(){return null},ue.cloneElement=function(T,k,$){if(T==null)throw Error("The argument must be a React element, but you passed "+T+".");var F=w({},T.props),re=T.key;if(k!=null)for(ye in k.key!==void 0&&(re=""+k.key),k)!ae.call(k,ye)||ye==="key"||ye==="__self"||ye==="__source"||ye==="ref"&&k.ref===void 0||(F[ye]=k[ye]);var ye=arguments.length-2;if(ye===1)F.children=$;else if(1<ye){for(var je=Array(ye),tt=0;tt<ye;tt++)je[tt]=arguments[tt+2];F.children=je}return Q(T.type,re,F)},ue.createContext=function(T){return T={$$typeof:m,_currentValue:T,_currentValue2:T,_threadCount:0,Provider:null,Consumer:null},T.Provider=T,T.Consumer={$$typeof:h,_context:T},T},ue.createElement=function(T,k,$){var F,re={},ye=null;if(k!=null)for(F in k.key!==void 0&&(ye=""+k.key),k)ae.call(k,F)&&F!=="key"&&F!=="__self"&&F!=="__source"&&(re[F]=k[F]);var je=arguments.length-2;if(je===1)re.children=$;else if(1<je){for(var tt=Array(je),qe=0;qe<je;qe++)tt[qe]=arguments[qe+2];re.children=tt}if(T&&T.defaultProps)for(F in je=T.defaultProps,je)re[F]===void 0&&(re[F]=je[F]);return Q(T,ye,re)},ue.createRef=function(){return{current:null}},ue.forwardRef=function(T){return{$$typeof:d,render:T}},ue.isValidElement=ie,ue.lazy=function(T){return{$$typeof:x,_payload:{_status:-1,_result:T},_init:K}},ue.memo=function(T,k){return{$$typeof:p,type:T,compare:k===void 0?null:k}},ue.startTransition=function(T){var k=X.T,$={};X.T=$;try{var F=T(),re=X.S;re!==null&&re($,F),typeof F=="object"&&F!==null&&typeof F.then=="function"&&F.then(Z,q)}catch(ye){q(ye)}finally{k!==null&&$.types!==null&&(k.types=$.types),X.T=k}},ue.unstable_useCacheRefresh=function(){return X.H.useCacheRefresh()},ue.use=function(T){return X.H.use(T)},ue.useActionState=function(T,k,$){return X.H.useActionState(T,k,$)},ue.useCallback=function(T,k){return X.H.useCallback(T,k)},ue.useContext=function(T){return X.H.useContext(T)},ue.useDebugValue=function(){},ue.useDeferredValue=function(T,k){return X.H.useDeferredValue(T,k)},ue.useEffect=function(T,k){return X.H.useEffect(T,k)},ue.useEffectEvent=function(T){return X.H.useEffectEvent(T)},ue.useId=function(){return X.H.useId()},ue.useImperativeHandle=function(T,k,$){return X.H.useImperativeHandle(T,k,$)},ue.useInsertionEffect=function(T,k){return X.H.useInsertionEffect(T,k)},ue.useLayoutEffect=function(T,k){return X.H.useLayoutEffect(T,k)},ue.useMemo=function(T,k){return X.H.useMemo(T,k)},ue.useOptimistic=function(T,k){return X.H.useOptimistic(T,k)},ue.useReducer=function(T,k,$){return X.H.useReducer(T,k,$)},ue.useRef=function(T){return X.H.useRef(T)},ue.useState=function(T){return X.H.useState(T)},ue.useSyncExternalStore=function(T,k,$){return X.H.useSyncExternalStore(T,k,$)},ue.useTransition=function(){return X.H.useTransition()},ue.version="19.2.7",ue}var gm;function ao(){return gm||(gm=1,Bc.exports=eh()),Bc.exports}var ce=ao(),Gc={exports:{}},Ra={},Yc={exports:{}},Zc={};var ym;function th(){return ym||(ym=1,(function(i){function u(M,H){var K=M.length;M.push(H);e:for(;0<K;){var q=K-1>>>1,ee=M[q];if(0<f(ee,H))M[q]=H,M[K]=ee,K=q;else break e}}function c(M){return M.length===0?null:M[0]}function o(M){if(M.length===0)return null;var H=M[0],K=M.pop();if(K!==H){M[0]=K;e:for(var q=0,ee=M.length,T=ee>>>1;q<T;){var k=2*(q+1)-1,$=M[k],F=k+1,re=M[F];if(0>f($,K))F<ee&&0>f(re,$)?(M[q]=re,M[F]=K,q=F):(M[q]=$,M[k]=K,q=k);else if(F<ee&&0>f(re,K))M[q]=re,M[F]=K,q=F;else break e}}return H}function f(M,H){var K=M.sortIndex-H.sortIndex;return K!==0?K:M.id-H.id}if(i.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var h=performance;i.unstable_now=function(){return h.now()}}else{var m=Date,d=m.now();i.unstable_now=function(){return m.now()-d}}var v=[],p=[],x=1,S=null,C=3,G=!1,L=!1,w=!1,P=!1,V=typeof setTimeout=="function"?setTimeout:null,ne=typeof clearTimeout=="function"?clearTimeout:null,de=typeof setImmediate<"u"?setImmediate:null;function Te(M){for(var H=c(p);H!==null;){if(H.callback===null)o(p);else if(H.startTime<=M)o(p),H.sortIndex=H.expirationTime,u(v,H);else break;H=c(p)}}function ge(M){if(w=!1,Te(M),!L)if(c(v)!==null)L=!0,Z||(Z=!0,se());else{var H=c(p);H!==null&&B(ge,H.startTime-M)}}var Z=!1,X=-1,ae=5,Q=-1;function I(){return P?!0:!(i.unstable_now()-Q<ae)}function ie(){if(P=!1,Z){var M=i.unstable_now();Q=M;var H=!0;try{e:{L=!1,w&&(w=!1,ne(X),X=-1),G=!0;var K=C;try{t:{for(Te(M),S=c(v);S!==null&&!(S.expirationTime>M&&I());){var q=S.callback;if(typeof q=="function"){S.callback=null,C=S.priorityLevel;var ee=q(S.expirationTime<=M);if(M=i.unstable_now(),typeof ee=="function"){S.callback=ee,Te(M),H=!0;break t}S===c(v)&&o(v),Te(M)}else o(v);S=c(v)}if(S!==null)H=!0;else{var T=c(p);T!==null&&B(ge,T.startTime-M),H=!1}}break e}finally{S=null,C=K,G=!1}H=void 0}}finally{H?se():Z=!1}}}var se;if(typeof de=="function")se=function(){de(ie)};else if(typeof MessageChannel<"u"){var j=new MessageChannel,Y=j.port2;j.port1.onmessage=ie,se=function(){Y.postMessage(null)}}else se=function(){V(ie,0)};function B(M,H){X=V(function(){M(i.unstable_now())},H)}i.unstable_IdlePriority=5,i.unstable_ImmediatePriority=1,i.unstable_LowPriority=4,i.unstable_NormalPriority=3,i.unstable_Profiling=null,i.unstable_UserBlockingPriority=2,i.unstable_cancelCallback=function(M){M.callback=null},i.unstable_forceFrameRate=function(M){0>M||125<M?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ae=0<M?Math.floor(1e3/M):5},i.unstable_getCurrentPriorityLevel=function(){return C},i.unstable_next=function(M){switch(C){case 1:case 2:case 3:var H=3;break;default:H=C}var K=C;C=H;try{return M()}finally{C=K}},i.unstable_requestPaint=function(){P=!0},i.unstable_runWithPriority=function(M,H){switch(M){case 1:case 2:case 3:case 4:case 5:break;default:M=3}var K=C;C=M;try{return H()}finally{C=K}},i.unstable_scheduleCallback=function(M,H,K){var q=i.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?q+K:q):K=q,M){case 1:var ee=-1;break;case 2:ee=250;break;case 5:ee=1073741823;break;case 4:ee=1e4;break;default:ee=5e3}return ee=K+ee,M={id:x++,callback:H,priorityLevel:M,startTime:K,expirationTime:ee,sortIndex:-1},K>q?(M.sortIndex=K,u(p,M),c(v)===null&&M===c(p)&&(w?(ne(X),X=-1):w=!0,B(ge,K-q))):(M.sortIndex=ee,u(v,M),L||G||(L=!0,Z||(Z=!0,se()))),M},i.unstable_shouldYield=I,i.unstable_wrapCallback=function(M){var H=C;return function(){var K=C;C=H;try{return M.apply(this,arguments)}finally{C=K}}}})(Zc)),Zc}var pm;function nh(){return pm||(pm=1,Yc.exports=th()),Yc.exports}var Xc={exports:{}},et={};var hm;function lh(){if(hm)return et;hm=1;var i=ao();function u(v){var p="https://react.dev/errors/"+v;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var x=2;x<arguments.length;x++)p+="&args[]="+encodeURIComponent(arguments[x])}return"Minified React error #"+v+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function c(){}var o={d:{f:c,r:function(){throw Error(u(522))},D:c,C:c,L:c,m:c,X:c,S:c,M:c},p:0,findDOMNode:null},f=Symbol.for("react.portal");function h(v,p,x){var S=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:f,key:S==null?null:""+S,children:v,containerInfo:p,implementation:x}}var m=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(v,p){if(v==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return et.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=o,et.createPortal=function(v,p){var x=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(u(299));return h(v,p,null,x)},et.flushSync=function(v){var p=m.T,x=o.p;try{if(m.T=null,o.p=2,v)return v()}finally{m.T=p,o.p=x,o.d.f()}},et.preconnect=function(v,p){typeof v=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,o.d.C(v,p))},et.prefetchDNS=function(v){typeof v=="string"&&o.d.D(v)},et.preinit=function(v,p){if(typeof v=="string"&&p&&typeof p.as=="string"){var x=p.as,S=d(x,p.crossOrigin),C=typeof p.integrity=="string"?p.integrity:void 0,G=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;x==="style"?o.d.S(v,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:S,integrity:C,fetchPriority:G}):x==="script"&&o.d.X(v,{crossOrigin:S,integrity:C,fetchPriority:G,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},et.preinitModule=function(v,p){if(typeof v=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var x=d(p.as,p.crossOrigin);o.d.M(v,{crossOrigin:x,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&o.d.M(v)},et.preload=function(v,p){if(typeof v=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var x=p.as,S=d(x,p.crossOrigin);o.d.L(v,x,{crossOrigin:S,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},et.preloadModule=function(v,p){if(typeof v=="string")if(p){var x=d(p.as,p.crossOrigin);o.d.m(v,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:x,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else o.d.m(v)},et.requestFormReset=function(v){o.d.r(v)},et.unstable_batchedUpdates=function(v,p){return v(p)},et.useFormState=function(v,p,x){return m.H.useFormState(v,p,x)},et.useFormStatus=function(){return m.H.useHostTransitionStatus()},et.version="19.2.7",et}var vm;function ah(){if(vm)return Xc.exports;vm=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(u){console.error(u)}}return i(),Xc.exports=lh(),Xc.exports}var bm;function ih(){if(bm)return Ra;bm=1;var i=nh(),u=ao(),c=ah();function o(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function f(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function h(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function m(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function d(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function v(e){if(h(e)!==e)throw Error(o(188))}function p(e){var t=e.alternate;if(!t){if(t=h(e),t===null)throw Error(o(188));return t!==e?null:e}for(var n=e,l=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(l=a.return,l!==null){n=l;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return v(a),e;if(s===l)return v(a),t;s=s.sibling}throw Error(o(188))}if(n.return!==l.return)n=a,l=s;else{for(var r=!1,y=a.child;y;){if(y===n){r=!0,n=a,l=s;break}if(y===l){r=!0,l=a,n=s;break}y=y.sibling}if(!r){for(y=s.child;y;){if(y===n){r=!0,n=s,l=a;break}if(y===l){r=!0,l=s,n=a;break}y=y.sibling}if(!r)throw Error(o(189))}}if(n.alternate!==l)throw Error(o(190))}if(n.tag!==3)throw Error(o(188));return n.stateNode.current===n?e:t}function x(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=x(e),t!==null)return t;e=e.sibling}return null}var S=Object.assign,C=Symbol.for("react.element"),G=Symbol.for("react.transitional.element"),L=Symbol.for("react.portal"),w=Symbol.for("react.fragment"),P=Symbol.for("react.strict_mode"),V=Symbol.for("react.profiler"),ne=Symbol.for("react.consumer"),de=Symbol.for("react.context"),Te=Symbol.for("react.forward_ref"),ge=Symbol.for("react.suspense"),Z=Symbol.for("react.suspense_list"),X=Symbol.for("react.memo"),ae=Symbol.for("react.lazy"),Q=Symbol.for("react.activity"),I=Symbol.for("react.memo_cache_sentinel"),ie=Symbol.iterator;function se(e){return e===null||typeof e!="object"?null:(e=ie&&e[ie]||e["@@iterator"],typeof e=="function"?e:null)}var j=Symbol.for("react.client.reference");function Y(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===j?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case w:return"Fragment";case V:return"Profiler";case P:return"StrictMode";case ge:return"Suspense";case Z:return"SuspenseList";case Q:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case L:return"Portal";case de:return e.displayName||"Context";case ne:return(e._context.displayName||"Context")+".Consumer";case Te:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case X:return t=e.displayName||null,t!==null?t:Y(e.type)||"Memo";case ae:t=e._payload,e=e._init;try{return Y(e(t))}catch{}}return null}var B=Array.isArray,M=u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,H=c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,K={pending:!1,data:null,method:null,action:null},q=[],ee=-1;function T(e){return{current:e}}function k(e){0>ee||(e.current=q[ee],q[ee]=null,ee--)}function $(e,t){ee++,q[ee]=e.current,e.current=t}var F=T(null),re=T(null),ye=T(null),je=T(null);function tt(e,t){switch($(ye,t),$(re,e),$(F,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Rd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Rd(t),e=Ud(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}k(F),$(F,e)}function qe(){k(F),k(re),k(ye)}function Ll(e){e.memoizedState!==null&&$(je,e);var t=F.current,n=Ud(t,e.type);t!==n&&($(re,e),$(F,n))}function Za(e){re.current===e&&(k(F),k(re)),je.current===e&&(k(je),Da._currentValue=K)}var xs,co;function wn(e){if(xs===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);xs=t&&t[1]||"",co=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+xs+e+co}var Es=!1;function Os(e,t){if(!e||Es)return"";Es=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var U=function(){throw Error()};if(Object.defineProperty(U.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(U,[])}catch(z){var D=z}Reflect.construct(e,[],U)}else{try{U.call()}catch(z){D=z}e.call(U.prototype)}}else{try{throw Error()}catch(z){D=z}(U=e())&&typeof U.catch=="function"&&U.catch(function(){})}}catch(z){if(z&&D&&typeof z.stack=="string")return[z.stack,D.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var s=l.DetermineComponentFrameRoot(),r=s[0],y=s[1];if(r&&y){var b=r.split(`
`),N=y.split(`
`);for(a=l=0;l<b.length&&!b[l].includes("DetermineComponentFrameRoot");)l++;for(;a<N.length&&!N[a].includes("DetermineComponentFrameRoot");)a++;if(l===b.length||a===N.length)for(l=b.length-1,a=N.length-1;1<=l&&0<=a&&b[l]!==N[a];)a--;for(;1<=l&&0<=a;l--,a--)if(b[l]!==N[a]){if(l!==1||a!==1)do if(l--,a--,0>a||b[l]!==N[a]){var _=`
`+b[l].replace(" at new "," at ");return e.displayName&&_.includes("<anonymous>")&&(_=_.replace("<anonymous>",e.displayName)),_}while(1<=l&&0<=a);break}}}finally{Es=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?wn(n):""}function Dg(e,t){switch(e.tag){case 26:case 27:case 5:return wn(e.type);case 16:return wn("Lazy");case 13:return e.child!==t&&t!==null?wn("Suspense Fallback"):wn("Suspense");case 19:return wn("SuspenseList");case 0:case 15:return Os(e.type,!1);case 11:return Os(e.type.render,!1);case 1:return Os(e.type,!0);case 31:return wn("Activity");default:return""}}function oo(e){try{var t="",n=null;do t+=Dg(e,n),n=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var js=Object.prototype.hasOwnProperty,As=i.unstable_scheduleCallback,Ns=i.unstable_cancelCallback,zg=i.unstable_shouldYield,Cg=i.unstable_requestPaint,ft=i.unstable_now,_g=i.unstable_getCurrentPriorityLevel,ro=i.unstable_ImmediatePriority,fo=i.unstable_UserBlockingPriority,Xa=i.unstable_NormalPriority,wg=i.unstable_LowPriority,mo=i.unstable_IdlePriority,Rg=i.log,Ug=i.unstable_setDisableYieldValue,Bl=null,dt=null;function sn(e){if(typeof Rg=="function"&&Ug(e),dt&&typeof dt.setStrictMode=="function")try{dt.setStrictMode(Bl,e)}catch{}}var mt=Math.clz32?Math.clz32:Hg,kg=Math.log,qg=Math.LN2;function Hg(e){return e>>>=0,e===0?32:31-(kg(e)/qg|0)|0}var Qa=256,$a=262144,Ka=4194304;function Rn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Ja(e,t,n){var l=e.pendingLanes;if(l===0)return 0;var a=0,s=e.suspendedLanes,r=e.pingedLanes;e=e.warmLanes;var y=l&134217727;return y!==0?(l=y&~s,l!==0?a=Rn(l):(r&=y,r!==0?a=Rn(r):n||(n=y&~e,n!==0&&(a=Rn(n))))):(y=l&~s,y!==0?a=Rn(y):r!==0?a=Rn(r):n||(n=l&~e,n!==0&&(a=Rn(n)))),a===0?0:t!==0&&t!==a&&(t&s)===0&&(s=a&-a,n=t&-t,s>=n||s===32&&(n&4194048)!==0)?t:a}function Gl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Vg(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function go(){var e=Ka;return Ka<<=1,(Ka&62914560)===0&&(Ka=4194304),e}function Ms(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Yl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Lg(e,t,n,l,a,s){var r=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var y=e.entanglements,b=e.expirationTimes,N=e.hiddenUpdates;for(n=r&~n;0<n;){var _=31-mt(n),U=1<<_;y[_]=0,b[_]=-1;var D=N[_];if(D!==null)for(N[_]=null,_=0;_<D.length;_++){var z=D[_];z!==null&&(z.lane&=-536870913)}n&=~U}l!==0&&yo(e,l,0),s!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=s&~(r&~t))}function yo(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-mt(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|n&261930}function po(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var l=31-mt(n),a=1<<l;a&t|e[l]&t&&(e[l]|=t),n&=~a}}function ho(e,t){var n=t&-t;return n=(n&42)!==0?1:Ds(n),(n&(e.suspendedLanes|t))!==0?0:n}function Ds(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function zs(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function vo(){var e=H.p;return e!==0?e:(e=window.event,e===void 0?32:am(e.type))}function bo(e,t){var n=H.p;try{return H.p=e,t()}finally{H.p=n}}var un=Math.random().toString(36).slice(2),Je="__reactFiber$"+un,at="__reactProps$"+un,nl="__reactContainer$"+un,Cs="__reactEvents$"+un,Bg="__reactListeners$"+un,Gg="__reactHandles$"+un,So="__reactResources$"+un,Zl="__reactMarker$"+un;function _s(e){delete e[Je],delete e[at],delete e[Cs],delete e[Bg],delete e[Gg]}function ll(e){var t=e[Je];if(t)return t;for(var n=e.parentNode;n;){if(t=n[nl]||n[Je]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Gd(e);e!==null;){if(n=e[Je])return n;e=Gd(e)}return t}e=n,n=e.parentNode}return null}function al(e){if(e=e[Je]||e[nl]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Xl(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(o(33))}function il(e){var t=e[So];return t||(t=e[So]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Qe(e){e[Zl]=!0}var To=new Set,xo={};function Un(e,t){sl(e,t),sl(e+"Capture",t)}function sl(e,t){for(xo[e]=t,e=0;e<t.length;e++)To.add(t[e])}var Yg=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Eo={},Oo={};function Zg(e){return js.call(Oo,e)?!0:js.call(Eo,e)?!1:Yg.test(e)?Oo[e]=!0:(Eo[e]=!0,!1)}function Fa(e,t,n){if(Zg(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Wa(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function Bt(e,t,n,l){if(l===null)e.removeAttribute(n);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+l)}}function xt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function jo(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Xg(e,t,n){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var a=l.get,s=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(r){n=""+r,s.call(this,r)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return n},setValue:function(r){n=""+r},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ws(e){if(!e._valueTracker){var t=jo(e)?"checked":"value";e._valueTracker=Xg(e,t,""+e[t])}}function Ao(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),l="";return e&&(l=jo(e)?e.checked?"true":"false":e.value),e=l,e!==n?(t.setValue(e),!0):!1}function Ia(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Qg=/[\n"\\]/g;function Et(e){return e.replace(Qg,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Rs(e,t,n,l,a,s,r,y){e.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.type=r:e.removeAttribute("type"),t!=null?r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+xt(t)):e.value!==""+xt(t)&&(e.value=""+xt(t)):r!=="submit"&&r!=="reset"||e.removeAttribute("value"),t!=null?Us(e,r,xt(t)):n!=null?Us(e,r,xt(n)):l!=null&&e.removeAttribute("value"),a==null&&s!=null&&(e.defaultChecked=!!s),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),y!=null&&typeof y!="function"&&typeof y!="symbol"&&typeof y!="boolean"?e.name=""+xt(y):e.removeAttribute("name")}function No(e,t,n,l,a,s,r,y){if(s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"&&(e.type=s),t!=null||n!=null){if(!(s!=="submit"&&s!=="reset"||t!=null)){ws(e);return}n=n!=null?""+xt(n):"",t=t!=null?""+xt(t):n,y||t===e.value||(e.value=t),e.defaultValue=t}l=l??a,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=y?e.checked:!!l,e.defaultChecked=!!l,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.name=r),ws(e)}function Us(e,t,n){t==="number"&&Ia(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function ul(e,t,n,l){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&l&&(e[n].defaultSelected=!0)}else{for(n=""+xt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,l&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function Mo(e,t,n){if(t!=null&&(t=""+xt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+xt(n):""}function Do(e,t,n,l){if(t==null){if(l!=null){if(n!=null)throw Error(o(92));if(B(l)){if(1<l.length)throw Error(o(93));l=l[0]}n=l}n==null&&(n=""),t=n}n=xt(t),e.defaultValue=n,l=e.textContent,l===n&&l!==""&&l!==null&&(e.value=l),ws(e)}function cl(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var $g=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function zo(e,t,n){var l=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,n):typeof n!="number"||n===0||$g.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Co(e,t,n){if(t!=null&&typeof t!="object")throw Error(o(62));if(e=e.style,n!=null){for(var l in n)!n.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var a in t)l=t[a],t.hasOwnProperty(a)&&n[a]!==l&&zo(e,a,l)}else for(var s in t)t.hasOwnProperty(s)&&zo(e,s,t[s])}function ks(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Kg=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Jg=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Pa(e){return Jg.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Gt(){}var qs=null;function Hs(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ol=null,rl=null;function _o(e){var t=al(e);if(t&&(e=t.stateNode)){var n=e[at]||null;e:switch(e=t.stateNode,t.type){case"input":if(Rs(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+Et(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var l=n[t];if(l!==e&&l.form===e.form){var a=l[at]||null;if(!a)throw Error(o(90));Rs(l,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)l=n[t],l.form===e.form&&Ao(l)}break e;case"textarea":Mo(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&ul(e,!!n.multiple,t,!1)}}}var Vs=!1;function wo(e,t,n){if(Vs)return e(t,n);Vs=!0;try{var l=e(t);return l}finally{if(Vs=!1,(ol!==null||rl!==null)&&(Li(),ol&&(t=ol,e=rl,rl=ol=null,_o(t),e)))for(t=0;t<e.length;t++)_o(e[t])}}function Ql(e,t){var n=e.stateNode;if(n===null)return null;var l=n[at]||null;if(l===null)return null;n=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(o(231,t,typeof n));return n}var Yt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ls=!1;if(Yt)try{var $l={};Object.defineProperty($l,"passive",{get:function(){Ls=!0}}),window.addEventListener("test",$l,$l),window.removeEventListener("test",$l,$l)}catch{Ls=!1}var cn=null,Bs=null,ei=null;function Ro(){if(ei)return ei;var e,t=Bs,n=t.length,l,a="value"in cn?cn.value:cn.textContent,s=a.length;for(e=0;e<n&&t[e]===a[e];e++);var r=n-e;for(l=1;l<=r&&t[n-l]===a[s-l];l++);return ei=a.slice(e,1<l?1-l:void 0)}function ti(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ni(){return!0}function Uo(){return!1}function it(e){function t(n,l,a,s,r){this._reactName=n,this._targetInst=a,this.type=l,this.nativeEvent=s,this.target=r,this.currentTarget=null;for(var y in e)e.hasOwnProperty(y)&&(n=e[y],this[y]=n?n(s):s[y]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ni:Uo,this.isPropagationStopped=Uo,this}return S(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ni)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ni)},persist:function(){},isPersistent:ni}),t}var kn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},li=it(kn),Kl=S({},kn,{view:0,detail:0}),Fg=it(Kl),Gs,Ys,Jl,ai=S({},Kl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Xs,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Jl&&(Jl&&e.type==="mousemove"?(Gs=e.screenX-Jl.screenX,Ys=e.screenY-Jl.screenY):Ys=Gs=0,Jl=e),Gs)},movementY:function(e){return"movementY"in e?e.movementY:Ys}}),ko=it(ai),Wg=S({},ai,{dataTransfer:0}),Ig=it(Wg),Pg=S({},Kl,{relatedTarget:0}),Zs=it(Pg),ey=S({},kn,{animationName:0,elapsedTime:0,pseudoElement:0}),ty=it(ey),ny=S({},kn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ly=it(ny),ay=S({},kn,{data:0}),qo=it(ay),iy={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},sy={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},uy={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function cy(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=uy[e])?!!t[e]:!1}function Xs(){return cy}var oy=S({},Kl,{key:function(e){if(e.key){var t=iy[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ti(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?sy[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Xs,charCode:function(e){return e.type==="keypress"?ti(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ti(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),ry=it(oy),fy=S({},ai,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ho=it(fy),dy=S({},Kl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Xs}),my=it(dy),gy=S({},kn,{propertyName:0,elapsedTime:0,pseudoElement:0}),yy=it(gy),py=S({},ai,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),hy=it(py),vy=S({},kn,{newState:0,oldState:0}),by=it(vy),Sy=[9,13,27,32],Qs=Yt&&"CompositionEvent"in window,Fl=null;Yt&&"documentMode"in document&&(Fl=document.documentMode);var Ty=Yt&&"TextEvent"in window&&!Fl,Vo=Yt&&(!Qs||Fl&&8<Fl&&11>=Fl),Lo=" ",Bo=!1;function Go(e,t){switch(e){case"keyup":return Sy.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Yo(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var fl=!1;function xy(e,t){switch(e){case"compositionend":return Yo(t);case"keypress":return t.which!==32?null:(Bo=!0,Lo);case"textInput":return e=t.data,e===Lo&&Bo?null:e;default:return null}}function Ey(e,t){if(fl)return e==="compositionend"||!Qs&&Go(e,t)?(e=Ro(),ei=Bs=cn=null,fl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Vo&&t.locale!=="ko"?null:t.data;default:return null}}var Oy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Zo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Oy[e.type]:t==="textarea"}function Xo(e,t,n,l){ol?rl?rl.push(l):rl=[l]:ol=l,t=$i(t,"onChange"),0<t.length&&(n=new li("onChange","change",null,n,l),e.push({event:n,listeners:t}))}var Wl=null,Il=null;function jy(e){Md(e,0)}function ii(e){var t=Xl(e);if(Ao(t))return e}function Qo(e,t){if(e==="change")return t}var $o=!1;if(Yt){var $s;if(Yt){var Ks="oninput"in document;if(!Ks){var Ko=document.createElement("div");Ko.setAttribute("oninput","return;"),Ks=typeof Ko.oninput=="function"}$s=Ks}else $s=!1;$o=$s&&(!document.documentMode||9<document.documentMode)}function Jo(){Wl&&(Wl.detachEvent("onpropertychange",Fo),Il=Wl=null)}function Fo(e){if(e.propertyName==="value"&&ii(Il)){var t=[];Xo(t,Il,e,Hs(e)),wo(jy,t)}}function Ay(e,t,n){e==="focusin"?(Jo(),Wl=t,Il=n,Wl.attachEvent("onpropertychange",Fo)):e==="focusout"&&Jo()}function Ny(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ii(Il)}function My(e,t){if(e==="click")return ii(t)}function Dy(e,t){if(e==="input"||e==="change")return ii(t)}function zy(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var gt=typeof Object.is=="function"?Object.is:zy;function Pl(e,t){if(gt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),l=Object.keys(t);if(n.length!==l.length)return!1;for(l=0;l<n.length;l++){var a=n[l];if(!js.call(t,a)||!gt(e[a],t[a]))return!1}return!0}function Wo(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Io(e,t){var n=Wo(e);e=0;for(var l;n;){if(n.nodeType===3){if(l=e+n.textContent.length,e<=t&&l>=t)return{node:n,offset:t-e};e=l}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Wo(n)}}function Po(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Po(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function er(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Ia(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Ia(e.document)}return t}function Js(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Cy=Yt&&"documentMode"in document&&11>=document.documentMode,dl=null,Fs=null,ea=null,Ws=!1;function tr(e,t,n){var l=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ws||dl==null||dl!==Ia(l)||(l=dl,"selectionStart"in l&&Js(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),ea&&Pl(ea,l)||(ea=l,l=$i(Fs,"onSelect"),0<l.length&&(t=new li("onSelect","select",null,t,n),e.push({event:t,listeners:l}),t.target=dl)))}function qn(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var ml={animationend:qn("Animation","AnimationEnd"),animationiteration:qn("Animation","AnimationIteration"),animationstart:qn("Animation","AnimationStart"),transitionrun:qn("Transition","TransitionRun"),transitionstart:qn("Transition","TransitionStart"),transitioncancel:qn("Transition","TransitionCancel"),transitionend:qn("Transition","TransitionEnd")},Is={},nr={};Yt&&(nr=document.createElement("div").style,"AnimationEvent"in window||(delete ml.animationend.animation,delete ml.animationiteration.animation,delete ml.animationstart.animation),"TransitionEvent"in window||delete ml.transitionend.transition);function Hn(e){if(Is[e])return Is[e];if(!ml[e])return e;var t=ml[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in nr)return Is[e]=t[n];return e}var lr=Hn("animationend"),ar=Hn("animationiteration"),ir=Hn("animationstart"),_y=Hn("transitionrun"),wy=Hn("transitionstart"),Ry=Hn("transitioncancel"),sr=Hn("transitionend"),ur=new Map,Ps="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Ps.push("scrollEnd");function wt(e,t){ur.set(e,t),Un(t,[e])}var si=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Ot=[],gl=0,eu=0;function ui(){for(var e=gl,t=eu=gl=0;t<e;){var n=Ot[t];Ot[t++]=null;var l=Ot[t];Ot[t++]=null;var a=Ot[t];Ot[t++]=null;var s=Ot[t];if(Ot[t++]=null,l!==null&&a!==null){var r=l.pending;r===null?a.next=a:(a.next=r.next,r.next=a),l.pending=a}s!==0&&cr(n,a,s)}}function ci(e,t,n,l){Ot[gl++]=e,Ot[gl++]=t,Ot[gl++]=n,Ot[gl++]=l,eu|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function tu(e,t,n,l){return ci(e,t,n,l),oi(e)}function Vn(e,t){return ci(e,null,null,t),oi(e)}function cr(e,t,n){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n);for(var a=!1,s=e.return;s!==null;)s.childLanes|=n,l=s.alternate,l!==null&&(l.childLanes|=n),s.tag===22&&(e=s.stateNode,e===null||e._visibility&1||(a=!0)),e=s,s=s.return;return e.tag===3?(s=e.stateNode,a&&t!==null&&(a=31-mt(n),e=s.hiddenUpdates,l=e[a],l===null?e[a]=[t]:l.push(t),t.lane=n|536870912),s):null}function oi(e){if(50<xa)throw xa=0,rc=null,Error(o(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var yl={};function Uy(e,t,n,l){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function yt(e,t,n,l){return new Uy(e,t,n,l)}function nu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Zt(e,t){var n=e.alternate;return n===null?(n=yt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function or(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function ri(e,t,n,l,a,s){var r=0;if(l=e,typeof e=="function")nu(e)&&(r=1);else if(typeof e=="string")r=Lp(e,n,F.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case Q:return e=yt(31,n,t,a),e.elementType=Q,e.lanes=s,e;case w:return Ln(n.children,a,s,t);case P:r=8,a|=24;break;case V:return e=yt(12,n,t,a|2),e.elementType=V,e.lanes=s,e;case ge:return e=yt(13,n,t,a),e.elementType=ge,e.lanes=s,e;case Z:return e=yt(19,n,t,a),e.elementType=Z,e.lanes=s,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case de:r=10;break e;case ne:r=9;break e;case Te:r=11;break e;case X:r=14;break e;case ae:r=16,l=null;break e}r=29,n=Error(o(130,e===null?"null":typeof e,"")),l=null}return t=yt(r,n,t,a),t.elementType=e,t.type=l,t.lanes=s,t}function Ln(e,t,n,l){return e=yt(7,e,l,t),e.lanes=n,e}function lu(e,t,n){return e=yt(6,e,null,t),e.lanes=n,e}function rr(e){var t=yt(18,null,null,0);return t.stateNode=e,t}function au(e,t,n){return t=yt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var fr=new WeakMap;function jt(e,t){if(typeof e=="object"&&e!==null){var n=fr.get(e);return n!==void 0?n:(t={value:e,source:t,stack:oo(t)},fr.set(e,t),t)}return{value:e,source:t,stack:oo(t)}}var pl=[],hl=0,fi=null,ta=0,At=[],Nt=0,on=null,kt=1,qt="";function Xt(e,t){pl[hl++]=ta,pl[hl++]=fi,fi=e,ta=t}function dr(e,t,n){At[Nt++]=kt,At[Nt++]=qt,At[Nt++]=on,on=e;var l=kt;e=qt;var a=32-mt(l)-1;l&=~(1<<a),n+=1;var s=32-mt(t)+a;if(30<s){var r=a-a%5;s=(l&(1<<r)-1).toString(32),l>>=r,a-=r,kt=1<<32-mt(t)+a|n<<a|l,qt=s+e}else kt=1<<s|n<<a|l,qt=e}function iu(e){e.return!==null&&(Xt(e,1),dr(e,1,0))}function su(e){for(;e===fi;)fi=pl[--hl],pl[hl]=null,ta=pl[--hl],pl[hl]=null;for(;e===on;)on=At[--Nt],At[Nt]=null,qt=At[--Nt],At[Nt]=null,kt=At[--Nt],At[Nt]=null}function mr(e,t){At[Nt++]=kt,At[Nt++]=qt,At[Nt++]=on,kt=t.id,qt=t.overflow,on=e}var Fe=null,_e=null,Se=!1,rn=null,Mt=!1,uu=Error(o(519));function fn(e){var t=Error(o(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw na(jt(t,e)),uu}function gr(e){var t=e.stateNode,n=e.type,l=e.memoizedProps;switch(t[Je]=e,t[at]=l,n){case"dialog":he("cancel",t),he("close",t);break;case"iframe":case"object":case"embed":he("load",t);break;case"video":case"audio":for(n=0;n<Oa.length;n++)he(Oa[n],t);break;case"source":he("error",t);break;case"img":case"image":case"link":he("error",t),he("load",t);break;case"details":he("toggle",t);break;case"input":he("invalid",t),No(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":he("invalid",t);break;case"textarea":he("invalid",t),Do(t,l.value,l.defaultValue,l.children)}n=l.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||l.suppressHydrationWarning===!0||_d(t.textContent,n)?(l.popover!=null&&(he("beforetoggle",t),he("toggle",t)),l.onScroll!=null&&he("scroll",t),l.onScrollEnd!=null&&he("scrollend",t),l.onClick!=null&&(t.onclick=Gt),t=!0):t=!1,t||fn(e,!0)}function yr(e){for(Fe=e.return;Fe;)switch(Fe.tag){case 5:case 31:case 13:Mt=!1;return;case 27:case 3:Mt=!0;return;default:Fe=Fe.return}}function vl(e){if(e!==Fe)return!1;if(!Se)return yr(e),Se=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||jc(e.type,e.memoizedProps)),n=!n),n&&_e&&fn(e),yr(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));_e=Bd(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));_e=Bd(e)}else t===27?(t=_e,jn(e.type)?(e=zc,zc=null,_e=e):_e=t):_e=Fe?zt(e.stateNode.nextSibling):null;return!0}function Bn(){_e=Fe=null,Se=!1}function cu(){var e=rn;return e!==null&&(ot===null?ot=e:ot.push.apply(ot,e),rn=null),e}function na(e){rn===null?rn=[e]:rn.push(e)}var ou=T(null),Gn=null,Qt=null;function dn(e,t,n){$(ou,t._currentValue),t._currentValue=n}function $t(e){e._currentValue=ou.current,k(ou)}function ru(e,t,n){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===n)break;e=e.return}}function fu(e,t,n,l){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var s=a.dependencies;if(s!==null){var r=a.child;s=s.firstContext;e:for(;s!==null;){var y=s;s=a;for(var b=0;b<t.length;b++)if(y.context===t[b]){s.lanes|=n,y=s.alternate,y!==null&&(y.lanes|=n),ru(s.return,n,e),l||(r=null);break e}s=y.next}}else if(a.tag===18){if(r=a.return,r===null)throw Error(o(341));r.lanes|=n,s=r.alternate,s!==null&&(s.lanes|=n),ru(r,n,e),r=null}else r=a.child;if(r!==null)r.return=a;else for(r=a;r!==null;){if(r===e){r=null;break}if(a=r.sibling,a!==null){a.return=r.return,r=a;break}r=r.return}a=r}}function bl(e,t,n,l){e=null;for(var a=t,s=!1;a!==null;){if(!s){if((a.flags&524288)!==0)s=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var r=a.alternate;if(r===null)throw Error(o(387));if(r=r.memoizedProps,r!==null){var y=a.type;gt(a.pendingProps.value,r.value)||(e!==null?e.push(y):e=[y])}}else if(a===je.current){if(r=a.alternate,r===null)throw Error(o(387));r.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(Da):e=[Da])}a=a.return}e!==null&&fu(t,e,n,l),t.flags|=262144}function di(e){for(e=e.firstContext;e!==null;){if(!gt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Yn(e){Gn=e,Qt=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function We(e){return pr(Gn,e)}function mi(e,t){return Gn===null&&Yn(e),pr(e,t)}function pr(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Qt===null){if(e===null)throw Error(o(308));Qt=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Qt=Qt.next=t;return n}var ky=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},qy=i.unstable_scheduleCallback,Hy=i.unstable_NormalPriority,Le={$$typeof:de,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function du(){return{controller:new ky,data:new Map,refCount:0}}function la(e){e.refCount--,e.refCount===0&&qy(Hy,function(){e.controller.abort()})}var aa=null,mu=0,Sl=0,Tl=null;function Vy(e,t){if(aa===null){var n=aa=[];mu=0,Sl=pc(),Tl={status:"pending",value:void 0,then:function(l){n.push(l)}}}return mu++,t.then(hr,hr),t}function hr(){if(--mu===0&&aa!==null){Tl!==null&&(Tl.status="fulfilled");var e=aa;aa=null,Sl=0,Tl=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Ly(e,t){var n=[],l={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(l.status="rejected",l.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),l}var vr=M.S;M.S=function(e,t){nd=ft(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Vy(e,t),vr!==null&&vr(e,t)};var Zn=T(null);function gu(){var e=Zn.current;return e!==null?e:Ce.pooledCache}function gi(e,t){t===null?$(Zn,Zn.current):$(Zn,t.pool)}function br(){var e=gu();return e===null?null:{parent:Le._currentValue,pool:e}}var xl=Error(o(460)),yu=Error(o(474)),yi=Error(o(542)),pi={then:function(){}};function Sr(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Tr(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(Gt,Gt),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Er(e),e;default:if(typeof t.status=="string")t.then(Gt,Gt);else{if(e=Ce,e!==null&&100<e.shellSuspendCounter)throw Error(o(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=l}},function(l){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Er(e),e}throw Qn=t,xl}}function Xn(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Qn=n,xl):n}}var Qn=null;function xr(){if(Qn===null)throw Error(o(459));var e=Qn;return Qn=null,e}function Er(e){if(e===xl||e===yi)throw Error(o(483))}var El=null,ia=0;function hi(e){var t=ia;return ia+=1,El===null&&(El=[]),Tr(El,e,t)}function sa(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function vi(e,t){throw t.$$typeof===C?Error(o(525)):(e=Object.prototype.toString.call(t),Error(o(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Or(e){function t(O,E){if(e){var A=O.deletions;A===null?(O.deletions=[E],O.flags|=16):A.push(E)}}function n(O,E){if(!e)return null;for(;E!==null;)t(O,E),E=E.sibling;return null}function l(O){for(var E=new Map;O!==null;)O.key!==null?E.set(O.key,O):E.set(O.index,O),O=O.sibling;return E}function a(O,E){return O=Zt(O,E),O.index=0,O.sibling=null,O}function s(O,E,A){return O.index=A,e?(A=O.alternate,A!==null?(A=A.index,A<E?(O.flags|=67108866,E):A):(O.flags|=67108866,E)):(O.flags|=1048576,E)}function r(O){return e&&O.alternate===null&&(O.flags|=67108866),O}function y(O,E,A,R){return E===null||E.tag!==6?(E=lu(A,O.mode,R),E.return=O,E):(E=a(E,A),E.return=O,E)}function b(O,E,A,R){var te=A.type;return te===w?_(O,E,A.props.children,R,A.key):E!==null&&(E.elementType===te||typeof te=="object"&&te!==null&&te.$$typeof===ae&&Xn(te)===E.type)?(E=a(E,A.props),sa(E,A),E.return=O,E):(E=ri(A.type,A.key,A.props,null,O.mode,R),sa(E,A),E.return=O,E)}function N(O,E,A,R){return E===null||E.tag!==4||E.stateNode.containerInfo!==A.containerInfo||E.stateNode.implementation!==A.implementation?(E=au(A,O.mode,R),E.return=O,E):(E=a(E,A.children||[]),E.return=O,E)}function _(O,E,A,R,te){return E===null||E.tag!==7?(E=Ln(A,O.mode,R,te),E.return=O,E):(E=a(E,A),E.return=O,E)}function U(O,E,A){if(typeof E=="string"&&E!==""||typeof E=="number"||typeof E=="bigint")return E=lu(""+E,O.mode,A),E.return=O,E;if(typeof E=="object"&&E!==null){switch(E.$$typeof){case G:return A=ri(E.type,E.key,E.props,null,O.mode,A),sa(A,E),A.return=O,A;case L:return E=au(E,O.mode,A),E.return=O,E;case ae:return E=Xn(E),U(O,E,A)}if(B(E)||se(E))return E=Ln(E,O.mode,A,null),E.return=O,E;if(typeof E.then=="function")return U(O,hi(E),A);if(E.$$typeof===de)return U(O,mi(O,E),A);vi(O,E)}return null}function D(O,E,A,R){var te=E!==null?E.key:null;if(typeof A=="string"&&A!==""||typeof A=="number"||typeof A=="bigint")return te!==null?null:y(O,E,""+A,R);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case G:return A.key===te?b(O,E,A,R):null;case L:return A.key===te?N(O,E,A,R):null;case ae:return A=Xn(A),D(O,E,A,R)}if(B(A)||se(A))return te!==null?null:_(O,E,A,R,null);if(typeof A.then=="function")return D(O,E,hi(A),R);if(A.$$typeof===de)return D(O,E,mi(O,A),R);vi(O,A)}return null}function z(O,E,A,R,te){if(typeof R=="string"&&R!==""||typeof R=="number"||typeof R=="bigint")return O=O.get(A)||null,y(E,O,""+R,te);if(typeof R=="object"&&R!==null){switch(R.$$typeof){case G:return O=O.get(R.key===null?A:R.key)||null,b(E,O,R,te);case L:return O=O.get(R.key===null?A:R.key)||null,N(E,O,R,te);case ae:return R=Xn(R),z(O,E,A,R,te)}if(B(R)||se(R))return O=O.get(A)||null,_(E,O,R,te,null);if(typeof R.then=="function")return z(O,E,A,hi(R),te);if(R.$$typeof===de)return z(O,E,A,mi(E,R),te);vi(E,R)}return null}function J(O,E,A,R){for(var te=null,xe=null,W=E,me=E=0,be=null;W!==null&&me<A.length;me++){W.index>me?(be=W,W=null):be=W.sibling;var Ee=D(O,W,A[me],R);if(Ee===null){W===null&&(W=be);break}e&&W&&Ee.alternate===null&&t(O,W),E=s(Ee,E,me),xe===null?te=Ee:xe.sibling=Ee,xe=Ee,W=be}if(me===A.length)return n(O,W),Se&&Xt(O,me),te;if(W===null){for(;me<A.length;me++)W=U(O,A[me],R),W!==null&&(E=s(W,E,me),xe===null?te=W:xe.sibling=W,xe=W);return Se&&Xt(O,me),te}for(W=l(W);me<A.length;me++)be=z(W,O,me,A[me],R),be!==null&&(e&&be.alternate!==null&&W.delete(be.key===null?me:be.key),E=s(be,E,me),xe===null?te=be:xe.sibling=be,xe=be);return e&&W.forEach(function(zn){return t(O,zn)}),Se&&Xt(O,me),te}function le(O,E,A,R){if(A==null)throw Error(o(151));for(var te=null,xe=null,W=E,me=E=0,be=null,Ee=A.next();W!==null&&!Ee.done;me++,Ee=A.next()){W.index>me?(be=W,W=null):be=W.sibling;var zn=D(O,W,Ee.value,R);if(zn===null){W===null&&(W=be);break}e&&W&&zn.alternate===null&&t(O,W),E=s(zn,E,me),xe===null?te=zn:xe.sibling=zn,xe=zn,W=be}if(Ee.done)return n(O,W),Se&&Xt(O,me),te;if(W===null){for(;!Ee.done;me++,Ee=A.next())Ee=U(O,Ee.value,R),Ee!==null&&(E=s(Ee,E,me),xe===null?te=Ee:xe.sibling=Ee,xe=Ee);return Se&&Xt(O,me),te}for(W=l(W);!Ee.done;me++,Ee=A.next())Ee=z(W,O,me,Ee.value,R),Ee!==null&&(e&&Ee.alternate!==null&&W.delete(Ee.key===null?me:Ee.key),E=s(Ee,E,me),xe===null?te=Ee:xe.sibling=Ee,xe=Ee);return e&&W.forEach(function(Wp){return t(O,Wp)}),Se&&Xt(O,me),te}function ze(O,E,A,R){if(typeof A=="object"&&A!==null&&A.type===w&&A.key===null&&(A=A.props.children),typeof A=="object"&&A!==null){switch(A.$$typeof){case G:e:{for(var te=A.key;E!==null;){if(E.key===te){if(te=A.type,te===w){if(E.tag===7){n(O,E.sibling),R=a(E,A.props.children),R.return=O,O=R;break e}}else if(E.elementType===te||typeof te=="object"&&te!==null&&te.$$typeof===ae&&Xn(te)===E.type){n(O,E.sibling),R=a(E,A.props),sa(R,A),R.return=O,O=R;break e}n(O,E);break}else t(O,E);E=E.sibling}A.type===w?(R=Ln(A.props.children,O.mode,R,A.key),R.return=O,O=R):(R=ri(A.type,A.key,A.props,null,O.mode,R),sa(R,A),R.return=O,O=R)}return r(O);case L:e:{for(te=A.key;E!==null;){if(E.key===te)if(E.tag===4&&E.stateNode.containerInfo===A.containerInfo&&E.stateNode.implementation===A.implementation){n(O,E.sibling),R=a(E,A.children||[]),R.return=O,O=R;break e}else{n(O,E);break}else t(O,E);E=E.sibling}R=au(A,O.mode,R),R.return=O,O=R}return r(O);case ae:return A=Xn(A),ze(O,E,A,R)}if(B(A))return J(O,E,A,R);if(se(A)){if(te=se(A),typeof te!="function")throw Error(o(150));return A=te.call(A),le(O,E,A,R)}if(typeof A.then=="function")return ze(O,E,hi(A),R);if(A.$$typeof===de)return ze(O,E,mi(O,A),R);vi(O,A)}return typeof A=="string"&&A!==""||typeof A=="number"||typeof A=="bigint"?(A=""+A,E!==null&&E.tag===6?(n(O,E.sibling),R=a(E,A),R.return=O,O=R):(n(O,E),R=lu(A,O.mode,R),R.return=O,O=R),r(O)):n(O,E)}return function(O,E,A,R){try{ia=0;var te=ze(O,E,A,R);return El=null,te}catch(W){if(W===xl||W===yi)throw W;var xe=yt(29,W,null,O.mode);return xe.lanes=R,xe.return=O,xe}}}var $n=Or(!0),jr=Or(!1),mn=!1;function pu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function hu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function gn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function yn(e,t,n){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(Oe&2)!==0){var a=l.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),l.pending=t,t=oi(e),cr(e,null,n),t}return ci(e,l,t,n),oi(e)}function ua(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,po(e,n)}}function vu(e,t){var n=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,n===l)){var a=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var r={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};s===null?a=s=r:s=s.next=r,n=n.next}while(n!==null);s===null?a=s=t:s=s.next=t}else a=s=t;n={baseState:l.baseState,firstBaseUpdate:a,lastBaseUpdate:s,shared:l.shared,callbacks:l.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var bu=!1;function ca(){if(bu){var e=Tl;if(e!==null)throw e}}function oa(e,t,n,l){bu=!1;var a=e.updateQueue;mn=!1;var s=a.firstBaseUpdate,r=a.lastBaseUpdate,y=a.shared.pending;if(y!==null){a.shared.pending=null;var b=y,N=b.next;b.next=null,r===null?s=N:r.next=N,r=b;var _=e.alternate;_!==null&&(_=_.updateQueue,y=_.lastBaseUpdate,y!==r&&(y===null?_.firstBaseUpdate=N:y.next=N,_.lastBaseUpdate=b))}if(s!==null){var U=a.baseState;r=0,_=N=b=null,y=s;do{var D=y.lane&-536870913,z=D!==y.lane;if(z?(ve&D)===D:(l&D)===D){D!==0&&D===Sl&&(bu=!0),_!==null&&(_=_.next={lane:0,tag:y.tag,payload:y.payload,callback:null,next:null});e:{var J=e,le=y;D=t;var ze=n;switch(le.tag){case 1:if(J=le.payload,typeof J=="function"){U=J.call(ze,U,D);break e}U=J;break e;case 3:J.flags=J.flags&-65537|128;case 0:if(J=le.payload,D=typeof J=="function"?J.call(ze,U,D):J,D==null)break e;U=S({},U,D);break e;case 2:mn=!0}}D=y.callback,D!==null&&(e.flags|=64,z&&(e.flags|=8192),z=a.callbacks,z===null?a.callbacks=[D]:z.push(D))}else z={lane:D,tag:y.tag,payload:y.payload,callback:y.callback,next:null},_===null?(N=_=z,b=U):_=_.next=z,r|=D;if(y=y.next,y===null){if(y=a.shared.pending,y===null)break;z=y,y=z.next,z.next=null,a.lastBaseUpdate=z,a.shared.pending=null}}while(!0);_===null&&(b=U),a.baseState=b,a.firstBaseUpdate=N,a.lastBaseUpdate=_,s===null&&(a.shared.lanes=0),Sn|=r,e.lanes=r,e.memoizedState=U}}function Ar(e,t){if(typeof e!="function")throw Error(o(191,e));e.call(t)}function Nr(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Ar(n[e],t)}var Ol=T(null),bi=T(0);function Mr(e,t){e=nn,$(bi,e),$(Ol,t),nn=e|t.baseLanes}function Su(){$(bi,nn),$(Ol,Ol.current)}function Tu(){nn=bi.current,k(Ol),k(bi)}var pt=T(null),Dt=null;function pn(e){var t=e.alternate;$(He,He.current&1),$(pt,e),Dt===null&&(t===null||Ol.current!==null||t.memoizedState!==null)&&(Dt=e)}function xu(e){$(He,He.current),$(pt,e),Dt===null&&(Dt=e)}function Dr(e){e.tag===22?($(He,He.current),$(pt,e),Dt===null&&(Dt=e)):hn()}function hn(){$(He,He.current),$(pt,pt.current)}function ht(e){k(pt),Dt===e&&(Dt=null),k(He)}var He=T(0);function Si(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Mc(n)||Dc(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Kt=0,fe=null,Me=null,Be=null,Ti=!1,jl=!1,Kn=!1,xi=0,ra=0,Al=null,By=0;function Ue(){throw Error(o(321))}function Eu(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!gt(e[n],t[n]))return!1;return!0}function Ou(e,t,n,l,a,s){return Kt=s,fe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,M.H=e===null||e.memoizedState===null?mf:Vu,Kn=!1,s=n(l,a),Kn=!1,jl&&(s=Cr(t,n,l,a)),zr(e),s}function zr(e){M.H=ma;var t=Me!==null&&Me.next!==null;if(Kt=0,Be=Me=fe=null,Ti=!1,ra=0,Al=null,t)throw Error(o(300));e===null||Ge||(e=e.dependencies,e!==null&&di(e)&&(Ge=!0))}function Cr(e,t,n,l){fe=e;var a=0;do{if(jl&&(Al=null),ra=0,jl=!1,25<=a)throw Error(o(301));if(a+=1,Be=Me=null,e.updateQueue!=null){var s=e.updateQueue;s.lastEffect=null,s.events=null,s.stores=null,s.memoCache!=null&&(s.memoCache.index=0)}M.H=gf,s=t(n,l)}while(jl);return s}function Gy(){var e=M.H,t=e.useState()[0];return t=typeof t.then=="function"?fa(t):t,e=e.useState()[0],(Me!==null?Me.memoizedState:null)!==e&&(fe.flags|=1024),t}function ju(){var e=xi!==0;return xi=0,e}function Au(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Nu(e){if(Ti){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Ti=!1}Kt=0,Be=Me=fe=null,jl=!1,ra=xi=0,Al=null}function nt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Be===null?fe.memoizedState=Be=e:Be=Be.next=e,Be}function Ve(){if(Me===null){var e=fe.alternate;e=e!==null?e.memoizedState:null}else e=Me.next;var t=Be===null?fe.memoizedState:Be.next;if(t!==null)Be=t,Me=e;else{if(e===null)throw fe.alternate===null?Error(o(467)):Error(o(310));Me=e,e={memoizedState:Me.memoizedState,baseState:Me.baseState,baseQueue:Me.baseQueue,queue:Me.queue,next:null},Be===null?fe.memoizedState=Be=e:Be=Be.next=e}return Be}function Ei(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function fa(e){var t=ra;return ra+=1,Al===null&&(Al=[]),e=Tr(Al,e,t),t=fe,(Be===null?t.memoizedState:Be.next)===null&&(t=t.alternate,M.H=t===null||t.memoizedState===null?mf:Vu),e}function Oi(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return fa(e);if(e.$$typeof===de)return We(e)}throw Error(o(438,String(e)))}function Mu(e){var t=null,n=fe.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var l=fe.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Ei(),fe.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),l=0;l<e;l++)n[l]=I;return t.index++,n}function Jt(e,t){return typeof t=="function"?t(e):t}function ji(e){var t=Ve();return Du(t,Me,e)}function Du(e,t,n){var l=e.queue;if(l===null)throw Error(o(311));l.lastRenderedReducer=n;var a=e.baseQueue,s=l.pending;if(s!==null){if(a!==null){var r=a.next;a.next=s.next,s.next=r}t.baseQueue=a=s,l.pending=null}if(s=e.baseState,a===null)e.memoizedState=s;else{t=a.next;var y=r=null,b=null,N=t,_=!1;do{var U=N.lane&-536870913;if(U!==N.lane?(ve&U)===U:(Kt&U)===U){var D=N.revertLane;if(D===0)b!==null&&(b=b.next={lane:0,revertLane:0,gesture:null,action:N.action,hasEagerState:N.hasEagerState,eagerState:N.eagerState,next:null}),U===Sl&&(_=!0);else if((Kt&D)===D){N=N.next,D===Sl&&(_=!0);continue}else U={lane:0,revertLane:N.revertLane,gesture:null,action:N.action,hasEagerState:N.hasEagerState,eagerState:N.eagerState,next:null},b===null?(y=b=U,r=s):b=b.next=U,fe.lanes|=D,Sn|=D;U=N.action,Kn&&n(s,U),s=N.hasEagerState?N.eagerState:n(s,U)}else D={lane:U,revertLane:N.revertLane,gesture:N.gesture,action:N.action,hasEagerState:N.hasEagerState,eagerState:N.eagerState,next:null},b===null?(y=b=D,r=s):b=b.next=D,fe.lanes|=U,Sn|=U;N=N.next}while(N!==null&&N!==t);if(b===null?r=s:b.next=y,!gt(s,e.memoizedState)&&(Ge=!0,_&&(n=Tl,n!==null)))throw n;e.memoizedState=s,e.baseState=r,e.baseQueue=b,l.lastRenderedState=s}return a===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function zu(e){var t=Ve(),n=t.queue;if(n===null)throw Error(o(311));n.lastRenderedReducer=e;var l=n.dispatch,a=n.pending,s=t.memoizedState;if(a!==null){n.pending=null;var r=a=a.next;do s=e(s,r.action),r=r.next;while(r!==a);gt(s,t.memoizedState)||(Ge=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,l]}function _r(e,t,n){var l=fe,a=Ve(),s=Se;if(s){if(n===void 0)throw Error(o(407));n=n()}else n=t();var r=!gt((Me||a).memoizedState,n);if(r&&(a.memoizedState=n,Ge=!0),a=a.queue,wu(Ur.bind(null,l,a,e),[e]),a.getSnapshot!==t||r||Be!==null&&Be.memoizedState.tag&1){if(l.flags|=2048,Nl(9,{destroy:void 0},Rr.bind(null,l,a,n,t),null),Ce===null)throw Error(o(349));s||(Kt&127)!==0||wr(l,t,n)}return n}function wr(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=fe.updateQueue,t===null?(t=Ei(),fe.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Rr(e,t,n,l){t.value=n,t.getSnapshot=l,kr(t)&&qr(e)}function Ur(e,t,n){return n(function(){kr(t)&&qr(e)})}function kr(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!gt(e,n)}catch{return!0}}function qr(e){var t=Vn(e,2);t!==null&&rt(t,e,2)}function Cu(e){var t=nt();if(typeof e=="function"){var n=e;if(e=n(),Kn){sn(!0);try{n()}finally{sn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jt,lastRenderedState:e},t}function Hr(e,t,n,l){return e.baseState=n,Du(e,Me,typeof l=="function"?l:Jt)}function Yy(e,t,n,l,a){if(Mi(e))throw Error(o(485));if(e=t.action,e!==null){var s={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){s.listeners.push(r)}};M.T!==null?n(!0):s.isTransition=!1,l(s),n=t.pending,n===null?(s.next=t.pending=s,Vr(t,s)):(s.next=n.next,t.pending=n.next=s)}}function Vr(e,t){var n=t.action,l=t.payload,a=e.state;if(t.isTransition){var s=M.T,r={};M.T=r;try{var y=n(a,l),b=M.S;b!==null&&b(r,y),Lr(e,t,y)}catch(N){_u(e,t,N)}finally{s!==null&&r.types!==null&&(s.types=r.types),M.T=s}}else try{s=n(a,l),Lr(e,t,s)}catch(N){_u(e,t,N)}}function Lr(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(l){Br(e,t,l)},function(l){return _u(e,t,l)}):Br(e,t,n)}function Br(e,t,n){t.status="fulfilled",t.value=n,Gr(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Vr(e,n)))}function _u(e,t,n){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=n,Gr(t),t=t.next;while(t!==l)}e.action=null}function Gr(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Yr(e,t){return t}function Zr(e,t){if(Se){var n=Ce.formState;if(n!==null){e:{var l=fe;if(Se){if(_e){t:{for(var a=_e,s=Mt;a.nodeType!==8;){if(!s){a=null;break t}if(a=zt(a.nextSibling),a===null){a=null;break t}}s=a.data,a=s==="F!"||s==="F"?a:null}if(a){_e=zt(a.nextSibling),l=a.data==="F!";break e}}fn(l)}l=!1}l&&(t=n[0])}}return n=nt(),n.memoizedState=n.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Yr,lastRenderedState:t},n.queue=l,n=rf.bind(null,fe,l),l.dispatch=n,l=Cu(!1),s=Hu.bind(null,fe,!1,l.queue),l=nt(),a={state:t,dispatch:null,action:e,pending:null},l.queue=a,n=Yy.bind(null,fe,a,s,n),a.dispatch=n,l.memoizedState=e,[t,n,!1]}function Xr(e){var t=Ve();return Qr(t,Me,e)}function Qr(e,t,n){if(t=Du(e,t,Yr)[0],e=ji(Jt)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=fa(t)}catch(r){throw r===xl?yi:r}else l=t;t=Ve();var a=t.queue,s=a.dispatch;return n!==t.memoizedState&&(fe.flags|=2048,Nl(9,{destroy:void 0},Zy.bind(null,a,n),null)),[l,s,e]}function Zy(e,t){e.action=t}function $r(e){var t=Ve(),n=Me;if(n!==null)return Qr(t,n,e);Ve(),t=t.memoizedState,n=Ve();var l=n.queue.dispatch;return n.memoizedState=e,[t,l,!1]}function Nl(e,t,n,l){return e={tag:e,create:n,deps:l,inst:t,next:null},t=fe.updateQueue,t===null&&(t=Ei(),fe.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(l=n.next,n.next=e,e.next=l,t.lastEffect=e),e}function Kr(){return Ve().memoizedState}function Ai(e,t,n,l){var a=nt();fe.flags|=e,a.memoizedState=Nl(1|t,{destroy:void 0},n,l===void 0?null:l)}function Ni(e,t,n,l){var a=Ve();l=l===void 0?null:l;var s=a.memoizedState.inst;Me!==null&&l!==null&&Eu(l,Me.memoizedState.deps)?a.memoizedState=Nl(t,s,n,l):(fe.flags|=e,a.memoizedState=Nl(1|t,s,n,l))}function Jr(e,t){Ai(8390656,8,e,t)}function wu(e,t){Ni(2048,8,e,t)}function Xy(e){fe.flags|=4;var t=fe.updateQueue;if(t===null)t=Ei(),fe.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Fr(e){var t=Ve().memoizedState;return Xy({ref:t,nextImpl:e}),function(){if((Oe&2)!==0)throw Error(o(440));return t.impl.apply(void 0,arguments)}}function Wr(e,t){return Ni(4,2,e,t)}function Ir(e,t){return Ni(4,4,e,t)}function Pr(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ef(e,t,n){n=n!=null?n.concat([e]):null,Ni(4,4,Pr.bind(null,t,e),n)}function Ru(){}function tf(e,t){var n=Ve();t=t===void 0?null:t;var l=n.memoizedState;return t!==null&&Eu(t,l[1])?l[0]:(n.memoizedState=[e,t],e)}function nf(e,t){var n=Ve();t=t===void 0?null:t;var l=n.memoizedState;if(t!==null&&Eu(t,l[1]))return l[0];if(l=e(),Kn){sn(!0);try{e()}finally{sn(!1)}}return n.memoizedState=[l,t],l}function Uu(e,t,n){return n===void 0||(Kt&1073741824)!==0&&(ve&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=ad(),fe.lanes|=e,Sn|=e,n)}function lf(e,t,n,l){return gt(n,t)?n:Ol.current!==null?(e=Uu(e,n,l),gt(e,t)||(Ge=!0),e):(Kt&42)===0||(Kt&1073741824)!==0&&(ve&261930)===0?(Ge=!0,e.memoizedState=n):(e=ad(),fe.lanes|=e,Sn|=e,t)}function af(e,t,n,l,a){var s=H.p;H.p=s!==0&&8>s?s:8;var r=M.T,y={};M.T=y,Hu(e,!1,t,n);try{var b=a(),N=M.S;if(N!==null&&N(y,b),b!==null&&typeof b=="object"&&typeof b.then=="function"){var _=Ly(b,l);da(e,t,_,St(e))}else da(e,t,l,St(e))}catch(U){da(e,t,{then:function(){},status:"rejected",reason:U},St())}finally{H.p=s,r!==null&&y.types!==null&&(r.types=y.types),M.T=r}}function Qy(){}function ku(e,t,n,l){if(e.tag!==5)throw Error(o(476));var a=sf(e).queue;af(e,a,t,K,n===null?Qy:function(){return uf(e),n(l)})}function sf(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:K,baseState:K,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jt,lastRenderedState:K},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jt,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function uf(e){var t=sf(e);t.next===null&&(t=e.alternate.memoizedState),da(e,t.next.queue,{},St())}function qu(){return We(Da)}function cf(){return Ve().memoizedState}function of(){return Ve().memoizedState}function $y(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=St();e=gn(n);var l=yn(t,e,n);l!==null&&(rt(l,t,n),ua(l,t,n)),t={cache:du()},e.payload=t;return}t=t.return}}function Ky(e,t,n){var l=St();n={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Mi(e)?ff(t,n):(n=tu(e,t,n,l),n!==null&&(rt(n,e,l),df(n,t,l)))}function rf(e,t,n){var l=St();da(e,t,n,l)}function da(e,t,n,l){var a={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Mi(e))ff(t,a);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var r=t.lastRenderedState,y=s(r,n);if(a.hasEagerState=!0,a.eagerState=y,gt(y,r))return ci(e,t,a,0),Ce===null&&ui(),!1}catch{}if(n=tu(e,t,a,l),n!==null)return rt(n,e,l),df(n,t,l),!0}return!1}function Hu(e,t,n,l){if(l={lane:2,revertLane:pc(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Mi(e)){if(t)throw Error(o(479))}else t=tu(e,n,l,2),t!==null&&rt(t,e,2)}function Mi(e){var t=e.alternate;return e===fe||t!==null&&t===fe}function ff(e,t){jl=Ti=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function df(e,t,n){if((n&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,po(e,n)}}var ma={readContext:We,use:Oi,useCallback:Ue,useContext:Ue,useEffect:Ue,useImperativeHandle:Ue,useLayoutEffect:Ue,useInsertionEffect:Ue,useMemo:Ue,useReducer:Ue,useRef:Ue,useState:Ue,useDebugValue:Ue,useDeferredValue:Ue,useTransition:Ue,useSyncExternalStore:Ue,useId:Ue,useHostTransitionStatus:Ue,useFormState:Ue,useActionState:Ue,useOptimistic:Ue,useMemoCache:Ue,useCacheRefresh:Ue};ma.useEffectEvent=Ue;var mf={readContext:We,use:Oi,useCallback:function(e,t){return nt().memoizedState=[e,t===void 0?null:t],e},useContext:We,useEffect:Jr,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,Ai(4194308,4,Pr.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ai(4194308,4,e,t)},useInsertionEffect:function(e,t){Ai(4,2,e,t)},useMemo:function(e,t){var n=nt();t=t===void 0?null:t;var l=e();if(Kn){sn(!0);try{e()}finally{sn(!1)}}return n.memoizedState=[l,t],l},useReducer:function(e,t,n){var l=nt();if(n!==void 0){var a=n(t);if(Kn){sn(!0);try{n(t)}finally{sn(!1)}}}else a=t;return l.memoizedState=l.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},l.queue=e,e=e.dispatch=Ky.bind(null,fe,e),[l.memoizedState,e]},useRef:function(e){var t=nt();return e={current:e},t.memoizedState=e},useState:function(e){e=Cu(e);var t=e.queue,n=rf.bind(null,fe,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Ru,useDeferredValue:function(e,t){var n=nt();return Uu(n,e,t)},useTransition:function(){var e=Cu(!1);return e=af.bind(null,fe,e.queue,!0,!1),nt().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var l=fe,a=nt();if(Se){if(n===void 0)throw Error(o(407));n=n()}else{if(n=t(),Ce===null)throw Error(o(349));(ve&127)!==0||wr(l,t,n)}a.memoizedState=n;var s={value:n,getSnapshot:t};return a.queue=s,Jr(Ur.bind(null,l,s,e),[e]),l.flags|=2048,Nl(9,{destroy:void 0},Rr.bind(null,l,s,n,t),null),n},useId:function(){var e=nt(),t=Ce.identifierPrefix;if(Se){var n=qt,l=kt;n=(l&~(1<<32-mt(l)-1)).toString(32)+n,t="_"+t+"R_"+n,n=xi++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=By++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:qu,useFormState:Zr,useActionState:Zr,useOptimistic:function(e){var t=nt();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Hu.bind(null,fe,!0,n),n.dispatch=t,[e,t]},useMemoCache:Mu,useCacheRefresh:function(){return nt().memoizedState=$y.bind(null,fe)},useEffectEvent:function(e){var t=nt(),n={impl:e};return t.memoizedState=n,function(){if((Oe&2)!==0)throw Error(o(440));return n.impl.apply(void 0,arguments)}}},Vu={readContext:We,use:Oi,useCallback:tf,useContext:We,useEffect:wu,useImperativeHandle:ef,useInsertionEffect:Wr,useLayoutEffect:Ir,useMemo:nf,useReducer:ji,useRef:Kr,useState:function(){return ji(Jt)},useDebugValue:Ru,useDeferredValue:function(e,t){var n=Ve();return lf(n,Me.memoizedState,e,t)},useTransition:function(){var e=ji(Jt)[0],t=Ve().memoizedState;return[typeof e=="boolean"?e:fa(e),t]},useSyncExternalStore:_r,useId:cf,useHostTransitionStatus:qu,useFormState:Xr,useActionState:Xr,useOptimistic:function(e,t){var n=Ve();return Hr(n,Me,e,t)},useMemoCache:Mu,useCacheRefresh:of};Vu.useEffectEvent=Fr;var gf={readContext:We,use:Oi,useCallback:tf,useContext:We,useEffect:wu,useImperativeHandle:ef,useInsertionEffect:Wr,useLayoutEffect:Ir,useMemo:nf,useReducer:zu,useRef:Kr,useState:function(){return zu(Jt)},useDebugValue:Ru,useDeferredValue:function(e,t){var n=Ve();return Me===null?Uu(n,e,t):lf(n,Me.memoizedState,e,t)},useTransition:function(){var e=zu(Jt)[0],t=Ve().memoizedState;return[typeof e=="boolean"?e:fa(e),t]},useSyncExternalStore:_r,useId:cf,useHostTransitionStatus:qu,useFormState:$r,useActionState:$r,useOptimistic:function(e,t){var n=Ve();return Me!==null?Hr(n,Me,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Mu,useCacheRefresh:of};gf.useEffectEvent=Fr;function Lu(e,t,n,l){t=e.memoizedState,n=n(l,t),n=n==null?t:S({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Bu={enqueueSetState:function(e,t,n){e=e._reactInternals;var l=St(),a=gn(l);a.payload=t,n!=null&&(a.callback=n),t=yn(e,a,l),t!==null&&(rt(t,e,l),ua(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var l=St(),a=gn(l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=yn(e,a,l),t!==null&&(rt(t,e,l),ua(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=St(),l=gn(n);l.tag=2,t!=null&&(l.callback=t),t=yn(e,l,n),t!==null&&(rt(t,e,n),ua(t,e,n))}};function yf(e,t,n,l,a,s,r){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,s,r):t.prototype&&t.prototype.isPureReactComponent?!Pl(n,l)||!Pl(a,s):!0}function pf(e,t,n,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,l),t.state!==e&&Bu.enqueueReplaceState(t,t.state,null)}function Jn(e,t){var n=t;if("ref"in t){n={};for(var l in t)l!=="ref"&&(n[l]=t[l])}if(e=e.defaultProps){n===t&&(n=S({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function hf(e){si(e)}function vf(e){console.error(e)}function bf(e){si(e)}function Di(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function Sf(e,t,n){try{var l=e.onCaughtError;l(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function Gu(e,t,n){return n=gn(n),n.tag=3,n.payload={element:null},n.callback=function(){Di(e,t)},n}function Tf(e){return e=gn(e),e.tag=3,e}function xf(e,t,n,l){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var s=l.value;e.payload=function(){return a(s)},e.callback=function(){Sf(t,n,l)}}var r=n.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(e.callback=function(){Sf(t,n,l),typeof a!="function"&&(Tn===null?Tn=new Set([this]):Tn.add(this));var y=l.stack;this.componentDidCatch(l.value,{componentStack:y!==null?y:""})})}function Jy(e,t,n,l,a){if(n.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=n.alternate,t!==null&&bl(t,n,a,!0),n=pt.current,n!==null){switch(n.tag){case 31:case 13:return Dt===null?Bi():n.alternate===null&&ke===0&&(ke=3),n.flags&=-257,n.flags|=65536,n.lanes=a,l===pi?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([l]):t.add(l),mc(e,l,a)),!1;case 22:return n.flags|=65536,l===pi?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([l]):n.add(l)),mc(e,l,a)),!1}throw Error(o(435,n.tag))}return mc(e,l,a),Bi(),!1}if(Se)return t=pt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,l!==uu&&(e=Error(o(422),{cause:l}),na(jt(e,n)))):(l!==uu&&(t=Error(o(423),{cause:l}),na(jt(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,l=jt(l,n),a=Gu(e.stateNode,l,a),vu(e,a),ke!==4&&(ke=2)),!1;var s=Error(o(520),{cause:l});if(s=jt(s,n),Ta===null?Ta=[s]:Ta.push(s),ke!==4&&(ke=2),t===null)return!0;l=jt(l,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Gu(n.stateNode,l,e),vu(n,e),!1;case 1:if(t=n.type,s=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||s!==null&&typeof s.componentDidCatch=="function"&&(Tn===null||!Tn.has(s))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Tf(a),xf(a,e,n,l),vu(n,a),!1}n=n.return}while(n!==null);return!1}var Yu=Error(o(461)),Ge=!1;function Ie(e,t,n,l){t.child=e===null?jr(t,null,n,l):$n(t,e.child,n,l)}function Ef(e,t,n,l,a){n=n.render;var s=t.ref;if("ref"in l){var r={};for(var y in l)y!=="ref"&&(r[y]=l[y])}else r=l;return Yn(t),l=Ou(e,t,n,r,s,a),y=ju(),e!==null&&!Ge?(Au(e,t,a),Ft(e,t,a)):(Se&&y&&iu(t),t.flags|=1,Ie(e,t,l,a),t.child)}function Of(e,t,n,l,a){if(e===null){var s=n.type;return typeof s=="function"&&!nu(s)&&s.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=s,jf(e,t,s,l,a)):(e=ri(n.type,null,l,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!Wu(e,a)){var r=s.memoizedProps;if(n=n.compare,n=n!==null?n:Pl,n(r,l)&&e.ref===t.ref)return Ft(e,t,a)}return t.flags|=1,e=Zt(s,l),e.ref=t.ref,e.return=t,t.child=e}function jf(e,t,n,l,a){if(e!==null){var s=e.memoizedProps;if(Pl(s,l)&&e.ref===t.ref)if(Ge=!1,t.pendingProps=l=s,Wu(e,a))(e.flags&131072)!==0&&(Ge=!0);else return t.lanes=e.lanes,Ft(e,t,a)}return Zu(e,t,n,l,a)}function Af(e,t,n,l){var a=l.children,s=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(s=s!==null?s.baseLanes|n:n,e!==null){for(l=t.child=e.child,a=0;l!==null;)a=a|l.lanes|l.childLanes,l=l.sibling;l=a&~s}else l=0,t.child=null;return Nf(e,t,s,n,l)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&gi(t,s!==null?s.cachePool:null),s!==null?Mr(t,s):Su(),Dr(t);else return l=t.lanes=536870912,Nf(e,t,s!==null?s.baseLanes|n:n,n,l)}else s!==null?(gi(t,s.cachePool),Mr(t,s),hn(),t.memoizedState=null):(e!==null&&gi(t,null),Su(),hn());return Ie(e,t,a,n),t.child}function ga(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Nf(e,t,n,l,a){var s=gu();return s=s===null?null:{parent:Le._currentValue,pool:s},t.memoizedState={baseLanes:n,cachePool:s},e!==null&&gi(t,null),Su(),Dr(t),e!==null&&bl(e,t,l,!0),t.childLanes=a,null}function zi(e,t){return t=_i({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Mf(e,t,n){return $n(t,e.child,null,n),e=zi(t,t.pendingProps),e.flags|=2,ht(t),t.memoizedState=null,e}function Fy(e,t,n){var l=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(Se){if(l.mode==="hidden")return e=zi(t,l),t.lanes=536870912,ga(null,e);if(xu(t),(e=_e)?(e=Ld(e,Mt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:on!==null?{id:kt,overflow:qt}:null,retryLane:536870912,hydrationErrors:null},n=rr(e),n.return=t,t.child=n,Fe=t,_e=null)):e=null,e===null)throw fn(t);return t.lanes=536870912,null}return zi(t,l)}var s=e.memoizedState;if(s!==null){var r=s.dehydrated;if(xu(t),a)if(t.flags&256)t.flags&=-257,t=Mf(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(o(558));else if(Ge||bl(e,t,n,!1),a=(n&e.childLanes)!==0,Ge||a){if(l=Ce,l!==null&&(r=ho(l,n),r!==0&&r!==s.retryLane))throw s.retryLane=r,Vn(e,r),rt(l,e,r),Yu;Bi(),t=Mf(e,t,n)}else e=s.treeContext,_e=zt(r.nextSibling),Fe=t,Se=!0,rn=null,Mt=!1,e!==null&&mr(t,e),t=zi(t,l),t.flags|=4096;return t}return e=Zt(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Ci(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(o(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Zu(e,t,n,l,a){return Yn(t),n=Ou(e,t,n,l,void 0,a),l=ju(),e!==null&&!Ge?(Au(e,t,a),Ft(e,t,a)):(Se&&l&&iu(t),t.flags|=1,Ie(e,t,n,a),t.child)}function Df(e,t,n,l,a,s){return Yn(t),t.updateQueue=null,n=Cr(t,l,n,a),zr(e),l=ju(),e!==null&&!Ge?(Au(e,t,s),Ft(e,t,s)):(Se&&l&&iu(t),t.flags|=1,Ie(e,t,n,s),t.child)}function zf(e,t,n,l,a){if(Yn(t),t.stateNode===null){var s=yl,r=n.contextType;typeof r=="object"&&r!==null&&(s=We(r)),s=new n(l,s),t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=Bu,t.stateNode=s,s._reactInternals=t,s=t.stateNode,s.props=l,s.state=t.memoizedState,s.refs={},pu(t),r=n.contextType,s.context=typeof r=="object"&&r!==null?We(r):yl,s.state=t.memoizedState,r=n.getDerivedStateFromProps,typeof r=="function"&&(Lu(t,n,r,l),s.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(r=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),r!==s.state&&Bu.enqueueReplaceState(s,s.state,null),oa(t,l,s,a),ca(),s.state=t.memoizedState),typeof s.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){s=t.stateNode;var y=t.memoizedProps,b=Jn(n,y);s.props=b;var N=s.context,_=n.contextType;r=yl,typeof _=="object"&&_!==null&&(r=We(_));var U=n.getDerivedStateFromProps;_=typeof U=="function"||typeof s.getSnapshotBeforeUpdate=="function",y=t.pendingProps!==y,_||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(y||N!==r)&&pf(t,s,l,r),mn=!1;var D=t.memoizedState;s.state=D,oa(t,l,s,a),ca(),N=t.memoizedState,y||D!==N||mn?(typeof U=="function"&&(Lu(t,n,U,l),N=t.memoizedState),(b=mn||yf(t,n,b,l,D,N,r))?(_||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=N),s.props=l,s.state=N,s.context=r,l=b):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{s=t.stateNode,hu(e,t),r=t.memoizedProps,_=Jn(n,r),s.props=_,U=t.pendingProps,D=s.context,N=n.contextType,b=yl,typeof N=="object"&&N!==null&&(b=We(N)),y=n.getDerivedStateFromProps,(N=typeof y=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(r!==U||D!==b)&&pf(t,s,l,b),mn=!1,D=t.memoizedState,s.state=D,oa(t,l,s,a),ca();var z=t.memoizedState;r!==U||D!==z||mn||e!==null&&e.dependencies!==null&&di(e.dependencies)?(typeof y=="function"&&(Lu(t,n,y,l),z=t.memoizedState),(_=mn||yf(t,n,_,l,D,z,b)||e!==null&&e.dependencies!==null&&di(e.dependencies))?(N||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(l,z,b),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(l,z,b)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||r===e.memoizedProps&&D===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&D===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=z),s.props=l,s.state=z,s.context=b,l=_):(typeof s.componentDidUpdate!="function"||r===e.memoizedProps&&D===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&D===e.memoizedState||(t.flags|=1024),l=!1)}return s=l,Ci(e,t),l=(t.flags&128)!==0,s||l?(s=t.stateNode,n=l&&typeof n.getDerivedStateFromError!="function"?null:s.render(),t.flags|=1,e!==null&&l?(t.child=$n(t,e.child,null,a),t.child=$n(t,null,n,a)):Ie(e,t,n,a),t.memoizedState=s.state,e=t.child):e=Ft(e,t,a),e}function Cf(e,t,n,l){return Bn(),t.flags|=256,Ie(e,t,n,l),t.child}var Xu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Qu(e){return{baseLanes:e,cachePool:br()}}function $u(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=bt),e}function _f(e,t,n){var l=t.pendingProps,a=!1,s=(t.flags&128)!==0,r;if((r=s)||(r=e!==null&&e.memoizedState===null?!1:(He.current&2)!==0),r&&(a=!0,t.flags&=-129),r=(t.flags&32)!==0,t.flags&=-33,e===null){if(Se){if(a?pn(t):hn(),(e=_e)?(e=Ld(e,Mt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:on!==null?{id:kt,overflow:qt}:null,retryLane:536870912,hydrationErrors:null},n=rr(e),n.return=t,t.child=n,Fe=t,_e=null)):e=null,e===null)throw fn(t);return Dc(e)?t.lanes=32:t.lanes=536870912,null}var y=l.children;return l=l.fallback,a?(hn(),a=t.mode,y=_i({mode:"hidden",children:y},a),l=Ln(l,a,n,null),y.return=t,l.return=t,y.sibling=l,t.child=y,l=t.child,l.memoizedState=Qu(n),l.childLanes=$u(e,r,n),t.memoizedState=Xu,ga(null,l)):(pn(t),Ku(t,y))}var b=e.memoizedState;if(b!==null&&(y=b.dehydrated,y!==null)){if(s)t.flags&256?(pn(t),t.flags&=-257,t=Ju(e,t,n)):t.memoizedState!==null?(hn(),t.child=e.child,t.flags|=128,t=null):(hn(),y=l.fallback,a=t.mode,l=_i({mode:"visible",children:l.children},a),y=Ln(y,a,n,null),y.flags|=2,l.return=t,y.return=t,l.sibling=y,t.child=l,$n(t,e.child,null,n),l=t.child,l.memoizedState=Qu(n),l.childLanes=$u(e,r,n),t.memoizedState=Xu,t=ga(null,l));else if(pn(t),Dc(y)){if(r=y.nextSibling&&y.nextSibling.dataset,r)var N=r.dgst;r=N,l=Error(o(419)),l.stack="",l.digest=r,na({value:l,source:null,stack:null}),t=Ju(e,t,n)}else if(Ge||bl(e,t,n,!1),r=(n&e.childLanes)!==0,Ge||r){if(r=Ce,r!==null&&(l=ho(r,n),l!==0&&l!==b.retryLane))throw b.retryLane=l,Vn(e,l),rt(r,e,l),Yu;Mc(y)||Bi(),t=Ju(e,t,n)}else Mc(y)?(t.flags|=192,t.child=e.child,t=null):(e=b.treeContext,_e=zt(y.nextSibling),Fe=t,Se=!0,rn=null,Mt=!1,e!==null&&mr(t,e),t=Ku(t,l.children),t.flags|=4096);return t}return a?(hn(),y=l.fallback,a=t.mode,b=e.child,N=b.sibling,l=Zt(b,{mode:"hidden",children:l.children}),l.subtreeFlags=b.subtreeFlags&65011712,N!==null?y=Zt(N,y):(y=Ln(y,a,n,null),y.flags|=2),y.return=t,l.return=t,l.sibling=y,t.child=l,ga(null,l),l=t.child,y=e.child.memoizedState,y===null?y=Qu(n):(a=y.cachePool,a!==null?(b=Le._currentValue,a=a.parent!==b?{parent:b,pool:b}:a):a=br(),y={baseLanes:y.baseLanes|n,cachePool:a}),l.memoizedState=y,l.childLanes=$u(e,r,n),t.memoizedState=Xu,ga(e.child,l)):(pn(t),n=e.child,e=n.sibling,n=Zt(n,{mode:"visible",children:l.children}),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n)}function Ku(e,t){return t=_i({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function _i(e,t){return e=yt(22,e,null,t),e.lanes=0,e}function Ju(e,t,n){return $n(t,e.child,null,n),e=Ku(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function wf(e,t,n){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),ru(e.return,t,n)}function Fu(e,t,n,l,a,s){var r=e.memoizedState;r===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:n,tailMode:a,treeForkCount:s}:(r.isBackwards=t,r.rendering=null,r.renderingStartTime=0,r.last=l,r.tail=n,r.tailMode=a,r.treeForkCount=s)}function Rf(e,t,n){var l=t.pendingProps,a=l.revealOrder,s=l.tail;l=l.children;var r=He.current,y=(r&2)!==0;if(y?(r=r&1|2,t.flags|=128):r&=1,$(He,r),Ie(e,t,l,n),l=Se?ta:0,!y&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&wf(e,n,t);else if(e.tag===19)wf(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"forwards":for(n=t.child,a=null;n!==null;)e=n.alternate,e!==null&&Si(e)===null&&(a=n),n=n.sibling;n=a,n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Fu(t,!1,a,n,s,l);break;case"backwards":case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&Si(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Fu(t,!0,n,null,s,l);break;case"together":Fu(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function Ft(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Sn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(bl(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(o(153));if(t.child!==null){for(e=t.child,n=Zt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Zt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Wu(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&di(e)))}function Wy(e,t,n){switch(t.tag){case 3:tt(t,t.stateNode.containerInfo),dn(t,Le,e.memoizedState.cache),Bn();break;case 27:case 5:Ll(t);break;case 4:tt(t,t.stateNode.containerInfo);break;case 10:dn(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,xu(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(pn(t),t.flags|=128,null):(n&t.child.childLanes)!==0?_f(e,t,n):(pn(t),e=Ft(e,t,n),e!==null?e.sibling:null);pn(t);break;case 19:var a=(e.flags&128)!==0;if(l=(n&t.childLanes)!==0,l||(bl(e,t,n,!1),l=(n&t.childLanes)!==0),a){if(l)return Rf(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),$(He,He.current),l)break;return null;case 22:return t.lanes=0,Af(e,t,n,t.pendingProps);case 24:dn(t,Le,e.memoizedState.cache)}return Ft(e,t,n)}function Uf(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)Ge=!0;else{if(!Wu(e,n)&&(t.flags&128)===0)return Ge=!1,Wy(e,t,n);Ge=(e.flags&131072)!==0}else Ge=!1,Se&&(t.flags&1048576)!==0&&dr(t,ta,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=Xn(t.elementType),t.type=e,typeof e=="function")nu(e)?(l=Jn(e,l),t.tag=1,t=zf(null,t,e,l,n)):(t.tag=0,t=Zu(null,t,e,l,n));else{if(e!=null){var a=e.$$typeof;if(a===Te){t.tag=11,t=Ef(null,t,e,l,n);break e}else if(a===X){t.tag=14,t=Of(null,t,e,l,n);break e}}throw t=Y(e)||e,Error(o(306,t,""))}}return t;case 0:return Zu(e,t,t.type,t.pendingProps,n);case 1:return l=t.type,a=Jn(l,t.pendingProps),zf(e,t,l,a,n);case 3:e:{if(tt(t,t.stateNode.containerInfo),e===null)throw Error(o(387));l=t.pendingProps;var s=t.memoizedState;a=s.element,hu(e,t),oa(t,l,null,n);var r=t.memoizedState;if(l=r.cache,dn(t,Le,l),l!==s.cache&&fu(t,[Le],n,!0),ca(),l=r.element,s.isDehydrated)if(s={element:l,isDehydrated:!1,cache:r.cache},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){t=Cf(e,t,l,n);break e}else if(l!==a){a=jt(Error(o(424)),t),na(a),t=Cf(e,t,l,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,_e=zt(e.firstChild),Fe=t,Se=!0,rn=null,Mt=!0,n=jr(t,null,l,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Bn(),l===a){t=Ft(e,t,n);break e}Ie(e,t,l,n)}t=t.child}return t;case 26:return Ci(e,t),e===null?(n=Qd(t.type,null,t.pendingProps,null))?t.memoizedState=n:Se||(n=t.type,e=t.pendingProps,l=Ki(ye.current).createElement(n),l[Je]=t,l[at]=e,Pe(l,n,e),Qe(l),t.stateNode=l):t.memoizedState=Qd(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Ll(t),e===null&&Se&&(l=t.stateNode=Yd(t.type,t.pendingProps,ye.current),Fe=t,Mt=!0,a=_e,jn(t.type)?(zc=a,_e=zt(l.firstChild)):_e=a),Ie(e,t,t.pendingProps.children,n),Ci(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&Se&&((a=l=_e)&&(l=Np(l,t.type,t.pendingProps,Mt),l!==null?(t.stateNode=l,Fe=t,_e=zt(l.firstChild),Mt=!1,a=!0):a=!1),a||fn(t)),Ll(t),a=t.type,s=t.pendingProps,r=e!==null?e.memoizedProps:null,l=s.children,jc(a,s)?l=null:r!==null&&jc(a,r)&&(t.flags|=32),t.memoizedState!==null&&(a=Ou(e,t,Gy,null,null,n),Da._currentValue=a),Ci(e,t),Ie(e,t,l,n),t.child;case 6:return e===null&&Se&&((e=n=_e)&&(n=Mp(n,t.pendingProps,Mt),n!==null?(t.stateNode=n,Fe=t,_e=null,e=!0):e=!1),e||fn(t)),null;case 13:return _f(e,t,n);case 4:return tt(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=$n(t,null,l,n):Ie(e,t,l,n),t.child;case 11:return Ef(e,t,t.type,t.pendingProps,n);case 7:return Ie(e,t,t.pendingProps,n),t.child;case 8:return Ie(e,t,t.pendingProps.children,n),t.child;case 12:return Ie(e,t,t.pendingProps.children,n),t.child;case 10:return l=t.pendingProps,dn(t,t.type,l.value),Ie(e,t,l.children,n),t.child;case 9:return a=t.type._context,l=t.pendingProps.children,Yn(t),a=We(a),l=l(a),t.flags|=1,Ie(e,t,l,n),t.child;case 14:return Of(e,t,t.type,t.pendingProps,n);case 15:return jf(e,t,t.type,t.pendingProps,n);case 19:return Rf(e,t,n);case 31:return Fy(e,t,n);case 22:return Af(e,t,n,t.pendingProps);case 24:return Yn(t),l=We(Le),e===null?(a=gu(),a===null&&(a=Ce,s=du(),a.pooledCache=s,s.refCount++,s!==null&&(a.pooledCacheLanes|=n),a=s),t.memoizedState={parent:l,cache:a},pu(t),dn(t,Le,a)):((e.lanes&n)!==0&&(hu(e,t),oa(t,null,null,n),ca()),a=e.memoizedState,s=t.memoizedState,a.parent!==l?(a={parent:l,cache:l},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),dn(t,Le,l)):(l=s.cache,dn(t,Le,l),l!==a.cache&&fu(t,[Le],n,!0))),Ie(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(o(156,t.tag))}function Wt(e){e.flags|=4}function Iu(e,t,n,l,a){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(cd())e.flags|=8192;else throw Qn=pi,yu}else e.flags&=-16777217}function kf(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Wd(t))if(cd())e.flags|=8192;else throw Qn=pi,yu}function wi(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?go():536870912,e.lanes|=t,Cl|=t)}function ya(e,t){if(!Se)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var l=null;n!==null;)n.alternate!==null&&(l=n),n=n.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function we(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,l=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags&65011712,l|=a.flags&65011712,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags,l|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=l,e.childLanes=n,t}function Iy(e,t,n){var l=t.pendingProps;switch(su(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return we(t),null;case 1:return we(t),null;case 3:return n=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),$t(Le),qe(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(vl(t)?Wt(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,cu())),we(t),null;case 26:var a=t.type,s=t.memoizedState;return e===null?(Wt(t),s!==null?(we(t),kf(t,s)):(we(t),Iu(t,a,null,l,n))):s?s!==e.memoizedState?(Wt(t),we(t),kf(t,s)):(we(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&Wt(t),we(t),Iu(t,a,e,l,n)),null;case 27:if(Za(t),n=ye.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Wt(t);else{if(!l){if(t.stateNode===null)throw Error(o(166));return we(t),null}e=F.current,vl(t)?gr(t):(e=Yd(a,l,n),t.stateNode=e,Wt(t))}return we(t),null;case 5:if(Za(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Wt(t);else{if(!l){if(t.stateNode===null)throw Error(o(166));return we(t),null}if(s=F.current,vl(t))gr(t);else{var r=Ki(ye.current);switch(s){case 1:s=r.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:s=r.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":s=r.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":s=r.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":s=r.createElement("div"),s.innerHTML="<script><\/script>",s=s.removeChild(s.firstChild);break;case"select":s=typeof l.is=="string"?r.createElement("select",{is:l.is}):r.createElement("select"),l.multiple?s.multiple=!0:l.size&&(s.size=l.size);break;default:s=typeof l.is=="string"?r.createElement(a,{is:l.is}):r.createElement(a)}}s[Je]=t,s[at]=l;e:for(r=t.child;r!==null;){if(r.tag===5||r.tag===6)s.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break e;for(;r.sibling===null;){if(r.return===null||r.return===t)break e;r=r.return}r.sibling.return=r.return,r=r.sibling}t.stateNode=s;e:switch(Pe(s,a,l),a){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Wt(t)}}return we(t),Iu(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&Wt(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(o(166));if(e=ye.current,vl(t)){if(e=t.stateNode,n=t.memoizedProps,l=null,a=Fe,a!==null)switch(a.tag){case 27:case 5:l=a.memoizedProps}e[Je]=t,e=!!(e.nodeValue===n||l!==null&&l.suppressHydrationWarning===!0||_d(e.nodeValue,n)),e||fn(t,!0)}else e=Ki(e).createTextNode(l),e[Je]=t,t.stateNode=e}return we(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(l=vl(t),n!==null){if(e===null){if(!l)throw Error(o(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(557));e[Je]=t}else Bn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;we(t),e=!1}else n=cu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(ht(t),t):(ht(t),null);if((t.flags&128)!==0)throw Error(o(558))}return we(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=vl(t),l!==null&&l.dehydrated!==null){if(e===null){if(!a)throw Error(o(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(o(317));a[Je]=t}else Bn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;we(t),a=!1}else a=cu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(ht(t),t):(ht(t),null)}return ht(t),(t.flags&128)!==0?(t.lanes=n,t):(n=l!==null,e=e!==null&&e.memoizedState!==null,n&&(l=t.child,a=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(a=l.alternate.memoizedState.cachePool.pool),s=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(s=l.memoizedState.cachePool.pool),s!==a&&(l.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),wi(t,t.updateQueue),we(t),null);case 4:return qe(),e===null&&Sc(t.stateNode.containerInfo),we(t),null;case 10:return $t(t.type),we(t),null;case 19:if(k(He),l=t.memoizedState,l===null)return we(t),null;if(a=(t.flags&128)!==0,s=l.rendering,s===null)if(a)ya(l,!1);else{if(ke!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=Si(e),s!==null){for(t.flags|=128,ya(l,!1),e=s.updateQueue,t.updateQueue=e,wi(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)or(n,e),n=n.sibling;return $(He,He.current&1|2),Se&&Xt(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&ft()>Hi&&(t.flags|=128,a=!0,ya(l,!1),t.lanes=4194304)}else{if(!a)if(e=Si(s),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,wi(t,e),ya(l,!0),l.tail===null&&l.tailMode==="hidden"&&!s.alternate&&!Se)return we(t),null}else 2*ft()-l.renderingStartTime>Hi&&n!==536870912&&(t.flags|=128,a=!0,ya(l,!1),t.lanes=4194304);l.isBackwards?(s.sibling=t.child,t.child=s):(e=l.last,e!==null?e.sibling=s:t.child=s,l.last=s)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=ft(),e.sibling=null,n=He.current,$(He,a?n&1|2:n&1),Se&&Xt(t,l.treeForkCount),e):(we(t),null);case 22:case 23:return ht(t),Tu(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(n&536870912)!==0&&(t.flags&128)===0&&(we(t),t.subtreeFlags&6&&(t.flags|=8192)):we(t),n=t.updateQueue,n!==null&&wi(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==n&&(t.flags|=2048),e!==null&&k(Zn),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),$t(Le),we(t),null;case 25:return null;case 30:return null}throw Error(o(156,t.tag))}function Py(e,t){switch(su(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $t(Le),qe(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Za(t),null;case 31:if(t.memoizedState!==null){if(ht(t),t.alternate===null)throw Error(o(340));Bn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(ht(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(o(340));Bn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return k(He),null;case 4:return qe(),null;case 10:return $t(t.type),null;case 22:case 23:return ht(t),Tu(),e!==null&&k(Zn),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return $t(Le),null;case 25:return null;default:return null}}function qf(e,t){switch(su(t),t.tag){case 3:$t(Le),qe();break;case 26:case 27:case 5:Za(t);break;case 4:qe();break;case 31:t.memoizedState!==null&&ht(t);break;case 13:ht(t);break;case 19:k(He);break;case 10:$t(t.type);break;case 22:case 23:ht(t),Tu(),e!==null&&k(Zn);break;case 24:$t(Le)}}function pa(e,t){try{var n=t.updateQueue,l=n!==null?n.lastEffect:null;if(l!==null){var a=l.next;n=a;do{if((n.tag&e)===e){l=void 0;var s=n.create,r=n.inst;l=s(),r.destroy=l}n=n.next}while(n!==a)}}catch(y){Ne(t,t.return,y)}}function vn(e,t,n){try{var l=t.updateQueue,a=l!==null?l.lastEffect:null;if(a!==null){var s=a.next;l=s;do{if((l.tag&e)===e){var r=l.inst,y=r.destroy;if(y!==void 0){r.destroy=void 0,a=t;var b=n,N=y;try{N()}catch(_){Ne(a,b,_)}}}l=l.next}while(l!==s)}}catch(_){Ne(t,t.return,_)}}function Hf(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Nr(t,n)}catch(l){Ne(e,e.return,l)}}}function Vf(e,t,n){n.props=Jn(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(l){Ne(e,t,l)}}function ha(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof n=="function"?e.refCleanup=n(l):n.current=l}}catch(a){Ne(e,t,a)}}function Ht(e,t){var n=e.ref,l=e.refCleanup;if(n!==null)if(typeof l=="function")try{l()}catch(a){Ne(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){Ne(e,t,a)}else n.current=null}function Lf(e){var t=e.type,n=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&l.focus();break e;case"img":n.src?l.src=n.src:n.srcSet&&(l.srcset=n.srcSet)}}catch(a){Ne(e,e.return,a)}}function Pu(e,t,n){try{var l=e.stateNode;Tp(l,e.type,n,t),l[at]=t}catch(a){Ne(e,e.return,a)}}function Bf(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&jn(e.type)||e.tag===4}function ec(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Bf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&jn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function tc(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Gt));else if(l!==4&&(l===27&&jn(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(tc(e,t,n),e=e.sibling;e!==null;)tc(e,t,n),e=e.sibling}function Ri(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(l!==4&&(l===27&&jn(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Ri(e,t,n),e=e.sibling;e!==null;)Ri(e,t,n),e=e.sibling}function Gf(e){var t=e.stateNode,n=e.memoizedProps;try{for(var l=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);Pe(t,l,n),t[Je]=e,t[at]=n}catch(s){Ne(e,e.return,s)}}var It=!1,Ye=!1,nc=!1,Yf=typeof WeakSet=="function"?WeakSet:Set,$e=null;function ep(e,t){if(e=e.containerInfo,Ec=ts,e=er(e),Js(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var l=n.getSelection&&n.getSelection();if(l&&l.rangeCount!==0){n=l.anchorNode;var a=l.anchorOffset,s=l.focusNode;l=l.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var r=0,y=-1,b=-1,N=0,_=0,U=e,D=null;t:for(;;){for(var z;U!==n||a!==0&&U.nodeType!==3||(y=r+a),U!==s||l!==0&&U.nodeType!==3||(b=r+l),U.nodeType===3&&(r+=U.nodeValue.length),(z=U.firstChild)!==null;)D=U,U=z;for(;;){if(U===e)break t;if(D===n&&++N===a&&(y=r),D===s&&++_===l&&(b=r),(z=U.nextSibling)!==null)break;U=D,D=U.parentNode}U=z}n=y===-1||b===-1?null:{start:y,end:b}}else n=null}n=n||{start:0,end:0}}else n=null;for(Oc={focusedElem:e,selectionRange:n},ts=!1,$e=t;$e!==null;)if(t=$e,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,$e=e;else for(;$e!==null;){switch(t=$e,s=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&s!==null){e=void 0,n=t,a=s.memoizedProps,s=s.memoizedState,l=n.stateNode;try{var J=Jn(n.type,a);e=l.getSnapshotBeforeUpdate(J,s),l.__reactInternalSnapshotBeforeUpdate=e}catch(le){Ne(n,n.return,le)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Nc(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Nc(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(o(163))}if(e=t.sibling,e!==null){e.return=t.return,$e=e;break}$e=t.return}}function Zf(e,t,n){var l=n.flags;switch(n.tag){case 0:case 11:case 15:en(e,n),l&4&&pa(5,n);break;case 1:if(en(e,n),l&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(r){Ne(n,n.return,r)}else{var a=Jn(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(r){Ne(n,n.return,r)}}l&64&&Hf(n),l&512&&ha(n,n.return);break;case 3:if(en(e,n),l&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Nr(e,t)}catch(r){Ne(n,n.return,r)}}break;case 27:t===null&&l&4&&Gf(n);case 26:case 5:en(e,n),t===null&&l&4&&Lf(n),l&512&&ha(n,n.return);break;case 12:en(e,n);break;case 31:en(e,n),l&4&&$f(e,n);break;case 13:en(e,n),l&4&&Kf(e,n),l&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=op.bind(null,n),Dp(e,n))));break;case 22:if(l=n.memoizedState!==null||It,!l){t=t!==null&&t.memoizedState!==null||Ye,a=It;var s=Ye;It=l,(Ye=t)&&!s?tn(e,n,(n.subtreeFlags&8772)!==0):en(e,n),It=a,Ye=s}break;case 30:break;default:en(e,n)}}function Xf(e){var t=e.alternate;t!==null&&(e.alternate=null,Xf(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&_s(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Re=null,st=!1;function Pt(e,t,n){for(n=n.child;n!==null;)Qf(e,t,n),n=n.sibling}function Qf(e,t,n){if(dt&&typeof dt.onCommitFiberUnmount=="function")try{dt.onCommitFiberUnmount(Bl,n)}catch{}switch(n.tag){case 26:Ye||Ht(n,t),Pt(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Ye||Ht(n,t);var l=Re,a=st;jn(n.type)&&(Re=n.stateNode,st=!1),Pt(e,t,n),Aa(n.stateNode),Re=l,st=a;break;case 5:Ye||Ht(n,t);case 6:if(l=Re,a=st,Re=null,Pt(e,t,n),Re=l,st=a,Re!==null)if(st)try{(Re.nodeType===9?Re.body:Re.nodeName==="HTML"?Re.ownerDocument.body:Re).removeChild(n.stateNode)}catch(s){Ne(n,t,s)}else try{Re.removeChild(n.stateNode)}catch(s){Ne(n,t,s)}break;case 18:Re!==null&&(st?(e=Re,Hd(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Vl(e)):Hd(Re,n.stateNode));break;case 4:l=Re,a=st,Re=n.stateNode.containerInfo,st=!0,Pt(e,t,n),Re=l,st=a;break;case 0:case 11:case 14:case 15:vn(2,n,t),Ye||vn(4,n,t),Pt(e,t,n);break;case 1:Ye||(Ht(n,t),l=n.stateNode,typeof l.componentWillUnmount=="function"&&Vf(n,t,l)),Pt(e,t,n);break;case 21:Pt(e,t,n);break;case 22:Ye=(l=Ye)||n.memoizedState!==null,Pt(e,t,n),Ye=l;break;default:Pt(e,t,n)}}function $f(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Vl(e)}catch(n){Ne(t,t.return,n)}}}function Kf(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Vl(e)}catch(n){Ne(t,t.return,n)}}function tp(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Yf),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Yf),t;default:throw Error(o(435,e.tag))}}function Ui(e,t){var n=tp(e);t.forEach(function(l){if(!n.has(l)){n.add(l);var a=rp.bind(null,e,l);l.then(a,a)}})}function ut(e,t){var n=t.deletions;if(n!==null)for(var l=0;l<n.length;l++){var a=n[l],s=e,r=t,y=r;e:for(;y!==null;){switch(y.tag){case 27:if(jn(y.type)){Re=y.stateNode,st=!1;break e}break;case 5:Re=y.stateNode,st=!1;break e;case 3:case 4:Re=y.stateNode.containerInfo,st=!0;break e}y=y.return}if(Re===null)throw Error(o(160));Qf(s,r,a),Re=null,st=!1,s=a.alternate,s!==null&&(s.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Jf(t,e),t=t.sibling}var Rt=null;function Jf(e,t){var n=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:ut(t,e),ct(e),l&4&&(vn(3,e,e.return),pa(3,e),vn(5,e,e.return));break;case 1:ut(t,e),ct(e),l&512&&(Ye||n===null||Ht(n,n.return)),l&64&&It&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?l:n.concat(l))));break;case 26:var a=Rt;if(ut(t,e),ct(e),l&512&&(Ye||n===null||Ht(n,n.return)),l&4){var s=n!==null?n.memoizedState:null;if(l=e.memoizedState,n===null)if(l===null)if(e.stateNode===null){e:{l=e.type,n=e.memoizedProps,a=a.ownerDocument||a;t:switch(l){case"title":s=a.getElementsByTagName("title")[0],(!s||s[Zl]||s[Je]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=a.createElement(l),a.head.insertBefore(s,a.querySelector("head > title"))),Pe(s,l,n),s[Je]=e,Qe(s),l=s;break e;case"link":var r=Jd("link","href",a).get(l+(n.href||""));if(r){for(var y=0;y<r.length;y++)if(s=r[y],s.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&s.getAttribute("rel")===(n.rel==null?null:n.rel)&&s.getAttribute("title")===(n.title==null?null:n.title)&&s.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){r.splice(y,1);break t}}s=a.createElement(l),Pe(s,l,n),a.head.appendChild(s);break;case"meta":if(r=Jd("meta","content",a).get(l+(n.content||""))){for(y=0;y<r.length;y++)if(s=r[y],s.getAttribute("content")===(n.content==null?null:""+n.content)&&s.getAttribute("name")===(n.name==null?null:n.name)&&s.getAttribute("property")===(n.property==null?null:n.property)&&s.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&s.getAttribute("charset")===(n.charSet==null?null:n.charSet)){r.splice(y,1);break t}}s=a.createElement(l),Pe(s,l,n),a.head.appendChild(s);break;default:throw Error(o(468,l))}s[Je]=e,Qe(s),l=s}e.stateNode=l}else Fd(a,e.type,e.stateNode);else e.stateNode=Kd(a,l,e.memoizedProps);else s!==l?(s===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):s.count--,l===null?Fd(a,e.type,e.stateNode):Kd(a,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Pu(e,e.memoizedProps,n.memoizedProps)}break;case 27:ut(t,e),ct(e),l&512&&(Ye||n===null||Ht(n,n.return)),n!==null&&l&4&&Pu(e,e.memoizedProps,n.memoizedProps);break;case 5:if(ut(t,e),ct(e),l&512&&(Ye||n===null||Ht(n,n.return)),e.flags&32){a=e.stateNode;try{cl(a,"")}catch(J){Ne(e,e.return,J)}}l&4&&e.stateNode!=null&&(a=e.memoizedProps,Pu(e,a,n!==null?n.memoizedProps:a)),l&1024&&(nc=!0);break;case 6:if(ut(t,e),ct(e),l&4){if(e.stateNode===null)throw Error(o(162));l=e.memoizedProps,n=e.stateNode;try{n.nodeValue=l}catch(J){Ne(e,e.return,J)}}break;case 3:if(Wi=null,a=Rt,Rt=Ji(t.containerInfo),ut(t,e),Rt=a,ct(e),l&4&&n!==null&&n.memoizedState.isDehydrated)try{Vl(t.containerInfo)}catch(J){Ne(e,e.return,J)}nc&&(nc=!1,Ff(e));break;case 4:l=Rt,Rt=Ji(e.stateNode.containerInfo),ut(t,e),ct(e),Rt=l;break;case 12:ut(t,e),ct(e);break;case 31:ut(t,e),ct(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ui(e,l)));break;case 13:ut(t,e),ct(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(qi=ft()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ui(e,l)));break;case 22:a=e.memoizedState!==null;var b=n!==null&&n.memoizedState!==null,N=It,_=Ye;if(It=N||a,Ye=_||b,ut(t,e),Ye=_,It=N,ct(e),l&8192)e:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||b||It||Ye||Fn(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){b=n=t;try{if(s=b.stateNode,a)r=s.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{y=b.stateNode;var U=b.memoizedProps.style,D=U!=null&&U.hasOwnProperty("display")?U.display:null;y.style.display=D==null||typeof D=="boolean"?"":(""+D).trim()}}catch(J){Ne(b,b.return,J)}}}else if(t.tag===6){if(n===null){b=t;try{b.stateNode.nodeValue=a?"":b.memoizedProps}catch(J){Ne(b,b.return,J)}}}else if(t.tag===18){if(n===null){b=t;try{var z=b.stateNode;a?Vd(z,!0):Vd(b.stateNode,!1)}catch(J){Ne(b,b.return,J)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(n=l.retryQueue,n!==null&&(l.retryQueue=null,Ui(e,n))));break;case 19:ut(t,e),ct(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ui(e,l)));break;case 30:break;case 21:break;default:ut(t,e),ct(e)}}function ct(e){var t=e.flags;if(t&2){try{for(var n,l=e.return;l!==null;){if(Bf(l)){n=l;break}l=l.return}if(n==null)throw Error(o(160));switch(n.tag){case 27:var a=n.stateNode,s=ec(e);Ri(e,s,a);break;case 5:var r=n.stateNode;n.flags&32&&(cl(r,""),n.flags&=-33);var y=ec(e);Ri(e,y,r);break;case 3:case 4:var b=n.stateNode.containerInfo,N=ec(e);tc(e,N,b);break;default:throw Error(o(161))}}catch(_){Ne(e,e.return,_)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ff(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Ff(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function en(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Zf(e,t.alternate,t),t=t.sibling}function Fn(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:vn(4,t,t.return),Fn(t);break;case 1:Ht(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&Vf(t,t.return,n),Fn(t);break;case 27:Aa(t.stateNode);case 26:case 5:Ht(t,t.return),Fn(t);break;case 22:t.memoizedState===null&&Fn(t);break;case 30:Fn(t);break;default:Fn(t)}e=e.sibling}}function tn(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,a=e,s=t,r=s.flags;switch(s.tag){case 0:case 11:case 15:tn(a,s,n),pa(4,s);break;case 1:if(tn(a,s,n),l=s,a=l.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(N){Ne(l,l.return,N)}if(l=s,a=l.updateQueue,a!==null){var y=l.stateNode;try{var b=a.shared.hiddenCallbacks;if(b!==null)for(a.shared.hiddenCallbacks=null,a=0;a<b.length;a++)Ar(b[a],y)}catch(N){Ne(l,l.return,N)}}n&&r&64&&Hf(s),ha(s,s.return);break;case 27:Gf(s);case 26:case 5:tn(a,s,n),n&&l===null&&r&4&&Lf(s),ha(s,s.return);break;case 12:tn(a,s,n);break;case 31:tn(a,s,n),n&&r&4&&$f(a,s);break;case 13:tn(a,s,n),n&&r&4&&Kf(a,s);break;case 22:s.memoizedState===null&&tn(a,s,n),ha(s,s.return);break;case 30:break;default:tn(a,s,n)}t=t.sibling}}function lc(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&la(n))}function ac(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&la(e))}function Ut(e,t,n,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Wf(e,t,n,l),t=t.sibling}function Wf(e,t,n,l){var a=t.flags;switch(t.tag){case 0:case 11:case 15:Ut(e,t,n,l),a&2048&&pa(9,t);break;case 1:Ut(e,t,n,l);break;case 3:Ut(e,t,n,l),a&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&la(e)));break;case 12:if(a&2048){Ut(e,t,n,l),e=t.stateNode;try{var s=t.memoizedProps,r=s.id,y=s.onPostCommit;typeof y=="function"&&y(r,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(b){Ne(t,t.return,b)}}else Ut(e,t,n,l);break;case 31:Ut(e,t,n,l);break;case 13:Ut(e,t,n,l);break;case 23:break;case 22:s=t.stateNode,r=t.alternate,t.memoizedState!==null?s._visibility&2?Ut(e,t,n,l):va(e,t):s._visibility&2?Ut(e,t,n,l):(s._visibility|=2,Ml(e,t,n,l,(t.subtreeFlags&10256)!==0||!1)),a&2048&&lc(r,t);break;case 24:Ut(e,t,n,l),a&2048&&ac(t.alternate,t);break;default:Ut(e,t,n,l)}}function Ml(e,t,n,l,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var s=e,r=t,y=n,b=l,N=r.flags;switch(r.tag){case 0:case 11:case 15:Ml(s,r,y,b,a),pa(8,r);break;case 23:break;case 22:var _=r.stateNode;r.memoizedState!==null?_._visibility&2?Ml(s,r,y,b,a):va(s,r):(_._visibility|=2,Ml(s,r,y,b,a)),a&&N&2048&&lc(r.alternate,r);break;case 24:Ml(s,r,y,b,a),a&&N&2048&&ac(r.alternate,r);break;default:Ml(s,r,y,b,a)}t=t.sibling}}function va(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,l=t,a=l.flags;switch(l.tag){case 22:va(n,l),a&2048&&lc(l.alternate,l);break;case 24:va(n,l),a&2048&&ac(l.alternate,l);break;default:va(n,l)}t=t.sibling}}var ba=8192;function Dl(e,t,n){if(e.subtreeFlags&ba)for(e=e.child;e!==null;)If(e,t,n),e=e.sibling}function If(e,t,n){switch(e.tag){case 26:Dl(e,t,n),e.flags&ba&&e.memoizedState!==null&&Bp(n,Rt,e.memoizedState,e.memoizedProps);break;case 5:Dl(e,t,n);break;case 3:case 4:var l=Rt;Rt=Ji(e.stateNode.containerInfo),Dl(e,t,n),Rt=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=ba,ba=16777216,Dl(e,t,n),ba=l):Dl(e,t,n));break;default:Dl(e,t,n)}}function Pf(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Sa(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];$e=l,td(l,e)}Pf(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)ed(e),e=e.sibling}function ed(e){switch(e.tag){case 0:case 11:case 15:Sa(e),e.flags&2048&&vn(9,e,e.return);break;case 3:Sa(e);break;case 12:Sa(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,ki(e)):Sa(e);break;default:Sa(e)}}function ki(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];$e=l,td(l,e)}Pf(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:vn(8,t,t.return),ki(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,ki(t));break;default:ki(t)}e=e.sibling}}function td(e,t){for(;$e!==null;){var n=$e;switch(n.tag){case 0:case 11:case 15:vn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var l=n.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:la(n.memoizedState.cache)}if(l=n.child,l!==null)l.return=n,$e=l;else e:for(n=e;$e!==null;){l=$e;var a=l.sibling,s=l.return;if(Xf(l),l===n){$e=null;break e}if(a!==null){a.return=s,$e=a;break e}$e=s}}}var np={getCacheForType:function(e){var t=We(Le),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return We(Le).controller.signal}},lp=typeof WeakMap=="function"?WeakMap:Map,Oe=0,Ce=null,pe=null,ve=0,Ae=0,vt=null,bn=!1,zl=!1,ic=!1,nn=0,ke=0,Sn=0,Wn=0,sc=0,bt=0,Cl=0,Ta=null,ot=null,uc=!1,qi=0,nd=0,Hi=1/0,Vi=null,Tn=null,Xe=0,xn=null,_l=null,ln=0,cc=0,oc=null,ld=null,xa=0,rc=null;function St(){return(Oe&2)!==0&&ve!==0?ve&-ve:M.T!==null?pc():vo()}function ad(){if(bt===0)if((ve&536870912)===0||Se){var e=$a;$a<<=1,($a&3932160)===0&&($a=262144),bt=e}else bt=536870912;return e=pt.current,e!==null&&(e.flags|=32),bt}function rt(e,t,n){(e===Ce&&(Ae===2||Ae===9)||e.cancelPendingCommit!==null)&&(wl(e,0),En(e,ve,bt,!1)),Yl(e,n),((Oe&2)===0||e!==Ce)&&(e===Ce&&((Oe&2)===0&&(Wn|=n),ke===4&&En(e,ve,bt,!1)),Vt(e))}function id(e,t,n){if((Oe&6)!==0)throw Error(o(327));var l=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Gl(e,t),a=l?sp(e,t):dc(e,t,!0),s=l;do{if(a===0){zl&&!l&&En(e,t,0,!1);break}else{if(n=e.current.alternate,s&&!ap(n)){a=dc(e,t,!1),s=!1;continue}if(a===2){if(s=t,e.errorRecoveryDisabledLanes&s)var r=0;else r=e.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){t=r;e:{var y=e;a=Ta;var b=y.current.memoizedState.isDehydrated;if(b&&(wl(y,r).flags|=256),r=dc(y,r,!1),r!==2){if(ic&&!b){y.errorRecoveryDisabledLanes|=s,Wn|=s,a=4;break e}s=ot,ot=a,s!==null&&(ot===null?ot=s:ot.push.apply(ot,s))}a=r}if(s=!1,a!==2)continue}}if(a===1){wl(e,0),En(e,t,0,!0);break}e:{switch(l=e,s=a,s){case 0:case 1:throw Error(o(345));case 4:if((t&4194048)!==t)break;case 6:En(l,t,bt,!bn);break e;case 2:ot=null;break;case 3:case 5:break;default:throw Error(o(329))}if((t&62914560)===t&&(a=qi+300-ft(),10<a)){if(En(l,t,bt,!bn),Ja(l,0,!0)!==0)break e;ln=t,l.timeoutHandle=kd(sd.bind(null,l,n,ot,Vi,uc,t,bt,Wn,Cl,bn,s,"Throttled",-0,0),a);break e}sd(l,n,ot,Vi,uc,t,bt,Wn,Cl,bn,s,null,-0,0)}}break}while(!0);Vt(e)}function sd(e,t,n,l,a,s,r,y,b,N,_,U,D,z){if(e.timeoutHandle=-1,U=t.subtreeFlags,U&8192||(U&16785408)===16785408){U={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Gt},If(t,s,U);var J=(s&62914560)===s?qi-ft():(s&4194048)===s?nd-ft():0;if(J=Gp(U,J),J!==null){ln=s,e.cancelPendingCommit=J(gd.bind(null,e,t,s,n,l,a,r,y,b,_,U,null,D,z)),En(e,s,r,!N);return}}gd(e,t,s,n,l,a,r,y,b)}function ap(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var l=0;l<n.length;l++){var a=n[l],s=a.getSnapshot;a=a.value;try{if(!gt(s(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function En(e,t,n,l){t&=~sc,t&=~Wn,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var a=t;0<a;){var s=31-mt(a),r=1<<s;l[s]=-1,a&=~r}n!==0&&yo(e,n,t)}function Li(){return(Oe&6)===0?(Ea(0),!1):!0}function fc(){if(pe!==null){if(Ae===0)var e=pe.return;else e=pe,Qt=Gn=null,Nu(e),El=null,ia=0,e=pe;for(;e!==null;)qf(e.alternate,e),e=e.return;pe=null}}function wl(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,Op(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),ln=0,fc(),Ce=e,pe=n=Zt(e.current,null),ve=t,Ae=0,vt=null,bn=!1,zl=Gl(e,t),ic=!1,Cl=bt=sc=Wn=Sn=ke=0,ot=Ta=null,uc=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var a=31-mt(l),s=1<<a;t|=e[a],l&=~s}return nn=t,ui(),n}function ud(e,t){fe=null,M.H=ma,t===xl||t===yi?(t=xr(),Ae=3):t===yu?(t=xr(),Ae=4):Ae=t===Yu?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,vt=t,pe===null&&(ke=1,Di(e,jt(t,e.current)))}function cd(){var e=pt.current;return e===null?!0:(ve&4194048)===ve?Dt===null:(ve&62914560)===ve||(ve&536870912)!==0?e===Dt:!1}function od(){var e=M.H;return M.H=ma,e===null?ma:e}function rd(){var e=M.A;return M.A=np,e}function Bi(){ke=4,bn||(ve&4194048)!==ve&&pt.current!==null||(zl=!0),(Sn&134217727)===0&&(Wn&134217727)===0||Ce===null||En(Ce,ve,bt,!1)}function dc(e,t,n){var l=Oe;Oe|=2;var a=od(),s=rd();(Ce!==e||ve!==t)&&(Vi=null,wl(e,t)),t=!1;var r=ke;e:do try{if(Ae!==0&&pe!==null){var y=pe,b=vt;switch(Ae){case 8:fc(),r=6;break e;case 3:case 2:case 9:case 6:pt.current===null&&(t=!0);var N=Ae;if(Ae=0,vt=null,Rl(e,y,b,N),n&&zl){r=0;break e}break;default:N=Ae,Ae=0,vt=null,Rl(e,y,b,N)}}ip(),r=ke;break}catch(_){ud(e,_)}while(!0);return t&&e.shellSuspendCounter++,Qt=Gn=null,Oe=l,M.H=a,M.A=s,pe===null&&(Ce=null,ve=0,ui()),r}function ip(){for(;pe!==null;)fd(pe)}function sp(e,t){var n=Oe;Oe|=2;var l=od(),a=rd();Ce!==e||ve!==t?(Vi=null,Hi=ft()+500,wl(e,t)):zl=Gl(e,t);e:do try{if(Ae!==0&&pe!==null){t=pe;var s=vt;t:switch(Ae){case 1:Ae=0,vt=null,Rl(e,t,s,1);break;case 2:case 9:if(Sr(s)){Ae=0,vt=null,dd(t);break}t=function(){Ae!==2&&Ae!==9||Ce!==e||(Ae=7),Vt(e)},s.then(t,t);break e;case 3:Ae=7;break e;case 4:Ae=5;break e;case 7:Sr(s)?(Ae=0,vt=null,dd(t)):(Ae=0,vt=null,Rl(e,t,s,7));break;case 5:var r=null;switch(pe.tag){case 26:r=pe.memoizedState;case 5:case 27:var y=pe;if(r?Wd(r):y.stateNode.complete){Ae=0,vt=null;var b=y.sibling;if(b!==null)pe=b;else{var N=y.return;N!==null?(pe=N,Gi(N)):pe=null}break t}}Ae=0,vt=null,Rl(e,t,s,5);break;case 6:Ae=0,vt=null,Rl(e,t,s,6);break;case 8:fc(),ke=6;break e;default:throw Error(o(462))}}up();break}catch(_){ud(e,_)}while(!0);return Qt=Gn=null,M.H=l,M.A=a,Oe=n,pe!==null?0:(Ce=null,ve=0,ui(),ke)}function up(){for(;pe!==null&&!zg();)fd(pe)}function fd(e){var t=Uf(e.alternate,e,nn);e.memoizedProps=e.pendingProps,t===null?Gi(e):pe=t}function dd(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Df(n,t,t.pendingProps,t.type,void 0,ve);break;case 11:t=Df(n,t,t.pendingProps,t.type.render,t.ref,ve);break;case 5:Nu(t);default:qf(n,t),t=pe=or(t,nn),t=Uf(n,t,nn)}e.memoizedProps=e.pendingProps,t===null?Gi(e):pe=t}function Rl(e,t,n,l){Qt=Gn=null,Nu(t),El=null,ia=0;var a=t.return;try{if(Jy(e,a,t,n,ve)){ke=1,Di(e,jt(n,e.current)),pe=null;return}}catch(s){if(a!==null)throw pe=a,s;ke=1,Di(e,jt(n,e.current)),pe=null;return}t.flags&32768?(Se||l===1?e=!0:zl||(ve&536870912)!==0?e=!1:(bn=e=!0,(l===2||l===9||l===3||l===6)&&(l=pt.current,l!==null&&l.tag===13&&(l.flags|=16384))),md(t,e)):Gi(t)}function Gi(e){var t=e;do{if((t.flags&32768)!==0){md(t,bn);return}e=t.return;var n=Iy(t.alternate,t,nn);if(n!==null){pe=n;return}if(t=t.sibling,t!==null){pe=t;return}pe=t=e}while(t!==null);ke===0&&(ke=5)}function md(e,t){do{var n=Py(e.alternate,e);if(n!==null){n.flags&=32767,pe=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){pe=e;return}pe=e=n}while(e!==null);ke=6,pe=null}function gd(e,t,n,l,a,s,r,y,b){e.cancelPendingCommit=null;do Yi();while(Xe!==0);if((Oe&6)!==0)throw Error(o(327));if(t!==null){if(t===e.current)throw Error(o(177));if(s=t.lanes|t.childLanes,s|=eu,Lg(e,n,s,r,y,b),e===Ce&&(pe=Ce=null,ve=0),_l=t,xn=e,ln=n,cc=s,oc=a,ld=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,fp(Xa,function(){return bd(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=M.T,M.T=null,a=H.p,H.p=2,r=Oe,Oe|=4;try{ep(e,t,n)}finally{Oe=r,H.p=a,M.T=l}}Xe=1,yd(),pd(),hd()}}function yd(){if(Xe===1){Xe=0;var e=xn,t=_l,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=M.T,M.T=null;var l=H.p;H.p=2;var a=Oe;Oe|=4;try{Jf(t,e);var s=Oc,r=er(e.containerInfo),y=s.focusedElem,b=s.selectionRange;if(r!==y&&y&&y.ownerDocument&&Po(y.ownerDocument.documentElement,y)){if(b!==null&&Js(y)){var N=b.start,_=b.end;if(_===void 0&&(_=N),"selectionStart"in y)y.selectionStart=N,y.selectionEnd=Math.min(_,y.value.length);else{var U=y.ownerDocument||document,D=U&&U.defaultView||window;if(D.getSelection){var z=D.getSelection(),J=y.textContent.length,le=Math.min(b.start,J),ze=b.end===void 0?le:Math.min(b.end,J);!z.extend&&le>ze&&(r=ze,ze=le,le=r);var O=Io(y,le),E=Io(y,ze);if(O&&E&&(z.rangeCount!==1||z.anchorNode!==O.node||z.anchorOffset!==O.offset||z.focusNode!==E.node||z.focusOffset!==E.offset)){var A=U.createRange();A.setStart(O.node,O.offset),z.removeAllRanges(),le>ze?(z.addRange(A),z.extend(E.node,E.offset)):(A.setEnd(E.node,E.offset),z.addRange(A))}}}}for(U=[],z=y;z=z.parentNode;)z.nodeType===1&&U.push({element:z,left:z.scrollLeft,top:z.scrollTop});for(typeof y.focus=="function"&&y.focus(),y=0;y<U.length;y++){var R=U[y];R.element.scrollLeft=R.left,R.element.scrollTop=R.top}}ts=!!Ec,Oc=Ec=null}finally{Oe=a,H.p=l,M.T=n}}e.current=t,Xe=2}}function pd(){if(Xe===2){Xe=0;var e=xn,t=_l,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=M.T,M.T=null;var l=H.p;H.p=2;var a=Oe;Oe|=4;try{Zf(e,t.alternate,t)}finally{Oe=a,H.p=l,M.T=n}}Xe=3}}function hd(){if(Xe===4||Xe===3){Xe=0,Cg();var e=xn,t=_l,n=ln,l=ld;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Xe=5:(Xe=0,_l=xn=null,vd(e,e.pendingLanes));var a=e.pendingLanes;if(a===0&&(Tn=null),zs(n),t=t.stateNode,dt&&typeof dt.onCommitFiberRoot=="function")try{dt.onCommitFiberRoot(Bl,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=M.T,a=H.p,H.p=2,M.T=null;try{for(var s=e.onRecoverableError,r=0;r<l.length;r++){var y=l[r];s(y.value,{componentStack:y.stack})}}finally{M.T=t,H.p=a}}(ln&3)!==0&&Yi(),Vt(e),a=e.pendingLanes,(n&261930)!==0&&(a&42)!==0?e===rc?xa++:(xa=0,rc=e):xa=0,Ea(0)}}function vd(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,la(t)))}function Yi(){return yd(),pd(),hd(),bd()}function bd(){if(Xe!==5)return!1;var e=xn,t=cc;cc=0;var n=zs(ln),l=M.T,a=H.p;try{H.p=32>n?32:n,M.T=null,n=oc,oc=null;var s=xn,r=ln;if(Xe=0,_l=xn=null,ln=0,(Oe&6)!==0)throw Error(o(331));var y=Oe;if(Oe|=4,ed(s.current),Wf(s,s.current,r,n),Oe=y,Ea(0,!1),dt&&typeof dt.onPostCommitFiberRoot=="function")try{dt.onPostCommitFiberRoot(Bl,s)}catch{}return!0}finally{H.p=a,M.T=l,vd(e,t)}}function Sd(e,t,n){t=jt(n,t),t=Gu(e.stateNode,t,2),e=yn(e,t,2),e!==null&&(Yl(e,2),Vt(e))}function Ne(e,t,n){if(e.tag===3)Sd(e,e,n);else for(;t!==null;){if(t.tag===3){Sd(t,e,n);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Tn===null||!Tn.has(l))){e=jt(n,e),n=Tf(2),l=yn(t,n,2),l!==null&&(xf(n,l,t,e),Yl(l,2),Vt(l));break}}t=t.return}}function mc(e,t,n){var l=e.pingCache;if(l===null){l=e.pingCache=new lp;var a=new Set;l.set(t,a)}else a=l.get(t),a===void 0&&(a=new Set,l.set(t,a));a.has(n)||(ic=!0,a.add(n),e=cp.bind(null,e,t,n),t.then(e,e))}function cp(e,t,n){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Ce===e&&(ve&n)===n&&(ke===4||ke===3&&(ve&62914560)===ve&&300>ft()-qi?(Oe&2)===0&&wl(e,0):sc|=n,Cl===ve&&(Cl=0)),Vt(e)}function Td(e,t){t===0&&(t=go()),e=Vn(e,t),e!==null&&(Yl(e,t),Vt(e))}function op(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Td(e,n)}function rp(e,t){var n=0;switch(e.tag){case 31:case 13:var l=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(o(314))}l!==null&&l.delete(t),Td(e,n)}function fp(e,t){return As(e,t)}var Zi=null,Ul=null,gc=!1,Xi=!1,yc=!1,On=0;function Vt(e){e!==Ul&&e.next===null&&(Ul===null?Zi=Ul=e:Ul=Ul.next=e),Xi=!0,gc||(gc=!0,mp())}function Ea(e,t){if(!yc&&Xi){yc=!0;do for(var n=!1,l=Zi;l!==null;){if(e!==0){var a=l.pendingLanes;if(a===0)var s=0;else{var r=l.suspendedLanes,y=l.pingedLanes;s=(1<<31-mt(42|e)+1)-1,s&=a&~(r&~y),s=s&201326741?s&201326741|1:s?s|2:0}s!==0&&(n=!0,jd(l,s))}else s=ve,s=Ja(l,l===Ce?s:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(s&3)===0||Gl(l,s)||(n=!0,jd(l,s));l=l.next}while(n);yc=!1}}function dp(){xd()}function xd(){Xi=gc=!1;var e=0;On!==0&&Ep()&&(e=On);for(var t=ft(),n=null,l=Zi;l!==null;){var a=l.next,s=Ed(l,t);s===0?(l.next=null,n===null?Zi=a:n.next=a,a===null&&(Ul=n)):(n=l,(e!==0||(s&3)!==0)&&(Xi=!0)),l=a}Xe!==0&&Xe!==5||Ea(e),On!==0&&(On=0)}function Ed(e,t){for(var n=e.suspendedLanes,l=e.pingedLanes,a=e.expirationTimes,s=e.pendingLanes&-62914561;0<s;){var r=31-mt(s),y=1<<r,b=a[r];b===-1?((y&n)===0||(y&l)!==0)&&(a[r]=Vg(y,t)):b<=t&&(e.expiredLanes|=y),s&=~y}if(t=Ce,n=ve,n=Ja(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,n===0||e===t&&(Ae===2||Ae===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&Ns(l),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Gl(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(l!==null&&Ns(l),zs(n)){case 2:case 8:n=fo;break;case 32:n=Xa;break;case 268435456:n=mo;break;default:n=Xa}return l=Od.bind(null,e),n=As(n,l),e.callbackPriority=t,e.callbackNode=n,t}return l!==null&&l!==null&&Ns(l),e.callbackPriority=2,e.callbackNode=null,2}function Od(e,t){if(Xe!==0&&Xe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Yi()&&e.callbackNode!==n)return null;var l=ve;return l=Ja(e,e===Ce?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(id(e,l,t),Ed(e,ft()),e.callbackNode!=null&&e.callbackNode===n?Od.bind(null,e):null)}function jd(e,t){if(Yi())return null;id(e,t,!0)}function mp(){jp(function(){(Oe&6)!==0?As(ro,dp):xd()})}function pc(){if(On===0){var e=Sl;e===0&&(e=Qa,Qa<<=1,(Qa&261888)===0&&(Qa=256)),On=e}return On}function Ad(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Pa(""+e)}function Nd(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function gp(e,t,n,l,a){if(t==="submit"&&n&&n.stateNode===a){var s=Ad((a[at]||null).action),r=l.submitter;r&&(t=(t=r[at]||null)?Ad(t.formAction):r.getAttribute("formAction"),t!==null&&(s=t,r=null));var y=new li("action","action",null,l,a);e.push({event:y,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(On!==0){var b=r?Nd(a,r):new FormData(a);ku(n,{pending:!0,data:b,method:a.method,action:s},null,b)}}else typeof s=="function"&&(y.preventDefault(),b=r?Nd(a,r):new FormData(a),ku(n,{pending:!0,data:b,method:a.method,action:s},s,b))},currentTarget:a}]})}}for(var hc=0;hc<Ps.length;hc++){var vc=Ps[hc],yp=vc.toLowerCase(),pp=vc[0].toUpperCase()+vc.slice(1);wt(yp,"on"+pp)}wt(lr,"onAnimationEnd"),wt(ar,"onAnimationIteration"),wt(ir,"onAnimationStart"),wt("dblclick","onDoubleClick"),wt("focusin","onFocus"),wt("focusout","onBlur"),wt(_y,"onTransitionRun"),wt(wy,"onTransitionStart"),wt(Ry,"onTransitionCancel"),wt(sr,"onTransitionEnd"),sl("onMouseEnter",["mouseout","mouseover"]),sl("onMouseLeave",["mouseout","mouseover"]),sl("onPointerEnter",["pointerout","pointerover"]),sl("onPointerLeave",["pointerout","pointerover"]),Un("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Un("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Un("onBeforeInput",["compositionend","keypress","textInput","paste"]),Un("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Un("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Un("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Oa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),hp=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Oa));function Md(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var l=e[n],a=l.event;l=l.listeners;e:{var s=void 0;if(t)for(var r=l.length-1;0<=r;r--){var y=l[r],b=y.instance,N=y.currentTarget;if(y=y.listener,b!==s&&a.isPropagationStopped())break e;s=y,a.currentTarget=N;try{s(a)}catch(_){si(_)}a.currentTarget=null,s=b}else for(r=0;r<l.length;r++){if(y=l[r],b=y.instance,N=y.currentTarget,y=y.listener,b!==s&&a.isPropagationStopped())break e;s=y,a.currentTarget=N;try{s(a)}catch(_){si(_)}a.currentTarget=null,s=b}}}}function he(e,t){var n=t[Cs];n===void 0&&(n=t[Cs]=new Set);var l=e+"__bubble";n.has(l)||(Dd(t,e,2,!1),n.add(l))}function bc(e,t,n){var l=0;t&&(l|=4),Dd(n,e,l,t)}var Qi="_reactListening"+Math.random().toString(36).slice(2);function Sc(e){if(!e[Qi]){e[Qi]=!0,To.forEach(function(n){n!=="selectionchange"&&(hp.has(n)||bc(n,!1,e),bc(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Qi]||(t[Qi]=!0,bc("selectionchange",!1,t))}}function Dd(e,t,n,l){switch(am(t)){case 2:var a=Xp;break;case 8:a=Qp;break;default:a=Uc}n=a.bind(null,t,n,e),a=void 0,!Ls||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),l?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function Tc(e,t,n,l,a){var s=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var r=l.tag;if(r===3||r===4){var y=l.stateNode.containerInfo;if(y===a)break;if(r===4)for(r=l.return;r!==null;){var b=r.tag;if((b===3||b===4)&&r.stateNode.containerInfo===a)return;r=r.return}for(;y!==null;){if(r=ll(y),r===null)return;if(b=r.tag,b===5||b===6||b===26||b===27){l=s=r;continue e}y=y.parentNode}}l=l.return}wo(function(){var N=s,_=Hs(n),U=[];e:{var D=ur.get(e);if(D!==void 0){var z=li,J=e;switch(e){case"keypress":if(ti(n)===0)break e;case"keydown":case"keyup":z=ry;break;case"focusin":J="focus",z=Zs;break;case"focusout":J="blur",z=Zs;break;case"beforeblur":case"afterblur":z=Zs;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":z=ko;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":z=Ig;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":z=my;break;case lr:case ar:case ir:z=ty;break;case sr:z=yy;break;case"scroll":case"scrollend":z=Fg;break;case"wheel":z=hy;break;case"copy":case"cut":case"paste":z=ly;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":z=Ho;break;case"toggle":case"beforetoggle":z=by}var le=(t&4)!==0,ze=!le&&(e==="scroll"||e==="scrollend"),O=le?D!==null?D+"Capture":null:D;le=[];for(var E=N,A;E!==null;){var R=E;if(A=R.stateNode,R=R.tag,R!==5&&R!==26&&R!==27||A===null||O===null||(R=Ql(E,O),R!=null&&le.push(ja(E,R,A))),ze)break;E=E.return}0<le.length&&(D=new z(D,J,null,n,_),U.push({event:D,listeners:le}))}}if((t&7)===0){e:{if(D=e==="mouseover"||e==="pointerover",z=e==="mouseout"||e==="pointerout",D&&n!==qs&&(J=n.relatedTarget||n.fromElement)&&(ll(J)||J[nl]))break e;if((z||D)&&(D=_.window===_?_:(D=_.ownerDocument)?D.defaultView||D.parentWindow:window,z?(J=n.relatedTarget||n.toElement,z=N,J=J?ll(J):null,J!==null&&(ze=h(J),le=J.tag,J!==ze||le!==5&&le!==27&&le!==6)&&(J=null)):(z=null,J=N),z!==J)){if(le=ko,R="onMouseLeave",O="onMouseEnter",E="mouse",(e==="pointerout"||e==="pointerover")&&(le=Ho,R="onPointerLeave",O="onPointerEnter",E="pointer"),ze=z==null?D:Xl(z),A=J==null?D:Xl(J),D=new le(R,E+"leave",z,n,_),D.target=ze,D.relatedTarget=A,R=null,ll(_)===N&&(le=new le(O,E+"enter",J,n,_),le.target=A,le.relatedTarget=ze,R=le),ze=R,z&&J)t:{for(le=vp,O=z,E=J,A=0,R=O;R;R=le(R))A++;R=0;for(var te=E;te;te=le(te))R++;for(;0<A-R;)O=le(O),A--;for(;0<R-A;)E=le(E),R--;for(;A--;){if(O===E||E!==null&&O===E.alternate){le=O;break t}O=le(O),E=le(E)}le=null}else le=null;z!==null&&zd(U,D,z,le,!1),J!==null&&ze!==null&&zd(U,ze,J,le,!0)}}e:{if(D=N?Xl(N):window,z=D.nodeName&&D.nodeName.toLowerCase(),z==="select"||z==="input"&&D.type==="file")var xe=Qo;else if(Zo(D))if($o)xe=Dy;else{xe=Ny;var W=Ay}else z=D.nodeName,!z||z.toLowerCase()!=="input"||D.type!=="checkbox"&&D.type!=="radio"?N&&ks(N.elementType)&&(xe=Qo):xe=My;if(xe&&(xe=xe(e,N))){Xo(U,xe,n,_);break e}W&&W(e,D,N),e==="focusout"&&N&&D.type==="number"&&N.memoizedProps.value!=null&&Us(D,"number",D.value)}switch(W=N?Xl(N):window,e){case"focusin":(Zo(W)||W.contentEditable==="true")&&(dl=W,Fs=N,ea=null);break;case"focusout":ea=Fs=dl=null;break;case"mousedown":Ws=!0;break;case"contextmenu":case"mouseup":case"dragend":Ws=!1,tr(U,n,_);break;case"selectionchange":if(Cy)break;case"keydown":case"keyup":tr(U,n,_)}var me;if(Qs)e:{switch(e){case"compositionstart":var be="onCompositionStart";break e;case"compositionend":be="onCompositionEnd";break e;case"compositionupdate":be="onCompositionUpdate";break e}be=void 0}else fl?Go(e,n)&&(be="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(be="onCompositionStart");be&&(Vo&&n.locale!=="ko"&&(fl||be!=="onCompositionStart"?be==="onCompositionEnd"&&fl&&(me=Ro()):(cn=_,Bs="value"in cn?cn.value:cn.textContent,fl=!0)),W=$i(N,be),0<W.length&&(be=new qo(be,e,null,n,_),U.push({event:be,listeners:W}),me?be.data=me:(me=Yo(n),me!==null&&(be.data=me)))),(me=Ty?xy(e,n):Ey(e,n))&&(be=$i(N,"onBeforeInput"),0<be.length&&(W=new qo("onBeforeInput","beforeinput",null,n,_),U.push({event:W,listeners:be}),W.data=me)),gp(U,e,N,n,_)}Md(U,t)})}function ja(e,t,n){return{instance:e,listener:t,currentTarget:n}}function $i(e,t){for(var n=t+"Capture",l=[];e!==null;){var a=e,s=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||s===null||(a=Ql(e,n),a!=null&&l.unshift(ja(e,a,s)),a=Ql(e,t),a!=null&&l.push(ja(e,a,s))),e.tag===3)return l;e=e.return}return[]}function vp(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function zd(e,t,n,l,a){for(var s=t._reactName,r=[];n!==null&&n!==l;){var y=n,b=y.alternate,N=y.stateNode;if(y=y.tag,b!==null&&b===l)break;y!==5&&y!==26&&y!==27||N===null||(b=N,a?(N=Ql(n,s),N!=null&&r.unshift(ja(n,N,b))):a||(N=Ql(n,s),N!=null&&r.push(ja(n,N,b)))),n=n.return}r.length!==0&&e.push({event:t,listeners:r})}var bp=/\r\n?/g,Sp=/\u0000|\uFFFD/g;function Cd(e){return(typeof e=="string"?e:""+e).replace(bp,`
`).replace(Sp,"")}function _d(e,t){return t=Cd(t),Cd(e)===t}function De(e,t,n,l,a,s){switch(n){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||cl(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&cl(e,""+l);break;case"className":Wa(e,"class",l);break;case"tabIndex":Wa(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Wa(e,n,l);break;case"style":Co(e,l,s);break;case"data":if(t!=="object"){Wa(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Pa(""+l),e.setAttribute(n,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof s=="function"&&(n==="formAction"?(t!=="input"&&De(e,t,"name",a.name,a,null),De(e,t,"formEncType",a.formEncType,a,null),De(e,t,"formMethod",a.formMethod,a,null),De(e,t,"formTarget",a.formTarget,a,null)):(De(e,t,"encType",a.encType,a,null),De(e,t,"method",a.method,a,null),De(e,t,"target",a.target,a,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Pa(""+l),e.setAttribute(n,l);break;case"onClick":l!=null&&(e.onclick=Gt);break;case"onScroll":l!=null&&he("scroll",e);break;case"onScrollEnd":l!=null&&he("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(o(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(o(60));e.innerHTML=n}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}n=Pa(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""+l):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":l===!0?e.setAttribute(n,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,l):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(n,l):e.removeAttribute(n);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(n):e.setAttribute(n,l);break;case"popover":he("beforetoggle",e),he("toggle",e),Fa(e,"popover",l);break;case"xlinkActuate":Bt(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Bt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Bt(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Bt(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Bt(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Bt(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Bt(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Bt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Bt(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Fa(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=Kg.get(n)||n,Fa(e,n,l))}}function xc(e,t,n,l,a,s){switch(n){case"style":Co(e,l,s);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(o(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(o(60));e.innerHTML=n}}break;case"children":typeof l=="string"?cl(e,l):(typeof l=="number"||typeof l=="bigint")&&cl(e,""+l);break;case"onScroll":l!=null&&he("scroll",e);break;case"onScrollEnd":l!=null&&he("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Gt);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!xo.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),t=n.slice(2,a?n.length-7:void 0),s=e[at]||null,s=s!=null?s[n]:null,typeof s=="function"&&e.removeEventListener(t,s,a),typeof l=="function")){typeof s!="function"&&s!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,l,a);break e}n in e?e[n]=l:l===!0?e.setAttribute(n,""):Fa(e,n,l)}}}function Pe(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":he("error",e),he("load",e);var l=!1,a=!1,s;for(s in n)if(n.hasOwnProperty(s)){var r=n[s];if(r!=null)switch(s){case"src":l=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(o(137,t));default:De(e,t,s,r,n,null)}}a&&De(e,t,"srcSet",n.srcSet,n,null),l&&De(e,t,"src",n.src,n,null);return;case"input":he("invalid",e);var y=s=r=a=null,b=null,N=null;for(l in n)if(n.hasOwnProperty(l)){var _=n[l];if(_!=null)switch(l){case"name":a=_;break;case"type":r=_;break;case"checked":b=_;break;case"defaultChecked":N=_;break;case"value":s=_;break;case"defaultValue":y=_;break;case"children":case"dangerouslySetInnerHTML":if(_!=null)throw Error(o(137,t));break;default:De(e,t,l,_,n,null)}}No(e,s,y,b,N,r,a,!1);return;case"select":he("invalid",e),l=r=s=null;for(a in n)if(n.hasOwnProperty(a)&&(y=n[a],y!=null))switch(a){case"value":s=y;break;case"defaultValue":r=y;break;case"multiple":l=y;default:De(e,t,a,y,n,null)}t=s,n=r,e.multiple=!!l,t!=null?ul(e,!!l,t,!1):n!=null&&ul(e,!!l,n,!0);return;case"textarea":he("invalid",e),s=a=l=null;for(r in n)if(n.hasOwnProperty(r)&&(y=n[r],y!=null))switch(r){case"value":l=y;break;case"defaultValue":a=y;break;case"children":s=y;break;case"dangerouslySetInnerHTML":if(y!=null)throw Error(o(91));break;default:De(e,t,r,y,n,null)}Do(e,l,a,s);return;case"option":for(b in n)n.hasOwnProperty(b)&&(l=n[b],l!=null)&&(b==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":De(e,t,b,l,n,null));return;case"dialog":he("beforetoggle",e),he("toggle",e),he("cancel",e),he("close",e);break;case"iframe":case"object":he("load",e);break;case"video":case"audio":for(l=0;l<Oa.length;l++)he(Oa[l],e);break;case"image":he("error",e),he("load",e);break;case"details":he("toggle",e);break;case"embed":case"source":case"link":he("error",e),he("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(N in n)if(n.hasOwnProperty(N)&&(l=n[N],l!=null))switch(N){case"children":case"dangerouslySetInnerHTML":throw Error(o(137,t));default:De(e,t,N,l,n,null)}return;default:if(ks(t)){for(_ in n)n.hasOwnProperty(_)&&(l=n[_],l!==void 0&&xc(e,t,_,l,n,void 0));return}}for(y in n)n.hasOwnProperty(y)&&(l=n[y],l!=null&&De(e,t,y,l,n,null))}function Tp(e,t,n,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,s=null,r=null,y=null,b=null,N=null,_=null;for(z in n){var U=n[z];if(n.hasOwnProperty(z)&&U!=null)switch(z){case"checked":break;case"value":break;case"defaultValue":b=U;default:l.hasOwnProperty(z)||De(e,t,z,null,l,U)}}for(var D in l){var z=l[D];if(U=n[D],l.hasOwnProperty(D)&&(z!=null||U!=null))switch(D){case"type":s=z;break;case"name":a=z;break;case"checked":N=z;break;case"defaultChecked":_=z;break;case"value":r=z;break;case"defaultValue":y=z;break;case"children":case"dangerouslySetInnerHTML":if(z!=null)throw Error(o(137,t));break;default:z!==U&&De(e,t,D,z,l,U)}}Rs(e,r,y,b,N,_,s,a);return;case"select":z=r=y=D=null;for(s in n)if(b=n[s],n.hasOwnProperty(s)&&b!=null)switch(s){case"value":break;case"multiple":z=b;default:l.hasOwnProperty(s)||De(e,t,s,null,l,b)}for(a in l)if(s=l[a],b=n[a],l.hasOwnProperty(a)&&(s!=null||b!=null))switch(a){case"value":D=s;break;case"defaultValue":y=s;break;case"multiple":r=s;default:s!==b&&De(e,t,a,s,l,b)}t=y,n=r,l=z,D!=null?ul(e,!!n,D,!1):!!l!=!!n&&(t!=null?ul(e,!!n,t,!0):ul(e,!!n,n?[]:"",!1));return;case"textarea":z=D=null;for(y in n)if(a=n[y],n.hasOwnProperty(y)&&a!=null&&!l.hasOwnProperty(y))switch(y){case"value":break;case"children":break;default:De(e,t,y,null,l,a)}for(r in l)if(a=l[r],s=n[r],l.hasOwnProperty(r)&&(a!=null||s!=null))switch(r){case"value":D=a;break;case"defaultValue":z=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(o(91));break;default:a!==s&&De(e,t,r,a,l,s)}Mo(e,D,z);return;case"option":for(var J in n)D=n[J],n.hasOwnProperty(J)&&D!=null&&!l.hasOwnProperty(J)&&(J==="selected"?e.selected=!1:De(e,t,J,null,l,D));for(b in l)D=l[b],z=n[b],l.hasOwnProperty(b)&&D!==z&&(D!=null||z!=null)&&(b==="selected"?e.selected=D&&typeof D!="function"&&typeof D!="symbol":De(e,t,b,D,l,z));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var le in n)D=n[le],n.hasOwnProperty(le)&&D!=null&&!l.hasOwnProperty(le)&&De(e,t,le,null,l,D);for(N in l)if(D=l[N],z=n[N],l.hasOwnProperty(N)&&D!==z&&(D!=null||z!=null))switch(N){case"children":case"dangerouslySetInnerHTML":if(D!=null)throw Error(o(137,t));break;default:De(e,t,N,D,l,z)}return;default:if(ks(t)){for(var ze in n)D=n[ze],n.hasOwnProperty(ze)&&D!==void 0&&!l.hasOwnProperty(ze)&&xc(e,t,ze,void 0,l,D);for(_ in l)D=l[_],z=n[_],!l.hasOwnProperty(_)||D===z||D===void 0&&z===void 0||xc(e,t,_,D,l,z);return}}for(var O in n)D=n[O],n.hasOwnProperty(O)&&D!=null&&!l.hasOwnProperty(O)&&De(e,t,O,null,l,D);for(U in l)D=l[U],z=n[U],!l.hasOwnProperty(U)||D===z||D==null&&z==null||De(e,t,U,D,l,z)}function wd(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function xp(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),l=0;l<n.length;l++){var a=n[l],s=a.transferSize,r=a.initiatorType,y=a.duration;if(s&&y&&wd(r)){for(r=0,y=a.responseEnd,l+=1;l<n.length;l++){var b=n[l],N=b.startTime;if(N>y)break;var _=b.transferSize,U=b.initiatorType;_&&wd(U)&&(b=b.responseEnd,r+=_*(b<y?1:(y-N)/(b-N)))}if(--l,t+=8*(s+r)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Ec=null,Oc=null;function Ki(e){return e.nodeType===9?e:e.ownerDocument}function Rd(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Ud(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function jc(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ac=null;function Ep(){var e=window.event;return e&&e.type==="popstate"?e===Ac?!1:(Ac=e,!0):(Ac=null,!1)}var kd=typeof setTimeout=="function"?setTimeout:void 0,Op=typeof clearTimeout=="function"?clearTimeout:void 0,qd=typeof Promise=="function"?Promise:void 0,jp=typeof queueMicrotask=="function"?queueMicrotask:typeof qd<"u"?function(e){return qd.resolve(null).then(e).catch(Ap)}:kd;function Ap(e){setTimeout(function(){throw e})}function jn(e){return e==="head"}function Hd(e,t){var n=t,l=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(l===0){e.removeChild(a),Vl(t);return}l--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")l++;else if(n==="html")Aa(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Aa(n);for(var s=n.firstChild;s;){var r=s.nextSibling,y=s.nodeName;s[Zl]||y==="SCRIPT"||y==="STYLE"||y==="LINK"&&s.rel.toLowerCase()==="stylesheet"||n.removeChild(s),s=r}}else n==="body"&&Aa(e.ownerDocument.body);n=a}while(n);Vl(t)}function Vd(e,t){var n=e;e=0;do{var l=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=l}while(n)}function Nc(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Nc(n),_s(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function Np(e,t,n,l){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Zl])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(s=e.getAttribute("rel"),s==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(s!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(s=e.getAttribute("src"),(s!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&s&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var s=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===s)return e}else return e;if(e=zt(e.nextSibling),e===null)break}return null}function Mp(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=zt(e.nextSibling),e===null))return null;return e}function Ld(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=zt(e.nextSibling),e===null))return null;return e}function Mc(e){return e.data==="$?"||e.data==="$~"}function Dc(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Dp(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var l=function(){t(),n.removeEventListener("DOMContentLoaded",l)};n.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function zt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var zc=null;function Bd(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return zt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Gd(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function Yd(e,t,n){switch(t=Ki(n),e){case"html":if(e=t.documentElement,!e)throw Error(o(452));return e;case"head":if(e=t.head,!e)throw Error(o(453));return e;case"body":if(e=t.body,!e)throw Error(o(454));return e;default:throw Error(o(451))}}function Aa(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);_s(e)}var Ct=new Map,Zd=new Set;function Ji(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var an=H.d;H.d={f:zp,r:Cp,D:_p,C:wp,L:Rp,m:Up,X:qp,S:kp,M:Hp};function zp(){var e=an.f(),t=Li();return e||t}function Cp(e){var t=al(e);t!==null&&t.tag===5&&t.type==="form"?uf(t):an.r(e)}var kl=typeof document>"u"?null:document;function Xd(e,t,n){var l=kl;if(l&&typeof t=="string"&&t){var a=Et(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),Zd.has(a)||(Zd.add(a),e={rel:e,crossOrigin:n,href:t},l.querySelector(a)===null&&(t=l.createElement("link"),Pe(t,"link",e),Qe(t),l.head.appendChild(t)))}}function _p(e){an.D(e),Xd("dns-prefetch",e,null)}function wp(e,t){an.C(e,t),Xd("preconnect",e,t)}function Rp(e,t,n){an.L(e,t,n);var l=kl;if(l&&e&&t){var a='link[rel="preload"][as="'+Et(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+Et(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+Et(n.imageSizes)+'"]')):a+='[href="'+Et(e)+'"]';var s=a;switch(t){case"style":s=ql(e);break;case"script":s=Hl(e)}Ct.has(s)||(e=S({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),Ct.set(s,e),l.querySelector(a)!==null||t==="style"&&l.querySelector(Na(s))||t==="script"&&l.querySelector(Ma(s))||(t=l.createElement("link"),Pe(t,"link",e),Qe(t),l.head.appendChild(t)))}}function Up(e,t){an.m(e,t);var n=kl;if(n&&e){var l=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+Et(l)+'"][href="'+Et(e)+'"]',s=a;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":s=Hl(e)}if(!Ct.has(s)&&(e=S({rel:"modulepreload",href:e},t),Ct.set(s,e),n.querySelector(a)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Ma(s)))return}l=n.createElement("link"),Pe(l,"link",e),Qe(l),n.head.appendChild(l)}}}function kp(e,t,n){an.S(e,t,n);var l=kl;if(l&&e){var a=il(l).hoistableStyles,s=ql(e);t=t||"default";var r=a.get(s);if(!r){var y={loading:0,preload:null};if(r=l.querySelector(Na(s)))y.loading=5;else{e=S({rel:"stylesheet",href:e,"data-precedence":t},n),(n=Ct.get(s))&&Cc(e,n);var b=r=l.createElement("link");Qe(b),Pe(b,"link",e),b._p=new Promise(function(N,_){b.onload=N,b.onerror=_}),b.addEventListener("load",function(){y.loading|=1}),b.addEventListener("error",function(){y.loading|=2}),y.loading|=4,Fi(r,t,l)}r={type:"stylesheet",instance:r,count:1,state:y},a.set(s,r)}}}function qp(e,t){an.X(e,t);var n=kl;if(n&&e){var l=il(n).hoistableScripts,a=Hl(e),s=l.get(a);s||(s=n.querySelector(Ma(a)),s||(e=S({src:e,async:!0},t),(t=Ct.get(a))&&_c(e,t),s=n.createElement("script"),Qe(s),Pe(s,"link",e),n.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},l.set(a,s))}}function Hp(e,t){an.M(e,t);var n=kl;if(n&&e){var l=il(n).hoistableScripts,a=Hl(e),s=l.get(a);s||(s=n.querySelector(Ma(a)),s||(e=S({src:e,async:!0,type:"module"},t),(t=Ct.get(a))&&_c(e,t),s=n.createElement("script"),Qe(s),Pe(s,"link",e),n.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},l.set(a,s))}}function Qd(e,t,n,l){var a=(a=ye.current)?Ji(a):null;if(!a)throw Error(o(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=ql(n.href),n=il(a).hoistableStyles,l=n.get(t),l||(l={type:"style",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=ql(n.href);var s=il(a).hoistableStyles,r=s.get(e);if(r||(a=a.ownerDocument||a,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},s.set(e,r),(s=a.querySelector(Na(e)))&&!s._p&&(r.instance=s,r.state.loading=5),Ct.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Ct.set(e,n),s||Vp(a,e,n,r.state))),t&&l===null)throw Error(o(528,""));return r}if(t&&l!==null)throw Error(o(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Hl(n),n=il(a).hoistableScripts,l=n.get(t),l||(l={type:"script",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(o(444,e))}}function ql(e){return'href="'+Et(e)+'"'}function Na(e){return'link[rel="stylesheet"]['+e+"]"}function $d(e){return S({},e,{"data-precedence":e.precedence,precedence:null})}function Vp(e,t,n,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),Pe(t,"link",n),Qe(t),e.head.appendChild(t))}function Hl(e){return'[src="'+Et(e)+'"]'}function Ma(e){return"script[async]"+e}function Kd(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Et(n.href)+'"]');if(l)return t.instance=l,Qe(l),l;var a=S({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),Qe(l),Pe(l,"style",a),Fi(l,n.precedence,e),t.instance=l;case"stylesheet":a=ql(n.href);var s=e.querySelector(Na(a));if(s)return t.state.loading|=4,t.instance=s,Qe(s),s;l=$d(n),(a=Ct.get(a))&&Cc(l,a),s=(e.ownerDocument||e).createElement("link"),Qe(s);var r=s;return r._p=new Promise(function(y,b){r.onload=y,r.onerror=b}),Pe(s,"link",l),t.state.loading|=4,Fi(s,n.precedence,e),t.instance=s;case"script":return s=Hl(n.src),(a=e.querySelector(Ma(s)))?(t.instance=a,Qe(a),a):(l=n,(a=Ct.get(s))&&(l=S({},n),_c(l,a)),e=e.ownerDocument||e,a=e.createElement("script"),Qe(a),Pe(a,"link",l),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(o(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Fi(l,n.precedence,e));return t.instance}function Fi(e,t,n){for(var l=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=l.length?l[l.length-1]:null,s=a,r=0;r<l.length;r++){var y=l[r];if(y.dataset.precedence===t)s=y;else if(s!==a)break}s?s.parentNode.insertBefore(e,s.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Cc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function _c(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Wi=null;function Jd(e,t,n){if(Wi===null){var l=new Map,a=Wi=new Map;a.set(n,l)}else a=Wi,l=a.get(n),l||(l=new Map,a.set(n,l));if(l.has(e))return l;for(l.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var s=n[a];if(!(s[Zl]||s[Je]||e==="link"&&s.getAttribute("rel")==="stylesheet")&&s.namespaceURI!=="http://www.w3.org/2000/svg"){var r=s.getAttribute(t)||"";r=e+r;var y=l.get(r);y?y.push(s):l.set(r,[s])}}return l}function Fd(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function Lp(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Wd(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Bp(e,t,n,l){if(n.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=ql(l.href),s=t.querySelector(Na(a));if(s){t=s._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Ii.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=s,Qe(s);return}s=t.ownerDocument||t,l=$d(l),(a=Ct.get(a))&&Cc(l,a),s=s.createElement("link"),Qe(s);var r=s;r._p=new Promise(function(y,b){r.onload=y,r.onerror=b}),Pe(s,"link",l),n.instance=s}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Ii.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var wc=0;function Gp(e,t){return e.stylesheets&&e.count===0&&es(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var l=setTimeout(function(){if(e.stylesheets&&es(e,e.stylesheets),e.unsuspend){var s=e.unsuspend;e.unsuspend=null,s()}},6e4+t);0<e.imgBytes&&wc===0&&(wc=62500*xp());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&es(e,e.stylesheets),e.unsuspend)){var s=e.unsuspend;e.unsuspend=null,s()}},(e.imgBytes>wc?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(a)}}:null}function Ii(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)es(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Pi=null;function es(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Pi=new Map,t.forEach(Yp,e),Pi=null,Ii.call(e))}function Yp(e,t){if(!(t.state.loading&4)){var n=Pi.get(e);if(n)var l=n.get(null);else{n=new Map,Pi.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),s=0;s<a.length;s++){var r=a[s];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(n.set(r.dataset.precedence,r),l=r)}l&&n.set(null,l)}a=t.instance,r=a.getAttribute("data-precedence"),s=n.get(r)||l,s===l&&n.set(null,a),n.set(r,a),this.count++,l=Ii.bind(this),a.addEventListener("load",l),a.addEventListener("error",l),s?s.parentNode.insertBefore(a,s.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var Da={$$typeof:de,Provider:null,Consumer:null,_currentValue:K,_currentValue2:K,_threadCount:0};function Zp(e,t,n,l,a,s,r,y,b){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ms(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ms(0),this.hiddenUpdates=Ms(null),this.identifierPrefix=l,this.onUncaughtError=a,this.onCaughtError=s,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=b,this.incompleteTransitions=new Map}function Id(e,t,n,l,a,s,r,y,b,N,_,U){return e=new Zp(e,t,n,r,b,N,_,U,y),t=1,s===!0&&(t|=24),s=yt(3,null,null,t),e.current=s,s.stateNode=e,t=du(),t.refCount++,e.pooledCache=t,t.refCount++,s.memoizedState={element:l,isDehydrated:n,cache:t},pu(s),e}function Pd(e){return e?(e=yl,e):yl}function em(e,t,n,l,a,s){a=Pd(a),l.context===null?l.context=a:l.pendingContext=a,l=gn(t),l.payload={element:n},s=s===void 0?null:s,s!==null&&(l.callback=s),n=yn(e,l,t),n!==null&&(rt(n,e,t),ua(n,e,t))}function tm(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Rc(e,t){tm(e,t),(e=e.alternate)&&tm(e,t)}function nm(e){if(e.tag===13||e.tag===31){var t=Vn(e,67108864);t!==null&&rt(t,e,67108864),Rc(e,67108864)}}function lm(e){if(e.tag===13||e.tag===31){var t=St();t=Ds(t);var n=Vn(e,t);n!==null&&rt(n,e,t),Rc(e,t)}}var ts=!0;function Xp(e,t,n,l){var a=M.T;M.T=null;var s=H.p;try{H.p=2,Uc(e,t,n,l)}finally{H.p=s,M.T=a}}function Qp(e,t,n,l){var a=M.T;M.T=null;var s=H.p;try{H.p=8,Uc(e,t,n,l)}finally{H.p=s,M.T=a}}function Uc(e,t,n,l){if(ts){var a=kc(l);if(a===null)Tc(e,t,l,ns,n),im(e,l);else if(Kp(a,e,t,n,l))l.stopPropagation();else if(im(e,l),t&4&&-1<$p.indexOf(e)){for(;a!==null;){var s=al(a);if(s!==null)switch(s.tag){case 3:if(s=s.stateNode,s.current.memoizedState.isDehydrated){var r=Rn(s.pendingLanes);if(r!==0){var y=s;for(y.pendingLanes|=2,y.entangledLanes|=2;r;){var b=1<<31-mt(r);y.entanglements[1]|=b,r&=~b}Vt(s),(Oe&6)===0&&(Hi=ft()+500,Ea(0))}}break;case 31:case 13:y=Vn(s,2),y!==null&&rt(y,s,2),Li(),Rc(s,2)}if(s=kc(l),s===null&&Tc(e,t,l,ns,n),s===a)break;a=s}a!==null&&l.stopPropagation()}else Tc(e,t,l,null,n)}}function kc(e){return e=Hs(e),qc(e)}var ns=null;function qc(e){if(ns=null,e=ll(e),e!==null){var t=h(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=m(t),e!==null)return e;e=null}else if(n===31){if(e=d(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return ns=e,null}function am(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(_g()){case ro:return 2;case fo:return 8;case Xa:case wg:return 32;case mo:return 268435456;default:return 32}default:return 32}}var Hc=!1,An=null,Nn=null,Mn=null,za=new Map,Ca=new Map,Dn=[],$p="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function im(e,t){switch(e){case"focusin":case"focusout":An=null;break;case"dragenter":case"dragleave":Nn=null;break;case"mouseover":case"mouseout":Mn=null;break;case"pointerover":case"pointerout":za.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ca.delete(t.pointerId)}}function _a(e,t,n,l,a,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:l,nativeEvent:s,targetContainers:[a]},t!==null&&(t=al(t),t!==null&&nm(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function Kp(e,t,n,l,a){switch(t){case"focusin":return An=_a(An,e,t,n,l,a),!0;case"dragenter":return Nn=_a(Nn,e,t,n,l,a),!0;case"mouseover":return Mn=_a(Mn,e,t,n,l,a),!0;case"pointerover":var s=a.pointerId;return za.set(s,_a(za.get(s)||null,e,t,n,l,a)),!0;case"gotpointercapture":return s=a.pointerId,Ca.set(s,_a(Ca.get(s)||null,e,t,n,l,a)),!0}return!1}function sm(e){var t=ll(e.target);if(t!==null){var n=h(t);if(n!==null){if(t=n.tag,t===13){if(t=m(n),t!==null){e.blockedOn=t,bo(e.priority,function(){lm(n)});return}}else if(t===31){if(t=d(n),t!==null){e.blockedOn=t,bo(e.priority,function(){lm(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ls(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=kc(e.nativeEvent);if(n===null){n=e.nativeEvent;var l=new n.constructor(n.type,n);qs=l,n.target.dispatchEvent(l),qs=null}else return t=al(n),t!==null&&nm(t),e.blockedOn=n,!1;t.shift()}return!0}function um(e,t,n){ls(e)&&n.delete(t)}function Jp(){Hc=!1,An!==null&&ls(An)&&(An=null),Nn!==null&&ls(Nn)&&(Nn=null),Mn!==null&&ls(Mn)&&(Mn=null),za.forEach(um),Ca.forEach(um)}function as(e,t){e.blockedOn===t&&(e.blockedOn=null,Hc||(Hc=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,Jp)))}var is=null;function cm(e){is!==e&&(is=e,i.unstable_scheduleCallback(i.unstable_NormalPriority,function(){is===e&&(is=null);for(var t=0;t<e.length;t+=3){var n=e[t],l=e[t+1],a=e[t+2];if(typeof l!="function"){if(qc(l||n)===null)continue;break}var s=al(n);s!==null&&(e.splice(t,3),t-=3,ku(s,{pending:!0,data:a,method:n.method,action:l},l,a))}}))}function Vl(e){function t(b){return as(b,e)}An!==null&&as(An,e),Nn!==null&&as(Nn,e),Mn!==null&&as(Mn,e),za.forEach(t),Ca.forEach(t);for(var n=0;n<Dn.length;n++){var l=Dn[n];l.blockedOn===e&&(l.blockedOn=null)}for(;0<Dn.length&&(n=Dn[0],n.blockedOn===null);)sm(n),n.blockedOn===null&&Dn.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(l=0;l<n.length;l+=3){var a=n[l],s=n[l+1],r=a[at]||null;if(typeof s=="function")r||cm(n);else if(r){var y=null;if(s&&s.hasAttribute("formAction")){if(a=s,r=s[at]||null)y=r.formAction;else if(qc(a)!==null)continue}else y=r.action;typeof y=="function"?n[l+1]=y:(n.splice(l,3),l-=3),cm(n)}}}function om(){function e(s){s.canIntercept&&s.info==="react-transition"&&s.intercept({handler:function(){return new Promise(function(r){return a=r})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),l||setTimeout(n,20)}function n(){if(!l&&!navigation.transition){var s=navigation.currentEntry;s&&s.url!=null&&navigation.navigate(s.url,{state:s.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function Vc(e){this._internalRoot=e}ss.prototype.render=Vc.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(o(409));var n=t.current,l=St();em(n,l,e,t,null,null)},ss.prototype.unmount=Vc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;em(e.current,2,null,e,null,null),Li(),t[nl]=null}};function ss(e){this._internalRoot=e}ss.prototype.unstable_scheduleHydration=function(e){if(e){var t=vo();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Dn.length&&t!==0&&t<Dn[n].priority;n++);Dn.splice(n,0,e),n===0&&sm(e)}};var rm=u.version;if(rm!=="19.2.7")throw Error(o(527,rm,"19.2.7"));H.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(o(188)):(e=Object.keys(e).join(","),Error(o(268,e)));return e=p(t),e=e!==null?x(e):null,e=e===null?null:e.stateNode,e};var Fp={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:M,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var us=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!us.isDisabled&&us.supportsFiber)try{Bl=us.inject(Fp),dt=us}catch{}}return Ra.createRoot=function(e,t){if(!f(e))throw Error(o(299));var n=!1,l="",a=hf,s=vf,r=bf;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=Id(e,1,!1,null,null,n,l,null,a,s,r,om),e[nl]=t.current,Sc(e),new Vc(t)},Ra.hydrateRoot=function(e,t,n){if(!f(e))throw Error(o(299));var l=!1,a="",s=hf,r=vf,y=bf,b=null;return n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(s=n.onUncaughtError),n.onCaughtError!==void 0&&(r=n.onCaughtError),n.onRecoverableError!==void 0&&(y=n.onRecoverableError),n.formState!==void 0&&(b=n.formState)),t=Id(e,1,!0,t,n??null,l,a,b,s,r,y,om),t.context=Pd(null),n=t.current,l=St(),l=Ds(l),a=gn(l),a.callback=null,yn(n,a,l),n=l,t.current.lanes=n,Yl(t,n),Vt(t),e[nl]=t.current,Sc(e),new ss(t)},Ra.version="19.2.7",Ra}var Sm;function sh(){if(Sm)return Gc.exports;Sm=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(u){console.error(u)}}return i(),Gc.exports=ih(),Gc.exports}var uh=sh();const Qm=["FIX.4.2","FIX.4.4","FIX.5.0SP2"];function vs(i){return i==="FIX.5.0SP2"?"FIXT.1.1":i}function Tm(i,u){return i.fields.get(u)?.name}function $m(i,u,c){return i.fields.get(u)?.enums?.get(c)}class ds extends Error{constructor(u,c){super(`${c}: ${u}`),this.path=c,this.name="DictionaryFormatError"}path}function Km(i,u){if(Array.isArray(i)){const[c,o]=i,f=o===1;if(typeof c=="number")return{kind:"field",tag:c,required:f};if(typeof c=="string"&&c.startsWith("#"))return{kind:"component",name:c.slice(1),required:f};throw new ds(`invalid layout ref ${JSON.stringify(c)}`,u)}if(typeof i=="object"&&i!==null&&"g"in i)return{kind:"group",countTag:i.g,required:i.req===1,items:i.items.map((c,o)=>Km(c,`${u}/items/${o}`))};throw new ds(`invalid layout item ${JSON.stringify(i)}`,u)}function cs(i,u){return i.map((c,o)=>Km(c,`${u}/${o}`))}function Jm(i,u){if(i.formatVersion!==1)throw new ds(`unsupported formatVersion ${i.formatVersion}`,"/formatVersion");const c=new Map;for(const[h,m]of Object.entries(i.fields)){const d=Number(h);if(!Number.isInteger(d)||d<=0)throw new ds(`invalid tag '${h}'`,"/fields");const[v,p,x]=m;c.set(d,{tag:d,name:v,type:p,...x?{enums:new Map(Object.entries(x))}:{}})}const o=new Map;for(const[h,m]of Object.entries(i.components))o.set(h,cs(m,`/components/${h}`));const f=new Map;for(const[h,m]of Object.entries(i.messages))f.set(h,{msgType:h,name:m.name,...m.cat?{category:m.cat}:{},items:cs(m.items,`/messages/${h}/items`)});return{version:u,partial:i.partial,fields:c,components:o,header:cs(i.header,"/header"),trailer:cs(i.trailer,"/trailer"),messages:f}}function Va(i,u,c=!1){const o=[];for(const f of i)if(f.kind==="field")o.push(c&&f.required?{...f,required:!1}:f);else if(f.kind==="group"){const h=c?!1:f.required;o.push({kind:"group",countTag:f.countTag,required:h,items:Va(f.items,u,!1)})}else{const h=u.components.get(f.name);h&&o.push(...Va(h,u,c||!f.required))}return o}function Fm(i,u){const c=i.messages.get(u),o=Va(i.header,i),f=Va(i.trailer,i);return{header:o,body:c?Va(c.items,i):[],trailer:f,headerTags:new Set(xm(o)),trailerTags:new Set(xm(f))}}function xm(i){return i.map(u=>u.kind==="field"?u.tag:u.countTag)}function Wm(i,u){for(const c of i)if(c.kind==="group"){if(c.countTag===u)return c;const o=Wm(c.items,u);if(o)return o}}const ch=(function(){const u=typeof document<"u"&&document.createElement("link").relList;return u&&u.supports&&u.supports("modulepreload")?"modulepreload":"preload"})(),oh=function(i,u){return new URL(i,u).href},Em={},Qc=function(u,c,o){let f=Promise.resolve();if(c&&c.length>0){let p=function(x){return Promise.all(x.map(S=>Promise.resolve(S).then(C=>({status:"fulfilled",value:C}),C=>({status:"rejected",reason:C}))))};const m=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),v=d?.nonce||d?.getAttribute("nonce");f=p(c.map(x=>{if(x=oh(x,o),x in Em)return;Em[x]=!0;const S=x.endsWith(".css"),C=S?'[rel="stylesheet"]':"";if(o)for(let L=m.length-1;L>=0;L--){const w=m[L];if(w.href===x&&(!S||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${x}"]${C}`))return;const G=document.createElement("link");if(G.rel=S?"stylesheet":ch,S||(G.as="script"),G.crossOrigin="",G.href=x,v&&G.setAttribute("nonce",v),document.head.appendChild(G),S)return new Promise((L,w)=>{G.addEventListener("load",L),G.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${x}`)))})}))}function h(m){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=m,window.dispatchEvent(d),!d.defaultPrevented)throw m}return f.then(m=>{for(const d of m||[])d.status==="rejected"&&h(d.reason);return u().catch(h)})},rh={"FIX.4.2":()=>Qc(()=>import("./fix42-CfYPo_at.js"),[],import.meta.url),"FIX.4.4":()=>Qc(()=>import("./fix44-CVX1mpn-.js"),[],import.meta.url),"FIX.5.0SP2":()=>Qc(()=>import("./fix50sp2-CE6mdpWa.js"),[],import.meta.url)},Om=new Map;async function fh(i){const u=Om.get(i);if(u)return u;const c=await rh[i](),o=Jm(c.default,i);return Om.set(i,o),o}const dh=["template","system","dimension","instrument","extra","slots","final"];function os(i,u,c){return{sourceId:i.id,sourceLabel:i.label,stage:i.stage,...u!==void 0?{via:u}:{},...c!==void 0?{overwrote:c}:{}}}function Im(i,u,c,o,f,h,m){for(const d of u)switch(d.op){case"set":case"setGenerated":{const v=d.op==="set"?d.value:o.evaluateGenerator(d.generator,d.tag),p=d.op==="setGenerated"?d.generator:void 0,x=i.findIndex(S=>S.kind==="field"&&S.tag===d.tag);if(x>=0){const S=i[x];if(S.kind!=="field")break;f.push({kind:"overwrite",tag:d.tag,path:m+String(d.tag),by:c.id,previous:S.provenance.sourceId,previousValue:S.value}),i[x]={kind:"field",tag:d.tag,value:v,provenance:os(c,p,S.provenance)}}else i.push({kind:"field",tag:d.tag,value:v,provenance:os(c,p)});break}case"remove":{const v=i.findIndex(p=>p.kind==="field"&&p.tag===d.tag||p.kind==="group"&&p.countTag===d.tag);if(v>=0){const p=i[v];f.push({kind:"remove",tag:d.tag,path:m+String(d.tag),by:c.id,previous:p.provenance.sourceId}),i.splice(v,1)}break}case"slot":{h.set(d.tag,{spec:d.slot,declaredBy:c.id});break}case"group":{const v=i.findIndex(x=>x.kind==="group"&&x.countTag===d.countTag),p=d.entries.map(x=>{const S=[];return Im(S,x,c,o,f,h,`${m}${d.countTag}[]/`),S});if(v<0)i.push({kind:"group",countTag:d.countTag,entries:p,provenance:os(c)});else{const x=i[v];if(x.kind!=="group")break;d.mode==="append"?i[v]={...x,entries:[...x.entries,...p]}:(f.push({kind:"group-replace",countTag:d.countTag,by:c.id,previous:x.provenance.sourceId}),i[v]={kind:"group",countTag:d.countTag,entries:p,provenance:os(c)})}break}}}function Lt(i,u){const c=new Map(dh.map((d,v)=>[d,v])),o=[...i].sort((d,v)=>(c.get(d.stage)??0)-(c.get(v.stage)??0)),f=[],h=[],m=new Map;for(const{fragment:d,stage:v}of o)Im(f,d.ops,{id:d.id,label:d.label,stage:v},u,h,m,"");return{fields:f,notices:h,slots:[...m.values()]}}function mh(i){const u=new Map(i);return{next(c,o){const f=u.get(c)??o;return u.set(c,f+1),f}}}class bs{sharedValues=new Map;counters=new Map;nextCounter(u,c){const o=this.counters.get(u)??c;return this.counters.set(u,o+1),o}}function lt(i,u){return String(i).padStart(u,"0")}function gh(i,u){const c=`${lt(i.getUTCFullYear(),4)}${lt(i.getUTCMonth()+1,2)}${lt(i.getUTCDate(),2)}-${lt(i.getUTCHours(),2)}:${lt(i.getUTCMinutes(),2)}:${lt(i.getUTCSeconds(),2)}`;if(u==="seconds")return c;const o=lt(i.getUTCMilliseconds(),3);return u==="millis"?`${c}.${o}`:`${c}.${o}000`}function yh(i,u){return u.replace(/yyyy/g,lt(i.getUTCFullYear(),4)).replace(/MM/g,lt(i.getUTCMonth()+1,2)).replace(/dd/g,lt(i.getUTCDate(),2)).replace(/HH/g,lt(i.getUTCHours(),2)).replace(/mm/g,lt(i.getUTCMinutes(),2)).replace(/ss/g,lt(i.getUTCSeconds(),2))}function io(i,u){let c="";for(;c.length<u;)c+=Math.floor(i()*16).toString(16);return c}function ph(i){const u=io(i,32);return`${u.slice(0,8)}-${u.slice(8,12)}-4${u.slice(13,16)}-${(parseInt(u[16],16)&3|8).toString(16)}${u.slice(17,20)}-${u.slice(20,32)}`}function hh(i,u,c){return i.replace(/\{(\w+)(?::([^}]*))?\}/g,(o,f,h)=>{switch(f){case"date":return yh(c.clock(),h||"yyyyMMdd");case"seq":{const m=h?Number(h):0,d=c.batch.nextCounter(`template:${u}`,1);return m>0?lt(d,m):String(d)}case"rand":return io(c.random,h?Number(h):8);default:return o}})}function tl(i,u,c,o=[]){const f=i.get(u);if(!f||o.includes(u))return`{${u}?}`;switch(f.kind){case"sequence":{const h=f.start??1;let m;return f.scope==="message"?(m=c.message.get(u)??h,c.message.set(u,m+1)):f.scope==="batch"?m=c.batch.nextCounter(`seq:${u}`,h):m=c.counters.next(u,h),f.pad?lt(m,f.pad):String(m)}case"timestamp":return gh(c.clock(),f.precision);case"template":return hh(f.template,u,c);case"shared":{const h=c.batch.sharedValues.get(u);if(h!==void 0)return h;const m=tl(i,f.of,c,[...o,u]);return c.batch.sharedValues.set(u,m),m}case"random":return f.style==="uuid"?ph(c.random):io(c.random,f.length??8)}}function vh(i){let u=i>>>0;return()=>{u=u+1831565813>>>0;let c=u;return c=Math.imul(c^c>>>15,c|1),c^=c+Math.imul(c^c>>>7,c|61),((c^c>>>14)>>>0)/4294967296}}const _n="",bh=new TextEncoder;function Pm(i){return bh.encode(i)}function Sh(i){return Pm(i).length}function Th(i){const u=Pm(i);let c=0;for(const o of u)c=c+o&255;return String(c).padStart(3,"0")}const xh={soh:_n,pipe:"|",caretA:"^A"};function eg(i){const u=[];for(const c of i)if(c.kind==="field")u.push({tag:c.tag,value:c.value});else{u.push({tag:c.countTag,value:String(c.entries.length)});for(const o of c.entries)u.push(...eg(o))}return u}function Ua(i,u){const c=i.findIndex(o=>o.tag===u);return c>=0?i.splice(c,1)[0]:void 0}function Eh(i,u){const c=Fm(u,i.msgType),o=eg(i.fields),f=new Map;for(const d of[8,9,35,10]){const v=Ua(o,d);v&&f.set(d,v.value)}const h=[];for(const d of c.header){const v=d.kind==="field"?d.tag:d.countTag;if(v===8||v===9||v===35||v===10)continue;let p=Ua(o,v);for(;p;)h.push(p),p=Ua(o,v)}const m=[];for(const d of c.trailer){const v=d.kind==="field"?d.tag:d.countTag;if(v===10)continue;let p=Ua(o,v);for(;p;)m.push(p),p=Ua(o,v)}return{header:h,body:o,trailer:m,explicit:f}}function tg(i,u,c){const{header:o,body:f,trailer:h,explicit:m}=Eh(i,u),d=m.get(8)??i.beginString,v=m.get(35)??i.msgType,p=m.get(9),x=m.get(10),S=[`35=${v}`,...o.map(w=>`${w.tag}=${w.value}`),...f.map(w=>`${w.tag}=${w.value}`),...h.map(w=>`${w.tag}=${w.value}`)].map(w=>w+_n).join(""),C=[`8=${d}${_n}`];if(!c.omitLengthAndChecksum){const w=p??String(Sh(S));C.push(`9=${w}${_n}`)}if(C.push(S),!c.omitLengthAndChecksum){const w=x??Th(C.join(""));C.push(`10=${w}${_n}`)}const G=C.join(""),L=xh[c.delimiter];return L===_n?G:G.split(_n).join(L)}function ng(i,u,c,o,f){const h=new Map;for(const m of i){const d=m.kind==="field"?m.tag:m.countTag,v=h.get(d)??0;h.set(d,v+1);const p=v===0?String(d):`${d}#${v}`,x=o===""?p:`${o}/${p}`;m.kind==="field"?f.push({path:x,depth:c,tag:m.tag,name:Tm(u,m.tag),value:m.value,enumLabel:$m(u,m.tag,m.value),isGroupCount:!1,provenance:m.provenance}):(f.push({path:x,depth:c,tag:m.countTag,name:Tm(u,m.countTag),value:String(m.entries.length),enumLabel:void 0,isGroupCount:!0,provenance:m.provenance}),m.entries.forEach((S,C)=>{ng(S,u,c+1,`${x}[${C}]`,f)}))}}function Oh(i,u){const c=[];return ng(i.fields,u,0,"",c),c}function jh(i){return Array.isArray(i)}function jm(i,u){return Jm({formatVersion:1,partial:!0,fields:{},components:{__items:i},header:[],trailer:[],messages:{}},"FIX.4.4").components.get("__items")}function lg(i,u){return i.map(c=>{if(c.kind==="field"){const o=u[String(c.tag)];return o===void 0?c:{...c,required:o}}if(c.kind==="group"){const o=u[String(c.countTag)];return{...c,required:o??c.required,items:lg(c.items,u)}}return c})}function Am(i,u){if(!u)return i;const c=new Map(i.fields);for(const[h,m]of Object.entries(u.fields??{})){const d=Number(h),v=c.get(d);if(jh(m)){const[p,x,S]=m;c.set(d,{tag:d,name:p,type:x,...S?{enums:new Map(Object.entries(S))}:{}})}else{const p={tag:d,name:m.name??v?.name??`Tag${d}`,type:m.type??v?.type??"STRING",...m.enums||v?.enums?{enums:new Map([...m.enumMode==="replace"?[]:v?.enums??new Map,...Object.entries(m.enums??{})])}:{}};c.set(d,p)}}const o=new Map(i.components);for(const[h,m]of Object.entries(u.components??{}))o.set(h,jm(m));const f=new Map(i.messages);for(const[h,m]of Object.entries(u.messages??{})){const d=f.get(h);let v=m.items!==void 0?jm(m.items):d?.items??[];m.required&&(v=lg(v,m.required));const p={msgType:h,name:m.name??d?.name??h,...d?.category?{category:d.category}:{},items:v};f.set(h,p)}return{...i,fields:c,components:o,messages:f}}function Ah(i,u,c){return Am(Am(i,u),c)}function Nh(i){const u={};for(const c of i.dimensions){const o=c.options?.find(f=>f.default);o&&(u[c.id]=o.id)}return u}function Mh(i,u){const c=i.systems.find(f=>f.id===u);if(!c)return;if(!c.extends)return c;const o=i.systems.find(f=>f.id===c.extends);return!o||o.extends?c:{id:c.id,label:c.label,...c.fragments??o.fragments?{fragments:c.fragments??o.fragments}:{},...(c.finalFragment??o.finalFragment)!==void 0?{finalFragment:c.finalFragment??o.finalFragment}:{},...(c.dictionaryOverlay??o.dictionaryOverlay)!==void 0?{dictionaryOverlay:c.dictionaryOverlay??o.dictionaryOverlay}:{},...(c.capabilities??o.capabilities)!==void 0?{capabilities:c.capabilities??o.capabilities}:{},...(c.convention??o.convention)!==void 0?{convention:c.convention??o.convention}:{},...(c.validationPolicy??o.validationPolicy)!==void 0?{validationPolicy:c.validationPolicy??o.validationPolicy}:{},...(c.transportHints??o.transportHints)!==void 0?{transportHints:c.transportHints??o.transportHints}:{}}}function ag(i,u,c){return!i||i.length===0?!0:i.some(o=>o.startsWith("cap:")?c.has(o.slice(4)):o===u)}const Nm=1;function Ze(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}function La(i){let u;try{u=JSON.parse(i)}catch(c){return{issues:[{severity:"error",path:"",message:`not valid JSON: ${String(c)}`}]}}return ig(u)}function ig(i){const u=[],c=(x,S)=>u.push({severity:"error",path:x,message:S}),o=(x,S)=>u.push({severity:"warning",path:x,message:S});if(!Ze(i))return{issues:[{severity:"error",path:"",message:"profile must be a JSON object"}]};typeof i.schemaVersion!="number"?c("/schemaVersion","missing or non-numeric schemaVersion"):i.schemaVersion>Nm&&o("/schemaVersion",`profile schemaVersion ${i.schemaVersion} is newer than supported ${Nm}; loading best-effort`),(typeof i.name!="string"||i.name==="")&&c("/name","missing profile name"),typeof i.version!="string"&&c("/version","missing profile version");let f="FIX.4.4";typeof i.fixVersion!="string"||!Qm.includes(i.fixVersion)?o("/fixVersion",`unknown fixVersion ${JSON.stringify(i.fixVersion)}; defaulting to FIX.4.4`):f=i.fixVersion;const h=new Set(Ze(i.conventions)?Object.keys(i.conventions):[]),m={};if(i.fragments!==void 0&&!Ze(i.fragments))c("/fragments","fragments must be an object");else if(Ze(i.fragments))for(const[x,S]of Object.entries(i.fragments)){const C=`/fragments/${x}`;if(!Ze(S)||!Array.isArray(S.ops)){c(C,"fragment must be an object with an ops array");continue}const G=sg(S.ops,C+"/ops",c);m[x]={id:x,label:typeof S.label=="string"?S.label:x,ops:G,...Ze(S.meta)?{meta:S.meta}:{}}}const d=[];if(!Array.isArray(i.systems)||i.systems.length===0)c("/systems","profile must declare at least one system");else{const x=new Set;i.systems.forEach((S,C)=>{const G=`/systems/${C}`;if(!Ze(S)||typeof S.id!="string"){c(G,"system must be an object with an id");return}x.has(S.id)&&c(G+"/id",`duplicate system id '${S.id}'`),x.add(S.id),d.push({id:S.id,label:typeof S.label=="string"?S.label:S.id,...typeof S.extends=="string"?{extends:S.extends}:{},...Array.isArray(S.fragments)?{fragments:S.fragments}:{},...typeof S.finalFragment=="string"?{finalFragment:S.finalFragment}:{},...Ze(S.dictionaryOverlay)?{dictionaryOverlay:S.dictionaryOverlay}:{},...Array.isArray(S.capabilities)?{capabilities:S.capabilities}:{},...typeof S.convention=="string"?{convention:S.convention}:{},...Ze(S.validationPolicy)?{validationPolicy:S.validationPolicy}:{},...S.transportHints!==void 0?{transportHints:S.transportHints}:{}})}),d.forEach((S,C)=>{const G=`/systems/${C}`;if(S.extends){const L=d.find(w=>w.id===S.extends);L?L.extends&&o(G+"/extends",`extends chain deeper than one level (via '${L.id}')`):o(G+"/extends",`unknown system '${S.extends}'`),S.extends===S.id&&o(G+"/extends","system extends itself")}for(const L of S.fragments??[])m[L]||o(G+"/fragments",`unknown fragment '${L}'`);S.finalFragment&&!m[S.finalFragment]&&o(G+"/finalFragment",`unknown fragment '${S.finalFragment}'`),S.convention&&!h.has(S.convention)&&o(G+"/convention",`unknown convention '${S.convention}'`)})}const v=[];if(i.dimensions!==void 0&&!Array.isArray(i.dimensions)?c("/dimensions","dimensions must be an array"):Array.isArray(i.dimensions)&&i.dimensions.forEach((x,S)=>{const C=`/dimensions/${S}`;if(!Ze(x)||typeof x.id!="string"){c(C,"dimension must be an object with an id");return}const G=x.kind==="instrument"?"instrument":"options",L=Array.isArray(x.options)?x.options:void 0;G==="options"&&(!L||L.length===0)&&o(C,`dimension '${x.id}' has no options`),L?.forEach((w,P)=>{w.fragment&&!m[w.fragment]&&o(`${C}/options/${P}/fragment`,`unknown fragment '${w.fragment}'`),w.convention&&!h.has(w.convention)&&o(`${C}/options/${P}/convention`,`unknown convention '${w.convention}'`)}),(L?.filter(w=>w.default).length??0)>1&&o(`${C}/options`,`dimension '${x.id}' marks more than one option as default`),v.push({id:x.id,label:typeof x.label=="string"?x.label:x.id,kind:G,...typeof x.required=="boolean"?{required:x.required}:{},...L?{options:L}:{}})}),Ze(i.templates))for(const[x,S]of Object.entries(i.templates))(typeof S!="string"||!m[S])&&o(`/templates/${x}`,`unknown fragment '${String(S)}'`);return u.some(x=>x.severity==="error")?{issues:u}:{profile:{schemaVersion:i.schemaVersion,name:i.name,version:i.version,fixVersion:f,systems:d,dimensions:v,fragments:m,...Ze(i.dictionaryOverlay)?{dictionaryOverlay:i.dictionaryOverlay}:{},...Ze(i.generators)?{generators:i.generators}:{},...Ze(i.conventions)?{conventions:i.conventions}:{},...Ze(i.templates)?{templates:i.templates}:{},...Ze(i.renderers)?{renderers:i.renderers}:{},...Ze(i.validationPolicy)?{validationPolicy:i.validationPolicy}:{}},issues:u}}const Dh=new Set(["set","setGenerated","slot","remove","group"]);function sg(i,u,c){const o=[];return i.forEach((f,h)=>{const m=`${u}/${h}`;if(!Ze(f)||typeof f.op!="string"||!Dh.has(f.op)){c(m,`invalid op ${JSON.stringify(Ze(f)?f.op:f)}`);return}if(f.op==="group"){if(typeof f.countTag!="number"||!Array.isArray(f.entries)){c(m,"group op needs countTag and entries");return}const d=f.entries.map((v,p)=>Array.isArray(v)?sg(v,`${m}/entries/${p}`,c):[]);o.push({op:"group",countTag:f.countTag,mode:f.mode==="replace"?"replace":"append",entries:d});return}if(typeof f.tag!="number"){c(m,`${f.op} op needs a numeric tag`);return}if(f.op==="set"){if(typeof f.value!="string"){c(m,"set op needs a string value");return}o.push({op:"set",tag:f.tag,value:f.value})}else if(f.op==="setGenerated"){if(typeof f.generator!="string"){c(m,"setGenerated op needs a generator reference");return}o.push({op:"setGenerated",tag:f.tag,generator:f.generator})}else if(f.op==="remove")o.push({op:"remove",tag:f.tag});else{if(!Ze(f.slot)){c(m,"slot op needs a slot spec");return}o.push({op:"slot",tag:f.tag,slot:f.slot})}}),o}function zh(i,u,c){const o=Mh(i,u);if(!o)return;const f=new Set(o.capabilities??[]),h=p=>i.fragments[p],m=[];for(const p of o.fragments??[]){const x=h(p);x&&m.push({fragment:x,stage:"system"})}const d=o.finalFragment?h(o.finalFragment):void 0,v=[];return i.validationPolicy&&v.push(i.validationPolicy),o.validationPolicy&&v.push(o.validationPolicy),{profile:i,system:o,dictionary:Ah(c,i.dictionaryOverlay,o.dictionaryOverlay),capabilities:f,policyChain:v,systemFragments:m,finalFragment:d?{fragment:d,stage:"final"}:void 0}}function Ch(i){return i.profile.dimensions.map(u=>({dimension:u,options:(u.options??[]).map(c=>({option:c,available:ag(c.availableOn,i.system.id,i.capabilities)}))}))}const _h={"required-missing":"warning","conditional-required":"warning","unknown-tag":"warning","enum-unknown":"warning","type-mismatch":"warning","group-count-mismatch":"error","group-field-order":"warning","header-trailer-order":"warning","duplicate-tag":"warning"};function wh(i,u,c,o){let f=_h[u]??"warning";for(const h of i){const m=h.rules?.[u];m!==void 0&&(f=m);let d=-1;for(const v of h.overrides??[]){if(v.rule!==u||v.msgType!==void 0&&v.msgType!==c||v.tag!==void 0&&v.tag!==o)continue;const p=(v.msgType!==void 0?1:0)+(v.tag!==void 0?1:0);p>d&&(d=p,f=v.severity)}}return f}const ug=new Set([8,9,10,35]);function _t(i,u,c,o,f,h){const m=wh(i.policyChain,u,i.msgType,f);m!=="off"&&i.findings.push({ruleId:u,severity:m,path:c,message:o,...f!==void 0?{tag:f}:{},...h!==void 0?{provenance:h}:{}})}function $c(i,u,c){const o=c===0?String(u):`${u}#${c}`;return i===""?o:`${i}/${o}`}const Rh=[{tag:59,value:"6",anyOf:[432,126],label:"TimeInForce(59)=6 (Good Till Date) needs ExpireDate(432) or ExpireTime(126)"}],Uh=new Set(["INT","LENGTH","SEQNUM","NUMINGROUP","DAYOFMONTH"]),kh=new Set(["QTY","PRICE","FLOAT","AMT","PERCENTAGE","PRICEOFFSET"]);function qh(i,u,c,o,f){const h=i.dict.fields.get(u);if(!h)return;const m=h.type.toUpperCase();let d=!0;Uh.has(m)?d=/^-?\d+$/.test(c):kh.has(m)?d=/^-?\d+(\.\d+)?$/.test(c):m==="BOOLEAN"?d=c==="Y"||c==="N":m==="CHAR"?d=c.length===1:m==="UTCTIMESTAMP"?d=/^\d{8}-\d{2}:\d{2}:\d{2}(\.\d{3,9})?$/.test(c):m==="UTCDATEONLY"||m==="LOCALMKTDATE"?d=/^\d{8}$/.test(c):m==="MONTHYEAR"&&(d=/^\d{6}(\d{2}|w[1-5])?$/.test(c)),d||_t(i,"type-mismatch",o,`${h.name}(${u}) value '${c}' is not a valid ${h.type}`,u,f)}function Hh(i,u,c,o,f){const h=i.dict.fields.get(u);!h?.enums||h.enums.size===0||h.enums.has(c)||_t(i,"enum-unknown",o,`${h.name}(${u}) value '${c}' is not a defined enum value`,u,f)}function cg(i,u,c,o){const f=new Map,h=new Map;for(const d of u){const v=d.kind==="field"?d.tag:d.countTag,p=f.get(v)??0;f.set(v,p+1);const x=$c(o,v,p);if(d.kind==="field"&&(h.has(v)&&_t(i,"duplicate-tag",x,`Tag ${v} appears more than once at the same level`,v,d.provenance),h.set(v,d)),i.dict.fields.has(v)||_t(i,"unknown-tag",x,`Tag ${v} is not defined in the effective dictionary`,v,d.provenance),d.kind==="field"){Hh(i,v,d.value,x,d.provenance),qh(i,v,d.value,x,d.provenance);const S=i.dict.fields.get(v);if(S&&S.type.toUpperCase()==="NUMINGROUP"){const C=u.find(G=>G.kind==="group"&&G.countTag===v);C&&C.kind==="group"?String(C.entries.length)!==d.value&&_t(i,"group-count-mismatch",x,`${S.name}(${v}) explicitly set to ${d.value} but the group has ${C.entries.length} entries`,v,d.provenance):_t(i,"group-count-mismatch",x,`${S.name}(${v}) set to ${d.value} but no group entries are present`,v,d.provenance)}}else{const S=c?Wm(c,d.countTag):void 0;d.entries.forEach((C,G)=>{const L=`${$c(o,v,p)}[${G}]`;cg(i,C,S?.items,L),S&&Vh(i,C,S,L)})}}const m=new Set(u.map(d=>d.kind==="field"?d.tag:d.countTag));for(const d of u)if(d.kind==="field")for(const v of Rh)d.tag!==v.tag||d.value!==v.value||v.anyOf.some(p=>m.has(p))||_t(i,"conditional-required",$c(o,d.tag,0),v.label,d.tag,d.provenance);if(c){const d=new Set(u.map(v=>v.kind==="field"?v.tag:v.countTag));for(const v of c){const p=v.kind==="field"?v.tag:v.countTag;if(!v.required||ug.has(p)||d.has(p))continue;const x=i.dict.fields.get(p)?.name??`Tag${p}`;_t(i,"required-missing",o,`Required field ${x}(${p}) is missing`,p)}}}function Vh(i,u,c,o){const f=new Map;c.items.forEach((v,p)=>{f.set(v.kind==="field"?v.tag:v.countTag,p)});const h=c.items[0]&&(c.items[0].kind==="field"?c.items[0].tag:c.items[0].countTag),m=u[0]&&(u[0].kind==="field"?u[0].tag:u[0].countTag);if(h!==void 0&&m!==void 0&&m!==h){const v=i.dict.fields.get(h)?.name??`Tag${h}`;_t(i,"group-field-order",o,`Group entry should start with its delimiter ${v}(${h})`,m,u[0]?.provenance);return}let d=-1;for(const v of u){const p=v.kind==="field"?v.tag:v.countTag,x=f.get(p);if(x!==void 0){if(x<d){_t(i,"group-field-order",o,`Tag ${p} is out of dictionary order within the group entry`,p,v.provenance);return}d=x}}}function Lh(i,u){const c=(o,f)=>{for(const h of o)h.kind==="group"&&h.entries.forEach((m,d)=>{const v=`${f}${h.countTag}[${d}]`;for(const p of m){const x=p.kind==="field"?p.tag:p.countTag;if(i.layout.headerTags.has(x)||i.layout.trailerTags.has(x)){const S=i.layout.headerTags.has(x)?"Header":"Trailer";_t(i,"header-trailer-order",`${v}/${x}`,`${S} field ${x} is nested inside a repeating group entry`,x,p.provenance)}}c(m,`${v}/`)})};c(u.fields,"")}function Bh(i,u,c=[]){const o=Fm(u,i.msgType),f={dict:u,layout:o,msgType:i.msgType,policyChain:c,findings:[]};u.messages.has(i.msgType)||_t(f,"unknown-tag","",`Message type '${i.msgType}' is not defined in the effective dictionary`,35);const h=[...o.header,...o.body,...o.trailer].filter(m=>{const d=m.kind==="field"?m.tag:m.countTag;return!ug.has(d)});return cg(f,i.fields,h,""),Lh(f,i),f.findings}function Ya(i,u){const c=[],o=[...i.systemFragments];let f="D",h="single",m;for(const p of i.profile.dimensions){if(p.kind!=="options")continue;const x=u[p.id];if(x===void 0){p.required&&c.push({ruleId:"selection-missing",severity:"info",path:"",message:`No ${p.label} selected`});continue}const S=p.options?.find(C=>C.id===x);if(!S){c.push({ruleId:"selection-unresolved",severity:"warning",path:"",message:`${p.label}: selection '${x}' does not exist in this profile`});continue}if(ag(S.availableOn,i.system.id,i.capabilities)||c.push({ruleId:"option-unavailable",severity:"warning",path:"",message:`${p.label}: '${S.label}' is not available on ${i.system.label}`}),S.msgType&&(f=S.msgType),S.modes&&S.modes.length>0&&(h=S.modes[0]),S.convention){const C=`${p.label}: ${S.label}`;m&&c.push({ruleId:"convention-conflict",severity:"warning",path:"",message:`Both ${m.source} and ${C} set an identity convention; using '${S.convention}' (last declared dimension wins)`}),m={name:S.convention,source:C}}if(S.fragment){const C=i.profile.fragments[S.fragment];C&&o.push({fragment:C,stage:"dimension"})}}const d=i.profile.templates?.[f],v=d?i.profile.fragments[d]:void 0;return v&&o.unshift({fragment:v,stage:"template"}),{stack:o,msgType:f,mode:h,findings:c,...m?{convention:m.name,conventionSource:m.source}:{}}}const ms={id:"user",label:"User input"},Mm={id:"slot-default",label:"Slot default"};function Gh(i){return new Map(Object.entries(i.profile.generators??{}))}function Yh(i,u,c,o){const{stack:f,msgType:h,mode:m,findings:d}=Ya(i,u.selections);u.instrumentFragment&&f.push({fragment:u.instrumentFragment,stage:"instrument"});for(const V of u.extraFragments??[])f.push({fragment:V,stage:"extra"});i.finalFragment&&f.push(i.finalFragment);const v=Lt(f,{evaluateGenerator:V=>`{${V}}`}),p=new Map(Object.entries(u.slotValues).filter(([,V])=>V!=="").map(([V,ne])=>[Number(V),ne])),x={id:ms.id,label:ms.label,ops:[...p.entries()].map(([V,ne])=>({op:"set",tag:V,value:ne}))},S={id:Mm.id,label:Mm.label,ops:v.slots.filter(V=>!p.has(V.spec.tag)).flatMap(V=>V.spec.generatorDefault!==void 0?[{op:"setGenerated",tag:V.spec.tag,generator:V.spec.generatorDefault}]:V.spec.default!==void 0?[{op:"set",tag:V.spec.tag,value:V.spec.default}]:[])},C=[...f,{fragment:S,stage:"slots"},{fragment:x,stage:"slots"}],G=Gh(i),L={clock:c.clock,random:c.random,counters:c.counters,batch:new bs,message:new Map},w=Lt(C,{evaluateGenerator:V=>tl(G,V,L)}),P=u.fixVersion??i.profile.fixVersion;return{message:{beginString:vs(P),msgType:h,fields:w.fields},msgType:h,mode:m,notices:w.notices,slots:w.slots,findings:d}}function Wc(i){return"scheme"in i?`scheme:${i.scheme}`:"attr"in i?`attr:${i.attr}`:"literal"in i?`'${i.literal}'`:i.firstOf.map(Wc).join(" ?? ")}function Ic(i,u){if("literal"in i)return i.literal;if("scheme"in i)return u.schemes?.[i.scheme];if("attr"in i)return u.attrs?.[i.attr];for(const c of i.firstOf){const o=Ic(c,u);if(o!==void 0)return o}}function Zh(i,u,c){const o=u.attrs?.securityType;return!(i.when?.securityType&&!i.when.securityType.includes(o??"")||i.when?.fixVersion&&!i.when.fixVersion.includes(c))}function Xh(i,u,c){const o=u.variants.find(d=>Zh(d,i,c));if(!o)return{values:new Map,altIds:[],missing:[]};const f=new Map,h=[];for(const d of o.emit){const v=Ic(d.from,i);v!==void 0?f.set(d.role,v):h.push({role:d.role,required:d.required??!1,source:Wc(d.from)})}const m=[];for(const d of o.altIds??[]){const v=Ic(d.from,i);v!==void 0?m.push({id:v,sourceCode:d.sourceCode}):h.push({role:"altId",required:!1,source:Wc(d.from)})}return{values:f,altIds:m,missing:h}}function Qh(i){const u=new Map,c=(o,f)=>{if("scheme"in o)u.set(o.scheme,(u.get(o.scheme)??!1)||f);else if("firstOf"in o)for(const h of o.firstOf)c(h,f)};for(const o of i.variants){for(const f of o.emit)c(f.from,f.required??!1);for(const f of o.altIds??[])c(f.from,!1)}return[...u.entries()].map(([o,f])=>({scheme:o,required:f}))}const $h={instrument:{roles:{symbol:55,securityId:48,securityIdSource:22,securityType:167,securityExchange:207,cfiCode:461,currency:15,maturityMonthYear:200,maturityDate:541,maturityDay:205,strikePrice:202,putOrCall:201,optAttribute:206,contractMultiplier:231,securitySubType:762},altGroup:{count:454,id:455,source:456}},leg:{roles:{symbol:600,securityId:602,securityIdSource:603,securityType:609,securityExchange:616,cfiCode:608,currency:556,maturityMonthYear:610,maturityDate:611,strikePrice:612,putOrCall:1358,optAttribute:613,contractMultiplier:614,securitySubType:764},altGroup:{count:604,id:605,source:606}},underlying:{roles:{symbol:311,securityId:309,securityIdSource:305,securityType:310,securityExchange:308,cfiCode:463,currency:318,maturityMonthYear:313,maturityDate:542,strikePrice:316,putOrCall:315,optAttribute:317,contractMultiplier:436,securitySubType:763},altGroup:{count:457,id:458,source:459}}};function Kh(i,u,c,o){const f=$h[c],h=Xh(i,u,o),m=[];for(const[v,p]of h.values){const x=f.roles[v];x!==void 0&&m.push({op:"set",tag:x,value:p})}h.altIds.length>0&&m.push({op:"group",countTag:f.altGroup.count,mode:"replace",entries:h.altIds.map(v=>[{op:"set",tag:f.altGroup.id,value:v.id},{op:"set",tag:f.altGroup.source,value:v.sourceCode}])});const d=h.missing.map(v=>({ruleId:"instrument-missing-identifier",severity:v.required?"warning":"info",path:"",message:`${i.name??i.key}: no value for ${v.role} (${v.source})${v.required?" — required by the convention":""}`}));return{ops:m,findings:d}}function gs(i,u,c,o,f){const h=Kh(i,u,c,o);return{fragment:{id:`instrument:${i.key}`,label:`Instrument: ${i.name??i.key}${f?` · convention via ${f}`:""}`,ops:h.ops},findings:h.findings}}function so(i){return new Map(Object.entries(i.profile.generators??{}))}function Ba(i,u){return{clock:i.clock,random:i.random,counters:i.counters,batch:u,message:new Map}}function og(i,u,c,o,f,h){if(!i.instrument)return;const m=c?.db.instruments.get(i.instrument)??c?.db.strategies.get(i.instrument);if(!m||!c){f.push({ruleId:"selection-unresolved",severity:"warning",path:"",message:`Instrument '${i.instrument}' is not in the loaded instrument database`});return}const d=gs(m,c.convention,o,h??u.profile.fixVersion,c.conventionNote);return f.push(...d.findings),d.fragment}function uo(i,u,c){const o=new Map;for(const[m,d]of Object.entries(u))d!==""&&o.set(Number(m),d);for(const[m,d]of Object.entries(c.slotValues))d===""?o.delete(Number(m)):o.set(Number(m),d);const f=i.filter(m=>!o.has(m.spec.tag)).flatMap(m=>m.spec.generatorDefault!==void 0?[{op:"setGenerated",tag:m.spec.tag,generator:m.spec.generatorDefault}]:m.spec.default!==void 0?[{op:"set",tag:m.spec.tag,value:m.spec.default}]:[]),h=[...o.entries()].map(([m,d])=>({op:"set",tag:m,value:d}));return[{id:"slot-default",label:"Slot default",ops:f},{id:ms.id,label:ms.label,ops:h}]}function Jh(i,u,c,o){const{stack:f,msgType:h,findings:m}=Ya(i,u.selections),d=so(i),v=new bs,p=Lt([...f,...i.finalFragment?[i.finalFragment]:[]],{evaluateGenerator:G=>`{${G}}`}),x=[],S=[],C=vs(u.fixVersion??i.profile.fixVersion);for(const G of u.rows){const L=[],w=[...f],P=og(G,i,o,"instrument",L,u.fixVersion);P&&w.push({fragment:P,stage:"instrument"});const[V,ne]=uo(p.slots,u.slotValues,G);w.push({fragment:V,stage:"slots"}),w.push({fragment:ne,stage:"slots"}),i.finalFragment&&w.push(i.finalFragment);const de=Ba(c,v),Te=Lt(w,{evaluateGenerator:ge=>tl(d,ge,de)});x.push({beginString:C,msgType:h,fields:Te.fields}),S.push({notices:[...Te.notices],findings:L})}return{messages:x,perMessage:S,slots:p.slots,findings:m}}function Fh(i,u,c,o){const{stack:f,findings:h}=Ya(i,u.selections),m=so(i),d=new bs,v=Lt([...f,...i.finalFragment?[i.finalFragment]:[]],{evaluateGenerator:ne=>`{${ne}}`}),p=i.profile.templates?.["E:entry"],x=p?i.profile.fragments[p]:void 0,S=Ba(c,d),C={evaluateGenerator:ne=>tl(m,ne,S)},G=[],L=[];u.rows.forEach((ne,de)=>{const Te=[],ge=[];x&&ge.push({fragment:x,stage:"template"}),ge.push({fragment:{id:"list-seq",label:"List sequencing",ops:[{op:"set",tag:67,value:String(de+1)}]},stage:"template"});const Z=og(ne,i,o,"instrument",Te,u.fixVersion);Z&&ge.push({fragment:Z,stage:"instrument"});const[X,ae]=uo(v.slots,u.slotValues,ne);ge.push({fragment:X,stage:"slots"}),ge.push({fragment:ae,stage:"slots"});const Q=Ba(c,d),I=Lt(ge,{evaluateGenerator:ie=>tl(m,ie,Q)});G.push(I.fields),L.push(...I.notices),h.push(...Te)});const w=[...f,{fragment:{id:"list-orders",label:"List orders",ops:[{op:"set",tag:68,value:String(u.rows.length)}]},stage:"extra"}];i.finalFragment&&w.push(i.finalFragment);const P=Lt(w,C),V=[...P.fields,{kind:"group",countTag:73,entries:G,provenance:{sourceId:"list-builder",sourceLabel:"List rows",stage:"extra"}}];return{message:{beginString:vs(u.fixVersion??i.profile.fixVersion),msgType:"E",fields:V},notices:[...P.notices,...L],slots:v.slots,findings:h}}function Wh(i,u,c,o){const{stack:f,findings:h}=Ya(i,u.selections),m=so(i),d=new bs,v=o?.db.strategies.get(u.strategyKey);v||h.push({ruleId:"selection-unresolved",severity:"warning",path:"",message:`Strategy '${u.strategyKey}' is not in the loaded instrument database`});const p=Lt([...f,...i.finalFragment?[i.finalFragment]:[]],{evaluateGenerator:V=>`{${V}}`}),x=Ba(c,d),S=[];v?.legs.forEach((V,ne)=>{const de=u.legOverrides?.[ne],Te=[],ge=[],Z=o?.db.instruments.get(V.instrument);if(Z&&o){const I=gs(Z,o.convention,"leg",u.fixVersion??i.profile.fixVersion,o.conventionNote);ge.push({fragment:I.fragment,stage:"instrument"}),Te.push(...I.findings)}else Te.push({ruleId:"selection-unresolved",severity:"warning",path:"",message:`Leg instrument '${V.instrument}' is not in the loaded instrument database`});const X=[{op:"set",tag:623,value:de?.ratioQty??V.ratioQty},{op:"set",tag:624,value:de?.side??V.side}],ae=de?.price??V.price;ae!==void 0&&X.push({op:"set",tag:566,value:ae});for(const[I,ie]of Object.entries(de?.slotValues??{}))X.push({op:"set",tag:Number(I),value:ie});ge.push({fragment:{id:`leg:${ne}`,label:`Leg ${ne+1}`,ops:X},stage:"slots"});const Q=Lt(ge,{evaluateGenerator:I=>tl(m,I,Ba(c,d))});S.push(Q.fields),h.push(...Te)});const C=[...f];if(v&&o){const V=gs(v,o.convention,"instrument",u.fixVersion??i.profile.fixVersion,o.conventionNote);C.push({fragment:V.fragment,stage:"instrument"}),h.push(...V.findings),v.strategyType&&C.push({fragment:{id:"strategy-type",label:"Strategy type",ops:[{op:"set",tag:762,value:v.strategyType}]},stage:"instrument"})}const[G,L]=uo(p.slots,u.slotValues,{slotValues:{}});C.push({fragment:G,stage:"slots"}),C.push({fragment:L,stage:"slots"}),i.finalFragment&&C.push(i.finalFragment);const w=Lt(C,{evaluateGenerator:V=>tl(m,V,x)}),P=[...w.fields,{kind:"group",countTag:555,entries:S,provenance:{sourceId:`strategy:${u.strategyKey}`,sourceLabel:`Strategy: ${v?.name??u.strategyKey}`,stage:"instrument"}}];return{message:{beginString:vs(u.fixVersion??i.profile.fixVersion),msgType:"AB",fields:P},notices:w.notices,slots:p.slots,findings:h}}const Ih=new Set(["INT","LENGTH","SEQNUM","NUMINGROUP","DAYOFMONTH","QTY"]),Ph=new Set(["PRICE","FLOAT","AMT","PERCENTAGE","PRICEOFFSET","QTY"]);function Dm(i,u,c){if(c==="tag")return String(i);const o=u.fields.get(i)?.name;return c==="name"?o??String(i):c.alias[String(i)]??o??String(i)}function ev(i,u,c){if(c==="countTag")return String(i);const o=u.fields.get(i)?.name;return c==="countName"?o??String(i):c.alias[String(i)]??o??String(i)}function tv(i,u,c,o){if(!o.typedValues)return u;const f=c.fields.get(i)?.type.toUpperCase();return f?f==="BOOLEAN"?u==="Y"?!0:u==="N"?!1:u:Ih.has(f)&&/^-?\d+$/.test(u)||Ph.has(f)&&/^-?\d+(\.\d+)?$/.test(u)?Number(u):u:u}function rg(i,u,c,o){const f={};for(const h of i){const m=h.kind==="field"?h.tag:h.countTag;o.has(m)||(h.kind==="field"?f[Dm(m,u,c.keyStyle)]=tv(m,h.value,u,c):(c.emitCounts&&(f[Dm(m,u,c.keyStyle)]=c.typedValues?h.entries.length:String(h.entries.length)),f[ev(m,u,c.groupKey)]=h.entries.map(d=>rg(d,u,c,o))))}return f}function fg(i,u,c){const o=new Set(c.omitTags??[]),f=[],h=v=>i.fields.some(p=>(p.kind==="field"?p.tag:p.countTag)===v),m={sourceId:"renderer",sourceLabel:"Renderer"};h(8)||f.push({kind:"field",tag:8,value:i.beginString,provenance:m}),h(35)||f.push({kind:"field",tag:35,value:i.msgType,provenance:m});const d=rg([...f,...i.fields],u,c,o);if(c.envelope?.message){const v=c.envelope.messageKey??"message";return{...c.envelope.message,[v]:d}}return d}function nv(i,u,c){const o=i.map(f=>fg(f,u,c));return c.envelope?.topLevelKey?{[c.envelope.topLevelKey]:o}:o}function dg(i,u,c){return JSON.stringify(nv(i,u,c),null,2)}function Pc(i){if(Array.isArray(i))return i.map(Pc);if(typeof i=="object"&&i!==null){const u=Object.entries(i).sort(([c],[o])=>c<o?-1:c>o?1:0);return Object.fromEntries(u.map(([c,o])=>[c,Pc(o)]))}return i}function el(i){return JSON.stringify(Pc(i),null,2)+`
`}const eo=1,lv=new Set(["schemaVersion","name","profile","fixVersion","mode","systemId","selections","slotValues","rows","legOverrides","renderer"]);function ka(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}function Ss(i){let u;try{u=JSON.parse(i)}catch(m){return{issues:[{severity:"error",path:"",message:`not valid JSON: ${String(m)}`}]}}if(!ka(u))return{issues:[{severity:"error",path:"",message:"scenario must be a JSON object"}]};const c=[];if(typeof u.schemaVersion!="number"?c.push({severity:"error",path:"/schemaVersion",message:"missing schemaVersion"}):u.schemaVersion>eo&&c.push({severity:"warning",path:"/schemaVersion",message:`scenario schemaVersion ${u.schemaVersion} is newer than supported ${eo}; loading best-effort`}),(!ka(u.profile)||typeof u.profile.name!="string")&&c.push({severity:"error",path:"/profile",message:"missing profile reference"}),c.some(m=>m.severity==="error"))return{issues:c};const o={};for(const[m,d]of Object.entries(u))lv.has(m)||(o[m]=d);const f=["single","batch","list","multileg"].includes(u.mode)?u.mode:"single";return{scenario:{schemaVersion:u.schemaVersion,name:typeof u.name=="string"?u.name:"untitled",profile:{name:u.profile.name,version:String(u.profile.version??"")},fixVersion:u.fixVersion??"FIX.4.4",mode:f,systemId:typeof u.systemId=="string"?u.systemId:"",selections:ka(u.selections)?u.selections:{},slotValues:ka(u.slotValues)?u.slotValues:{},...Array.isArray(u.rows)?{rows:u.rows}:{},...Array.isArray(u.legOverrides)?{legOverrides:u.legOverrides}:{},renderer:ka(u.renderer)?u.renderer:{kind:"annotated"},...Object.keys(o).length>0?{extra:o}:{}},issues:c}}function to(i){const{extra:u,...c}=i;return el({...c,...u})}function Ts(i,u){const c=[];return i.profile.name!==u.name?c.push({ruleId:"scenario-profile-mismatch",severity:"warning",path:"",message:`Scenario was saved against profile '${i.profile.name}' but '${u.name}' is loaded; applying best-effort`}):i.profile.version!==u.version&&c.push({ruleId:"scenario-profile-version",severity:"info",path:"",message:`Scenario was saved against ${i.profile.name} v${i.profile.version}; v${u.version} is loaded`}),u.systems.some(o=>o.id===i.systemId)||c.push({ruleId:"scenario-system-unknown",severity:"warning",path:"",message:`Scenario targets system '${i.systemId}' which this profile does not declare`}),c}function av(i){const u=[];let c=[],o="",f=!1,h=0;const m=()=>{c.push(o),o=""},d=()=>{m(),u.push(c),c=[]};for(;h<i.length;){const v=i[h];if(f){if(v==='"'){if(i[h+1]==='"'){o+='"',h+=2;continue}f=!1,h++;continue}o+=v,h++}else v==='"'?(f=!0,h++):v===","?(m(),h++):v==="\r"?h++:v===`
`?(d(),h++):(o+=v,h++)}return(o!==""||c.length>0)&&d(),u.filter(v=>!(v.length===1&&v[0]===""))}function iv(i){return/[",\n\r]/.test(i)?`"${i.replace(/"/g,'""')}"`:i}function sv(i){return i.map(u=>u.map(iv).join(",")).join(`
`)+`
`}function In(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}function rs(i,u){const c={};for(const[o,f]of Object.entries(i))u.includes(o)||(c[o]=f);return Object.keys(c).length>0?c:void 0}function fs(i){if(!In(i))return{};const u={};for(const[c,o]of Object.entries(i))typeof o=="string"?u[c]=o:typeof o=="number"&&(u[c]=String(o));return u}function mg(i){const u=[];let c;try{c=JSON.parse(i)}catch(d){return{issues:[{severity:"error",path:"",message:`not valid JSON: ${String(d)}`}]}}if(!In(c)||!Array.isArray(c.instruments))return{issues:[{severity:"error",path:"",message:"instrument DB must have an instruments array"}]};const o=rs(c,["instruments","strategies"]),f=new Map,h=[];c.instruments.forEach((d,v)=>{const p=`/instruments/${v}`;if(!In(d)||typeof d.key!="string"||d.key===""){u.push({severity:"error",path:p,message:"instrument needs a non-empty key"});return}f.has(d.key)?u.push({severity:"warning",path:p,message:`duplicate key '${d.key}' (last wins)`}):h.push(d.key);const x=rs(d,["key","name","schemes","attrs"]);f.set(d.key,{key:d.key,...typeof d.name=="string"?{name:d.name}:{},schemes:fs(d.schemes),attrs:fs(d.attrs),...x?{extra:x}:{}})});const m=new Map;return Array.isArray(c.strategies)&&c.strategies.forEach((d,v)=>{const p=`/strategies/${v}`;if(!In(d)||typeof d.key!="string"||!Array.isArray(d.legs)){u.push({severity:"error",path:p,message:"strategy needs a key and legs array"});return}const x=d.legs.flatMap((C,G)=>{if(!In(C)||typeof C.instrument!="string")return u.push({severity:"error",path:`${p}/legs/${G}`,message:"leg needs an instrument key"}),[];f.has(C.instrument)||u.push({severity:"warning",path:`${p}/legs/${G}`,message:`leg references unknown instrument '${C.instrument}'`});const L=rs(C,["instrument","ratioQty","side","price"]);return[{instrument:C.instrument,ratioQty:typeof C.ratioQty=="string"?C.ratioQty:"1",side:typeof C.side=="string"?C.side:"1",...typeof C.price=="string"?{price:C.price}:{},...L?{extra:L}:{}}]}),S=rs(d,["key","name","strategyType","schemes","attrs","legs"]);m.set(d.key,{key:d.key,...typeof d.name=="string"?{name:d.name}:{},...typeof d.strategyType=="string"?{strategyType:d.strategyType}:{},...In(d.schemes)?{schemes:fs(d.schemes)}:{},...In(d.attrs)?{attrs:fs(d.attrs)}:{},legs:x,...S?{extra:S}:{}})}),{db:{instruments:f,strategies:m,instrumentOrder:h,...o?{extra:o}:{}},issues:u}}function gg(i){const u=[],c=av(i),o=c[0];if(!o||!o.includes("key"))return{issues:[{severity:"error",path:"",message:"CSV needs a header row with a 'key' column"}]};const f=new Map,h=[];return c.slice(1).forEach((m,d)=>{const v=`/row/${d+2}`,p=w=>{const P=o.indexOf(w);return P>=0?m[P]??"":""},x=p("key");if(!x){u.push({severity:"error",path:v,message:"missing key"});return}const S={},C={},G={};o.forEach((w,P)=>{const V=m[P]??"";V!==""&&(w.startsWith("scheme:")?S[w.slice(7)]=V:w.startsWith("attr:")?C[w.slice(5)]=V:w!=="key"&&w!=="name"&&(G[w]=V))}),f.has(x)?u.push({severity:"warning",path:v,message:`duplicate key '${x}' (last wins)`}):h.push(x);const L=p("name");f.set(x,{key:x,...L?{name:L}:{},schemes:S,attrs:C,...Object.keys(G).length>0?{extra:G}:{}})}),{db:{instruments:f,strategies:new Map,instrumentOrder:h,csvColumns:o},issues:u}}function ys(i){return/^\s*[{[]/.test(i)?mg(i):gg(i)}function uv(i){return{key:i.key,...i.name!==void 0?{name:i.name}:{},...Object.keys(i.schemes).length>0?{schemes:i.schemes}:{},...Object.keys(i.attrs).length>0?{attrs:i.attrs}:{},...i.extra??{}}}function cv(i){return{key:i.key,...i.name!==void 0?{name:i.name}:{},...i.strategyType!==void 0?{strategyType:i.strategyType}:{},...i.schemes?{schemes:i.schemes}:{},...i.attrs?{attrs:i.attrs}:{},legs:i.legs.map(u=>({instrument:u.instrument,ratioQty:u.ratioQty,side:u.side,...u.price!==void 0?{price:u.price}:{},...u.extra??{}})),...i.extra??{}}}function ov(i){return i.csvColumns?rv(i):el({schemaVersion:1,...i.extra??{},instruments:i.instrumentOrder.map(u=>uv(i.instruments.get(u))),...i.strategies.size>0?{strategies:[...i.strategies.values()].map(cv)}:{}})}function rv(i){const u=[...i.csvColumns],c=new Set(u),o=m=>{c.has(m)||(c.add(m),u.push(m))},f=i.instrumentOrder.map(m=>i.instruments.get(m));for(const m of f){for(const d of Object.keys(m.schemes))o(`scheme:${d}`);for(const d of Object.keys(m.attrs))o(`attr:${d}`)}const h=f.map(m=>u.map(d=>{if(d==="key")return m.key;if(d==="name")return m.name??"";if(d.startsWith("scheme:"))return m.schemes[d.slice(7)]??"";if(d.startsWith("attr:"))return m.attrs[d.slice(5)]??"";const v=m.extra?.[d];return typeof v=="string"?v:""}));return sv([u,...h])}function fv(i,u){const c=new Map(i.instruments),o=c.has(u.key);return c.set(u.key,u),{...i,instruments:c,instrumentOrder:o?i.instrumentOrder:[...i.instrumentOrder,u.key]}}function zm(i,u){const c=new Map(i.instruments);return c.delete(u),{...i,instruments:c,instrumentOrder:i.instrumentOrder.filter(o=>o!==u)}}function Cm(i,u){const c=Object.values(i.schemes??{}),o=i.name??i.key,f=u==="strategy"?`strategy · ${i.legs.length} legs`:[i.attrs?.securityType,c[0]].filter(Boolean).join(" · "),h=[i.key,i.name??"",...c].join(" ").toLowerCase(),m=[0];for(let d=1;d<h.length;d++)(h[d-1]===" "||h[d-1]==="-"||h[d-1]===".")&&m.push(d);return{hit:{kind:u,key:i.key,label:o,detail:f},haystack:h,words:m}}function dv(i){const u=[...i.instrumentOrder.map(c=>Cm(i.instruments.get(c),"instrument")),...[...i.strategies.values()].map(c=>Cm(c,"strategy"))];return{size:u.length,search(c,o=50){const f=c.trim().toLowerCase();if(f==="")return u.slice(0,o).map(m=>m.hit);const h=[];for(const m of u){const d=m.haystack.indexOf(f);if(d<0)continue;const v=d===0?0:m.words.includes(d)?1:2;if(h.push({hit:m.hit,score:v}),h.length>=o*4)break}return h.sort((m,d)=>m.score-d.score).slice(0,o).map(m=>m.hit)}}}const ps={profile:void 0,profileIssues:[],instrumentDb:void 0,instrumentDbIssues:[],baseDictionary:void 0,dictionaryError:void 0,systemId:void 0,fixVersion:"profile",selections:{},slotValues:{},mode:"auto",rows:[{slotValues:{}},{slotValues:{}},{slotValues:{}}],legOverrides:[],outputTab:"annotated",delimiter:"pipe",omitLengthAndChecksum:!1,jsonMapping:void 0,scenarioName:"",scenarioFindings:[],hostOrigin:void 0,transportLog:[],buildNonce:1,workspace:void 0};function mv(i,u,c){return i.map((o,f)=>{if(f!==u)return o;const h=c.instrument===""?void 0:c.instrument??o.instrument,m={...o.slotValues,...c.slotValues};for(const d of Object.keys(m))m[d]===""&&delete m[d];return{...h!==void 0?{instrument:h}:{},slotValues:m}})}function gv(i,u){switch(u.type){case"profile-loaded":return u.profile?{...ps,outputTab:i.outputTab,delimiter:i.delimiter,omitLengthAndChecksum:i.omitLengthAndChecksum,instrumentDb:i.instrumentDb,instrumentDbIssues:i.instrumentDbIssues,baseDictionary:i.baseDictionary,dictionaryError:i.dictionaryError,hostOrigin:i.hostOrigin,transportLog:i.transportLog,workspace:i.workspace,profile:u.profile,profileIssues:u.issues,selections:Nh(u.profile),systemId:u.profile.systems[0]?.id,jsonMapping:Object.keys(u.profile.renderers?.json??{})[0],buildNonce:i.buildNonce+1}:{...i,profileIssues:u.issues};case"dictionary-loaded":return{...i,baseDictionary:u.dictionary,dictionaryError:void 0};case"dictionary-error":return{...i,dictionaryError:u.message};case"instruments-loaded":return u.db?{...i,instrumentDb:u.db,instrumentDbIssues:u.issues}:{...i,instrumentDbIssues:u.issues};case"set-fix-version":return{...i,fixVersion:u.fixVersion,baseDictionary:void 0,dictionaryError:void 0};case"select-system":return{...i,systemId:u.systemId};case"select-option":return{...i,mode:"auto",selections:{...i.selections,[u.dimensionId]:u.optionId}};case"set-slot":return{...i,slotValues:{...i.slotValues,[u.tag]:u.value}};case"clear-slot":{const c={...i.slotValues};return delete c[u.tag],{...i,slotValues:c}}case"set-mode":return{...i,mode:u.mode};case"row-add":return{...i,rows:[...i.rows,{slotValues:{}}]};case"row-duplicate":{const c=i.rows[u.index];if(!c)return i;const o=[...i.rows];return o.splice(u.index+1,0,{...c,slotValues:{...c.slotValues}}),{...i,rows:o}}case"row-remove":return{...i,rows:i.rows.filter((c,o)=>o!==u.index)};case"row-update":return{...i,rows:mv(i.rows,u.index,{...u.instrument!==void 0?{instrument:u.instrument}:{},...u.slotValues!==void 0?{slotValues:u.slotValues}:{}})};case"leg-override":{const c=[...i.legOverrides];for(;c.length<=u.index;)c.push({});return c[u.index]={...c[u.index],...u.patch},{...i,legOverrides:c}}case"set-output-tab":return{...i,outputTab:u.tab};case"set-delimiter":return{...i,delimiter:u.delimiter};case"set-omit-length-checksum":return{...i,omitLengthAndChecksum:u.omit};case"set-json-mapping":return{...i,jsonMapping:u.mapping};case"set-scenario-name":return{...i,scenarioName:u.name};case"host-connected":return i.hostOrigin===u.origin?i:{...i,hostOrigin:u.origin};case"transport-sent":return{...i,transportLog:[{id:u.id,summary:u.summary,sentAt:u.sentAt,state:"pending"},...i.transportLog].slice(0,50)};case"transport-response":return{...i,transportLog:i.transportLog.map(c=>c.id===u.id?{...c,state:u.ok?"ok":"error",...u.status!==void 0?{status:u.status}:{},...u.body!==void 0?{body:u.body}:{},...u.error!==void 0?{error:u.error}:{},...u.timingMs!==void 0?{timingMs:u.timingMs}:{}}:c)};case"transport-clear":return{...i,transportLog:[]};case"apply-scenario":{const c=u.scenario;return{...i,systemId:c.systemId||i.systemId,fixVersion:c.fixVersion,selections:c.selections,slotValues:c.slotValues,mode:c.mode,rows:c.rows??ps.rows,legOverrides:c.legOverrides??[],scenarioName:c.name,scenarioFindings:u.findings,...c.renderer.kind==="tagvalue"?{outputTab:"raw",delimiter:c.renderer.delimiter,omitLengthAndChecksum:c.renderer.omitLengthAndChecksum??!1}:c.renderer.kind==="json"?{outputTab:"json",jsonMapping:c.renderer.mapping}:{outputTab:"annotated"},buildNonce:i.buildNonce+1}}case"regenerate":return{...i,buildNonce:i.buildNonce+1};case"profile-hot-swapped":{const c=u.profile.systems.some(f=>f.id===i.systemId),o=i.jsonMapping!==void 0&&u.profile.renderers?.json?.[i.jsonMapping]!==void 0;return{...i,profile:u.profile,profileIssues:u.issues,systemId:c?i.systemId:u.profile.systems[0]?.id,jsonMapping:o?i.jsonMapping:Object.keys(u.profile.renderers?.json??{})[0],buildNonce:i.buildNonce+1}}case"workspace-attached":return{...i,workspace:u.workspace};case"workspace-detached":return{...i,workspace:void 0};case"workspace-scenarios":return i.workspace?{...i,workspace:{...i.workspace,scenarios:u.scenarios,...u.changedOnDisk!==void 0?{changedOnDisk:u.changedOnDisk}:{}}}:i;case"workspace-scenario-origin":{if(!i.workspace)return i;const c={...i.workspace,changedOnDisk:!1};return delete c.loadedScenarioPath,delete c.loadedScenarioToken,u.path!==void 0&&(c.loadedScenarioPath=u.path),u.token!==void 0&&(c.loadedScenarioToken=u.token),{...i,workspace:c}}case"workspace-instruments-origin":return i.workspace?{...i,workspace:{...i.workspace,instrumentsPath:u.path,instrumentsToken:u.token}}:i}}const yg=ce.createContext(ps),pg=ce.createContext(()=>{});function Ke(){return ce.useContext(yg)}function Tt(){return ce.useContext(pg)}function yv({children:i}){const[u,c]=ce.useReducer(gv,ps),o=u.fixVersion==="profile"?u.profile?.fixVersion:u.fixVersion;return ce.useEffect(()=>{if(!o)return;let f=!1;return fh(o).then(h=>{f||c({type:"dictionary-loaded",dictionary:h})}).catch(h=>{f||c({type:"dictionary-error",message:`The ${o} dictionary failed to load (${String(h)})`})}),()=>{f=!0}},[o]),g.jsx(yg.Provider,{value:u,children:g.jsx(pg.Provider,{value:c,children:i})})}const _m={resolved:void 0,mode:"single",availableModes:["single"],messages:[],slots:[],notices:[],findings:[],strategy:void 0};function pv(){const{profile:i,baseDictionary:u,systemId:c,fixVersion:o,selections:f,slotValues:h,mode:m,rows:d,legOverrides:v,buildNonce:p,instrumentDb:x,scenarioFindings:S}=Ke(),C=ce.useMemo(()=>new Date,[p]),G=ce.useMemo(()=>x?dv(x):void 0,[x]);return ce.useMemo(()=>{if(!i||!u||!c)return{..._m,searchIndex:G};const L=zh(i,c,u);if(!L)return{..._m,searchIndex:G};const w={clock:()=>C,random:vh(p),counters:mh()},P=o==="profile"?i.fixVersion:o,V=Ya(L,f),ne=i.dimensions.find(q=>q.kind==="options"&&q.options?.some(ee=>ee.msgType||ee.modes)),de=ne?.options?.find(q=>q.id===f[ne.id]),Te=de?.modes?.length?de.modes:[V.mode],ge=m==="auto"?Te[0]??"single":m,Z=i.dimensions.find(q=>q.kind==="instrument"),X=Z?f[Z.id]:void 0,ae=V.convention??L.system.convention,Q=V.convention?V.conventionSource:void 0,I=ae?i.conventions?.[ae]:void 0,ie=x&&I?{db:x,convention:I,...Q?{conventionNote:Q}:{}}:void 0,se=X?x?.instruments.get(X)??x?.strategies.get(X):void 0,j=X?x?.strategies.get(X):void 0,Y=[...S];X&&x&&!se&&Y.push({ruleId:"selection-unresolved",severity:"warning",path:"",message:`Instrument '${X}' is not in the loaded instrument database`}),X&&se&&!I&&Y.push({ruleId:"convention-unresolved",severity:"warning",path:"",message:`System ${L.system.label} has no resolvable identity convention ('${ae??"none"}')`});let B=[],M=[],H=[];const K=[...Y];if(ge==="batch"){const q=Jh(L,{selections:f,slotValues:h,rows:d,fixVersion:P},w,ie);B=[...q.messages],M=q.slots,K.push(...q.findings,...q.perMessage.flatMap(ee=>ee.findings)),H=q.perMessage.flatMap(ee=>ee.notices)}else if(ge==="list"){const q=Fh(L,{selections:f,slotValues:h,rows:d,fixVersion:P},w,ie);B=[q.message],M=q.slots,H=q.notices,K.push(...q.findings)}else if(ge==="multileg")if(j){const q=Wh(L,{selections:f,slotValues:h,strategyKey:j.key,legOverrides:v,fixVersion:P},w,ie);B=[q.message],M=q.slots,H=q.notices,K.push(...q.findings)}else K.push({ruleId:"selection-missing",severity:"info",path:"",message:"Multileg mode needs a strategy record selected in the instrument dimension"});else{let q;if(se&&I){const T=gs(se,I,"instrument",P,Q);q=T.fragment,K.push(...T.findings)}const ee=Yh(L,{selections:f,slotValues:h,fixVersion:P,...q?{instrumentFragment:q}:{}},w);B=[ee.message],M=ee.slots,H=ee.notices,K.push(...ee.findings)}for(const q of B)K.push(...Bh(q,L.dictionary,L.policyChain));return{resolved:L,mode:ge,availableModes:Te,messages:B,slots:M,notices:H,findings:K,searchIndex:G,strategy:j}},[i,u,c,o,f,h,m,d,v,p,C,x,G,S])}const hv=`{
  "schemaVersion": 1,
  "name": "Meridian Demo",
  "version": "0.8.0",
  "fixVersion": "FIX.4.4",
  "dictionaryOverlay": {
    "fields": {
      "7001": [
        "SlicerStyle",
        "INT",
        {
          "1": "TWAP",
          "2": "VWAP",
          "3": "POV"
        }
      ],
      "7002": ["SliceQty", "QTY"],
      "7003": ["SliceIntervalMs", "INT"],
      "7004": ["SliceRandomize", "BOOLEAN"],
      "20101": ["MeridianGateway", "STRING"],
      "20102": ["MeridianDeskCode", "STRING"]
    }
  },
  "templates": {
    "D": "tmpl-new-order-single",
    "E:entry": "tmpl-list-entry"
  },
  "generators": {
    "clOrdId": {
      "kind": "template",
      "template": "CLORD-{date:yyyyMMdd}-{seq:4}"
    },
    "listId": {
      "kind": "shared",
      "of": "listIdValue"
    },
    "listIdValue": {
      "kind": "template",
      "template": "L{date:yyyyMMdd}-{rand:4}"
    },
    "transactTime": {
      "kind": "timestamp",
      "precision": "micros"
    },
    "sendingTime": {
      "kind": "timestamp",
      "precision": "micros"
    }
  },
  "fragments": {
    "tmpl-new-order-single": {
      "label": "NewOrderSingle base",
      "ops": [
        {
          "op": "setGenerated",
          "tag": 11,
          "generator": "clOrdId"
        },
        {
          "op": "set",
          "tag": 21,
          "value": "1"
        },
        {
          "op": "setGenerated",
          "tag": 60,
          "generator": "transactTime"
        }
      ]
    },
    "session-alpha": {
      "label": "Session: Alpha",
      "ops": [
        {
          "op": "set",
          "tag": 49,
          "value": "MERIDIAN-CLI"
        },
        {
          "op": "set",
          "tag": 56,
          "value": "ALPHA-GW"
        },
        {
          "op": "set",
          "tag": 34,
          "value": "1"
        },
        {
          "op": "setGenerated",
          "tag": 52,
          "generator": "sendingTime"
        }
      ]
    },
    "session-omega": {
      "label": "Session: Omega",
      "ops": [
        {
          "op": "set",
          "tag": 49,
          "value": "MERIDIAN-CLI"
        },
        {
          "op": "set",
          "tag": 56,
          "value": "OMEGA-HUB"
        },
        {
          "op": "set",
          "tag": 20102,
          "value": "DESK-7"
        },
        {
          "op": "set",
          "tag": 34,
          "value": "1"
        },
        {
          "op": "setGenerated",
          "tag": 52,
          "generator": "sendingTime"
        }
      ]
    },
    "final-alpha-uat": {
      "label": "Enforced routing: ALPHA-UAT",
      "ops": [
        {
          "op": "set",
          "tag": 20101,
          "value": "ALPHA-UAT-GW"
        }
      ]
    },
    "final-alpha-dev": {
      "label": "Enforced routing: ALPHA-DEV",
      "ops": [
        {
          "op": "set",
          "tag": 20101,
          "value": "ALPHA-DEV-GW"
        }
      ]
    },
    "final-omega": {
      "label": "Enforced routing: OMEGA",
      "ops": [
        {
          "op": "set",
          "tag": 20101,
          "value": "OMEGA-LEGACY-GW"
        }
      ]
    },
    "flow-limit": {
      "label": "Flow: Plain limit",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "2"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 44,
          "slot": {
            "tag": 44,
            "label": "Price",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 59,
          "slot": {
            "tag": 59,
            "label": "Time in force",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "default": "0"
          }
        }
      ]
    },
    "flow-slicer": {
      "label": "Flow: SLICER algo",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "2"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Total quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 44,
          "slot": {
            "tag": 44,
            "label": "Limit price",
            "type": "decimal"
          }
        },
        {
          "op": "slot",
          "tag": 7001,
          "slot": {
            "tag": 7001,
            "label": "Slicer style",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 7002,
          "slot": {
            "tag": 7002,
            "label": "Slice quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 7003,
          "slot": {
            "tag": 7003,
            "label": "Slice interval (ms)",
            "type": "int",
            "default": "5000"
          }
        },
        {
          "op": "slot",
          "tag": 7004,
          "slot": {
            "tag": 7004,
            "label": "Randomize slices",
            "type": "bool",
            "default": "N"
          }
        }
      ]
    },
    "flow-basket": {
      "label": "Flow: Basket",
      "ops": [
        {
          "op": "setGenerated",
          "tag": 66,
          "generator": "listId"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 40,
          "slot": {
            "tag": 40,
            "label": "Order type",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "2"
          }
        },
        {
          "op": "slot",
          "tag": 44,
          "slot": {
            "tag": 44,
            "label": "Limit price",
            "type": "decimal"
          }
        },
        {
          "op": "slot",
          "tag": 99,
          "slot": {
            "tag": 99,
            "label": "Stop price",
            "type": "decimal"
          }
        },
        {
          "op": "slot",
          "tag": 59,
          "slot": {
            "tag": 59,
            "label": "Time in force",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "default": "0"
          }
        }
      ]
    },
    "flow-multileg": {
      "label": "Flow: Multileg",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "2"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 44,
          "slot": {
            "tag": 44,
            "label": "Package price",
            "type": "decimal"
          }
        }
      ]
    },
    "tmpl-list-entry": {
      "label": "List entry base",
      "ops": [
        {
          "op": "setGenerated",
          "tag": 11,
          "generator": "clOrdId"
        },
        {
          "op": "set",
          "tag": 21,
          "value": "1"
        }
      ]
    },
    "flow-market": {
      "label": "Flow: Market",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "1"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 59,
          "slot": {
            "tag": 59,
            "label": "Time in force",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "default": "0"
          }
        }
      ]
    },
    "flow-stop": {
      "label": "Flow: Stop",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "3"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 99,
          "slot": {
            "tag": 99,
            "label": "Stop price",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 59,
          "slot": {
            "tag": 59,
            "label": "Time in force",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "default": "0"
          }
        }
      ]
    },
    "flow-stop-limit": {
      "label": "Flow: Stop limit",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "4"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 99,
          "slot": {
            "tag": 99,
            "label": "Stop price",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 44,
          "slot": {
            "tag": 44,
            "label": "Limit price",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 59,
          "slot": {
            "tag": 59,
            "label": "Time in force",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "default": "0"
          }
        }
      ]
    },
    "flow-iceberg": {
      "label": "Flow: Iceberg / reserve",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "2"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 44,
          "slot": {
            "tag": 44,
            "label": "Limit price",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 111,
          "slot": {
            "tag": 111,
            "label": "Display quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 110,
          "slot": {
            "tag": 110,
            "label": "Minimum fill quantity",
            "type": "decimal"
          }
        },
        {
          "op": "slot",
          "tag": 59,
          "slot": {
            "tag": 59,
            "label": "Time in force",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "default": "0"
          }
        }
      ]
    },
    "flow-peg-mid": {
      "label": "Flow: Mid-price peg",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "P"
        },
        {
          "op": "set",
          "tag": 18,
          "value": "M"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 211,
          "slot": {
            "tag": 211,
            "label": "Peg offset",
            "type": "decimal"
          }
        },
        {
          "op": "slot",
          "tag": 59,
          "slot": {
            "tag": 59,
            "label": "Time in force",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "default": "0"
          }
        }
      ]
    },
    "flow-moc": {
      "label": "Flow: Market on close",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "1"
        },
        {
          "op": "set",
          "tag": 59,
          "value": "7"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        }
      ]
    },
    "flow-limit-gtd": {
      "label": "Flow: Limit GTD",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "2"
        },
        {
          "op": "set",
          "tag": 59,
          "value": "6"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 44,
          "slot": {
            "tag": 44,
            "label": "Limit price",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 432,
          "slot": {
            "tag": 432,
            "label": "Expire date (YYYYMMDD)",
            "type": "string",
            "pattern": "^\\\\\\\\d{8}$"
          }
        },
        {
          "op": "slot",
          "tag": 126,
          "slot": {
            "tag": 126,
            "label": "Expire time (UTC, YYYYMMDD-HH:MM:SS)",
            "type": "timestamp"
          }
        }
      ]
    },
    "flow-broker-algo": {
      "label": "Flow: Broker algo (847)",
      "ops": [
        {
          "op": "set",
          "tag": 40,
          "value": "2"
        },
        {
          "op": "slot",
          "tag": 54,
          "slot": {
            "tag": 54,
            "label": "Side",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 38,
          "slot": {
            "tag": 38,
            "label": "Quantity",
            "type": "decimal",
            "required": true
          }
        },
        {
          "op": "slot",
          "tag": 44,
          "slot": {
            "tag": 44,
            "label": "Limit price",
            "type": "decimal"
          }
        },
        {
          "op": "slot",
          "tag": 847,
          "slot": {
            "tag": 847,
            "label": "Target strategy",
            "type": "enum",
            "enumSource": {
              "kind": "dictionary"
            },
            "required": true,
            "default": "1"
          }
        },
        {
          "op": "slot",
          "tag": 849,
          "slot": {
            "tag": 849,
            "label": "Participation rate (%)",
            "type": "decimal"
          }
        }
      ]
    },
    "client-desk": {
      "label": "Client: Meridian desk",
      "ops": [
        {
          "op": "group",
          "countTag": 453,
          "mode": "append",
          "entries": [
            [
              {
                "op": "set",
                "tag": 448,
                "value": "MERIDIAN-DESK"
              },
              {
                "op": "set",
                "tag": 447,
                "value": "D"
              },
              {
                "op": "set",
                "tag": 452,
                "value": "3"
              }
            ]
          ]
        },
        {
          "op": "slot",
          "tag": 1,
          "slot": {
            "tag": 1,
            "label": "Account",
            "type": "string",
            "default": "DESK-ACC"
          }
        }
      ]
    },
    "client-house": {
      "label": "Client: house entry",
      "ops": [
        {
          "op": "group",
          "countTag": 453,
          "mode": "append",
          "entries": [
            [
              {
                "op": "set",
                "tag": 448,
                "value": "MERIDIAN-HOUSE"
              },
              {
                "op": "set",
                "tag": 447,
                "value": "D"
              },
              {
                "op": "set",
                "tag": 452,
                "value": "3"
              }
            ]
          ]
        }
      ]
    }
  },
  "systems": [
    {
      "id": "alpha-uat",
      "label": "ALPHA-UAT",
      "fragments": ["session-alpha"],
      "finalFragment": "final-alpha-uat",
      "capabilities": ["slicer-v2", "lists"],
      "convention": "isin-decomposed"
    },
    {
      "id": "alpha-dev",
      "label": "ALPHA-DEV",
      "extends": "alpha-uat",
      "finalFragment": "final-alpha-dev",
      "capabilities": ["lists"]
    },
    {
      "id": "omega-legacy",
      "label": "OMEGA-LEGACY",
      "fragments": ["session-omega"],
      "finalFragment": "final-omega",
      "capabilities": ["slicer-v2", "futures", "multileg"],
      "dictionaryOverlay": {
        "fields": {
          "59": {
            "enums": {
              "X": "At Omega Close"
            }
          },
          "7001": [
            "LegacySliceMode",
            "INT",
            {
              "1": "Clock Slice",
              "2": "Volume Slice"
            }
          ],
          "7003": ["LegacySliceIntervalSecs", "INT"]
        }
      },
      "validationPolicy": {
        "overrides": [
          {
            "rule": "enum-unknown",
            "tag": 59,
            "severity": "off"
          }
        ]
      },
      "convention": "house-composed"
    }
  ],
  "dimensions": [
    {
      "id": "flow",
      "label": "Flow",
      "kind": "options",
      "required": true,
      "options": [
        {
          "id": "market",
          "label": "Market",
          "fragment": "flow-market",
          "msgType": "D"
        },
        {
          "id": "limit",
          "label": "Limit",
          "fragment": "flow-limit",
          "msgType": "D"
        },
        {
          "id": "limit-gtd",
          "label": "Limit (GTD)",
          "fragment": "flow-limit-gtd",
          "msgType": "D"
        },
        {
          "id": "stop",
          "label": "Stop",
          "fragment": "flow-stop",
          "msgType": "D"
        },
        {
          "id": "stop-limit",
          "label": "Stop limit",
          "fragment": "flow-stop-limit",
          "msgType": "D"
        },
        {
          "id": "iceberg",
          "label": "Iceberg / reserve",
          "fragment": "flow-iceberg",
          "msgType": "D"
        },
        {
          "id": "peg-mid",
          "label": "Mid-price peg",
          "fragment": "flow-peg-mid",
          "msgType": "D"
        },
        {
          "id": "moc",
          "label": "Market on close",
          "fragment": "flow-moc",
          "msgType": "D"
        },
        {
          "id": "broker-algo",
          "label": "Broker algo (847)",
          "fragment": "flow-broker-algo",
          "msgType": "D"
        },
        {
          "id": "slicer",
          "label": "SLICER algo",
          "fragment": "flow-slicer",
          "msgType": "D",
          "availableOn": ["cap:slicer-v2"]
        },
        {
          "id": "basket",
          "label": "Basket",
          "fragment": "flow-basket",
          "msgType": "D",
          "modes": ["batch", "list"],
          "availableOn": ["cap:lists", "omega-legacy"]
        },
        {
          "id": "multileg",
          "label": "Multileg strategy",
          "fragment": "flow-multileg",
          "msgType": "AB",
          "modes": ["multileg"],
          "availableOn": ["cap:multileg"]
        }
      ]
    },
    {
      "id": "client",
      "label": "Client",
      "kind": "options",
      "options": [
        {
          "id": "desk",
          "label": "Meridian desk",
          "fragment": "client-desk"
        },
        {
          "id": "house",
          "label": "House entry (house-code identifiers)",
          "fragment": "client-house",
          "convention": "house-composed"
        }
      ]
    },
    {
      "id": "instrument",
      "label": "Instrument",
      "kind": "instrument",
      "required": true
    }
  ],
  "validationPolicy": {
    "rules": {
      "unknown-tag": "info"
    }
  },
  "conventions": {
    "isin-decomposed": {
      "variants": [
        {
          "when": {
            "securityType": ["OPT"]
          },
          "emit": [
            {
              "role": "symbol",
              "from": {
                "scheme": "exchangeSymbol"
              },
              "required": true
            },
            {
              "role": "securityType",
              "from": {
                "attr": "securityType"
              }
            },
            {
              "role": "securityExchange",
              "from": {
                "attr": "mic"
              }
            },
            {
              "role": "currency",
              "from": {
                "attr": "currency"
              }
            },
            {
              "role": "maturityMonthYear",
              "from": {
                "attr": "maturityMonthYear"
              },
              "required": true
            },
            {
              "role": "strikePrice",
              "from": {
                "attr": "strikePrice"
              },
              "required": true
            },
            {
              "role": "putOrCall",
              "from": {
                "attr": "putOrCall"
              },
              "required": true
            },
            {
              "role": "optAttribute",
              "from": {
                "attr": "optAttribute"
              }
            },
            {
              "role": "contractMultiplier",
              "from": {
                "attr": "contractMultiplier"
              }
            }
          ]
        },
        {
          "when": {
            "securityType": ["FUT"]
          },
          "emit": [
            {
              "role": "symbol",
              "from": {
                "scheme": "exchangeSymbol"
              },
              "required": true
            },
            {
              "role": "securityType",
              "from": {
                "attr": "securityType"
              }
            },
            {
              "role": "securityExchange",
              "from": {
                "attr": "mic"
              }
            },
            {
              "role": "currency",
              "from": {
                "attr": "currency"
              }
            },
            {
              "role": "maturityMonthYear",
              "from": {
                "attr": "maturityMonthYear"
              },
              "required": true
            },
            {
              "role": "contractMultiplier",
              "from": {
                "attr": "contractMultiplier"
              }
            }
          ]
        },
        {
          "emit": [
            {
              "role": "securityId",
              "from": {
                "scheme": "isin"
              },
              "required": true
            },
            {
              "role": "securityIdSource",
              "from": {
                "literal": "4"
              }
            },
            {
              "role": "symbol",
              "from": {
                "firstOf": [
                  {
                    "scheme": "exchangeSymbol"
                  },
                  {
                    "scheme": "isin"
                  }
                ]
              }
            },
            {
              "role": "securityExchange",
              "from": {
                "attr": "mic"
              }
            },
            {
              "role": "currency",
              "from": {
                "attr": "currency"
              }
            },
            {
              "role": "securityType",
              "from": {
                "attr": "securityType"
              }
            }
          ],
          "altIds": [
            {
              "from": {
                "scheme": "exchangeSymbol"
              },
              "sourceCode": "8"
            }
          ]
        }
      ]
    },
    "house-composed": {
      "variants": [
        {
          "emit": [
            {
              "role": "securityId",
              "from": {
                "scheme": "custom:omega"
              },
              "required": true
            },
            {
              "role": "securityIdSource",
              "from": {
                "literal": "8"
              }
            },
            {
              "role": "symbol",
              "from": {
                "firstOf": [
                  {
                    "scheme": "custom:omega"
                  },
                  {
                    "scheme": "exchangeSymbol"
                  }
                ]
              }
            },
            {
              "role": "currency",
              "from": {
                "attr": "currency"
              }
            }
          ]
        }
      ]
    }
  },
  "renderers": {
    "json": {
      "omega-gateway": {
        "keyStyle": "name",
        "groupKey": "countName",
        "emitCounts": false,
        "typedValues": true,
        "omitTags": [8, 9, 10, 34, 49, 52, 56],
        "envelope": {
          "message": {
            "target": "omega-gateway"
          },
          "messageKey": "order"
        }
      }
    }
  }
}
`,vv=`{
  "schemaVersion": 1,
  "comment": "Entirely fictional demo instrument universe for the Meridian environment. Real instrument databases live in private user repos and are never shipped here.",
  "instruments": [
    {
      "key": "MERBANK",
      "name": "Meridian Bank",
      "schemes": { "isin": "ZZ0000000013", "exchangeSymbol": "MERB", "custom:omega": "OMG-1201" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "CORIUM",
      "name": "Corium Industries",
      "schemes": { "isin": "ZZ0000000021", "exchangeSymbol": "CORI", "custom:omega": "OMG-1202" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "NIMBUS",
      "name": "Nimbus Retail",
      "schemes": { "isin": "ZZ0000000039", "exchangeSymbol": "NIMB" },
      "attrs": {
        "securityType": "CS",
        "currency": "ZZD",
        "mic": "XMER",
        "note": "deliberately missing custom:omega to demonstrate the missing-identifier warning"
      }
    },
    {
      "key": "SOLSTICE",
      "name": "Solstice Energy",
      "schemes": { "isin": "ZZ0000000047", "exchangeSymbol": "SOLE", "custom:omega": "OMG-1204" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "KESTREL",
      "name": "Kestrel Logistics",
      "schemes": { "isin": "ZZ0000000054", "exchangeSymbol": "KSTL", "custom:omega": "OMG-1205" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "THISTLE",
      "name": "Thistle Foods",
      "schemes": { "isin": "ZZ0000000062", "exchangeSymbol": "THSL", "custom:omega": "OMG-1206" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "PALISADE",
      "name": "Palisade Insurance",
      "schemes": { "isin": "ZZ0000000070", "exchangeSymbol": "PLSD", "custom:omega": "OMG-1207" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "QUARRY",
      "name": "Quarry Minerals",
      "schemes": { "isin": "ZZ0000000088", "exchangeSymbol": "QRRY", "custom:omega": "OMG-1208" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "VELUM",
      "name": "Velum Media",
      "schemes": { "isin": "ZZ0000000096", "exchangeSymbol": "VELM", "custom:omega": "OMG-1209" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "ARBORWAY",
      "name": "Arborway Timber",
      "schemes": { "isin": "ZZ0000000104", "exchangeSymbol": "ARBW", "custom:omega": "OMG-1210" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "GLACIS",
      "name": "Glacis Defence",
      "schemes": { "isin": "ZZ0000000112", "exchangeSymbol": "GLCS", "custom:omega": "OMG-1211" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "HALCYON",
      "name": "Halcyon Pharma",
      "schemes": { "isin": "ZZ0000000120", "exchangeSymbol": "HALC", "custom:omega": "OMG-1212" },
      "attrs": { "securityType": "CS", "currency": "ZZD", "mic": "XMER" }
    },
    {
      "key": "FCOR-U6",
      "name": "Corium Index Future Sep26",
      "schemes": { "exchangeSymbol": "FCORU6", "custom:omega": "OMG-FCOR-U6" },
      "attrs": {
        "securityType": "FUT",
        "currency": "ZZD",
        "mic": "XMER",
        "maturityMonthYear": "202609",
        "contractMultiplier": "10"
      }
    },
    {
      "key": "FCOR-Z6",
      "name": "Corium Index Future Dec26",
      "schemes": { "exchangeSymbol": "FCORZ6", "custom:omega": "OMG-FCOR-Z6" },
      "attrs": {
        "securityType": "FUT",
        "currency": "ZZD",
        "mic": "XMER",
        "maturityMonthYear": "202612",
        "contractMultiplier": "10"
      }
    },
    {
      "key": "FCOR-U6W2",
      "name": "Corium Index Future Sep26 Week 2",
      "schemes": { "exchangeSymbol": "FCORU6w2", "custom:omega": "OMG-FCOR-U6W2" },
      "attrs": {
        "securityType": "FUT",
        "currency": "ZZD",
        "mic": "XMER",
        "maturityMonthYear": "202609w2",
        "contractMultiplier": "10"
      }
    },
    {
      "key": "MERBANK-U6-25C",
      "name": "Meridian Bank Sep26 25 Call",
      "schemes": { "exchangeSymbol": "MERB", "custom:omega": "OMG-MERB-U6-25C" },
      "attrs": {
        "securityType": "OPT",
        "currency": "ZZD",
        "mic": "XMER",
        "maturityMonthYear": "202609",
        "strikePrice": "25",
        "putOrCall": "1",
        "optAttribute": "A",
        "contractMultiplier": "100",
        "cfiCode": "OCASPS",
        "underlying": "MERBANK"
      }
    },
    {
      "key": "MERBANK-U6-25P",
      "name": "Meridian Bank Sep26 25 Put",
      "schemes": { "exchangeSymbol": "MERB", "custom:omega": "OMG-MERB-U6-25P" },
      "attrs": {
        "securityType": "OPT",
        "currency": "ZZD",
        "mic": "XMER",
        "maturityMonthYear": "202609",
        "strikePrice": "25",
        "putOrCall": "0",
        "optAttribute": "A",
        "contractMultiplier": "100",
        "cfiCode": "OPASPS",
        "underlying": "MERBANK"
      }
    },
    {
      "key": "MERBANK-U6-30C",
      "name": "Meridian Bank Sep26 30 Call",
      "schemes": { "exchangeSymbol": "MERB", "custom:omega": "OMG-MERB-U6-30C" },
      "attrs": {
        "securityType": "OPT",
        "currency": "ZZD",
        "mic": "XMER",
        "maturityMonthYear": "202609",
        "strikePrice": "30",
        "putOrCall": "1",
        "optAttribute": "A",
        "contractMultiplier": "100",
        "cfiCode": "OCASPS",
        "underlying": "MERBANK"
      }
    }
  ],
  "strategies": [
    {
      "key": "FCOR-CAL-U6Z6",
      "name": "Corium Calendar Spread Sep/Dec26",
      "strategyType": "CS",
      "schemes": { "custom:omega": "OMG-FCOR-CAL-U6Z6" },
      "attrs": { "securityType": "MLEG", "currency": "ZZD", "mic": "XMER" },
      "legs": [
        { "instrument": "FCOR-U6", "ratioQty": "1", "side": "1" },
        { "instrument": "FCOR-Z6", "ratioQty": "1", "side": "2" }
      ]
    }
  ]
}
`;function bv(i,u){if(/\.csv$/i.test(u))return"instruments";try{const c=JSON.parse(i);if(typeof c=="object"&&c!==null){if("instruments"in c)return"instruments";if("mode"in c||"renderer"in c||"slotValues"in c)return"scenario"}}catch{return"instruments"}return"profile"}function Sv({onEditInstruments:i}){const{profile:u,profileIssues:c,instrumentDb:o,instrumentDbIssues:f}=Ke(),h=Tt(),m=ce.useRef(null),[d,v]=ce.useState(!1);function p(w){const{profile:P,issues:V}=La(w);h({type:"profile-loaded",profile:P,issues:V})}function x(w){const{db:P,issues:V}=ys(w);h({type:"instruments-loaded",db:P,issues:V})}function S(w){if(!u)return;const{scenario:P,issues:V}=Ss(w);if(!P)return;const ne=[...V.map(de=>({ruleId:"scenario-load",severity:de.severity,path:de.path,message:de.message})),...Ts(P,u)];h({type:"apply-scenario",scenario:P,findings:ne})}async function C(w){for(const P of w??[]){const V=await P.text(),ne=bv(V,P.name);ne==="instruments"?x(V):ne==="scenario"?S(V):p(V)}}function G(w){w.preventDefault(),v(!1),C(w.dataTransfer.files)}const L=[...c,...f];return g.jsxs("section",{className:"panel",children:[g.jsx("div",{className:"panel-header",children:"Workspace"}),g.jsxs("div",{className:"panel-body",style:{display:"flex",flexDirection:"column",gap:"0.6rem"},children:[u?g.jsxs("div",{className:"profile-card",children:[g.jsx("span",{className:"name",children:u.name}),g.jsxs("span",{className:"meta",children:["v",u.version," · ",u.fixVersion," · ",u.systems.length," systems"]})]}):g.jsx("p",{className:"empty-note",style:{padding:0},children:"No profile loaded. Load the demo, or drop your own files — nothing ever leaves this browser."}),o&&g.jsxs("div",{className:"profile-card",children:[g.jsxs("span",{className:"name",children:["Instrument DB",i&&g.jsx("button",{className:"btn small",style:{marginLeft:"0.5rem"},onClick:i,children:"✎ Edit"})]}),g.jsxs("span",{className:"meta",children:[o.instruments.size," instruments · ",o.strategies.size," ","strategies"]})]}),g.jsxs("div",{className:`dropzone${d?" over":""}`,onClick:()=>m.current?.click(),onKeyDown:w=>{(w.key==="Enter"||w.key===" ")&&m.current?.click()},role:"button",tabIndex:0,onDragOver:w=>{w.preventDefault(),v(!0)},onDragLeave:()=>v(!1),onDrop:G,children:["Drop ",g.jsx("code",{children:"*.profile.json"})," or instrument files (JSON/CSV) here, or click to browse"]}),g.jsx("input",{ref:m,type:"file",accept:".json,.csv,application/json,text/csv",multiple:!0,hidden:!0,onChange:w=>{C(w.target.files)}}),g.jsx("button",{className:"btn primary",onClick:()=>{p(hv),x(vv)},children:"Load demo profile + instruments"}),L.length>0&&g.jsx("div",{children:L.map((w,P)=>g.jsxs("div",{className:`finding ${w.severity}`,children:[g.jsx("span",{className:"sev-label",children:w.severity}),g.jsxs("span",{children:[w.path&&g.jsx("code",{children:w.path})," ",w.message]})]},P))})]})]})}function hg({id:i,index:u,placeholder:c,selectedLabel:o,onPick:f,allowClear:h,compact:m}){const[d,v]=ce.useState(""),[p,x]=ce.useState(!1),S=ce.useRef(null);ce.useEffect(()=>{const L=w=>{S.current?.contains(w.target)||x(!1)};return document.addEventListener("mousedown",L),()=>document.removeEventListener("mousedown",L)},[]);const C=p?u?.search(d)??[]:[],G=!p&&d===""&&o!==void 0;return g.jsxs("div",{className:`typeahead${m?" compact":""}`,ref:S,children:[g.jsx("input",{id:i,className:"input",role:"combobox","aria-expanded":p,"aria-autocomplete":"list",placeholder:u?c:"No instrument DB loaded",value:G?o:d,disabled:!u,onFocus:()=>x(!0),onChange:L=>{v(L.target.value),x(!0)}}),p&&(C.length>0||h)&&g.jsxs("ul",{className:"typeahead-list",role:"listbox",children:[h&&g.jsx("li",{children:g.jsx("button",{type:"button",onClick:()=>{f(void 0),v(""),x(!1)},children:g.jsx("span",{className:"hit-label hint",children:"— clear —"})})}),C.map(L=>g.jsx("li",{children:g.jsxs("button",{type:"button",role:"option","aria-selected":!1,onClick:()=>{f(L.key),v(""),x(!1)},children:[g.jsx("span",{className:"hit-label",children:L.label}),g.jsxs("span",{className:"hit-detail",children:[L.kind==="strategy"?"⧉ ":"",L.detail]})]})},`${L.kind}:${L.key}`))]})]})}function Tv({dimensionId:i,label:u,required:c,derived:o}){const{selections:f,instrumentDb:h}=Ke(),m=Tt(),d=f[i],v=d?h?.instruments.get(d)??h?.strategies.get(d):void 0;return g.jsxs("div",{className:"field-row",children:[g.jsxs("label",{className:"field-label",htmlFor:`inst-${i}`,children:[u,c&&g.jsx("span",{className:"req",children:"*"})]}),g.jsx(hg,{id:`inst-${i}`,index:o.searchIndex,placeholder:"Search instruments…",...v?{selectedLabel:v.name??v.key}:{},onPick:p=>m({type:"select-option",dimensionId:i,optionId:p??""}),allowClear:!0})]})}const xv={single:"Single",batch:"Batch",list:"List (35=E)",multileg:"Multileg (35=AB)"};function Ev({derived:i}){const u=Tt();return i.availableModes.length<2?null:g.jsxs("div",{className:"field-row",children:[g.jsx("span",{className:"field-label",children:"Mode"}),g.jsx("span",{className:"seg",role:"tablist",children:i.availableModes.map(c=>g.jsx("button",{role:"tab","aria-selected":i.mode===c,className:i.mode===c?"active":"",onClick:()=>u({type:"set-mode",mode:c}),children:xv[c]},c))})]})}function Ov({derived:i}){const{profile:u,systemId:c,selections:o,fixVersion:f}=Ke(),h=Tt();if(!u)return null;const m=i.resolved?Ch(i.resolved):[];return g.jsxs("section",{className:"panel",children:[g.jsx("div",{className:"panel-header",children:"Build selection"}),g.jsxs("div",{className:"panel-body",children:[g.jsxs("div",{className:"field-row",children:[g.jsx("label",{className:"field-label",htmlFor:"sel-system",children:"Target system"}),g.jsx("select",{id:"sel-system",className:"input",value:c??"",onChange:d=>h({type:"select-system",systemId:d.target.value}),children:u.systems.map(d=>g.jsx("option",{value:d.id,children:d.label},d.id))})]}),m.map(({dimension:d,options:v})=>d.kind==="instrument"?g.jsx(Tv,{dimensionId:d.id,label:d.label,required:d.required,derived:i},d.id):g.jsxs("div",{className:"field-row",children:[g.jsxs("label",{className:"field-label",htmlFor:`sel-${d.id}`,children:[d.label,d.required&&g.jsx("span",{className:"req",children:"*"})]}),g.jsxs("select",{id:`sel-${d.id}`,className:"input",value:o[d.id]??"",onChange:p=>h({type:"select-option",dimensionId:d.id,optionId:p.target.value}),children:[g.jsx("option",{value:"",children:"—"}),v.map(({option:p,available:x})=>g.jsxs("option",{value:p.id,children:[p.label,x?"":" (not on this system)"]},p.id))]})]},d.id)),g.jsxs("div",{className:"field-row",children:[g.jsx("label",{className:"field-label",htmlFor:"sel-fixversion",children:"FIX version"}),g.jsxs("select",{id:"sel-fixversion",className:"input",value:f,onChange:d=>h({type:"set-fix-version",fixVersion:d.target.value}),children:[g.jsxs("option",{value:"profile",children:["profile default (",u.fixVersion,")"]}),Qm.map(d=>g.jsx("option",{value:d,children:d},d))]})]}),g.jsx(Ev,{derived:i})]})]})}function jv(i,u){if(i.enumSource?.kind==="inline")return i.enumSource.values;const c=u.resolved?.dictionary.fields.get(i.tag)?.enums;return c?[...c.entries()].map(([o,f])=>({value:o,label:f})):[]}function Av({slot:i,derived:u}){const{slotValues:c}=Ke(),o=Tt(),f=i.spec,h=c[f.tag]??"",m=f.generatorDefault!==void 0?`generated (${f.generatorDefault})`:f.default??"",d=p=>o(p===""?{type:"clear-slot",tag:f.tag}:{type:"set-slot",tag:f.tag,value:p}),v=f.type==="enum"||f.type==="bool"?jv(f,u):[];return g.jsxs("div",{className:"field-row",children:[g.jsxs("label",{className:"field-label",htmlFor:`slot-${f.tag}`,children:[g.jsx("span",{className:"tag",children:f.tag}),f.label,f.required&&g.jsx("span",{className:"req",children:"*"})]}),f.type==="enum"&&v.length>0?g.jsxs("select",{id:`slot-${f.tag}`,className:"input",value:h,onChange:p=>d(p.target.value),children:[g.jsx("option",{value:"",children:f.default!==void 0?`default (${f.default})`:"—"}),v.map(p=>g.jsxs("option",{value:p.value,children:[p.value," — ",p.label]},p.value))]}):f.type==="bool"?g.jsxs("select",{id:`slot-${f.tag}`,className:"input",value:h,onChange:p=>d(p.target.value),children:[g.jsx("option",{value:"",children:f.default!==void 0?`default (${f.default})`:"—"}),g.jsx("option",{value:"Y",children:"Y — Yes"}),g.jsx("option",{value:"N",children:"N — No"})]}):g.jsx("input",{id:`slot-${f.tag}`,className:"input",value:h,placeholder:m,inputMode:f.type==="int"||f.type==="decimal"?"decimal":void 0,onChange:p=>d(p.target.value)})]})}function Nv({derived:i}){const{selections:u}=Ke(),c=i.slots;if(!i.resolved)return null;const o=i.mode==="batch"||i.mode==="list",f=i.resolved.profile.dimensions.find(m=>m.kind==="options"),h=!f||u[f.id]!==void 0;return g.jsxs("section",{className:"panel",children:[g.jsxs("div",{className:"panel-header",children:["Parameters",o&&g.jsx("span",{className:"hint",children:"shared defaults — rows override"})]}),g.jsx("div",{className:"panel-body",children:c.length===0?g.jsx("p",{className:"empty-note",style:{padding:0},children:h?"The selected flow declares no parameter slots.":"Pick a flow to see its parameters."}):c.map(m=>g.jsx(Av,{slot:m,derived:i},m.spec.tag))})]})}function Mv({derived:i}){const{rows:u,instrumentDb:c,slotValues:o}=Ke(),f=Tt(),h=i.slots;return i.mode!=="batch"&&i.mode!=="list"?null:g.jsxs("section",{className:"panel",children:[g.jsxs("div",{className:"panel-header",children:[i.mode==="list"?"List orders (35=E rows)":"Batch rows",g.jsx("span",{style:{flex:1}}),g.jsx("button",{className:"btn small",onClick:()=>f({type:"row-add"}),children:"+ Row"})]}),g.jsxs("div",{className:"panel-body",style:{overflowX:"auto",padding:"0.4rem"},children:[g.jsxs("table",{className:"grid-table",children:[g.jsx("thead",{children:g.jsxs("tr",{children:[g.jsx("th",{children:"#"}),g.jsx("th",{children:"Instrument"}),h.map(m=>g.jsxs("th",{children:[g.jsx("span",{className:"tag mono",children:m.spec.tag})," ",m.spec.label]},m.spec.tag)),g.jsx("th",{})]})}),g.jsx("tbody",{children:u.map((m,d)=>g.jsxs("tr",{children:[g.jsx("td",{className:"mono rownum",children:d+1}),g.jsx("td",{className:"instrument-cell",children:g.jsx(hg,{id:`row-inst-${d}`,index:i.searchIndex,placeholder:"—",...m.instrument?{selectedLabel:c?.instruments.get(m.instrument)?.name??c?.strategies.get(m.instrument)?.name??m.instrument}:{},onPick:v=>f({type:"row-update",index:d,instrument:v??""}),allowClear:!0,compact:!0})}),h.map(v=>g.jsx("td",{children:g.jsx("input",{className:"input",value:m.slotValues[v.spec.tag]??"",placeholder:o[v.spec.tag]??v.spec.default??"",onChange:p=>f({type:"row-update",index:d,slotValues:{[v.spec.tag]:p.target.value}})})},v.spec.tag)),g.jsxs("td",{className:"row-actions",children:[g.jsx("button",{className:"btn small",title:"Duplicate row",onClick:()=>f({type:"row-duplicate",index:d}),children:"⧉"}),g.jsx("button",{className:"btn small",title:"Remove row",onClick:()=>f({type:"row-remove",index:d}),children:"✕"})]})]},d))})]}),g.jsx("p",{className:"hint",style:{margin:"0.4rem 0 0"},children:"Empty cells inherit the shared parameter values; the instrument column overrides the instrument dimension per row."})]})]})}function Dv({derived:i}){const{legOverrides:u,instrumentDb:c}=Ke(),o=Tt();if(i.mode!=="multileg")return null;const f=i.strategy;return g.jsxs("section",{className:"panel",children:[g.jsxs("div",{className:"panel-header",children:["Legs ",f?`· ${f.name??f.key}`:""]}),g.jsx("div",{className:"panel-body",style:{overflowX:"auto",padding:"0.4rem"},children:f?g.jsxs("table",{className:"grid-table",children:[g.jsx("thead",{children:g.jsxs("tr",{children:[g.jsx("th",{children:"#"}),g.jsx("th",{children:"Instrument"}),g.jsxs("th",{children:[g.jsx("span",{className:"tag mono",children:"623"})," Ratio"]}),g.jsxs("th",{children:[g.jsx("span",{className:"tag mono",children:"624"})," Side"]}),g.jsxs("th",{children:[g.jsx("span",{className:"tag mono",children:"566"})," Price"]})]})}),g.jsx("tbody",{children:f.legs.map((h,m)=>{const d=u[m]??{},v=c?.instruments.get(h.instrument),p=d.side??h.side,x=i.resolved?$m(i.resolved.dictionary,54,p):void 0;return g.jsxs("tr",{children:[g.jsx("td",{className:"mono rownum",children:m+1}),g.jsx("td",{children:g.jsx("span",{className:"hit-label",children:v?.name??h.instrument})}),g.jsx("td",{children:g.jsx("input",{className:"input",value:d.ratioQty??"",placeholder:h.ratioQty,onChange:S=>o({type:"leg-override",index:m,patch:{ratioQty:S.target.value}})})}),g.jsx("td",{children:g.jsxs("select",{className:"input",value:p,title:x,onChange:S=>o({type:"leg-override",index:m,patch:{side:S.target.value}}),children:[g.jsx("option",{value:"1",children:"1 — Buy"}),g.jsx("option",{value:"2",children:"2 — Sell"})]})}),g.jsx("td",{children:g.jsx("input",{className:"input",value:d.price??"",placeholder:h.price??"—",onChange:S=>o({type:"leg-override",index:m,patch:{price:S.target.value}})})})]},m)})})]}):g.jsx("p",{className:"empty-note",children:"Select a strategy record (⧉) in the instrument search to populate the leg grid."})})]})}function hs(i,u){const c=new Blob([u],{type:"application/octet-stream"}),o=URL.createObjectURL(c),f=document.createElement("a");f.href=o,f.download=i,f.click(),URL.revokeObjectURL(o)}function no(i,u){const c=i.profile,o=i.outputTab==="raw"?{kind:"tagvalue",delimiter:i.delimiter,...i.omitLengthAndChecksum?{omitLengthAndChecksum:!0}:{}}:i.outputTab==="json"&&i.jsonMapping?{kind:"json",mapping:i.jsonMapping}:{kind:"annotated"};return{schemaVersion:eo,name:i.scenarioName||"untitled",profile:{name:c.name,version:c.version},fixVersion:i.fixVersion==="profile"?c.fixVersion:i.fixVersion,mode:u.mode,systemId:i.systemId??"",selections:i.selections,slotValues:i.slotValues,...u.mode==="batch"||u.mode==="list"?{rows:i.rows}:{},...u.mode==="multileg"&&i.legOverrides.length>0?{legOverrides:i.legOverrides}:{},renderer:o}}const zv=`{
  "fixVersion": "FIX.4.4",
  "mode": "single",
  "name": "SLICER on Alpha",
  "profile": {
    "name": "Meridian Demo",
    "version": "0.4.0"
  },
  "renderer": {
    "delimiter": "pipe",
    "kind": "tagvalue"
  },
  "schemaVersion": 1,
  "selections": {
    "flow": "slicer",
    "instrument": "MERBANK"
  },
  "slotValues": {
    "38": "5000",
    "44": "25.10",
    "7002": "500"
  },
  "systemId": "alpha-uat"
}
`,Cv=`{
  "fixVersion": "FIX.4.4",
  "mode": "batch",
  "name": "Basket of 5",
  "profile": {
    "name": "Meridian Demo",
    "version": "0.4.0"
  },
  "renderer": {
    "kind": "json",
    "mapping": "omega-gateway"
  },
  "rows": [
    {
      "instrument": "MERBANK",
      "slotValues": {
        "38": "100",
        "44": "25.10"
      }
    },
    {
      "instrument": "CORIUM",
      "slotValues": {
        "38": "250",
        "44": "8.42"
      }
    },
    {
      "instrument": "SOLSTICE",
      "slotValues": {
        "38": "75",
        "44": "112.00",
        "54": "2"
      }
    },
    {
      "instrument": "KESTREL",
      "slotValues": {
        "38": "300",
        "44": "3.55"
      }
    },
    {
      "instrument": "HALCYON",
      "slotValues": {
        "38": "50",
        "44": "61.75"
      }
    }
  ],
  "schemaVersion": 1,
  "selections": {
    "flow": "basket"
  },
  "slotValues": {
    "54": "1"
  },
  "systemId": "alpha-uat"
}
`,_v=`{
  "fixVersion": "FIX.4.4",
  "mode": "list",
  "name": "Order list of 3",
  "profile": {
    "name": "Meridian Demo",
    "version": "0.4.0"
  },
  "renderer": {
    "kind": "annotated"
  },
  "rows": [
    {
      "instrument": "MERBANK",
      "slotValues": {
        "38": "100",
        "44": "25.10"
      }
    },
    {
      "instrument": "CORIUM",
      "slotValues": {
        "38": "200",
        "44": "8.40"
      }
    },
    {
      "instrument": "THISTLE",
      "slotValues": {
        "38": "150",
        "44": "14.25"
      }
    }
  ],
  "schemaVersion": 1,
  "selections": {
    "flow": "basket"
  },
  "slotValues": {
    "54": "1"
  },
  "systemId": "alpha-uat"
}
`,wv=`{
  "fixVersion": "FIX.4.4",
  "mode": "multileg",
  "name": "Calendar spread",
  "profile": {
    "name": "Meridian Demo",
    "version": "0.4.0"
  },
  "renderer": {
    "delimiter": "pipe",
    "kind": "tagvalue"
  },
  "schemaVersion": 1,
  "selections": {
    "flow": "multileg",
    "instrument": "FCOR-CAL-U6Z6"
  },
  "slotValues": {
    "38": "10"
  },
  "systemId": "omega-legacy"
}
`,wm={"SLICER on Alpha (retarget me)":zv,"Basket of 5":Cv,"Order list (3 rows)":_v,"Calendar spread (35=AB)":wv};function Rv({derived:i}){const u=Ke(),c=Tt(),{profile:o,scenarioName:f}=u,h=ce.useRef(()=>{});h.current=()=>{u.profile&&hs(`${u.scenarioName||"untitled"}.scenario.json`,to(no(u,i)))};const m=u.workspace!==void 0;if(ce.useEffect(()=>{if(m)return;const v=p=>{(p.ctrlKey||p.metaKey)&&p.key==="s"&&(p.preventDefault(),h.current())};return window.addEventListener("keydown",v),()=>window.removeEventListener("keydown",v)},[m]),!o)return null;const d=v=>{const{scenario:p,issues:x}=Ss(v);if(!p)return;const S=[...x.map(C=>({ruleId:"scenario-load",severity:C.severity,path:C.path,message:C.message})),...Ts(p,o)];c({type:"apply-scenario",scenario:p,findings:S})};return g.jsxs("section",{className:"panel",children:[g.jsx("div",{className:"panel-header",children:"Scenario"}),g.jsxs("div",{className:"panel-body",style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[g.jsx("input",{className:"input",style:{flex:"1 1 8rem"},placeholder:"scenario name",value:f,onChange:v=>c({type:"set-scenario-name",name:v.target.value})}),g.jsx("button",{className:"btn small",onClick:()=>hs(`${f||"untitled"}.scenario.json`,to(no(u,i))),children:"⬇ Save"}),g.jsxs("select",{className:"input",style:{flex:"1 1 100%"},value:"",onChange:v=>{const p=wm[v.target.value];p&&d(p)},children:[g.jsx("option",{value:"",children:"Load a demo scenario…"}),Object.keys(wm).map(v=>g.jsx("option",{value:v,children:v},v))]}),g.jsx("p",{className:"hint",style:{margin:0},children:"Scenario files also load via the Workspace drop zone."})]})]})}function Uv(i){const u=[`Set by: ${i.sourceLabel}${i.via?` (generator: ${i.via})`:""}`];let c=i.overwrote;for(;c;)u.push(`Overwrote: ${c.sourceLabel}`),c=c.overwrote;return u.join(`
`)}const kv={error:"var(--sev-error)",warning:"var(--sev-warning)",info:"var(--sev-info)"};function qv({derived:i,message:u}){if(!i.resolved)return null;const c=Oh(u,i.resolved.dictionary),o=new Map;for(const f of i.findings)f.path&&!o.has(f.path)&&o.set(f.path,f);return g.jsxs("div",{className:"annotated panel-body tight",children:[c.length===0&&g.jsx("p",{className:"empty-note",children:"No fields composed yet."}),c.map(f=>{const h=o.get(f.path),m=h&&(h.severity==="error"||h.severity==="warning")?` flagged-${h.severity}`:"";return g.jsxs("div",{className:`line${m}`,style:{paddingLeft:`${.7+f.depth*1.2}rem`},title:h?.message,children:[h&&g.jsx("span",{className:"sev-dot",style:{background:kv[h.severity]}}),g.jsx("span",{className:"tag",children:f.tag}),f.name&&g.jsxs("span",{className:"name",children:["(",f.name,")"]}),g.jsx("span",{className:"eq",children:"="}),g.jsx("span",{className:"value",children:f.value}),f.enumLabel&&g.jsxs("span",{className:"enum-label",children:["[",f.enumLabel,"]"]}),f.isGroupCount&&g.jsx("span",{className:"hint",children:"entries"}),g.jsxs("span",{className:"prov",title:Uv(f.provenance),children:[f.provenance.overwrote&&g.jsx("span",{className:"overwrote",children:"⊘ "}),f.provenance.sourceLabel,f.provenance.via?" ⚙":""]})]},f.path)})]})}const vg={keyStyle:"name",groupKey:"countName",emitCounts:!1,typedValues:!0},Kc={soh:"SOH",pipe:"|",caretA:"^A"};function bg(i){const{delimiter:u,omitLengthAndChecksum:c}=Ke();return i.resolved?i.messages.map(o=>tg(o,i.resolved.dictionary,{delimiter:u,...c?{omitLengthAndChecksum:!0}:{}})):[]}function Sg(i){const{jsonMapping:u}=Ke(),c=i.resolved?.profile.renderers?.json??{},o=Object.keys(c),f=u&&c[u]?u:o[0];return f?{name:f,cfg:c[f],names:o,isFallback:!1}:{name:void 0,cfg:vg,names:o,isFallback:!0}}function Hv({derived:i}){const{delimiter:u}=Ke(),c=bg(i);return g.jsx("div",{className:"panel-body",style:{display:"flex",flexDirection:"column",gap:"0.4rem"},children:c.map((o,f)=>g.jsx("div",{className:"raw-wire",children:u==="soh"?o.replaceAll(_n,"␁"):o},f))})}function Vv({derived:i}){const{cfg:u,isFallback:c}=Sg(i);if(!i.resolved||!u)return g.jsx("p",{className:"empty-note",children:"Load a profile to render JSON."});const o=dg(i.messages,i.resolved.dictionary,u);return g.jsxs("div",{className:"panel-body",children:[c&&g.jsxs("p",{className:"hint",style:{margin:"0 0 0.5rem"},children:["Rendered with the built-in default mapping — the profile declares no"," ",g.jsx("code",{children:"renderers.json"}),". Add one to match your in-house format (authoring guide §11)."]}),g.jsx("pre",{className:"raw-wire",style:{margin:0},children:o})]})}async function Lv(i){try{return await navigator.clipboard.writeText(i),!0}catch{return!1}}function Bv({derived:i}){const{outputTab:u,delimiter:c,omitLengthAndChecksum:o,scenarioName:f}=Ke(),h=Tt(),[m,d]=ce.useState(!1),[v,p]=ce.useState(0),x=bg(i),{name:S,cfg:C,names:G}=Sg(i);if(!i.resolved||i.messages.length===0)return g.jsxs("section",{className:"panel",children:[g.jsx("div",{className:"panel-header",children:"Output"}),g.jsx("p",{className:"empty-note",children:"Load a profile and pick a flow to see the message."})]});const L=Math.min(v,i.messages.length-1),w=()=>u==="json"&&C?{text:dg(i.messages,i.resolved.dictionary,C),filename:`${f||"messages"}.json`}:{text:x.join(`
`)+`
`,filename:`${f||"messages"}.fix.txt`},P=async()=>{await Lv(w().text)&&(d(!0),setTimeout(()=>d(!1),1500))};return g.jsxs("section",{className:"panel",children:[g.jsxs("div",{className:"panel-header",children:["Output · ",g.jsxs("code",{children:["35=",i.messages[L].msgType]}),i.messages.length>1&&g.jsx("span",{className:"seg",children:i.messages.map((V,ne)=>g.jsx("button",{className:ne===L?"active":"",onClick:()=>p(ne),children:ne+1},ne))}),g.jsx("span",{style:{flex:1}}),g.jsx("span",{className:"seg",role:"tablist",children:["annotated","raw","json"].map(V=>g.jsx("button",{role:"tab","aria-selected":u===V,className:u===V?"active":"",onClick:()=>h({type:"set-output-tab",tab:V}),children:V==="annotated"?"Annotated":V==="raw"?"tag=value":"JSON"},V))})]}),u==="annotated"?g.jsx(qv,{derived:i,message:i.messages[L]}):u==="raw"?g.jsx(Hv,{derived:i}):g.jsx(Vv,{derived:i}),g.jsxs("div",{className:"panel-body",style:{display:"flex",gap:"0.5rem",alignItems:"center",flexWrap:"wrap",borderTop:"1px solid var(--border)"},children:[u!=="json"&&g.jsxs(g.Fragment,{children:[g.jsx("span",{className:"seg",children:Object.keys(Kc).map(V=>g.jsx("button",{className:c===V?"active":"",onClick:()=>h({type:"set-delimiter",delimiter:V}),title:`Delimiter: ${Kc[V]}`,children:Kc[V]},V))}),g.jsxs("label",{className:"hint",style:{display:"flex",gap:"0.3rem",alignItems:"center"},children:[g.jsx("input",{type:"checkbox",checked:o,onChange:V=>h({type:"set-omit-length-checksum",omit:V.target.checked})}),"omit 9/10"]})]}),u==="json"&&G.length>1&&g.jsx("select",{className:"input",style:{width:"auto"},value:S,onChange:V=>h({type:"set-json-mapping",mapping:V.target.value}),children:G.map(V=>g.jsx("option",{value:V,children:V},V))}),g.jsx("span",{style:{flex:1}}),g.jsx("button",{className:"btn small",onClick:()=>h({type:"regenerate"}),children:"↻ Regenerate"}),g.jsx("button",{className:"btn small",onClick:()=>{const{text:V,filename:ne}=w();hs(ne,V)},children:"⬇ Download"}),g.jsx("button",{className:"btn small primary",onClick:()=>{P()},children:m?"Copied ✓":"Copy"})]})]})}const Rm={error:0,warning:1,info:2};function Gv({derived:i}){if(!i.resolved)return null;const u=[...i.findings].sort((o,f)=>Rm[o.severity]-Rm[f.severity]),c=i.notices;return g.jsxs("section",{className:"panel",children:[g.jsxs("div",{className:"panel-header",children:["Findings",g.jsx("span",{style:{flex:1}}),g.jsxs("span",{className:"hint",children:[u.length===0?"clean":`${u.length} finding${u.length>1?"s":""}`,c.length>0?` · ${c.length} merge notice${c.length>1?"s":""}`:""]})]}),g.jsxs("div",{className:"panel-body tight",children:[u.length===0&&c.length===0&&g.jsx("p",{className:"empty-note",children:"No validation findings. Validation informs — it never blocks."}),u.map((o,f)=>g.jsxs("div",{className:`finding ${o.severity}`,children:[g.jsx("span",{className:"sev-label",children:o.severity}),g.jsxs("span",{children:[o.path&&g.jsx("code",{children:o.path})," ",o.message]}),g.jsx("span",{className:"rule",children:o.ruleId})]},f)),c.map((o,f)=>g.jsxs("div",{className:"finding info",children:[g.jsx("span",{className:"sev-label",children:"merge"}),g.jsxs("span",{children:[o.kind==="overwrite"&&g.jsxs(g.Fragment,{children:[g.jsx("code",{children:o.path})," '",o.previousValue,"' from ",g.jsx("em",{children:o.previous})," overwritten by ",g.jsx("em",{children:o.by})]}),o.kind==="remove"&&g.jsxs(g.Fragment,{children:[g.jsx("code",{children:o.path})," set by ",g.jsx("em",{children:o.previous})," removed by ",g.jsx("em",{children:o.by})]}),o.kind==="group-replace"&&g.jsxs(g.Fragment,{children:["group ",g.jsx("code",{children:o.countTag})," from ",g.jsx("em",{children:o.previous})," replaced by"," ",g.jsx("em",{children:o.by})]})]}),g.jsx("span",{className:"rule",children:"merge"})]},`n${f}`))]})]})}const Tg=1;function Yv(i){return typeof i=="object"&&i!==null}function Zv(i){if(!(!Yv(i)||typeof i.type!="string")&&(i.type==="fixbuilder:config"||i.type==="fixbuilder:response"&&typeof i.requestId=="string"))return i}function Jc(i){if(i!==void 0)return typeof i=="string"?i:JSON.stringify(i)}function xg(){try{return window.self!==window.top}catch{return!0}}function Xv(){const i=Tt(),{profile:u,hostOrigin:c}=Ke(),o=ce.useRef(c),f=ce.useRef(u);return f.current=u,ce.useEffect(()=>{if(!xg())return;const h=m=>{if(m.source!==window.parent||o.current&&m.origin!==o.current)return;const d=Zv(m.data);if(d)if(o.current||(o.current=m.origin,i({type:"host-connected",origin:m.origin})),d.type==="fixbuilder:config"){const v=Jc(d.profile);if(v!==void 0){const{profile:S,issues:C}=La(v);i({type:"profile-loaded",profile:S,issues:C})}const p=Jc(d.instruments);if(p!==void 0){const{db:S,issues:C}=ys(p);i({type:"instruments-loaded",db:S,issues:C})}const x=Jc(d.scenario);if(x!==void 0){const{scenario:S,issues:C}=Ss(x),G=v!==void 0?La(v).profile:f.current;S&&i({type:"apply-scenario",scenario:S,findings:[...C.map(L=>({ruleId:"scenario-load",severity:L.severity,path:L.path,message:L.message})),...G?Ts(S,G):[]]})}}else i({type:"transport-response",id:d.requestId,ok:d.ok,...d.status!==void 0?{status:d.status}:{},...d.body!==void 0?{body:d.body}:{},...d.error!==void 0?{error:d.error}:{},...d.timingMs!==void 0?{timingMs:d.timingMs}:{}})};return window.addEventListener("message",h),window.parent.postMessage({type:"fixbuilder:ready",protocolVersion:Tg},"*"),()=>window.removeEventListener("message",h)},[i]),null}let Um=0;function Qv({derived:i}){const u=Ke(),c=Tt(),{hostOrigin:o,transportLog:f,jsonMapping:h,scenarioName:m}=u;if(!xg())return null;const d=o!==void 0&&i.resolved&&i.messages.length>0,v=()=>{if(!d||!i.resolved)return;const p=i.resolved.profile.renderers?.json??{},x=(h?p[h]:void 0)??Object.values(p)[0]??vg;Um+=1;const S=`req-${Date.now()}-${Um}`,C={type:"fixbuilder:send",requestId:S,protocolVersion:Tg,system:i.resolved.system.id,systemLabel:i.resolved.system.label,fixVersion:i.messages[0].beginString,msgType:i.messages[0].msgType,mode:i.mode,scenarioName:m,...i.resolved.system.transportHints!==void 0?{transportHints:i.resolved.system.transportHints}:{},messages:i.messages.map(G=>({json:fg(G,i.resolved.dictionary,x),wire:tg(G,i.resolved.dictionary,{delimiter:"pipe"})}))};c({type:"transport-sent",id:S,summary:`${i.messages.length} × 35=${C.msgType} → ${C.systemLabel}`,sentAt:Date.now()}),window.parent.postMessage(C,o)};return g.jsxs("section",{className:"panel",children:[g.jsxs("div",{className:"panel-header",children:["Transport",g.jsx("span",{className:"hint",children:o?`host: ${o}`:"waiting for host page…"}),g.jsx("span",{style:{flex:1}}),f.length>0&&g.jsx("button",{className:"btn small",onClick:()=>c({type:"transport-clear"}),children:"Clear"}),g.jsxs("button",{className:"btn small primary",disabled:!d,onClick:v,children:["⇪ Send ",i.messages.length>1?`${i.messages.length} messages`:"message"]})]}),g.jsxs("div",{className:"panel-body tight",children:[f.length===0&&g.jsx("p",{className:"empty-note",children:"Messages sent to the host page appear here with their responses. The builder itself makes no network requests — delivery happens in the host window."}),f.map(p=>g.jsxs("details",{className:`transport-entry ${p.state}`,children:[g.jsxs("summary",{children:[g.jsx("span",{className:`sev-label ${p.state==="error"?"error":""}`,children:p.state==="pending"?"…":p.state==="ok"?"✓":"✗"}),g.jsx("span",{className:"mono",children:p.summary}),g.jsxs("span",{className:"hint",style:{marginLeft:"auto"},children:[p.status!==void 0?`status ${p.status} · `:"",p.timingMs!==void 0?`${p.timingMs} ms`:""]})]}),p.error&&g.jsx("div",{className:"finding error",children:p.error}),p.body!==void 0&&g.jsx("pre",{className:"raw-wire",style:{margin:"0.4rem 0.7rem"},children:typeof p.body=="string"?p.body:JSON.stringify(p.body,null,2)})]},p.id))]})]})}function km(){return typeof window<"u"&&"showDirectoryPicker"in window}async function $v(){const i=window.showDirectoryPicker;return i({mode:"readwrite"})}async function Kv(i){const u={mode:"readwrite"};return await i.queryPermission?.(u)==="granted"?!0:await i.requestPermission?.(u)==="granted"}class Jv{constructor(u,c=u.name){this.handle=u,this.name=c}handle;name;async resolveDir(u,c=!1){let o=this.handle;for(const f of u.split("/").filter(Boolean))try{o=await o.getDirectoryHandle(f,{create:c})}catch{return}return o}async list(u){const c=await this.resolveDir(u);if(!c)return[];const o=[];for await(const f of c.values()){if(f.kind!=="file")continue;const h=await f.getFile();o.push({path:`${u}/${f.name}`,modifiedToken:String(h.lastModified)})}return o.sort((f,h)=>f.path<h.path?-1:1)}async read(u){const c=u.lastIndexOf("/"),o=await this.resolveDir(c>0?u.slice(0,c):"");if(o)try{const h=await(await o.getFileHandle(u.slice(c+1))).getFile();return{path:u,modifiedToken:String(h.lastModified),text:await h.text()}}catch{return}}async write(u,c,o){const f=u.lastIndexOf("/"),h=await this.resolveDir(f>0?u.slice(0,f):"",!0);if(!h)throw new Error(`cannot create directory for ${u}`);const m=u.slice(f+1);if(o!==void 0){const x=await this.read(u);if(x&&x.modifiedToken!==o)return{ok:!1,reason:"conflict",currentToken:x.modifiedToken}}const d=await h.getFileHandle(m,{create:!0}),v=await d.createWritable();await v.write(c),await v.close();const p=await d.getFile();return{ok:!0,entry:{path:u,modifiedToken:String(p.lastModified)}}}}const Fv=["links","flows","conventions","mappings","instruments","fragments"];async function Wv(i){const u=new Map,c=["workspace.json","overrides.profile.json"];for(const o of c){const f=await i.read(o);f&&u.set(o,f.text)}for(const o of Fv)for(const f of await i.list(o)){if(!/\.(json|csv)$/i.test(f.path))continue;const h=await i.read(f.path);h&&u.set(f.path,h.text)}return u}let Eg;function qm(i){Eg=i}function Pn(){return Eg}function oe(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}function lo(i){return Array.isArray(i)?i.map(lo):oe(i)?Object.fromEntries(Object.entries(i).filter(([u])=>!u.startsWith("//")).map(([u,c])=>[u,lo(c)])):i}function qa(i){return i.slice(i.lastIndexOf("/")+1).replace(/\.(json|csv)$/i,"")}function Iv(){const i=[];return{issues:i,error:(u,c,o)=>i.push({severity:"error",file:u,path:c,message:o}),warn:(u,c,o)=>i.push({severity:"warning",file:u,path:c,message:o})}}function Cn(i,u,c){const o=i.get(u);if(o!==void 0)try{const f=lo(JSON.parse(o));if(!oe(f)){c.error(u,"","file must contain a JSON object");return}return delete f.$schema,f}catch(f){c.error(u,"",`not valid JSON: ${String(f)}`);return}}function Ha(i,u,c,o){const f=[];for(const[h,m]of Object.entries(i)){if(!/^\d+$/.test(h)){o.error(u,`${c}/${h}`,`'${h}' is not a FIX tag number`);continue}typeof m=="string"?f.push({op:"set",tag:Number(h),value:m}):oe(m)&&typeof m.generator=="string"?f.push({op:"setGenerated",tag:Number(h),generator:m.generator}):o.error(u,`${c}/${h}`,'value must be a string or { "generator": "…" }')}return f}function Hm(i,u,c,o){const f=[];if(Array.isArray(i.parties)&&i.parties.length>0){const m=i.parties.map((d,v)=>!oe(d)||typeof d.id!="string"?(o.error(u,`${c}/parties/${v}`,'party needs an "id"'),[]):[{op:"set",tag:448,value:d.id},{op:"set",tag:447,value:typeof d.source=="string"?d.source:"D"},{op:"set",tag:452,value:typeof d.role=="string"?d.role:"3"}]);f.push({op:"group",countTag:453,mode:"append",entries:m})}const h=i.account;return oe(h)&&(h.editable===!1?typeof h.default=="string"?f.push({op:"set",tag:1,value:h.default}):o.error(u,`${c}/account`,'non-editable account needs a "default" value'):f.push({op:"slot",tag:1,slot:{tag:1,label:"Account",type:"string",...typeof h.default=="string"?{default:h.default}:{}}})),Array.isArray(i.ops)&&f.push(...i.ops),f}function Pv(i,u,c,o){const f=[];if(oe(i.fields)&&f.push(...Ha(i.fields,u,"/fields",c)),oe(i.params))for(const[h,m]of Object.entries(i.params)){if(!oe(m)||typeof m.name!="string"){c.error(u,`/params/${h}`,'param needs at least a "name"');continue}const d=typeof m.type=="string"?m.type:"STRING",v=[m.name,d];if(oe(m.enum)&&v.push(m.enum),o?.(h,v),oe(m.slot)&&m.value!==void 0)c.error(u,`/params/${h}`,'param declares both "slot" and "value" — pick one');else if(oe(m.slot)){const p={tag:Number(h),...m.slot};oe(m.enum)&&d!=="BOOLEAN"&&p.type===void 0&&(p.type="enum",p.enumSource??={kind:"dictionary"}),p.type??="string",f.push({op:"slot",tag:Number(h),slot:p})}else typeof m.value=="string"?f.push({op:"set",tag:Number(h),value:m.value}):m.value!==void 0?c.error(u,`/params/${h}/value`,'param "value" must be a string'):c.warn(u,`/params/${h}`,`param ${h} has neither "slot" nor "value" — tag declared but never emitted`)}if(oe(i.standardSlots))for(const[h,m]of Object.entries(i.standardSlots)){if(!oe(m)){c.error(u,`/standardSlots/${h}`,"slot spec must be an object");continue}f.push({op:"slot",tag:Number(h),slot:{tag:Number(h),...m}})}return Array.isArray(i.ops)&&f.push(...i.ops),f}function Vm(i,u,c,o,f,h,m){const d=el(c),v=i.get(u);if(!v){i.set(u,{id:u,config:c,configText:d,firstFile:f,links:[o]});return}if(v.configText!==d){m.error(f,`/${h}s/${u}`,`${h} '${u}' differs from its definition in ${v.firstFile}; shared ${h} ids must be identical (or use distinct ids)`);return}v.links.push(o)}const e0=new Set(["label","session","client","clients","routes","enforced","finalFragment","convention","algos","transportHints","extends","fragments","dictionaryOverlay","validationPolicy"]),t0=new Set(["label","msgType","modes","availability","fields","params","standardSlots","ops"]),n0=new Set(["name","version","fixVersion","generators","newOrderTemplate","templates","dictionaryOverlay","validationPolicy","flowOrder","extraDimensions","goldens"]);function Fc(i,u,c,o){for(const f of Object.keys(i))u.has(f)||o.warn(c,`/${f}`,`unknown key '${f}' (typo? see docs/PROFILE-WORKSPACE.md)`)}function l0(i,u){for(const[c,o]of i){const f=o.raw.extends;if(f==null)continue;if(typeof f!="string"||!i.has(f)){u.warn(o.file,"/extends",`unknown link '${String(f)}'`);continue}if(f===c){u.warn(o.file,"/extends","link extends itself");continue}const h=i.get(f);h.raw.extends&&u.warn(o.file,"/extends",`extends chain deeper than one level (via '${f}')`);const m={...h.raw,...o.raw};delete m.extends,o.raw=m}}function Og(i,u,c,o){const f={...i};for(const[h,m]of Object.entries(u)){const d=`${c}/${h}`;m===null?(delete f[h],o.push(d)):oe(m)&&oe(f[h])?f[h]=Og(f[h],m,d,o):(f[h]=m,o.push(d))}return f}function a0(i){const u=Iv(),c={issues:u.issues,overrideTouches:[],flowLinks:new Map,linkIds:[],clientLinks:new Map,routeLinks:new Map,goldensRequested:!1},o=Cn(i,"workspace.json",u);if(!o)return u.error("workspace.json","","workspace.json is required"),c;Fc(o,n0,"workspace.json",u);const f={},h={},m={};for(const j of[...i.keys()].sort()){if(!j.startsWith("fragments/")||!j.endsWith(".json"))continue;const Y=Cn(i,j,u);Y&&(f[qa(j)]=Y)}const d=oe(o.templates)?{...o.templates}:{};if(oe(o.newOrderTemplate)&&(f["template:D"]={label:"NewOrderSingle base",ops:Ha(o.newOrderTemplate,"workspace.json","/newOrderTemplate",u)},d.D!==void 0&&u.error("workspace.json","/newOrderTemplate","newOrderTemplate and templates.D are mutually exclusive"),d.D="template:D"),oe(o.dictionaryOverlay)&&oe(o.dictionaryOverlay.fields))for(const[j,Y]of Object.entries(o.dictionaryOverlay.fields))h[j]=Y,m[j]="workspace.json";const v=new Map;for(const j of[...i.keys()].sort()){if(!j.startsWith("flows/")||!j.endsWith(".json"))continue;const Y=qa(j),B=Cn(i,j,u);if(!B)continue;Fc(B,t0,j,u);const M=typeof B.label=="string"?B.label:Y,H=B.availability==="opt-in";B.availability!==void 0&&B.availability!=="opt-in"&&B.availability!=="everywhere"&&u.error(j,"/availability",`availability must be "everywhere" or "opt-in", not ${JSON.stringify(B.availability)}`);const K=Pv(B,j,u,(T,k)=>{const $=m[T];$&&el(h[T])!==el(k)?u.error(j,`/params/${T}`,`tag ${T} already declared differently in ${$}`):(h[T]=k,m[T]=j)}),q=`flow:${Y}`;f[q]&&u.error(j,"",`fragment id '${q}' collides with fragments/${q}.json`),f[q]={label:M,ops:K};const ee={id:Y,label:M,fragment:q,msgType:typeof B.msgType=="string"?B.msgType:"D",...Array.isArray(B.modes)?{modes:B.modes}:{},...H?{availableOn:[`cap:${Y}`]}:{}};v.set(Y,{id:Y,file:j,label:M,optIn:H,option:ee})}const p=new Map;for(const j of[...i.keys()].sort()){if(!j.startsWith("links/")||!j.endsWith(".json"))continue;const Y=Cn(i,j,u);Y&&p.set(qa(j),{file:j,raw:Y})}l0(p,u);const x=[],S=new Map,C=new Map;for(const[j,{file:Y,raw:B}]of p){Fc(B,e0,Y,u);const M=[];if(oe(B.session)){const q=`link:${j}:session`;f[q]={label:`Session: ${typeof B.label=="string"?B.label:j}`,ops:Ha(B.session,Y,"/session",u)},M.push(q)}if(oe(B.client)&&oe(B.clients)&&u.error(Y,"/client",'"client" (singular) and "clients" are mutually exclusive'),oe(B.client)){const q=`link:${j}:client`;f[q]={label:`Client (${j})`,ops:Hm(B.client,Y,"/client",u)},M.push(q)}if(oe(B.clients))for(const[q,ee]of Object.entries(B.clients)){if(!oe(ee)){u.error(Y,`/clients/${q}`,"client must be an object");continue}Vm(S,q,ee,j,Y,"client",u)}if(oe(B.routes))for(const[q,ee]of Object.entries(B.routes)){if(!oe(ee)){u.error(Y,`/routes/${q}`,"route must be an object");continue}Vm(C,q,ee,j,Y,"route",u)}for(const q of Array.isArray(B.fragments)?B.fragments:[])typeof q=="string"&&M.push(q);let H;oe(B.enforced)&&typeof B.finalFragment=="string"&&u.error(Y,"/enforced",'"enforced" and "finalFragment" are mutually exclusive'),oe(B.enforced)?(H=`link:${j}:final`,f[H]={label:`Enforced (${typeof B.label=="string"?B.label:j})`,ops:Ha(B.enforced,Y,"/enforced",u)}):typeof B.finalFragment=="string"&&(H=B.finalFragment);const K=Array.isArray(B.algos)?B.algos.filter(q=>typeof q=="string"):[];for(const q of K){const ee=v.get(q);ee?ee.optIn||u.warn(Y,"/algos",`flow '${q}' is available everywhere; listing it in algos is redundant`):u.error(Y,"/algos",`unknown flow '${q}' (no flows/${q}.json)`)}x.push({id:j,label:typeof B.label=="string"?B.label:j,...M.length>0?{fragments:M}:{},...H?{finalFragment:H}:{},...K.length>0?{capabilities:K}:{},...typeof B.convention=="string"?{convention:B.convention}:{},...oe(B.dictionaryOverlay)?{dictionaryOverlay:B.dictionaryOverlay}:{},...oe(B.validationPolicy)?{validationPolicy:B.validationPolicy}:{},...B.transportHints!==void 0?{transportHints:B.transportHints}:{}})}x.length===0&&u.error("","","no links/ defined — a workspace needs at least one link");const G=[],L=Array.isArray(o.flowOrder)?o.flowOrder.filter(j=>typeof j=="string"):[];for(const j of L)v.has(j)||u.warn("workspace.json","/flowOrder",`unknown flow '${j}'`);const w=[...L.filter(j=>v.has(j)),...[...v.keys()].filter(j=>!L.includes(j)).sort()];w.length>0&&G.push({id:"flow",label:"Flow",kind:"options",required:!0,options:w.map(j=>v.get(j).option)});const P=(j,Y,B,M)=>{if(j.size===0)return;const H=new Set(p.keys()),K=[...j.values()].sort((q,ee)=>q.id<ee.id?-1:1).map(q=>{const ee=q.links.length===H.size;return{...M(q),...ee?{}:{availableOn:[...q.links].sort()},...q.config.default===!0?{default:!0}:{}}});G.push({id:Y,label:B,kind:"options",options:K})};P(S,"client","Client",j=>{const Y=`client:${j.id}`;return f[Y]={label:`Client: ${typeof j.config.label=="string"?j.config.label:j.id}`,ops:Hm(j.config,j.firstFile,`/clients/${j.id}`,u)},{id:j.id,label:typeof j.config.label=="string"?j.config.label:j.id,fragment:Y,...typeof j.config.convention=="string"?{convention:j.config.convention}:{}}}),P(C,"route","Route",j=>{const Y=`route:${j.id}`,B=oe(j.config.fields)?Ha(j.config.fields,j.firstFile,`/routes/${j.id}/fields`,u):[];return Array.isArray(j.config.ops)&&B.push(...j.config.ops),f[Y]={label:`Route: ${typeof j.config.label=="string"?j.config.label:j.id}`,ops:B},{id:j.id,label:typeof j.config.label=="string"?j.config.label:j.id,fragment:Y,...typeof j.config.convention=="string"?{convention:j.config.convention}:{}}}),Array.isArray(o.extraDimensions)&&G.push(...o.extraDimensions),G.push({id:"instrument",label:"Instrument",kind:"instrument"});for(const j of G){const Y=(j.options??[]).filter(B=>B.default===!0);Y.length>1&&u.error("",`/${String(j.id)}`,`dimension '${String(j.id)}' has ${Y.length} options marked default`)}const V=new Map;for(const j of v.values()){if(!j.optIn){V.set(j.id,"*");continue}const Y=x.filter(B=>Array.isArray(B.capabilities)&&B.capabilities.includes(j.id)).map(B=>B.id);V.set(j.id,Y),Y.length===0&&u.error(j.file,"/availability",`opt-in flow '${j.id}' is enabled on no link — add it to some link's "algos" or set availability to "everywhere"`)}const ne={},de={};for(const j of[...i.keys()].sort()){if(j.startsWith("conventions/")&&j.endsWith(".json")){const Y=Cn(i,j,u);Y&&(ne[qa(j)]=Y)}if(j.startsWith("mappings/")&&j.endsWith(".json")){const Y=Cn(i,j,u);Y&&(de[qa(j)]=Y)}}const Te=[],ge=[],Z={};for(const j of[...i.keys()].sort()){if(!j.startsWith("instruments/"))continue;if(j.endsWith(".csv")){const{db:q,issues:ee}=gg(i.get(j));for(const T of ee)u.issues.push({severity:T.severity==="error"?"error":"warning",file:j,path:T.path,message:T.message});for(const T of q?[...q.instruments.values()]:[])Te.push({...T}),Z[T.key]??=j;continue}if(!j.endsWith(".json"))continue;const Y=Cn(i,j,u);if(!Y)continue;const B=oe(Y.defaults)?Y.defaults:{},M=oe(B.attrs)?B.attrs:{},H=oe(B.schemes)?B.schemes:{},K=q=>({...q,...Object.keys(H).length>0||oe(q.schemes)?{schemes:{...H,...oe(q.schemes)?q.schemes:{}}}:{},...Object.keys(M).length>0||oe(q.attrs)?{attrs:{...M,...oe(q.attrs)?q.attrs:{}}}:{}});for(const q of Array.isArray(Y.instruments)?Y.instruments:[])Te.push(K(q)),typeof q.key=="string"&&(Z[q.key]&&u.error(j,"/instruments",`duplicate instrument key '${q.key}' (also in ${Z[q.key]})`),Z[q.key]??=j);for(const q of Array.isArray(Y.strategies)?Y.strategies:[])ge.push(K(q))}let X={schemaVersion:1,name:typeof o.name=="string"?o.name:"Unnamed workspace",version:typeof o.version=="string"?o.version:"0.0.0",fixVersion:typeof o.fixVersion=="string"?o.fixVersion:"FIX.4.4",...Object.keys(h).length>0?{dictionaryOverlay:{...oe(o.dictionaryOverlay)?o.dictionaryOverlay:{},fields:h}}:{},...oe(o.generators)?{generators:o.generators}:{},...Object.keys(ne).length>0?{conventions:ne}:{},fragments:f,...Object.keys(d).length>0?{templates:d}:{},systems:x,dimensions:G,...Object.keys(de).length>0?{renderers:{json:de}}:{},...oe(o.validationPolicy)?{validationPolicy:o.validationPolicy}:{}};const ae=[],Q=Cn(i,"overrides.profile.json",u);if(Q){X=Og(X,Q,"",ae);for(const j of ae)u.warn("overrides.profile.json",j,`override rewrote ${j} — consider moving this into an entity file`)}const I=ig(X);for(const j of I.issues)u.issues.push({severity:j.severity,file:"(assembled profile)",path:j.path,message:j.message});const ie=Te.length+ge.length>0?{schemaVersion:1,instruments:Te,...ge.length>0?{strategies:ge}:{}}:void 0;if(ie){const{issues:j}=mg(JSON.stringify(ie));for(const Y of j)u.issues.push({severity:Y.severity==="error"?"error":"warning",file:"(assembled instruments)",path:Y.path,message:Y.message})}const se=u.issues.some(j=>j.severity==="error");return{...se?{}:{profile:X,profileText:el(X)},...!se&&ie?{instrumentsText:el(ie)}:{},issues:u.issues,overrideTouches:ae,flowLinks:V,linkIds:[...p.keys()],clientLinks:new Map([...S.values()].map(j=>[j.id,[...j.links]])),routeLinks:new Map([...C.values()].map(j=>[j.id,[...j.links]])),goldensRequested:o.goldens===!0}}const i0="fixbuilder",Ga="workspace",jg="directoryHandle";function Ag(){return new Promise((i,u)=>{const c=indexedDB.open(i0,1);c.onupgradeneeded=()=>c.result.createObjectStore(Ga),c.onsuccess=()=>i(c.result),c.onerror=()=>u(c.error)})}async function Ng(i){try{const u=await Ag();await new Promise((c,o)=>{const f=u.transaction(Ga,"readwrite");f.objectStore(Ga).put(i,jg),f.oncomplete=()=>c(),f.onerror=()=>o(f.error)}),u.close()}catch{}}async function Lm(){try{const i=await Ag(),u=await new Promise((c,o)=>{const h=i.transaction(Ga,"readonly").objectStore(Ga).get(jg);h.onsuccess=()=>c(h.result),h.onerror=()=>o(h.error)});return i.close(),u??void 0}catch{return}}async function s0(){await Ng(void 0)}function Bm(i){return`scenarios/${i.trim().replace(/[^\w.-]+/g,"-")||"untitled"}.scenario.json`}function u0({derived:i}){const u=Ke(),c=Tt(),{workspace:o,profile:f,scenarioName:h}=u,[m,d]=ce.useState(),[v,p]=ce.useState(!1),[x,S]=ce.useState(),[C,G]=ce.useState(),L=ce.useRef(u);L.current=u;const w=ce.useRef(void 0),P=ce.useRef(void 0),V=ce.useCallback(async(Q,I)=>{const ie=await Wv(Q),se=a0(ie),j=se.issues.filter(Y=>Y.severity==="error");if(!se.profileText||j.length>0){S(`fixb build failed: ${j[0]?`${j[0].file} ${j[0].path} — ${j[0].message}`:"no output"}`+(j.length>1?` (+${j.length-1} more)`:""));return}if(S(void 0),se.profileText!==P.current){P.current=se.profileText;const{profile:Y,issues:B}=La(se.profileText);if(c(Y&&!I?{type:"profile-hot-swapped",profile:Y,issues:B}:{type:"profile-loaded",profile:Y,issues:B}),se.instrumentsText){const{db:M,issues:H}=ys(se.instrumentsText);c({type:"instruments-loaded",db:M,issues:H})}}if(I){const Y=[...ie.keys()].filter(H=>H.startsWith("instruments/")),B=Y.length===1&&Y[0].endsWith(".json"),M=B&&(ie.get(Y[0])??"").includes('"defaults"');if(B&&!M){const H=await Q.read(Y[0]);H&&c({type:"workspace-instruments-origin",path:H.path,token:H.modifiedToken})}}},[c]),ne=ce.useCallback(async(Q,I)=>{const ie=await Q.list("scenarios"),se=await Q.read("workspace.json")!==void 0;if(se&&!I&&await V(Q,!1),I){if(se){await V(Q,!0),c({type:"workspace-attached",workspace:{name:Q.name,kind:"fixb",scenarios:[...ie]}});return}const j=(await Q.list("profile")).filter(H=>H.path.endsWith(".json")),Y=j[0]&&await Q.read(j[0].path);if(Y){const{profile:H,issues:K}=La(Y.text);c({type:"profile-loaded",profile:H,issues:K})}const B=await Q.list("instruments"),M=B[0]&&await Q.read(B[0].path);if(M){const{db:H,issues:K}=ys(M.text);c({type:"instruments-loaded",db:H,issues:K})}c({type:"workspace-attached",workspace:{name:Q.name,kind:"plain",scenarios:[...ie]}}),M&&c({type:"workspace-instruments-origin",path:M.path,token:M.modifiedToken})}else{const j=L.current.workspace,Y=j?.loadedScenarioPath?ie.find(B=>B.path===j.loadedScenarioPath):void 0;c({type:"workspace-scenarios",scenarios:[...ie],...j?.loadedScenarioPath?{changedOnDisk:!!Y&&Y.modifiedToken!==j.loadedScenarioToken}:{}})}},[c,V]);if(ce.useEffect(()=>{km()&&Lm().then(Q=>{Q&&typeof Q=="object"&&"name"in Q&&d(Q.name)})},[]),ce.useEffect(()=>{const Q=I=>{(I.ctrlKey||I.metaKey)&&I.key==="s"&&L.current.workspace&&(I.preventDefault(),w.current?.())};return window.addEventListener("keydown",Q),()=>window.removeEventListener("keydown",Q)},[]),ce.useEffect(()=>{const Q=()=>{const I=Pn();I&&ne(I,!1).catch(()=>{})};return window.addEventListener("focus",Q),()=>window.removeEventListener("focus",Q)},[ne]),!km())return null;const de=async Q=>{p(!0),S(void 0);try{let I=Q;if(I){if(!await Kv(I))throw new Error("permission not granted")}else I=await $v();const ie=new Jv(I);qm(ie),await Ng(I),d(void 0),await ne(ie,!0)}catch(I){String(I).includes("AbortError")||S(String(I))}finally{p(!1)}},Te=async()=>{const Q=await Lm();Q&&await de(Q)},ge=async()=>{qm(void 0),await s0(),d(void 0),c({type:"workspace-detached"})},Z=async Q=>{const I=Pn();if(!I||!f)return;const ie=await I.read(Q);if(!ie)return;const{scenario:se,issues:j}=Ss(ie.text);if(!se){S(`could not parse ${Q}`);return}c({type:"apply-scenario",scenario:se,findings:[...j.map(Y=>({ruleId:"scenario-load",severity:Y.severity,path:Y.path,message:Y.message})),...Ts(se,f)]}),c({type:"workspace-scenario-origin",path:Q,token:ie.modifiedToken})},X=async(Q,I,ie)=>{const se=Pn();if(!se)return;const j=await se.write(Q,I,ie);if(!j.ok){G({path:Q,text:I});return}G(void 0),c({type:"workspace-scenario-origin",path:Q,token:j.entry.modifiedToken}),await ne(se,!1)},ae=async()=>{if(!f||!i.resolved)return;const Q=to(no(L.current,i)),I=Bm(h),ie=o?.loadedScenarioPath===I?o.loadedScenarioToken:void 0,se=Pn();if(se){if(ie===void 0&&await se.read(I)){G({path:I,text:Q});return}await X(I,Q,ie)}};return w.current=ae,o?g.jsxs("section",{className:"panel",children:[g.jsxs("div",{className:"panel-header",children:["Workspace: ",o.name,o.kind==="fixb"&&g.jsx("span",{className:"badge-channel",title:"fixb source workspace — compiled in the browser",children:"fixb"}),g.jsx("span",{style:{flex:1}}),g.jsx("button",{className:"btn small",title:"Rescan (also happens on window focus)",onClick:()=>{const Q=Pn();Q&&ne(Q,!1)},children:"↻"}),g.jsx("button",{className:"btn small",onClick:()=>{ge()},children:"Detach"})]}),g.jsxs("div",{className:"panel-body",style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[o.changedOnDisk&&o.loadedScenarioPath&&g.jsxs("div",{className:"finding warning",children:[g.jsx("span",{className:"sev-label",children:"changed"}),g.jsxs("span",{children:[g.jsx("code",{children:o.loadedScenarioPath})," changed on disk since it was loaded."]}),g.jsx("button",{className:"btn small",onClick:()=>{Z(o.loadedScenarioPath)},children:"Reload"})]}),C&&g.jsxs("div",{className:"finding error",style:{alignItems:"center",gap:"0.4rem"},children:[g.jsx("span",{className:"sev-label",children:"conflict"}),g.jsxs("span",{style:{flex:1},children:[g.jsx("code",{children:C.path})," changed on disk — never silently overwritten."]}),g.jsx("button",{className:"btn small",onClick:()=>{X(C.path,C.text,void 0)},children:"Overwrite"}),g.jsx("button",{className:"btn small",onClick:()=>{Z(C.path)},children:"Reload theirs"}),g.jsx("button",{className:"btn small",onClick:()=>{const Q=C.path.replace(/\.scenario\.json$/,"-copy.scenario.json");X(Q,C.text,void 0)},children:"Save as copy"})]}),o.kind==="fixb"&&g.jsxs("p",{className:"hint",style:{margin:0},children:["Source workspace: edit ",g.jsx("code",{children:"links/"}),", ",g.jsx("code",{children:"flows/"}),"… in your IDE — switching back to this tab recompiles and refreshes the preview."]}),f&&g.jsxs("button",{className:"btn primary",disabled:!i.resolved,onClick:()=>{ae()},children:["💾 Save scenario to workspace",o.loadedScenarioPath===Bm(h)?" (in place)":""]}),g.jsxs("div",{className:"workspace-scenarios",children:[o.scenarios.length===0&&g.jsxs("p",{className:"hint",style:{margin:0},children:["No ",g.jsx("code",{children:"scenarios/*.scenario.json"})," yet — save one above."]}),o.scenarios.map(Q=>g.jsx("button",{className:`workspace-scenario${o.loadedScenarioPath===Q.path?" active":""}`,onClick:()=>{Z(Q.path)},title:Q.path,children:Q.path.replace(/^scenarios\//,"").replace(/\.scenario\.json$/,"")},Q.path))]}),x&&g.jsx("div",{className:"finding error",children:x})]})]}):g.jsxs("section",{className:"panel",children:[g.jsx("div",{className:"panel-header",children:"Workspace folder"}),g.jsxs("div",{className:"panel-body",style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[g.jsxs("p",{className:"hint",style:{margin:0},children:["Attach a local checkout of your config repo (",g.jsx("code",{children:"profile/"}),","," ",g.jsx("code",{children:"instruments/"}),", ",g.jsx("code",{children:"scenarios/"}),") to load and save files in place. Nothing leaves this machine."]}),m&&g.jsxs("button",{className:"btn",disabled:v,onClick:()=>{Te()},children:["↻ Reattach “",m,"”"]}),g.jsx("button",{className:"btn primary",disabled:v,onClick:()=>{de()},children:"📂 Attach workspace folder…"}),x&&g.jsx("div",{className:"finding error",children:x})]})]})}const c0=["securityType","currency","mic","cfiCode","maturityMonthYear","maturityDate","strikePrice","putOrCall","optAttribute","contractMultiplier","underlying"];function Gm(i){return Object.entries(i).filter(u=>u[1]!==void 0).map(([u,c])=>({key:u,value:c}))}function Ym(i){const u={};for(const{key:c,value:o}of i)c.trim()!==""&&o!==""&&(u[c.trim()]=o);return u}function Zm({label:i,rows:u,onChange:c,keySuggestions:o,requiredKeys:f}){const h=`sugg-${i.replace(/\W+/g,"")}`;return g.jsxs("div",{className:"pair-rows",children:[g.jsxs("div",{className:"pair-rows-head",children:[g.jsx("span",{children:i}),g.jsxs("button",{type:"button",className:"btn small",onClick:()=>c([...u,{key:"",value:""}]),children:["+ ",i.replace(/s$/,"")]})]}),g.jsx("datalist",{id:h,children:o.map(m=>g.jsx("option",{value:m},m))}),u.map((m,d)=>g.jsxs("div",{className:"pair-row",children:[g.jsx("input",{className:"input mono",list:h,placeholder:"name",value:m.key,onChange:v=>c(u.map((p,x)=>x===d?{...p,key:v.target.value}:p))}),g.jsx("input",{className:"input mono",placeholder:f?.has(m.key)?"required by convention":"value",value:m.value,onChange:v=>c(u.map((p,x)=>x===d?{...p,value:v.target.value}:p))}),f?.has(m.key)&&m.value===""&&g.jsx("span",{className:"req",children:"*"}),g.jsx("button",{type:"button",className:"btn small",title:"Remove row",onClick:()=>c(u.filter((v,p)=>p!==d)),children:"✕"})]},d))]})}function o0({onClose:i}){const u=Ke(),c=Tt(),{instrumentDb:o,profile:f,systemId:h,workspace:m}=u,[d,v]=ce.useState(""),[p,x]=ce.useState(),[S,C]=ce.useState(0),[G,L]=ce.useState();ce.useEffect(()=>{const Z=X=>{X.key==="Escape"&&i()};return window.addEventListener("keydown",Z),()=>window.removeEventListener("keydown",Z)},[i]);const w=o??{instruments:new Map,strategies:new Map,instrumentOrder:[]},P=ce.useMemo(()=>{const Z=f?.systems.find(ae=>ae.id===h)?.convention,X=Z?f?.conventions?.[Z]:void 0;return X?Qh(X):[]},[f,h]),V=w.instrumentOrder.map(Z=>w.instruments.get(Z)).filter(Z=>{if(d.trim()==="")return!0;const X=d.toLowerCase();return[Z.key,Z.name??"",...Object.values(Z.schemes)].join(" ").toLowerCase().includes(X)}),ne=(Z,X=!1)=>{const ae=Z?Gm(Z.schemes):P.map(({scheme:Q})=>({key:Q,value:""}));for(const{scheme:Q}of P)ae.some(I=>I.key===Q)||ae.push({key:Q,value:""});x({...Z&&!X?{original:Z}:{},key:X?`${Z.key}-copy`:Z?.key??"",name:Z?.name??"",schemes:ae,attrs:Z?Gm(Z.attrs):[{key:"securityType",value:"CS"}]})},de=()=>{if(!p||p.key.trim()==="")return;const Z={key:p.key.trim(),...p.name.trim()!==""?{name:p.name.trim()}:{},schemes:Ym(p.schemes),attrs:Ym(p.attrs),...p.original?.extra?{extra:p.original.extra}:{}};let X=fv(w,Z);p.original&&p.original.key!==Z.key&&(X=zm(X,p.original.key)),c({type:"instruments-loaded",db:X,issues:[]}),x(void 0),C(ae=>ae+1),L(void 0)},Te=Z=>{c({type:"instruments-loaded",db:zm(w,Z),issues:[]}),C(X=>X+1),L(void 0)},ge=async()=>{const Z=ov(w),X=Pn();if(X&&m?.instrumentsPath){const ae=await X.write(m.instrumentsPath,Z,m.instrumentsToken);if(!ae.ok){L(`Conflict: ${m.instrumentsPath} changed on disk. Re-attach or use Download and merge by hand.`);return}c({type:"workspace-instruments-origin",path:ae.entry.path,token:ae.entry.modifiedToken}),C(0),L(`Saved to ${ae.entry.path}`)}else hs(w.csvColumns?"instruments.csv":"instruments.json",Z),C(0),L("Downloaded — replace the file in your repo.")};return g.jsx("div",{className:"modal-backdrop",onClick:Z=>Z.target===Z.currentTarget&&i(),children:g.jsxs("div",{className:"modal",role:"dialog","aria-label":"Instrument editor",children:[g.jsxs("div",{className:"panel-header",children:["Instruments · ",w.instruments.size," records",S>0&&g.jsxs("span",{className:"badge-dirty",children:[S," unsaved change(s)"]}),g.jsx("span",{style:{flex:1}}),S>0&&g.jsx("button",{className:"btn small primary",onClick:()=>{ge()},children:Pn()&&m?.instrumentsPath?"💾 Save to workspace":"⬇ Download updated file"}),g.jsx("button",{className:"btn small",onClick:i,children:"Close"})]}),G&&g.jsx("div",{className:"finding info",style:{margin:"0.5rem 0.7rem 0"},children:G}),p?g.jsxs("div",{className:"panel-body instrument-form",children:[g.jsxs("div",{className:"field-row",children:[g.jsx("label",{className:"field-label",children:"Key"}),g.jsx("input",{className:"input mono",value:p.key,disabled:p.original!==void 0,placeholder:"UNIQUE-KEY",onChange:Z=>x({...p,key:Z.target.value})})]}),g.jsxs("div",{className:"field-row",children:[g.jsx("label",{className:"field-label",children:"Name"}),g.jsx("input",{className:"input",value:p.name,placeholder:"Display name",onChange:Z=>x({...p,name:Z.target.value})})]}),g.jsx(Zm,{label:"Schemes",rows:p.schemes,onChange:Z=>x({...p,schemes:Z}),keySuggestions:P.map(Z=>Z.scheme),requiredKeys:new Set(P.filter(Z=>Z.required).map(Z=>Z.scheme))}),g.jsx(Zm,{label:"Attrs",rows:p.attrs,onChange:Z=>x({...p,attrs:Z}),keySuggestions:c0}),p.original?.extra&&g.jsxs("p",{className:"hint",style:{margin:0},children:[Object.keys(p.original.extra).length," unknown key(s) on this record are preserved untouched."]}),g.jsxs("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"flex-end"},children:[g.jsx("button",{className:"btn",onClick:()=>x(void 0),children:"Cancel"}),g.jsx("button",{className:"btn primary",disabled:p.key.trim()==="",onClick:de,children:p.original?"Apply changes":"Add instrument"})]})]}):g.jsxs("div",{className:"panel-body",style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[g.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[g.jsx("input",{className:"input",placeholder:"Filter by key, name or identifier…",value:d,onChange:Z=>v(Z.target.value)}),g.jsx("button",{className:"btn primary",onClick:()=>ne(),children:"+ Add"})]}),g.jsxs("div",{className:"instrument-list",children:[V.map(Z=>g.jsxs("div",{className:"instrument-row",children:[g.jsx("span",{className:"mono key",children:Z.key}),g.jsx("span",{className:"name",children:Z.name??""}),g.jsx("span",{className:"hint",children:Object.entries(Z.schemes).map(([X,ae])=>`${X}=${ae}`).join(" · ")}),Z.extra&&g.jsxs("span",{className:"badge-extra",title:"Unknown keys preserved",children:["+",Object.keys(Z.extra).length]}),g.jsx("span",{style:{flex:1}}),g.jsx("button",{className:"btn small",onClick:()=>ne(Z),children:"Edit"}),g.jsx("button",{className:"btn small",title:"Duplicate",onClick:()=>ne(Z,!0),children:"⧉"}),g.jsx("button",{className:"btn small",title:"Delete",onClick:()=>Te(Z.key),children:"✕"})]},Z.key)),V.length===0&&g.jsx("p",{className:"empty-note",children:"No matching instruments — add one above."})]}),g.jsx("p",{className:"hint",style:{margin:0},children:"Schemes required by the selected system's convention are pre-filled when adding. Target systems are configured in the fixb profile workspace, not here."}),m?.kind==="fixb"&&!m.instrumentsPath&&g.jsxs("p",{className:"hint",style:{margin:0},children:["This fixb workspace compiles instruments from several source files — in-app edits can only be downloaded (or edit ",g.jsx("code",{children:"instruments/*.json"})," in your IDE and refocus this tab to recompile)."]})]})]})})}function r0(){try{return localStorage.getItem("fixbuilder.theme")??void 0}catch{return}}function Xm(i){try{i===void 0?localStorage.removeItem("fixbuilder.theme"):localStorage.setItem("fixbuilder.theme",i)}catch{}}function f0(){const[i,u]=ce.useState(()=>r0()??"system");return ce.useEffect(()=>{i==="system"?(delete document.documentElement.dataset.theme,Xm(void 0)):(document.documentElement.dataset.theme=i,Xm(i))},[i]),g.jsx("span",{className:"seg",title:"Theme",children:["system","light","dark"].map(c=>g.jsx("button",{className:i===c?"active":"",onClick:()=>u(c),children:c==="system"?"auto":c},c))})}function d0(){const{dictionaryError:i}=Ke();return i?g.jsxs("div",{className:"finding error",style:{margin:"0.6rem 0.9rem 0",alignItems:"center"},children:[g.jsx("span",{className:"sev-label",children:"error"}),g.jsxs("span",{children:[i,". If this page has been open a while, the site was likely updated underneath it — reload to pick up the new version."]}),g.jsx("span",{style:{flex:1}}),g.jsx("button",{className:"btn small primary",onClick:()=>window.location.reload(),children:"Reload page"})]}):null}function m0(){const i=pv(),[u,c]=ce.useState(!1);return g.jsxs("main",{className:"app-main",children:[g.jsx(Xv,{}),u&&g.jsx(o0,{onClose:()=>c(!1)}),g.jsxs("div",{className:"rail",children:[g.jsx(Sv,{onEditInstruments:()=>c(!0)}),g.jsx(u0,{derived:i}),g.jsx(Rv,{derived:i})]}),g.jsxs("div",{className:"col col-center",children:[g.jsx(Ov,{derived:i}),g.jsx(Nv,{derived:i}),g.jsx(Mv,{derived:i}),g.jsx(Dv,{derived:i})]}),g.jsxs("div",{className:"col",children:[g.jsx(Bv,{derived:i}),g.jsx(Qv,{derived:i}),g.jsx(Gv,{derived:i})]})]})}function g0(){const i="./".endsWith("/dev/")?"dev preview":"stable";return g.jsx(yv,{children:g.jsxs("div",{className:"app",children:[g.jsxs("header",{className:"app-header",children:[g.jsxs("h1",{className:"app-title",children:[g.jsx("span",{className:"fix-8",children:"8="}),"FIX Message Builder"]}),g.jsx("span",{className:"badge-channel",children:i}),g.jsx("span",{className:"spacer"}),g.jsx("span",{className:"hint",children:"no data leaves this browser"}),g.jsx(f0,{})]}),g.jsx(d0,{}),g.jsx(m0,{})]})})}const Mg=document.getElementById("root");if(!Mg)throw new Error("Root element #root not found");uh.createRoot(Mg).render(g.jsx(ce.StrictMode,{children:g.jsx(g0,{})}));
