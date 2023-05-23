var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// node_modules/just-clone/index.js
var require_just_clone = __commonJS({
  "node_modules/just-clone/index.js"(exports, module2) {
    module2.exports = clone2;
    function clone2(obj) {
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        var value = obj[key];
        if (value && typeof value == "object") {
          result[key] = clone2(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    }
  }
});

// node_modules/fun-hooks/no-eval/index.js
var require_no_eval = __commonJS({
  "node_modules/fun-hooks/no-eval/index.js"(exports, module2) {
    create.SYNC = 1;
    create.ASYNC = 2;
    create.QUEUE = 4;
    var packageName = "fun-hooks";
    function hasProxy() {
      return !!(typeof Proxy === "function" && Proxy.revocable);
    }
    var defaults = Object.freeze({
      useProxy: true,
      ready: 0
    });
    var hookableMap = /* @__PURE__ */ new WeakMap();
    var reduce = [1].reduce(function(a, b, c) {
      return [a, b, c];
    }, 2).toString() === "2,1,0" ? Array.prototype.reduce : function(callback, initial) {
      var o = Object(this);
      var len = o.length >>> 0;
      var k = 0;
      var value;
      if (initial) {
        value = initial;
      } else {
        while (k < len && !(k in o)) {
          k++;
        }
        value = o[k++];
      }
      while (k < len) {
        if (k in o) {
          value = callback(value, o[k], k, o);
        }
        k++;
      }
      return value;
    };
    function rest(args, skip) {
      return Array.prototype.slice.call(args, skip);
    }
    var assign = Object.assign || function assign2(target) {
      return reduce.call(
        rest(arguments, 1),
        function(target2, obj) {
          if (obj) {
            Object.keys(obj).forEach(function(prop) {
              target2[prop] = obj[prop];
            });
          }
          return target2;
        },
        target
      );
    };
    function runAll(queue) {
      var queued;
      while (queued = queue.shift()) {
        queued();
      }
    }
    function create(config2) {
      var hooks = {};
      var postReady = [];
      config2 = assign({}, defaults, config2);
      function dispatch(arg1, arg2) {
        if (typeof arg1 === "function") {
          return hookFn.call(null, "sync", arg1, arg2);
        } else if (typeof arg1 === "string" && typeof arg2 === "function") {
          return hookFn.apply(null, arguments);
        } else if (typeof arg1 === "object") {
          return hookObj.apply(null, arguments);
        }
      }
      var ready2;
      if (config2.ready) {
        dispatch.ready = function() {
          ready2 = true;
          runAll(postReady);
        };
      } else {
        ready2 = true;
      }
      function hookObj(obj, props, objName) {
        var walk = true;
        if (typeof props === "undefined") {
          props = Object.getOwnPropertyNames(obj);
          walk = false;
        }
        var objHooks = {};
        var doNotHook = ["constructor"];
        do {
          props = props.filter(function(prop) {
            return typeof obj[prop] === "function" && !(doNotHook.indexOf(prop) !== -1) && !prop.match(/^_/);
          });
          props.forEach(function(prop) {
            var parts = prop.split(":");
            var name = parts[0];
            var type = parts[1] || "sync";
            if (!objHooks[name]) {
              var fn = obj[name];
              objHooks[name] = obj[name] = hookFn(
                type,
                fn,
                objName ? [objName, name] : void 0
              );
            }
          });
          obj = Object.getPrototypeOf(obj);
        } while (walk && obj);
        return objHooks;
      }
      function get2(path) {
        var parts = Array.isArray(path) ? path : path.split(".");
        return reduce.call(
          parts,
          function(memo, part, i) {
            var item = memo[part];
            var installed = false;
            if (item) {
              return item;
            } else if (i === parts.length - 1) {
              if (!ready2) {
                postReady.push(function() {
                  if (!installed) {
                    console.warn(
                      packageName + ": referenced '" + path + "' but it was never created"
                    );
                  }
                });
              }
              return memo[part] = newHookable(function(fn) {
                memo[part] = fn;
                installed = true;
              });
            }
            return memo[part] = {};
          },
          hooks
        );
      }
      function newHookable(onInstall) {
        var before = [];
        var after = [];
        var generateTrap = function() {
        };
        var api = {
          before: function(hook2, priority) {
            return add.call(this, before, "before", hook2, priority);
          },
          after: function(hook2, priority) {
            return add.call(this, after, "after", hook2, priority);
          },
          getHooks: function(match) {
            var hooks2 = before.concat(after);
            if (typeof match === "object") {
              hooks2 = hooks2.filter(function(entry) {
                return Object.keys(match).every(function(prop) {
                  return entry[prop] === match[prop];
                });
              });
            }
            try {
              assign(hooks2, {
                remove: function() {
                  hooks2.forEach(function(entry) {
                    entry.remove();
                  });
                  return this;
                }
              });
            } catch (e) {
              console.error(
                "error adding `remove` to array, did you modify Array.prototype?"
              );
            }
            return hooks2;
          },
          removeAll: function() {
            return this.getHooks().remove();
          }
        };
        var meta = {
          install: function(type, fn, generate) {
            this.type = type;
            generateTrap = generate;
            generate(before, after);
            onInstall && onInstall(fn);
          }
        };
        hookableMap.set(api.after, meta);
        return api;
        function add(store2, type, hook2, priority) {
          var entry = {
            hook: hook2,
            type,
            priority: priority || 10,
            remove: function() {
              var index = store2.indexOf(entry);
              if (index !== -1) {
                store2.splice(index, 1);
                generateTrap(before, after);
              }
            }
          };
          store2.push(entry);
          store2.sort(function(a, b) {
            return b.priority - a.priority;
          });
          generateTrap(before, after);
          return this;
        }
      }
      function hookFn(type, fn, name) {
        var meta = fn.after && hookableMap.get(fn.after);
        if (meta) {
          if (meta.type !== type) {
            throw packageName + ": recreated hookable with different type";
          } else {
            return fn;
          }
        }
        var hookable = name ? get2(name) : newHookable();
        var trap;
        var hookedFn;
        var handlers = {
          get: function(target, prop) {
            return hookable[prop] || Reflect.get.apply(Reflect, arguments);
          }
        };
        if (!ready2) {
          postReady.push(setTrap);
        }
        if (config2.useProxy && hasProxy()) {
          hookedFn = new Proxy(fn, handlers);
        } else {
          hookedFn = function() {
            return handlers.apply ? handlers.apply(fn, this, rest(arguments)) : fn.apply(this, arguments);
          };
          assign(hookedFn, hookable);
        }
        hookableMap.get(hookedFn.after).install(type, hookedFn, generateTrap);
        return hookedFn;
        function generateTrap(before, after) {
          var order = [];
          var targetIndex;
          if (before.length || after.length) {
            before.forEach(addToOrder);
            targetIndex = order.push(void 0) - 1;
            after.forEach(addToOrder);
            trap = function(target, thisArg, args) {
              var curr = 0;
              var result;
              var callback = type === "async" && typeof args[args.length - 1] === "function" && args.pop();
              function bail(value) {
                if (type === "sync") {
                  result = value;
                } else if (callback) {
                  callback.apply(null, arguments);
                }
              }
              function next(value) {
                if (order[curr]) {
                  var args2 = rest(arguments);
                  next.bail = bail;
                  args2.unshift(next);
                  return order[curr++].apply(thisArg, args2);
                }
                if (type === "sync") {
                  result = value;
                } else if (callback) {
                  callback.apply(null, arguments);
                }
              }
              order[targetIndex] = function() {
                var args2 = rest(arguments, 1);
                if (type === "async" && callback) {
                  delete next.bail;
                  args2.push(next);
                }
                var result2 = target.apply(thisArg, args2);
                if (type === "sync") {
                  next(result2);
                }
              };
              next.apply(null, args);
              return result;
            };
          } else {
            trap = void 0;
          }
          setTrap();
          function addToOrder(entry) {
            order.push(entry.hook);
          }
        }
        function setTrap() {
          if (ready2 || type === "sync" && !(config2.ready & create.SYNC) || type === "async" && !(config2.ready & create.ASYNC)) {
            handlers.apply = trap;
          } else if (type === "sync" || !(config2.ready & create.QUEUE)) {
            handlers.apply = function() {
              throw packageName + ": hooked function not ready";
            };
          } else {
            handlers.apply = function() {
              var args = arguments;
              postReady.push(function() {
                hookedFn.apply(args[1], args[2]);
              });
            };
          }
        }
      }
      dispatch.get = get2;
      return dispatch;
    }
    module2.exports = create;
  }
});

// modules/appnexusBidAdapter.js
var appnexusBidAdapter_exports = {};
__export(appnexusBidAdapter_exports, {
  spec: () => spec
});
module.exports = __toCommonJS(appnexusBidAdapter_exports);

// src/polyfill.js
function includes(target, elem, start) {
  return target && target.includes(elem, start) || false;
}
function arrayFrom() {
  return Array.from.apply(Array, arguments);
}
function find(arr, pred, thisArg) {
  return arr && arr.find(pred, thisArg);
}

// src/cpmBucketManager.js
var _defaultPrecision = 2;
var _lgPriceConfig = {
  "buckets": [{
    "max": 5,
    "increment": 0.5
  }]
};
var _mgPriceConfig = {
  "buckets": [{
    "max": 20,
    "increment": 0.1
  }]
};
var _hgPriceConfig = {
  "buckets": [{
    "max": 20,
    "increment": 0.01
  }]
};
var _densePriceConfig = {
  "buckets": [
    {
      "max": 3,
      "increment": 0.01
    },
    {
      "max": 8,
      "increment": 0.05
    },
    {
      "max": 20,
      "increment": 0.5
    }
  ]
};
var _autoPriceConfig = {
  "buckets": [
    {
      "max": 5,
      "increment": 0.05
    },
    {
      "max": 10,
      "increment": 0.1
    },
    {
      "max": 20,
      "increment": 0.5
    }
  ]
};
function getPriceBucketString(cpm, customConfig, granularityMultiplier = 1) {
  let cpmFloat = parseFloat(cpm);
  if (isNaN(cpmFloat)) {
    cpmFloat = "";
  }
  return {
    low: cpmFloat === "" ? "" : getCpmStringValue(cpm, _lgPriceConfig, granularityMultiplier),
    med: cpmFloat === "" ? "" : getCpmStringValue(cpm, _mgPriceConfig, granularityMultiplier),
    high: cpmFloat === "" ? "" : getCpmStringValue(cpm, _hgPriceConfig, granularityMultiplier),
    auto: cpmFloat === "" ? "" : getCpmStringValue(cpm, _autoPriceConfig, granularityMultiplier),
    dense: cpmFloat === "" ? "" : getCpmStringValue(cpm, _densePriceConfig, granularityMultiplier),
    custom: cpmFloat === "" ? "" : getCpmStringValue(cpm, customConfig, granularityMultiplier)
  };
}
function getCpmStringValue(cpm, config2, granularityMultiplier) {
  let cpmStr = "";
  if (!isValidPriceConfig(config2)) {
    return cpmStr;
  }
  const cap = config2.buckets.reduce((prev, curr) => {
    if (prev.max > curr.max) {
      return prev;
    }
    return curr;
  }, {
    "max": 0
  });
  let bucketFloor = 0;
  let bucket = find(config2.buckets, (bucket2) => {
    if (cpm > cap.max * granularityMultiplier) {
      let precision = bucket2.precision;
      if (typeof precision === "undefined") {
        precision = _defaultPrecision;
      }
      cpmStr = (bucket2.max * granularityMultiplier).toFixed(precision);
    } else if (cpm <= bucket2.max * granularityMultiplier && cpm >= bucketFloor * granularityMultiplier) {
      bucket2.min = bucketFloor;
      return bucket2;
    } else {
      bucketFloor = bucket2.max;
    }
  });
  if (bucket) {
    cpmStr = getCpmTarget(cpm, bucket, granularityMultiplier);
  }
  return cpmStr;
}
function isValidPriceConfig(config2) {
  if (isEmpty(config2) || !config2.buckets || !Array.isArray(config2.buckets)) {
    return false;
  }
  let isValid2 = true;
  config2.buckets.forEach((bucket) => {
    if (!bucket.max || !bucket.increment) {
      isValid2 = false;
    }
  });
  return isValid2;
}
function getCpmTarget(cpm, bucket, granularityMultiplier) {
  const precision = typeof bucket.precision !== "undefined" ? bucket.precision : _defaultPrecision;
  const increment = bucket.increment * granularityMultiplier;
  const bucketMin = bucket.min * granularityMultiplier;
  let roundingFunction = Math.floor;
  let customRoundingFunction = config.getConfig("cpmRoundingFunction");
  if (typeof customRoundingFunction === "function") {
    roundingFunction = customRoundingFunction;
  }
  let pow = Math.pow(10, precision + 2);
  let cpmToRound = (cpm * pow - bucketMin * pow) / (increment * pow);
  let cpmTarget;
  let invalidRounding;
  try {
    cpmTarget = roundingFunction(cpmToRound) * increment + bucketMin;
  } catch (err) {
    invalidRounding = true;
  }
  if (invalidRounding || typeof cpmTarget !== "number") {
    logWarn("Invalid rounding function passed in config");
    cpmTarget = Math.floor(cpmToRound) * increment + bucketMin;
  }
  cpmTarget = Number(cpmTarget.toFixed(10));
  return cpmTarget.toFixed(precision);
}

// src/constants.json
var constants_default = {
  JSON_MAPPING: {
    PL_CODE: "code",
    PL_SIZE: "sizes",
    PL_BIDS: "bids",
    BD_BIDDER: "bidder",
    BD_ID: "paramsd",
    BD_PL_ID: "placementId",
    ADSERVER_TARGETING: "adserverTargeting",
    BD_SETTING_STANDARD: "standard"
  },
  DEBUG_MODE: "pbjs_debug",
  STATUS: {
    GOOD: 1,
    NO_BID: 2
  },
  CB: {
    TYPE: {
      ALL_BIDS_BACK: "allRequestedBidsBack",
      AD_UNIT_BIDS_BACK: "adUnitBidsBack",
      BID_WON: "bidWon",
      REQUEST_BIDS: "requestBids"
    }
  },
  EVENTS: {
    AUCTION_INIT: "auctionInit",
    AUCTION_END: "auctionEnd",
    BID_ADJUSTMENT: "bidAdjustment",
    BID_TIMEOUT: "bidTimeout",
    BID_REQUESTED: "bidRequested",
    BID_RESPONSE: "bidResponse",
    BID_REJECTED: "bidRejected",
    NO_BID: "noBid",
    SEAT_NON_BID: "seatNonBid",
    BID_WON: "bidWon",
    BIDDER_DONE: "bidderDone",
    BIDDER_ERROR: "bidderError",
    SET_TARGETING: "setTargeting",
    BEFORE_REQUEST_BIDS: "beforeRequestBids",
    BEFORE_BIDDER_HTTP: "beforeBidderHttp",
    REQUEST_BIDS: "requestBids",
    ADD_AD_UNITS: "addAdUnits",
    AD_RENDER_FAILED: "adRenderFailed",
    AD_RENDER_SUCCEEDED: "adRenderSucceeded",
    TCF2_ENFORCEMENT: "tcf2Enforcement",
    AUCTION_DEBUG: "auctionDebug",
    BID_VIEWABLE: "bidViewable",
    STALE_RENDER: "staleRender",
    BILLABLE_EVENT: "billableEvent"
  },
  AD_RENDER_FAILED_REASON: {
    PREVENT_WRITING_ON_MAIN_DOCUMENT: "preventWritingOnMainDocument",
    NO_AD: "noAd",
    EXCEPTION: "exception",
    CANNOT_FIND_AD: "cannotFindAd",
    MISSING_DOC_OR_ADID: "missingDocOrAdid"
  },
  EVENT_ID_PATHS: {
    bidWon: "adUnitCode"
  },
  GRANULARITY_OPTIONS: {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    AUTO: "auto",
    DENSE: "dense",
    CUSTOM: "custom"
  },
  TARGETING_KEYS: {
    BIDDER: "hb_bidder",
    AD_ID: "hb_adid",
    PRICE_BUCKET: "hb_pb",
    SIZE: "hb_size",
    DEAL: "hb_deal",
    SOURCE: "hb_source",
    FORMAT: "hb_format",
    UUID: "hb_uuid",
    CACHE_ID: "hb_cache_id",
    CACHE_HOST: "hb_cache_host",
    ADOMAIN: "hb_adomain",
    ACAT: "hb_acat"
  },
  DEFAULT_TARGETING_KEYS: {
    BIDDER: "hb_bidder",
    AD_ID: "hb_adid",
    PRICE_BUCKET: "hb_pb",
    SIZE: "hb_size",
    DEAL: "hb_deal",
    FORMAT: "hb_format",
    UUID: "hb_uuid",
    CACHE_HOST: "hb_cache_host"
  },
  NATIVE_KEYS: {
    title: "hb_native_title",
    body: "hb_native_body",
    body2: "hb_native_body2",
    privacyLink: "hb_native_privacy",
    privacyIcon: "hb_native_privicon",
    sponsoredBy: "hb_native_brand",
    image: "hb_native_image",
    icon: "hb_native_icon",
    clickUrl: "hb_native_linkurl",
    displayUrl: "hb_native_displayurl",
    cta: "hb_native_cta",
    rating: "hb_native_rating",
    address: "hb_native_address",
    downloads: "hb_native_downloads",
    likes: "hb_native_likes",
    phone: "hb_native_phone",
    price: "hb_native_price",
    salePrice: "hb_native_saleprice",
    rendererUrl: "hb_renderer_url",
    adTemplate: "hb_adTemplate"
  },
  S2S: {
    SRC: "s2s",
    DEFAULT_ENDPOINT: "https://prebid.adnxs.com/pbs/v1/openrtb2/auction",
    SYNCED_BIDDERS_KEY: "pbjsSyncs"
  },
  BID_STATUS: {
    BID_TARGETING_SET: "targetingSet",
    RENDERED: "rendered",
    BID_REJECTED: "bidRejected"
  },
  REJECTION_REASON: {
    INVALID: "Bid has missing or invalid properties",
    INVALID_REQUEST_ID: "Invalid request ID",
    BIDDER_DISALLOWED: "Bidder code is not allowed by allowedAlternateBidderCodes / allowUnknownBidderCodes",
    FLOOR_NOT_MET: "Bid does not meet price floor",
    CANNOT_CONVERT_CURRENCY: "Unable to convert currency"
  },
  PREBID_NATIVE_DATA_KEYS_TO_ORTB: {
    body: "desc",
    body2: "desc2",
    sponsoredBy: "sponsored",
    cta: "ctatext",
    rating: "rating",
    address: "address",
    downloads: "downloads",
    likes: "likes",
    phone: "phone",
    price: "price",
    salePrice: "saleprice",
    displayUrl: "displayurl"
  },
  NATIVE_ASSET_TYPES: {
    sponsored: 1,
    desc: 2,
    rating: 3,
    likes: 4,
    downloads: 5,
    price: 6,
    saleprice: 7,
    phone: 8,
    address: 9,
    desc2: 10,
    displayurl: 11,
    ctatext: 12
  },
  NATIVE_IMAGE_TYPES: {
    ICON: 1,
    MAIN: 3
  },
  NATIVE_KEYS_THAT_ARE_NOT_ASSETS: [
    "privacyLink",
    "clickUrl",
    "sendTargetingKeys",
    "adTemplate",
    "rendererUrl",
    "type"
  ]
};

// src/config.js
var DEFAULT_DEBUG = getParameterByName(constants_default.DEBUG_MODE).toUpperCase() === "TRUE";
var DEFAULT_BIDDER_TIMEOUT = 3e3;
var DEFAULT_ENABLE_SEND_ALL_BIDS = true;
var DEFAULT_DISABLE_AJAX_TIMEOUT = false;
var DEFAULT_BID_CACHE = false;
var DEFAULT_DEVICE_ACCESS = true;
var DEFAULT_MAX_NESTED_IFRAMES = 10;
var DEFAULT_TIMEOUTBUFFER = 400;
var RANDOM = "random";
var FIXED = "fixed";
var VALID_ORDERS = {};
VALID_ORDERS[RANDOM] = true;
VALID_ORDERS[FIXED] = true;
var DEFAULT_BIDDER_SEQUENCE = RANDOM;
var GRANULARITY_OPTIONS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  AUTO: "auto",
  DENSE: "dense",
  CUSTOM: "custom"
};
var ALL_TOPICS = "*";
function newConfig() {
  let listeners = [];
  let defaults;
  let config2;
  let bidderConfig;
  let currBidder = null;
  function resetConfig() {
    defaults = {};
    function getProp(name) {
      return props[name].val;
    }
    function setProp(name, val) {
      props[name].val = val;
    }
    const props = {
      publisherDomain: {
        set(val) {
          if (val != null) {
            logWarn("publisherDomain is deprecated and has no effect since v7 - use pageUrl instead");
          }
          setProp("publisherDomain", val);
        }
      },
      priceGranularity: {
        val: GRANULARITY_OPTIONS.MEDIUM,
        set(val) {
          if (validatePriceGranularity(val)) {
            if (typeof val === "string") {
              setProp("priceGranularity", hasGranularity(val) ? val : GRANULARITY_OPTIONS.MEDIUM);
            } else if (isPlainObject(val)) {
              setProp("customPriceBucket", val);
              setProp("priceGranularity", GRANULARITY_OPTIONS.CUSTOM);
              logMessage("Using custom price granularity");
            }
          }
        }
      },
      customPriceBucket: {
        val: {},
        set() {
        }
      },
      mediaTypePriceGranularity: {
        val: {},
        set(val) {
          val != null && setProp("mediaTypePriceGranularity", Object.keys(val).reduce((aggregate, item) => {
            if (validatePriceGranularity(val[item])) {
              if (typeof val === "string") {
                aggregate[item] = hasGranularity(val[item]) ? val[item] : getProp("priceGranularity");
              } else if (isPlainObject(val)) {
                aggregate[item] = val[item];
                logMessage(`Using custom price granularity for ${item}`);
              }
            } else {
              logWarn(`Invalid price granularity for media type: ${item}`);
            }
            return aggregate;
          }, {}));
        }
      },
      bidderSequence: {
        val: DEFAULT_BIDDER_SEQUENCE,
        set(val) {
          if (VALID_ORDERS[val]) {
            setProp("bidderSequence", val);
          } else {
            logWarn(`Invalid order: ${val}. Bidder Sequence was not set.`);
          }
        }
      },
      auctionOptions: {
        val: {},
        set(val) {
          if (validateauctionOptions(val)) {
            setProp("auctionOptions", val);
          }
        }
      }
    };
    let newConfig2 = {
      // `debug` is equivalent to legacy `pbjs.logging` property
      debug: DEFAULT_DEBUG,
      bidderTimeout: DEFAULT_BIDDER_TIMEOUT,
      enableSendAllBids: DEFAULT_ENABLE_SEND_ALL_BIDS,
      useBidCache: DEFAULT_BID_CACHE,
      /**
       * deviceAccess set to false will disable setCookie, getCookie, hasLocalStorage
       * @type {boolean}
       */
      deviceAccess: DEFAULT_DEVICE_ACCESS,
      // timeout buffer to adjust for bidder CDN latency
      timeoutBuffer: DEFAULT_TIMEOUTBUFFER,
      disableAjaxTimeout: DEFAULT_DISABLE_AJAX_TIMEOUT,
      // default max nested iframes for referer detection
      maxNestedIframes: DEFAULT_MAX_NESTED_IFRAMES
    };
    Object.defineProperties(
      newConfig2,
      Object.fromEntries(Object.entries(props).map(([k, def]) => [k, Object.assign({
        get: getProp.bind(null, k),
        set: setProp.bind(null, k),
        enumerable: true
      }, def)]))
    );
    if (config2) {
      callSubscribers(
        Object.keys(config2).reduce(
          (memo, topic) => {
            if (config2[topic] !== newConfig2[topic]) {
              memo[topic] = newConfig2[topic] || {};
            }
            return memo;
          },
          {}
        )
      );
    }
    config2 = newConfig2;
    bidderConfig = {};
    function hasGranularity(val) {
      return find(Object.keys(GRANULARITY_OPTIONS), (option) => val === GRANULARITY_OPTIONS[option]);
    }
    function validatePriceGranularity(val) {
      if (!val) {
        logError("Prebid Error: no value passed to `setPriceGranularity()`");
        return false;
      }
      if (typeof val === "string") {
        if (!hasGranularity(val)) {
          logWarn("Prebid Warning: setPriceGranularity was called with invalid setting, using `medium` as default.");
        }
      } else if (isPlainObject(val)) {
        if (!isValidPriceConfig(val)) {
          logError("Invalid custom price value passed to `setPriceGranularity()`");
          return false;
        }
      }
      return true;
    }
    function validateauctionOptions(val) {
      if (!isPlainObject(val)) {
        logWarn("Auction Options must be an object");
        return false;
      }
      for (let k of Object.keys(val)) {
        if (k !== "secondaryBidders" && k !== "suppressStaleRender") {
          logWarn(`Auction Options given an incorrect param: ${k}`);
          return false;
        }
        if (k === "secondaryBidders") {
          if (!isArray(val[k])) {
            logWarn(`Auction Options ${k} must be of type Array`);
            return false;
          } else if (!val[k].every(isStr)) {
            logWarn(`Auction Options ${k} must be only string`);
            return false;
          }
        } else if (k === "suppressStaleRender") {
          if (!isBoolean(val[k])) {
            logWarn(`Auction Options ${k} must be of type boolean`);
            return false;
          }
        }
      }
      return true;
    }
  }
  function _getConfig() {
    if (currBidder && bidderConfig && isPlainObject(bidderConfig[currBidder])) {
      let currBidderConfig = bidderConfig[currBidder];
      const configTopicSet = new Set(Object.keys(config2).concat(Object.keys(currBidderConfig)));
      return arrayFrom(configTopicSet).reduce((memo, topic) => {
        if (typeof currBidderConfig[topic] === "undefined") {
          memo[topic] = config2[topic];
        } else if (typeof config2[topic] === "undefined") {
          memo[topic] = currBidderConfig[topic];
        } else {
          if (isPlainObject(currBidderConfig[topic])) {
            memo[topic] = mergeDeep({}, config2[topic], currBidderConfig[topic]);
          } else {
            memo[topic] = currBidderConfig[topic];
          }
        }
        return memo;
      }, {});
    }
    return Object.assign({}, config2);
  }
  function _getRestrictedConfig() {
    const conf = _getConfig();
    Object.defineProperty(conf, "ortb2", {
      get: function() {
        throw new Error("invalid access to 'orbt2' config - use request parameters instead");
      }
    });
    return conf;
  }
  const [getAnyConfig, getConfig] = [_getConfig, _getRestrictedConfig].map((accessor) => {
    return function getConfig2(...args) {
      if (args.length <= 1 && typeof args[0] !== "function") {
        const option = args[0];
        return option ? dlv(accessor(), option) : _getConfig();
      }
      return subscribe(...args);
    };
  });
  const [readConfig, readAnyConfig] = [getConfig, getAnyConfig].map((wrapee) => {
    return function readConfig2(...args) {
      let res = wrapee(...args);
      if (res && typeof res === "object") {
        res = deepClone(res);
      }
      return res;
    };
  });
  function getBidderConfig() {
    return bidderConfig;
  }
  function setConfig(options) {
    if (!isPlainObject(options)) {
      logError("setConfig options must be an object");
      return;
    }
    let topics = Object.keys(options);
    let topicalConfig = {};
    topics.forEach((topic) => {
      let option = options[topic];
      if (isPlainObject(defaults[topic]) && isPlainObject(option)) {
        option = Object.assign({}, defaults[topic], option);
      }
      try {
        topicalConfig[topic] = config2[topic] = option;
      } catch (e) {
        logWarn(`Cannot set config for property ${topic} : `, e);
      }
    });
    callSubscribers(topicalConfig);
  }
  function setDefaults(options) {
    if (!isPlainObject(defaults)) {
      logError("defaults must be an object");
      return;
    }
    Object.assign(defaults, options);
    Object.assign(config2, options);
  }
  function subscribe(topic, listener, options = {}) {
    let callback = listener;
    if (typeof topic !== "string") {
      callback = topic;
      topic = ALL_TOPICS;
      options = listener || {};
    }
    if (typeof callback !== "function") {
      logError("listener must be a function");
      return;
    }
    const nl = { topic, callback };
    listeners.push(nl);
    if (options.init) {
      if (topic === ALL_TOPICS) {
        callback(getConfig());
      } else {
        callback({ [topic]: getConfig(topic) });
      }
    }
    return function unsubscribe() {
      listeners.splice(listeners.indexOf(nl), 1);
    };
  }
  function callSubscribers(options) {
    const TOPICS = Object.keys(options);
    listeners.filter((listener) => includes(TOPICS, listener.topic)).forEach((listener) => {
      listener.callback({ [listener.topic]: options[listener.topic] });
    });
    listeners.filter((listener) => listener.topic === ALL_TOPICS).forEach((listener) => listener.callback(options));
  }
  function setBidderConfig(config3, mergeFlag = false) {
    try {
      check(config3);
      config3.bidders.forEach((bidder) => {
        if (!bidderConfig[bidder]) {
          bidderConfig[bidder] = {};
        }
        Object.keys(config3.config).forEach((topic) => {
          let option = config3.config[topic];
          if (isPlainObject(option)) {
            const func = mergeFlag ? mergeDeep : Object.assign;
            bidderConfig[bidder][topic] = func({}, bidderConfig[bidder][topic] || {}, option);
          } else {
            bidderConfig[bidder][topic] = option;
          }
        });
      });
    } catch (e) {
      logError(e);
    }
    function check(obj) {
      if (!isPlainObject(obj)) {
        throw "setBidderConfig bidder options must be an object";
      }
      if (!(Array.isArray(obj.bidders) && obj.bidders.length)) {
        throw "setBidderConfig bidder options must contain a bidders list with at least 1 bidder";
      }
      if (!isPlainObject(obj.config)) {
        throw "setBidderConfig bidder options must contain a config object";
      }
    }
  }
  function mergeConfig(obj) {
    if (!isPlainObject(obj)) {
      logError("mergeConfig input must be an object");
      return;
    }
    const mergedConfig = mergeDeep(_getConfig(), obj);
    setConfig({ ...mergedConfig });
    return mergedConfig;
  }
  function mergeBidderConfig(obj) {
    return setBidderConfig(obj, true);
  }
  function runWithBidder(bidder, fn) {
    currBidder = bidder;
    try {
      return fn();
    } finally {
      resetBidder();
    }
  }
  function callbackWithBidder(bidder) {
    return function(cb) {
      return function(...args) {
        if (typeof cb === "function") {
          return runWithBidder(bidder, bind.call(cb, this, ...args));
        } else {
          logWarn("config.callbackWithBidder callback is not a function");
        }
      };
    };
  }
  function getCurrentBidder() {
    return currBidder;
  }
  function resetBidder() {
    currBidder = null;
  }
  resetConfig();
  return {
    getCurrentBidder,
    resetBidder,
    getConfig,
    getAnyConfig,
    readConfig,
    readAnyConfig,
    setConfig,
    mergeConfig,
    setDefaults,
    resetConfig,
    runWithBidder,
    callbackWithBidder,
    setBidderConfig,
    getBidderConfig,
    mergeBidderConfig
  };
}
var config = newConfig();

// src/utils.js
var import_just_clone = __toESM(require_just_clone(), 1);

// src/utils/promise.js
var SUCCESS = 0;
var FAIL = 1;
var _result, _callbacks, _collect, collect_fn;
var _GreedyPromise = class {
  constructor(resolver) {
    __privateAdd(this, _result, void 0);
    __privateAdd(this, _callbacks, void 0);
    if (typeof resolver !== "function") {
      throw new Error("resolver not a function");
    }
    const result = [];
    const callbacks = [];
    let [resolve, reject] = [SUCCESS, FAIL].map((type) => {
      return function(value) {
        if (type === SUCCESS && typeof value?.then === "function") {
          value.then(resolve, reject);
        } else if (!result.length) {
          result.push(type, value);
          while (callbacks.length)
            callbacks.shift()();
        }
      };
    });
    try {
      resolver(resolve, reject);
    } catch (e) {
      reject(e);
    }
    __privateSet(this, _result, result);
    __privateSet(this, _callbacks, callbacks);
  }
  /**
   * Convenience wrapper for setTimeout; takes care of returning an already fulfilled GreedyPromise when the delay is zero.
   *
   * @param {Number} delayMs delay in milliseconds
   * @returns {GreedyPromise} a promise that resolves (to undefined) in `delayMs` milliseconds
   */
  static timeout(delayMs = 0) {
    return new _GreedyPromise((resolve) => {
      delayMs === 0 ? resolve() : setTimeout(resolve, delayMs);
    });
  }
  then(onSuccess, onError) {
    const result = __privateGet(this, _result);
    return new this.constructor((resolve, reject) => {
      const continuation = () => {
        let value = result[1];
        let [handler, resolveFn] = result[0] === SUCCESS ? [onSuccess, resolve] : [onError, reject];
        if (typeof handler === "function") {
          try {
            value = handler(value);
          } catch (e) {
            reject(e);
            return;
          }
          resolveFn = resolve;
        }
        resolveFn(value);
      };
      result.length ? continuation() : __privateGet(this, _callbacks).push(continuation);
    });
  }
  catch(onError) {
    return this.then(null, onError);
  }
  finally(onFinally) {
    let val;
    return this.then(
      (v) => {
        val = v;
        return onFinally();
      },
      (e) => {
        val = this.constructor.reject(e);
        return onFinally();
      }
    ).then(() => val);
  }
  static race(promises) {
    return new this((resolve, reject) => {
      __privateMethod(this, _collect, collect_fn).call(this, promises, (success, result) => success ? resolve(result) : reject(result));
    });
  }
  static all(promises) {
    return new this((resolve, reject) => {
      let res = [];
      __privateMethod(this, _collect, collect_fn).call(this, promises, (success, val, i) => success ? res[i] = val : reject(val), () => resolve(res));
    });
  }
  static allSettled(promises) {
    return new this((resolve) => {
      let res = [];
      __privateMethod(this, _collect, collect_fn).call(this, promises, (success, val, i) => res[i] = success ? { status: "fulfilled", value: val } : { status: "rejected", reason: val }, () => resolve(res));
    });
  }
  static resolve(value) {
    return new this((resolve) => resolve(value));
  }
  static reject(error) {
    return new this((resolve, reject) => reject(error));
  }
};
var GreedyPromise = _GreedyPromise;
_result = new WeakMap();
_callbacks = new WeakMap();
_collect = new WeakSet();
collect_fn = function(promises, collector, done) {
  let cnt = promises.length;
  function clt() {
    collector.apply(this, arguments);
    if (--cnt <= 0 && done)
      done();
  }
  promises.length === 0 && done ? done() : promises.forEach((p, i) => this.resolve(p).then(
    (val) => clt(true, val, i),
    (err) => clt(false, err, i)
  ));
};
__privateAdd(GreedyPromise, _collect);
function defer({ promiseFactory = (resolver) => new GreedyPromise(resolver) } = {}) {
  function invoker(delegate) {
    return (val) => delegate(val);
  }
  let resolveFn, rejectFn;
  return {
    promise: promiseFactory((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    }),
    resolve: invoker(resolveFn),
    reject: invoker(rejectFn)
  };
}

// src/prebidGlobal.js
var scope = !$$DEFINE_PREBID_GLOBAL$$ ? {} : window;
var global = scope.$$PREBID_GLOBAL$$ = scope.$$PREBID_GLOBAL$$ || {};
global.cmd = global.cmd || [];
global.que = global.que || [];
if (scope === window) {
  scope._pbjsGlobals = scope._pbjsGlobals || [];
  scope._pbjsGlobals.push("$$PREBID_GLOBAL$$");
}
function getGlobal() {
  return global;
}

// node_modules/dlv/index.js
function dlv(obj, key, def, p, undef) {
  key = key.split ? key.split(".") : key;
  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef;
  }
  return obj === undef ? def : obj;
}

// src/utils.js
var tArr = "Array";
var tStr = "String";
var tFn = "Function";
var tNumb = "Number";
var tObject = "Object";
var tBoolean = "Boolean";
var toString = Object.prototype.toString;
var consoleExists = Boolean(window.console);
var consoleLogExists = Boolean(consoleExists && window.console.log);
var consoleInfoExists = Boolean(consoleExists && window.console.info);
var consoleWarnExists = Boolean(consoleExists && window.console.warn);
var consoleErrorExists = Boolean(consoleExists && window.console.error);
var eventEmitter;
var pbjsInstance = getGlobal();
function _setEventEmitter(emitFn) {
  eventEmitter = emitFn;
}
function emitEvent(...args) {
  if (eventEmitter != null) {
    eventEmitter(...args);
  }
}
var internal = {
  checkCookieSupport,
  createTrackPixelIframeHtml,
  getWindowSelf,
  getWindowTop,
  getWindowLocation,
  insertUserSyncIframe,
  insertElement,
  isFn,
  triggerPixel,
  logError,
  logWarn,
  logMessage,
  logInfo,
  parseQS,
  formatQS,
  deepEqual
};
var uniqueRef = {};
var bind = function(a, b) {
  return b;
}.bind(null, 1, uniqueRef)() === uniqueRef ? Function.prototype.bind : function(bind2) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return self.apply(bind2, args.concat(Array.prototype.slice.call(arguments)));
  };
};
var getIncrementalInteger = function() {
  var count = 0;
  return function() {
    count++;
    return count;
  };
}();
function getUniqueIdentifierStr() {
  return getIncrementalInteger() + Math.random().toString(16).substr(2);
}
function generateUUID(placeholder) {
  return placeholder ? (placeholder ^ _getRandomData() >> placeholder / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
}
function _getRandomData() {
  if (window && window.crypto && window.crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(1))[0] % 16;
  } else {
    return Math.random() * 16;
  }
}
function parseQueryStringParameters(queryObj) {
  let result = "";
  for (var k in queryObj) {
    if (queryObj.hasOwnProperty(k)) {
      result += k + "=" + encodeURIComponent(queryObj[k]) + "&";
    }
  }
  result = result.replace(/&$/, "");
  return result;
}
function parseSizesInput(sizeObj) {
  var parsedSizes = [];
  if (typeof sizeObj === "string") {
    var sizes = sizeObj.split(",");
    var sizeRegex = /^(\d)+x(\d)+$/i;
    if (sizes) {
      for (var curSizePos in sizes) {
        if (hasOwn(sizes, curSizePos) && sizes[curSizePos].match(sizeRegex)) {
          parsedSizes.push(sizes[curSizePos]);
        }
      }
    }
  } else if (typeof sizeObj === "object") {
    var sizeArrayLength = sizeObj.length;
    if (sizeArrayLength > 0) {
      if (sizeArrayLength === 2 && typeof sizeObj[0] === "number" && typeof sizeObj[1] === "number") {
        parsedSizes.push(parseGPTSingleSizeArray(sizeObj));
      } else {
        for (var i = 0; i < sizeArrayLength; i++) {
          parsedSizes.push(parseGPTSingleSizeArray(sizeObj[i]));
        }
      }
    }
  }
  return parsedSizes;
}
function parseGPTSingleSizeArray(singleSize) {
  if (isValidGPTSingleSize(singleSize)) {
    return singleSize[0] + "x" + singleSize[1];
  }
}
function isValidGPTSingleSize(singleSize) {
  return isArray(singleSize) && singleSize.length === 2 && (!isNaN(singleSize[0]) && !isNaN(singleSize[1]));
}
function getWindowTop() {
  return window.top;
}
function getWindowSelf() {
  return window.self;
}
function getWindowLocation() {
  return window.location;
}
function logMessage() {
  if (debugTurnedOn() && consoleLogExists) {
    console.log.apply(console, decorateLog(arguments, "MESSAGE:"));
  }
}
function logInfo() {
  if (debugTurnedOn() && consoleInfoExists) {
    console.info.apply(console, decorateLog(arguments, "INFO:"));
  }
}
function logWarn() {
  if (debugTurnedOn() && consoleWarnExists) {
    console.warn.apply(console, decorateLog(arguments, "WARNING:"));
  }
  emitEvent(constants_default.EVENTS.AUCTION_DEBUG, { type: "WARNING", arguments });
}
function logError() {
  if (debugTurnedOn() && consoleErrorExists) {
    console.error.apply(console, decorateLog(arguments, "ERROR:"));
  }
  emitEvent(constants_default.EVENTS.AUCTION_DEBUG, { type: "ERROR", arguments });
}
function decorateLog(args, prefix) {
  args = [].slice.call(args);
  let bidder = config.getCurrentBidder();
  prefix && args.unshift(prefix);
  if (bidder) {
    args.unshift(label("#aaa"));
  }
  args.unshift(label("#3b88c3"));
  args.unshift("%cPrebid" + (bidder ? `%c${bidder}` : ""));
  return args;
  function label(color) {
    return `display: inline-block; color: #fff; background: ${color}; padding: 1px 4px; border-radius: 3px;`;
  }
}
function debugTurnedOn() {
  return !!config.getConfig("debug");
}
function getParameterByName(name) {
  return parseQS(getWindowLocation().search)[name] || "";
}
function isA(object, _t) {
  return toString.call(object) === "[object " + _t + "]";
}
function isFn(object) {
  return isA(object, tFn);
}
function isStr(object) {
  return isA(object, tStr);
}
function isArray(object) {
  return isA(object, tArr);
}
function isNumber(object) {
  return isA(object, tNumb);
}
function isPlainObject(object) {
  return isA(object, tObject);
}
function isBoolean(object) {
  return isA(object, tBoolean);
}
function isEmpty(object) {
  if (!object)
    return true;
  if (isArray(object) || isStr(object)) {
    return !(object.length > 0);
  }
  for (var k in object) {
    if (hasOwnProperty.call(object, k))
      return false;
  }
  return true;
}
function isEmptyStr(str) {
  return isStr(str) && (!str || str.length === 0);
}
function _each(object, fn) {
  if (isEmpty(object))
    return;
  if (isFn(object.forEach))
    return object.forEach(fn, this);
  var k = 0;
  var l = object.length;
  if (l > 0) {
    for (; k < l; k++)
      fn(object[k], k, object);
  } else {
    for (k in object) {
      if (hasOwnProperty.call(object, k))
        fn.call(this, object[k], k);
    }
  }
}
function contains(a, obj) {
  if (isEmpty(a)) {
    return false;
  }
  if (isFn(a.indexOf)) {
    return a.indexOf(obj) !== -1;
  }
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}
function _map(object, callback) {
  if (isEmpty(object))
    return [];
  if (isFn(object.map))
    return object.map(callback);
  var output = [];
  _each(object, function(value, key) {
    output.push(callback(value, key, object));
  });
  return output;
}
function hasOwn(objectToCheck, propertyToCheckFor) {
  if (objectToCheck.hasOwnProperty) {
    return objectToCheck.hasOwnProperty(propertyToCheckFor);
  } else {
    return typeof objectToCheck[propertyToCheckFor] !== "undefined" && objectToCheck.constructor.prototype[propertyToCheckFor] !== objectToCheck[propertyToCheckFor];
  }
}
function insertElement(elm, doc, target, asLastChildChild) {
  doc = doc || document;
  let parentEl;
  if (target) {
    parentEl = doc.getElementsByTagName(target);
  } else {
    parentEl = doc.getElementsByTagName("head");
  }
  try {
    parentEl = parentEl.length ? parentEl : doc.getElementsByTagName("body");
    if (parentEl.length) {
      parentEl = parentEl[0];
      let insertBeforeEl = asLastChildChild ? null : parentEl.firstChild;
      return parentEl.insertBefore(elm, insertBeforeEl);
    }
  } catch (e) {
  }
}
function waitForElementToLoad(element, timeout) {
  let timer = null;
  return new GreedyPromise((resolve) => {
    const onLoad = function() {
      element.removeEventListener("load", onLoad);
      element.removeEventListener("error", onLoad);
      if (timer != null) {
        window.clearTimeout(timer);
      }
      resolve();
    };
    element.addEventListener("load", onLoad);
    element.addEventListener("error", onLoad);
    if (timeout != null) {
      timer = window.setTimeout(onLoad, timeout);
    }
  });
}
function triggerPixel(url, done, timeout) {
  const img = new Image();
  if (done && internal.isFn(done)) {
    waitForElementToLoad(img, timeout).then(done);
  }
  img.src = url;
}
function insertUserSyncIframe(url, done, timeout) {
  let iframeHtml = internal.createTrackPixelIframeHtml(url, false, "allow-scripts allow-same-origin");
  let div = document.createElement("div");
  div.innerHTML = iframeHtml;
  let iframe = div.firstChild;
  if (done && internal.isFn(done)) {
    waitForElementToLoad(iframe, timeout).then(done);
  }
  internal.insertElement(iframe, document, "html", true);
}
function createTrackPixelHtml(url) {
  if (!url) {
    return "";
  }
  let escapedUrl = encodeURI(url);
  let img = '<div style="position:absolute;left:0px;top:0px;visibility:hidden;">';
  img += '<img src="' + escapedUrl + '"></div>';
  return img;
}
function createTrackPixelIframeHtml(url, encodeUri = true, sandbox = "") {
  if (!url) {
    return "";
  }
  if (encodeUri) {
    url = encodeURI(url);
  }
  if (sandbox) {
    sandbox = `sandbox="${sandbox}"`;
  }
  return `<iframe ${sandbox} id="${getUniqueIdentifierStr()}"
      frameborder="0"
      allowtransparency="true"
      marginheight="0" marginwidth="0"
      width="0" hspace="0" vspace="0" height="0"
      style="height:0px;width:0px;display:none;"
      scrolling="no"
      src="${url}">
    </iframe>`;
}
function getValueString(param, val, defaultValue) {
  if (val === void 0 || val === null) {
    return defaultValue;
  }
  if (isStr(val)) {
    return val;
  }
  if (isNumber(val)) {
    return val.toString();
  }
  internal.logWarn("Unsuported type for param: " + param + " required type: String");
}
function uniques(value, index, arry) {
  return arry.indexOf(value) === index;
}
function flatten(a, b) {
  return a.concat(b);
}
function getBidRequest(id, bidderRequests) {
  if (!id) {
    return;
  }
  let bidRequest;
  bidderRequests.some((bidderRequest) => {
    let result = find(bidderRequest.bids, (bid) => ["bidId", "adId", "bid_id"].some((type) => bid[type] === id));
    if (result) {
      bidRequest = result;
    }
    return result;
  });
  return bidRequest;
}
function getValue(obj, key) {
  return obj[key];
}
function getBidderCodes(adUnits2 = pbjsInstance.adUnits) {
  return adUnits2.map((unit) => unit.bids.map((bid) => bid.bidder).reduce(flatten, [])).reduce(flatten, []).filter((bidder) => typeof bidder !== "undefined").filter(uniques);
}
var getHighestCpm = getHighestCpmCallback("timeToRespond", (previous, current) => previous > current);
var getOldestHighestCpmBid = getHighestCpmCallback("responseTimestamp", (previous, current) => previous > current);
var getLatestHighestCpmBid = getHighestCpmCallback("responseTimestamp", (previous, current) => previous < current);
function getHighestCpmCallback(useTieBreakerProperty, tieBreakerCallback) {
  return (previous, current) => {
    if (previous.cpm === current.cpm) {
      return tieBreakerCallback(previous[useTieBreakerProperty], current[useTieBreakerProperty]) ? current : previous;
    }
    return previous.cpm < current.cpm ? current : previous;
  };
}
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function adUnitsFilter(filter, bid) {
  return includes(filter, bid && bid.adUnitCode);
}
function deepClone(obj) {
  return (0, import_just_clone.default)(obj);
}
function isSafariBrowser() {
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
}
function timestamp() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function getPerformanceNow() {
  return window.performance && window.performance.now && window.performance.now() || 0;
}
function hasDeviceAccess() {
  return config.getConfig("deviceAccess") !== false;
}
function checkCookieSupport() {
  if (window.navigator.cookieEnabled || !!document.cookie.length) {
    return true;
  }
}
function delayExecution(func, numRequiredCalls) {
  if (numRequiredCalls < 1) {
    throw new Error(`numRequiredCalls must be a positive number. Got ${numRequiredCalls}`);
  }
  let numCalls = 0;
  return function() {
    numCalls++;
    if (numCalls === numRequiredCalls) {
      func.apply(this, arguments);
    }
  };
}
function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
function getDefinedParams(object, params) {
  return params.filter((param) => object[param]).reduce((bid, param) => Object.assign(bid, { [param]: object[param] }), {});
}
function isValidMediaTypes(mediaTypes) {
  const SUPPORTED_MEDIA_TYPES = ["banner", "native", "video"];
  const SUPPORTED_STREAM_TYPES = ["instream", "outstream", "adpod"];
  const types = Object.keys(mediaTypes);
  if (!types.every((type) => includes(SUPPORTED_MEDIA_TYPES, type))) {
    return false;
  }
  if (FEATURES.VIDEO && mediaTypes.video && mediaTypes.video.context) {
    return includes(SUPPORTED_STREAM_TYPES, mediaTypes.video.context);
  }
  return true;
}
function getUserConfiguredParams(adUnits2, adUnitCode, bidder) {
  return adUnits2.filter((adUnit) => adUnit.code === adUnitCode).map((adUnit) => adUnit.bids).reduce(flatten, []).filter((bidderData) => bidderData.bidder === bidder).map((bidderData) => bidderData.params || {});
}
function isInteger(value) {
  if (Number.isInteger) {
    return Number.isInteger(value);
  } else {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  }
}
function convertCamelToUnderscore(value) {
  return value.replace(/(?:^|\.?)([A-Z])/g, function(x, y) {
    return "_" + y.toLowerCase();
  }).replace(/^_/, "");
}
function pick(obj, properties) {
  if (typeof obj !== "object") {
    return {};
  }
  return properties.reduce((newObj, prop, i) => {
    if (typeof prop === "function") {
      return newObj;
    }
    let newProp = prop;
    let match = prop.match(/^(.+?)\sas\s(.+?)$/i);
    if (match) {
      prop = match[1];
      newProp = match[2];
    }
    let value = obj[prop];
    if (typeof properties[i + 1] === "function") {
      value = properties[i + 1](value, newObj);
    }
    if (typeof value !== "undefined") {
      newObj[newProp] = value;
    }
    return newObj;
  }, {});
}
function transformBidderParamKeywords(keywords, paramName = "keywords") {
  let arrs = [];
  _each(keywords, (v, k) => {
    if (isArray(v)) {
      let values = [];
      _each(v, (val) => {
        val = getValueString(paramName + "." + k, val);
        if (val || val === "") {
          values.push(val);
        }
      });
      v = values;
    } else {
      v = getValueString(paramName + "." + k, v);
      if (isStr(v)) {
        v = [v];
      } else {
        return;
      }
    }
    arrs.push({ key: k, value: v });
  });
  return arrs;
}
function tryConvertType(typeToConvert, value) {
  if (typeToConvert === "string") {
    return value && value.toString();
  } else if (typeToConvert === "number") {
    return Number(value);
  } else {
    return value;
  }
}
function convertTypes(types, params) {
  Object.keys(types).forEach((key) => {
    if (params[key]) {
      if (isFn(types[key])) {
        params[key] = types[key](params[key]);
      } else {
        params[key] = tryConvertType(types[key], params[key]);
      }
      if (isNaN(params[key])) {
        delete params.key;
      }
    }
  });
  return params;
}
function isArrayOfNums(val, size) {
  return isArray(val) && (size ? val.length === size : true) && val.every((v) => isInteger(v));
}
function fill(value, length) {
  let newArray = [];
  for (let i = 0; i < length; i++) {
    let valueToPush = isPlainObject(value) ? deepClone(value) : value;
    newArray.push(valueToPush);
  }
  return newArray;
}
function chunk(array, size) {
  let newArray = [];
  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    let start = i * size;
    let end = start + size;
    newArray.push(array.slice(start, end));
  }
  return newArray;
}
function getMinValueFromArray(array) {
  return Math.min(...array);
}
function getMaxValueFromArray(array) {
  return Math.max(...array);
}
function parseQS(query) {
  return !query ? {} : query.replace(/^\?/, "").split("&").reduce((acc, criteria) => {
    let [k, v] = criteria.split("=");
    if (/\[\]$/.test(k)) {
      k = k.replace("[]", "");
      acc[k] = acc[k] || [];
      acc[k].push(v);
    } else {
      acc[k] = v || "";
    }
    return acc;
  }, {});
}
function formatQS(query) {
  return Object.keys(query).map((k) => Array.isArray(query[k]) ? query[k].map((v) => `${k}[]=${v}`).join("&") : `${k}=${query[k]}`).join("&");
}
function parseUrl(url, options) {
  let parsed = document.createElement("a");
  if (options && "noDecodeWholeURL" in options && options.noDecodeWholeURL) {
    parsed.href = url;
  } else {
    parsed.href = decodeURIComponent(url);
  }
  let qsAsString = options && "decodeSearchAsString" in options && options.decodeSearchAsString;
  return {
    href: parsed.href,
    protocol: (parsed.protocol || "").replace(/:$/, ""),
    hostname: parsed.hostname,
    port: +parsed.port,
    pathname: parsed.pathname.replace(/^(?!\/)/, "/"),
    search: qsAsString ? parsed.search : internal.parseQS(parsed.search || ""),
    hash: (parsed.hash || "").replace(/^#/, ""),
    host: parsed.host || window.location.host
  };
}
function buildUrl(obj) {
  return (obj.protocol || "http") + "://" + (obj.host || obj.hostname + (obj.port ? `:${obj.port}` : "")) + (obj.pathname || "") + (obj.search ? `?${internal.formatQS(obj.search || "")}` : "") + (obj.hash ? `#${obj.hash}` : "");
}
function deepEqual(obj1, obj2, { checkTypes = false } = {}) {
  if (obj1 === obj2)
    return true;
  else if (typeof obj1 === "object" && obj1 !== null && (typeof obj2 === "object" && obj2 !== null) && (!checkTypes || obj1.constructor === obj2.constructor)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length)
      return false;
    for (let prop in obj1) {
      if (obj2.hasOwnProperty(prop)) {
        if (!deepEqual(obj1[prop], obj2[prop], { checkTypes })) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
function mergeDeep(target, ...sources) {
  if (!sources.length)
    return target;
  const source = sources.shift();
  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        if (!target[key])
          Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else if (isArray(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: [...source[key]] });
        } else if (isArray(target[key])) {
          source[key].forEach((obj) => {
            let addItFlag = 1;
            for (let i = 0; i < target[key].length; i++) {
              if (deepEqual(target[key][i], obj)) {
                addItFlag = 0;
                break;
              }
            }
            if (addItFlag) {
              target[key].push(obj);
            }
          });
        }
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}
function getWindowFromDocument(doc) {
  return doc ? doc.defaultView : null;
}
function setScriptAttributes(script, attributes) {
  for (let key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      script.setAttribute(key, attributes[key]);
    }
  }
}
var escapeUnsafeChars = (() => {
  const escapes = {
    "<": "\\u003C",
    ">": "\\u003E",
    "/": "\\u002F",
    "\\": "\\\\",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "	": "\\t",
    "\0": "\\0",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  return function(str) {
    return str.replace(/[<>\b\f\n\r\t\0\u2028\u2029\\]/g, (x) => escapes[x]);
  };
})();

// src/adloader.js
var _requestCache = /* @__PURE__ */ new WeakMap();
var _approvedLoadExternalJSList = [
  "debugging",
  "adloox",
  "criteo",
  "outstream",
  "adagio",
  "spotx",
  "browsi",
  "brandmetrics",
  "justtag",
  "tncId",
  "akamaidap",
  "ftrackId",
  "inskin",
  "hadron",
  "medianet",
  "improvedigital",
  "aaxBlockmeter",
  "confiant",
  "arcspan"
];
function loadExternalScript(url, moduleCode2, callback, doc, attributes) {
  if (!moduleCode2 || !url) {
    logError("cannot load external script without url and moduleCode");
    return;
  }
  if (!includes(_approvedLoadExternalJSList, moduleCode2)) {
    logError(`${moduleCode2} not whitelisted for loading external JavaScript`);
    return;
  }
  if (!doc) {
    doc = document;
  }
  const storedCachedObject = getCacheObject(doc, url);
  if (storedCachedObject) {
    if (callback && typeof callback === "function") {
      if (storedCachedObject.loaded) {
        callback();
      } else {
        storedCachedObject.callbacks.push(callback);
      }
    }
    return storedCachedObject.tag;
  }
  const cachedDocObj = _requestCache.get(doc) || {};
  const cacheObject = {
    loaded: false,
    tag: null,
    callbacks: []
  };
  cachedDocObj[url] = cacheObject;
  _requestCache.set(doc, cachedDocObj);
  if (callback && typeof callback === "function") {
    cacheObject.callbacks.push(callback);
  }
  logWarn(`module ${moduleCode2} is loading external JavaScript`);
  return requestResource(url, function() {
    cacheObject.loaded = true;
    try {
      for (let i = 0; i < cacheObject.callbacks.length; i++) {
        cacheObject.callbacks[i]();
      }
    } catch (e) {
      logError("Error executing callback", "adloader.js:loadExternalScript", e);
    }
  }, doc, attributes);
  function requestResource(tagSrc, callback2, doc2, attributes2) {
    if (!doc2) {
      doc2 = document;
    }
    var jptScript = doc2.createElement("script");
    jptScript.type = "text/javascript";
    jptScript.async = true;
    const cacheObject2 = getCacheObject(doc2, url);
    if (cacheObject2) {
      cacheObject2.tag = jptScript;
    }
    if (jptScript.readyState) {
      jptScript.onreadystatechange = function() {
        if (jptScript.readyState === "loaded" || jptScript.readyState === "complete") {
          jptScript.onreadystatechange = null;
          callback2();
        }
      };
    } else {
      jptScript.onload = function() {
        callback2();
      };
    }
    jptScript.src = tagSrc;
    if (attributes2) {
      setScriptAttributes(jptScript, attributes2);
    }
    insertElement(jptScript, doc2);
    return jptScript;
  }
  function getCacheObject(doc2, url2) {
    const cachedDocObj2 = _requestCache.get(doc2);
    if (cachedDocObj2 && cachedDocObj2[url2]) {
      return cachedDocObj2[url2];
    }
    return null;
  }
}

// src/Renderer.js
var pbjsInstance2 = getGlobal();
var moduleCode = "outstream";
function Renderer(options) {
  const { url, config: config2, id, callback, loaded, adUnitCode, renderNow } = options;
  this.url = url;
  this.config = config2;
  this.handlers = {};
  this.id = id;
  this.renderNow = renderNow;
  this.loaded = loaded;
  this.cmd = [];
  this.push = (func) => {
    if (typeof func !== "function") {
      logError("Commands given to Renderer.push must be wrapped in a function");
      return;
    }
    this.loaded ? func.call() : this.cmd.push(func);
  };
  this.callback = callback || (() => {
    this.loaded = true;
    this.process();
  });
  this.render = function() {
    const renderArgs = arguments;
    const runRender = () => {
      if (this._render) {
        this._render.apply(this, renderArgs);
      } else {
        logWarn(`No render function was provided, please use .setRender on the renderer`);
      }
    };
    if (isRendererPreferredFromAdUnit(adUnitCode)) {
      logWarn(`External Js not loaded by Renderer since renderer url and callback is already defined on adUnit ${adUnitCode}`);
      runRender();
    } else if (renderNow) {
      runRender();
    } else {
      this.cmd.unshift(runRender);
      loadExternalScript(url, moduleCode, this.callback, this.documentContext);
    }
  }.bind(this);
}
Renderer.install = function({ url, config: config2, id, callback, loaded, adUnitCode, renderNow }) {
  return new Renderer({ url, config: config2, id, callback, loaded, adUnitCode, renderNow });
};
Renderer.prototype.getConfig = function() {
  return this.config;
};
Renderer.prototype.setRender = function(fn) {
  this._render = fn;
};
Renderer.prototype.setEventHandlers = function(handlers) {
  this.handlers = handlers;
};
Renderer.prototype.handleVideoEvent = function({ id, eventName }) {
  if (typeof this.handlers[eventName] === "function") {
    this.handlers[eventName]();
  }
  logMessage(`Prebid Renderer event for id ${id} type ${eventName}`);
};
Renderer.prototype.process = function() {
  while (this.cmd.length > 0) {
    try {
      this.cmd.shift().call();
    } catch (error) {
      logError("Error processing Renderer command: ", error);
    }
  }
};
function isRendererPreferredFromAdUnit(adUnitCode) {
  const adUnits2 = pbjsInstance2.adUnits;
  const adUnit = find(adUnits2, (adUnit2) => {
    return adUnit2.code === adUnitCode;
  });
  if (!adUnit) {
    return false;
  }
  const adUnitRenderer = dlv(adUnit, "renderer");
  const hasValidAdUnitRenderer = !!(adUnitRenderer && adUnitRenderer.url && adUnitRenderer.render);
  const mediaTypeRenderer = dlv(adUnit, "mediaTypes.video.renderer");
  const hasValidMediaTypeRenderer = !!(mediaTypeRenderer && mediaTypeRenderer.url && mediaTypeRenderer.render);
  return !!(hasValidAdUnitRenderer && !(adUnitRenderer.backupOnly === true) || hasValidMediaTypeRenderer && !(mediaTypeRenderer.backupOnly === true));
}

// src/adapter.js
function Adapter(code) {
  var bidderCode = code;
  function setBidderCode(code2) {
    bidderCode = code2;
  }
  function getBidderCode() {
    return bidderCode;
  }
  function callBids() {
  }
  return {
    callBids,
    setBidderCode,
    getBidderCode
  };
}

// src/mediaTypes.js
var NATIVE = "native";
var VIDEO = "video";
var BANNER = "banner";
var ADPOD = "adpod";

// src/sizeMapping.js
var sizeConfig = [];
function setSizeConfig(config2) {
  sizeConfig = config2;
}
config.getConfig("sizeConfig", (config2) => setSizeConfig(config2.sizeConfig));
function getLabels(bidOrAdUnit, activeLabels) {
  if (bidOrAdUnit.labelAll) {
    return { labelAll: true, labels: bidOrAdUnit.labelAll, activeLabels };
  }
  return { labelAll: false, labels: bidOrAdUnit.labelAny, activeLabels };
}
function resolveStatus({ labels = [], labelAll = false, activeLabels = [] } = {}, mediaTypes, sizes, configs = sizeConfig) {
  let maps = evaluateSizeConfig(configs);
  if (!isPlainObject(mediaTypes)) {
    if (sizes) {
      mediaTypes = {
        banner: {
          sizes
        }
      };
    } else {
      mediaTypes = {};
    }
  }
  let oldSizes = dlv(mediaTypes, "banner.sizes");
  if (maps.shouldFilter && oldSizes) {
    mediaTypes = deepClone(mediaTypes);
    mediaTypes.banner.sizes = oldSizes.filter((size) => maps.sizesSupported[size]);
  }
  let results = {
    active: !mediaTypes.hasOwnProperty(BANNER) || dlv(mediaTypes, "banner.sizes.length") > 0 && (labels.length === 0 || (!labelAll && (labels.some((label) => maps.labels[label]) || labels.some((label) => includes(activeLabels, label))) || labelAll && labels.reduce((result, label) => !result ? result : maps.labels[label] || includes(activeLabels, label), true))),
    mediaTypes
  };
  if (oldSizes && oldSizes.length !== mediaTypes.banner.sizes.length) {
    results.filterResults = {
      before: oldSizes,
      after: mediaTypes.banner.sizes
    };
  }
  return results;
}
function evaluateSizeConfig(configs) {
  return configs.reduce((results, config2) => {
    if (typeof config2 === "object" && typeof config2.mediaQuery === "string" && config2.mediaQuery.length > 0) {
      let ruleMatch = false;
      try {
        ruleMatch = getWindowTop().matchMedia(config2.mediaQuery).matches;
      } catch (e) {
        logWarn("Unfriendly iFrame blocks sizeConfig from being correctly evaluated");
        ruleMatch = matchMedia(config2.mediaQuery).matches;
      }
      if (ruleMatch) {
        if (Array.isArray(config2.sizesSupported)) {
          results.shouldFilter = true;
        }
        ["labels", "sizesSupported"].forEach(
          (type) => (config2[type] || []).forEach(
            (thing) => results[type][thing] = true
          )
        );
      }
    } else {
      logWarn('sizeConfig rule missing required property "mediaQuery"');
    }
    return results;
  }, {
    labels: {},
    sizesSupported: {},
    shouldFilter: false
  });
}
function processAdUnitsForLabels(adUnits2, activeLabels) {
  return adUnits2.reduce((adUnits3, adUnit) => {
    let {
      active,
      mediaTypes,
      filterResults
    } = resolveStatus(
      getLabels(adUnit, activeLabels),
      adUnit.mediaTypes,
      adUnit.sizes
    );
    if (!active) {
      logInfo(`Size mapping disabled adUnit "${adUnit.code}"`);
    } else {
      if (filterResults) {
        logInfo(`Size mapping filtered adUnit "${adUnit.code}" banner sizes from `, filterResults.before, "to ", filterResults.after);
      }
      adUnit.mediaTypes = mediaTypes;
      adUnit.bids = adUnit.bids.reduce((bids, bid) => {
        let {
          active: active2,
          mediaTypes: mediaTypes2,
          filterResults: filterResults2
        } = resolveStatus(getLabels(bid, activeLabels), adUnit.mediaTypes);
        if (!active2) {
          logInfo(`Size mapping deactivated adUnit "${adUnit.code}" bidder "${bid.bidder}"`);
        } else {
          if (filterResults2) {
            logInfo(`Size mapping filtered adUnit "${adUnit.code}" bidder "${bid.bidder}" banner sizes from `, filterResults2.before, "to ", filterResults2.after);
            bid.mediaTypes = mediaTypes2;
          }
          bids.push(bid);
        }
        return bids;
      }, []);
      adUnits3.push(adUnit);
    }
    return adUnits3;
  }, []);
}

// src/ajax.js
var XHR_DONE = 4;
var ajax = ajaxBuilder();
function ajaxBuilder(timeout = 3e3, { request, done } = {}) {
  return function(url, callback, data, options = {}) {
    try {
      let x;
      let method = options.method || (data ? "POST" : "GET");
      let parser = document.createElement("a");
      parser.href = url;
      let callbacks = typeof callback === "object" && callback !== null ? callback : {
        success: function() {
          logMessage("xhr success");
        },
        error: function(e) {
          logError("xhr error", null, e);
        }
      };
      if (typeof callback === "function") {
        callbacks.success = callback;
      }
      x = new window.XMLHttpRequest();
      x.onreadystatechange = function() {
        if (x.readyState === XHR_DONE) {
          if (typeof done === "function") {
            done(parser.origin);
          }
          let status = x.status;
          if (status >= 200 && status < 300 || status === 304) {
            callbacks.success(x.responseText, x);
          } else {
            callbacks.error(x.statusText, x);
          }
        }
      };
      if (!config.getConfig("disableAjaxTimeout")) {
        x.ontimeout = function() {
          logError("  xhr timeout after ", x.timeout, "ms");
        };
      }
      if (method === "GET" && data) {
        let urlInfo = parseUrl(url, options);
        Object.assign(urlInfo.search, data);
        url = buildUrl(urlInfo);
      }
      x.open(method, url, true);
      if (!config.getConfig("disableAjaxTimeout")) {
        x.timeout = timeout;
      }
      if (options.withCredentials) {
        x.withCredentials = true;
      }
      _each(options.customHeaders, (value, header) => {
        x.setRequestHeader(header, value);
      });
      if (options.preflight) {
        x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      }
      x.setRequestHeader("Content-Type", options.contentType || "text/plain");
      if (typeof request === "function") {
        request(parser.origin);
      }
      if (method === "POST" && data) {
        x.send(data);
      } else {
        x.send();
      }
    } catch (error) {
      logError("xhr construction", error);
      typeof callback === "object" && callback !== null && callback.error(error);
    }
  };
}

// src/videoCache.js
var ttlBufferInSeconds = 15;
function wrapURI(uri, impUrl) {
  let vastImp = impUrl ? `<![CDATA[${impUrl}]]>` : ``;
  return `<VAST version="3.0">
    <Ad>
      <Wrapper>
        <AdSystem>prebid.org wrapper</AdSystem>
        <VASTAdTagURI><![CDATA[${uri}]]></VASTAdTagURI>
        <Impression>${vastImp}</Impression>
        <Creatives></Creatives>
      </Wrapper>
    </Ad>
  </VAST>`;
}
function toStorageRequest(bid, { index = auctionManager.index } = {}) {
  const vastValue = bid.vastXml ? bid.vastXml : wrapURI(bid.vastUrl, bid.vastImpUrl);
  const auction = index.getAuction(bid);
  const ttlWithBuffer = Number(bid.ttl) + ttlBufferInSeconds;
  let payload = {
    type: "xml",
    value: vastValue,
    ttlseconds: ttlWithBuffer
  };
  if (config.getConfig("cache.vasttrack")) {
    payload.bidder = bid.bidder;
    payload.bidid = bid.requestId;
    payload.aid = bid.auctionId;
  }
  if (auction != null) {
    payload.timestamp = auction.getAuctionStart();
  }
  if (typeof bid.customCacheKey === "string" && bid.customCacheKey !== "") {
    payload.key = bid.customCacheKey;
  }
  return payload;
}
function shimStorageCallback(done) {
  return {
    success: function(responseBody) {
      let ids;
      try {
        ids = JSON.parse(responseBody).responses;
      } catch (e) {
        done(e, []);
        return;
      }
      if (ids) {
        done(null, ids);
      } else {
        done(new Error("The cache server didn't respond with a responses property."), []);
      }
    },
    error: function(statusText, responseBody) {
      done(new Error(`Error storing video ad in the cache: ${statusText}: ${JSON.stringify(responseBody)}`), []);
    }
  };
}
function store(bids, done, getAjax = ajaxBuilder) {
  const requestData = {
    puts: bids.map(toStorageRequest)
  };
  const ajax2 = getAjax(config.getConfig("cache.timeout"));
  ajax2(config.getConfig("cache.url"), shimStorageCallback(done), JSON.stringify(requestData), {
    contentType: "text/plain",
    withCredentials: true
  });
}
function getCacheUrl(id) {
  return `${config.getConfig("cache.url")}?uuid=${id}`;
}

// src/hook.js
var import_no_eval = __toESM(require_no_eval(), 1);
var hook = (0, import_no_eval.default)({
  ready: import_no_eval.default.SYNC | import_no_eval.default.ASYNC | import_no_eval.default.QUEUE
});
var readyCtl = defer();
hook.ready = (() => {
  const ready2 = hook.ready;
  return function() {
    try {
      return ready2.apply(hook, arguments);
    } finally {
      readyCtl.resolve();
    }
  };
})();
var ready = readyCtl.promise;
var getHook = hook.get;

// src/bidderSettings.js
var ScopedSettings = class {
  constructor(getSettings, defaultScope) {
    this.getSettings = getSettings;
    this.defaultScope = defaultScope;
  }
  /**
   * Get setting value at `path` under the given scope, falling back to the default scope if needed.
   * If `scope` is `null`, get the setting's default value.
   * @param scope {String|null}
   * @param path {String}
   * @returns {*}
   */
  get(scope2, path) {
    let value = this.getOwn(scope2, path);
    if (typeof value === "undefined") {
      value = this.getOwn(null, path);
    }
    return value;
  }
  /**
   * Get the setting value at `path` *without* falling back to the default value.
   * @param scope {String}
   * @param path {String}
   * @returns {*}
   */
  getOwn(scope2, path) {
    scope2 = this.#resolveScope(scope2);
    return dlv(this.getSettings(), `${scope2}.${path}`);
  }
  /**
   * @returns {string[]} all existing scopes except the default one.
   */
  getScopes() {
    return Object.keys(this.getSettings()).filter((scope2) => scope2 !== this.defaultScope);
  }
  /**
   * @returns all settings in the given scope, merged with the settings for the default scope.
   */
  settingsFor(scope2) {
    return mergeDeep({}, this.ownSettingsFor(null), this.ownSettingsFor(scope2));
  }
  /**
   * @returns all settings in the given scope, *without* any of the default settings.
   */
  ownSettingsFor(scope2) {
    scope2 = this.#resolveScope(scope2);
    return this.getSettings()[scope2] || {};
  }
  #resolveScope(scope2) {
    if (scope2 == null) {
      return this.defaultScope;
    } else {
      return scope2;
    }
  }
};
var bidderSettings = new ScopedSettings(() => getGlobal().bidderSettings || {}, constants_default.JSON_MAPPING.BD_SETTING_STANDARD);

// src/activities/modules.js
var MODULE_TYPE_CORE = "core";
var MODULE_TYPE_BIDDER = "bidder";
var MODULE_TYPE_ANALYTICS = "analytics";

// src/storageManager.js
var STORAGE_TYPE_LOCALSTORAGE = "html5";
var STORAGE_TYPE_COOKIES = "cookie";
var storageCallbacks = [];
function newStorageManager({ moduleName, moduleType } = {}, { bidderSettings: bidderSettings2 = bidderSettings } = {}) {
  function isBidderAllowed(storageType) {
    if (moduleType !== MODULE_TYPE_BIDDER) {
      return true;
    }
    const storageAllowed = bidderSettings2.get(moduleName, "storageAllowed");
    if (!storageAllowed || storageAllowed === true)
      return !!storageAllowed;
    if (Array.isArray(storageAllowed))
      return storageAllowed.some((e) => e === storageType);
    return storageAllowed === storageType;
  }
  function isValid2(cb, storageType) {
    if (!isBidderAllowed(storageType)) {
      logInfo(`bidderSettings denied access to device storage for bidder '${moduleName}'`);
      const result = { valid: false };
      return cb(result);
    } else {
      let value;
      let hookDetails = {
        hasEnforcementHook: false
      };
      validateStorageEnforcement(moduleType, moduleName, hookDetails, function(result) {
        if (result && result.hasEnforcementHook) {
          value = cb(result);
        } else {
          let result2 = {
            hasEnforcementHook: false,
            valid: hasDeviceAccess()
          };
          value = cb(result2);
        }
      });
      return value;
    }
  }
  function schedule(operation, storageType, done) {
    if (done && typeof done === "function") {
      storageCallbacks.push(function() {
        let result = isValid2(operation, storageType);
        done(result);
      });
    } else {
      return isValid2(operation, storageType);
    }
  }
  const setCookie = function(key, value, expires, sameSite, domain, done) {
    let cb = function(result) {
      if (result && result.valid) {
        const domainPortion = domain && domain !== "" ? ` ;domain=${encodeURIComponent(domain)}` : "";
        const expiresPortion = expires && expires !== "" ? ` ;expires=${expires}` : "";
        const isNone = sameSite != null && sameSite.toLowerCase() == "none";
        const secure = isNone ? "; Secure" : "";
        document.cookie = `${key}=${encodeURIComponent(value)}${expiresPortion}; path=/${domainPortion}${sameSite ? `; SameSite=${sameSite}` : ""}${secure}`;
      }
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, done);
  };
  const getCookie = function(name, done) {
    let cb = function(result) {
      if (result && result.valid) {
        let m = window.document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]*)\\s*(;|$)");
        return m ? decodeURIComponent(m[2]) : null;
      }
      return null;
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, done);
  };
  const localStorageIsEnabled = function(done) {
    let cb = function(result) {
      if (result && result.valid) {
        try {
          localStorage.setItem("prebid.cookieTest", "1");
          return localStorage.getItem("prebid.cookieTest") === "1";
        } catch (error) {
        } finally {
          try {
            localStorage.removeItem("prebid.cookieTest");
          } catch (error) {
          }
        }
      }
      return false;
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };
  const cookiesAreEnabled = function(done) {
    let cb = function(result) {
      if (result && result.valid) {
        return checkCookieSupport();
      }
      return false;
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, done);
  };
  const setDataInLocalStorage = function(key, value, done) {
    let cb = function(result) {
      if (result && result.valid && hasLocalStorage()) {
        window.localStorage.setItem(key, value);
      }
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };
  const getDataFromLocalStorage = function(key, done) {
    let cb = function(result) {
      if (result && result.valid && hasLocalStorage()) {
        return window.localStorage.getItem(key);
      }
      return null;
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };
  const removeDataFromLocalStorage = function(key, done) {
    let cb = function(result) {
      if (result && result.valid && hasLocalStorage()) {
        window.localStorage.removeItem(key);
      }
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };
  const hasLocalStorage = function(done) {
    let cb = function(result) {
      if (result && result.valid) {
        try {
          return !!window.localStorage;
        } catch (e) {
          logError("Local storage api disabled");
        }
      }
      return false;
    };
    return schedule(cb, STORAGE_TYPE_LOCALSTORAGE, done);
  };
  const findSimilarCookies = function(keyLike, done) {
    let cb = function(result) {
      if (result && result.valid) {
        const all = [];
        if (hasDeviceAccess()) {
          const cookies = document.cookie.split(";");
          while (cookies.length) {
            const cookie = cookies.pop();
            let separatorIndex = cookie.indexOf("=");
            separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;
            const cookieName = decodeURIComponent(cookie.slice(0, separatorIndex).replace(/^\s+/, ""));
            if (cookieName.indexOf(keyLike) >= 0) {
              all.push(decodeURIComponent(cookie.slice(separatorIndex + 1)));
            }
          }
        }
        return all;
      }
    };
    return schedule(cb, STORAGE_TYPE_COOKIES, done);
  };
  return {
    setCookie,
    getCookie,
    localStorageIsEnabled,
    cookiesAreEnabled,
    setDataInLocalStorage,
    getDataFromLocalStorage,
    removeDataFromLocalStorage,
    hasLocalStorage,
    findSimilarCookies
  };
}
var validateStorageEnforcement = hook("async", function(moduleType, moduleName, hookDetails, callback) {
  callback(hookDetails);
}, "validateStorageEnforcement");
function getStorageManager({ moduleType, moduleName, bidderCode } = {}) {
  function err() {
    throw new Error(`Invalid invocation for getStorageManager: must set either bidderCode, or moduleType + moduleName`);
  }
  if (bidderCode) {
    if (moduleType && moduleType !== MODULE_TYPE_BIDDER || moduleName)
      err();
    moduleType = MODULE_TYPE_BIDDER;
    moduleName = bidderCode;
  } else if (!moduleName || !moduleType) {
    err();
  }
  return newStorageManager({ moduleType, moduleName });
}
function getCoreStorageManager(moduleName) {
  return newStorageManager({ moduleName, moduleType: MODULE_TYPE_CORE });
}

// src/userSync.js
var USERSYNC_DEFAULT_CONFIG = {
  syncEnabled: true,
  filterSettings: {
    image: {
      bidders: "*",
      filter: "include"
    }
  },
  syncsPerBidder: 5,
  syncDelay: 3e3,
  auctionDelay: 0
};
config.setDefaults({
  "userSync": deepClone(USERSYNC_DEFAULT_CONFIG)
});
var storage = getCoreStorageManager("usersync");
function newUserSync(userSyncDependencies) {
  let publicApi = {};
  let queue = getDefaultQueue();
  let hasFiredBidder = /* @__PURE__ */ new Set();
  let numAdapterBids = {};
  let permittedPixels = {
    image: true,
    iframe: false
  };
  let usConfig = userSyncDependencies.config;
  config.getConfig("userSync", (conf) => {
    if (conf.userSync) {
      let fs = conf.userSync.filterSettings;
      if (isPlainObject(fs)) {
        if (!fs.image && !fs.all) {
          conf.userSync.filterSettings.image = {
            bidders: "*",
            filter: "include"
          };
        }
      }
    }
    usConfig = Object.assign(usConfig, conf.userSync);
  });
  function getDefaultQueue() {
    return {
      image: [],
      iframe: []
    };
  }
  function fireSyncs() {
    if (!usConfig.syncEnabled || !userSyncDependencies.browserSupportsCookies) {
      return;
    }
    try {
      loadIframes();
      fireImagePixels();
    } catch (e) {
      return logError("Error firing user syncs", e);
    }
    queue = getDefaultQueue();
  }
  function forEachFire(queue2, fn) {
    shuffle(queue2).forEach(fn);
  }
  function fireImagePixels() {
    if (!permittedPixels.image) {
      return;
    }
    forEachFire(queue.image, (sync) => {
      let [bidderName, trackingPixelUrl] = sync;
      logMessage(`Invoking image pixel user sync for bidder: ${bidderName}`);
      triggerPixel(trackingPixelUrl);
    });
  }
  function loadIframes() {
    if (!permittedPixels.iframe) {
      return;
    }
    forEachFire(queue.iframe, (sync) => {
      let [bidderName, iframeUrl] = sync;
      logMessage(`Invoking iframe user sync for bidder: ${bidderName}`);
      insertUserSyncIframe(iframeUrl);
      removeImagePixelsForBidder(queue, bidderName);
    });
  }
  function removeImagePixelsForBidder(queue2, iframeSyncBidderName) {
    queue2.image = queue2.image.filter((imageSync) => {
      let imageSyncBidderName = imageSync[0];
      return imageSyncBidderName !== iframeSyncBidderName;
    });
  }
  function incrementAdapterBids(numAdapterBids2, bidder) {
    if (!numAdapterBids2[bidder]) {
      numAdapterBids2[bidder] = 1;
    } else {
      numAdapterBids2[bidder] += 1;
    }
    return numAdapterBids2;
  }
  publicApi.registerSync = (type, bidder, url) => {
    if (hasFiredBidder.has(bidder)) {
      return logMessage(`already fired syncs for "${bidder}", ignoring registerSync call`);
    }
    if (!usConfig.syncEnabled || !isArray(queue[type])) {
      return logWarn(`User sync type "${type}" not supported`);
    }
    if (!bidder) {
      return logWarn(`Bidder is required for registering sync`);
    }
    if (usConfig.syncsPerBidder !== 0 && Number(numAdapterBids[bidder]) >= usConfig.syncsPerBidder) {
      return logWarn(`Number of user syncs exceeded for "${bidder}"`);
    }
    const canBidderRegisterSync = publicApi.canBidderRegisterSync(type, bidder);
    if (!canBidderRegisterSync) {
      return logWarn(`Bidder "${bidder}" not permitted to register their "${type}" userSync pixels.`);
    }
    queue[type].push([bidder, url]);
    numAdapterBids = incrementAdapterBids(numAdapterBids, bidder);
  };
  publicApi.bidderDone = hasFiredBidder.add.bind(hasFiredBidder);
  function shouldBidderBeBlocked(type, bidder) {
    let filterConfig = usConfig.filterSettings;
    if (isFilterConfigValid(filterConfig, type)) {
      permittedPixels[type] = true;
      let activeConfig = filterConfig.all ? filterConfig.all : filterConfig[type];
      let biddersToFilter = activeConfig.bidders === "*" ? [bidder] : activeConfig.bidders;
      let filterType = activeConfig.filter || "include";
      const checkForFiltering = {
        "include": (bidders, bidder2) => !includes(bidders, bidder2),
        "exclude": (bidders, bidder2) => includes(bidders, bidder2)
      };
      return checkForFiltering[filterType](biddersToFilter, bidder);
    }
    return !permittedPixels[type];
  }
  function isFilterConfigValid(filterConfig, type) {
    if (filterConfig.all && filterConfig[type]) {
      logWarn(`Detected presence of the "filterSettings.all" and "filterSettings.${type}" in userSync config.  You cannot mix "all" with "iframe/image" configs; they are mutually exclusive.`);
      return false;
    }
    let activeConfig = filterConfig.all ? filterConfig.all : filterConfig[type];
    let activeConfigName = filterConfig.all ? "all" : type;
    if (!activeConfig) {
      return false;
    }
    let filterField = activeConfig.filter;
    let biddersField = activeConfig.bidders;
    if (filterField && filterField !== "include" && filterField !== "exclude") {
      logWarn(`UserSync "filterSettings.${activeConfigName}.filter" setting '${filterField}' is not a valid option; use either 'include' or 'exclude'.`);
      return false;
    }
    if (biddersField !== "*" && !(Array.isArray(biddersField) && biddersField.length > 0 && biddersField.every((bidderInList) => isStr(bidderInList) && bidderInList !== "*"))) {
      logWarn(`Detected an invalid setup in userSync "filterSettings.${activeConfigName}.bidders"; use either '*' (to represent all bidders) or an array of bidders.`);
      return false;
    }
    return true;
  }
  publicApi.syncUsers = (timeout = 0) => {
    if (timeout) {
      return setTimeout(fireSyncs, Number(timeout));
    }
    fireSyncs();
  };
  publicApi.triggerUserSyncs = () => {
    if (usConfig.enableOverride) {
      publicApi.syncUsers();
    }
  };
  publicApi.canBidderRegisterSync = (type, bidder) => {
    if (usConfig.filterSettings) {
      if (shouldBidderBeBlocked(type, bidder)) {
        return false;
      }
    }
    return true;
  };
  return publicApi;
}
var userSync = newUserSync(Object.defineProperties({
  config: config.getConfig("userSync")
}, {
  browserSupportsCookies: {
    get: function() {
      return !isSafariBrowser() && storage.cookiesAreEnabled();
    }
  }
}));

// src/video.js
var OUTSTREAM = "outstream";
var INSTREAM = "instream";
function isValidVideoBid(bid, { index = auctionManager.index } = {}) {
  const videoMediaType = dlv(index.getMediaTypes(bid), "video");
  const context = videoMediaType && dlv(videoMediaType, "context");
  const useCacheKey = videoMediaType && dlv(videoMediaType, "useCacheKey");
  const adUnit = index.getAdUnit(bid);
  return checkVideoBidSetup(bid, adUnit, videoMediaType, context, useCacheKey);
}
var checkVideoBidSetup = hook("sync", function(bid, adUnit, videoMediaType, context, useCacheKey) {
  if (videoMediaType && (useCacheKey || context !== OUTSTREAM)) {
    if (!config.getConfig("cache.url") && bid.vastXml && !bid.vastUrl) {
      logError(`
        This bid contains only vastXml and will not work when a prebid cache url is not specified.
        Try enabling prebid cache with $$PREBID_GLOBAL$$.setConfig({ cache: {url: "..."} });
      `);
      return false;
    }
    return !!(bid.vastUrl || bid.vastXml);
  }
  if (context === OUTSTREAM && !useCacheKey) {
    return !!(bid.renderer || adUnit && adUnit.renderer || videoMediaType.renderer);
  }
  return true;
}, "checkVideoBidSetup");

// src/events.js
var slice = Array.prototype.slice;
var push = Array.prototype.push;
var allEvents = _map(constants_default.EVENTS, function(v) {
  return v;
});
var idPaths = constants_default.EVENT_ID_PATHS;
var eventsFired = [];
var _public = function() {
  var _handlers = {};
  var _public2 = {};
  function _dispatch(eventString, args) {
    logMessage("Emitting event for: " + eventString);
    var eventPayload = args[0] || {};
    var idPath = idPaths[eventString];
    var key = eventPayload[idPath];
    var event = _handlers[eventString] || { que: [] };
    var eventKeys = _map(event, function(v, k) {
      return k;
    });
    var callbacks = [];
    eventsFired.push({
      eventType: eventString,
      args: eventPayload,
      id: key,
      elapsedTime: getPerformanceNow()
    });
    if (key && contains(eventKeys, key)) {
      push.apply(callbacks, event[key].que);
    }
    push.apply(callbacks, event.que);
    _each(callbacks, function(fn) {
      if (!fn)
        return;
      try {
        fn.apply(null, args);
      } catch (e) {
        logError("Error executing handler:", "events.js", e);
      }
    });
  }
  function _checkAvailableEvent(event) {
    return contains(allEvents, event);
  }
  _public2.on = function(eventString, handler, id) {
    if (_checkAvailableEvent(eventString)) {
      var event = _handlers[eventString] || { que: [] };
      if (id) {
        event[id] = event[id] || { que: [] };
        event[id].que.push(handler);
      } else {
        event.que.push(handler);
      }
      _handlers[eventString] = event;
    } else {
      logError("Wrong event name : " + eventString + " Valid event names :" + allEvents);
    }
  };
  _public2.emit = function(event) {
    var args = slice.call(arguments, 1);
    _dispatch(event, args);
  };
  _public2.off = function(eventString, handler, id) {
    var event = _handlers[eventString];
    if (isEmpty(event) || isEmpty(event.que) && isEmpty(event[id])) {
      return;
    }
    if (id && (isEmpty(event[id]) || isEmpty(event[id].que))) {
      return;
    }
    if (id) {
      _each(event[id].que, function(_handler) {
        var que = event[id].que;
        if (_handler === handler) {
          que.splice(que.indexOf(_handler), 1);
        }
      });
    } else {
      _each(event.que, function(_handler) {
        var que = event.que;
        if (_handler === handler) {
          que.splice(que.indexOf(_handler), 1);
        }
      });
    }
    _handlers[eventString] = event;
  };
  _public2.get = function() {
    return _handlers;
  };
  _public2.addEvents = function(events) {
    allEvents = allEvents.concat(events);
  };
  _public2.getEvents = function() {
    var arrayCopy = [];
    _each(eventsFired, function(value) {
      var newProp = Object.assign({}, value);
      arrayCopy.push(newProp);
    });
    return arrayCopy;
  };
  return _public2;
}();
_setEventEmitter(_public.emit.bind(_public));
var { on, off, get, getEvents, emit, addEvents } = _public;

// src/utils/perfMetrics.js
var CONFIG_TOGGLE = "performanceMetrics";
var getTime = window.performance && window.performance.now ? () => window.performance.now() : () => Date.now();
var NODES = /* @__PURE__ */ new WeakMap();
function metricsFactory({ now = getTime, mkNode = makeNode, mkTimer = makeTimer, mkRenamer = (rename) => rename, nodes = NODES } = {}) {
  return function newMetrics2() {
    function makeMetrics(self, rename = (n) => ({ forEach(fn) {
      fn(n);
    } })) {
      rename = mkRenamer(rename);
      function accessor(slot) {
        return function(name) {
          return self.dfWalk({
            visit(edge, node) {
              const obj = node[slot];
              if (obj.hasOwnProperty(name)) {
                return obj[name];
              }
            }
          });
        };
      }
      const getTimestamp = accessor("timestamps");
      function setMetric(name, value) {
        const names = rename(name);
        self.dfWalk({
          follow(inEdge, outEdge) {
            return outEdge.propagate && (!inEdge || !inEdge.stopPropagation);
          },
          visit(edge, node) {
            names.forEach((name2) => {
              if (edge == null) {
                node.metrics[name2] = value;
              } else {
                if (!node.groups.hasOwnProperty(name2)) {
                  node.groups[name2] = [];
                }
                node.groups[name2].push(value);
              }
            });
          }
        });
      }
      function checkpoint(name) {
        self.timestamps[name] = now();
      }
      function timeSince(checkpoint2, metric) {
        const ts = getTimestamp(checkpoint2);
        const elapsed = ts != null ? now() - ts : null;
        if (metric != null) {
          setMetric(metric, elapsed);
        }
        return elapsed;
      }
      function timeBetween(startCheckpoint, endCheckpoint, metric) {
        const start = getTimestamp(startCheckpoint);
        const end = getTimestamp(endCheckpoint);
        const elapsed = start != null && end != null ? end - start : null;
        if (metric != null) {
          setMetric(metric, elapsed);
        }
        return elapsed;
      }
      function startTiming(name) {
        return mkTimer(now, (val) => setMetric(name, val));
      }
      function measureTime(name, fn) {
        return startTiming(name).stopAfter(fn)();
      }
      function measureHookTime(name, next, fn) {
        const stopTiming = startTiming(name);
        return fn(function(orig) {
          const next2 = stopTiming.stopBefore(orig);
          next2.bail = orig.bail && stopTiming.stopBefore(orig.bail);
          next2.stopTiming = stopTiming;
          next2.untimed = orig;
          return next2;
        }(next));
      }
      function getMetrics() {
        let result = {};
        self.dfWalk({
          visit(edge, node) {
            result = Object.assign({}, !edge || edge.includeGroups ? node.groups : null, node.metrics, result);
          }
        });
        return result;
      }
      function fork({ propagate = true, stopPropagation = false, includeGroups = false } = {}) {
        return makeMetrics(mkNode([[self, { propagate, stopPropagation, includeGroups }]]), rename);
      }
      function join(otherMetrics, { propagate = true, stopPropagation = false, includeGroups = false } = {}) {
        const other = nodes.get(otherMetrics);
        if (other != null) {
          other.addParent(self, { propagate, stopPropagation, includeGroups });
        }
      }
      function renameWith(renameFn) {
        return makeMetrics(self, renameFn);
      }
      function newMetrics3() {
        return makeMetrics(self.newSibling(), rename);
      }
      const metrics = {
        startTiming,
        measureTime,
        measureHookTime,
        checkpoint,
        timeSince,
        timeBetween,
        setMetric,
        getMetrics,
        fork,
        join,
        newMetrics: newMetrics3,
        renameWith,
        toJSON() {
          return getMetrics();
        }
      };
      nodes.set(metrics, self);
      return metrics;
    }
    return makeMetrics(mkNode([]));
  };
}
function wrapFn(fn, before, after) {
  return function() {
    before && before();
    try {
      return fn.apply(this, arguments);
    } finally {
      after && after();
    }
  };
}
function makeTimer(now, cb) {
  const start = now();
  let done = false;
  function stopTiming() {
    if (!done) {
      cb(now() - start);
      done = true;
    }
  }
  stopTiming.stopBefore = (fn) => wrapFn(fn, stopTiming);
  stopTiming.stopAfter = (fn) => wrapFn(fn, null, stopTiming);
  return stopTiming;
}
function makeNode(parents) {
  return {
    metrics: {},
    timestamps: {},
    groups: {},
    addParent(node, edge) {
      parents.push([node, edge]);
    },
    newSibling() {
      return makeNode(parents.slice());
    },
    dfWalk({ visit, follow = () => true, visited = /* @__PURE__ */ new Set(), inEdge } = {}) {
      let res;
      if (!visited.has(this)) {
        visited.add(this);
        res = visit(inEdge, this);
        if (res != null)
          return res;
        for (const [parent, outEdge] of parents) {
          if (follow(inEdge, outEdge)) {
            res = parent.dfWalk({ visit, follow, visited, inEdge: outEdge });
            if (res != null)
              return res;
          }
        }
      }
    }
  };
}
var nullMetrics = (() => {
  const nop = function() {
  };
  const empty = () => ({});
  const none = { forEach: nop };
  const nullTimer = () => null;
  nullTimer.stopBefore = (fn) => fn;
  nullTimer.stopAfter = (fn) => fn;
  const nullNode = Object.defineProperties(
    { dfWalk: nop, newSibling: () => nullNode, addParent: nop },
    Object.fromEntries(["metrics", "timestamps", "groups"].map((prop) => [prop, { get: empty }]))
  );
  return metricsFactory({
    now: () => 0,
    mkNode: () => nullNode,
    mkRenamer: () => () => none,
    mkTimer: () => nullTimer,
    nodes: { get: nop, set: nop }
  })();
})();
var enabled = true;
config.getConfig(CONFIG_TOGGLE, (cfg) => {
  enabled = !!cfg[CONFIG_TOGGLE];
});
function useMetrics(metrics) {
  return enabled && metrics || nullMetrics;
}
var newMetrics = (() => {
  const makeMetrics = metricsFactory();
  return function() {
    return enabled ? makeMetrics() : nullMetrics;
  };
})();
function hookTimer(prefix, getMetrics) {
  return function(name, hookFn) {
    return function(next, ...args) {
      const that = this;
      return useMetrics(getMetrics.apply(that, args)).measureHookTime(prefix + name, next, function(next2) {
        return hookFn.call(that, next2, ...args);
      });
    };
  };
}
var timedAuctionHook = hookTimer("requestBids.", (req) => req.metrics);
var timedBidResponseHook = hookTimer("addBidResponse.", (_, bid) => bid.metrics);

// src/bidfactory.js
function Bid(statusCode, { src = "client", bidder = "", bidId, transactionId, auctionId } = {}) {
  var _bidSrc = src;
  var _statusCode = statusCode || 0;
  this.bidderCode = bidder;
  this.width = 0;
  this.height = 0;
  this.statusMessage = _getStatus();
  this.adId = getUniqueIdentifierStr();
  this.requestId = bidId;
  this.transactionId = transactionId;
  this.auctionId = auctionId;
  this.mediaType = "banner";
  this.source = _bidSrc;
  function _getStatus() {
    switch (_statusCode) {
      case 0:
        return "Pending";
      case 1:
        return "Bid available";
      case 2:
        return "Bid returned empty or error response";
      case 3:
        return "Bid timed out";
    }
  }
  this.getStatusCode = function() {
    return _statusCode;
  };
  this.getSize = function() {
    return this.width + "x" + this.height;
  };
  this.getIdentifiers = function() {
    return {
      src: this.source,
      bidder: this.bidderCode,
      bidId: this.requestId,
      transactionId: this.transactionId,
      auctionId: this.auctionId
    };
  };
}
function createBid(statusCode, identifiers) {
  return new Bid(statusCode, identifiers);
}

// src/utils/cpm.js
function adjustCpm(cpm, bidResponse, bidRequest, { index = auctionManager.index, bs = bidderSettings } = {}) {
  bidRequest = bidRequest || index.getBidRequest(bidResponse);
  const bidCpmAdjustment = bs.get(bidResponse?.bidderCode || bidRequest?.bidder, "bidCpmAdjustment");
  if (bidCpmAdjustment && typeof bidCpmAdjustment === "function") {
    try {
      return bidCpmAdjustment(cpm, Object.assign({}, bidResponse), bidRequest);
    } catch (e) {
      logError("Error during bid adjustment", e);
    }
  }
  return cpm;
}

// src/auction.js
var { syncUsers } = userSync;
var AUCTION_STARTED = "started";
var AUCTION_IN_PROGRESS = "inProgress";
var AUCTION_COMPLETED = "completed";
on(constants_default.EVENTS.BID_ADJUSTMENT, function(bid) {
  adjustBids(bid);
});
var MAX_REQUESTS_PER_ORIGIN = 4;
var outstandingRequests = {};
var sourceInfo = {};
var queuedCalls = [];
var pbjsInstance3 = getGlobal();
function newAuction({ adUnits: adUnits2, adUnitCodes, callback, cbTimeout, labels, auctionId, ortb2Fragments, metrics }) {
  metrics = useMetrics(metrics);
  const _adUnits = adUnits2;
  const _labels = labels;
  const _adUnitCodes = adUnitCodes;
  const _auctionId = auctionId || generateUUID();
  const _timeout = cbTimeout;
  const _timelyBidders = /* @__PURE__ */ new Set();
  let _bidsRejected = [];
  let _callback = callback;
  let _bidderRequests = [];
  let _bidsReceived = [];
  let _noBids = [];
  let _winningBids = [];
  let _auctionStart;
  let _auctionEnd;
  let _timer;
  let _auctionStatus;
  let _nonBids = [];
  function addBidRequests(bidderRequests) {
    _bidderRequests = _bidderRequests.concat(bidderRequests);
  }
  function addBidReceived(bidsReceived) {
    _bidsReceived = _bidsReceived.concat(bidsReceived);
  }
  function addBidRejected(bidsRejected) {
    _bidsRejected = _bidsRejected.concat(bidsRejected);
  }
  function addNoBid(noBid) {
    _noBids = _noBids.concat(noBid);
  }
  function addNonBids(seatnonbids) {
    _nonBids = _nonBids.concat(seatnonbids);
  }
  function getProperties() {
    return {
      auctionId: _auctionId,
      timestamp: _auctionStart,
      auctionEnd: _auctionEnd,
      auctionStatus: _auctionStatus,
      adUnits: _adUnits,
      adUnitCodes: _adUnitCodes,
      labels: _labels,
      bidderRequests: _bidderRequests,
      noBids: _noBids,
      bidsReceived: _bidsReceived,
      bidsRejected: _bidsRejected,
      winningBids: _winningBids,
      timeout: _timeout,
      metrics,
      seatNonBids: _nonBids
    };
  }
  function startAuctionTimer() {
    const timedOut = true;
    const timeoutCallback = executeCallback.bind(null, timedOut);
    let timer = setTimeout(timeoutCallback, _timeout);
    _timer = timer;
  }
  function executeCallback(timedOut, cleartimer) {
    if (cleartimer) {
      clearTimeout(_timer);
    }
    if (_auctionEnd === void 0) {
      let timedOutBidders = [];
      if (timedOut) {
        logMessage(`Auction ${_auctionId} timedOut`);
        timedOutBidders = getTimedOutBids(_bidderRequests, _timelyBidders);
        if (timedOutBidders.length) {
          emit(constants_default.EVENTS.BID_TIMEOUT, timedOutBidders);
        }
      }
      _auctionStatus = AUCTION_COMPLETED;
      _auctionEnd = Date.now();
      metrics.checkpoint("auctionEnd");
      metrics.timeBetween("requestBids", "auctionEnd", "requestBids.total");
      metrics.timeBetween("callBids", "auctionEnd", "requestBids.callBids");
      emit(constants_default.EVENTS.AUCTION_END, getProperties());
      bidsBackCallback(_adUnits, function() {
        try {
          if (_callback != null) {
            const adUnitCodes2 = _adUnitCodes;
            const bids = _bidsReceived.filter(bind.call(adUnitsFilter, this, adUnitCodes2)).reduce(groupByPlacement, {});
            _callback.apply(pbjsInstance3, [bids, timedOut, _auctionId]);
            _callback = null;
          }
        } catch (e) {
          logError("Error executing bidsBackHandler", null, e);
        } finally {
          if (timedOutBidders.length) {
            adapterManager_default.callTimedOutBidders(adUnits2, timedOutBidders, _timeout);
          }
          let userSyncConfig = config.getConfig("userSync") || {};
          if (!userSyncConfig.enableOverride) {
            syncUsers(userSyncConfig.syncDelay);
          }
        }
      });
    }
  }
  function auctionDone() {
    config.resetBidder();
    logInfo(`Bids Received for Auction with id: ${_auctionId}`, _bidsReceived);
    _auctionStatus = AUCTION_COMPLETED;
    executeCallback(false, true);
  }
  function onTimelyResponse(bidderCode) {
    _timelyBidders.add(bidderCode);
  }
  function callBids() {
    _auctionStatus = AUCTION_STARTED;
    _auctionStart = Date.now();
    let bidRequests = metrics.measureTime(
      "requestBids.makeRequests",
      () => adapterManager_default.makeBidRequests(_adUnits, _auctionStart, _auctionId, _timeout, _labels, ortb2Fragments, metrics)
    );
    logInfo(`Bids Requested for Auction with id: ${_auctionId}`, bidRequests);
    metrics.checkpoint("callBids");
    if (bidRequests.length < 1) {
      logWarn("No valid bid requests returned for auction");
      auctionDone();
    } else {
      addBidderRequests.call({
        dispatch: addBidderRequestsCallback,
        context: this
      }, bidRequests);
    }
  }
  function addBidderRequestsCallback(bidRequests) {
    bidRequests.forEach((bidRequest) => {
      addBidRequests(bidRequest);
    });
    let requests = {};
    let call = {
      bidRequests,
      run: () => {
        startAuctionTimer();
        _auctionStatus = AUCTION_IN_PROGRESS;
        emit(constants_default.EVENTS.AUCTION_INIT, getProperties());
        let callbacks = auctionCallbacks(auctionDone, this);
        adapterManager_default.callBids(_adUnits, bidRequests, callbacks.addBidResponse, callbacks.adapterDone, {
          request(source, origin) {
            increment(outstandingRequests, origin);
            increment(requests, source);
            if (!sourceInfo[source]) {
              sourceInfo[source] = {
                SRA: true,
                origin
              };
            }
            if (requests[source] > 1) {
              sourceInfo[source].SRA = false;
            }
          },
          done(origin) {
            outstandingRequests[origin]--;
            if (queuedCalls[0]) {
              if (runIfOriginHasCapacity(queuedCalls[0])) {
                queuedCalls.shift();
              }
            }
          }
        }, _timeout, onTimelyResponse, ortb2Fragments);
      }
    };
    if (!runIfOriginHasCapacity(call)) {
      logWarn("queueing auction due to limited endpoint capacity");
      queuedCalls.push(call);
    }
    function runIfOriginHasCapacity(call2) {
      let hasCapacity = true;
      let maxRequests = config.getConfig("maxRequestsPerOrigin") || MAX_REQUESTS_PER_ORIGIN;
      call2.bidRequests.some((bidRequest) => {
        let requests2 = 1;
        let source = typeof bidRequest.src !== "undefined" && bidRequest.src === constants_default.S2S.SRC ? "s2s" : bidRequest.bidderCode;
        if (sourceInfo[source]) {
          if (sourceInfo[source].SRA === false) {
            requests2 = Math.min(bidRequest.bids.length, maxRequests);
          }
          if (outstandingRequests[sourceInfo[source].origin] + requests2 > maxRequests) {
            hasCapacity = false;
          }
        }
        return !hasCapacity;
      });
      if (hasCapacity) {
        call2.run();
      }
      return hasCapacity;
    }
    function increment(obj, prop) {
      if (typeof obj[prop] === "undefined") {
        obj[prop] = 1;
      } else {
        obj[prop]++;
      }
    }
  }
  function addWinningBid(winningBid) {
    _winningBids = _winningBids.concat(winningBid);
    adapterManager_default.callBidWonBidder(winningBid.adapterCode || winningBid.bidder, winningBid, adUnits2);
  }
  function setBidTargeting(bid) {
    adapterManager_default.callSetTargetingBidder(bid.adapterCode || bid.bidder, bid);
  }
  on(constants_default.EVENTS.SEAT_NON_BID, (event) => {
    if (event.auctionId === _auctionId) {
      addNonBids(event.seatnonbid);
    }
  });
  return {
    addBidReceived,
    addBidRejected,
    addNoBid,
    executeCallback,
    callBids,
    addWinningBid,
    setBidTargeting,
    getWinningBids: () => _winningBids,
    getAuctionStart: () => _auctionStart,
    getTimeout: () => _timeout,
    getAuctionId: () => _auctionId,
    getAuctionStatus: () => _auctionStatus,
    getAdUnits: () => _adUnits,
    getAdUnitCodes: () => _adUnitCodes,
    getBidRequests: () => _bidderRequests,
    getBidsReceived: () => _bidsReceived,
    getNoBids: () => _noBids,
    getNonBids: () => _nonBids,
    getFPD: () => ortb2Fragments,
    getMetrics: () => metrics
  };
}
var addBidResponse = hook("sync", function(adUnitCode, bid, reject) {
  this.dispatch.call(null, adUnitCode, bid);
}, "addBidResponse");
var addBidderRequests = hook("sync", function(bidderRequests) {
  this.dispatch.call(this.context, bidderRequests);
}, "addBidderRequests");
var bidsBackCallback = hook("async", function(adUnits2, callback) {
  if (callback) {
    callback();
  }
}, "bidsBackCallback");
function auctionCallbacks(auctionDone, auctionInstance, { index = auctionManager.index } = {}) {
  let outstandingBidsAdded = 0;
  let allAdapterCalledDone = false;
  let bidderRequestsDone = /* @__PURE__ */ new Set();
  let bidResponseMap = {};
  const ready2 = {};
  function waitFor(requestId, result) {
    if (ready2[requestId] == null) {
      ready2[requestId] = GreedyPromise.resolve();
    }
    ready2[requestId] = ready2[requestId].then(() => GreedyPromise.resolve(result).catch(() => {
    }));
  }
  function guard(bidderRequest, fn) {
    let timeout = bidderRequest.timeout;
    if (timeout == null || timeout > auctionInstance.getTimeout()) {
      timeout = auctionInstance.getTimeout();
    }
    const timeRemaining = auctionInstance.getAuctionStart() + timeout - Date.now();
    const wait = ready2[bidderRequest.bidderRequestId];
    const orphanWait = ready2[""];
    if ((wait != null || orphanWait != null) && timeRemaining > 0) {
      GreedyPromise.race([
        GreedyPromise.timeout(timeRemaining),
        GreedyPromise.resolve(orphanWait).then(() => wait)
      ]).then(fn);
    } else {
      fn();
    }
  }
  function afterBidAdded() {
    outstandingBidsAdded--;
    if (allAdapterCalledDone && outstandingBidsAdded === 0) {
      auctionDone();
    }
  }
  function handleBidResponse(adUnitCode, bid, handler) {
    bidResponseMap[bid.requestId] = true;
    addCommonResponseProperties(bid, adUnitCode);
    outstandingBidsAdded++;
    return handler(afterBidAdded);
  }
  function acceptBidResponse(adUnitCode, bid) {
    handleBidResponse(adUnitCode, bid, (done) => {
      let bidResponse = getPreparedBidForAuction(bid);
      if (FEATURES.VIDEO && bidResponse.mediaType === VIDEO) {
        tryAddVideoBid(auctionInstance, bidResponse, done);
      } else {
        if (FEATURES.NATIVE && bidResponse.native != null && typeof bidResponse.native === "object") {
          addLegacyFieldsIfNeeded(bidResponse);
        }
        addBidToAuction(auctionInstance, bidResponse);
        done();
      }
    });
  }
  function rejectBidResponse(adUnitCode, bid, reason) {
    return handleBidResponse(adUnitCode, bid, (done) => {
      const noBid = createBid(constants_default.STATUS.NO_BID, bid.getIdentifiers?.());
      Object.assign(noBid, Object.fromEntries(Object.entries(bid).filter(([k]) => !noBid.hasOwnProperty(k) && ![
        "ad",
        "adUrl",
        "vastXml",
        "vastUrl",
        "native"
      ].includes(k))));
      noBid.status = constants_default.BID_STATUS.BID_REJECTED;
      noBid.cpm = 0;
      bid.rejectionReason = reason;
      logWarn(`Bid from ${bid.bidder || "unknown bidder"} was rejected: ${reason}`, bid);
      emit(constants_default.EVENTS.BID_REJECTED, bid);
      auctionInstance.addBidRejected(bid);
      done();
      return noBid;
    });
  }
  function adapterDone() {
    let bidderRequest = this;
    let bidderRequests = auctionInstance.getBidRequests();
    const auctionOptionsConfig = config.getConfig("auctionOptions");
    bidderRequestsDone.add(bidderRequest);
    if (auctionOptionsConfig && !isEmpty(auctionOptionsConfig)) {
      const secondaryBidders = auctionOptionsConfig.secondaryBidders;
      if (secondaryBidders && !bidderRequests.every((bidder) => includes(secondaryBidders, bidder.bidderCode))) {
        bidderRequests = bidderRequests.filter((request) => !includes(secondaryBidders, request.bidderCode));
      }
    }
    allAdapterCalledDone = bidderRequests.every((bidderRequest2) => bidderRequestsDone.has(bidderRequest2));
    bidderRequest.bids.forEach((bid) => {
      if (!bidResponseMap[bid.bidId]) {
        auctionInstance.addNoBid(bid);
        emit(constants_default.EVENTS.NO_BID, bid);
      }
    });
    if (allAdapterCalledDone && outstandingBidsAdded === 0) {
      auctionDone();
    }
  }
  return {
    addBidResponse: function() {
      function addBid(adUnitCode, bid) {
        const bidderRequest = index.getBidderRequest(bid);
        waitFor(bidderRequest && bidderRequest.bidderRequestId || "", addBidResponse.call({
          dispatch: acceptBidResponse
        }, adUnitCode, bid, (() => {
          let rejection;
          return (reason) => {
            if (rejection == null) {
              rejection = rejectBidResponse(adUnitCode, bid, reason);
            }
            return rejection;
          };
        })()));
      }
      addBid.reject = rejectBidResponse;
      return addBid;
    }(),
    adapterDone: function() {
      guard(this, adapterDone.bind(this));
    }
  };
}
function doCallbacksIfTimedout(auctionInstance, bidResponse) {
  if (bidResponse.timeToRespond > auctionInstance.getTimeout() + config.getConfig("timeoutBuffer")) {
    auctionInstance.executeCallback(true);
  }
}
function addBidToAuction(auctionInstance, bidResponse) {
  setupBidTargeting(bidResponse);
  useMetrics(bidResponse.metrics).timeSince("addBidResponse", "addBidResponse.total");
  emit(constants_default.EVENTS.BID_RESPONSE, bidResponse);
  auctionInstance.addBidReceived(bidResponse);
  doCallbacksIfTimedout(auctionInstance, bidResponse);
}
function tryAddVideoBid(auctionInstance, bidResponse, afterBidAdded, { index = auctionManager.index } = {}) {
  let addBid = true;
  const videoMediaType = dlv(
    index.getMediaTypes({
      requestId: bidResponse.originalRequestId || bidResponse.requestId,
      transactionId: bidResponse.transactionId
    }),
    "video"
  );
  const context = videoMediaType && dlv(videoMediaType, "context");
  const useCacheKey = videoMediaType && dlv(videoMediaType, "useCacheKey");
  if (config.getConfig("cache.url") && (useCacheKey || context !== OUTSTREAM)) {
    if (!bidResponse.videoCacheKey || config.getConfig("cache.ignoreBidderCacheKey")) {
      addBid = false;
      callPrebidCache(auctionInstance, bidResponse, afterBidAdded, videoMediaType);
    } else if (!bidResponse.vastUrl) {
      logError("videoCacheKey specified but not required vastUrl for video bid");
      addBid = false;
    }
  }
  if (addBid) {
    addBidToAuction(auctionInstance, bidResponse);
    afterBidAdded();
  }
}
var addLegacyFieldsIfNeeded = (bidResponse) => {
  const nativeOrtbRequest = auctionManager.index.getAdUnit(bidResponse)?.nativeOrtbRequest;
  const nativeOrtbResponse = bidResponse.native?.ortb;
  if (nativeOrtbRequest && nativeOrtbResponse) {
    const legacyResponse = toLegacyResponse(nativeOrtbResponse, nativeOrtbRequest);
    Object.assign(bidResponse.native, legacyResponse);
  }
};
var _storeInCache = (batch) => {
  store(batch.map((entry) => entry.bidResponse), function(error, cacheIds) {
    cacheIds.forEach((cacheId, i) => {
      const { auctionInstance, bidResponse, afterBidAdded } = batch[i];
      if (error) {
        logWarn(`Failed to save to the video cache: ${error}. Video bid must be discarded.`);
        doCallbacksIfTimedout(auctionInstance, bidResponse);
      } else {
        if (cacheId.uuid === "") {
          logWarn(`Supplied video cache key was already in use by Prebid Cache; caching attempt was rejected. Video bid must be discarded.`);
          doCallbacksIfTimedout(auctionInstance, bidResponse);
        } else {
          bidResponse.videoCacheKey = cacheId.uuid;
          if (!bidResponse.vastUrl) {
            bidResponse.vastUrl = getCacheUrl(bidResponse.videoCacheKey);
          }
          addBidToAuction(auctionInstance, bidResponse);
          afterBidAdded();
        }
      }
    });
  });
};
var storeInCache = FEATURES.VIDEO ? _storeInCache : () => {
};
var batchSize;
var batchTimeout;
config.getConfig("cache", (cacheConfig) => {
  batchSize = typeof cacheConfig.cache.batchSize === "number" && cacheConfig.cache.batchSize > 0 ? cacheConfig.cache.batchSize : 1;
  batchTimeout = typeof cacheConfig.cache.batchTimeout === "number" && cacheConfig.cache.batchTimeout > 0 ? cacheConfig.cache.batchTimeout : 0;
});
var batchingCache = (timeout = setTimeout, cache = storeInCache) => {
  let batches = [[]];
  let debouncing = false;
  const noTimeout = (cb) => cb();
  return function(auctionInstance, bidResponse, afterBidAdded) {
    const batchFunc = batchTimeout > 0 ? timeout : noTimeout;
    if (batches[batches.length - 1].length >= batchSize) {
      batches.push([]);
    }
    batches[batches.length - 1].push({ auctionInstance, bidResponse, afterBidAdded });
    if (!debouncing) {
      debouncing = true;
      batchFunc(() => {
        batches.forEach(cache);
        batches = [[]];
        debouncing = false;
      }, batchTimeout);
    }
  };
};
var batchAndStore = batchingCache();
var callPrebidCache = hook("async", function(auctionInstance, bidResponse, afterBidAdded, videoMediaType) {
  batchAndStore(auctionInstance, bidResponse, afterBidAdded);
}, "callPrebidCache");
function addCommonResponseProperties(bidResponse, adUnitCode, { index = auctionManager.index } = {}) {
  const bidderRequest = index.getBidderRequest(bidResponse);
  const adUnit = index.getAdUnit(bidResponse);
  const start = bidderRequest && bidderRequest.start || bidResponse.requestTimestamp;
  Object.assign(bidResponse, {
    responseTimestamp: bidResponse.responseTimestamp || timestamp(),
    requestTimestamp: bidResponse.requestTimestamp || start,
    cpm: parseFloat(bidResponse.cpm) || 0,
    bidder: bidResponse.bidder || bidResponse.bidderCode,
    adUnitCode
  });
  if (adUnit?.ttlBuffer != null) {
    bidResponse.ttlBuffer = adUnit.ttlBuffer;
  }
  bidResponse.timeToRespond = bidResponse.responseTimestamp - bidResponse.requestTimestamp;
}
function getPreparedBidForAuction(bid, { index = auctionManager.index } = {}) {
  emit(constants_default.EVENTS.BID_ADJUSTMENT, bid);
  const bidRenderer = index.getBidRequest(bid)?.renderer || index.getAdUnit(bid).renderer;
  const bidObjectMediaType = bid.mediaType;
  const mediaTypes = index.getMediaTypes(bid);
  const bidMediaType = mediaTypes && mediaTypes[bidObjectMediaType];
  var mediaTypeRenderer = bidMediaType && bidMediaType.renderer;
  var renderer = null;
  if (mediaTypeRenderer && mediaTypeRenderer.url && mediaTypeRenderer.render && !(mediaTypeRenderer.backupOnly === true && bid.renderer)) {
    renderer = mediaTypeRenderer;
  } else if (bidRenderer && bidRenderer.url && bidRenderer.render && !(bidRenderer.backupOnly === true && bid.renderer)) {
    renderer = bidRenderer;
  }
  if (renderer) {
    bid.renderer = Renderer.install({ url: renderer.url, config: renderer.options });
    bid.renderer.setRender(renderer.render);
  }
  const mediaTypeGranularity = getMediaTypeGranularity(bid.mediaType, mediaTypes, config.getConfig("mediaTypePriceGranularity"));
  const priceStringsObj = getPriceBucketString(
    bid.cpm,
    typeof mediaTypeGranularity === "object" ? mediaTypeGranularity : config.getConfig("customPriceBucket"),
    config.getConfig("currency.granularityMultiplier")
  );
  bid.pbLg = priceStringsObj.low;
  bid.pbMg = priceStringsObj.med;
  bid.pbHg = priceStringsObj.high;
  bid.pbAg = priceStringsObj.auto;
  bid.pbDg = priceStringsObj.dense;
  bid.pbCg = priceStringsObj.custom;
  return bid;
}
function setupBidTargeting(bidObject) {
  let keyValues;
  const cpmCheck = bidderSettings.get(bidObject.bidderCode, "allowZeroCpmBids") === true ? bidObject.cpm >= 0 : bidObject.cpm > 0;
  if (bidObject.bidderCode && (cpmCheck || bidObject.dealId)) {
    keyValues = getKeyValueTargetingPairs(bidObject.bidderCode, bidObject);
  }
  bidObject.adserverTargeting = Object.assign(bidObject.adserverTargeting || {}, keyValues);
}
function getMediaTypeGranularity(mediaType, mediaTypes, mediaTypePriceGranularity) {
  if (mediaType && mediaTypePriceGranularity) {
    if (FEATURES.VIDEO && mediaType === VIDEO) {
      const context = dlv(mediaTypes, `${VIDEO}.context`, "instream");
      if (mediaTypePriceGranularity[`${VIDEO}-${context}`]) {
        return mediaTypePriceGranularity[`${VIDEO}-${context}`];
      }
    }
    return mediaTypePriceGranularity[mediaType];
  }
}
var getPriceGranularity = (bid, { index = auctionManager.index } = {}) => {
  const mediaTypeGranularity = getMediaTypeGranularity(bid.mediaType, index.getMediaTypes(bid), config.getConfig("mediaTypePriceGranularity"));
  const granularity = typeof bid.mediaType === "string" && mediaTypeGranularity ? typeof mediaTypeGranularity === "string" ? mediaTypeGranularity : "custom" : config.getConfig("priceGranularity");
  return granularity;
};
var getPriceByGranularity = (granularity) => {
  return (bid) => {
    const bidGranularity = granularity || getPriceGranularity(bid);
    if (bidGranularity === constants_default.GRANULARITY_OPTIONS.AUTO) {
      return bid.pbAg;
    } else if (bidGranularity === constants_default.GRANULARITY_OPTIONS.DENSE) {
      return bid.pbDg;
    } else if (bidGranularity === constants_default.GRANULARITY_OPTIONS.LOW) {
      return bid.pbLg;
    } else if (bidGranularity === constants_default.GRANULARITY_OPTIONS.MEDIUM) {
      return bid.pbMg;
    } else if (bidGranularity === constants_default.GRANULARITY_OPTIONS.HIGH) {
      return bid.pbHg;
    } else if (bidGranularity === constants_default.GRANULARITY_OPTIONS.CUSTOM) {
      return bid.pbCg;
    }
  };
};
var getAdvertiserDomain = () => {
  return (bid) => {
    return bid.meta && bid.meta.advertiserDomains && bid.meta.advertiserDomains.length > 0 ? [bid.meta.advertiserDomains].flat()[0] : "";
  };
};
var getPrimaryCatId = () => {
  return (bid) => {
    return bid.meta && bid.meta.primaryCatId ? bid.meta.primaryCatId : "";
  };
};
function createKeyVal(key, value) {
  return {
    key,
    val: typeof value === "function" ? function(bidResponse, bidReq) {
      return value(bidResponse, bidReq);
    } : function(bidResponse) {
      return getValue(bidResponse, value);
    }
  };
}
function defaultAdserverTargeting() {
  const TARGETING_KEYS = constants_default.TARGETING_KEYS;
  return [
    createKeyVal(TARGETING_KEYS.BIDDER, "bidderCode"),
    createKeyVal(TARGETING_KEYS.AD_ID, "adId"),
    createKeyVal(TARGETING_KEYS.PRICE_BUCKET, getPriceByGranularity()),
    createKeyVal(TARGETING_KEYS.SIZE, "size"),
    createKeyVal(TARGETING_KEYS.DEAL, "dealId"),
    createKeyVal(TARGETING_KEYS.SOURCE, "source"),
    createKeyVal(TARGETING_KEYS.FORMAT, "mediaType"),
    createKeyVal(TARGETING_KEYS.ADOMAIN, getAdvertiserDomain()),
    createKeyVal(TARGETING_KEYS.ACAT, getPrimaryCatId())
  ];
}
function getStandardBidderSettings(mediaType, bidderCode) {
  const TARGETING_KEYS = constants_default.TARGETING_KEYS;
  const standardSettings = Object.assign({}, bidderSettings.settingsFor(null));
  if (!standardSettings[constants_default.JSON_MAPPING.ADSERVER_TARGETING]) {
    standardSettings[constants_default.JSON_MAPPING.ADSERVER_TARGETING] = defaultAdserverTargeting();
  }
  if (FEATURES.VIDEO && mediaType === "video") {
    const adserverTargeting = standardSettings[constants_default.JSON_MAPPING.ADSERVER_TARGETING].slice();
    standardSettings[constants_default.JSON_MAPPING.ADSERVER_TARGETING] = adserverTargeting;
    [TARGETING_KEYS.UUID, TARGETING_KEYS.CACHE_ID].forEach((targetingKeyVal) => {
      if (typeof find(adserverTargeting, (kvPair) => kvPair.key === targetingKeyVal) === "undefined") {
        adserverTargeting.push(createKeyVal(targetingKeyVal, "videoCacheKey"));
      }
    });
    if (config.getConfig("cache.url") && (!bidderCode || bidderSettings.get(bidderCode, "sendStandardTargeting") !== false)) {
      const urlInfo = parseUrl(config.getConfig("cache.url"));
      if (typeof find(adserverTargeting, (targetingKeyVal) => targetingKeyVal.key === TARGETING_KEYS.CACHE_HOST) === "undefined") {
        adserverTargeting.push(createKeyVal(TARGETING_KEYS.CACHE_HOST, function(bidResponse) {
          return dlv(bidResponse, `adserverTargeting.${TARGETING_KEYS.CACHE_HOST}`) ? bidResponse.adserverTargeting[TARGETING_KEYS.CACHE_HOST] : urlInfo.hostname;
        }));
      }
    }
  }
  return standardSettings;
}
function getKeyValueTargetingPairs(bidderCode, custBidObj, { index = auctionManager.index } = {}) {
  if (!custBidObj) {
    return {};
  }
  const bidRequest = index.getBidRequest(custBidObj);
  var keyValues = {};
  const standardSettings = getStandardBidderSettings(custBidObj.mediaType, bidderCode);
  setKeys(keyValues, standardSettings, custBidObj, bidRequest);
  if (bidderCode && bidderSettings.getOwn(bidderCode, constants_default.JSON_MAPPING.ADSERVER_TARGETING)) {
    setKeys(keyValues, bidderSettings.ownSettingsFor(bidderCode), custBidObj, bidRequest);
    custBidObj.sendStandardTargeting = bidderSettings.get(bidderCode, "sendStandardTargeting");
  }
  if (FEATURES.NATIVE && custBidObj["native"]) {
    keyValues = Object.assign({}, keyValues, getNativeTargeting(custBidObj));
  }
  return keyValues;
}
function setKeys(keyValues, bidderSettings2, custBidObj, bidReq) {
  var targeting = bidderSettings2[constants_default.JSON_MAPPING.ADSERVER_TARGETING];
  custBidObj.size = custBidObj.getSize();
  _each(targeting, function(kvPair) {
    var key = kvPair.key;
    var value = kvPair.val;
    if (keyValues[key]) {
      logWarn("The key: " + key + " is being overwritten");
    }
    if (isFn(value)) {
      try {
        value = value(custBidObj, bidReq);
      } catch (e) {
        logError("bidmanager", "ERROR", e);
      }
    }
    if ((typeof bidderSettings2.suppressEmptyKeys !== "undefined" && bidderSettings2.suppressEmptyKeys === true || key === constants_default.TARGETING_KEYS.DEAL || key === constants_default.TARGETING_KEYS.ACAT) && // hb_deal & hb_acat are suppressed automatically if not set
    (isEmptyStr(value) || value === null || value === void 0)) {
      logInfo("suppressing empty key '" + key + "' from adserver targeting");
    } else {
      keyValues[key] = value;
    }
  });
  return keyValues;
}
function adjustBids(bid) {
  let bidPriceAdjusted = adjustCpm(bid.cpm, bid);
  if (bidPriceAdjusted >= 0) {
    bid.cpm = bidPriceAdjusted;
  }
}
function groupByPlacement(bidsByPlacement, bid) {
  if (!bidsByPlacement[bid.adUnitCode]) {
    bidsByPlacement[bid.adUnitCode] = { bids: [] };
  }
  bidsByPlacement[bid.adUnitCode].bids.push(bid);
  return bidsByPlacement;
}
function getTimedOutBids(bidderRequests, timelyBidders) {
  const timedOutBids = bidderRequests.map((bid) => (bid.bids || []).filter((bid2) => !timelyBidders.has(bid2.bidder))).reduce(flatten, []);
  return timedOutBids;
}

// src/auctionIndex.js
function AuctionIndex(getAuctions) {
  Object.assign(this, {
    /**
     * @param auctionId
     * @returns {*} Auction instance for `auctionId`
     */
    getAuction({ auctionId }) {
      if (auctionId != null) {
        return getAuctions().find((auction) => auction.getAuctionId() === auctionId);
      }
    },
    /**
     * NOTE: you should prefer {@link #getMediaTypes} for looking up bid media types.
     * @param transactionId
     * @returns adUnit object for `transactionId`
     */
    getAdUnit({ transactionId }) {
      if (transactionId != null) {
        return getAuctions().flatMap((a) => a.getAdUnits()).find((au) => au.transactionId === transactionId);
      }
    },
    /**
     * @param transactionId
     * @param requestId?
     * @returns {*} mediaTypes object from bidRequest (through requestId) falling back to the adUnit (through transactionId).
     *
     * The bidRequest is given precedence because its mediaTypes can differ from the adUnit's (if bidder-specific labels are in use).
     * Bids that have no associated request do not have labels either, and use the adUnit's mediaTypes.
     */
    getMediaTypes({ transactionId, requestId }) {
      if (requestId != null) {
        const req = this.getBidRequest({ requestId });
        if (req != null && (transactionId == null || req.transactionId === transactionId)) {
          return req.mediaTypes;
        }
      } else if (transactionId != null) {
        const au = this.getAdUnit({ transactionId });
        if (au != null) {
          return au.mediaTypes;
        }
      }
    },
    /**
     * @param requestId?
     * @param bidderRequestId?
     * @returns {*} bidderRequest that matches both requestId and bidderRequestId (if either or both are provided).
     *
     * NOTE: Bid responses are not guaranteed to have a corresponding request.
     */
    getBidderRequest({ requestId, bidderRequestId }) {
      if (requestId != null || bidderRequestId != null) {
        let bers = getAuctions().flatMap((a) => a.getBidRequests());
        if (bidderRequestId != null) {
          bers = bers.filter((ber) => ber.bidderRequestId === bidderRequestId);
        }
        if (requestId == null) {
          return bers[0];
        } else {
          return bers.find((ber) => ber.bids && ber.bids.find((br) => br.bidId === requestId) != null);
        }
      }
    },
    /**
     * @param requestId
     * @returns {*} bidRequest object for requestId
     *
     * NOTE: Bid responses are not guaranteed to have a corresponding request.
     */
    getBidRequest({ requestId }) {
      if (requestId != null) {
        return getAuctions().flatMap((a) => a.getBidRequests()).flatMap((ber) => ber.bids).find((br) => br && br.bidId === requestId);
      }
    }
  });
}

// src/auctionManager.js
function newAuctionManager() {
  const _auctions = [];
  const auctionManager2 = {};
  auctionManager2.addWinningBid = function(bid) {
    const metrics = useMetrics(bid.metrics);
    metrics.checkpoint("bidWon");
    metrics.timeBetween("auctionEnd", "bidWon", "render.pending");
    metrics.timeBetween("requestBids", "bidWon", "render.e2e");
    const auction = find(_auctions, (auction2) => auction2.getAuctionId() === bid.auctionId);
    if (auction) {
      bid.status = constants_default.BID_STATUS.RENDERED;
      auction.addWinningBid(bid);
    } else {
      logWarn(`Auction not found when adding winning bid`);
    }
  };
  auctionManager2.getAllWinningBids = function() {
    return _auctions.map((auction) => auction.getWinningBids()).reduce(flatten, []);
  };
  auctionManager2.getBidsRequested = function() {
    return _auctions.map((auction) => auction.getBidRequests()).reduce(flatten, []);
  };
  auctionManager2.getNoBids = function() {
    return _auctions.map((auction) => auction.getNoBids()).reduce(flatten, []);
  };
  auctionManager2.getBidsReceived = function() {
    return _auctions.map((auction) => {
      if (auction.getAuctionStatus() === AUCTION_COMPLETED) {
        return auction.getBidsReceived();
      }
    }).reduce(flatten, []).filter((bid) => bid);
  };
  auctionManager2.getAllBidsForAdUnitCode = function(adUnitCode) {
    return _auctions.map((auction) => {
      return auction.getBidsReceived();
    }).reduce(flatten, []).filter((bid) => bid && bid.adUnitCode === adUnitCode);
  };
  auctionManager2.getAdUnits = function() {
    return _auctions.map((auction) => auction.getAdUnits()).reduce(flatten, []);
  };
  auctionManager2.getAdUnitCodes = function() {
    return _auctions.map((auction) => auction.getAdUnitCodes()).reduce(flatten, []).filter(uniques);
  };
  auctionManager2.createAuction = function(opts) {
    const auction = newAuction(opts);
    _addAuction(auction);
    return auction;
  };
  auctionManager2.findBidByAdId = function(adId) {
    return find(_auctions.map((auction) => auction.getBidsReceived()).reduce(flatten, []), (bid) => bid.adId === adId);
  };
  auctionManager2.getStandardBidderAdServerTargeting = function() {
    return getStandardBidderSettings()[constants_default.JSON_MAPPING.ADSERVER_TARGETING];
  };
  auctionManager2.setStatusForBids = function(adId, status) {
    let bid = auctionManager2.findBidByAdId(adId);
    if (bid)
      bid.status = status;
    if (bid && status === constants_default.BID_STATUS.BID_TARGETING_SET) {
      const auction = find(_auctions, (auction2) => auction2.getAuctionId() === bid.auctionId);
      if (auction)
        auction.setBidTargeting(bid);
    }
  };
  auctionManager2.getLastAuctionId = function() {
    return _auctions.length && _auctions[_auctions.length - 1].getAuctionId();
  };
  auctionManager2.clearAllAuctions = function() {
    _auctions.length = 0;
  };
  function _addAuction(auction) {
    _auctions.push(auction);
  }
  auctionManager2.index = new AuctionIndex(() => _auctions);
  return auctionManager2;
}
var auctionManager = newAuctionManager();

// src/native.js
var nativeAdapters = [];
var NATIVE_TARGETING_KEYS = Object.keys(constants_default.NATIVE_KEYS).map(
  (key) => constants_default.NATIVE_KEYS[key]
);
var IMAGE = {
  ortb: {
    ver: "1.2",
    assets: [
      {
        required: 1,
        id: 1,
        img: {
          type: 3,
          wmin: 100,
          hmin: 100
        }
      },
      {
        required: 1,
        id: 2,
        title: {
          len: 140
        }
      },
      {
        required: 1,
        id: 3,
        data: {
          type: 1
        }
      },
      {
        required: 0,
        id: 4,
        data: {
          type: 2
        }
      },
      {
        required: 0,
        id: 5,
        img: {
          type: 1,
          wmin: 20,
          hmin: 20
        }
      }
    ]
  },
  image: { required: true },
  title: { required: true },
  sponsoredBy: { required: true },
  clickUrl: { required: true },
  body: { required: false },
  icon: { required: false }
};
var SUPPORTED_TYPES = {
  image: IMAGE
};
var { NATIVE_ASSET_TYPES, NATIVE_IMAGE_TYPES, PREBID_NATIVE_DATA_KEYS_TO_ORTB, NATIVE_KEYS_THAT_ARE_NOT_ASSETS, NATIVE_KEYS } = constants_default;
var PREBID_NATIVE_DATA_KEYS_TO_ORTB_INVERSE = inverse(PREBID_NATIVE_DATA_KEYS_TO_ORTB);
var NATIVE_ASSET_TYPES_INVERSE = inverse(NATIVE_ASSET_TYPES);
var TRACKER_METHODS = {
  img: 1,
  js: 2,
  1: "img",
  2: "js"
};
var TRACKER_EVENTS = {
  impression: 1,
  "viewable-mrc50": 2,
  "viewable-mrc100": 3,
  "viewable-video50": 4
};
function processNativeAdUnitParams(params) {
  if (params && params.type && typeIsSupported(params.type)) {
    params = SUPPORTED_TYPES[params.type];
  }
  if (params && params.ortb && !isOpenRTBBidRequestValid(params.ortb)) {
    return;
  }
  return params;
}
function decorateAdUnitsWithNativeParams(adUnits2) {
  adUnits2.forEach((adUnit) => {
    const nativeParams = adUnit.nativeParams || dlv(adUnit, "mediaTypes.native");
    if (nativeParams) {
      adUnit.nativeParams = processNativeAdUnitParams(nativeParams);
    }
    if (adUnit.nativeParams) {
      adUnit.nativeOrtbRequest = adUnit.nativeParams.ortb || toOrtbNativeRequest(adUnit.nativeParams);
    }
  });
}
function isOpenRTBBidRequestValid(ortb) {
  const assets = ortb.assets;
  if (!Array.isArray(assets) || assets.length === 0) {
    logError(`assets in mediaTypes.native.ortb is not an array, or it's empty. Assets: `, assets);
    return false;
  }
  const ids = assets.map((asset) => asset.id);
  if (assets.length !== new Set(ids).size || ids.some((id) => id !== parseInt(id, 10))) {
    logError(`each asset object must have 'id' property, it must be unique and it must be an integer`);
    return false;
  }
  if (ortb.hasOwnProperty("eventtrackers") && !Array.isArray(ortb.eventtrackers)) {
    logError("ortb.eventtrackers is not an array. Eventtrackers: ", ortb.eventtrackers);
    return false;
  }
  return assets.every((asset) => isOpenRTBAssetValid(asset));
}
function isOpenRTBAssetValid(asset) {
  if (!isPlainObject(asset)) {
    logError(`asset must be an object. Provided asset: `, asset);
    return false;
  }
  if (asset.img) {
    if (!isNumber(asset.img.w) && !isNumber(asset.img.wmin)) {
      logError(`for img asset there must be 'w' or 'wmin' property`);
      return false;
    }
    if (!isNumber(asset.img.h) && !isNumber(asset.img.hmin)) {
      logError(`for img asset there must be 'h' or 'hmin' property`);
      return false;
    }
  } else if (asset.title) {
    if (!isNumber(asset.title.len)) {
      logError(`for title asset there must be 'len' property defined`);
      return false;
    }
  } else if (asset.data) {
    if (!isNumber(asset.data.type)) {
      logError(`for data asset 'type' property must be a number`);
      return false;
    }
  } else if (asset.video) {
    if (!Array.isArray(asset.video.mimes) || !Array.isArray(asset.video.protocols) || !isNumber(asset.video.minduration) || !isNumber(asset.video.maxduration)) {
      logError("video asset is not properly configured");
      return false;
    }
  }
  return true;
}
function typeIsSupported(type) {
  if (!(type && includes(Object.keys(SUPPORTED_TYPES), type))) {
    logError(`${type} nativeParam is not supported`);
    return false;
  }
  return true;
}
function nativeBidIsValid(bid, { index = auctionManager.index } = {}) {
  const adUnit = index.getAdUnit(bid);
  if (!adUnit) {
    return false;
  }
  let ortbRequest = adUnit.nativeOrtbRequest;
  let ortbResponse = bid.native?.ortb || toOrtbNativeResponse(bid.native, ortbRequest);
  return isNativeOpenRTBBidValid(ortbResponse, ortbRequest);
}
function isNativeOpenRTBBidValid(bidORTB, bidRequestORTB) {
  if (!dlv(bidORTB, "link.url")) {
    logError(`native response doesn't have 'link' property. Ortb response: `, bidORTB);
    return false;
  }
  let requiredAssetIds = bidRequestORTB.assets.filter((asset) => asset.required === 1).map((a) => a.id);
  let returnedAssetIds = bidORTB.assets.map((asset) => asset.id);
  const match = requiredAssetIds.every((assetId) => includes(returnedAssetIds, assetId));
  if (!match) {
    logError(`didn't receive a bid with all required assets. Required ids: ${requiredAssetIds}, but received ids in response: ${returnedAssetIds}`);
  }
  return match;
}
function getNativeTargeting(bid, { index = auctionManager.index } = {}) {
  let keyValues = {};
  const adUnit = index.getAdUnit(bid);
  if (dlv(adUnit, "nativeParams.rendererUrl")) {
    bid["native"]["rendererUrl"] = getAssetValue(adUnit.nativeParams["rendererUrl"]);
  } else if (dlv(adUnit, "nativeParams.adTemplate")) {
    bid["native"]["adTemplate"] = getAssetValue(adUnit.nativeParams["adTemplate"]);
  }
  const globalSendTargetingKeys = dlv(
    adUnit,
    `nativeParams.sendTargetingKeys`
  ) !== false;
  const nativeKeys = getNativeKeys(adUnit);
  const flatBidNativeKeys = { ...bid.native, ...bid.native.ext };
  delete flatBidNativeKeys.ext;
  Object.keys(flatBidNativeKeys).forEach((asset) => {
    const key = nativeKeys[asset];
    let value = getAssetValue(bid.native[asset]) || getAssetValue(dlv(bid, `native.ext.${asset}`));
    if (asset === "adTemplate" || !key || !value) {
      return;
    }
    let sendPlaceholder = dlv(adUnit, `nativeParams.${asset}.sendId`);
    if (typeof sendPlaceholder !== "boolean") {
      sendPlaceholder = dlv(adUnit, `nativeParams.ext.${asset}.sendId`);
    }
    if (sendPlaceholder) {
      const placeholder = `${key}:${bid.adId}`;
      value = placeholder;
    }
    let assetSendTargetingKeys = dlv(adUnit, `nativeParams.${asset}.sendTargetingKeys`);
    if (typeof assetSendTargetingKeys !== "boolean") {
      assetSendTargetingKeys = dlv(adUnit, `nativeParams.ext.${asset}.sendTargetingKeys`);
    }
    const sendTargeting = typeof assetSendTargetingKeys === "boolean" ? assetSendTargetingKeys : globalSendTargetingKeys;
    if (sendTargeting) {
      keyValues[key] = value;
    }
  });
  return keyValues;
}
function getAssetValue(value) {
  return value?.url || value;
}
function getNativeKeys(adUnit) {
  const extraNativeKeys = {};
  if (dlv(adUnit, "nativeParams.ext")) {
    Object.keys(adUnit.nativeParams.ext).forEach((extKey) => {
      extraNativeKeys[extKey] = `hb_native_${extKey}`;
    });
  }
  return {
    ...constants_default.NATIVE_KEYS,
    ...extraNativeKeys
  };
}
function toOrtbNativeRequest(legacyNativeAssets) {
  if (!legacyNativeAssets && !isPlainObject(legacyNativeAssets)) {
    logError("Native assets object is empty or not an object: ", legacyNativeAssets);
    return;
  }
  const ortb = {
    ver: "1.2",
    assets: []
  };
  for (let key in legacyNativeAssets) {
    if (NATIVE_KEYS_THAT_ARE_NOT_ASSETS.includes(key))
      continue;
    if (!NATIVE_KEYS.hasOwnProperty(key)) {
      logError(`Unrecognized native asset code: ${key}. Asset will be ignored.`);
      continue;
    }
    const asset = legacyNativeAssets[key];
    let required = 0;
    if (asset.required && isBoolean(asset.required)) {
      required = Number(asset.required);
    }
    const ortbAsset = {
      id: ortb.assets.length,
      required
    };
    if (key in PREBID_NATIVE_DATA_KEYS_TO_ORTB) {
      ortbAsset.data = {
        type: NATIVE_ASSET_TYPES[PREBID_NATIVE_DATA_KEYS_TO_ORTB[key]]
      };
      if (asset.len) {
        ortbAsset.data.len = asset.len;
      }
    } else if (key === "icon" || key === "image") {
      ortbAsset.img = {
        type: key === "icon" ? NATIVE_IMAGE_TYPES.ICON : NATIVE_IMAGE_TYPES.MAIN
      };
      if (asset.aspect_ratios) {
        if (!isArray(asset.aspect_ratios)) {
          logError("image.aspect_ratios was passed, but it's not a an array:", asset.aspect_ratios);
        } else if (!asset.aspect_ratios.length) {
          logError("image.aspect_ratios was passed, but it's empty:", asset.aspect_ratios);
        } else {
          const { min_width: minWidth, min_height: minHeight } = asset.aspect_ratios[0];
          if (!isInteger(minWidth) || !isInteger(minHeight)) {
            logError("image.aspect_ratios min_width or min_height are invalid: ", minWidth, minHeight);
          } else {
            ortbAsset.img.wmin = minWidth;
            ortbAsset.img.hmin = minHeight;
          }
          const aspectRatios = asset.aspect_ratios.filter((ar) => ar.ratio_width && ar.ratio_height).map((ratio) => `${ratio.ratio_width}:${ratio.ratio_height}`);
          if (aspectRatios.length > 0) {
            ortbAsset.img.ext = {
              aspectratios: aspectRatios
            };
          }
        }
      }
      if (asset.sizes) {
        if (asset.sizes.length !== 2 || !isInteger(asset.sizes[0]) || !isInteger(asset.sizes[1])) {
          logError("image.sizes was passed, but its value is not an array of integers:", asset.sizes);
        } else {
          ortbAsset.img.w = asset.sizes[0];
          ortbAsset.img.h = asset.sizes[1];
          delete ortbAsset.img.hmin;
          delete ortbAsset.img.wmin;
        }
      }
    } else if (key === "title") {
      ortbAsset.title = {
        // in openRTB, len is required for titles, while in legacy prebid was not.
        // for this reason, if len is missing in legacy prebid, we're adding a default value of 140.
        len: asset.len || 140
      };
    } else if (key === "ext") {
      ortbAsset.ext = asset;
      delete ortbAsset.required;
    }
    ortb.assets.push(ortbAsset);
  }
  return ortb;
}
function fromOrtbNativeRequest(openRTBRequest) {
  if (!isOpenRTBBidRequestValid(openRTBRequest)) {
    return;
  }
  const oldNativeObject = {};
  for (const asset of openRTBRequest.assets) {
    if (asset.title) {
      const title = {
        required: asset.required ? Boolean(asset.required) : false,
        len: asset.title.len
      };
      oldNativeObject.title = title;
    } else if (asset.img) {
      const image = {
        required: asset.required ? Boolean(asset.required) : false
      };
      if (asset.img.w && asset.img.h) {
        image.sizes = [asset.img.w, asset.img.h];
      } else if (asset.img.wmin && asset.img.hmin) {
        image.aspect_ratios = {
          min_width: asset.img.wmin,
          min_height: asset.img.hmin,
          ratio_width: asset.img.wmin,
          ratio_height: asset.img.hmin
        };
      }
      if (asset.img.type === NATIVE_IMAGE_TYPES.MAIN) {
        oldNativeObject.image = image;
      } else {
        oldNativeObject.icon = image;
      }
    } else if (asset.data) {
      let assetType = Object.keys(NATIVE_ASSET_TYPES).find((k) => NATIVE_ASSET_TYPES[k] === asset.data.type);
      let prebidAssetName = Object.keys(PREBID_NATIVE_DATA_KEYS_TO_ORTB).find((k) => PREBID_NATIVE_DATA_KEYS_TO_ORTB[k] === assetType);
      oldNativeObject[prebidAssetName] = {
        required: asset.required ? Boolean(asset.required) : false
      };
      if (asset.data.len) {
        oldNativeObject[prebidAssetName].len = asset.data.len;
      }
    }
  }
  return oldNativeObject;
}
function convertOrtbRequestToProprietaryNative(bidRequests) {
  if (FEATURES.NATIVE) {
    if (!bidRequests || !isArray(bidRequests))
      return bidRequests;
    if (!bidRequests.some((bidRequest) => (bidRequest?.mediaTypes || {})[NATIVE]?.ortb)) {
      return bidRequests;
    }
    let bidRequestsCopy = deepClone(bidRequests);
    for (const bidRequest of bidRequestsCopy) {
      if (bidRequest.mediaTypes && bidRequest.mediaTypes[NATIVE] && bidRequest.mediaTypes[NATIVE].ortb) {
        bidRequest.mediaTypes[NATIVE] = Object.assign(
          pick(bidRequest.mediaTypes[NATIVE], NATIVE_KEYS_THAT_ARE_NOT_ASSETS),
          fromOrtbNativeRequest(bidRequest.mediaTypes[NATIVE].ortb)
        );
        bidRequest.nativeParams = processNativeAdUnitParams(bidRequest.mediaTypes[NATIVE]);
      }
    }
    return bidRequestsCopy;
  }
  return bidRequests;
}
function legacyPropertiesToOrtbNative(legacyNative) {
  const response = {
    link: {},
    eventtrackers: []
  };
  Object.entries(legacyNative).forEach(([key, value]) => {
    switch (key) {
      case "clickUrl":
        response.link.url = value;
        break;
      case "clickTrackers":
        response.link.clicktrackers = Array.isArray(value) ? value : [value];
        break;
      case "impressionTrackers":
        (Array.isArray(value) ? value : [value]).forEach((url) => {
          response.eventtrackers.push({
            event: TRACKER_EVENTS.impression,
            method: TRACKER_METHODS.img,
            url
          });
        });
        break;
      case "javascriptTrackers":
        response.jstracker = Array.isArray(value) ? value.join("") : value;
        break;
    }
  });
  return response;
}
function toOrtbNativeResponse(legacyResponse, ortbRequest) {
  const ortbResponse = {
    ...legacyPropertiesToOrtbNative(legacyResponse),
    assets: []
  };
  function useRequestAsset(predicate, fn) {
    let asset = ortbRequest.assets.find(predicate);
    if (asset != null) {
      asset = deepClone(asset);
      fn(asset);
      ortbResponse.assets.push(asset);
    }
  }
  Object.keys(legacyResponse).filter((key) => !!legacyResponse[key]).forEach((key) => {
    const value = getAssetValue(legacyResponse[key]);
    switch (key) {
      case "title":
        useRequestAsset((asset) => asset.title != null, (titleAsset) => {
          titleAsset.title = {
            text: value
          };
        });
        break;
      case "image":
      case "icon":
        const imageType = key === "image" ? NATIVE_IMAGE_TYPES.MAIN : NATIVE_IMAGE_TYPES.ICON;
        useRequestAsset((asset) => asset.img != null && asset.img.type === imageType, (imageAsset) => {
          imageAsset.img = {
            url: value
          };
        });
        break;
      default:
        if (key in PREBID_NATIVE_DATA_KEYS_TO_ORTB) {
          useRequestAsset((asset) => asset.data != null && asset.data.type === NATIVE_ASSET_TYPES[PREBID_NATIVE_DATA_KEYS_TO_ORTB[key]], (dataAsset) => {
            dataAsset.data = {
              value
            };
          });
        }
        break;
    }
  });
  return ortbResponse;
}
function toLegacyResponse(ortbResponse, ortbRequest) {
  const legacyResponse = {};
  const requestAssets = ortbRequest?.assets || [];
  legacyResponse.clickUrl = ortbResponse.link.url;
  legacyResponse.privacyLink = ortbResponse.privacy;
  for (const asset of ortbResponse?.assets || []) {
    const requestAsset = requestAssets.find((reqAsset) => asset.id === reqAsset.id);
    if (asset.title) {
      legacyResponse.title = asset.title.text;
    } else if (asset.img) {
      legacyResponse[requestAsset.img.type === NATIVE_IMAGE_TYPES.MAIN ? "image" : "icon"] = {
        url: asset.img.url,
        width: asset.img.w,
        height: asset.img.h
      };
    } else if (asset.data) {
      legacyResponse[PREBID_NATIVE_DATA_KEYS_TO_ORTB_INVERSE[NATIVE_ASSET_TYPES_INVERSE[requestAsset.data.type]]] = asset.data.value;
    }
  }
  legacyResponse.impressionTrackers = [];
  let jsTrackers = [];
  if (ortbRequest?.imptrackers) {
    legacyResponse.impressionTrackers.push(...ortbRequest.imptrackers);
  }
  for (const eventTracker of ortbResponse?.eventtrackers || []) {
    if (eventTracker.event === TRACKER_EVENTS.impression && eventTracker.method === TRACKER_METHODS.img) {
      legacyResponse.impressionTrackers.push(eventTracker.url);
    }
    if (eventTracker.event === TRACKER_EVENTS.impression && eventTracker.method === TRACKER_METHODS.js) {
      jsTrackers.push(eventTracker.url);
    }
  }
  jsTrackers = jsTrackers.map((url) => `<script async src="${url}"></script>`);
  if (ortbResponse?.jstracker) {
    jsTrackers.push(ortbResponse.jstracker);
  }
  if (jsTrackers.length) {
    legacyResponse.javascriptTrackers = jsTrackers.join("\n");
  }
  return legacyResponse;
}
function inverse(obj) {
  var retobj = {};
  for (var key in obj) {
    retobj[obj[key]] = key;
  }
  return retobj;
}

// src/adUnits.js
var adUnits = {};
function ensureAdUnit(adunit, bidderCode) {
  let adUnit = adUnits[adunit] = adUnits[adunit] || { bidders: {} };
  if (bidderCode) {
    return adUnit.bidders[bidderCode] = adUnit.bidders[bidderCode] || {};
  }
  return adUnit;
}
function incrementAdUnitCount(adunit, counter, bidderCode) {
  let adUnit = ensureAdUnit(adunit, bidderCode);
  adUnit[counter] = (adUnit[counter] || 0) + 1;
  return adUnit[counter];
}
function incrementRequestsCounter(adunit) {
  return incrementAdUnitCount(adunit, "requestsCounter");
}
function incrementBidderRequestsCounter(adunit, bidderCode) {
  return incrementAdUnitCount(adunit, "requestsCounter", bidderCode);
}
function incrementBidderWinsCounter(adunit, bidderCode) {
  return incrementAdUnitCount(adunit, "winsCounter", bidderCode);
}
function getRequestsCounter(adunit) {
  return dlv(adUnits, `${adunit}.requestsCounter`) || 0;
}
function getBidderRequestsCounter(adunit, bidder) {
  return dlv(adUnits, `${adunit}.bidders.${bidder}.requestsCounter`) || 0;
}
function getBidderWinsCounter(adunit, bidder) {
  return dlv(adUnits, `${adunit}.bidders.${bidder}.winsCounter`) || 0;
}
var adunitCounter = {
  incrementRequestsCounter,
  incrementBidderRequestsCounter,
  incrementBidderWinsCounter,
  getRequestsCounter,
  getBidderRequestsCounter,
  getBidderWinsCounter
};

// src/refererDetection.js
function ensureProtocol(url, win = window) {
  if (!url)
    return url;
  if (/\w+:\/\//.exec(url)) {
    return url;
  }
  let windowProto = win.location.protocol;
  try {
    windowProto = win.top.location.protocol;
  } catch (e) {
  }
  if (/^\/\//.exec(url)) {
    return windowProto + url;
  } else {
    return `${windowProto}//${url}`;
  }
}
function parseDomain(url, { noLeadingWww = false, noPort = false } = {}) {
  try {
    url = new URL(ensureProtocol(url));
  } catch (e) {
    return;
  }
  url = noPort ? url.hostname : url.host;
  if (noLeadingWww && url.startsWith("www.")) {
    url = url.substring(4);
  }
  return url;
}
function getCanonicalUrl(doc) {
  try {
    const element = doc.querySelector("link[rel='canonical']");
    if (element !== null) {
      return element.href;
    }
  } catch (e) {
  }
  return null;
}
function detectReferer(win) {
  function getAncestorOrigins(win2) {
    try {
      if (!win2.location.ancestorOrigins) {
        return;
      }
      return win2.location.ancestorOrigins;
    } catch (e) {
    }
  }
  function refererInfo() {
    const stack = [];
    const ancestors = getAncestorOrigins(win);
    const maxNestedIframes = config.getConfig("maxNestedIframes");
    let currentWindow;
    let bestLocation;
    let bestCanonicalUrl;
    let reachedTop = false;
    let level = 0;
    let valuesFromAmp = false;
    let inAmpFrame = false;
    let hasTopLocation = false;
    do {
      const previousWindow = currentWindow;
      const wasInAmpFrame = inAmpFrame;
      let currentLocation;
      let crossOrigin = false;
      let foundLocation = null;
      inAmpFrame = false;
      currentWindow = currentWindow ? currentWindow.parent : win;
      try {
        currentLocation = currentWindow.location.href || null;
      } catch (e) {
        crossOrigin = true;
      }
      if (crossOrigin) {
        if (wasInAmpFrame) {
          const context = previousWindow.context;
          try {
            foundLocation = context.sourceUrl;
            bestLocation = foundLocation;
            hasTopLocation = true;
            valuesFromAmp = true;
            if (currentWindow === win.top) {
              reachedTop = true;
            }
            if (context.canonicalUrl) {
              bestCanonicalUrl = context.canonicalUrl;
            }
          } catch (e) {
          }
        } else {
          logWarn("Trying to access cross domain iframe. Continuing without referrer and location");
          try {
            const referrer = previousWindow.document.referrer;
            if (referrer) {
              foundLocation = referrer;
              if (currentWindow === win.top) {
                reachedTop = true;
              }
            }
          } catch (e) {
          }
          if (!foundLocation && ancestors && ancestors[level - 1]) {
            foundLocation = ancestors[level - 1];
            if (currentWindow === win.top) {
              hasTopLocation = true;
            }
          }
          if (foundLocation && !valuesFromAmp) {
            bestLocation = foundLocation;
          }
        }
      } else {
        if (currentLocation) {
          foundLocation = currentLocation;
          bestLocation = foundLocation;
          valuesFromAmp = false;
          if (currentWindow === win.top) {
            reachedTop = true;
            const canonicalUrl2 = getCanonicalUrl(currentWindow.document);
            if (canonicalUrl2) {
              bestCanonicalUrl = canonicalUrl2;
            }
          }
        }
        if (currentWindow.context && currentWindow.context.sourceUrl) {
          inAmpFrame = true;
        }
      }
      stack.push(foundLocation);
      level++;
    } while (currentWindow !== win.top && level < maxNestedIframes);
    stack.reverse();
    let ref;
    try {
      ref = win.top.document.referrer;
    } catch (e) {
    }
    const location = reachedTop || hasTopLocation ? bestLocation : null;
    const canonicalUrl = config.getConfig("pageUrl") || bestCanonicalUrl || null;
    let page = config.getConfig("pageUrl") || location || ensureProtocol(canonicalUrl, win);
    if (location && location.indexOf("?") > -1 && page.indexOf("?") === -1) {
      page = `${page}${location.substring(location.indexOf("?"))}`;
    }
    return {
      reachedTop,
      isAmp: valuesFromAmp,
      numIframes: level - 1,
      stack,
      topmostLocation: bestLocation || null,
      location,
      canonicalUrl,
      page,
      domain: parseDomain(page) || null,
      ref: ref || null,
      // TODO: the "legacy" refererInfo object is provided here, for now, to accomodate
      // adapters that decided to just send it verbatim to their backend.
      legacy: {
        reachedTop,
        isAmp: valuesFromAmp,
        numIframes: level - 1,
        stack,
        referer: bestLocation || null,
        canonicalUrl
      }
    };
  }
  return refererInfo;
}
function cacheWithLocation(fn, win = window) {
  if (win.top !== win)
    return fn;
  let canonical, href, value;
  return function() {
    const newCanonical = getCanonicalUrl(win.document);
    const newHref = win.location.href;
    if (canonical !== newCanonical || newHref !== href) {
      canonical = newCanonical;
      href = newHref;
      value = fn();
    }
    return value;
  };
}
var getRefererInfo = cacheWithLocation(detectReferer(window));

// src/consentHandler.js
var VENDORLESS_GVLID = Object.freeze({});
var ConsentHandler = class {
  #enabled;
  #data;
  #defer;
  #ready;
  generatedTime;
  constructor() {
    this.reset();
  }
  #resolve(data) {
    this.#ready = true;
    this.#data = data;
    this.#defer.resolve(data);
  }
  /**
   * reset this handler (mainly for tests)
   */
  reset() {
    this.#defer = defer();
    this.#enabled = false;
    this.#data = null;
    this.#ready = false;
    this.generatedTime = null;
  }
  /**
   * Enable this consent handler. This should be called by the relevant consent management module
   * on initialization.
   */
  enable() {
    this.#enabled = true;
  }
  /**
   * @returns {boolean} true if the related consent management module is enabled.
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * @returns {boolean} true if consent data has been resolved (it may be `null` if the resolution failed).
   */
  get ready() {
    return this.#ready;
  }
  /**
   * @returns a promise than resolves to the consent data, or null if no consent data is available
   */
  get promise() {
    if (this.#ready) {
      return GreedyPromise.resolve(this.#data);
    }
    if (!this.#enabled) {
      this.#resolve(null);
    }
    return this.#defer.promise;
  }
  setConsentData(data, time = timestamp()) {
    this.generatedTime = time;
    this.#resolve(data);
  }
  getConsentData() {
    return this.#data;
  }
};
var UspConsentHandler = class extends ConsentHandler {
  getConsentMeta() {
    const consentData = this.getConsentData();
    if (consentData && this.generatedTime) {
      return {
        usp: consentData,
        generatedAt: this.generatedTime
      };
    }
  }
};
var GdprConsentHandler = class extends ConsentHandler {
  getConsentMeta() {
    const consentData = this.getConsentData();
    if (consentData && consentData.vendorData && this.generatedTime) {
      return {
        gdprApplies: consentData.gdprApplies,
        consentStringSize: isStr(consentData.vendorData.tcString) ? consentData.vendorData.tcString.length : 0,
        generatedAt: this.generatedTime,
        apiVersion: consentData.apiVersion
      };
    }
  }
};
var GppConsentHandler = class extends ConsentHandler {
  getConsentMeta() {
    const consentData = this.getConsentData();
    if (consentData && this.generatedTime) {
      return {
        generatedAt: this.generatedTime
      };
    }
  }
};
function gvlidRegistry() {
  const registry = {};
  const flat = {};
  const none = {};
  return {
    /**
     * Register a module's GVL ID.
     * @param {string} moduleType defined in `activities/modules.js`
     * @param {string} moduleName
     * @param {number} gvlid
     */
    register(moduleType, moduleName, gvlid) {
      if (gvlid) {
        (registry[moduleName] = registry[moduleName] || {})[moduleType] = gvlid;
        if (flat.hasOwnProperty(moduleName)) {
          if (flat[moduleName] !== gvlid)
            flat[moduleName] = none;
        } else {
          flat[moduleName] = gvlid;
        }
      }
    },
    /**
     * Get a module's GVL ID(s).
     *
     * @param {string} moduleName
     * @return {{modules: {[moduleType]: number}, gvlid?: number}} an object where:
     *   `modules` is a map from module type to that module's GVL ID;
     *   `gvlid` is the single GVL ID for this family of modules (only defined
     *   if all modules with this name declared the same ID).
     */
    get(moduleName) {
      const result = { modules: registry[moduleName] || {} };
      if (flat.hasOwnProperty(moduleName) && flat[moduleName] !== none) {
        result.gvlid = flat[moduleName];
      }
      return result;
    }
  };
}
var GDPR_GVLIDS = gvlidRegistry();

// src/adapterManager.js
var PARTITIONS = {
  CLIENT: "client",
  SERVER: "server"
};
var adapterManager = {};
var _bidderRegistry = adapterManager.bidderRegistry = {};
var _aliasRegistry = adapterManager.aliasRegistry = {};
var _s2sConfigs = [];
config.getConfig("s2sConfig", (config2) => {
  if (config2 && config2.s2sConfig) {
    _s2sConfigs = isArray(config2.s2sConfig) ? config2.s2sConfig : [config2.s2sConfig];
  }
});
var _analyticsRegistry = {};
function getBids({ bidderCode, auctionId, bidderRequestId, adUnits: adUnits2, src, metrics }) {
  return adUnits2.reduce((result, adUnit) => {
    const bids = adUnit.bids.filter((bid) => bid.bidder === bidderCode);
    if (bidderCode == null && bids.length === 0 && adUnit.s2sBid != null) {
      bids.push({ bidder: null });
    }
    result.push(
      bids.reduce((bids2, bid) => {
        bid = Object.assign(
          {},
          bid,
          { ortb2Imp: mergeDeep({}, adUnit.ortb2Imp, bid.ortb2Imp) },
          getDefinedParams(adUnit, [
            "nativeParams",
            "nativeOrtbRequest",
            "mediaType",
            "renderer"
          ])
        );
        const mediaTypes = bid.mediaTypes == null ? adUnit.mediaTypes : bid.mediaTypes;
        if (isValidMediaTypes(mediaTypes)) {
          bid = Object.assign({}, bid, {
            mediaTypes
          });
        } else {
          logError(
            `mediaTypes is not correctly configured for adunit ${adUnit.code}`
          );
        }
        bids2.push(Object.assign({}, bid, {
          adUnitCode: adUnit.code,
          transactionId: adUnit.transactionId,
          sizes: dlv(mediaTypes, "banner.sizes") || dlv(mediaTypes, "video.playerSize") || [],
          bidId: bid.bid_id || getUniqueIdentifierStr(),
          bidderRequestId,
          auctionId,
          src,
          metrics,
          bidRequestsCount: adunitCounter.getRequestsCounter(adUnit.code),
          bidderRequestsCount: adunitCounter.getBidderRequestsCounter(adUnit.code, bid.bidder),
          bidderWinsCount: adunitCounter.getBidderWinsCounter(adUnit.code, bid.bidder)
        }));
        return bids2;
      }, [])
    );
    return result;
  }, []).reduce(flatten, []).filter((val) => val !== "");
}
var hookedGetBids = hook("sync", getBids, "getBids");
function _filterBidsForAdUnit(bids, s2sConfig, { getS2SBidders = getS2SBidderSet } = {}) {
  if (s2sConfig == null) {
    return bids;
  } else {
    const serverBidders = getS2SBidders(s2sConfig);
    return bids.filter((bid) => serverBidders.has(bid.bidder));
  }
}
var filterBidsForAdUnit = hook("sync", _filterBidsForAdUnit, "filterBidsForAdUnit");
function getAdUnitCopyForPrebidServer(adUnits2, s2sConfig) {
  let adUnitsCopy = deepClone(adUnits2);
  let hasModuleBids = false;
  adUnitsCopy.forEach((adUnit) => {
    const s2sBids = adUnit.bids.filter((b) => b.module === "pbsBidAdapter" && b.params?.configName === s2sConfig.configName);
    if (s2sBids.length === 1) {
      adUnit.s2sBid = s2sBids[0];
      hasModuleBids = true;
      adUnit.ortb2Imp = mergeDeep({}, adUnit.s2sBid.ortb2Imp, adUnit.ortb2Imp);
    } else if (s2sBids.length > 1) {
      logWarn('Multiple "module" bids for the same s2s configuration; all will be ignored', s2sBids);
    }
    adUnit.bids = filterBidsForAdUnit(adUnit.bids, s2sConfig).map((bid) => {
      bid.bid_id = getUniqueIdentifierStr();
      return bid;
    });
  });
  adUnitsCopy = adUnitsCopy.filter((adUnit) => {
    return adUnit.bids.length !== 0 || adUnit.s2sBid != null;
  });
  return { adUnits: adUnitsCopy, hasModuleBids };
}
function getAdUnitCopyForClientAdapters(adUnits2) {
  let adUnitsClientCopy = deepClone(adUnits2);
  adUnitsClientCopy.forEach((adUnit) => {
    adUnit.bids = filterBidsForAdUnit(adUnit.bids, null);
  });
  adUnitsClientCopy = adUnitsClientCopy.filter((adUnit) => {
    return adUnit.bids.length !== 0;
  });
  return adUnitsClientCopy;
}
var gdprDataHandler = new GdprConsentHandler();
var uspDataHandler = new UspConsentHandler();
var gppDataHandler = new GppConsentHandler();
var setupAdUnitMediaTypes = hook("sync", (adUnits2, labels) => {
  return processAdUnitsForLabels(adUnits2, labels);
}, "setupAdUnitMediaTypes");
function getS2SBidderSet(s2sConfigs) {
  if (!isArray(s2sConfigs))
    s2sConfigs = [s2sConfigs];
  const serverBidders = /* @__PURE__ */ new Set([null]);
  s2sConfigs.filter((s2s) => s2s && s2s.enabled).flatMap((s2s) => s2s.bidders).forEach((bidder) => serverBidders.add(bidder));
  return serverBidders;
}
function _partitionBidders(adUnits2, s2sConfigs, { getS2SBidders = getS2SBidderSet } = {}) {
  const serverBidders = getS2SBidders(s2sConfigs);
  return getBidderCodes(adUnits2).reduce((memo, bidder) => {
    const partition = serverBidders.has(bidder) ? PARTITIONS.SERVER : PARTITIONS.CLIENT;
    memo[partition].push(bidder);
    return memo;
  }, { [PARTITIONS.CLIENT]: [], [PARTITIONS.SERVER]: [] });
}
var partitionBidders = hook("sync", _partitionBidders, "partitionBidders");
adapterManager.makeBidRequests = hook("sync", function(adUnits2, auctionStart, auctionId, cbTimeout, labels, ortb2Fragments = {}, auctionMetrics) {
  auctionMetrics = useMetrics(auctionMetrics);
  emit(constants_default.EVENTS.BEFORE_REQUEST_BIDS, adUnits2);
  if (FEATURES.NATIVE) {
    decorateAdUnitsWithNativeParams(adUnits2);
  }
  adUnits2 = setupAdUnitMediaTypes(adUnits2, labels);
  let { [PARTITIONS.CLIENT]: clientBidders, [PARTITIONS.SERVER]: serverBidders } = partitionBidders(adUnits2, _s2sConfigs);
  if (config.getConfig("bidderSequence") === RANDOM) {
    clientBidders = shuffle(clientBidders);
  }
  const refererInfo = getRefererInfo();
  let bidRequests = [];
  const ortb2 = ortb2Fragments.global || {};
  const bidderOrtb2 = ortb2Fragments.bidder || {};
  function addOrtb2(bidderRequest) {
    const fpd = Object.freeze(mergeDeep({}, ortb2, bidderOrtb2[bidderRequest.bidderCode]));
    bidderRequest.ortb2 = fpd;
    bidderRequest.bids.forEach((bid) => bid.ortb2 = fpd);
    return bidderRequest;
  }
  _s2sConfigs.forEach((s2sConfig) => {
    if (s2sConfig && s2sConfig.enabled) {
      let { adUnits: adUnitsS2SCopy, hasModuleBids } = getAdUnitCopyForPrebidServer(adUnits2, s2sConfig);
      let uniquePbsTid = generateUUID();
      (serverBidders.length === 0 && hasModuleBids ? [null] : serverBidders).forEach((bidderCode) => {
        const bidderRequestId = getUniqueIdentifierStr();
        const metrics = auctionMetrics.fork();
        const bidderRequest = addOrtb2({
          bidderCode,
          auctionId,
          bidderRequestId,
          uniquePbsTid,
          bids: hookedGetBids({ bidderCode, auctionId, bidderRequestId, "adUnits": deepClone(adUnitsS2SCopy), src: constants_default.S2S.SRC, metrics }),
          auctionStart,
          timeout: s2sConfig.timeout,
          src: constants_default.S2S.SRC,
          refererInfo,
          metrics
        });
        if (bidderRequest.bids.length !== 0) {
          bidRequests.push(bidderRequest);
        }
      });
      adUnitsS2SCopy.forEach((adUnitCopy) => {
        let validBids = adUnitCopy.bids.filter((adUnitBid) => find(bidRequests, (request) => find(request.bids, (reqBid) => reqBid.bidId === adUnitBid.bid_id)));
        adUnitCopy.bids = validBids;
      });
      bidRequests.forEach((request) => {
        if (request.adUnitsS2SCopy === void 0) {
          request.adUnitsS2SCopy = adUnitsS2SCopy.filter((au) => au.bids.length > 0 || au.s2sBid != null);
        }
      });
    }
  });
  let adUnitsClientCopy = getAdUnitCopyForClientAdapters(adUnits2);
  clientBidders.forEach((bidderCode) => {
    const bidderRequestId = getUniqueIdentifierStr();
    const metrics = auctionMetrics.fork();
    const bidderRequest = addOrtb2({
      bidderCode,
      auctionId,
      bidderRequestId,
      bids: hookedGetBids({ bidderCode, auctionId, bidderRequestId, "adUnits": deepClone(adUnitsClientCopy), labels, src: "client", metrics }),
      auctionStart,
      timeout: cbTimeout,
      refererInfo,
      metrics
    });
    const adapter = _bidderRegistry[bidderCode];
    if (!adapter) {
      logError(`Trying to make a request for bidder that does not exist: ${bidderCode}`);
    }
    if (adapter && bidderRequest.bids && bidderRequest.bids.length !== 0) {
      bidRequests.push(bidderRequest);
    }
  });
  bidRequests.forEach((bidRequest) => {
    if (gdprDataHandler.getConsentData()) {
      bidRequest["gdprConsent"] = gdprDataHandler.getConsentData();
    }
    if (uspDataHandler.getConsentData()) {
      bidRequest["uspConsent"] = uspDataHandler.getConsentData();
    }
    if (gppDataHandler.getConsentData()) {
      bidRequest["gppConsent"] = gppDataHandler.getConsentData();
    }
  });
  return bidRequests;
}, "makeBidRequests");
adapterManager.callBids = (adUnits2, bidRequests, addBidResponse2, doneCb, requestCallbacks, requestBidsTimeout, onTimelyResponse, ortb2Fragments = {}) => {
  if (!bidRequests.length) {
    logWarn("callBids executed with no bidRequests.  Were they filtered by labels or sizing?");
    return;
  }
  let [clientBidRequests, serverBidRequests] = bidRequests.reduce((partitions, bidRequest) => {
    partitions[Number(typeof bidRequest.src !== "undefined" && bidRequest.src === constants_default.S2S.SRC)].push(bidRequest);
    return partitions;
  }, [[], []]);
  var uniqueServerBidRequests = [];
  serverBidRequests.forEach((serverBidRequest) => {
    var index = -1;
    for (var i = 0; i < uniqueServerBidRequests.length; ++i) {
      if (serverBidRequest.uniquePbsTid === uniqueServerBidRequests[i].uniquePbsTid) {
        index = i;
        break;
      }
    }
    if (index <= -1) {
      uniqueServerBidRequests.push(serverBidRequest);
    }
  });
  let counter = 0;
  _s2sConfigs.forEach((s2sConfig) => {
    if (s2sConfig && uniqueServerBidRequests[counter] && getS2SBidderSet(s2sConfig).has(uniqueServerBidRequests[counter].bidderCode)) {
      const s2sAjax = ajaxBuilder(requestBidsTimeout, requestCallbacks ? {
        request: requestCallbacks.request.bind(null, "s2s"),
        done: requestCallbacks.done
      } : void 0);
      let adaptersServerSide = s2sConfig.bidders;
      const s2sAdapter = _bidderRegistry[s2sConfig.adapter];
      let uniquePbsTid = uniqueServerBidRequests[counter].uniquePbsTid;
      let adUnitsS2SCopy = uniqueServerBidRequests[counter].adUnitsS2SCopy;
      let uniqueServerRequests = serverBidRequests.filter((serverBidRequest) => serverBidRequest.uniquePbsTid === uniquePbsTid);
      if (s2sAdapter) {
        let s2sBidRequest = { "ad_units": adUnitsS2SCopy, s2sConfig, ortb2Fragments };
        if (s2sBidRequest.ad_units.length) {
          let doneCbs = uniqueServerRequests.map((bidRequest) => {
            bidRequest.start = timestamp();
            return doneCb.bind(bidRequest);
          });
          const bidders = getBidderCodes(s2sBidRequest.ad_units).filter((bidder) => adaptersServerSide.includes(bidder));
          logMessage(`CALLING S2S HEADER BIDDERS ==== ${bidders.length > 0 ? bidders.join(", ") : 'No bidder specified, using "ortb2Imp" definition(s) only'}`);
          uniqueServerRequests.forEach((bidRequest) => {
            emit(constants_default.EVENTS.BID_REQUESTED, { ...bidRequest, tid: bidRequest.auctionId });
          });
          s2sAdapter.callBids(
            s2sBidRequest,
            serverBidRequests,
            addBidResponse2,
            () => doneCbs.forEach((done) => done()),
            s2sAjax
          );
        }
      } else {
        logError("missing " + s2sConfig.adapter);
      }
      counter++;
    }
  });
  clientBidRequests.forEach((bidRequest) => {
    bidRequest.start = timestamp();
    const adapter = _bidderRegistry[bidRequest.bidderCode];
    config.runWithBidder(bidRequest.bidderCode, () => {
      logMessage(`CALLING BIDDER`);
      emit(constants_default.EVENTS.BID_REQUESTED, bidRequest);
    });
    let ajax2 = ajaxBuilder(requestBidsTimeout, requestCallbacks ? {
      request: requestCallbacks.request.bind(null, bidRequest.bidderCode),
      done: requestCallbacks.done
    } : void 0);
    const adapterDone = doneCb.bind(bidRequest);
    try {
      config.runWithBidder(
        bidRequest.bidderCode,
        bind.call(
          adapter.callBids,
          adapter,
          bidRequest,
          addBidResponse2,
          adapterDone,
          ajax2,
          onTimelyResponse,
          config.callbackWithBidder(bidRequest.bidderCode)
        )
      );
    } catch (e) {
      logError(`${bidRequest.bidderCode} Bid Adapter emitted an uncaught error when parsing their bidRequest`, { e, bidRequest });
      adapterDone();
    }
  });
};
function getSupportedMediaTypes(bidderCode) {
  let supportedMediaTypes = [];
  if (FEATURES.VIDEO && includes(adapterManager.videoAdapters, bidderCode))
    supportedMediaTypes.push("video");
  if (FEATURES.NATIVE && includes(nativeAdapters, bidderCode))
    supportedMediaTypes.push("native");
  return supportedMediaTypes;
}
adapterManager.videoAdapters = [];
adapterManager.registerBidAdapter = function(bidAdapter, bidderCode, { supportedMediaTypes = [] } = {}) {
  if (bidAdapter && bidderCode) {
    if (typeof bidAdapter.callBids === "function") {
      _bidderRegistry[bidderCode] = bidAdapter;
      GDPR_GVLIDS.register(MODULE_TYPE_BIDDER, bidderCode, bidAdapter.getSpec?.().gvlid);
      if (FEATURES.VIDEO && includes(supportedMediaTypes, "video")) {
        adapterManager.videoAdapters.push(bidderCode);
      }
      if (FEATURES.NATIVE && includes(supportedMediaTypes, "native")) {
        nativeAdapters.push(bidderCode);
      }
    } else {
      logError("Bidder adaptor error for bidder code: " + bidderCode + "bidder must implement a callBids() function");
    }
  } else {
    logError("bidAdapter or bidderCode not specified");
  }
};
adapterManager.aliasBidAdapter = function(bidderCode, alias, options) {
  let existingAlias = _bidderRegistry[alias];
  if (typeof existingAlias === "undefined") {
    let bidAdapter = _bidderRegistry[bidderCode];
    if (typeof bidAdapter === "undefined") {
      const nonS2SAlias = [];
      _s2sConfigs.forEach((s2sConfig) => {
        if (s2sConfig.bidders && s2sConfig.bidders.length) {
          const s2sBidders = s2sConfig && s2sConfig.bidders;
          if (!(s2sConfig && includes(s2sBidders, alias))) {
            nonS2SAlias.push(bidderCode);
          } else {
            _aliasRegistry[alias] = bidderCode;
          }
        }
      });
      nonS2SAlias.forEach((bidderCode2) => {
        logError('bidderCode "' + bidderCode2 + '" is not an existing bidder.', "adapterManager.aliasBidAdapter");
      });
    } else {
      try {
        let newAdapter;
        let supportedMediaTypes = getSupportedMediaTypes(bidderCode);
        if (bidAdapter.constructor.prototype != Object.prototype) {
          newAdapter = new bidAdapter.constructor();
          newAdapter.setBidderCode(alias);
        } else {
          let spec2 = bidAdapter.getSpec();
          let gvlid = options && options.gvlid;
          let skipPbsAliasing = options && options.skipPbsAliasing;
          newAdapter = newBidder(Object.assign({}, spec2, { code: alias, gvlid, skipPbsAliasing }));
          _aliasRegistry[alias] = bidderCode;
        }
        adapterManager.registerBidAdapter(newAdapter, alias, {
          supportedMediaTypes
        });
      } catch (e) {
        logError(bidderCode + " bidder does not currently support aliasing.", "adapterManager.aliasBidAdapter");
      }
    }
  } else {
    logMessage('alias name "' + alias + '" has been already specified.');
  }
};
adapterManager.registerAnalyticsAdapter = function({ adapter, code, gvlid }) {
  if (adapter && code) {
    if (typeof adapter.enableAnalytics === "function") {
      adapter.code = code;
      _analyticsRegistry[code] = { adapter, gvlid };
      GDPR_GVLIDS.register(MODULE_TYPE_ANALYTICS, code, gvlid);
    } else {
      logError(`Prebid Error: Analytics adaptor error for analytics "${code}"
        analytics adapter must implement an enableAnalytics() function`);
    }
  } else {
    logError("Prebid Error: analyticsAdapter or analyticsCode not specified");
  }
};
adapterManager.enableAnalytics = function(config2) {
  if (!isArray(config2)) {
    config2 = [config2];
  }
  _each(config2, (adapterConfig) => {
    const entry = _analyticsRegistry[adapterConfig.provider];
    if (entry && entry.adapter) {
      entry.adapter.enableAnalytics(adapterConfig);
    } else {
      logError(`Prebid Error: no analytics adapter found in registry for '${adapterConfig.provider}'.`);
    }
  });
};
adapterManager.getBidAdapter = function(bidder) {
  return _bidderRegistry[bidder];
};
adapterManager.getAnalyticsAdapter = function(code) {
  return _analyticsRegistry[code];
};
function getBidderMethod(bidder, method) {
  const adapter = _bidderRegistry[bidder];
  const spec2 = adapter?.getSpec && adapter.getSpec();
  if (spec2 && spec2[method] && typeof spec2[method] === "function") {
    return [spec2, spec2[method]];
  }
}
function invokeBidderMethod(bidder, method, spec2, fn, ...params) {
  try {
    logInfo(`Invoking ${bidder}.${method}`);
    config.runWithBidder(bidder, fn.bind(spec2, ...params));
  } catch (e) {
    logWarn(`Error calling ${method} of ${bidder}`);
  }
}
function tryCallBidderMethod(bidder, method, param) {
  const target = getBidderMethod(bidder, method);
  if (target != null) {
    invokeBidderMethod(bidder, method, ...target, param);
  }
}
adapterManager.callTimedOutBidders = function(adUnits2, timedOutBidders, cbTimeout) {
  timedOutBidders = timedOutBidders.map((timedOutBidder) => {
    timedOutBidder.params = getUserConfiguredParams(adUnits2, timedOutBidder.adUnitCode, timedOutBidder.bidder);
    timedOutBidder.timeout = cbTimeout;
    return timedOutBidder;
  });
  timedOutBidders = groupBy(timedOutBidders, "bidder");
  Object.keys(timedOutBidders).forEach((bidder) => {
    tryCallBidderMethod(bidder, "onTimeout", timedOutBidders[bidder]);
  });
};
adapterManager.callBidWonBidder = function(bidder, bid, adUnits2) {
  bid.params = getUserConfiguredParams(adUnits2, bid.adUnitCode, bid.bidder);
  adunitCounter.incrementBidderWinsCounter(bid.adUnitCode, bid.bidder);
  tryCallBidderMethod(bidder, "onBidWon", bid);
};
adapterManager.callSetTargetingBidder = function(bidder, bid) {
  tryCallBidderMethod(bidder, "onSetTargeting", bid);
};
adapterManager.callBidViewableBidder = function(bidder, bid) {
  tryCallBidderMethod(bidder, "onBidViewable", bid);
};
adapterManager.callBidderError = function(bidder, error, bidderRequest) {
  const param = { error, bidderRequest };
  tryCallBidderMethod(bidder, "onBidderError", param);
};
function resolveAlias(alias) {
  const seen = /* @__PURE__ */ new Set();
  while (_aliasRegistry.hasOwnProperty(alias) && !seen.has(alias)) {
    seen.add(alias);
    alias = _aliasRegistry[alias];
  }
  return alias;
}
adapterManager.callDataDeletionRequest = hook("sync", function(...args) {
  const method = "onDataDeletionRequest";
  Object.keys(_bidderRegistry).filter((bidder) => !_aliasRegistry.hasOwnProperty(bidder)).forEach((bidder) => {
    const target = getBidderMethod(bidder, method);
    if (target != null) {
      const bidderRequests = auctionManager.getBidsRequested().filter(
        (br) => resolveAlias(br.bidderCode) === bidder
      );
      invokeBidderMethod(bidder, method, ...target, bidderRequests, ...args);
    }
  });
  Object.entries(_analyticsRegistry).forEach(([name, entry]) => {
    const fn = entry?.adapter?.[method];
    if (typeof fn === "function") {
      try {
        fn.apply(entry.adapter, args);
      } catch (e) {
        logError(`error calling ${method} of ${name}`, e);
      }
    }
  });
});
var adapterManager_default = adapterManager;

// src/adapters/bidderFactory.js
var storage2 = getCoreStorageManager("bidderFactory");
var COMMON_BID_RESPONSE_KEYS = ["cpm", "ttl", "creativeId", "netRevenue", "currency"];
var DEFAULT_REFRESHIN_DAYS = 1;
function registerBidder(spec2) {
  const mediaTypes = Array.isArray(spec2.supportedMediaTypes) ? { supportedMediaTypes: spec2.supportedMediaTypes } : void 0;
  function putBidder(spec3) {
    const bidder = newBidder(spec3);
    adapterManager_default.registerBidAdapter(bidder, spec3.code, mediaTypes);
  }
  putBidder(spec2);
  if (Array.isArray(spec2.aliases)) {
    spec2.aliases.forEach((alias) => {
      let aliasCode = alias;
      let gvlid;
      let skipPbsAliasing;
      if (isPlainObject(alias)) {
        aliasCode = alias.code;
        gvlid = alias.gvlid;
        skipPbsAliasing = alias.skipPbsAliasing;
      }
      adapterManager_default.aliasRegistry[aliasCode] = spec2.code;
      putBidder(Object.assign({}, spec2, { code: aliasCode, gvlid, skipPbsAliasing }));
    });
  }
}
function newBidder(spec2) {
  return Object.assign(new Adapter(spec2.code), {
    getSpec: function() {
      return Object.freeze(Object.assign({}, spec2));
    },
    registerSyncs,
    callBids: function(bidderRequest, addBidResponse2, done, ajax2, onTimelyResponse, configEnabledCallback) {
      if (!Array.isArray(bidderRequest.bids)) {
        return;
      }
      const adUnitCodesHandled = {};
      function addBidWithCode(adUnitCode, bid) {
        const metrics = useMetrics(bid.metrics);
        metrics.checkpoint("addBidResponse");
        adUnitCodesHandled[adUnitCode] = true;
        if (metrics.measureTime("addBidResponse.validate", () => isValid(adUnitCode, bid))) {
          addBidResponse2(adUnitCode, bid);
        } else {
          addBidResponse2.reject(adUnitCode, bid, constants_default.REJECTION_REASON.INVALID);
        }
      }
      const responses = [];
      function afterAllResponses() {
        done();
        config.runWithBidder(spec2.code, () => {
          emit(constants_default.EVENTS.BIDDER_DONE, bidderRequest);
          registerSyncs(responses, bidderRequest.gdprConsent, bidderRequest.uspConsent, bidderRequest.gppConsent);
        });
      }
      const validBidRequests = adapterMetrics(bidderRequest).measureTime("validate", () => bidderRequest.bids.filter(filterAndWarn));
      if (validBidRequests.length === 0) {
        afterAllResponses();
        return;
      }
      const bidRequestMap = {};
      validBidRequests.forEach((bid) => {
        bidRequestMap[bid.bidId] = bid;
        if (!bid.adUnitCode) {
          bid.adUnitCode = bid.placementCode;
        }
      });
      processBidderRequests(spec2, validBidRequests, bidderRequest, ajax2, configEnabledCallback, {
        onRequest: (requestObject) => emit(constants_default.EVENTS.BEFORE_BIDDER_HTTP, bidderRequest, requestObject),
        onResponse: (resp) => {
          onTimelyResponse(spec2.code);
          responses.push(resp);
        },
        /** Process eventual BidderAuctionResponse.fledgeAuctionConfig field in response.
         * @param {Array<FledgeAuctionConfig>} fledgeAuctionConfigs
         */
        onFledgeAuctionConfigs: (fledgeAuctionConfigs) => {
          fledgeAuctionConfigs.forEach((fledgeAuctionConfig) => {
            const bidRequest = bidRequestMap[fledgeAuctionConfig.bidId];
            if (bidRequest) {
              addComponentAuction(bidRequest.adUnitCode, fledgeAuctionConfig.config);
            } else {
              logWarn("Received fledge auction configuration for an unknown bidId", fledgeAuctionConfig);
            }
          });
        },
        // If the server responds with an error, there's not much we can do beside logging.
        onError: (errorMessage, error) => {
          onTimelyResponse(spec2.code);
          adapterManager_default.callBidderError(spec2.code, error, bidderRequest);
          emit(constants_default.EVENTS.BIDDER_ERROR, { error, bidderRequest });
          logError(`Server call for ${spec2.code} failed: ${errorMessage} ${error.status}. Continuing without bids.`);
        },
        onBid: (bid) => {
          const bidRequest = bidRequestMap[bid.requestId];
          if (bidRequest) {
            bid.adapterCode = bidRequest.bidder;
            if (isInvalidAlternateBidder(bid.bidderCode, bidRequest.bidder)) {
              logWarn(`${bid.bidderCode} is not a registered partner or known bidder of ${bidRequest.bidder}, hence continuing without bid. If you wish to support this bidder, please mark allowAlternateBidderCodes as true in bidderSettings.`);
              addBidResponse2.reject(bidRequest.adUnitCode, bid, constants_default.REJECTION_REASON.BIDDER_DISALLOWED);
              return;
            }
            bid.originalCpm = bid.cpm;
            bid.originalCurrency = bid.currency;
            bid.meta = bid.meta || Object.assign({}, bid[bidRequest.bidder]);
            const prebidBid = Object.assign(createBid(constants_default.STATUS.GOOD, bidRequest), bid);
            addBidWithCode(bidRequest.adUnitCode, prebidBid);
          } else {
            logWarn(`Bidder ${spec2.code} made bid for unknown request ID: ${bid.requestId}. Ignoring.`);
            addBidResponse2.reject(null, bid, constants_default.REJECTION_REASON.INVALID_REQUEST_ID);
          }
        },
        onCompletion: afterAllResponses
      });
    }
  });
  function isInvalidAlternateBidder(responseBidder, requestBidder) {
    let allowAlternateBidderCodes = bidderSettings.get(requestBidder, "allowAlternateBidderCodes") || false;
    let alternateBiddersList = bidderSettings.get(requestBidder, "allowedAlternateBidderCodes");
    if (!!responseBidder && !!requestBidder && requestBidder !== responseBidder) {
      alternateBiddersList = isArray(alternateBiddersList) ? alternateBiddersList.map((val) => val.trim().toLowerCase()).filter((val) => !!val).filter(uniques) : alternateBiddersList;
      if (!allowAlternateBidderCodes || isArray(alternateBiddersList) && (alternateBiddersList[0] !== "*" && !alternateBiddersList.includes(responseBidder))) {
        return true;
      }
    }
    return false;
  }
  function registerSyncs(responses, gdprConsent, uspConsent, gppConsent) {
    registerSyncInner(spec2, responses, gdprConsent, uspConsent, gppConsent);
  }
  function filterAndWarn(bid) {
    if (!spec2.isBidRequestValid(bid)) {
      logWarn(`Invalid bid sent to bidder ${spec2.code}: ${JSON.stringify(bid)}`);
      return false;
    }
    return true;
  }
}
var processBidderRequests = hook("sync", function(spec2, bids, bidderRequest, ajax2, wrapCallback, { onRequest, onResponse, onFledgeAuctionConfigs, onError, onBid, onCompletion }) {
  const metrics = adapterMetrics(bidderRequest);
  onCompletion = metrics.startTiming("total").stopBefore(onCompletion);
  let requests = metrics.measureTime("buildRequests", () => spec2.buildRequests(bids, bidderRequest));
  if (!requests || requests.length === 0) {
    onCompletion();
    return;
  }
  if (!Array.isArray(requests)) {
    requests = [requests];
  }
  const requestDone = delayExecution(onCompletion, requests.length);
  requests.forEach((request) => {
    const requestMetrics = metrics.fork();
    function addBid(bid) {
      if (bid != null)
        bid.metrics = requestMetrics.fork().renameWith();
      onBid(bid);
    }
    const onSuccess = wrapCallback(function(response, responseObj) {
      networkDone();
      try {
        response = JSON.parse(response);
      } catch (e) {
      }
      response = {
        body: response,
        headers: headerParser(responseObj)
      };
      onResponse(response);
      try {
        response = requestMetrics.measureTime("interpretResponse", () => spec2.interpretResponse(response, request));
      } catch (err) {
        logError(`Bidder ${spec2.code} failed to interpret the server's response. Continuing without bids`, null, err);
        requestDone();
        return;
      }
      let bids2;
      if (response && isArray(response.fledgeAuctionConfigs)) {
        onFledgeAuctionConfigs(response.fledgeAuctionConfigs);
        bids2 = response.bids;
      } else {
        bids2 = response;
      }
      if (bids2) {
        if (isArray(bids2)) {
          bids2.forEach(addBid);
        } else {
          addBid(bids2);
        }
      }
      requestDone();
      function headerParser(xmlHttpResponse) {
        return {
          get: responseObj.getResponseHeader.bind(responseObj)
        };
      }
    });
    const onFailure = wrapCallback(function(errorMessage, error) {
      networkDone();
      onError(errorMessage, error);
      requestDone();
    });
    onRequest(request);
    const networkDone = requestMetrics.startTiming("net");
    switch (request.method) {
      case "GET":
        ajax2(
          `${request.url}${formatGetParameters(request.data)}`,
          {
            success: onSuccess,
            error: onFailure
          },
          void 0,
          Object.assign({
            method: "GET",
            withCredentials: true
          }, request.options)
        );
        break;
      case "POST":
        ajax2(
          request.url,
          {
            success: onSuccess,
            error: onFailure
          },
          typeof request.data === "string" ? request.data : JSON.stringify(request.data),
          Object.assign({
            method: "POST",
            contentType: "text/plain",
            withCredentials: true
          }, request.options)
        );
        break;
      default:
        logWarn(`Skipping invalid request from ${spec2.code}. Request type ${request.type} must be GET or POST`);
        requestDone();
    }
    function formatGetParameters(data) {
      if (data) {
        return `?${typeof data === "object" ? parseQueryStringParameters(data) : data}`;
      }
      return "";
    }
  });
}, "processBidderRequests");
var registerSyncInner = hook("async", function(spec2, responses, gdprConsent, uspConsent, gppConsent) {
  const aliasSyncEnabled = config.getConfig("userSync.aliasSyncEnabled");
  if (spec2.getUserSyncs && (aliasSyncEnabled || !adapterManager_default.aliasRegistry[spec2.code])) {
    let filterConfig = config.getConfig("userSync.filterSettings");
    let syncs = spec2.getUserSyncs({
      iframeEnabled: !!(filterConfig && (filterConfig.iframe || filterConfig.all)),
      pixelEnabled: !!(filterConfig && (filterConfig.image || filterConfig.all))
    }, responses, gdprConsent, uspConsent, gppConsent);
    if (syncs) {
      if (!Array.isArray(syncs)) {
        syncs = [syncs];
      }
      syncs.forEach((sync) => {
        userSync.registerSync(sync.type, spec2.code, sync.url);
      });
      userSync.bidderDone(spec2.code);
    }
  }
}, "registerSyncs");
var addComponentAuction = hook("sync", (adUnitCode, fledgeAuctionConfig) => {
}, "addComponentAuction");
function preloadBidderMappingFile(fn, adUnits2) {
  if (FEATURES.VIDEO) {
    if (!config.getConfig("adpod.brandCategoryExclusion")) {
      return fn.call(this, adUnits2);
    }
    let adPodBidders = adUnits2.filter((adUnit) => dlv(adUnit, "mediaTypes.video.context") === ADPOD).map((adUnit) => adUnit.bids.map((bid) => bid.bidder)).reduce(flatten, []).filter(uniques);
    adPodBidders.forEach((bidder) => {
      let bidderSpec = adapterManager_default.getBidAdapter(bidder);
      if (bidderSpec.getSpec().getMappingFileInfo) {
        let info = bidderSpec.getSpec().getMappingFileInfo();
        let refreshInDays = info.refreshInDays ? info.refreshInDays : DEFAULT_REFRESHIN_DAYS;
        let key = info.localStorageKey ? info.localStorageKey : bidderSpec.getSpec().code;
        let mappingData = storage2.getDataFromLocalStorage(key);
        try {
          mappingData = mappingData ? JSON.parse(mappingData) : void 0;
          if (!mappingData || timestamp() > mappingData.lastUpdated + refreshInDays * 24 * 60 * 60 * 1e3) {
            ajax(
              info.url,
              {
                success: (response) => {
                  try {
                    response = JSON.parse(response);
                    let mapping = {
                      lastUpdated: timestamp(),
                      mapping: response.mapping
                    };
                    storage2.setDataInLocalStorage(key, JSON.stringify(mapping));
                  } catch (error) {
                    logError(`Failed to parse ${bidder} bidder translation mapping file`);
                  }
                },
                error: () => {
                  logError(`Failed to load ${bidder} bidder translation file`);
                }
              }
            );
          }
        } catch (error) {
          logError(`Failed to parse ${bidder} bidder translation mapping file`);
        }
      }
    });
    fn.call(this, adUnits2);
  } else {
    return fn.call(this, adUnits2);
  }
}
getHook("checkAdUnitSetup").before(preloadBidderMappingFile);
function getIabSubCategory(bidderCode, category) {
  let bidderSpec = adapterManager_default.getBidAdapter(bidderCode);
  if (bidderSpec.getSpec().getMappingFileInfo) {
    let info = bidderSpec.getSpec().getMappingFileInfo();
    let key = info.localStorageKey ? info.localStorageKey : bidderSpec.getBidderCode();
    let data = storage2.getDataFromLocalStorage(key);
    if (data) {
      try {
        data = JSON.parse(data);
      } catch (error) {
        logError(`Failed to parse ${bidderCode} mapping data stored in local storage`);
      }
      return data.mapping[category] ? data.mapping[category] : null;
    }
  }
}
function validBidSize(adUnitCode, bid, { index = auctionManager.index } = {}) {
  if ((bid.width || parseInt(bid.width, 10) === 0) && (bid.height || parseInt(bid.height, 10) === 0)) {
    bid.width = parseInt(bid.width, 10);
    bid.height = parseInt(bid.height, 10);
    return true;
  }
  const bidRequest = index.getBidRequest(bid);
  const mediaTypes = index.getMediaTypes(bid);
  const sizes = bidRequest && bidRequest.sizes || mediaTypes && mediaTypes.banner && mediaTypes.banner.sizes;
  const parsedSizes = parseSizesInput(sizes);
  if (parsedSizes.length === 1) {
    const [width, height] = parsedSizes[0].split("x");
    bid.width = parseInt(width, 10);
    bid.height = parseInt(height, 10);
    return true;
  }
  return false;
}
function isValid(adUnitCode, bid, { index = auctionManager.index } = {}) {
  function hasValidKeys() {
    let bidKeys = Object.keys(bid);
    return COMMON_BID_RESPONSE_KEYS.every((key) => includes(bidKeys, key) && !includes([void 0, null], bid[key]));
  }
  function errorMessage(msg) {
    return `Invalid bid from ${bid.bidderCode}. Ignoring bid: ${msg}`;
  }
  if (!adUnitCode) {
    logWarn("No adUnitCode was supplied to addBidResponse.");
    return false;
  }
  if (!bid) {
    logWarn(`Some adapter tried to add an undefined bid for ${adUnitCode}.`);
    return false;
  }
  if (!hasValidKeys()) {
    logError(errorMessage(`Bidder ${bid.bidderCode} is missing required params. Check http://prebid.org/dev-docs/bidder-adapter-1.html for list of params.`));
    return false;
  }
  if (FEATURES.NATIVE && bid.mediaType === "native" && !nativeBidIsValid(bid, { index })) {
    logError(errorMessage("Native bid missing some required properties."));
    return false;
  }
  if (FEATURES.VIDEO && bid.mediaType === "video" && !isValidVideoBid(bid, { index })) {
    logError(errorMessage(`Video bid does not have required vastUrl or renderer property`));
    return false;
  }
  if (bid.mediaType === "banner" && !validBidSize(adUnitCode, bid, { index })) {
    logError(errorMessage(`Banner bids require a width and height`));
    return false;
  }
  return true;
}
function adapterMetrics(bidderRequest) {
  return useMetrics(bidderRequest.metrics).renameWith((n) => [`adapter.client.${n}`, `adapters.client.${bidderRequest.bidderCode}.${n}`]);
}

// src/utils/gpdr.js
function hasPurpose1Consent(gdprConsent) {
  if (gdprConsent?.gdprApplies) {
    return dlv(gdprConsent, "vendorData.purpose.consents.1") === true;
  }
  return true;
}

// modules/appnexusBidAdapter.js
var BIDDER_CODE = "appnexus";
var URL2 = "https://ib.adnxs.com/ut/v3/prebid";
var URL_SIMPLE = "https://ib.adnxs-simple.com/ut/v3/prebid";
var VIDEO_TARGETING = [
  "id",
  "minduration",
  "maxduration",
  "skippable",
  "playback_method",
  "frameworks",
  "context",
  "skipoffset"
];
var VIDEO_RTB_TARGETING = ["minduration", "maxduration", "skip", "skipafter", "playbackmethod", "api", "startdelay"];
var USER_PARAMS = ["age", "externalUid", "external_uid", "segments", "gender", "dnt", "language"];
var APP_DEVICE_PARAMS = ["geo", "device_id"];
var DEBUG_PARAMS = ["enabled", "dongle", "member_id", "debug_timeout"];
var DEBUG_QUERY_PARAM_MAP = {
  "apn_debug_dongle": "dongle",
  "apn_debug_member_id": "member_id",
  "apn_debug_timeout": "debug_timeout"
};
var VIDEO_MAPPING = {
  playback_method: {
    "unknown": 0,
    "auto_play_sound_on": 1,
    "auto_play_sound_off": 2,
    "click_to_play": 3,
    "mouse_over": 4,
    "auto_play_sound_unknown": 5
  },
  context: {
    "unknown": 0,
    "pre_roll": 1,
    "mid_roll": 2,
    "post_roll": 3,
    "outstream": 4,
    "in-banner": 5
  }
};
var NATIVE_MAPPING = {
  body: "description",
  body2: "desc2",
  cta: "ctatext",
  image: {
    serverName: "main_image",
    requiredParams: { required: true }
  },
  icon: {
    serverName: "icon",
    requiredParams: { required: true }
  },
  sponsoredBy: "sponsored_by",
  privacyLink: "privacy_link",
  salePrice: "saleprice",
  displayUrl: "displayurl"
};
var SOURCE = "pbjs";
var MAX_IMPS_PER_REQUEST = 15;
var mappingFileUrl = "https://acdn.adnxs-simple.com/prebid/appnexus-mapping/mappings.json";
var SCRIPT_TAG_START = "<script";
var VIEWABILITY_URL_START = /\/\/cdn\.adnxs\.com\/v|\/\/cdn\.adnxs\-simple\.com\/v/;
var VIEWABILITY_FILE_NAME = "trk.js";
var GVLID = 32;
var storage3 = getStorageManager({ bidderCode: BIDDER_CODE });
var spec = {
  code: BIDDER_CODE,
  gvlid: GVLID,
  aliases: [
    { code: "appnexusAst", gvlid: 32 },
    { code: "emxdigital", gvlid: 183 },
    { code: "pagescience", gvlid: 32 },
    { code: "defymedia", gvlid: 32 },
    { code: "gourmetads", gvlid: 32 },
    { code: "matomy", gvlid: 32 },
    { code: "featureforward", gvlid: 32 },
    { code: "oftmedia", gvlid: 32 },
    { code: "adasta", gvlid: 32 },
    { code: "beintoo", gvlid: 618 }
  ],
  supportedMediaTypes: [BANNER, VIDEO, NATIVE],
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {object} bid The bid to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function(bid) {
    return !!(bid.params.placementId || bid.params.placement_id || bid.params.member && (bid.params.invCode || bid.params.inv_code));
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {BidRequest[]} bidRequests A non-empty list of bid requests which should be sent to the Server.
   * @return ServerRequest Info describing the request to the server.
   */
  buildRequests: function(bidRequests, bidderRequest) {
    bidRequests = convertOrtbRequestToProprietaryNative(bidRequests);
    const tags = bidRequests.map(bidToTag);
    const userObjBid = find(bidRequests, hasUserInfo);
    let userObj = {};
    if (config.getConfig("coppa") === true) {
      userObj = { "coppa": true };
    }
    if (userObjBid) {
      Object.keys(userObjBid.params.user).filter((param) => includes(USER_PARAMS, param)).forEach((param) => {
        let uparam = convertCamelToUnderscore(param);
        if (param === "segments" && isArray(userObjBid.params.user[param])) {
          let segs = [];
          userObjBid.params.user[param].forEach((val) => {
            if (isNumber(val)) {
              segs.push({ "id": val });
            } else if (isPlainObject(val)) {
              segs.push(val);
            }
          });
          userObj[uparam] = segs;
        } else if (param !== "segments") {
          userObj[uparam] = userObjBid.params.user[param];
        }
      });
    }
    const appDeviceObjBid = find(bidRequests, hasAppDeviceInfo);
    let appDeviceObj;
    if (appDeviceObjBid && appDeviceObjBid.params && appDeviceObjBid.params.app) {
      appDeviceObj = {};
      Object.keys(appDeviceObjBid.params.app).filter((param) => includes(APP_DEVICE_PARAMS, param)).forEach((param) => appDeviceObj[param] = appDeviceObjBid.params.app[param]);
    }
    const appIdObjBid = find(bidRequests, hasAppId);
    let appIdObj;
    if (appIdObjBid && appIdObjBid.params && appDeviceObjBid.params.app && appDeviceObjBid.params.app.id) {
      appIdObj = {
        appid: appIdObjBid.params.app.id
      };
    }
    let debugObj = {};
    let debugObjParams = {};
    const debugCookieName = "apn_prebid_debug";
    const debugCookie = storage3.getCookie(debugCookieName) || null;
    if (debugCookie) {
      try {
        debugObj = JSON.parse(debugCookie);
      } catch (e) {
        logError("AppNexus Debug Auction Cookie Error:\n\n" + e);
      }
    } else {
      Object.keys(DEBUG_QUERY_PARAM_MAP).forEach((qparam) => {
        let qval = getParameterByName(qparam);
        if (isStr(qval) && qval !== "") {
          debugObj[DEBUG_QUERY_PARAM_MAP[qparam]] = qval;
          debugObj.enabled = true;
        }
      });
      debugObj = convertTypes({
        "member_id": "number",
        "debug_timeout": "number"
      }, debugObj);
      const debugBidRequest = find(bidRequests, hasDebug);
      if (debugBidRequest && debugBidRequest.debug) {
        debugObj = debugBidRequest.debug;
      }
    }
    if (debugObj && debugObj.enabled) {
      Object.keys(debugObj).filter((param) => includes(DEBUG_PARAMS, param)).forEach((param) => {
        debugObjParams[param] = debugObj[param];
      });
    }
    const memberIdBid = find(bidRequests, hasMemberId);
    const member = memberIdBid ? parseInt(memberIdBid.params.member, 10) : 0;
    const schain = bidRequests[0].schain;
    const omidSupport = find(bidRequests, hasOmidSupport);
    const payload = {
      tags: [...tags],
      user: userObj,
      sdk: {
        source: SOURCE,
        version: "$prebid.version$"
      },
      schain
    };
    if (omidSupport) {
      payload["iab_support"] = {
        omidpn: "Appnexus",
        omidpv: "$prebid.version$"
      };
    }
    if (member > 0) {
      payload.member_id = member;
    }
    if (appDeviceObjBid) {
      payload.device = appDeviceObj;
    }
    if (appIdObjBid) {
      payload.app = appIdObj;
    }
    function grabOrtb2Keywords(ortb2Obj) {
      const fields = ["site.keywords", "site.content.keywords", "user.keywords", "app.keywords", "app.content.keywords"];
      let result = [];
      fields.forEach((path) => {
        let keyStr = dlv(ortb2Obj, path);
        if (isStr(keyStr))
          result.push(keyStr);
      });
      return result;
    }
    let ortb2 = deepClone(bidderRequest && bidderRequest.ortb2);
    let ortb2KeywordsObjList = grabOrtb2Keywords(ortb2).map((keyStr) => convertStringToKeywordsObj(keyStr));
    let anAuctionKeywords = deepClone(config.getConfig("appnexusAuctionKeywords")) || {};
    Object.keys(anAuctionKeywords).forEach((k) => {
      if (isStr(anAuctionKeywords[k]) || isNumber(anAuctionKeywords[k]))
        anAuctionKeywords[k] = [anAuctionKeywords[k]];
    });
    let mergedAuctionKeywords = mergeDeep({}, anAuctionKeywords, ...ortb2KeywordsObjList);
    let auctionKeywords = transformBidderParamKeywords(mergedAuctionKeywords);
    if (auctionKeywords.length > 0) {
      auctionKeywords.forEach(deleteValues);
      payload.keywords = auctionKeywords;
    }
    if (config.getConfig("adpod.brandCategoryExclusion")) {
      payload.brand_category_uniqueness = true;
    }
    if (debugObjParams.enabled) {
      payload.debug = debugObjParams;
      logInfo("AppNexus Debug Auction Settings:\n\n" + JSON.stringify(debugObjParams, null, 4));
    }
    if (bidderRequest && bidderRequest.gdprConsent) {
      payload.gdpr_consent = {
        consent_string: bidderRequest.gdprConsent.consentString,
        consent_required: bidderRequest.gdprConsent.gdprApplies
      };
      if (bidderRequest.gdprConsent.addtlConsent && bidderRequest.gdprConsent.addtlConsent.indexOf("~") !== -1) {
        let ac = bidderRequest.gdprConsent.addtlConsent;
        let acStr = ac.substring(ac.indexOf("~") + 1);
        payload.gdpr_consent.addtl_consent = acStr.split(".").map((id) => parseInt(id, 10));
      }
    }
    if (bidderRequest && bidderRequest.uspConsent) {
      payload.us_privacy = bidderRequest.uspConsent;
    }
    if (bidderRequest?.gppConsent) {
      payload.privacy = {
        gpp: bidderRequest.gppConsent.gppString,
        gpp_sid: bidderRequest.gppConsent.applicableSections
      };
    } else if (bidderRequest?.ortb2?.regs?.gpp) {
      payload.privacy = {
        gpp: bidderRequest.ortb2.regs.gpp,
        gpp_sid: bidderRequest.ortb2.regs.gpp_sid
      };
    }
    if (bidderRequest && bidderRequest.refererInfo) {
      let refererinfo = {
        // TODO: are these the correct referer values?
        rd_ref: encodeURIComponent(bidderRequest.refererInfo.topmostLocation),
        rd_top: bidderRequest.refererInfo.reachedTop,
        rd_ifs: bidderRequest.refererInfo.numIframes,
        rd_stk: bidderRequest.refererInfo.stack.map((url) => encodeURIComponent(url)).join(",")
      };
      let pubPageUrl = bidderRequest.refererInfo.canonicalUrl;
      if (isStr(pubPageUrl) && pubPageUrl !== "") {
        refererinfo.rd_can = pubPageUrl;
      }
      payload.referrer_detection = refererinfo;
    }
    if (FEATURES.VIDEO) {
      const hasAdPodBid = find(bidRequests, hasAdPod);
      if (hasAdPodBid) {
        bidRequests.filter(hasAdPod).forEach((adPodBid) => {
          const adPodTags = createAdPodRequest(tags, adPodBid);
          const nonPodTags = payload.tags.filter((tag) => tag.uuid !== adPodBid.bidId);
          payload.tags = [...nonPodTags, ...adPodTags];
        });
      }
    }
    if (bidRequests[0].userId) {
      let eids = [];
      bidRequests[0].userIdAsEids.forEach((eid) => {
        if (!eid || !eid.uids || eid.uids.length < 1) {
          return;
        }
        eid.uids.forEach((uid) => {
          let tmp = { "source": eid.source, "id": uid.id };
          if (eid.source == "adserver.org") {
            tmp.rti_partner = "TDID";
          } else if (eid.source == "uidapi.com") {
            tmp.rti_partner = "UID2";
          }
          eids.push(tmp);
        });
      });
      if (eids.length) {
        payload.eids = eids;
      }
    }
    if (tags[0].publisher_id) {
      payload.publisher_id = tags[0].publisher_id;
    }
    const request = formatRequest(payload, bidderRequest);
    return request;
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {*} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function(serverResponse, { bidderRequest }) {
    serverResponse = serverResponse.body;
    const bids = [];
    if (!serverResponse || serverResponse.error) {
      let errorMessage = `in response for ${bidderRequest.bidderCode} adapter`;
      if (serverResponse && serverResponse.error) {
        errorMessage += `: ${serverResponse.error}`;
      }
      logError(errorMessage);
      return bids;
    }
    if (serverResponse.tags) {
      serverResponse.tags.forEach((serverBid) => {
        const rtbBid = getRtbBid(serverBid);
        if (rtbBid) {
          const cpmCheck = bidderSettings.get(bidderRequest.bidderCode, "allowZeroCpmBids") === true ? rtbBid.cpm >= 0 : rtbBid.cpm > 0;
          if (cpmCheck && includes(this.supportedMediaTypes, rtbBid.ad_type)) {
            const bid = newBid(serverBid, rtbBid, bidderRequest);
            bid.mediaType = parseMediaType(rtbBid);
            bids.push(bid);
          }
        }
      });
    }
    if (serverResponse.debug && serverResponse.debug.debug_info) {
      let debugHeader = "AppNexus Debug Auction for Prebid\n\n";
      let debugText = debugHeader + serverResponse.debug.debug_info;
      debugText = debugText.replace(/(<td>|<th>)/gm, "	").replace(/(<\/td>|<\/th>)/gm, "\n").replace(/^<br>/gm, "").replace(/(<br>\n|<br>)/gm, "\n").replace(/<h1>(.*)<\/h1>/gm, "\n\n===== $1 =====\n\n").replace(/<h[2-6]>(.*)<\/h[2-6]>/gm, "\n\n*** $1 ***\n\n").replace(/(<([^>]+)>)/igm, "");
      logMessage("https://console.appnexus.com/docs/understanding-the-debug-auction");
      logMessage(debugText);
    }
    return bids;
  },
  /**
   * @typedef {Object} mappingFileInfo
   * @property {string} url  mapping file json url
   * @property {number} refreshInDays prebid stores mapping data in localstorage so you can return in how many days you want to update value stored in localstorage.
   * @property {string} localStorageKey unique key to store your mapping json in localstorage
   */
  /**
   * Returns mapping file info. This info will be used by bidderFactory to preload mapping file and store data in local storage
   * @returns {mappingFileInfo}
   */
  getMappingFileInfo: function() {
    return {
      url: mappingFileUrl,
      refreshInDays: 2
    };
  },
  getUserSyncs: function(syncOptions, responses, gdprConsent, uspConsent, gppConsent) {
    function checkGppStatus(gppConsent2) {
      if (gppConsent2 && Array.isArray(gppConsent2.applicableSections)) {
        return gppConsent2.applicableSections.every((sec) => typeof sec === "number" && sec <= 5);
      }
      return true;
    }
    if (syncOptions.iframeEnabled && hasPurpose1Consent(gdprConsent) && checkGppStatus(gppConsent)) {
      return [{
        type: "iframe",
        url: "https://acdn.adnxs.com/dmp/async_usersync.html"
      }];
    }
  },
  transformBidParams: function(params, isOpenRtb, adUnit, bidRequests) {
    let conversionFn = transformBidderParamKeywords;
    if (isOpenRtb === true) {
      let s2sEndpointUrl = null;
      let s2sConfig = config.getConfig("s2sConfig");
      if (isPlainObject(s2sConfig)) {
        s2sEndpointUrl = dlv(s2sConfig, "endpoint.p1Consent");
      } else if (isArray(s2sConfig)) {
        s2sConfig.forEach((s2sCfg) => {
          if (includes(s2sCfg.bidders, adUnit.bids[0].bidder)) {
            s2sEndpointUrl = dlv(s2sCfg, "endpoint.p1Consent");
          }
        });
      }
      if (s2sEndpointUrl && s2sEndpointUrl.match("/openrtb2/prebid")) {
        conversionFn = convertKeywordsToString;
      }
    }
    params = convertTypes({
      "member": "string",
      "invCode": "string",
      "placementId": "number",
      "keywords": conversionFn,
      "publisherId": "number"
    }, params);
    if (isOpenRtb) {
      if (isPopulatedArray(params.keywords)) {
        params.keywords.forEach(deleteValues);
      }
      Object.keys(params).forEach((paramKey) => {
        let convertedKey = convertCamelToUnderscore(paramKey);
        if (convertedKey !== paramKey) {
          params[convertedKey] = params[paramKey];
          delete params[paramKey];
        }
      });
      params.use_pmt_rule = typeof params.use_payment_rule === "boolean" ? params.use_payment_rule : false;
      if (params.use_payment_rule) {
        delete params.use_payment_rule;
      }
    }
    return params;
  }
};
function isPopulatedArray(arr) {
  return !!(isArray(arr) && arr.length > 0);
}
function deleteValues(keyPairObj) {
  if (isPopulatedArray(keyPairObj.value) && keyPairObj.value[0] === "") {
    delete keyPairObj.value;
  }
}
function strIsAppnexusViewabilityScript(str) {
  if (!str || str === "")
    return false;
  let regexMatchUrlStart = str.match(VIEWABILITY_URL_START);
  let viewUrlStartInStr = regexMatchUrlStart != null && regexMatchUrlStart.length >= 1;
  let regexMatchFileName = str.match(VIEWABILITY_FILE_NAME);
  let fileNameInStr = regexMatchFileName != null && regexMatchFileName.length >= 1;
  return str.startsWith(SCRIPT_TAG_START) && fileNameInStr && viewUrlStartInStr;
}
function formatRequest(payload, bidderRequest) {
  let request = [];
  let options = {
    withCredentials: true
  };
  let endpointUrl = URL2;
  if (!hasPurpose1Consent(bidderRequest?.gdprConsent)) {
    endpointUrl = URL_SIMPLE;
  }
  if (getParameterByName("apn_test").toUpperCase() === "TRUE" || config.getConfig("apn_test") === true) {
    options.customHeaders = {
      "X-Is-Test": 1
    };
  }
  if (payload.tags.length > MAX_IMPS_PER_REQUEST) {
    const clonedPayload = deepClone(payload);
    chunk(payload.tags, MAX_IMPS_PER_REQUEST).forEach((tags) => {
      clonedPayload.tags = tags;
      const payloadString = JSON.stringify(clonedPayload);
      request.push({
        method: "POST",
        url: endpointUrl,
        data: payloadString,
        bidderRequest,
        options
      });
    });
  } else {
    const payloadString = JSON.stringify(payload);
    request = {
      method: "POST",
      url: endpointUrl,
      data: payloadString,
      bidderRequest,
      options
    };
  }
  return request;
}
function newRenderer(adUnitCode, rtbBid, rendererOptions = {}) {
  const renderer = Renderer.install({
    id: rtbBid.renderer_id,
    url: rtbBid.renderer_url,
    config: rendererOptions,
    loaded: false,
    adUnitCode
  });
  try {
    renderer.setRender(outstreamRender);
  } catch (err) {
    logWarn("Prebid Error calling setRender on renderer", err);
  }
  renderer.setEventHandlers({
    impression: () => logMessage("AppNexus outstream video impression event"),
    loaded: () => logMessage("AppNexus outstream video loaded event"),
    ended: () => {
      logMessage("AppNexus outstream renderer video event");
      document.querySelector(`#${adUnitCode}`).style.display = "none";
    }
  });
  return renderer;
}
function newBid(serverBid, rtbBid, bidderRequest) {
  const bidRequest = getBidRequest(serverBid.uuid, [bidderRequest]);
  const adId = getUniqueIdentifierStr();
  const bid = {
    adId,
    requestId: serverBid.uuid,
    cpm: rtbBid.cpm,
    creativeId: rtbBid.creative_id,
    dealId: rtbBid.deal_id,
    currency: "USD",
    netRevenue: true,
    ttl: 300,
    adUnitCode: bidRequest.adUnitCode,
    appnexus: {
      buyerMemberId: rtbBid.buyer_member_id,
      dealPriority: rtbBid.deal_priority,
      dealCode: rtbBid.deal_code
    }
  };
  if (rtbBid.adomain) {
    bid.meta = Object.assign({}, bid.meta, { advertiserDomains: [rtbBid.adomain] });
  }
  if (rtbBid.advertiser_id) {
    bid.meta = Object.assign({}, bid.meta, { advertiserId: rtbBid.advertiser_id });
  }
  function setupDChain(rtbBid2) {
    let dchain = {
      ver: "1.0",
      complete: 0,
      nodes: [{
        bsid: rtbBid2.buyer_member_id.toString()
      }]
    };
    return dchain;
  }
  if (rtbBid.buyer_member_id) {
    bid.meta = Object.assign({}, bid.meta, { dchain: setupDChain(rtbBid) });
  }
  if (rtbBid.brand_id) {
    bid.meta = Object.assign({}, bid.meta, { brandId: rtbBid.brand_id });
  }
  if (FEATURES.VIDEO && rtbBid.rtb.video) {
    Object.assign(bid, {
      width: rtbBid.rtb.video.player_width,
      height: rtbBid.rtb.video.player_height,
      vastImpUrl: rtbBid.notify_url,
      ttl: 3600
    });
    const videoContext = dlv(bidRequest, "mediaTypes.video.context");
    switch (videoContext) {
      case ADPOD:
        const primaryCatId = getIabSubCategory(bidRequest.bidder, rtbBid.brand_category_id);
        bid.meta = Object.assign({}, bid.meta, { primaryCatId });
        const dealTier = rtbBid.deal_priority;
        bid.video = {
          context: ADPOD,
          durationSeconds: Math.floor(rtbBid.rtb.video.duration_ms / 1e3),
          dealTier
        };
        bid.vastUrl = rtbBid.rtb.video.asset_url;
        break;
      case OUTSTREAM:
        bid.adResponse = serverBid;
        bid.adResponse.ad = bid.adResponse.ads[0];
        bid.adResponse.ad.video = bid.adResponse.ad.rtb.video;
        bid.vastXml = rtbBid.rtb.video.content;
        if (rtbBid.renderer_url) {
          const videoBid = find(bidderRequest.bids, (bid2) => bid2.bidId === serverBid.uuid);
          let rendererOptions = dlv(videoBid, "mediaTypes.video.renderer.options");
          if (!rendererOptions) {
            rendererOptions = dlv(videoBid, "renderer.options");
          }
          bid.renderer = newRenderer(bid.adUnitCode, rtbBid, rendererOptions);
        }
        break;
      case INSTREAM:
        bid.vastUrl = rtbBid.notify_url + "&redir=" + encodeURIComponent(rtbBid.rtb.video.asset_url);
        break;
    }
  } else if (FEATURES.NATIVE && rtbBid.rtb[NATIVE]) {
    const nativeAd = rtbBid.rtb[NATIVE];
    let viewScript;
    if (strIsAppnexusViewabilityScript(rtbBid.viewability.config)) {
      let prebidParams = "pbjs_adid=" + adId + ";pbjs_auc=" + bidRequest.adUnitCode;
      viewScript = rtbBid.viewability.config.replace("dom_id=%native_dom_id%", prebidParams);
    }
    let jsTrackers = nativeAd.javascript_trackers;
    if (jsTrackers == void 0) {
      jsTrackers = viewScript;
    } else if (isStr(jsTrackers)) {
      jsTrackers = [jsTrackers, viewScript];
    } else {
      jsTrackers.push(viewScript);
    }
    bid[NATIVE] = {
      title: nativeAd.title,
      body: nativeAd.desc,
      body2: nativeAd.desc2,
      cta: nativeAd.ctatext,
      rating: nativeAd.rating,
      sponsoredBy: nativeAd.sponsored,
      privacyLink: nativeAd.privacy_link,
      address: nativeAd.address,
      downloads: nativeAd.downloads,
      likes: nativeAd.likes,
      phone: nativeAd.phone,
      price: nativeAd.price,
      salePrice: nativeAd.saleprice,
      clickUrl: nativeAd.link.url,
      displayUrl: nativeAd.displayurl,
      clickTrackers: nativeAd.link.click_trackers,
      impressionTrackers: nativeAd.impression_trackers,
      video: nativeAd.video,
      javascriptTrackers: jsTrackers
    };
    if (nativeAd.main_img) {
      bid["native"].image = {
        url: nativeAd.main_img.url,
        height: nativeAd.main_img.height,
        width: nativeAd.main_img.width
      };
    }
    if (nativeAd.icon) {
      bid["native"].icon = {
        url: nativeAd.icon.url,
        height: nativeAd.icon.height,
        width: nativeAd.icon.width
      };
    }
  } else {
    Object.assign(bid, {
      width: rtbBid.rtb.banner.width,
      height: rtbBid.rtb.banner.height,
      ad: rtbBid.rtb.banner.content
    });
    try {
      if (rtbBid.rtb.trackers) {
        for (let i = 0; i < rtbBid.rtb.trackers[0].impression_urls.length; i++) {
          const url = rtbBid.rtb.trackers[0].impression_urls[i];
          const tracker = createTrackPixelHtml(url);
          bid.ad += tracker;
        }
      }
    } catch (error) {
      logError("Error appending tracking pixel", error);
    }
  }
  return bid;
}
function bidToTag(bid) {
  const tag = {};
  Object.keys(bid.params).forEach((paramKey) => {
    let convertedKey = convertCamelToUnderscore(paramKey);
    if (convertedKey !== paramKey) {
      bid.params[convertedKey] = bid.params[paramKey];
      delete bid.params[paramKey];
    }
  });
  tag.sizes = transformSizes(bid.sizes);
  tag.primary_size = tag.sizes[0];
  tag.ad_types = [];
  tag.uuid = bid.bidId;
  if (bid.params.placement_id) {
    tag.id = parseInt(bid.params.placement_id, 10);
  } else {
    tag.code = bid.params.inv_code;
  }
  tag.allow_smaller_sizes = bid.params.allow_smaller_sizes || false;
  tag.use_pmt_rule = typeof bid.params.use_payment_rule === "boolean" ? bid.params.use_payment_rule : typeof bid.params.use_pmt_rule === "boolean" ? bid.params.use_pmt_rule : false;
  tag.prebid = true;
  tag.disable_psa = true;
  let bidFloor = getBidFloor(bid);
  if (bidFloor) {
    tag.reserve = bidFloor;
  }
  if (bid.params.position) {
    tag.position = { "above": 1, "below": 2 }[bid.params.position] || 0;
  } else {
    let mediaTypePos = dlv(bid, `mediaTypes.banner.pos`) || dlv(bid, `mediaTypes.video.pos`);
    if (mediaTypePos === 0 || mediaTypePos === 1 || mediaTypePos === 3) {
      tag.position = mediaTypePos === 3 ? 2 : mediaTypePos;
    }
  }
  if (bid.params.traffic_source_code) {
    tag.traffic_source_code = bid.params.traffic_source_code;
  }
  if (bid.params.private_sizes) {
    tag.private_sizes = transformSizes(bid.params.private_sizes);
  }
  if (bid.params.supply_type) {
    tag.supply_type = bid.params.supply_type;
  }
  if (bid.params.pub_click) {
    tag.pubclick = bid.params.pub_click;
  }
  if (bid.params.ext_inv_code) {
    tag.ext_inv_code = bid.params.ext_inv_code;
  }
  if (bid.params.publisher_id) {
    tag.publisher_id = parseInt(bid.params.publisher_id, 10);
  }
  if (bid.params.external_imp_id) {
    tag.external_imp_id = bid.params.external_imp_id;
  }
  let ortb2ImpKwStr = dlv(bid, "ortb2Imp.ext.data.keywords");
  if (isStr(ortb2ImpKwStr) && ortb2ImpKwStr !== "" || !isEmpty(bid.params.keywords)) {
    let ortb2ImpKwObj = convertStringToKeywordsObj(ortb2ImpKwStr);
    let bidParamsKwObj = isPlainObject(bid.params.keywords) ? deepClone(bid.params.keywords) : {};
    Object.keys(bidParamsKwObj).forEach((k) => {
      if (isStr(bidParamsKwObj[k]) || isNumber(bidParamsKwObj[k]))
        bidParamsKwObj[k] = [bidParamsKwObj[k]];
    });
    let keywordsObj = mergeDeep({}, bidParamsKwObj, ortb2ImpKwObj);
    let keywordsUt = transformBidderParamKeywords(keywordsObj);
    if (keywordsUt.length > 0) {
      keywordsUt.forEach(deleteValues);
      tag.keywords = keywordsUt;
    }
  }
  let gpid = dlv(bid, "ortb2Imp.ext.data.pbadslot");
  if (gpid) {
    tag.gpid = gpid;
  }
  if (FEATURES.NATIVE && (bid.mediaType === NATIVE || dlv(bid, `mediaTypes.${NATIVE}`))) {
    tag.ad_types.push(NATIVE);
    if (tag.sizes.length === 0) {
      tag.sizes = transformSizes([1, 1]);
    }
    if (bid.nativeParams) {
      const nativeRequest = buildNativeRequest(bid.nativeParams);
      tag[NATIVE] = { layouts: [nativeRequest] };
    }
  }
  if (FEATURES.VIDEO) {
    const videoMediaType = dlv(bid, `mediaTypes.${VIDEO}`);
    const context = dlv(bid, "mediaTypes.video.context");
    if (videoMediaType && context === "adpod") {
      tag.hb_source = 7;
    } else {
      tag.hb_source = 1;
    }
    if (bid.mediaType === VIDEO || videoMediaType) {
      tag.ad_types.push(VIDEO);
    }
    if (bid.mediaType === VIDEO || videoMediaType && context !== "outstream") {
      tag.require_asset_url = true;
    }
    if (bid.params.video) {
      tag.video = {};
      Object.keys(bid.params.video).filter((param) => includes(VIDEO_TARGETING, param)).forEach((param) => {
        switch (param) {
          case "context":
          case "playback_method":
            let type = bid.params.video[param];
            type = isArray(type) ? type[0] : type;
            tag.video[param] = VIDEO_MAPPING[param][type];
            break;
          case "frameworks":
            break;
          default:
            tag.video[param] = bid.params.video[param];
        }
      });
      if (bid.params.video.frameworks && isArray(bid.params.video.frameworks)) {
        tag["video_frameworks"] = bid.params.video.frameworks;
      }
    }
    if (videoMediaType) {
      tag.video = tag.video || {};
      Object.keys(videoMediaType).filter((param) => includes(VIDEO_RTB_TARGETING, param)).forEach((param) => {
        switch (param) {
          case "minduration":
          case "maxduration":
            if (typeof tag.video[param] !== "number")
              tag.video[param] = videoMediaType[param];
            break;
          case "skip":
            if (typeof tag.video["skippable"] !== "boolean")
              tag.video["skippable"] = videoMediaType[param] === 1;
            break;
          case "skipafter":
            if (typeof tag.video["skipoffset"] !== "number")
              tag.video["skippoffset"] = videoMediaType[param];
            break;
          case "playbackmethod":
            if (typeof tag.video["playback_method"] !== "number") {
              let type = videoMediaType[param];
              type = isArray(type) ? type[0] : type;
              if (type >= 1 && type <= 4) {
                tag.video["playback_method"] = type;
              }
            }
            break;
          case "api":
            if (!tag["video_frameworks"] && isArray(videoMediaType[param])) {
              let apiTmp = videoMediaType[param].map((val) => {
                let v = val === 4 ? 5 : val === 5 ? 4 : val;
                if (v >= 1 && v <= 5) {
                  return v;
                }
              }).filter((v) => v);
              tag["video_frameworks"] = apiTmp;
            }
            break;
          case "startdelay":
          case "placement":
            const contextKey = "context";
            if (typeof tag.video[contextKey] !== "number") {
              const placement = videoMediaType["placement"];
              const startdelay = videoMediaType["startdelay"];
              const context2 = getContextFromPlacement(placement) || getContextFromStartDelay(startdelay);
              tag.video[contextKey] = VIDEO_MAPPING[contextKey][context2];
            }
            break;
        }
      });
    }
    if (bid.renderer) {
      tag.video = Object.assign({}, tag.video, { custom_renderer_present: true });
    }
  } else {
    tag.hb_source = 1;
  }
  if (bid.params.frameworks && isArray(bid.params.frameworks)) {
    tag["banner_frameworks"] = bid.params.frameworks;
  }
  let adUnit = find(auctionManager.getAdUnits(), (au) => bid.transactionId === au.transactionId);
  if (adUnit && adUnit.mediaTypes && adUnit.mediaTypes.banner) {
    tag.ad_types.push(BANNER);
  }
  if (tag.ad_types.length === 0) {
    delete tag.ad_types;
  }
  return tag;
}
function transformSizes(requestSizes) {
  let sizes = [];
  let sizeObj = {};
  if (isArray(requestSizes) && requestSizes.length === 2 && !isArray(requestSizes[0])) {
    sizeObj.width = parseInt(requestSizes[0], 10);
    sizeObj.height = parseInt(requestSizes[1], 10);
    sizes.push(sizeObj);
  } else if (typeof requestSizes === "object") {
    for (let i = 0; i < requestSizes.length; i++) {
      let size = requestSizes[i];
      sizeObj = {};
      sizeObj.width = parseInt(size[0], 10);
      sizeObj.height = parseInt(size[1], 10);
      sizes.push(sizeObj);
    }
  }
  return sizes;
}
function getContextFromPlacement(ortbPlacement) {
  if (!ortbPlacement) {
    return;
  }
  if (ortbPlacement === 2) {
    return "in-banner";
  } else if (ortbPlacement > 2) {
    return "outstream";
  }
}
function getContextFromStartDelay(ortbStartDelay) {
  if (!ortbStartDelay) {
    return;
  }
  if (ortbStartDelay === 0) {
    return "pre_roll";
  } else if (ortbStartDelay === -1) {
    return "mid_roll";
  } else if (ortbStartDelay === -2) {
    return "post_roll";
  }
}
function hasUserInfo(bid) {
  return !!bid.params.user;
}
function hasMemberId(bid) {
  return !!parseInt(bid.params.member, 10);
}
function hasAppDeviceInfo(bid) {
  if (bid.params) {
    return !!bid.params.app;
  }
}
function hasAppId(bid) {
  if (bid.params && bid.params.app) {
    return !!bid.params.app.id;
  }
  return !!bid.params.app;
}
function hasDebug(bid) {
  return !!bid.debug;
}
function hasAdPod(bid) {
  return bid.mediaTypes && bid.mediaTypes.video && bid.mediaTypes.video.context === ADPOD;
}
function hasOmidSupport(bid) {
  let hasOmid = false;
  const bidderParams = bid.params;
  const videoParams = bid.params.video;
  if (bidderParams.frameworks && isArray(bidderParams.frameworks)) {
    hasOmid = includes(bid.params.frameworks, 6);
  }
  if (!hasOmid && videoParams && videoParams.frameworks && isArray(videoParams.frameworks)) {
    hasOmid = includes(bid.params.video.frameworks, 6);
  }
  return hasOmid;
}
function createAdPodRequest(tags, adPodBid) {
  const { durationRangeSec, requireExactDuration } = adPodBid.mediaTypes.video;
  const numberOfPlacements = getAdPodPlacementNumber(adPodBid.mediaTypes.video);
  const maxDuration = getMaxValueFromArray(durationRangeSec);
  const tagToDuplicate = tags.filter((tag) => tag.uuid === adPodBid.bidId);
  let request = fill(...tagToDuplicate, numberOfPlacements);
  if (requireExactDuration) {
    const divider = Math.ceil(numberOfPlacements / durationRangeSec.length);
    const chunked = chunk(request, divider);
    durationRangeSec.forEach((duration, index) => {
      chunked[index].map((tag) => {
        setVideoProperty(tag, "minduration", duration);
        setVideoProperty(tag, "maxduration", duration);
      });
    });
  } else {
    request.map((tag) => setVideoProperty(tag, "maxduration", maxDuration));
  }
  return request;
}
function getAdPodPlacementNumber(videoParams) {
  const { adPodDurationSec, durationRangeSec, requireExactDuration } = videoParams;
  const minAllowedDuration = getMinValueFromArray(durationRangeSec);
  const numberOfPlacements = Math.floor(adPodDurationSec / minAllowedDuration);
  return requireExactDuration ? Math.max(numberOfPlacements, durationRangeSec.length) : numberOfPlacements;
}
function setVideoProperty(tag, key, value) {
  if (isEmpty(tag.video)) {
    tag.video = {};
  }
  tag.video[key] = value;
}
function getRtbBid(tag) {
  return tag && tag.ads && tag.ads.length && find(tag.ads, (ad) => ad.rtb);
}
function buildNativeRequest(params) {
  const request = {};
  Object.keys(params).forEach((key) => {
    const requestKey = NATIVE_MAPPING[key] && NATIVE_MAPPING[key].serverName || NATIVE_MAPPING[key] || key;
    const requiredParams = NATIVE_MAPPING[key] && NATIVE_MAPPING[key].requiredParams;
    request[requestKey] = Object.assign({}, requiredParams, params[key]);
    const isImageAsset = !!(requestKey === NATIVE_MAPPING.image.serverName || requestKey === NATIVE_MAPPING.icon.serverName);
    if (isImageAsset && request[requestKey].sizes) {
      let sizes = request[requestKey].sizes;
      if (isArrayOfNums(sizes) || isArray(sizes) && sizes.length > 0 && sizes.every((sz) => isArrayOfNums(sz))) {
        request[requestKey].sizes = transformSizes(request[requestKey].sizes);
      }
    }
    if (requestKey === NATIVE_MAPPING.privacyLink) {
      request.privacy_supported = true;
    }
  });
  return request;
}
function hidedfpContainer(elementId) {
  try {
    const el = document.getElementById(elementId).querySelectorAll("div[id^='google_ads']");
    if (el[0]) {
      el[0].style.setProperty("display", "none");
    }
  } catch (e) {
  }
}
function hideSASIframe(elementId) {
  try {
    const el = document.getElementById(elementId).querySelectorAll("script[id^='sas_script']");
    if (el[0].nextSibling && el[0].nextSibling.localName === "iframe") {
      el[0].nextSibling.style.setProperty("display", "none");
    }
  } catch (e) {
  }
}
function outstreamRender(bid, doc) {
  hidedfpContainer(bid.adUnitCode);
  hideSASIframe(bid.adUnitCode);
  bid.renderer.push(() => {
    const win = getWindowFromDocument(doc) || window;
    win.ANOutstreamVideo.renderAd({
      tagId: bid.adResponse.tag_id,
      sizes: [bid.getSize().split("x")],
      targetId: bid.adUnitCode,
      // target div id to render video
      uuid: bid.adResponse.uuid,
      adResponse: bid.adResponse,
      rendererOptions: bid.renderer.getConfig()
    }, handleOutstreamRendererEvents.bind(null, bid));
  });
}
function handleOutstreamRendererEvents(bid, id, eventName) {
  bid.renderer.handleVideoEvent({ id, eventName });
}
function parseMediaType(rtbBid) {
  const adType = rtbBid.ad_type;
  if (adType === VIDEO) {
    return VIDEO;
  } else if (adType === NATIVE) {
    return NATIVE;
  } else {
    return BANNER;
  }
}
function getBidFloor(bid) {
  if (!isFn(bid.getFloor)) {
    return bid.params.reserve ? bid.params.reserve : null;
  }
  let floor = bid.getFloor({
    currency: "USD",
    mediaType: "*",
    size: "*"
  });
  if (isPlainObject(floor) && !isNaN(floor.floor) && floor.currency === "USD") {
    return floor.floor;
  }
  return null;
}
function convertKeywordsToString(keywords) {
  let result = "";
  Object.keys(keywords).forEach((key) => {
    if (isStr(keywords[key])) {
      if (keywords[key] !== "") {
        result += `${key}=${keywords[key]},`;
      } else {
        result += `${key},`;
      }
    } else if (isArray(keywords[key])) {
      if (keywords[key][0] === "") {
        result += `${key},`;
      } else {
        keywords[key].forEach((val) => {
          result += `${key}=${val},`;
        });
      }
    }
  });
  result = result.substring(0, result.length - 1);
  return result;
}
function convertStringToKeywordsObj(keyStr) {
  let result = {};
  if (isStr(keyStr) && keyStr !== "") {
    let keywordList = keyStr.split(/\s*(?:,)\s*/);
    keywordList.forEach((kw) => {
      if (kw.indexOf("=") !== -1) {
        let kwPair = kw.split("=");
        let key = kwPair[0];
        let val = kwPair[1];
        if (result.hasOwnProperty(key)) {
          result[key].push(val);
        } else {
          result[key] = [val];
        }
      } else {
        if (!result.hasOwnProperty(kw)) {
          result[kw] = [""];
        }
      }
    });
  }
  return result;
}
registerBidder(spec);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  spec
});
/*! Bundled license information:

fun-hooks/no-eval/index.js:
  (*
  * @license MIT
  * Fun Hooks v0.9.10
  * (c) @snapwich
  *)
*/
console.log(JSON.stringify(spec.buildRequests([
  {
      "bidder": "brightcom",
      "params": {
          "publisherId": "000000"
      },
      "userId": {
          "tdid": "XXXXXXXX-XXXX-XXXX-XXXX-AAAAAAAAAAAA",
          "pubProvidedId": [
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "d93c6fe5-3537-40a5-b2fd-22634d125346"
                      }
                  ],
                  "source": "sonobi.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "bf0eeae0-cc81-4336-a699-d24d8b609997"
                      }
                  ],
                  "source": "adserver.org"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "ExKycLZHeuCEQ-VyRd6caG8S"
                      }
                  ],
                  "source": "sovrn.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "83538981561611224161916496640247943203"
                      }
                  ],
                  "source": "adobe.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "d30c559d-8fa8-4955-a774-fb2f9338b6f6"
                      }
                  ],
                  "source": "bidswitch.net"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "L43G3MNS-B-6FE5"
                      }
                  ],
                  "source": "rubiconproject.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "DB812EF8-1B54-4E8B-A3EF-CB91BEAB88AD"
                      }
                  ],
                  "source": "pubmatic.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "5314323018BA1A5FBD9EF699E17926794D4347C32D2E7DE6E788E8EE0E1B8352"
                      }
                  ],
                  "source": "guid.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "g8698fded49dc93ea87c"
                      }
                  ],
                  "source": "yieldmo.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "RX-5f5138c5-0b5f-464f-95ff-ea951006fbd1-005"
                      }
                  ],
                  "source": "rhythmone.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "7657705081667793650"
                      }
                  ],
                  "source": "smartadserver.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "7517629e-a0cb-4d00-8622-88ab7ddcb648"
                      }
                  ],
                  "source": "mediamath.com"
              }
          ]
      },
      "userIdAsEids": [
          {
              "source": "adserver.org",
              "uids": [
                  {
                      "id": "XXXXXXXX-XXXX-XXXX-XXXX-AAAAAAAAAAAA",
                      "atype": 1,
                      "ext": {
                          "rtiPartner": "TDID"
                      }
                  }
              ]
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "d93c6fe5-3537-40a5-b2fd-22634d125346"
                  }
              ],
              "source": "sonobi.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "bf0eeae0-cc81-4336-a699-d24d8b609997"
                  }
              ],
              "source": "adserver.org"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "ExKycLZHeuCEQ-VyRd6caG8S"
                  }
              ],
              "source": "sovrn.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "83538981561611224161916496640247943203"
                  }
              ],
              "source": "adobe.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "d30c559d-8fa8-4955-a774-fb2f9338b6f6"
                  }
              ],
              "source": "bidswitch.net"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "L43G3MNS-B-6FE5"
                  }
              ],
              "source": "rubiconproject.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "DB812EF8-1B54-4E8B-A3EF-CB91BEAB88AD"
                  }
              ],
              "source": "pubmatic.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "5314323018BA1A5FBD9EF699E17926794D4347C32D2E7DE6E788E8EE0E1B8352"
                  }
              ],
              "source": "guid.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "g8698fded49dc93ea87c"
                  }
              ],
              "source": "yieldmo.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "RX-5f5138c5-0b5f-464f-95ff-ea951006fbd1-005"
                  }
              ],
              "source": "rhythmone.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "7657705081667793650"
                  }
              ],
              "source": "smartadserver.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "7517629e-a0cb-4d00-8622-88ab7ddcb648"
                  }
              ],
              "source": "mediamath.com"
          }
      ],
      "ortb2Imp": {
          "ext": {
              "tid": "a93687d0-d926-4157-a86c-24a9905cfde2"
          }
      },
      "mediaTypes": {
          "banner": {
              "sizes": [
                  [
                      300,
                      250
                  ],
                  [
                      300,
                      600
                  ]
              ]
          }
      },
      "adUnitCode": "/19968336/header-bid-tag-0",
      "transactionId": "a93687d0-d926-4157-a86c-24a9905cfde2",
      "sizes": [
          [
              300,
              250
          ],
          [
              300,
              600
          ]
      ],
      "bidId": "21a9c872c796b2",
      "bidderRequestId": "1ae19dc4e73d02",
      "auctionId": "c290317f-90d3-4ef9-9cf0-34eb73f36f21",
      "src": "client",
      "metrics": {
          "userId.init.gdpr": [
              0,
              0,
              0
          ],
          "userId.mod.init": [
              0.19999999552965164,
              0,
              0.10000000149011612,
              0,
              0,
              2.600000001490116,
              0
          ],
          "userId.mods.id5Id.init": [
              0.19999999552965164,
              0.10000000149011612,
              0
          ],
          "userId.mods.unifiedId.init": [
              0,
              0,
              0
          ],
          "userId.init.modules": [
              1.3999999985098839,
              0.6999999955296516,
              3
          ],
          "userId.callbacks.pending": [
              0.10000000149011612
          ],
          "userId.total": [
              7.799999997019768,
              463.6000000014901,
              1685.1000000014901
          ],
          "userId.mods.pubProvidedId.init": [
              2.600000001490116
          ],
          "userId.mod.callback": [
              1936.5999999940395,
              1946.3999999985099,
              1685.5999999940395
          ],
          "userId.mods.id5Id.callback": [
              1936.5999999940395,
              1946.3999999985099,
              1685.5999999940395
          ],
          "userId.callbacks.total": [
              1936.5999999940395,
              1946.5,
              1685.5999999940395
          ],
          "requestBids.userId": 509.5,
          "requestBids.validate": 2.399999998509884,
          "requestBids.makeRequests": 5.700000002980232,
          "requestBids.total": 1363.3000000044703,
          "requestBids.callBids": 838.8000000044703,
          "adapter.client.net": [
              832.2999999970198
          ],
          "adapters.client.brightcom.net": [
              832.2999999970198
          ],
          "adapter.client.interpretResponse": [
              0.8000000044703484
          ],
          "adapters.client.brightcom.interpretResponse": [
              0.8000000044703484
          ],
          "adapter.client.validate": 0,
          "adapters.client.brightcom.validate": 0,
          "adapter.client.buildRequests": 0.7999999970197678,
          "adapters.client.brightcom.buildRequests": 0.7999999970197678,
          "adapter.client.total": 834.2000000029802,
          "adapters.client.brightcom.total": 834.2000000029802
      },
      "bidRequestsCount": 1,
      "bidderRequestsCount": 1,
      "bidderWinsCount": 0,
      "ortb2": {
          "site": {
              "page": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
              "domain": "danielle-vallance-b8s4.squarespace.com",
              "publisher": {
                  "domain": "squarespace.com"
              }
          },
          "device": {
              "w": 810,
              "h": 718,
              "dnt": 0,
              "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
              "language": "en",
              "sua": {
                  "source": 2,
                  "platform": {
                      "brand": "macOS",
                      "version": [
                          "13",
                          "1",
                          "0"
                      ]
                  },
                  "browsers": [
                      {
                          "brand": "Chromium",
                          "version": [
                              "112",
                              "0",
                              "5615",
                              "137"
                          ]
                      },
                      {
                          "brand": "Google Chrome",
                          "version": [
                              "112",
                              "0",
                              "5615",
                              "137"
                          ]
                      },
                      {
                          "brand": "Not:A-Brand",
                          "version": [
                              "99",
                              "0",
                              "0",
                              "0"
                          ]
                      }
                  ],
                  "mobile": 0,
                  "model": "",
                  "bitness": "64",
                  "architecture": "arm"
              }
          }
      }
  },
  {
      "bidder": "brightcom",
      "params": {
          "publisherId": "000000"
      },
      "userId": {
          "tdid": "XXXXXXXX-XXXX-XXXX-XXXX-AAAAAAAAAAAA",
          "pubProvidedId": [
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "d93c6fe5-3537-40a5-b2fd-22634d125346"
                      }
                  ],
                  "source": "sonobi.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "bf0eeae0-cc81-4336-a699-d24d8b609997"
                      }
                  ],
                  "source": "adserver.org"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "ExKycLZHeuCEQ-VyRd6caG8S"
                      }
                  ],
                  "source": "sovrn.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "83538981561611224161916496640247943203"
                      }
                  ],
                  "source": "adobe.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "d30c559d-8fa8-4955-a774-fb2f9338b6f6"
                      }
                  ],
                  "source": "bidswitch.net"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "L43G3MNS-B-6FE5"
                      }
                  ],
                  "source": "rubiconproject.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "DB812EF8-1B54-4E8B-A3EF-CB91BEAB88AD"
                      }
                  ],
                  "source": "pubmatic.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "5314323018BA1A5FBD9EF699E17926794D4347C32D2E7DE6E788E8EE0E1B8352"
                      }
                  ],
                  "source": "guid.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "g8698fded49dc93ea87c"
                      }
                  ],
                  "source": "yieldmo.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "RX-5f5138c5-0b5f-464f-95ff-ea951006fbd1-005"
                      }
                  ],
                  "source": "rhythmone.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "7657705081667793650"
                      }
                  ],
                  "source": "smartadserver.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "7517629e-a0cb-4d00-8622-88ab7ddcb648"
                      }
                  ],
                  "source": "mediamath.com"
              }
          ]
      },
      "userIdAsEids": [
          {
              "source": "adserver.org",
              "uids": [
                  {
                      "id": "XXXXXXXX-XXXX-XXXX-XXXX-AAAAAAAAAAAA",
                      "atype": 1,
                      "ext": {
                          "rtiPartner": "TDID"
                      }
                  }
              ]
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "d93c6fe5-3537-40a5-b2fd-22634d125346"
                  }
              ],
              "source": "sonobi.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "bf0eeae0-cc81-4336-a699-d24d8b609997"
                  }
              ],
              "source": "adserver.org"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "ExKycLZHeuCEQ-VyRd6caG8S"
                  }
              ],
              "source": "sovrn.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "83538981561611224161916496640247943203"
                  }
              ],
              "source": "adobe.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "d30c559d-8fa8-4955-a774-fb2f9338b6f6"
                  }
              ],
              "source": "bidswitch.net"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "L43G3MNS-B-6FE5"
                  }
              ],
              "source": "rubiconproject.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "DB812EF8-1B54-4E8B-A3EF-CB91BEAB88AD"
                  }
              ],
              "source": "pubmatic.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "5314323018BA1A5FBD9EF699E17926794D4347C32D2E7DE6E788E8EE0E1B8352"
                  }
              ],
              "source": "guid.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "g8698fded49dc93ea87c"
                  }
              ],
              "source": "yieldmo.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "RX-5f5138c5-0b5f-464f-95ff-ea951006fbd1-005"
                  }
              ],
              "source": "rhythmone.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "7657705081667793650"
                  }
              ],
              "source": "smartadserver.com"
          },
          {
              "uids": [
                  {
                      "ext": {
                          "stype": "ppuid"
                      },
                      "id": "7517629e-a0cb-4d00-8622-88ab7ddcb648"
                  }
              ],
              "source": "mediamath.com"
          }
      ],
      "ortb2Imp": {
          "ext": {
              "tid": "47f2b5d6-726b-4521-823b-397e3f9f499e"
          }
      },
      "mediaTypes": {
          "banner": {
              "sizes": [
                  [
                      728,
                      90
                  ],
                  [
                      970,
                      250
                  ]
              ]
          }
      },
      "adUnitCode": "/19968336/header-bid-tag-1",
      "transactionId": "47f2b5d6-726b-4521-823b-397e3f9f499e",
      "sizes": [
          [
              728,
              90
          ],
          [
              970,
              250
          ]
      ],
      "bidId": "3535945cfb889d",
      "bidderRequestId": "1ae19dc4e73d02",
      "auctionId": "c290317f-90d3-4ef9-9cf0-34eb73f36f21",
      "src": "client",
      "metrics": {
          "userId.init.gdpr": [
              0,
              0,
              0
          ],
          "userId.mod.init": [
              0.19999999552965164,
              0,
              0.10000000149011612,
              0,
              0,
              2.600000001490116,
              0
          ],
          "userId.mods.id5Id.init": [
              0.19999999552965164,
              0.10000000149011612,
              0
          ],
          "userId.mods.unifiedId.init": [
              0,
              0,
              0
          ],
          "userId.init.modules": [
              1.3999999985098839,
              0.6999999955296516,
              3
          ],
          "userId.callbacks.pending": [
              0.10000000149011612
          ],
          "userId.total": [
              7.799999997019768,
              463.6000000014901,
              1685.1000000014901
          ],
          "userId.mods.pubProvidedId.init": [
              2.600000001490116
          ],
          "userId.mod.callback": [
              1936.5999999940395,
              1946.3999999985099,
              1685.5999999940395
          ],
          "userId.mods.id5Id.callback": [
              1936.5999999940395,
              1946.3999999985099,
              1685.5999999940395
          ],
          "userId.callbacks.total": [
              1936.5999999940395,
              1946.5,
              1685.5999999940395
          ],
          "requestBids.userId": 509.5,
          "requestBids.validate": 2.399999998509884,
          "requestBids.makeRequests": 5.700000002980232,
          "requestBids.total": 1363.3000000044703,
          "requestBids.callBids": 838.8000000044703,
          "adapter.client.net": [
              832.2999999970198
          ],
          "adapters.client.brightcom.net": [
              832.2999999970198
          ],
          "adapter.client.interpretResponse": [
              0.8000000044703484
          ],
          "adapters.client.brightcom.interpretResponse": [
              0.8000000044703484
          ],
          "adapter.client.validate": 0,
          "adapters.client.brightcom.validate": 0,
          "adapter.client.buildRequests": 0.7999999970197678,
          "adapters.client.brightcom.buildRequests": 0.7999999970197678,
          "adapter.client.total": 834.2000000029802,
          "adapters.client.brightcom.total": 834.2000000029802
      },
      "bidRequestsCount": 1,
      "bidderRequestsCount": 1,
      "bidderWinsCount": 0,
      "ortb2": {
          "site": {
              "page": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
              "domain": "danielle-vallance-b8s4.squarespace.com",
              "publisher": {
                  "domain": "squarespace.com"
              }
          },
          "device": {
              "w": 810,
              "h": 718,
              "dnt": 0,
              "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
              "language": "en",
              "sua": {
                  "source": 2,
                  "platform": {
                      "brand": "macOS",
                      "version": [
                          "13",
                          "1",
                          "0"
                      ]
                  },
                  "browsers": [
                      {
                          "brand": "Chromium",
                          "version": [
                              "112",
                              "0",
                              "5615",
                              "137"
                          ]
                      },
                      {
                          "brand": "Google Chrome",
                          "version": [
                              "112",
                              "0",
                              "5615",
                              "137"
                          ]
                      },
                      {
                          "brand": "Not:A-Brand",
                          "version": [
                              "99",
                              "0",
                              "0",
                              "0"
                          ]
                      }
                  ],
                  "mobile": 0,
                  "model": "",
                  "bitness": "64",
                  "architecture": "arm"
              }
          }
      }
  }
], {
  "bidderCode": "brightcom",
  "auctionId": "c290317f-90d3-4ef9-9cf0-34eb73f36f21",
  "bidderRequestId": "1ae19dc4e73d02",
  "bids": [
      {
          "bidder": "brightcom",
          "params": {
              "publisherId": "000000"
          },
          "userId": {
              "tdid": "XXXXXXXX-XXXX-XXXX-XXXX-AAAAAAAAAAAA",
              "pubProvidedId": [
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "d93c6fe5-3537-40a5-b2fd-22634d125346"
                          }
                      ],
                      "source": "sonobi.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "bf0eeae0-cc81-4336-a699-d24d8b609997"
                          }
                      ],
                      "source": "adserver.org"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "ExKycLZHeuCEQ-VyRd6caG8S"
                          }
                      ],
                      "source": "sovrn.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "83538981561611224161916496640247943203"
                          }
                      ],
                      "source": "adobe.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "d30c559d-8fa8-4955-a774-fb2f9338b6f6"
                          }
                      ],
                      "source": "bidswitch.net"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "L43G3MNS-B-6FE5"
                          }
                      ],
                      "source": "rubiconproject.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "DB812EF8-1B54-4E8B-A3EF-CB91BEAB88AD"
                          }
                      ],
                      "source": "pubmatic.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "5314323018BA1A5FBD9EF699E17926794D4347C32D2E7DE6E788E8EE0E1B8352"
                          }
                      ],
                      "source": "guid.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "g8698fded49dc93ea87c"
                          }
                      ],
                      "source": "yieldmo.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "RX-5f5138c5-0b5f-464f-95ff-ea951006fbd1-005"
                          }
                      ],
                      "source": "rhythmone.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "7657705081667793650"
                          }
                      ],
                      "source": "smartadserver.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "7517629e-a0cb-4d00-8622-88ab7ddcb648"
                          }
                      ],
                      "source": "mediamath.com"
                  }
              ]
          },
          "userIdAsEids": [
              {
                  "source": "adserver.org",
                  "uids": [
                      {
                          "id": "XXXXXXXX-XXXX-XXXX-XXXX-AAAAAAAAAAAA",
                          "atype": 1,
                          "ext": {
                              "rtiPartner": "TDID"
                          }
                      }
                  ]
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "d93c6fe5-3537-40a5-b2fd-22634d125346"
                      }
                  ],
                  "source": "sonobi.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "bf0eeae0-cc81-4336-a699-d24d8b609997"
                      }
                  ],
                  "source": "adserver.org"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "ExKycLZHeuCEQ-VyRd6caG8S"
                      }
                  ],
                  "source": "sovrn.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "83538981561611224161916496640247943203"
                      }
                  ],
                  "source": "adobe.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "d30c559d-8fa8-4955-a774-fb2f9338b6f6"
                      }
                  ],
                  "source": "bidswitch.net"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "L43G3MNS-B-6FE5"
                      }
                  ],
                  "source": "rubiconproject.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "DB812EF8-1B54-4E8B-A3EF-CB91BEAB88AD"
                      }
                  ],
                  "source": "pubmatic.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "5314323018BA1A5FBD9EF699E17926794D4347C32D2E7DE6E788E8EE0E1B8352"
                      }
                  ],
                  "source": "guid.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "g8698fded49dc93ea87c"
                      }
                  ],
                  "source": "yieldmo.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "RX-5f5138c5-0b5f-464f-95ff-ea951006fbd1-005"
                      }
                  ],
                  "source": "rhythmone.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "7657705081667793650"
                      }
                  ],
                  "source": "smartadserver.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "7517629e-a0cb-4d00-8622-88ab7ddcb648"
                      }
                  ],
                  "source": "mediamath.com"
              }
          ],
          "ortb2Imp": {
              "ext": {
                  "tid": "a93687d0-d926-4157-a86c-24a9905cfde2"
              }
          },
          "mediaTypes": {
              "banner": {
                  "sizes": [
                      [
                          300,
                          250
                      ],
                      [
                          300,
                          600
                      ]
                  ]
              }
          },
          "adUnitCode": "/19968336/header-bid-tag-0",
          "transactionId": "a93687d0-d926-4157-a86c-24a9905cfde2",
          "sizes": [
              [
                  300,
                  250
              ],
              [
                  300,
                  600
              ]
          ],
          "bidId": "21a9c872c796b2",
          "bidderRequestId": "1ae19dc4e73d02",
          "auctionId": "c290317f-90d3-4ef9-9cf0-34eb73f36f21",
          "src": "client",
          "metrics": {
              "userId.init.gdpr": [
                  0,
                  0,
                  0
              ],
              "userId.mod.init": [
                  0.19999999552965164,
                  0,
                  0.10000000149011612,
                  0,
                  0,
                  2.600000001490116,
                  0
              ],
              "userId.mods.id5Id.init": [
                  0.19999999552965164,
                  0.10000000149011612,
                  0
              ],
              "userId.mods.unifiedId.init": [
                  0,
                  0,
                  0
              ],
              "userId.init.modules": [
                  1.3999999985098839,
                  0.6999999955296516,
                  3
              ],
              "userId.callbacks.pending": [
                  0.10000000149011612
              ],
              "userId.total": [
                  7.799999997019768,
                  463.6000000014901,
                  1685.1000000014901
              ],
              "userId.mods.pubProvidedId.init": [
                  2.600000001490116
              ],
              "userId.mod.callback": [
                  1936.5999999940395,
                  1946.3999999985099,
                  1685.5999999940395
              ],
              "userId.mods.id5Id.callback": [
                  1936.5999999940395,
                  1946.3999999985099,
                  1685.5999999940395
              ],
              "userId.callbacks.total": [
                  1936.5999999940395,
                  1946.5,
                  1685.5999999940395
              ],
              "requestBids.userId": 509.5,
              "requestBids.validate": 2.399999998509884,
              "requestBids.makeRequests": 5.700000002980232,
              "requestBids.total": 1363.3000000044703,
              "requestBids.callBids": 838.8000000044703,
              "adapter.client.net": [
                  832.2999999970198
              ],
              "adapters.client.brightcom.net": [
                  832.2999999970198
              ],
              "adapter.client.interpretResponse": [
                  0.8000000044703484
              ],
              "adapters.client.brightcom.interpretResponse": [
                  0.8000000044703484
              ],
              "adapter.client.validate": 0,
              "adapters.client.brightcom.validate": 0,
              "adapter.client.buildRequests": 0.7999999970197678,
              "adapters.client.brightcom.buildRequests": 0.7999999970197678,
              "adapter.client.total": 834.2000000029802,
              "adapters.client.brightcom.total": 834.2000000029802
          },
          "bidRequestsCount": 1,
          "bidderRequestsCount": 1,
          "bidderWinsCount": 0,
          "ortb2": {
              "site": {
                  "page": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
                  "domain": "danielle-vallance-b8s4.squarespace.com",
                  "publisher": {
                      "domain": "squarespace.com"
                  }
              },
              "device": {
                  "w": 810,
                  "h": 718,
                  "dnt": 0,
                  "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                  "language": "en",
                  "sua": {
                      "source": 2,
                      "platform": {
                          "brand": "macOS",
                          "version": [
                              "13",
                              "1",
                              "0"
                          ]
                      },
                      "browsers": [
                          {
                              "brand": "Chromium",
                              "version": [
                                  "112",
                                  "0",
                                  "5615",
                                  "137"
                              ]
                          },
                          {
                              "brand": "Google Chrome",
                              "version": [
                                  "112",
                                  "0",
                                  "5615",
                                  "137"
                              ]
                          },
                          {
                              "brand": "Not:A-Brand",
                              "version": [
                                  "99",
                                  "0",
                                  "0",
                                  "0"
                              ]
                          }
                      ],
                      "mobile": 0,
                      "model": "",
                      "bitness": "64",
                      "architecture": "arm"
                  }
              }
          }
      },
      {
          "bidder": "brightcom",
          "params": {
              "publisherId": "000000"
          },
          "userId": {
              "tdid": "XXXXXXXX-XXXX-XXXX-XXXX-AAAAAAAAAAAA",
              "pubProvidedId": [
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "d93c6fe5-3537-40a5-b2fd-22634d125346"
                          }
                      ],
                      "source": "sonobi.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "bf0eeae0-cc81-4336-a699-d24d8b609997"
                          }
                      ],
                      "source": "adserver.org"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "ExKycLZHeuCEQ-VyRd6caG8S"
                          }
                      ],
                      "source": "sovrn.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "83538981561611224161916496640247943203"
                          }
                      ],
                      "source": "adobe.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "d30c559d-8fa8-4955-a774-fb2f9338b6f6"
                          }
                      ],
                      "source": "bidswitch.net"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "L43G3MNS-B-6FE5"
                          }
                      ],
                      "source": "rubiconproject.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "DB812EF8-1B54-4E8B-A3EF-CB91BEAB88AD"
                          }
                      ],
                      "source": "pubmatic.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "5314323018BA1A5FBD9EF699E17926794D4347C32D2E7DE6E788E8EE0E1B8352"
                          }
                      ],
                      "source": "guid.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "g8698fded49dc93ea87c"
                          }
                      ],
                      "source": "yieldmo.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "RX-5f5138c5-0b5f-464f-95ff-ea951006fbd1-005"
                          }
                      ],
                      "source": "rhythmone.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "7657705081667793650"
                          }
                      ],
                      "source": "smartadserver.com"
                  },
                  {
                      "uids": [
                          {
                              "ext": {
                                  "stype": "ppuid"
                              },
                              "id": "7517629e-a0cb-4d00-8622-88ab7ddcb648"
                          }
                      ],
                      "source": "mediamath.com"
                  }
              ]
          },
          "userIdAsEids": [
              {
                  "source": "adserver.org",
                  "uids": [
                      {
                          "id": "XXXXXXXX-XXXX-XXXX-XXXX-AAAAAAAAAAAA",
                          "atype": 1,
                          "ext": {
                              "rtiPartner": "TDID"
                          }
                      }
                  ]
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "d93c6fe5-3537-40a5-b2fd-22634d125346"
                      }
                  ],
                  "source": "sonobi.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "bf0eeae0-cc81-4336-a699-d24d8b609997"
                      }
                  ],
                  "source": "adserver.org"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "ExKycLZHeuCEQ-VyRd6caG8S"
                      }
                  ],
                  "source": "sovrn.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "83538981561611224161916496640247943203"
                      }
                  ],
                  "source": "adobe.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "d30c559d-8fa8-4955-a774-fb2f9338b6f6"
                      }
                  ],
                  "source": "bidswitch.net"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "L43G3MNS-B-6FE5"
                      }
                  ],
                  "source": "rubiconproject.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "DB812EF8-1B54-4E8B-A3EF-CB91BEAB88AD"
                      }
                  ],
                  "source": "pubmatic.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "5314323018BA1A5FBD9EF699E17926794D4347C32D2E7DE6E788E8EE0E1B8352"
                      }
                  ],
                  "source": "guid.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "g8698fded49dc93ea87c"
                      }
                  ],
                  "source": "yieldmo.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "RX-5f5138c5-0b5f-464f-95ff-ea951006fbd1-005"
                      }
                  ],
                  "source": "rhythmone.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "7657705081667793650"
                      }
                  ],
                  "source": "smartadserver.com"
              },
              {
                  "uids": [
                      {
                          "ext": {
                              "stype": "ppuid"
                          },
                          "id": "7517629e-a0cb-4d00-8622-88ab7ddcb648"
                      }
                  ],
                  "source": "mediamath.com"
              }
          ],
          "ortb2Imp": {
              "ext": {
                  "tid": "47f2b5d6-726b-4521-823b-397e3f9f499e"
              }
          },
          "mediaTypes": {
              "banner": {
                  "sizes": [
                      [
                          728,
                          90
                      ],
                      [
                          970,
                          250
                      ]
                  ]
              }
          },
          "adUnitCode": "/19968336/header-bid-tag-1",
          "transactionId": "47f2b5d6-726b-4521-823b-397e3f9f499e",
          "sizes": [
              [
                  728,
                  90
              ],
              [
                  970,
                  250
              ]
          ],
          "bidId": "3535945cfb889d",
          "bidderRequestId": "1ae19dc4e73d02",
          "auctionId": "c290317f-90d3-4ef9-9cf0-34eb73f36f21",
          "src": "client",
          "metrics": {
              "userId.init.gdpr": [
                  0,
                  0,
                  0
              ],
              "userId.mod.init": [
                  0.19999999552965164,
                  0,
                  0.10000000149011612,
                  0,
                  0,
                  2.600000001490116,
                  0
              ],
              "userId.mods.id5Id.init": [
                  0.19999999552965164,
                  0.10000000149011612,
                  0
              ],
              "userId.mods.unifiedId.init": [
                  0,
                  0,
                  0
              ],
              "userId.init.modules": [
                  1.3999999985098839,
                  0.6999999955296516,
                  3
              ],
              "userId.callbacks.pending": [
                  0.10000000149011612
              ],
              "userId.total": [
                  7.799999997019768,
                  463.6000000014901,
                  1685.1000000014901
              ],
              "userId.mods.pubProvidedId.init": [
                  2.600000001490116
              ],
              "userId.mod.callback": [
                  1936.5999999940395,
                  1946.3999999985099,
                  1685.5999999940395
              ],
              "userId.mods.id5Id.callback": [
                  1936.5999999940395,
                  1946.3999999985099,
                  1685.5999999940395
              ],
              "userId.callbacks.total": [
                  1936.5999999940395,
                  1946.5,
                  1685.5999999940395
              ],
              "requestBids.userId": 509.5,
              "requestBids.validate": 2.399999998509884,
              "requestBids.makeRequests": 5.700000002980232,
              "requestBids.total": 1363.3000000044703,
              "requestBids.callBids": 838.8000000044703,
              "adapter.client.net": [
                  832.2999999970198
              ],
              "adapters.client.brightcom.net": [
                  832.2999999970198
              ],
              "adapter.client.interpretResponse": [
                  0.8000000044703484
              ],
              "adapters.client.brightcom.interpretResponse": [
                  0.8000000044703484
              ],
              "adapter.client.validate": 0,
              "adapters.client.brightcom.validate": 0,
              "adapter.client.buildRequests": 0.7999999970197678,
              "adapters.client.brightcom.buildRequests": 0.7999999970197678,
              "adapter.client.total": 834.2000000029802,
              "adapters.client.brightcom.total": 834.2000000029802
          },
          "bidRequestsCount": 1,
          "bidderRequestsCount": 1,
          "bidderWinsCount": 0,
          "ortb2": {
              "site": {
                  "page": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
                  "domain": "danielle-vallance-b8s4.squarespace.com",
                  "publisher": {
                      "domain": "squarespace.com"
                  }
              },
              "device": {
                  "w": 810,
                  "h": 718,
                  "dnt": 0,
                  "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                  "language": "en",
                  "sua": {
                      "source": 2,
                      "platform": {
                          "brand": "macOS",
                          "version": [
                              "13",
                              "1",
                              "0"
                          ]
                      },
                      "browsers": [
                          {
                              "brand": "Chromium",
                              "version": [
                                  "112",
                                  "0",
                                  "5615",
                                  "137"
                              ]
                          },
                          {
                              "brand": "Google Chrome",
                              "version": [
                                  "112",
                                  "0",
                                  "5615",
                                  "137"
                              ]
                          },
                          {
                              "brand": "Not:A-Brand",
                              "version": [
                                  "99",
                                  "0",
                                  "0",
                                  "0"
                              ]
                          }
                      ],
                      "mobile": 0,
                      "model": "",
                      "bitness": "64",
                      "architecture": "arm"
                  }
              }
          }
      }
  ],
  "auctionStart": 1683712721697,
  "timeout": 1000,
  "refererInfo": {
      "reachedTop": true,
      "isAmp": false,
      "numIframes": 0,
      "stack": [
          "https://danielle-vallance-b8s4.squarespace.com/prebid_b"
      ],
      "topmostLocation": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
      "location": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
      "canonicalUrl": "https://www.intentiq.com/prebid_b",
      "page": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
      "domain": "danielle-vallance-b8s4.squarespace.com",
      "ref": null,
      "legacy": {
          "reachedTop": true,
          "isAmp": false,
          "numIframes": 0,
          "stack": [
              "https://danielle-vallance-b8s4.squarespace.com/prebid_b"
          ],
          "referer": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
          "canonicalUrl": "https://www.intentiq.com/prebid_b"
      }
  },
  "metrics": {
      "userId.init.gdpr": [
          0,
          0,
          0
      ],
      "userId.mod.init": [
          0.19999999552965164,
          0,
          0.10000000149011612,
          0,
          0,
          2.600000001490116,
          0
      ],
      "userId.mods.id5Id.init": [
          0.19999999552965164,
          0.10000000149011612,
          0
      ],
      "userId.mods.unifiedId.init": [
          0,
          0,
          0
      ],
      "userId.init.modules": [
          1.3999999985098839,
          0.6999999955296516,
          3
      ],
      "userId.callbacks.pending": [
          0.10000000149011612
      ],
      "userId.total": [
          7.799999997019768,
          463.6000000014901,
          1685.1000000014901
      ],
      "userId.mods.pubProvidedId.init": [
          2.600000001490116
      ],
      "userId.mod.callback": [
          1936.5999999940395,
          1946.3999999985099,
          1685.5999999940395
      ],
      "userId.mods.id5Id.callback": [
          1936.5999999940395,
          1946.3999999985099,
          1685.5999999940395
      ],
      "userId.callbacks.total": [
          1936.5999999940395,
          1946.5,
          1685.5999999940395
      ],
      "requestBids.userId": 509.5,
      "requestBids.validate": 2.399999998509884,
      "requestBids.makeRequests": 5.700000002980232,
      "requestBids.total": 1363.3000000044703,
      "requestBids.callBids": 838.8000000044703,
      "adapter.client.net": [
          832.2999999970198
      ],
      "adapters.client.brightcom.net": [
          832.2999999970198
      ],
      "adapter.client.interpretResponse": [
          0.8000000044703484
      ],
      "adapters.client.brightcom.interpretResponse": [
          0.8000000044703484
      ],
      "adapter.client.validate": 0,
      "adapters.client.brightcom.validate": 0,
      "adapter.client.buildRequests": 0.7999999970197678,
      "adapters.client.brightcom.buildRequests": 0.7999999970197678,
      "adapter.client.total": 834.2000000029802,
      "adapters.client.brightcom.total": 834.2000000029802
  },
  "ortb2": {
      "site": {
          "page": "https://danielle-vallance-b8s4.squarespace.com/prebid_b",
          "domain": "danielle-vallance-b8s4.squarespace.com",
          "publisher": {
              "domain": "squarespace.com"
          }
      },
      "device": {
          "w": 810,
          "h": 718,
          "dnt": 0,
          "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
          "language": "en",
          "sua": {
              "source": 2,
              "platform": {
                  "brand": "macOS",
                  "version": [
                      "13",
                      "1",
                      "0"
                  ]
              },
              "browsers": [
                  {
                      "brand": "Chromium",
                      "version": [
                          "112",
                          "0",
                          "5615",
                          "137"
                      ]
                  },
                  {
                      "brand": "Google Chrome",
                      "version": [
                          "112",
                          "0",
                          "5615",
                          "137"
                      ]
                  },
                  {
                      "brand": "Not:A-Brand",
                      "version": [
                          "99",
                          "0",
                          "0",
                          "0"
                      ]
                  }
              ],
              "mobile": 0,
              "model": "",
              "bitness": "64",
              "architecture": "arm"
          }
      }
  },
  "start": 1683712721706
}), null, 2))
