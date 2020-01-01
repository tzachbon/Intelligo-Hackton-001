/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/event/eventPage.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/event/eventPage.ts":
/*!********************************!*\
  !*** ./src/event/eventPage.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var chrome_util_1 = __webpack_require__(/*! ../utils/chrome.util */ "./src/utils/chrome.util.ts");
window.addEventListener("load", init, false);
// const scanDomWebWorker = new Worker(WEB_WORKER_URL);
var storage = chrome.storage.sync;
var storageKey = 'STORAGE_KEY';
storage.get(storageKey, function (obj) {
    var value = obj[storageKey];
    if (typeof value === 'boolean') {
        console.log(value);
    }
});
function init() {
    var eventChromeListener = new chrome_util_1.default('CONTENT', 'scan');
    var sendMessage = function (message) { return eventChromeListener.sendMessage(message); };
    eventChromeListener.subscribe(function (value) {
        console.log(value);
    });
}


/***/ }),

/***/ "./src/utils/chrome.util.ts":
/*!**********************************!*\
  !*** ./src/utils/chrome.util.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function onRequest(action, callback, setSender, setCallback) {
    return function (request, sender, cb) {
        var extra = request.payload, reqAction = request.action;
        if (action == reqAction && callback) {
            callback(extra);
            if (setSender) {
                setSender(sender);
            }
            if (setCallback) {
                setCallback(cb);
            }
        }
    };
}
exports.onRequest = onRequest;
var ChromeListener = /** @class */ (function () {
    function ChromeListener(type, action) {
        var _this = this;
        this.type = type;
        this.action = action;
        this.setSendMessage = function (cb) {
            _this._sendMessage = cb;
        };
        this.sendMessage = function (payload) {
            var _req = {
                action: _this.action,
                payload: payload
            };
            if (_this._sendMessage) {
                _this._sendMessage(_req.action, _req.payload);
            }
            else {
                switch (_this.type) {
                    case 'POPUP':
                        chrome.tabs.query({ active: true, windowType: "normal", currentWindow: true }, function (tabArray) {
                            tabArray.forEach(function (tab) {
                                chrome.tabs.sendMessage(tab.id, _req);
                            });
                        });
                        break;
                    case 'CONTENT':
                        chrome.extension.sendRequest(_req);
                        break;
                }
            }
        };
        this.initChromeListener(this.action);
    }
    ChromeListener.prototype.initChromeListener = function (action) {
        var _this = this;
        this._listener = function (payload) {
            _this.value = payload;
        };
        switch (this.type) {
            case 'POPUP':
                chrome.extension.onRequest.addListener(onRequest(action, this._listener.bind(this), this.setSender.bind(this), this.setSendMessage));
                break;
            case 'CONTENT':
                chrome.runtime.onMessage.addListener(onRequest(action, this._listener.bind(this), this.setSender.bind(this), this.setSendMessage));
                break;
        }
    };
    ChromeListener.prototype.setSender = function (sender) {
        this.sender = sender;
    };
    ChromeListener.prototype.setCallback = function (cb) {
        this._callback = cb;
        if (this._callback) {
            this._callback(this._value);
        }
    };
    Object.defineProperty(ChromeListener.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
            if (this._callback) {
                this._callback(this._value);
            }
        },
        enumerable: true,
        configurable: true
    });
    ChromeListener.prototype.subscribe = function (cb) {
        this.setCallback(cb);
        return this;
    };
    ChromeListener.prototype.unsubscribe = function () {
        this.setCallback(null);
    };
    ChromeListener.prototype.next = function (action) {
        this.action = action;
        chrome.extension.onRequest.removeListener(this._listener);
        this.initChromeListener(this.action);
    };
    return ChromeListener;
}());
exports.default = ChromeListener;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50L2V2ZW50UGFnZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvY2hyb21lLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLGtHQUFpRDtBQUlqRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3Qyx1REFBdUQ7QUFFdkQsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDcEMsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO0FBT2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQUMsR0FBNEI7SUFDakQsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVB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QVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsb0NBQVcsR0FBWDtRQUNJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELDZCQUFJLEdBQUosVUFBSyxNQUFxQjtRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQWlDTCxxQkFBQztBQUFELENBQUMiLCJmaWxlIjoiZXZlbnRQYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvZXZlbnQvZXZlbnRQYWdlLnRzXCIpO1xuIiwiaW1wb3J0IENocm9tZUxpc3RlbmVyIGZyb20gJy4uL3V0aWxzL2Nocm9tZS51dGlsJ1xuaW1wb3J0IHsgV2ViV29ya2VyIH0gZnJvbSAnLi4vbW9kZWxzL3dlYi13b3JrZXIubW9kZWwnO1xuaW1wb3J0IHsgV0VCX1dPUktFUl9VUkwgfSBmcm9tICcuLi91dGlscy93ZWItd29ya2VyJztcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGluaXQsIGZhbHNlKTtcbi8vIGNvbnN0IHNjYW5Eb21XZWJXb3JrZXIgPSBuZXcgV29ya2VyKFdFQl9XT1JLRVJfVVJMKTtcblxuY29uc3Qgc3RvcmFnZSA9IGNocm9tZS5zdG9yYWdlLnN5bmM7XG5jb25zdCBzdG9yYWdlS2V5ID0gJ1NUT1JBR0VfS0VZJztcbmludGVyZmFjZSBHZXRTdG9yYWdlVHlwZTxUPiB7XG4gICAgW2tleTogc3RyaW5nXTogVCB8IHtcbiAgICAgICAgbmV3VmFsdWU6IFQ7XG4gICAgICAgIG9sZFZhbHVlOiBUXG4gICAgfVxufVxuc3RvcmFnZS5nZXQoc3RvcmFnZUtleSwgKG9iajogR2V0U3RvcmFnZVR5cGU8Ym9vbGVhbj4pID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IG9ialtzdG9yYWdlS2V5XTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgY29uc29sZS5sb2codmFsdWUpO1xuXG4gICAgfVxufSlcblxuXG5mdW5jdGlvbiBpbml0KCkge1xuXG4gICAgY29uc3QgZXZlbnRDaHJvbWVMaXN0ZW5lciA9IG5ldyBDaHJvbWVMaXN0ZW5lcjxzdHJpbmc+KCdDT05URU5UJywgJ3NjYW4nKTtcbiAgICBjb25zdCBzZW5kTWVzc2FnZSA9IG1lc3NhZ2UgPT4gZXZlbnRDaHJvbWVMaXN0ZW5lci5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgICBldmVudENocm9tZUxpc3RlbmVyLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2codmFsdWUpO1xuICAgIH0pXG5cbn1cblxuXG4iLCJpbXBvcnQgeyBDaHJvbWUgfSBmcm9tICcuLi9tb2RlbHMvY2hyb21lLm1vZGVsJztcbmltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSAnLi4vbW9kZWxzL2dlbmVyYWwubW9kZWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gb25SZXF1ZXN0PFQgPSBhbnk+XG4gICAgKFxuICAgICAgICBhY3Rpb246IENocm9tZS5BY3Rpb24sXG4gICAgICAgIGNhbGxiYWNrOiAocGF5bG9hZDogVCkgPT4gdm9pZCxcbiAgICAgICAgc2V0U2VuZGVyPzogKHNlbmRlcjogY2hyb21lLnJ1bnRpbWUuTWVzc2FnZVNlbmRlcikgPT4gdm9pZCxcbiAgICAgICAgc2V0Q2FsbGJhY2s/OiAoY2I6IEZ1bmN0aW9uKSA9PiB2b2lkXG4gICAgKSB7XG5cbiAgICByZXR1cm4gKHJlcXVlc3Q6IENocm9tZS5SZXF1ZXN0PFQ+LCBzZW5kZXI6IGNocm9tZS5ydW50aW1lLk1lc3NhZ2VTZW5kZXIsIGNiOiBGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCB7IHBheWxvYWQ6IGV4dHJhLCBhY3Rpb246IHJlcUFjdGlvbiB9ID0gcmVxdWVzdDtcbiAgICAgICAgaWYgKGFjdGlvbiA9PSByZXFBY3Rpb24gJiYgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGV4dHJhKVxuICAgICAgICAgICAgaWYgKHNldFNlbmRlcikge1xuICAgICAgICAgICAgICAgIHNldFNlbmRlcihzZW5kZXIpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZXRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNldENhbGxiYWNrKGNiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICB9XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaHJvbWVMaXN0ZW5lcjxUID0gYW55PiB7XG4gICAgcHJpdmF0ZSBfY2FsbGJhY2s6IENhbGxiYWNrPFQ+O1xuICAgIHByaXZhdGUgX3ZhbHVlOiBUO1xuICAgIHByaXZhdGUgX2xpc3RlbmVyOiAocGF5bG9hZDogYW55KSA9PiB2b2lkO1xuICAgIHByaXZhdGUgX3NlbmRNZXNzYWdlOiAoYWN0aW9uOiBDaHJvbWUuQWN0aW9uLCBwYXlsb2FkOiBhbnkpID0+IHt9O1xuXG4gICAgcHVibGljIHNlbmRlcjogY2hyb21lLnJ1bnRpbWUuTWVzc2FnZVNlbmRlcjtcblxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlOiAnUE9QVVAnIHwgJ0NPTlRFTlQnLFxuICAgICAgICBwcml2YXRlIGFjdGlvbjogQ2hyb21lLkFjdGlvblxuICAgICkge1xuICAgICAgICB0aGlzLmluaXRDaHJvbWVMaXN0ZW5lcih0aGlzLmFjdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0Q2hyb21lTGlzdGVuZXIoYWN0aW9uOiBDaHJvbWUuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0gcGF5bG9hZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gcGF5bG9hZDtcbiAgICAgICAgfTtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ1BPUFVQJzpcbiAgICAgICAgICAgICAgICBjaHJvbWUuZXh0ZW5zaW9uLm9uUmVxdWVzdC5hZGRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgb25SZXF1ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXIuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VuZGVyLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNlbmRNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdDT05URU5UJzpcbiAgICAgICAgICAgICAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIob25SZXF1ZXN0KFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VuZGVyLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VuZE1lc3NhZ2VcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNlbmRlcihzZW5kZXI6IGNocm9tZS5ydW50aW1lLk1lc3NhZ2VTZW5kZXIpIHtcbiAgICAgICAgdGhpcy5zZW5kZXIgPSBzZW5kZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTZW5kTWVzc2FnZSA9IChjYjogRnVuY3Rpb24pID0+IHtcbiAgICAgICAgdGhpcy5fc2VuZE1lc3NhZ2UgPSBjYiBhcyBhbnk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRDYWxsYmFjayhjYjogQ2FsbGJhY2s8VD4pIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYjtcbiAgICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjayh0aGlzLl92YWx1ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCB2YWx1ZSh2OiBUKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdjtcbiAgICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjayh0aGlzLl92YWx1ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIHN1YnNjcmliZShjYjogQ2FsbGJhY2s8VD4pIHtcbiAgICAgICAgdGhpcy5zZXRDYWxsYmFjayhjYik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICB0aGlzLnNldENhbGxiYWNrKG51bGwpO1xuICAgIH1cblxuICAgIG5leHQoYWN0aW9uOiBDaHJvbWUuQWN0aW9uKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xuICAgICAgICBjaHJvbWUuZXh0ZW5zaW9uLm9uUmVxdWVzdC5yZW1vdmVMaXN0ZW5lcih0aGlzLl9saXN0ZW5lcik7XG4gICAgICAgIHRoaXMuaW5pdENocm9tZUxpc3RlbmVyKHRoaXMuYWN0aW9uKTtcbiAgICB9XG5cbiAgICBzZW5kTWVzc2FnZSA9IDxKID0gVD4ocGF5bG9hZDogSikgPT4ge1xuICAgICAgICBjb25zdCBfcmVxID0ge1xuICAgICAgICAgICAgYWN0aW9uOiB0aGlzLmFjdGlvbixcbiAgICAgICAgICAgIHBheWxvYWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuX3NlbmRNZXNzYWdlKSB7XG4gICAgICAgICAgICB0aGlzLl9zZW5kTWVzc2FnZShfcmVxLmFjdGlvbiwgX3JlcS5wYXlsb2FkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnUE9QVVAnOlxuICAgICAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5xdWVyeShcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgYWN0aXZlOiB0cnVlLCB3aW5kb3dUeXBlOiBcIm5vcm1hbFwiLCBjdXJyZW50V2luZG93OiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAodGFiQXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJBcnJheS5mb3JFYWNoKHRhYiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgX3JlcSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ0NPTlRFTlQnOlxuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuZXh0ZW5zaW9uLnNlbmRSZXF1ZXN0KF9yZXEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIifQ==