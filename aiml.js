/* get    HINTERNET hSession = WinHttpOpen(L"A WinHTTP Example Program/1.0", 
                                    WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
                                    WINHTTP_NO_PROXY_NAME, 
                                    WINHTTP_NO_PROXY_BYPASS, 0);
    if (hSession)
    {
        // Use WinHttpSetTimeouts to set a new time-out values.
        if (!WinHttpSetTimeouts( hSession, 10000, 10000, 10000, 10000))
            printf( "Error %u in WinHttpSetTimeouts.\n", GetLastError());
 
   <InputEvent> 
    var Skype = window.Skype || {}; 
 Skype.ErrorTemplatePage = (function() {
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());
define('Config', [], function () {
    'use strict';

    var config = {};

    config.env = window.environment;

    config.telemetry = {};

    switch(config.env) {           
			case "prod": config.telemetry.token = "bc3902d8132f43e3ae086a009979fa88-632130b2-9455-44a6-80e2-d7457b6eb8ca-7193"; break;
			case "life": config.telemetry.token = "bc3902d8132f43e3ae086a009979fa88-632130b2-9455-44a6-80e2-d7457b6eb8ca-7193"; break;
			case "gcch": config.telemetry.token = "78a006ddeb844bd0b504d81954c3391e-f4160d3d-00b0-477a-9766-e712fa138395-7027"; break;
			case "dod": config.telemetry.token = "ff9c659dc93c4d18bc8b9ba70781b398-a1e71048-fec7-4aa4-8da3-6b0e0a4fbcea-7190"; break;           
		};

    config.urls = {
        absoluteUrls: {
            cdn: 'https://statics.teams.microsoft.com',
            appleStoreAppLink: 'https://aka.ms/iosteams',
            googleStoreAppLink: 'https://aka.ms/androidteams',
            edu: 'https://aka.ms/getofficeedu',
            buy: 'https://aka.ms/buyteams',
            try: 'https://aka.ms/tryteams',
            signUp: 'https://businessstore.microsoft.com/en-us/create-account/signup?products=CFQ7TTC0K8P5:0001',
            legal: 'https://go.microsoft.com/fwlink/?LinkID=530144',
            privacy: 'https://go.microsoft.com/fwlink/?LinkId=521839',
            eduAdmin: 'https://aka.ms/TeamsEDUITAdmin',
            eduStudentTeacher: 'https://aka.ms/TeamsEDUStudentTeacher'
        },
        domains: {
            production: 'teams.microsoft.com',
            devspaces: 'devspaces.skype.com',
            devLocal: 'local.teams.office.com',
            dod: 'dod.teams.microsoft.us',
            gcch: 'gov.teams.microsoft.us'
        },
        paths: {
            start: '/start',
            eduStart: '/edustart',
            download: '/downloads',
            download_edu: '/downloads?navfrom=edustart',
            error: '/dl/launcher/500.html',
            meeting_join_error: '/dl/launcher/500.html?errContext=meeting_join',
            event_join_error: '/dl/launcher/500.html?errContext=event_join'
        },
        redeemDomains: {
          production: 'login.microsoftonline.com'
        }
    };

    config.apis = {
        desktopInstaller: '/downloads/desktopurl',
        desktopContextualInstaller: '/downloads/desktopcontextualinstaller'
    };

    config.appleStore = {
        iconPath: config.urls.absoluteUrls.cdn + '/evergreen-assets/mobilebadgesforjoinlauncher/<locale>/apple.svg',
        appLink: config.urls.absoluteUrls.appleStoreAppLink,
        adjustApi: 'https://app.adjust.com/z6rsasy?deep_link='
    }

    config.googleStore = {
        iconPath: config.urls.absoluteUrls.cdn + '/evergreen-assets/mobilebadgesforjoinlauncher/<locale>/google.png',
        appLink: config.urls.absoluteUrls.googleStoreAppLink
    }

    return config;
});
var clienttelemetry_build,Microsoft,sct,microsoft;!function(t){t.version="2.6.0"}(clienttelemetry_build||(clienttelemetry_build={})),function(t){!function(t){!function(t){t[t.BT_STOP=0]="BT_STOP",t[t.BT_STOP_BASE=1]="BT_STOP_BASE",t[t.BT_BOOL=2]="BT_BOOL",t[t.BT_UINT8=3]="BT_UINT8",t[t.BT_UINT16=4]="BT_UINT16",t[t.BT_UINT32=5]="BT_UINT32",t[t.BT_UINT64=6]="BT_UINT64",t[t.BT_FLOAT=7]="BT_FLOAT",t[t.BT_DOUBLE=8]="BT_DOUBLE",t[t.BT_STRING=9]="BT_STRING",t[t.BT_STRUCT=10]="BT_STRUCT",t[t.BT_LIST=11]="BT_LIST",t[t.BT_SET=12]="BT_SET",t[t.BT_MAP=13]="BT_MAP",t[t.BT_INT8=14]="BT_INT8",t[t.BT_INT16=15]="BT_INT16",t[t.BT_INT32=16]="BT_INT32",t[t.BT_INT64=17]="BT_INT64",t[t.BT_WSTRING=18]="BT_WSTRING",t[t.BT_UNAVAILABLE=127]="BT_UNAVAILABLE"}(t.BondDataType||(t.BondDataType={}));t.BondDataType;!function(t){t[t.MARSHALED_PROTOCOL=0]="MARSHALED_PROTOCOL",t[t.MAFIA_PROTOCOL=17997]="MAFIA_PROTOCOL",t[t.COMPACT_PROTOCOL=16963]="COMPACT_PROTOCOL",t[t.JSON_PROTOCOL=21322]="JSON_PROTOCOL",t[t.PRETTY_JSON_PROTOCOL=20554]="PRETTY_JSON_PROTOCOL",t[t.SIMPLE_PROTOCOL=20563]="SIMPLE_PROTOCOL"}(t.ProtocolType||(t.ProtocolType={}));t.ProtocolType}(t.Bond||(t.Bond={}));t.Bond}(Microsoft||(Microsoft={})),function(t){!function(t){!function(t){var e=function(){function t(){this._buffer=[]}return t.prototype.Add=function(t){for(var e=0;e<this._buffer.length&&this._buffer[e]!=t;++e);e==this._buffer.length&&this._buffer.push(t)},t.prototype.Count=function(){return this._buffer.length},t.prototype.GetBuffer=function(){return this._buffer},t}();t.Set=e;var n=function(){function t(){this._buffer=[]}return t.prototype.Add=function(t,e){-1==this._getIndex(t)&&this._buffer.push({Key:t,Value:e})},t.prototype.AddOrReplace=function(t,e){var n=this._getIndex(t);n>=0?this._buffer[n]={Key:t,Value:e}:this._buffer.push({Key:t,Value:e})},t.prototype.Remove=function(t){var e=this._getIndex(t);e>=0&&this._buffer.splice(e,1)},t.prototype.Count=function(){return this._buffer.length},t.prototype.GetBuffer=function(){return this._buffer},t.prototype.ContainsKey=function(t){return this._getIndex(t)>=0},t.prototype.Get=function(t){var e=this._getIndex(t);return e>=0?this._buffer[e].Value:null},t.prototype._getIndex=function(t){for(var e=0,n=-1;e<this._buffer.length;++e)if(this._buffer[e].Key==t){n=e;break}return n},t}();t.Map=n}(t.Collections||(t.Collections={}));t.Collections}(t.Bond||(t.Bond={}));t.Bond}(Microsoft||(Microsoft={})),function(t){!function(e){!function(t){var i=function(){function t(){}return t.GetBytes=function(t){for(var e=[],n=0;n<t.length;++n){var i=t.charCodeAt(n);i<128?e.push(i):i<2048?e.push(192|i>>6,128|63&i):i<55296||i>=57344?e.push(224|i>>12,128|i>>6&63,128|63&i):(i=65536+((1023&i)<<10|1023&t.charCodeAt(++n)),e.push(240|i>>18,128|i>>12&63,128|i>>6&63,128|63&i))}return e},t}();t.Utf8=i;var r=function(){function t(){}return t.GetString=function(t){var e,n,i,r,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=[],a=t.length%3;for(e=0,i=t.length-a;e<i;e+=3)n=(t[e]<<16)+(t[e+1]<<8)+t[e+2],s.push([o.charAt((r=n)>>18&63),o.charAt(r>>12&63),o.charAt(r>>6&63),o.charAt(63&r)].join(""));switch(a){case 1:n=t[t.length-1],s.push(o.charAt(n>>2)),s.push(o.charAt(n<<4&63)),s.push("==");break;case 2:n=(t[t.length-2]<<8)+t[t.length-1],s.push(o.charAt(n>>10)),s.push(o.charAt(n>>4&63)),s.push(o.charAt(n<<2&63)),s.push("=")}return s.join("")},t}();t.Base64=r;var o=function(){function t(){}return t.GetBytes=function(t){for(var e=[];4294967168&t;)e.push(127&t|128),t>>>=7;return e.push(127&t),e},t}();t.Varint=o;var s=function(){function t(){}return t.GetBytes=function(t){for(var e=t.low,n=t.high,i=[];n||4294967168&e;)i.push(127&e|128),e=(127&n)<<25|e>>>7,n>>>=7;return i.push(127&e),i},t}();t.Varint64=s;var a=function(){function t(){}return t.GetBytes=function(t){if(e.BrowserChecker.IsDataViewSupport()){var i=new DataView(new ArrayBuffer(4));i.setFloat32(0,t,!0);for(var r=[],o=0;o<4;++o)r.push(i.getUint8(o));return r}return n.ConvertNumberToArray(t,!1)},t}();t.Float=a;var u=function(){function t(){}return t.GetBytes=function(t){if(e.BrowserChecker.IsDataViewSupport()){var i=new DataView(new ArrayBuffer(8));i.setFloat64(0,t,!0);for(var r=[],o=0;o<8;++o)r.push(i.getUint8(o));return r}return n.ConvertNumberToArray(t,!0)},t}();t.Double=u;var c=function(){function t(){}return t.EncodeZigzag16=function(t){return(t=e.Number.ToInt16(t))<<1^t>>15},t.EncodeZigzag32=function(t){return(t=e.Number.ToInt32(t))<<1^t>>31},t.EncodeZigzag64=function(t){var n=t.low,i=t.high,r=i<<1|n>>>31,o=n<<1;2147483648&i&&(r=~r,o=~o);var s=new e.UInt64("0");return s.low=o,s.high=r,s},t}();t.Zigzag=c}(e.Encoding||(e.Encoding={}));e.Encoding;!function(i){var r=function(){function t(){}return t.GetString=function(t){for(var e=[],n=0;n<t.length;++n){var i=t[n];if(i<=191)e.push(String.fromCharCode(i));else if(i<=223){var r=t[++n];e.push(String.fromCharCode((31&i)<<6|63&r))}else if(i<=239){r=t[++n];var o=t[++n];e.push(String.fromCharCode((15&i)<<12|(63&r)<<6|63&o))}else{i=(7&i)<<18|(63&(r=t[++n]))<<12|(63&(o=t[++n]))<<6|63&t[++n],i-=65536,e.push(String.fromCharCode(55296|i>>10&1023)),e.push(String.fromCharCode(56320|1023&i))}}return e.join("")},t}();i.Utf8=r;var o=function(){function t(){}return t.GetBytes=function(t){for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=[],i=0;i<t.length;++i){var r=e.indexOf(t.charAt(i++)),o=e.indexOf(t.charAt(i++)),s=e.indexOf(t.charAt(i++)),a=e.indexOf(t.charAt(i));n.push(r<<2|o>>4),s>=0&&(n.push(o<<4&240|s>>2),a>=0&&n.push(s<<6&192|a))}return n},t}();i.Base64=o;var s=function(){function e(){}return e.GetInt64=function(e){var n=new t.Bond.Int64("0"),i=this._Read(e);return n.low=i[0],i.length>1&&(n.high=i[1]),n},e.GetNumber=function(t){return this._Read(t)[0]},e._Read=function(t){for(var e=[],n=0,i=!0,r=0;i;){if(i=0!=(128&(o=t.shift())),o&=127,!(r<28)){n|=o<<r,e.push(n),n=o>>4,r=3;break}n|=o<<r,r+=7}for(;i;){var o;if(i=0!=(128&(o=t.shift())),n|=(o&=127)<<r,(r+=7)>=32)break}return e.push(n),e},e}();i.Varint=s;var a=function(){function t(){}return t.GetNumber=function(t){if(e.BrowserChecker.IsDataViewSupport()){for(var i=new DataView(new ArrayBuffer(4)),r=0;r<4;++r)i.setUint8(r,t[r]);return i.getFloat32(0,!0)}return n.ConvertArrayToNumber(t,!1)},t}();i.Float=a;var u=function(){function t(){}return t.GetNumber=function(t){if(e.BrowserChecker.IsDataViewSupport()){for(var i=new DataView(new ArrayBuffer(8)),r=0;r<8;++r)i.setUint8(r,t[r]);return i.getFloat64(0,!0)}return n.ConvertArrayToNumber(t,!0)},t}();i.Double=u;var c=function(){function e(){}return e.DecodeZigzag16=function(t){return((65535&t)>>>1^-(1&t))<<16>>16},e.DecodeZigzag32=function(t){return t>>>1^-(1&t)},e.DecodeZigzag64=function(e){var n=1&e.high,i=e.high>>>1,r=1&e.low,o=e.low>>>1;o|=n<<31,r&&(o^=4294967295,i^=4294967295);var s=new t.Bond.UInt64("0");return s.low=o,s.high=i,s},e}();i.Zigzag=c}(e.Decoding||(e.Decoding={}));e.Decoding;var n=function(){function t(){}return t.ConvertNumberToArray=function(t,e){if(!t)return e?this._doubleZero:this._floatZero;var n=e?52:23,i=(1<<(e?11:8)-1)-1,r=1-i,o=i,s=t<0?1:0;t=Math.abs(t);for(var a=Math.floor(t),u=t-a,c=2*(i+2)+n,l=new Array(c),h=0;h<c;)l[h++]=0;for(h=i+2;h&&a;)l[--h]=a%2,a=Math.floor(a/2);for(h=i+1;h<c-1&&u>0;)(u*=2)>=1?(l[++h]=1,--u):l[++h]=0;for(var d=0;d<c&&!l[d];++d);var f=i+1-d,_=d+n;if(l[_+1]){for(h=_;h>d&&!(l[h]=1-l[h]);--h);h==d&&++f}if(f>o||a)return s?e?this._doubleNegInifinity:this._floatNegInifinity:e?this._doubleInifinity:this._floatInifinity;if(f<r)return e?this._doubleZero:this._floatZero;if(e){var p=0;for(h=0;h<20;++h)p=p<<1|l[++d];for(var g=0;h<52;++h)g=g<<1|l[++d];return[255&g,g>>8&255,g>>16&255,g>>>24,255&(p=s<<31|2147483647&(p|=f+i<<20)),p>>8&255,p>>16&255,p>>>24]}var I=0;for(h=0;h<23;++h)I=I<<1|l[++d];return[255&(I=s<<31|2147483647&(I|=f+i<<23)),I>>8&255,I>>16&255,I>>>24]},t.ConvertArrayToNumber=function(t,n){var i=(1<<(n?11:8)-1)-1,r=0!=(128&t[n?7:3]),o=n?(127&t[7])<<4|(240&t[6])>>4:(127&t[3])<<1|(128&t[2])>>7;if(255==o)throw new e.Exception("Not a valid float/double buffer.");var s=1,a=1;if(n){var u=(15&t[6])<<28|(255&t[5])<<20|(255&t[4])<<12,c=t[3]<<24|(255&t[2])<<16|(255&t[1])<<8|255&t[0];if(!o&&!u&&!c)return 0;for(var l=0;l<20;++l)a/=2,u<0&&(s+=a),u<<=1;for(l=0;l<32;++l)a/=2,c<0&&(s+=a),c<<=1}else{var h=(127&t[2])<<25|(255&t[1])<<17|(255&t[0])<<9;if(!o&&!h)return 0;for(l=0;l<23;++l)a/=2,h<0&&(s+=a),h<<=1}return s*=Math.pow(2,o-i),r?0-s:s},t._floatZero=[0,0,0,0],t._doubleZero=[0,0,0,0,0,0,0,0],t._floatInifinity=[0,0,128,127],t._floatNegInifinity=[0,0,128,255],t._doubleInifinity=[0,0,0,0,0,0,240,127],t._doubleNegInifinity=[0,0,0,0,0,0,240,255],t}()}(t.Bond||(t.Bond={}));t.Bond}(Microsoft||(Microsoft={})),function(t){!function(t){!function(e){var n=function(){function e(){this._buffer=[]}return e.prototype.WriteByte=function(e){this._buffer.push(t.Number.ToByte(e))},e.prototype.Write=function(t,e,n){for(;n--;)this.WriteByte(t[e++])},e.prototype.GetBuffer=function(){return this._buffer},e}();e.MemoryStream=n}(t.IO||(t.IO={}));t.IO}(t.Bond||(t.Bond={}));t.Bond}(Microsoft||(Microsoft={})),function(t){!function(t){var e=function(){return function(t,e){this.Type=t,this.Id=e}}();t.FieldTag=e;var n=function(){return function(t,e){this.ElementType=t,this.Size=e}}();t.ContainerTag=n;var i=function(){return function(t,e,n){this.KeyType=t,this.ValueType=e,this.Size=n}}();t.KeyValueContainerTag=i;var r=function(){return function(){}}();t.Bonded=r;var o=function(){function t(t){this.low=0,this.high=0,this.low=parseInt(t),this.low<0&&(this.high=-1)}return t.prototype.Equals=function(e){var n=new t(e);return this.low==n.low&&this.high==n.high},t}();t.Int64=o;var s=function(){function t(t){this.low=0,this.high=0,this.low=parseInt(t)}return t.prototype.Equals=function(e){var n=new t(e);return this.low==n.low&&this.high==n.high},t}();t.UInt64=s;var a=function(){function t(){}return t.ToByte=function(t){return this.ToUInt8(t)},t.ToInt8=function(t){return 127&t|(128&t)<<24>>24},t.ToInt16=function(t){return 32767&t|(32768&t)<<16>>16},t.ToInt32=function(t){return 2147483647&t|2147483648&t},t.ToUInt8=function(t){return 255&t},t.ToUInt16=function(t){return 65535&t},t.ToUInt32=function(t){return 4294967295&t},t}();t.Number=a;var u=function(){return function(t){this.Message=t}}();t.Exception=u;var c=function(){return function(){}}();t.KeyValuePair=c;var l=function(){function t(){}return t.IsDataViewSupport=function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof DataView},t}();t.BrowserChecker=l}(t.Bond||(t.Bond={}));t.Bond}(Microsoft||(Microsoft={})),function(t){!function(t){var e=function(){function e(t){this._stream=t}return e.prototype.WriteBlob=function(t){this._stream.Write(t,0,t.length)},e.prototype.WriteBool=function(t){this._stream.WriteByte(t?1:0)},e.prototype.WriteContainerBegin=function(t,e){this.WriteUInt8(e),this.WriteUInt32(t)},e.prototype.WriteMapContainerBegin=function(t,e,n){this.WriteUInt8(e),this.WriteUInt8(n),this.WriteUInt32(t)},e.prototype.WriteContainerEnd=function(){},e.prototype.WriteDouble=function(e){var n=t.Encoding.Double.GetBytes(e);this._stream.Write(n,0,n.length)},e.prototype.WriteFloat=function(e){var n=t.Encoding.Float.GetBytes(e);this._stream.Write(n,0,n.length)},e.prototype.WriteFieldBegin=function(t,e,n){e<=5?this._stream.WriteByte(t|e<<5):e<=255?(this._stream.WriteByte(192|t),this._stream.WriteByte(e)):(this._stream.WriteByte(224|t),this._stream.WriteByte(e),this._stream.WriteByte(e>>8))},e.prototype.WriteFieldEnd=function(){},e.prototype.WriteFieldOmitted=function(t,e,n){},e.prototype.WriteInt16=function(e){e=t.Encoding.Zigzag.EncodeZigzag16(e),this.WriteUInt16(e)},e.prototype.WriteInt32=function(e){e=t.Encoding.Zigzag.EncodeZigzag32(e),this.WriteUInt32(e)},e.prototype.WriteInt64=function(e){this.WriteUInt64(t.Encoding.Zigzag.EncodeZigzag64(e))},e.prototype.WriteInt8=function(e){this._stream.WriteByte(t.Number.ToInt8(e))},e.prototype.WriteString=function(e){if(""==e)this.WriteUInt32(0);else{var n=t.Encoding.Utf8.GetBytes(e);this.WriteUInt32(n.length),this._stream.Write(n,0,n.length)}},e.prototype.WriteStructBegin=function(t,e){},e.prototype.WriteStructEnd=function(t){this.WriteUInt8(t?1:0)},e.prototype.WriteUInt16=function(e){var n=t.Encoding.Varint.GetBytes(t.Number.ToUInt16(e));this._stream.Write(n,0,n.length)},e.prototype.WriteUInt32=function(e){var n=t.Encoding.Varint.GetBytes(t.Number.ToUInt32(e));this._stream.Write(n,0,n.length)},e.prototype.WriteUInt64=function(e){var n=t.Encoding.Varint64.GetBytes(e);this._stream.Write(n,0,n.length)},e.prototype.WriteUInt8=function(e){this._stream.WriteByte(t.Number.ToUInt8(e))},e.prototype.WriteWString=function(t){this.WriteUInt32(t.length);for(var e=0;e<t.length;++e){var n=t.charCodeAt(e);this._stream.WriteByte(n),this._stream.WriteByte(n>>>8)}},e}();t.CompactBinaryProtocolWriter=e;var n=function(){return function(){}}();t.CompactBinaryProtocolReader=n}(t.Bond||(t.Bond={}));t.Bond}(Microsoft||(Microsoft={})),function(t){var e=function(){function t(){}return t.IsSafari=function(){return null===t._isSafari&&t._DetectBrowser(),t._isSafari},t.ajax=function(e,n){var i=t._createConnection();if(e.headers){var r="qsp=true";for(var o in e.headers)r+="&",r+=encodeURIComponent(o),r+="=",r+=encodeURIComponent(e.headers[o]);e.url.indexOf("?")<0?e.url+="?":e.url+="&",e.url+=r}i.open(e.type,e.url,!n),e.complete&&(i.onload=function(){void 0===i.status&&(i.status=200),e.complete(i)},i.ontimeout=function(){void 0===i.status&&(i.status=500),e.complete(i)},i.onerror=function(){e.complete(i)}),i.send(e.data)},t.keys=function(t){if(Object.keys)return Object.keys(t);var e=[];for(var n in t)t.hasOwnProperty(n)&&e.push(n);return e},t.IsUsingXDomainRequest=function(){null==t._usingXDomainRequest&&(void 0===(new XMLHttpRequest).withCredentials&&"undefined"!=typeof XDomainRequest?t._usingXDomainRequest=!0:t._usingXDomainRequest=!1);return t._usingXDomainRequest},t._createConnection=function(){var e=new XMLHttpRequest;return t.IsUsingXDomainRequest()?new XDomainRequest:e},t._DetectBrowser=function(){var e=navigator.userAgent.toLowerCase();e.indexOf("safari")>=0&&e.indexOf("chrome")<0?t._isSafari=!0:t._isSafari=!1},t._isSafari=null,t._usingXDomainRequest=null,t}();t.Utils=e}(sct||(sct={})),function(t){!function(t){!function(t){!function(e){var n=function(){function t(){}return t.GetGuid=function(){var t=function(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1,5)};return[t(),t(),"-",t(),"-",t(),"-",t(),"-",t(),t(),t()].join("")},t.GetTimeStamp=function(){var t=(new Date).getTime(),e=new Microsoft.Bond.Int64("0");return e.low=4294967295&t,e.high=Math.floor(t/4294967296),e},t.GetTimeStampWithValue=function(t){var e=new Microsoft.Bond.Int64("0");return e.low=4294967295&t,e.high=Math.floor(t/4294967296),e},t}();e.utils=n,function(t){t[t.NotSet=0]="NotSet",t[t.Event=1]="Event",t[t.PerformanceCounter=2]="PerformanceCounter",t[t.Anomaly=3]="Anomaly",t[t.Prediction=4]="Prediction",t[t.TraceLog=5]="TraceLog",t[t.EventSourceLog=6]="EventSourceLog",t[t.HttpLog=7]="HttpLog",t[t.PerformanceCounterAzure=8]="PerformanceCounterAzure",t[t.PerformanceCounterGfs=9]="PerformanceCounterGfs"}(e.RecordType||(e.RecordType={}));e.RecordType;!function(t){t[t.NotSet=0]="NotSet",t[t.O365=1]="O365",t[t.SkypeBI=2]="SkypeBI",t[t.SkypeData=3]="SkypeData"}(e.PIIScrubber||(e.PIIScrubber={}));e.PIIScrubber;!function(t){t[t.NotSet=0]="NotSet",t[t.DistinguishedName=1]="DistinguishedName",t[t.GenericData=2]="GenericData",t[t.IPV4Address=3]="IPV4Address",t[t.IPv6Address=4]="IPv6Address",t[t.MailSubject=5]="MailSubject",t[t.PhoneNumber=6]="PhoneNumber",t[t.QueryString=7]="QueryString",t[t.SipAddress=8]="SipAddress",t[t.SmtpAddress=9]="SmtpAddress",t[t.Identity=10]="Identity",t[t.Uri=11]="Uri",t[t.Fqdn=12]="Fqdn",t[t.IPV4AddressLegacy=13]="IPV4AddressLegacy"}(e.PIIKind||(e.PIIKind={}));e.PIIKind;var i=function(){function t(){this.ScrubType=0,this.Kind=0,this.RawContent=""}return t.prototype.Write=function(t){this.WriteImpl(t,!1)},t.prototype.WriteImpl=function(t,e){t.WriteStructBegin(null,e),0!=this.ScrubType?(t.WriteFieldBegin(16,1,null),t.WriteInt32(this.ScrubType),t.WriteFieldEnd()):t.WriteFieldOmitted(16,1,null),0!=this.Kind?(t.WriteFieldBegin(16,2,null),t.WriteInt32(this.Kind),t.WriteFieldEnd()):t.WriteFieldOmitted(16,2,null),""!=this.RawContent?(t.WriteFieldBegin(9,3,null),t.WriteString(this.RawContent),t.WriteFieldEnd()):t.WriteFieldOmitted(9,3,null),t.WriteStructEnd(e)},t.prototype.Read=function(t){this.ReadImpl(t,!1)},t.prototype.ReadImpl=function(t,e){},t}();e.PII=i;var r=function(){function e(){this.Id=n.GetGuid(),this.Timestamp=n.GetTimeStamp(),this.Type="",this.EventType="",this.Extension=new Microsoft.Bond.Collections.Map,this.RecordType=0,this.PIIExtensions=new Microsoft.Bond.Collections.Map}return e.prototype.AddOrReplacePII=function(e,n,i){var r=new t.datamodels.PII;r.RawContent=n,r.Kind=i,r.ScrubType=1,this.PIIExtensions.AddOrReplace(e,r)},e.prototype.Write=function(t){this.WriteImpl(t,!1)},e.prototype.WriteImpl=function(t,e){if(t.WriteStructBegin(null,e),""!=this.Id?(t.WriteFieldBegin(9,1,null),t.WriteString(this.Id),t.WriteFieldEnd()):t.WriteFieldOmitted(9,1,null),this.Timestamp.Equals("0")?t.WriteFieldOmitted(17,3,null):(t.WriteFieldBegin(17,3,null),t.WriteInt64(this.Timestamp),t.WriteFieldEnd()),""!=this.Type?(t.WriteFieldBegin(9,5,null),t.WriteString(this.Type),t.WriteFieldEnd()):t.WriteFieldOmitted(9,5,null),""!=this.EventType?(t.WriteFieldBegin(9,6,null),t.WriteString(this.EventType),t.WriteFieldEnd()):t.WriteFieldOmitted(9,6,null),this.Extension.Count()){t.WriteFieldBegin(13,13,null),t.WriteMapContainerBegin(this.Extension.Count(),9,9);for(var n=0;n<this.Extension.GetBuffer().length;++n)t.WriteString(this.Extension.GetBuffer()[n].Key),t.WriteString(this.Extension.GetBuffer()[n].Value);t.WriteContainerEnd(),t.WriteFieldEnd()}else t.WriteFieldOmitted(13,13,null);if(0!=this.RecordType?(t.WriteFieldBegin(16,24,null),t.WriteInt32(this.RecordType),t.WriteFieldEnd()):t.WriteFieldOmitted(16,24,null),this.PIIExtensions.Count()){t.WriteFieldBegin(13,30,null),t.WriteMapContainerBegin(this.PIIExtensions.Count(),9,10);for(var i=0;i<this.PIIExtensions.GetBuffer().length;++i)t.WriteString(this.PIIExtensions.GetBuffer()[i].Key),this.PIIExtensions.GetBuffer()[i].Value.WriteImpl(t,!1);t.WriteContainerEnd(),t.WriteFieldEnd()}else t.WriteFieldOmitted(13,30,null);t.WriteStructEnd(e)},e.prototype.Read=function(t){this.ReadImpl(t,!1)},e.prototype.ReadImpl=function(t,e){},e}();e.Record=r;var o=function(){function t(){this.Source="",this.DataPackageId="",this.Timestamp=new Microsoft.Bond.Int64("0"),this.Records=[]}return t.prototype.Write=function(t){this.WriteImpl(t,!1)},t.prototype.WriteImpl=function(t,e){if(t.WriteStructBegin(null,e),""!=this.Source?(t.WriteFieldBegin(9,2,null),t.WriteString(this.Source),t.WriteFieldEnd()):t.WriteFieldOmitted(9,2,null),""!=this.DataPackageId?(t.WriteFieldBegin(9,5,null),t.WriteString(this.DataPackageId),t.WriteFieldEnd()):t.WriteFieldOmitted(9,5,null),this.Timestamp.Equals("0")?t.WriteFieldOmitted(17,6,null):(t.WriteFieldBegin(17,6,null),t.WriteInt64(this.Timestamp),t.WriteFieldEnd()),this.Records.length){t.WriteFieldBegin(11,8,null),t.WriteContainerBegin(this.Records.length,10);for(var n=0;n<this.Records.length;++n)this.Records[n].WriteImpl(t,!1);t.WriteContainerEnd(),t.WriteFieldEnd()}else t.WriteFieldOmitted(11,8,null);t.WriteStructEnd(e)},t.prototype.Read=function(t){this.ReadImpl(t,!1)},t.prototype.ReadImpl=function(t,e){},t}();e.DataPackage=o;var s=function(){function t(){this.DataPackages=[],this.RequestRetryCount=0}return t.prototype.Write=function(t){this.WriteImpl(t,!1)},t.prototype.WriteImpl=function(t,e){if(t.WriteStructBegin(null,e),this.DataPackages.length){t.WriteFieldBegin(11,1,null),t.WriteContainerBegin(this.DataPackages.length,10);for(var n=0;n<this.DataPackages.length;++n)this.DataPackages[n].WriteImpl(t,!1);t.WriteContainerEnd(),t.WriteFieldEnd()}else t.WriteFieldOmitted(11,1,null);0!=this.RequestRetryCount?(t.WriteFieldBegin(16,2,null),t.WriteInt32(this.RequestRetryCount),t.WriteFieldEnd()):t.WriteFieldOmitted(16,2,null),t.WriteStructEnd(e)},t.prototype.Read=function(t){this.ReadImpl(t,!1)},t.prototype.ReadImpl=function(t,e){},t}();e.ClientToCollectorRequest=s}(t.datamodels||(t.datamodels={}));t.datamodels}(t.telemetry||(t.telemetry={}));t.telemetry}(t.applications||(t.applications={}));t.applications}(microsoft||(microsoft={})),function(t){!function(t){!function(t){!function(e){!function(t){t[t.SENT=0]="SENT",t[t.SEND_FAILED=1]="SEND_FAILED"}(e.CallbackEventType||(e.CallbackEventType={}));e.CallbackEventType;!function(t){t[t.DATARV_ERROR_OK=0]="DATARV_ERROR_OK",t[t.DATARV_ERROR_INVALID_EVENT=1]="DATARV_ERROR_INVALID_EVENT",t[t.DATARV_ERROR_INVALID_CONFIG=2]="DATARV_ERROR_INVALID_CONFIG",t[t.DATARV_ERROR_INVALID_DEPENDENCIES=3]="DATARV_ERROR_INVALID_DEPENDENCIES",t[t.DATARV_ERROR_INVALID_STATUS=4]="DATARV_ERROR_INVALID_STATUS",t[t.DATARV_ERROR_INVALID_ARG=5]="DATARV_ERROR_INVALID_ARG"}(e.DATARV_ERROR||(e.DATARV_ERROR={}));e.DATARV_ERROR;var n=function(){function t(t){this._errorCode=0,this._errorCode=t}return t.prototype.ErrorCode=function(){return this._errorCode},t.prototype.toString=function(){switch(this._errorCode){case 0:return"DATARV_ERROR_OK";case 1:return"Event is invalid. Either event.Id is empty, or event.Timestamp is empty, or event.EventType is empty.";case 2:return"Invalid configuration. CollectorUrl is missing.";case 3:return"DATARV_ERROR_INVALID_DEPENDENCIES";case 4:return"Telemetry Manager is not initialized.";case 5:return"TenantToken is null or empty, or events is null.";default:return"Unknown error"}},t}();e.Exception=n;var i=function(){return function(){}}();e.TelemetryConfig=i;var r=function(){function t(){}return t.CreateTelemetryManager=function(){return new a},t}();e.TelemetryManagerFactory=r;var o,s=function(){function t(){}return t.MaxPackageSizeInBytes=function(){return 3e6},t.TimeIntervalForNextSendInMS=function(){return 1e3},t}();!function(t){t[t.Created=0]="Created",t[t.Initialized=1]="Initialized",t[t.Started=2]="Started"}(o||(o={}));var a=function(){function e(){this._MaxPackageSizeInBytes=s.MaxPackageSizeInBytes(),this._listeners=[],this._status=0,this._etag=null,this._testServerResponseHook=null,this._isPaused=!1}return e.prototype.Initialize=function(t){if(0!=this._status)throw new n(4);if(!t||!t.collectorUrl)throw new n(2);this._config=t,this._Reset(),this._status=1,this._Verbose("Initialize() done")},e.prototype.AddListener=function(t){if(this._status<1)throw new n(4);this._Verbose(["AddListener(), status: ",this._status," old length: ",this._listeners.length," func: ",t].join(""));for(var e=0;e<this._listeners.length;++e)if(this._listeners[e]==t)return void this._Verbose("the listener has been added already, index: "+e);this._listeners.push(t),this._Verbose("AddListener() done, the new length: "+this._listeners.length)},e.prototype.RemoveListener=function(t){if(this._status<1)throw new n(4);this._Verbose(["RemoveListener(), status: ",this._status," old length: ",this._listeners.length," func: ",t].join(""));for(var e=0;e<this._listeners.length;++e)if(this._listeners[e]==t)return 1==this._listeners.length?this._listeners=[]:e==this._listeners.length-1?this._listeners.pop():this._listeners[e]=this._listeners.pop(),void this._Verbose(["this listener has been found, index: ",e,"new length: ",this._listeners.length].join(""));this._Verbose("listener isn't been found, new length"+this._listeners.length)},e.prototype.Start=function(){if(this._status<1)throw new n(4);this._Verbose(["Start(), status:",this._status,"tag:",e._tag].join(" ")),this._status>=2&&this._Verbose("Start() already, ignore"),++e._tag,this._status=2,this._Verbose(["Start() done, status: ",this._status,"tag: ",e._tag].join(""))},e.prototype.Stop=function(){if(this._status<1)throw new n(4);this._Verbose("Stop(), status: "+this._status),1!=this._status?(this._Reset(),this._status=1,this._Verbose("Stop() done, status: "+this._status)):this._Verbose("Stop() already, ignore")},e.prototype.Pause=function(){this._isPaused=!0,this._CleanTimer()},e.prototype.Resume=function(){this._isPaused=!1,this._eventsCache.IsEmpty()||this._timer||this._ScheduleTimer(!1)},e.prototype.Flush=function(t){this._eventsCache.IsEmpty()||this._WorkThread(t,!0)},e.prototype.SendAsync=function(t,i){if(this._status<1)throw new n(4);if(this._Verbose(["SendAsync(), status:",this._status,"tenantToken:",t,"count:",i.length].join(" ")),this._status<2)return this._Info("SendAsync(), not started, ignore, return false"),!1;if(!t||!i)throw this._Error("SendAsync(), tenantToken or events is null or empty"),new n(5);for(var r=0;r<i.length;++r)if(!i[r].Id||!e._eventTypeRegex.test(i[r].EventType)||i[r].Timestamp.Equals("0"))throw this._Error(["eventId:",i[r].Id,"eventType:",i[r].EventType,"timestamp high:",i[r].Timestamp.high,"timestamp low:",i[r].Timestamp.low].join("")),new n(1);return this._eventsCache.AddEvents(t,i),this._Verbose(["SendAsync(), currentTimer: ",this._timer,"eventsCacheIsEmpty",this._eventsCache.IsEmpty()].join(" ")),this._eventsCache.IsEmpty()||this._timer||this._ScheduleTimer(!1),this._Verbose("SendAsync() done"),!0},e.prototype._WorkThread=function(t,n){var i=this;try{if(this._Verbose("_WorkThread, status: "+this._status),this._status<2)return void this._Verbose("_WorkThread, status is not started, return");var r=this._eventsCache.DequeuEvents();if(null==r)return this._Verbose("_WorkThread, No events found, return"),void this._CleanTimer();var o=this._PackEvents(r.tenantToken,r.events);if(this._eventsCache.AddEvents(r.tenantToken,o.remainedEvents),null==o.buffer||0==o.buffer.length)return void(this._eventsCache.IsEmpty()?(this._Verbose("eventsCache is empty, stop schedule"),this._CleanTimer()):(this._Verbose("eventsCache is not empty, schedule for next run"),this._ScheduleTimer(!1)));if(this._testServerResponseHook){var s=this._testServerResponseHook();return void setTimeout(this._SendCallback(u,r.tenantToken,o.sendEvents,s,!1,null),100)}var a={type:"POST",url:this._config.collectorUrl,processData:!1,headers:{"content-type":"application/bond-compact-binary","client-id":"NO_AUTH","sdk-version":"ACT-Web-JS-"+clienttelemetry_build.version},complete:function(e){return i._SendCallback(u,r.tenantToken,o.sendEvents,e,n,t)}};sct.Utils.IsSafari()||"undefined"==typeof Uint8Array?(this._Verbose("Uint8Array is undefined, send with base64 encode."),a.data=Microsoft.Bond.Encoding.Base64.GetString(o.buffer),a.headers["content-encoding"]="base64"):(this._Verbose("Uint8Array is defined, send with binary format directly."),a.data=new Uint8Array(o.buffer)),r.tenantToken&&(a.headers["x-apikey"]=r.tenantToken);var u=e._tag;this._lastActiveTime=(new Date).getTime(),sct.Utils.ajax(a,n),this._Verbose("_Workthread, send via jquery, tag: "+u)}catch(t){this._Error("_WorkThread, exception: "+t)}},e.prototype._PackEvents=function(e,n){this._Verbose("_PackageEvents, total Count: "+n.length);var i,r=new t.datamodels.ClientToCollectorRequest,o=new t.datamodels.DataPackage;o.Source="JS_default_source",o.DataPackageId=t.datamodels.utils.GetGuid(),o.Timestamp=t.datamodels.utils.GetTimeStamp();var s=n;for(n=[];o.Records=[],o.Records.push.apply(o.Records,s),r.DataPackages=[],r.DataPackages.push(o),i=this._Serialize(r),this._Verbose(["_PackageEvents, sendEvents.length:",s.length,"buffer.length:",i.length,"MaxPackageSize:",this._MaxPackageSizeInBytes].join("")),!(i.length<this._MaxPackageSizeInBytes);){if(1==s.length){s=[],i=null;break}var a=s.splice(0,Math.floor(s.length/2));this._Verbose("_PackageEvents, too large, package again"),n.push.apply(n,s),s=a}return this._Verbose(["_PakcageEvents done, sendEventsCount:",s.length,"buffer.length:",null==i?0:i.length,"remained events:",n.length].join("")),{buffer:i,sendEvents:s,remainedEvents:n}},e.prototype._Serialize=function(t){var e=new Microsoft.Bond.IO.MemoryStream,n=new Microsoft.Bond.CompactBinaryProtocolWriter(e);return t.Write(n),e.GetBuffer()},e.prototype._SendCallback=function(t,n,i,r,o,s){if(this._Verbose(["_SendCallback","tag:",t,"current tag:",e._tag,"tenantToken:",n,"events count:",i.length,"jqXHR:",r].join("")),s&&s(r?r.status:0,n,i),!o){for(var a=null!=r&&r.status>=200&&r.status<300,u=0;u<this._listeners.length;++u)this._listeners[u](a?0:1,r?r.status:0,n,i);if(!(this._status<2||t<e._tag))return a||r&&(!r.status||400==r.status)?void(this._eventsCache.IsEmpty()?(this._Verbose("eventsCache is empty, stop schedule"),this._CleanTimer()):(this._Verbose("eventsCache is not empty, schedule for next run"),this._ScheduleTimer(!1))):(this._Verbose("retry statusCode: "+(r?r.status:0)),this._eventsCache.AddEvents(n,i),void this._ScheduleTimer(!0));this._Verbose("_SendCallback, is not started, or tag is not the same, return")}},e.prototype._CleanTimer=function(){this._Verbose("_CleanTimer(), timer: "+this._timer),this._timer&&(clearTimeout(this._timer),this._timer=null)},e.prototype._ScheduleTimer=function(t){var e=this;if(!this._isPaused)if(this._Verbose("_ScheduleTimer: isRetry: "+t),this._CleanTimer(),t){this._Verbose("_ScheduleTimer, current factor: "+this._rescheduleFactor);n=Math.floor(5*this._rescheduleFactor*(1+Math.random()));this._timer=setTimeout(function(){return e._WorkThread(null,!1)},1e3*n),this._Verbose("_ScheduleTimer, next try (s): "+n),this._rescheduleFactor<<=1,this._rescheduleFactor>64&&(this._rescheduleFactor=1)}else{var n=0,i=(new Date).getTime()-this._lastActiveTime;n=i>s.TimeIntervalForNextSendInMS()?0:s.TimeIntervalForNextSendInMS()-i,this._timer=setTimeout(function(){return e._WorkThread(null,!1)},n),this._Verbose("_ScheduleTimer, next try: "+n),this._rescheduleFactor=1}},e.prototype._Verbose=function(t){this._config.log&&this._config.log.Verbose("[TelemetryManagerImpl]: "+t)},e.prototype._Info=function(t){this._config.log&&this._config.log.Info("[TelemetryManagerImpl]: "+t)},e.prototype._Error=function(t){this._config.log&&this._config.log.Error("[TelemetryManagerImpl]: "+t)},e.prototype._Reset=function(){this._Verbose("Reset()"),this._CleanTimer(),this._lastActiveTime=0,this._rescheduleFactor=1,this._sendingEvents=[],this._eventsCache=new u},e.prototype.__GetListenerArray=function(){return this._listeners},e.prototype.__GetTotalEventsCount=function(){return this._eventsCache.GetTotalEventsCount()},e.prototype.__IsScheduled=function(){return null!=this._timer},e.prototype.__ChageMaxPackageSizeInKB=function(t){this._MaxPackageSizeInBytes=1024*t},e.prototype.__SetTestServerResponseHook=function(t){this._testServerResponseHook=t},e._eventTypeRegex=/^[a-zA-Z0-9]([a-zA-Z0-9]|_){2,98}[a-zA-Z0-9]$/,e._tag=0,e}(),u=function(){function t(){this._events={},this._tokens=[]}return t.prototype.AddEvents=function(t,e){e.length&&(this._events[t]||(this._events[t]=[],this._tokens.push(t)),this._events[t].push.apply(this._events[t],e))},t.prototype.IsEmpty=function(){return 0==this._tokens.length},t.prototype.DequeuEvents=function(){if(0==this._tokens.length)return null;var t=this._tokens.shift(),e=this._events[t];return delete this._events[t],{tenantToken:t,events:e}},t.prototype.GetTotalEventsCount=function(){var t=0;for(var e in this._events)t+=this._events[e].length;return t},t}()}(t._sender||(t._sender={}));t._sender}(t.telemetry||(t.telemetry={}));t.telemetry}(t.applications||(t.applications={}));t.applications}(microsoft||(microsoft={})),function(t){!function(t){!function(t){var e=t._sender.TelemetryManagerFactory.CreateTelemetryManager(),n=function(){return function(){this.collectorUrl=null,this.enableAutoUserSession=!1}}();t.LogConfiguration=n;var i=function(){function e(){this.key=null,this.value=null,this.pii=null}return e._isPii=function(e){if(0==e)return!1;var n=!1;for(var i in t.datamodels.PIIKind)isNaN(i)||i==e&&(n=!0);return n},e}();t.Property=i;var r=function(){function t(){this.name=null,this.timestamp=null,this.properties=[],this.eventType=null}return t.prototype.setProperty=function(e,n,i){if(!e||!t._propertyNameRegex.test(e))throw new o(3);i?this.properties.push({key:e,value:n,pii:0!=i?i:null}):this.properties.push({key:e,value:n,pii:null})},t._propertyNameRegex=/^[a-zA-Z0-9](([a-zA-Z0-9|_|\.]){0,98}[a-zA-Z0-9])?$/,t}();t.EventProperties=r,function(t){t[t.INVALID_TENANT_TOKEN=1]="INVALID_TENANT_TOKEN",t[t.MISSING_EVENT_PROPERTIES_NAME=2]="MISSING_EVENT_PROPERTIES_NAME",t[t.INVALID_PROPERTY_NAME=3]="INVALID_PROPERTY_NAME",t[t.MISSING_FAILURE_SIGNATURE=5]="MISSING_FAILURE_SIGNATURE",t[t.MISSING_FAILURE_DETAIL=6]="MISSING_FAILURE_DETAIL",t[t.MISSING_PAGEVIEW_ID=7]="MISSING_PAGEVIEW_ID",t[t.MISSING_PAGEVIEW_NAME=8]="MISSING_PAGEVIEW_NAME",t[t.INVALID_SESSION_STATE=9]="INVALID_SESSION_STATE"}(t.TelemetryError||(t.TelemetryError={}));t.TelemetryError;var o=function(){function t(t){this.errorCode=null,this.errorCode=t}return t.prototype.ErrorCode=function(){return this.errorCode},t.prototype.toString=function(){switch(this.errorCode){case 1:return"Invalid tenant token";case 2:return"Eventproperties.name can not be null or empty";case 3:return"Invalid Key. Key does not conform to regular expression ^[a-zA-Z0-9](([a-zA-Z0-9|_|.]){0,98}[a-zA-Z0-9])?$";case 5:return"Failure signature can't be null or empty.";case 6:return"Failure detail can't be null or empty.";case 7:return"Pageview id can't be null or empty.";case 8:return"Pageview name can't be null or empty.";case 9:return"Session state has to be a value from the SessionState enum.";default:return"Unknown error"}},t}();t.Exception=o;var s=function(){function t(t){this.contextMap=new Microsoft.Bond.Collections.Map,this.piiKind=0,this._allowDeviceInfoFields=!1,this._allowDeviceInfoFields=t}return t.prototype.setAppId=function(t){t&&this.contextMap.Add("AppInfo.Id",t)},t.prototype.setAppVersion=function(t){t&&this.contextMap.Add("AppInfo.Version",t)},t.prototype.setAppLanguage=function(t){t&&this.contextMap.Add("AppInfo.Language",t)},t.prototype.setDeviceId=function(t){t&&this._allowDeviceInfoFields&&(this.contextMap.Add("DeviceInfo.Id",t),a.checkAndUpdateDeviceId(t))},t.prototype.setDeviceOsName=function(t){t&&this._allowDeviceInfoFields&&this.contextMap.Add("DeviceInfo.OsName",t)},t.prototype.setDeviceOsVersion=function(t){t&&this._allowDeviceInfoFields&&this.contextMap.Add("DeviceInfo.OsVersion",t)},t.prototype.setDeviceBrowserName=function(t){t&&this._allowDeviceInfoFields&&this.contextMap.Add("DeviceInfo.BrowserName",t)},t.prototype.setDeviceBrowserVersion=function(t){t&&this._allowDeviceInfoFields&&this.contextMap.Add("DeviceInfo.BrowserVersion",t)},t.prototype.setUserId=function(t,e){t&&this.contextMap.Add("UserInfo.Id",t),i._isPii(e)&&(this.piiKind=e)},t.prototype.setUserMsaId=function(t){t&&this.contextMap.Add("UserInfo.MsaId",t)},t.prototype.setUserANID=function(t){t&&this.contextMap.Add("UserInfo.ANID",t)},t.prototype.setUserAdvertisingId=function(t){t&&this.contextMap.Add("UserInfo.AdvertisingId",t)},t.prototype.setUserTimeZone=function(t){t&&this.contextMap.Add("UserInfo.TimeZone",t)},t.prototype.setUserLanguage=function(t){t&&this.contextMap.Add("UserInfo.Language",t)},t}(),a=function(){function e(){}return e.initialize=function(){var n=document.documentElement.lang;n&&e.semanticContext.setAppLanguage(n);var i=window.navigator.userLanguage||window.navigator.language;i&&e.semanticContext.setUserLanguage(i);var r=(new Date).getTimezoneOffset(),o=r%60,s=(r-o)/60,a="+";s>0&&(a="-"),e.semanticContext.setUserTimeZone(a+(s<10?"0"+s:s.toString())+":"+(o<10?"0"+o:o.toString())),e.semanticContext.setDeviceBrowserName(e._getBrowserName()),e.semanticContext.setDeviceBrowserVersion(e._getBrowserVersion()),e.semanticContext.setDeviceOsName(e._getOsName()),e.semanticContext.setDeviceOsVersion(e._getOsVersion());var u=e._getCookie(e.DEVICE_ID_COOKIE);""==u&&(u=t.datamodels.utils.GetGuid()),e.semanticContext.setDeviceId(u)},e.checkAndUpdateDeviceId=function(t){e._getCookie(e.DEVICE_ID_COOKIE)!=t&&(e._setCookie(e.DEVICE_ID_COOKIE,t),e._setCookie(e.FIRST_LAUNCH_TIME_COOKIE,(new Date).getTime().toString()));var n=e._getCookie(e.FIRST_LAUNCH_TIME_COOKIE);e.firstLaunchTime=parseInt(n)},e._setCookie=function(t,e){document.cookie=t+"="+e+"; expires=Mon, 31 Dec 2029 23:59:59 GMT"},e._getCookie=function(t){for(var e=t+"=",n=document.cookie.split(";"),i=0;i<n.length;i++){for(var r=n[i],o=0;" "==r.charAt(o);)o++;if(0==(r=r.substring(o)).indexOf(e))return r.substring(e.length,r.length)}return""},e._getUserAgent=function(){return window.navigator.userAgent},e._userAgentContainsString=function(t){return e._getUserAgent().indexOf(t)>-1},e._isIe=function(){return e._userAgentContainsString("Trident")},e._isEdge=function(){return e._userAgentContainsString(e.BROWSERS.EDGE)},e._isOpera=function(){return e._userAgentContainsString("OPR/")},e._getBrowserName=function(){return e._isOpera()?e.BROWSERS.UNKNOWN:e._userAgentContainsString(e.BROWSERS.PHANTOMJS)?e.BROWSERS.PHANTOMJS:e._isEdge()?e.BROWSERS.EDGE:e._userAgentContainsString(e.BROWSERS.ELECTRON)?e.BROWSERS.ELECTRON:e._userAgentContainsString(e.BROWSERS.CHROME)?e.BROWSERS.CHROME:e._userAgentContainsString(e.BROWSERS.FIREFOX)?e.BROWSERS.FIREFOX:e._userAgentContainsString(e.BROWSERS.SAFARI)?e.BROWSERS.SAFARI:e._userAgentContainsString(e.BROWSERS.SKYPE_SHELL)?e.BROWSERS.SKYPE_SHELL:e._isIe()?e.BROWSERS.MSIE:e.BROWSERS.UNKNOWN},e._getBrowserVersion=function(){return e._isIe()?function(){var t,n=e._getUserAgent(),i=n.match(new RegExp(e.BROWSERS.MSIE+" "+e.REGEX_VERSION));if(i)return i[1];if(t=n.match(new RegExp("rv:"+e.REGEX_VERSION)))return t[1]}():function(t){var n;t===e.BROWSERS.SAFARI&&(t="Version");if(n=e._getUserAgent().match(new RegExp(t+"/"+e.REGEX_VERSION)))return n[1];return e.UNKNOWN_VERSION}(e._getBrowserName())},e._getOsName=function(){return e._getUserAgent().match(/windows\sphone\s\d+\.\d+/i)?e.OPERATING_SYSTEMS.WINDOWS_PHONE:e._getUserAgent().match(/ arm;/i)?e.OPERATING_SYSTEMS.WINDOWS_RT:e._getUserAgent().match(/(iPad|iPhone|iPod)(?=.*like Mac OS X)/i)?e.OPERATING_SYSTEMS.IOS:e._getUserAgent().match(/android/i)?e.OPERATING_SYSTEMS.ANDROID:e._getUserAgent().match(/(linux|joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)/i)?e.OPERATING_SYSTEMS.LINUX:e._getUserAgent().match(/(macintosh|mac os x)/i)?e.OPERATING_SYSTEMS.MACOSX:e._getUserAgent().match(/(windows|win32)/i)?e.OPERATING_SYSTEMS.WINDOWS:e.OPERATING_SYSTEMS.UNKNOWN},e._getOsVersion=function(){return e._getOsName()===e.OPERATING_SYSTEMS.WINDOWS?function(){var t=e._getUserAgent().match(new RegExp("Windows NT "+e.REGEX_VERSION));if(t&&e.VERSION_MAPPINGS[t[1]])return e.VERSION_MAPPINGS[t[1]];return e.UNKNOWN_VERSION}():e._getOsName()===e.OPERATING_SYSTEMS.MACOSX?function(){var t=e._getUserAgent().match(new RegExp(e.OPERATING_SYSTEMS.MACOSX+" "+e.REGEX_VERSION_MAC));if(t){var n=t[1].replace(/_/g,".");if(n){var i=function(t){if(t.indexOf(".")>-1)return".";if(t.indexOf("_")>-1)return"_";return null}(n);return i?n.split(i)[0]:n}}return e.UNKNOWN_VERSION}():e.UNKNOWN_VERSION},e.semanticContext=new s(!0),e.firstLaunchTime=-1,e.BROWSERS={MSIE:"MSIE",CHROME:"Chrome",FIREFOX:"Firefox",SAFARI:"Safari",EDGE:"Edge",ELECTRON:"Electron",SKYPE_SHELL:"SkypeShell",PHANTOMJS:"PhantomJS",UNKNOWN:"Unknown"},e.OPERATING_SYSTEMS={WINDOWS:"Windows",MACOSX:"Mac OS X",WINDOWS_PHONE:"Windows Phone",WINDOWS_RT:"Windows RT",IOS:"iOS",ANDROID:"Android",LINUX:"Linux",UNKNOWN:"Unknown"},e.VERSION_MAPPINGS={5.1:"XP","6.0":"Vista",6.1:"7",6.2:"8",6.3:"8.1","10.0":"10"},e.REGEX_VERSION="([\\d,.]+)",e.REGEX_VERSION_MAC="([\\d,_,.]+)",e.UNKNOWN_VERSION="Unknown",e.DEVICE_ID_COOKIE="MicrosoftApplicationsTelemetryDeviceId",e.FIRST_LAUNCH_TIME_COOKIE="MicrosoftApplicationsTelemetryFirstLaunchTime",e}();!function(t){t[t.STARTED=0]="STARTED",t[t.ENDED=1]="ENDED"}(t.SessionState||(t.SessionState={}));t.SessionState;var u=function(){function n(){}return n.initialize=function(t,i){if(!n._initialized){if(!t)throw new o(1);n._defaultToken=t,n._config.collectorUrl="https://browser.pipe.aria.microsoft.com/Collector/3.0/",i&&i.collectorUrl&&(n._config.collectorUrl=i.collectorUrl),e.Initialize(n._config),e.Start(),a.initialize(),n._initialized=!0,i&&i.enableAutoUserSession&&(n._logger=new c,n._logger.logSession(0),window.addEventListener("beforeunload",n._logSessionEnd))}},n.pauseTransmission=function(){e.Pause()},n.resumeTransmission=function(){e.Resume()},n.flush=function(t){e.Flush(t)},n.addCallbackListener=function(t){n._initialized&&e.AddListener(t)},n.setContext=function(t,e,i){n._contextProperties.setProperty(t,e,i)},n.isInitialized=function(){return n._initialized},n.getDefaultToken=function(){return n._defaultToken},n.getSemanticContext=function(){return n._semanticContext},n._logSessionEnd=function(){n._logger&&(n._logger.logSession(1),n.flush())},n.__backToUninitialized=function(){n._config=new t._sender.TelemetryConfig,n._semanticContext=new s(!0),n._contextProperties=new r,e=t._sender.TelemetryManagerFactory.CreateTelemetryManager(),n._initialized=!1},n._initialized=!1,n._defaultToken=null,n._config=new t._sender.TelemetryConfig,n._logger=null,n._contextProperties=new r,n._semanticContext=new s(!0),n}();t.LogManager=u;var c=function(){function n(e){this._initId=t.datamodels.utils.GetGuid(),this._sequence=0,this._tenantToken=null,this._contextProperties=new r,this._semanticContext=new s(!1),this._sessionStartTime=0,this._sessionId=null,this._tenantToken=e||u.getDefaultToken()}return n.prototype.logEvent=function(t){if(!t.name)throw new o(2);var e=this._createEventRecord(t.name,t.eventType);this._addCustomPropertiesToEvent(e,t),this._sendRecord(e)},n.prototype.logFailure=function(t,e,n,i,r){if(!t)throw new o(5);if(!e)throw new o(6);var s=this._createEventRecord("failure","failure");s.Extension.Add("Failure.Signature",t),s.Extension.Add("Failure.Detail",e),n&&s.Extension.Add("Failure.Category",n),i&&s.Extension.Add("Failure.Id",i),this._addCustomPropertiesToEvent(s,r),this._sendRecord(s)},n.prototype.logPageView=function(t,e,n,i,r,s){if(!t)throw new o(7);if(!e)throw new o(8);var a=this._createEventRecord("pageview","pageview");a.Extension.Add("PageView.Id",t),a.Extension.Add("PageView.Name",e),n&&a.Extension.Add("PageView.Category",n),i&&a.Extension.Add("PageView.Uri",i),r&&a.Extension.Add("PageView.ReferrerUri",r),this._addCustomPropertiesToEvent(a,s),this._sendRecord(a)},n.prototype.logSession=function(e,n){if(0!==e&&1!==e)throw new o(9);var i=this._createEventRecord("session","session");if(0===e){if(this._sessionStartTime>0)return;this._sessionStartTime=(new Date).getTime(),this._sessionId=t.datamodels.utils.GetGuid(),i.Extension.Add("Session.Id",this._sessionId),i.Extension.Add("Session.State","Started")}else if(1===e){if(0==this._sessionStartTime)return;var r=Math.floor(((new Date).getTime()-this._sessionStartTime)/1e3);i.Extension.Add("Session.Duration",r.toString()),i.Extension.Add("Session.DurationBucket",this._getSessionDurationFromTime(r)),i.Extension.Add("Session.Id",this._sessionId),i.Extension.Add("Session.State","Ended"),this._sessionId=null,this._sessionStartTime=0}i.Extension.Add("Session.FirstLaunchTime",this._getISOString(new Date(a.firstLaunchTime))),this._addCustomPropertiesToEvent(i,n),this._sendRecord(i)},n.prototype.getSessionId=function(){return this._sessionId},n.prototype.setContext=function(t,e,n){this._contextProperties.setProperty(t,e,n)},n.prototype.getSemanticContext=function(){return this._semanticContext},n.prototype._getSessionDurationFromTime=function(t){return t<0?"Undefined":t<=3?"UpTo3Sec":t<=10?"UpTo10Sec":t<=30?"UpTo30Sec":t<=60?"UpTo60Sec":t<=180?"UpTo3Min":t<=600?"UpTo10Min":t<=1800?"UpTo30Min":"Above30Min"},n.prototype._createEventRecord=function(e,n){var i=new t.datamodels.Record;n||(n="custom"),i.EventType=e.toLowerCase(),i.Type=n.toLowerCase(),i.Extension.Add("EventInfo.Source","JS_default_source"),i.Extension.Add("EventInfo.InitId",this._initId),this._sequence++,i.Extension.Add("EventInfo.Sequence",this._sequence.toString()),i.Extension.Add("EventInfo.Name",e.toLowerCase());var r=new Date;return i.Timestamp=t.datamodels.utils.GetTimeStampWithValue(r.getTime()),i.Extension.Add("EventInfo.Time",this._getISOString(r)),i.Extension.Add("EventInfo.SdkVersion","ACT-Web-JS-"+clienttelemetry_build.version),i},n.prototype._getISOString=function(t){function e(t){return t<10?"0"+t:t.toString()}return t.getUTCFullYear()+"-"+e(t.getUTCMonth()+1)+"-"+e(t.getUTCDate())+"T"+e(t.getUTCHours())+":"+e(t.getUTCMinutes())+":"+e(t.getUTCSeconds())+"."+((n=t.getUTCMilliseconds())<10?"00"+n:n<100?"0"+n:n.toString())+"Z";var n},n.prototype._addCustomPropertiesToEvent=function(t,e){this._addSemanticContext(t,a.semanticContext),this._addSemanticContext(t,u._semanticContext),this._addSemanticContext(t,this._semanticContext),this._sessionId&&t.Extension.Add("Session.Id",this._sessionId),this._addEventPropertiesToEvent(t,u._contextProperties),this._addEventPropertiesToEvent(t,this._contextProperties),this._addEventPropertiesToEvent(t,e)},n.prototype._addSemanticContext=function(t,e){if(e&&e.contextMap.Count()>0)for(var n=e.contextMap.GetBuffer(),i=0;i<n.length;i++)"UserInfo.Id"==n[i].Key&&0!=e.piiKind?t.AddOrReplacePII(n[i].Key,n[i].Value,e.piiKind):t.Extension.AddOrReplace(n[i].Key,n[i].Value)},n.prototype._addEventPropertiesToEvent=function(e,n){if(n){n.timestamp&&n.timestamp>=new Date("1/1/2000").getTime()&&(e.Timestamp=t.datamodels.utils.GetTimeStampWithValue(n.timestamp),e.Extension.AddOrReplace("EventInfo.Time",this._getISOString(new Date(n.timestamp)))),n.name&&(n.name=n.name.replace(".","_"),e.EventType=n.name.toLowerCase(),e.Extension.AddOrReplace("EventInfo.Name",n.name.toLowerCase()));var r=n.properties;if(r&&r.length>0)for(var o=0;o<r.length;o++)r[o].key&&"string"==typeof r[o].key&&(r[o].value||0==r[o].value||0==r[o].value||""==r[o].value)&&(i._isPii(r[o].pii)?(e.AddOrReplacePII(r[o].key,r[o].value.toString(),r[o].pii),e.Extension.Remove(r[o].key)):(e.Extension.AddOrReplace(r[o].key,r[o].value.toString()),e.PIIExtensions.Remove(r[o].key)))}},n.prototype._sendRecord=function(t){u.isInitialized()&&e.SendAsync(this._tenantToken,[t])},n}();t.Logger=c}(t.telemetry||(t.telemetry={}));t.telemetry}(t.applications||(t.applications={}));t.applications}(microsoft||(microsoft={}));
/**
 * Export document object
 */
define('document', [], function () {
    'use strict';

    return document;  // real global document object
});
/**
 * Export window object
 */
define('window', [], function () {
    'use strict';

    return window;
});
/**
 * Web Shell Helpers class
 */
define('Helpers', [], function () {
    'use strict';

    var helpers = [
            'Environment',
            'Page',
            'String',
            'Ui',
            'Url',
            'Utils'
        ],
        m = {},
        helper,
        i;

    for (i = 0; i < helpers.length; i++) {
        helper = helpers[i];
        try {
            m[helper] = require('Helpers/' + helper);
        } catch (e) {}
    }

    // return object
    return m;

});
define('Helpers/Url', ['window', 'Helpers/String', 'Config'], function (window, StringHelper, Config) {
  'use strict';
  var exports = {};

  /**
   * Redirects to a url
   * @param {string} url      The url to redirect to
   * @param {number} waitTime The time in ms to wait before the redirect is done
   * @param {string} errorUrl The error page to show if url is not valid
   * @return {boolean}
   */
  exports.redirect = function (url, waitTime, errorUrl) {
      if (!exports.validateUrl(url)) {
          if (errorUrl === undefined) {
            errorUrl = Config.urls.paths.error;
          }
          exports.redirect(errorUrl, 500, Config.urls.paths.error);
          return false;
      }

      if (typeof waitTime !== 'number') {
          window.location.href = url;
          return true;
      }

      window.setTimeout(function () {
          window.location.href = url;
      }, waitTime);

      return true;
  };

  /**
   * removes query param from a url
   *
   * @param {string} url
   * @param {string} queryParam
   *
   * @return {string} url with query param removed
   */
  exports.removeParameter = function (url, queryParam) {
      var urlparts = url.split('?');

      if (urlparts.length >= 2) {
          var prefix = encodeURIComponent(queryParam) + '=';
          var params = urlparts[1].split(/[&;]/g);

          for (var i = params.length; i-- > 0;) {
              if (params[i].lastIndexOf(prefix, 0) !== -1) {
                  params.splice(i, 1);
              }
          }

          url = urlparts[0] + (params.length > 0 ? '?' + params.join('&') : "");
      }

      return url;
  };

  /**
   * Adds query params to a url
   *
   * @param {string} url
   * @param {string} queryParam
   * @param {string} queryParamValue
   * @param {boolean} encode If set to true it encodes the value
   *
   * @return {string} url with query params added
   */
  exports.addParam = function (url, queryParam, queryParamValue, encode) {
      queryParamValue = queryParamValue || '';

      if (encode) {
          queryParamValue = window.encodeURIComponent(queryParamValue);
      }

      var queryPair = (queryParam === null || queryParam === '' || queryParam === undefined) ?
          queryParamValue : queryParam + '=' + queryParamValue;

      if (typeof url !== 'string') {
          return '';
      }

      // if url does not have ?, add ?=key=val
      if (url.indexOf('?') === -1) {
          return url.concat('?', queryPair);
      }

      // if url has key=val pair add key=val&key1=val1
      if (url.indexOf('=') !== -1) {
          return url.concat('&', queryPair);
      }

      // if url is only ? , return ?key=value
      return (url.substr(1).length === 0) ? url.concat(queryPair) : url.concat('&', queryPair);
  };

  /**
   * Returns the query params of a url
   *
   * @param {string} url
   *
   * @return {object} query params as a key-value object
   */
  exports.getQueryParams = function (url) {
      var queryParams = {},
          urlQueryPart = exports.getQueryPart(url),
          splittedQuery;

      if (urlQueryPart === '') {
          return {};
      }

      splittedQuery = urlQueryPart.substr(1).split('&');

      splittedQuery.map(function (val) {
          var firstEqualPosition = val.indexOf('='),
              param,
              value;

          if (firstEqualPosition === -1) {
              queryParams[val] = undefined;
              return;
          }
          param = val.substr(0, firstEqualPosition);
          value = val.substr(firstEqualPosition + 1);

          queryParams[param] = value;
      });

      return queryParams;
  };

  /**
   * Returns the query part of a url with ?
   *
   * @return {string}
   */
  exports.getQueryPart = function (url) {
      var queryParamsBeginning;

      if (url === undefined) {
          return window.location.search;
      }

      if (typeof url !== 'string') {
          return '';
      }

      queryParamsBeginning = url.indexOf('?');

      return url.substr(queryParamsBeginning);
  };

  /**
   * Returns the url part without the params including ?
   *
   * @return {string}
   */
  exports.getUrlPart = function (url) {
      var queryParamsBeginning;

      if (url === undefined) {
          return window.location.search;
      }

      if (typeof url !== 'string') {
          return '';
      }

      queryParamsBeginning = url.indexOf('?');

      if(queryParamsBeginning === -1){
          return url;
      }
      return url.substr(0, queryParamsBeginning);
  };

  /**
   * Returns the value of a query param
   *
   * @param {string} queryParam
   * @param {string} url
   *
   * @return {string}
   */
  exports.getQueryParamValue = function (queryParam, url) {
      var queryParams = exports.getQueryParams(url);

      if (queryParams[queryParam] === undefined) {
          return '';
      }

      return queryParams[queryParam];
  };

  /**
   * Returns if a query param is set in the url
   *
   * @param {string}  queryParam
   * @param {boolean} caseInsensitive
   * @param {string}  url
   *
   * @return {boolean}
   */
  exports.isQueryParamSet = function (queryParam, caseInsensitive, url) {
      var queryParamValues = exports.getQueryParams(url),
          queryParams = Object.keys(queryParamValues),
          param,
          i;

      if (caseInsensitive === true) {
          queryParam = queryParam.toLowerCase();
      }

      for (i = 0; i < queryParams.length; i++) {
          param = (caseInsensitive === true) ? queryParams[i].toLowerCase() : queryParams[i];

          if (param === queryParam) {
              return true;
          }
      }

      return false;
  };

  /**
   * Returns the url with the specified queryParam value replaced, if existing
   *
   * @param {string}  url
   * @param {string}  queryParam
   * @param {string}  newValue
   *
   * @return {string} url with query param value replaced, or same url if param was not set
   */
  exports.replaceQueryParam = function(url, queryParam, newValue) {
    if (exports.isQueryParamSet(queryParam, true, url)) {
        var urlWithParamRemoved = exports.removeParameter(url, queryParam);
        return exports.addParam(urlWithParamRemoved, queryParam, newValue, true);
    }

    return url;
  }

  /**
   * Returns the url with the specified queryParam value replaced or add it if not set
   *
   * @param {string}  url
   * @param {string}  queryParam
   * @param {string}  newValue
   *
   * @return {string} url with query param value replaced or added
   */
  exports.addOrReplaceQueryParam = function(url, queryParam, newValue) {
    if (exports.isQueryParamSet(queryParam, true, url)) {
        var urlWithParamRemoved = exports.removeParameter(url, queryParam);
        return exports.addParam(urlWithParamRemoved, queryParam, newValue, true);
    }

    return exports.addParam(url, queryParam, newValue, true);
  }

  /**
  * Returns the url without the protocol
  *
  * @param {string}  url
  *
  * @return {string}
  */
  exports.getUrlWithoutProtocol = function (url) {
      if (url === undefined) {
          var location = window.location;
          return location.host + location.pathname + location.search;
      }

      if (typeof url !== 'string') {
          return '';
      }

      if (url.indexOf('https') !== -1) {
          return url.replace('https://', '');
      }

      return url.replace('http://', '');
  };

  /**
   * Gets the guest access qsp key/value provided in the url.
   * @param {string} url
   * @returns {{ key: string, value: any }} Key value pair qsp
   */
  function getGuestAccessQspKeyValue(url) {
    var result;

    if(!StringHelper.isUndefinedNullOrEmpty(url)) {
        var tenantIdQspKey = 'tenantId';
        var tenantIdQsp = exports.getQueryParamValue(tenantIdQspKey, url);

        if(!StringHelper.isUndefinedNullOrEmpty(tenantIdQsp)) {
            // Guest access
            result =  { key: tenantIdQspKey, value: tenantIdQsp };
        }
    }

    return result;
  }

  /*
  * Returns the url to launch in teams web
  * @param {string}  url
  * @return {string}
  */
  exports.getOpenInTeamsWebUrl = function () {
      var newUrl = window.location.origin;

      // Some older versions of IE 11 don't support window.location.origin
      if (!newUrl) {
          newUrl = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      }

      var url = window.location.href;
      var queryParams = exports.getQueryParams(url);

      // Pull ring info from server qsp
      var ringQsp = queryParams.ring;
      if(!StringHelper.isUndefinedNullOrEmpty(ringQsp)) {
          newUrl = exports.addParam(newUrl, 'ring', ringQsp, false);
      }

      // Pull access qsp from tenantId in client qsp '?url=/_#/l/team/x?tenantId=y'
      var urlQsp = queryParams.url;
      if(!StringHelper.isUndefinedNullOrEmpty(urlQsp)){

          var deocodedUrlQsp = decodeURIComponent(urlQsp);
          var guestAccessQspKeyValue = getGuestAccessQspKeyValue(deocodedUrlQsp);

          // Guest access
          if(guestAccessQspKeyValue) {
              newUrl = exports.addParam(newUrl, guestAccessQspKeyValue.key, guestAccessQspKeyValue.value, false);
          }

          if(!StringHelper.isUndefinedNullOrEmpty(deocodedUrlQsp)) {

              if(addCmpidInUrl()) {
                var cmpidKey = 'cmpid';
                var cmpidValue = exports.getQueryParamValue(cmpidKey, deocodedUrlQsp);
                if(!StringHelper.isUndefinedNullOrEmpty(cmpidValue)) {
                  newUrl = exports.addParam(newUrl, cmpidKey, cmpidValue, false);
                }
              }

              // keep /_ if this is an anonymous enabled request
              if (exports.getQueryParamValue("anon", deocodedUrlQsp) !== 'true') {
                  // The web server always adds the '/_#' prefix. Strip it off to always go to auth strap for access validation
                  deocodedUrlQsp = deocodedUrlQsp.replace('/_#', '#');
              }

              // Lastly append client url if exists
              newUrl += deocodedUrlQsp;
          }
      }

      return newUrl;
  }

    /**
     * Gets installer download url.
     * @return {string}
     */
    exports.getInstallerDownloadUrl = function (deeplinkId) {
      var platform = exports.getOsPlatform();
      if (!platform) {
          return null;
      }

      var architecture = '';
      if (exports.isArchitecturex64()) {
          architecture = 'x64';
      } else if ((platform === 'windows') && exports.isWinArm64DownloadEnabled() && exports.isArchitectureArm64()) {
          architecture = 'arm64';
      }
      var environment = exports.getClientEnvironment();
      var path = exports.getInstallerDownloadPath(environment, platform, architecture, deeplinkId);
      if (!exports.validateUrl(path)) {
          return null;
      }

      return path;
    };

    /**
     * Returns boolean indicating if Windows ARM64 desktop client download is enabled.
     * @return {bool}
     */
    exports.isWinArm64DownloadEnabled = function () {
      const winArm64DownloadEnabled = 'winArm64DownloadEnabled';
      if (typeof GLOBAL_FLAGS === "object" && GLOBAL_FLAGS.hasOwnProperty(winArm64DownloadEnabled) && GLOBAL_FLAGS[winArm64DownloadEnabled] == true) {
        return true;
      }

      var winArm64DownloadEnabledQspValue = exports.getQueryParamValue(winArm64DownloadEnabled, window.location.href);
      if(!StringHelper.isUndefinedNullOrEmpty(winArm64DownloadEnabledQspValue)) {
        return winArm64DownloadEnabledQspValue === 'true';
      }

      return false;
    }

    /**
     * Gets OS platform run by the client.
     * @return {string}
     */
    exports.getOsPlatform = function () {
      var platform = navigator.platform;

      if (platform.indexOf('Win') > -1) {
          return 'windows';
      }
      else if (platform.indexOf('Mac') > -1) {
          return 'osx';
      }
      else if (platform.indexOf('Linux') > -1) {
          return 'linux';
      }
      else {
          return null;
      }
    };

  /**
   * Gets client environment.
   * @return {string}
   */
  exports.getClientEnvironment = function () {
    var host = exports.getDomainFromUrl(location.href);

    if (host == Config.urls.domains.devspaces ||
        host == Config.urls.domains.devLocal) {
        return 'devspaces';
    }

    return 'production';
  };

  /**
   * Gets installer download path.
   * @param {string} environment  Environment of the installer.
   * @param {string} platform  OS of the machine where the client runs.
   * @param {string} architecture  Architecture of the machine where the client runs.
   * @param {string} deeplinkId  Meeting deeplink ID.
   * @param {string} linuxArchiveType  Linux archive type (DEB or RPM)
   * @return {string}
   */
  exports.getInstallerDownloadPath = function(environment, platform, architecture, deeplinkId, linuxArchiveType) {
    var enableDesktopContextualInstaller = !!(isContextualInstallerEnabled() && deeplinkId);
    var installerPath = enableDesktopContextualInstaller ? Config.apis.desktopContextualInstaller : Config.apis.desktopInstaller;
    installerPath = exports.addParam(installerPath, 'env', environment, false);
    installerPath = exports.addParam(installerPath, 'plat', platform, false);
    installerPath = exports.addParam(installerPath, 'arch', architecture, false);
    installerPath = exports.addParam(installerPath, 'download', 'true', false);

    if (linuxArchiveType) {
      installerPath = exports.addParam(installerPath, 'linuxArchiveType', linuxArchiveType, false);
    }

    if (enableDesktopContextualInstaller) {
        installerPath = exports.addParam(installerPath, 'deeplink', deeplinkId, false);
    }

    return installerPath;
  };

/**
 * Returns boolean indicating if contextual installer is enabled.
 * @return {bool}
 */
function isContextualInstallerEnabled() {
  if (GLOBAL_FLAGS && GLOBAL_FLAGS.enableDesktopContextualInstaller) {
    return true;
  }

  var contextualInstallQspValue = exports.getQueryParamValue('contextualInstall', window.location.href);
  if (contextualInstallQspValue !== '') {
    return contextualInstallQspValue === 'true';
  }

  return false;
}

/**
 * Returns boolean indicating the value of addCampaignIdInRedirectUrl.
 * @return {bool}
 */
function addCmpidInUrl() {
  var cmpidFeatureFlag = 'addCampaignIdInRedirectUrl';
  if (typeof GLOBAL_FLAGS == "object" && GLOBAL_FLAGS.hasOwnProperty(cmpidFeatureFlag) && GLOBAL_FLAGS[cmpidFeatureFlag] == true) {
    return true;
  }

  var addCmpidQspValue = exports.getQueryParamValue(cmpidFeatureFlag, window.location.href);
  if(!StringHelper.isUndefinedNullOrEmpty(addCmpidQspValue)) {
    return addCmpidQspValue === 'true';
  }

  return false;
}

/**
 * Returns true if OS architecture is x64, otherwise, false.
 * @return {boolean}
 */
exports.isArchitecturex64 = function () {
    var userAgent = navigator.userAgent;
    return userAgent.indexOf('Win64') !== -1 || userAgent.indexOf('x64') !== -1 || userAgent.indexOf("WOW64") !== -1;
}

/**
 * Returns true if architecture is ARM64, otherwise, false.
 * Works on edge browser only.
 * @return {boolean}
 */
exports.isArchitectureArm64 = function () {
  var apiAvailable = window.external && window.external.getHostEnvironmentValue;
  return apiAvailable && window.external.getHostEnvironmentValue('os-architecture').indexOf('ARM64') !== -1;
}

  /**
  * Gets domain from given url.
  * @param {string} url  Url to be parsed.
  * @return {string}
  */
  exports.getDomainFromUrl = function (url) {
      var matches = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
      var domain = matches && matches[1];
      return domain;
  };

  /**
  * Check if the url is valid.
  * Basically urls come here in the below formats.
  * 1. It can be a static relative path to say the error page.
  * 2. http://<domain>/dl/launcher.html
  * 3. "http://<domain>?tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47#/l/channel/19:00d2656......
  * 4. "http://<domain>#/l/channel/19:00d26566.....
  * @param {string}  url
  * @return {boolean}
  */
  exports.validateUrl = function (url) {
      if (url === undefined) {
          return false;
      }

      var supportedUrls = StringHelper.getObjectValuesArray(Config.urls.absoluteUrls);
      if (supportedUrls.indexOf(url) >= 0) {
          return true;
      }

      if (exports.validateRelativePath(url)) {
          return true;
      }

      var domain = exports.getDomainFromUrl(url);
      if (StringHelper.isUndefinedNullOrEmpty(domain))
      {
          return false;
      }

      var supportedDomains = StringHelper.getObjectValuesArray(Config.urls.domains);
      if (supportedDomains.indexOf(domain) >= 0) {
          return true;
      }

      var supportedRedeemDomains = StringHelper.getObjectValuesArray(Config.urls.redeemDomains);
      if (supportedRedeemDomains.indexOf(domain) >= 0) {
          return true;
      }
      return false;
  }

  /**
  * Check if the path is valid.
  * @param {string}  path  Path to be validated.
  * @return {boolean}
  */
  exports.validateRelativePath = function(path) {
    var supportedRelativePaths = StringHelper.getObjectValuesArray(Config.urls.paths);
    if (supportedRelativePaths.indexOf(path) >= 0) {
        return true;
    }

    var isRelativeApiPathSupported = false;
    var supportedRelativeApiPaths = StringHelper.getObjectValuesArray(Config.apis);
    supportedRelativeApiPaths.forEach(function (supportedRelativeApiPath) {
        if (path.indexOf(supportedRelativeApiPath) >= 0){
            isRelativeApiPathSupported = true;
        }
    });

    if (isRelativeApiPathSupported) {
        return true;
    }

    return false;
  };

  return exports;
});
define('Helpers/Utils', function () {
  'use strict';

  var exports = {};

  function formatAsHex(n) {
    var hex = n.toString(16),
      padding = 4 - hex.length;

    for (var i = 0; i < padding; i += 1) {
      hex = '0' + hex;
    }

    return hex;
  }

  /**
  * Creates a new guid
  *
  * @retun {string}
  */
  exports.generateGuid = function () {
    var r = new Array(8);
    for (var i = 0; i < r.length; i += 2) {
      var val = Math.floor(Math.random() * 0x100000000);

      r[i] = formatAsHex(val & 0xFFFF);
      r[i + 1] = formatAsHex(val >>> 16);

      if ((i + 1) === 3) {
        // RFC4122 requires a 4 in this position
        r[i + 1] = '4' + r[i + 1].substring(1);
      }
    }

    return r[0] + r[1] + '-' + r[2] + '-' + r[3] + '-' + r[4] + '-' + r[5] + r[6] + r[7];
  };

  /**
  * Creates a new hash
  *
  * @param {string}
  * @retun {string}
  */
  exports.generateHash = function (string) {
    var hash = 0;

    if (string.length == 0) {
      return hash;
    }

    for (var i = 0; i < string.length; i += 1) {
      var char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  };

  exports.getCookieValueByKey = function (key) {
    var name = key + '=';
    var splittedCookies = document.cookie.split(';');
    for (var i = 0; i < splittedCookies.length; i++) {
      var c = splittedCookies[i].trim();
      if (c.indexOf(name) == 0) {
        return c.substring(name.length);
      }
    }
    return '';
  };

  return exports;

});
define('Helpers/String', ['window'], function (window) {
    'use strict';

    var exports = {};


    /**
     * Replaces placeholders in a string with the values passed
     *
     * @param {string} str
     * @param {object} placeholderValues
     *
     * @return {string}
     */
    exports.replacePlaceholders = function (str, placeholderValues) {
        var placeholderNames,
            placeholderName,
            placeholderValue,
            re,
            i;

        if (typeof str !== 'string') {
            return '';
        }

        if (typeof placeholderValues !== 'object' || placeholderValues === null) {
            return str;
        }

        placeholderNames = Object.keys(placeholderValues);

        for (i = 0; i < placeholderNames.length; i++) {
            placeholderName  = placeholderNames[i];
            placeholderValue = placeholderValues[placeholderName];
            re               = new RegExp('{' + placeholderName + '}', 'g');

            str = str.replace(re, placeholderValue);
        }

        return str;
    };

    /**
     * Decodes on base64 the input
     *
     * @param {string} str
     *
     * @return {string}
     */
    exports.base64urlDecode = function (str) {
        if (typeof str !== 'string') {
            return '';
        }

        return decodeURIComponent(window.atob(str));
    };

    /**
     * Escapes common HTML entities that might cause problem when rendered
     *
     * @param {string} str
     *
     * @return {string}
     */
    exports.escapeHtmlEntities = function (str) {
        if (typeof str !== 'string') {
            return '';
        }

        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    /**
     * Rturns true if the given string is undefined, null or empty
     * @param str
     * @returns {boolean}
     */
    exports.isUndefinedNullOrEmpty = function(str) {
        if(str === undefined ||
            str === null) {
            return true;
        }

        if (typeof str !== 'string') {
            throw 'str is not of type string';
        }

        return str.trim().length === 0;
    };

    /*
    * This function is build for browser compatibility in order to replace the Object.Values 
    * function which is not supported in IE.
    */
    exports.getObjectValuesArray = function(dictionary) {
      var valuesArray = Object.keys(dictionary).map(function(e) {
        return dictionary[e];
      });
      return valuesArray;
    };


    return exports;
});
define('Helpers/Ui', ['window', 'document'], function (window, document) {
    'use strict';

    var exports = {};

    /**
     * Returns if an element has the the specified class
     *
     * @param {object} elem
     * @param {string} className
     *
     * @return {boolean}
     */
    exports.hasClass = function (elem, className) {
        var re = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');

        if (elem.className.match(re)) {
            return true;
        }

        return false;
    };

    /**
     * Adds a class to the specified element
     *
     * @param {object} elem
     * @param {string} className
     *
     * @return {boolean}
     */
    exports.addClass = function (elem, className) {
        if (exports.hasClass(elem, className) === true) {
            return false;
        }

        elem.className += ' ' + className;

        return true;
    };

    /**
     * Removes a class from the specified element
     *
     * @param {object} elem
     * @param {string} className
     *
     * @return {boolean}
     */
    exports.removeClass = function (elem, className) {
        var re;

        if (exports.hasClass(elem, className) === false) {
            return false;
        }

        re = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');
        elem.className = elem.className.replace(re, '');

        return true;
    };

    /**
     * Binds an event to an element
     *
     * @param {object}   elem
     * @param {string}   eventName
     * @param {function} func
     *
     * @return {object}
     */
    exports.bind = (function () {

        function bindWithAddEventListener(elem, eventName, func, useCapture) {
            useCapture = useCapture ? true : false;
            elem.addEventListener(eventName, func, useCapture);
        }

        function bindWithAttachEvent(elem, eventName, func) {
            elem.attachEvent(eventName, func);
        }

        if (document.addEventListener) {
            return bindWithAddEventListener;
        }

        return bindWithAttachEvent;
    }());

    /**
     * Removes the binding of an event from an element
     *
     * @param {object}   elem
     * @param {string}   eventName
     * @param {function} func
     */
    exports.unbind = (function () {

        function unbindWithRemoveEventListener(elem, eventName, func) {
            elem.removeEventListener(eventName, func, false);
        }

        function unbindWithDetachEvent(elem, eventName, func) {
            elem.detachEvent(eventName, func);
        }

        if (document.removeEventListener) {
            return unbindWithRemoveEventListener;
        }

        return unbindWithDetachEvent;
    }());

    return exports;
});
define('Helpers/Page', ['document'], function (document) {
  'use strict';

  var exports = {};

  // Assign polyfill from:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
  function assign(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };

  exports.init = function (pageModule) {
    //polyfill for Object.assign
    if (typeof Object.assign != 'function') {
      Object.defineProperty(Object, "assign", {
        value: assign,
        writable: true,
        configurable: true
      });
    }
    var paramsString = (document.body && document.body.getAttribute('data-params')) || null,
      paramsArray;

    if (paramsString === null) {
      pageModule.run();
      return;
    }

    paramsArray = paramsString.split(';;');

    pageModule.run.apply(null, paramsArray);
  };

  return exports;
});
define('Helpers/Environment', ['window', 'Helpers/Url'], function (window, UrlHelper) {
    'use strict';

    var userAgent = window.navigator.userAgent,
        screenWidth = window.screen.availWidth,
        screenHeight = window.screen.availHeight,
        exports = {};

    exports.userAgent = userAgent;
    exports.screenResolution = screenWidth + "x" + screenHeight;

    /**
     * Returns true if a feature flag is enabled via ECS or by QSP.
     *
     * @return {string}
     */
    exports.isFeatureEnabled = function (featureFlagName, defaultVal) {
        if (defaultVal === undefined) {
          defaultVal = false;
        }

        var query = UrlHelper.getQueryParams();
        if (typeof query == "object" && query.hasOwnProperty(featureFlagName)) {
            return query[featureFlagName] == 'true';
        } else if (typeof GLOBAL_FLAGS == "object" && GLOBAL_FLAGS.hasOwnProperty(featureFlagName)) {
              return GLOBAL_FLAGS[featureFlagName] == true;
        } else {
          return defaultVal;
        }
    };

    /**
     * Returns the Operating System the code is executed in
     *
     * @return {string}
     */
    exports.getOS = function (userAgent) {
        var osRegExps = {
            'Windows Phone': /windows\sphone/i,
            'Windows RT': / arm;/i,
            'Windows': /(windows|win32)/i,
            'iOS': /(iPad|iPhone|iPod)/i,
            'Mac OS X': /(macintosh|mac os x)/i,
            'Android': /android/i,
            'ChromeOS': / CrOS /i,
            'Linux': /(linux|x11)/i
        },
            osNames = Object.keys(osRegExps),
            osName,
            i;

        for (i = 0; i < osNames.length; i++) {
            osName = osNames[i];

            if (userAgent.match(osRegExps[osName])) {
                return osName;
            }
        }

        return 'Unknown';
    };

    /**
     * Wrapper for returning the Operating System
     *
     * @return {string}
     */
    exports.OS = (function () {
        return exports.getOS(userAgent);
    }());

    /**
     * Returns the windows version
     *
     * @return {string}
     */
    function getWindowsVersion(userAgent) {
        var winVersionMatches = userAgent.match(new RegExp('Windows NT ' + '([\\d.]+)')),
            versionNames = {
                '5.1': 'XP',
                '5.2': 'Server 2003',
                '6.0': 'Vista',
                '6.1': '7',
                '6.2': '8',
                '6.3': '8.1',
                '10.0': '10'
            };

        if (winVersionMatches) {
            return versionNames[winVersionMatches[1]];
        }

        return 'Unknown';
    }

    /**
     * Returns the Windows Phone version
     *
     * @return {string}
     */
    function getWindowsPhoneVersion(userAgent) {
        var windowsPhoneVersionInUserAgentMatches = userAgent.match(
            new RegExp('Windows Phone(?: OS)*' + ' ([\\d.]+)')
        );

        if (windowsPhoneVersionInUserAgentMatches) {
            return windowsPhoneVersionInUserAgentMatches[1];
        }

        return 'Unknown';
    }

    /**
     * Returns the Mac OS X version
     *
     * @return {string}
     */
    function getMacOsxVersion(userAgent) {
        var macOsxVersionInUserAgentMatches = userAgent.match(
            new RegExp('Mac OS X' + ' ([\\d_.]+)')
        );

        if (macOsxVersionInUserAgentMatches) {
            return macOsxVersionInUserAgentMatches[1].replace(/_/g, '.');
        }

        return 'Unknown';
    }

    /**
     * Returns the Android version
     *
     * @return {string}
     */
    function getAndroidVersion(userAgent) {
        var androidVersionMatches = userAgent.match(
            new RegExp('Android' + ' ([\\d.]+)')
        );

        if (androidVersionMatches) {
            return androidVersionMatches[1];
        }

        return 'Unknown';
    }

    /**
     * Returns the iOS version
     *
     * @return {string}
     */
    function getIOSVersion(userAgent) {

        var iOSVersionMatches = userAgent.match(
            new RegExp('(iPhone OS|CPU OS)' + ' ([\\d_]+)')
        ),
            device;

        if (iOSVersionMatches) {
            device = iOSVersionMatches[1] === 'iPhone OS' ? 'iPhone' : 'iPad';
            return device + ' ' + iOSVersionMatches[2].replace(/_/g, '.');
        }

        return 'Unknown';
    }

    /**
     * Returns the Operating System version the code is executed in
     *
     * @return {string}
     */
    exports.getOSVersion = function (userAgent) {
        var OS = exports.getOS(userAgent);

        if (OS === 'Windows' || OS === 'Windows RT') {
            return getWindowsVersion(userAgent);
        }

        if (OS === 'Windows Phone') {
            return getWindowsPhoneVersion(userAgent);
        }

        if (OS === 'Mac OS X') {
            return getMacOsxVersion(userAgent);
        }

        if (OS === 'Android') {
            return getAndroidVersion(userAgent);
        }

        if (OS === 'iOS') {
            return getIOSVersion(userAgent);
        }

        return 'Unknown';
    };

    /**
     * Returns the Operating System version the code is executed in
     *
     * @return {string}
     */
    exports.OSVersion = (function () {
        return exports.getOSVersion(userAgent);
    }());

    /**
     * Returns if the Operating System is in S mode. Works only in Edge browser
     *
     * @return {boolean}
     */
    exports.getIsWin10SMode = function () {
        try {
            if (!window || !window.external || !window.external.getHostEnvironmentValue) {
                return false;
            }

            var osModeKey = 'os-mode';
            var osMode = JSON.parse(window.external.getHostEnvironmentValue(osModeKey))[osModeKey];
            /**
             * 0 -> unlocked
             * 1 -> win10 trial device with S mode
             * 2 -> win10 S mode
             */
            return osMode == 1 || osMode == 2;
        }
        catch (err) {
            console.error('Encountered exception in detecting Win10 S mode. Error: ' + err);
            return false;
        }
    }

    /**
     * Returns if the desktop download section should be hidden
     *
     * @return {boolean}
     */
    exports.hideDesktopDownload = (function () {
        // TODO: Include ARM scenarios in the future
        return !exports.isFeatureEnabled('enabledesktopdownloadwin10s', false) && exports.getIsWin10SMode();
    }());

    /**
     * Returns the device type (Desktop|Tablet|Mobile)
     *
     * @return {string}
     */
    exports.getDeviceType = function (userAgent) {
        var mobile = /(android|ipod|windows phone|wpdesktop|windows ce|blackberry\w*|meego|webos|palm|symbian|pda|\w*?mobile\w*?|\w*?phone\w*?)/i,
            tablet = /tablet|ipad/i,
            touchIE = /^(?=.*\bTrident\b)(?=.*\bTablet PC\b).*$/i;

        if (userAgent.match(tablet) && !userAgent.match(touchIE)) {
            return 'Tablet';
        }

        if (userAgent.match(mobile)) {
            return 'Mobile';
        }

        return 'Desktop';
    };

    /**
     * Returns the device type (Desktop|Tablet|Mobile)
     *
     * @return {string}
     */
    exports.deviceType = (function () {
        return exports.getDeviceType(userAgent);
    }());

    /**
     * Returns the browser name
     *
     * @return {string}
     */
    exports.getBrowserName = function (userAgent) {
        var browserStrings = {
            Opera: '(OPR|Opera)',
            Edge: 'Edge',
            MSIE: 'Trident',
            Chrome: 'Chrome',
            Firefox: 'Firefox',
            Safari: 'Safari'
        },
            browserNames = Object.keys(browserStrings),
            browserName,
            i;

        for (i = 0; i < browserNames.length; i++) {
            browserName = browserNames[i];

            if (userAgent.match(new RegExp(browserStrings[browserName]))) {
                return browserName;
            }
        }

        return 'Unknown';
    };

    /**
     * Returns the browser name
     *
     * @return {string}
     */
    exports.browserName = (function () {
        return exports.getBrowserName(userAgent);
    }());

    function getIeBrowserVersion(userAgent) {
        var classicIeVersionMatches = userAgent.match(new RegExp('MSIE ([\\d.]+)')),
            ieVersionMatches;

        if (classicIeVersionMatches) {
            return classicIeVersionMatches[1];
        }

        ieVersionMatches = userAgent.match(new RegExp('rv:([\\d.]+)'));
        if (ieVersionMatches) {
            return ieVersionMatches[1];
        }

        return '';
    }

    function getNonIeBrowserVersion(userAgent, browserString) {
        var matches;

        if (browserString === 'Safari') {
            browserString = 'Version';
        }

        if (browserString === 'Opera') {
            browserString = '(?:Version|OPR)';
        }

        matches = userAgent.match(new RegExp(browserString + '/([\\d.]+)'));

        if (matches) {
            return matches[1];
        }

        return '';
    }

    /**
     * Returns the version of the browser
     *
     * @return {string}
     */
    exports.getBrowserVersion = function (userAgent) {
        var browserName = exports.getBrowserName(userAgent);

        if (browserName === 'MSIE') {
            return getIeBrowserVersion(userAgent);
        }

        return getNonIeBrowserVersion(userAgent, browserName);
    };

    /**
     * Returns the version of the browser
     *
     * @return {string}
     */
    exports.browserVersion = (function () {
        return exports.getBrowserVersion(userAgent);
    }());

    return exports;
});
define('Telemetry', ['Config', 'Config/Telemetry', 'PerfScenario'], function (Config, TelemetryConfig, PerfScenario) {
  'use strict';

  var exports = {},
    defaultLogger,
    logManager;

  exports.events = TelemetryConfig.events;

  exports.init = function init(deeplinkIds, suppressPrompt) {
    var configuration = new microsoft.applications.telemetry.LogConfiguration();

    logManager = microsoft.applications.telemetry.LogManager;

    configuration.enableAutoUserSession = true;

    logManager.initialize(Config.telemetry.token, configuration);

    logManager.setContext('userAgent', TelemetryConfig.userAgent);
    logManager.setContext('suppressPrompt', !!suppressPrompt);
    logManager.setContext('environment', Config.env); /* TODO. update key to "AppInfo.Environment" after aria lib >= 2.6 */
    logManager.setContext('screenResolution', TelemetryConfig.screenResolution); /* TODO. update key to "DeviceInfo.ScreenResolution" after aria lib >= 2.6 */
    if (deeplinkIds.server) {
      logManager.setContext('serverDeeplinkId', deeplinkIds.server);
    }

    this.setDeepLinkId(deeplinkIds.client);

    defaultLogger = new microsoft.applications.telemetry.Logger();
  };

  exports.extendContext = function extend(isWeb, deeplinkType, domainHint, launchSource, context) {
    if (isWeb) {
      logManager.setContext('source', 'webClient');
    }
    if (deeplinkType) {
      logManager.setContext('deeplinkType', deeplinkType);
    }
    if (domainHint) {
      logManager.setContext('domainHint', domainHint);
    }
    if (launchSource) {
      logManager.setContext('launchSource', launchSource);
    }
    if (context) {
      logManager.setContext('context', context);
    }
  };

  exports.setDeepLinkId = function (deeplinkId) {
    if (deeplinkId) {
      logManager.setContext('deeplinkId', deeplinkId);
    }
  };

  exports.sendTelemetry = function (eventName, telemetryOptions) {
    var eventProperties = new microsoft.applications.telemetry.EventProperties();
    eventProperties.name = TelemetryConfig.eventCategory;
    eventProperties.eventType = TelemetryConfig.eventType;
    eventProperties.setProperty("actionName", eventName);
    if (telemetryOptions) {
      for (var option in telemetryOptions) {
        if (telemetryOptions.hasOwnProperty(option)) {
          eventProperties.setProperty(option, telemetryOptions[option]);
        }
      }
    }
    defaultLogger.logEvent(eventProperties);
  };

  exports.sendLinkTelemetry = function (url, eventName, telemetryOptions) {
    var perfScenario = PerfScenario.getPerfScenario(defaultLogger, eventName, telemetryOptions);
    perfScenario.start();
    if (url) {
      var xmlhttp = new XMLHttpRequest();
      // If we wait for async callback, popup blocker will block because browsers only allow new tabs directly on click.
      xmlhttp.onreadystatechange = downloadCallBackWithRetry(xmlhttp, url, eventName, perfScenario, telemetryOptions);
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    } else {
      telemetryOptions.success = false;
      exports.sendTelemetry(eventName, telemetryOptions);
      perfScenario.fail({'errorInfo': 'no url'});
    }
  }

  function downloadCallBackWithRetry(xmlhttp, url, eventName, perfScenario, telemetryOptions) {
    var retries = 0;
    var clientDownloadEvents = TelemetryConfig.events.downloadPage.downloadClientEvents
    return function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        var scenarioProperties = {
          statusCode: xmlhttp.status,
          retry_count: retries
        };
        telemetryOptions.status = xmlhttp.status;
        if (xmlhttp.status !== 408 && xmlhttp.status >= 400) {
          retries++;
          if (retries <= TelemetryConfig.retries && clientDownloadEvents.indexOf(eventName) > -1) {
            perfScenario.mark('retry', Object.assign({'status': 'failure'}, scenarioProperties));
            setTimeout(function() {
              xmlhttp.open("GET", url, true);
              xmlhttp.send();
            }, TelemetryConfig.retryInterval);
          } else {
            telemetryOptions.success = false;
            exports.sendTelemetry(eventName, telemetryOptions);
            perfScenario.fail(scenarioProperties);
          }
        } else {
          telemetryOptions.success = true;
          exports.sendTelemetry(eventName, telemetryOptions);
          perfScenario.stop(scenarioProperties);
        }
      }
    }
  }

  exports.getPerfScenario = function (scenarioName, scenarioProperties) {
    return PerfScenario.getPerfScenario(defaultLogger, scenarioName, scenarioProperties);
  }

  exports.flush = function() {
    logManager.flush();
  }

  return exports;
});
define('Config/Telemetry', ['Config', 'Helpers'], function (Config, Helpers) {
  'use strict';

  var config = {};

  config.userAgent = Helpers.Environment.userAgent;
  config.screenResolution = Helpers.Environment.screenResolution;

  config.eventCategory = 'tracking';
  config.eventType = 'launcher';
  config.retries = 3;
  config.retryInterval = 1000; //ms
  config.defaultPerfTimeout = 3 * 60 * 1000;

  config.events = {

    onLoadingLauncher: {
      eventName: 'launcher_page_is_loading'
    },
    onLoadedLauncher: {
      eventName: 'launcher_page_loaded'
    },
    onLoadUnsupported: {
      eventName: 'unsupported_page_loaded'
    },
    onLoadError500: {
      eventName: 'error_500_page_loaded'
    },
    tryAgainLinkClick: {
      eventName: 'launcher_try_again_click'
    },
    downloadBtnClick: {
      eventName: 'launcher_download_click',
      actions: {
        getInstaller: 'getInstaller',
        redirectToDowloadsPage: 'redirectToDownloadsPage'
      }
    },
    appleStoreBtnClick: {
      eventName: 'apple_app_store_btn_click'
    },
    googleStoreBtnClick: {
      eventName: 'google_play_store_btn_click'
    },
    legacyMobileDownloadBtnClick: {
      eventName: 'legacy_mobile_download_click'
    },
    imageLoadFailed: {
      eventName: 'image_load_failed'
    },
    openTeamsBtnClick: {
      eventName: 'launcher_open_teams_click'
    },
    onParsingComplete: {
      eventName: 'launcher_url_params_parsed'
    },
    onParsingFailed: {
      eventName: 'launcher_url_params_parsing_failed'
    },
    onInitialParsingFailed: {
      eventName: 'launcher_url_params_initial_parsing_failed'
    },
    aboutCloseVideo: {
      eventName: 'about_close_video'
    },
    aboutPlayVideo: {
      eventName: 'about_play_video'
    },
    aboutCheckDomainExists: {
      eventName: 'about_check_domain_exists'
    },
    errorTemplatePage: {
      eventName: 'error_template_page_loaded'
    },
    errorPageSignOutClick: {
      eventName: 'error_page_sign_out'
    },
    errorPageTryAgainClick: {
      eventName: 'error_page_try_again'
    },
    aboutPage: {
      aboutCloseVideo: {
        eventName: 'about_page_close_video'
      },
      aboutPlayVideo: {
        eventName: 'about_page_play_video'
      },
      checkDomainbutton: {
        eventName: 'about_page_check_domain_button'
      },
      aboutCheckDomainExists: {
        eventName: 'about_page_check_domain_exists'
      },
      getFreeBtn: {
        eventName: 'about_page_get_free_click'
      },
      buyBtn: {
        eventName: 'about_page_buy_btn_click'
      },
      trialBtn: {
        eventName: 'about_page_try_btn_click'
      },
      signUpClick: {
        eventName: 'about_page_sign_up_click'
      },
      legalLink: {
        eventName: 'about_page_legacy_link_click'
      },
      privacyLink: {
        eventName: 'about_page_privacy_link_click'
      },
      eduAdminLink: {
        eventName: 'about_page_edu_admin_link_click'
      },
      eduStudentTeacherLink: {
        eventName: 'about_page_edu_student_teacher_link_click'
      },
      startNavigation: {
        eventName: 'about_page_start_navigation_click'
      },
      downloadsNavigation: {
        eventName: 'about_page_downloads_navigation_click'
      },
      errors: {
        eventName: 'about_page_errors'
      },
      onload: {
        eventName: 'about_page_onload'
      },
      onloadEdu: {
        eventName: 'about_page_edu_onload'
      }
    },
    downloadPage: {
      downloadClientEvents: ['download_page_download_win32_click', 'download_page_download_win64_click', 'download_page_download_win_arm64_click', 'download_page_download_osx_click', 'download_page_download_detected_client_click'],
      downloadWin32Click: {
        eventName: 'download_page_download_win32_click'
      },
      downloadWin64Click: {
        eventName: 'download_page_download_win64_click'
      },
      downloadWinArm64Click: {
        eventName: 'download_page_download_win_arm64_click'
      },
      downloadOSXClick: {
        eventName: 'download_page_download_osx_click'
      },
      downloadDebClick: {
        eventName: 'download_page_download_deb_click'
      },
      downloadRpmClick: {
        eventName: 'download_page_download_rpm_click'
      },
      hideDesktopDownload: {
        eventName: 'download_page_hide_desktop_download'
      },
      gotoWebApp: {
        eventName: 'download_page_goto_webapp'
      },
      downloadDetectedClientClick: {
        eventName: 'download_page_download_detected_client_click'
      },
      downloadDetectedDebClick: {
        eventName: 'download_page_download_detected_deb_click'
      },
      downloadDetectedRpmClick: {
        eventName: 'download_page_download_detected_rpm_click'
      },
      updateDetectedClientClick: {
        eventName: 'download_page_update_detected_client_click'
      },
      downloadIOSClick: {
        eventName: 'download_page_download_ios_click'
      },
      downloadAndroidClick: {
        eventName: 'download_page_download_android_click'
      },
      getFreeBtn: {
        eventName: 'download_page_get_free_click'
      },
      buyBtn: {
        eventName: 'download_page_buy_btn_click'
      },
      trialBtn: {
        eventName: 'download_page_try_btn_click'
      },
      signUpClick: {
        eventName: 'download_page_sign_up_click'
      },
      webClientClick: {
        eventName: 'download_page_web_client_click'
      },
      errors: {
        eventName: 'download_page_errors'
      },
      appleButtonClick: {
        eventName: 'download_page_apple_button_click'
      },
      androidButtonClick: {
        eventName: 'download_page_android_button_click'
      },
      legalLink: {
        eventName: 'download_page_legacy_link_click'
      },
      privacyLink: {
        eventName: 'download_page_privacy_link_click'
      },
      startNavigation: {
        eventName: 'download_page_start_navigation_click'
      },
      downloadsNavigation: {
        eventName: 'download_page_downloads_navigation_click'
      },
      onload: {
        eventName: 'download_page_onload'
      },
      onloadEdu: {
        eventName: 'download_page_edu_onload'
      },
      displayDesktopSupported: {
        eventName: 'download_page_desktop_supported'
      },
      displayDesktopUnsupported: {
        eventName: 'download_page_desktop_unsupported'
      },
      displayMobileiOS: {
        eventName: 'download_page_mobile_ios'
      },
      displayMobileAndroid: {
        eventName: 'download_page_mobile_android'
      },
      displayMobileUnsupported: {
        eventName: 'download_page_mobile_unsupported'
      }
    },
    joinPage: {
      JoinTenantRequestSubmitted:
      {
        eventName: 'join_tenant_request_submitted'
      },
      JoinTenantRedirectToRedeemUrlFailed:
      {
        eventName: 'join_tenant_redirect_to_redeemurl_failed'
      }
    },
    shareToOutlookPage: {
      shareToOutlookEmailCreated: 'share_to_outlook_draft_email_created',
      shareToOutlookEmailFailed: 'share_to_outlook_draft_email_failed',
      shareToOutlookTokenFailed: 'share_to_outlook_token_failed',
      shareToOutlookNotifySuccess: 'share_to_outlook_notify_success'
    },
    protocolLaunch: {
      eventName: 'protocolLaunch',
      result: {
        success: 'success',
        noHandler: 'noHandler',
        unhandled: 'unhandled',
        userCancelled: 'userCancelled',
        notLaunched: 'notLaunched'
      }
    },
    autoRedirectToWebJoin: {
      unSupportedOS: 'unSupportedOS',
      urlParameter: 'urlParameter'
    },
    updateRequiredPage: {
      scenarioName: 'update_required_page',
      onDownloadClick: 'update_required_download_click',
      onWebClientLinkClick: 'update_required_web_client_click'
    }
  };

  return config;
});
define('PerfScenario', ['Helpers/Utils', 'Config/Telemetry'], function (Utils, Config) {
  'use strict';

  var exports = {},
    scenarioMap = {};

  exports.getPerfScenario = function (logger, scenarioName, scenarioProperties) {
    if (scenarioMap.hasOwnProperty(scenarioName)) {
      return scenarioMap[scenarioName];
    }
    var scenario = createPerfScenario(logger, scenarioName, scenarioProperties);
    scenarioMap[scenarioName] = scenario;
    return scenario;
  };

  function createPerfScenario(logger, scenarioName, scenarioProperties) {
    return {
      logger: logger,
      scenarioProperties: scenarioProperties,
      scenarioName: scenarioName,
      scenarioId: Utils.generateGuid(),
      active: false,
      start: start,
      fail: fail,
      stop: stop,
      mark: mark
    };
  }

  function start(properties, timeout) {
    if (this.active) {
      return;
    }
    if (!timeout) {
      timeout = Config.defaultPerfTimeout;
    }
    var _properties = Object.assign(properties || {}, { 'status': 'success' });
    this.mark('start', _properties);
    this.startTime = Date.now();
    this.active = true;
    this.timeoutTimer = setTimeout(function () {
      if (this.active) {
        this.active = false;
        this.mark('stop', { 'status': 'timeout' });
      }
    }.bind(this), timeout);
  }

  function fail(properties) {
    if (!this.active) {
      return;
    }
    var _properties = Object.assign(properties || {}, { 'status': 'failure' });
    this.mark('stop', _properties);
    this.active = false;
    clearTimeout(this.timeoutTimer);
  }

  function stop(properties) {
    if (!this.active) {
      return;
    }
    var _properties = Object.assign(properties || {}, { 'status': 'success' });
    this.mark('stop', _properties);
    this.active = false;
    clearTimeout(this.timeoutTimer);
  }

  function mark(step, properties) {
    if (!properties) {
      properties = {};
    }
    var eventProperties = new microsoft.applications.telemetry.EventProperties();
    eventProperties.name = 'scenario';
    eventProperties.eventType = this.scenarioName;
    var _properties = Object.assign({
      'Scenario.Name': this.scenarioName,
      'scenario': this.scenarioId,
      'step': step,
      'Scenario.Step': step,
      'status': properties.status || 'success',
      'Scenario.Status':  properties.status || 'success'
    }, properties, this.scenarioProperties);
    if (this.startTime) {
      var delta = Date.now() - this.startTime;
      _properties['delta'] = delta;
      _properties['scenarioDelta'] = delta;
    }
    Object.keys(_properties).forEach(function (key) {
      eventProperties.setProperty(key, _properties[key]);
    });
    this.logger.logEvent(eventProperties);
  }

  return exports;
});
var teamspace;
(function (teamspace) {
    var services;
    (function (services) {
        var authentication;
        (function (authentication) {
            var SignOut = /** @class */ (function () {
                function SignOut(window, rootUri, storageService) {
                    this.window = window;
                    this.rootUri = rootUri;
                    this.storageService = storageService;
                }
                SignOut.prototype.handleWindow = function () {
                    this.clearIndexedDb();
                    this.clearLocalStorage();
                    this.clearSessionStorage();
                    this.clearCookies();
                    this.sendSuccessTelemetry();
                    this.unregisterServiceWorker();
                    this.window['signoutHandled'] = true;
                    console.log("Signout successful!");
                };
                SignOut.prototype.clearIndexedDb = function (userOidToExclude) {
                    try {
                        var dbList = this.storageService.get("indexDbs", false);
                        var indexDbs = // Array of IndexDbInfo
                         void 0; // Array of IndexDbInfo
                        // TODO (anngu): remove this when the change to indexDbs key propagates through the rings
                        var backCompatDbList = void 0;
                        var backCompatIndexDbs = // Array of strings for back compatability
                         void 0; // Array of strings for back compatability
                        if (!dbList) {
                            // TODO (anngu): remove this when the change to indexDbs key propagates through the rings
                            // Backwards compat for the old version that uses a string
                            backCompatDbList = this.storageService.get("openDbs", false);
                            if (backCompatDbList) {
                                if (typeof backCompatDbList === 'string') {
                                    // Backwards compat for previous version of angular-local-storage v:0.6.0 -> v:0.1.5 went from strings to objects
                                    backCompatIndexDbs = JSON.parse(backCompatDbList);
                                }
                                else if (typeof backCompatDbList === 'object') {
                                    backCompatIndexDbs = backCompatDbList;
                                }
                            }
                        }
                        else {
                            // The new version uses IndexDbInfo
                            if (dbList) {
                                if (typeof dbList === 'string') {
                                    // Backwards compat for previous version of angular-local-storage v:0.6.0 -> v:0.1.5 went from strings to objects
                                    indexDbs = JSON.parse(dbList);
                                }
                                else if (typeof dbList === 'object') {
                                    indexDbs = dbList;
                                }
                            }
                        }
                        if (indexDbs && indexDbs.length > 0) {
                            for (var i = 0; i < indexDbs.length; i++) {
                                var dbInfo = indexDbs[i];
                                var dbIdHasOid = false;
                                if (typeof dbInfo.name === 'string' &&
                                    typeof userOidToExclude === 'string' &&
                                    dbInfo.name.length > 0 &&
                                    userOidToExclude.length > 0) {
                                    // This will remove the portion of the string before the Oid
                                    dbIdHasOid = dbInfo.name.substr(dbInfo.name.length - userOidToExclude.length, userOidToExclude.length) === userOidToExclude;
                                }
                                if (!dbIdHasOid) {
                                    var dbDeleteRequest = this.window.indexedDB.deleteDatabase(dbInfo.name);
                                    dbDeleteRequest.onerror = function (event) {
                                        window.console.log("Error deleting database.");
                                    };
                                    dbDeleteRequest.onsuccess = function (event) {
                                        window.console.log("Database deleted successfully.");
                                    };
                                }
                                else {
                                    window.console.log("Excluded deletion of database for user oid:" + userOidToExclude);
                                }
                            }
                        }
                        else if (backCompatIndexDbs && backCompatIndexDbs.length > 0) {
                            // TODO (anngu): remove this when the change to indexDbs key propagates through the rings
                            // For backwards compatibility
                            for (var i = 0; i < backCompatIndexDbs.length; i++) {
                                var dbInfo = backCompatIndexDbs[i];
                                var dbIdHasOid = false;
                                if (typeof dbInfo === 'string' &&
                                    typeof userOidToExclude === 'string' &&
                                    dbInfo.length > 0 &&
                                    userOidToExclude.length > 0) {
                                    // This will remove the portion of the string before the Oid
                                    dbIdHasOid = dbInfo.substr(dbInfo.length - userOidToExclude.length, userOidToExclude.length) === userOidToExclude;
                                }
                                if (!dbIdHasOid) {
                                    var dbDeleteRequest = this.window.indexedDB.deleteDatabase(dbInfo);
                                    dbDeleteRequest.onerror = function (event) {
                                        window.console.log("Error deleting database.");
                                    };
                                    dbDeleteRequest.onsuccess = function (event) {
                                        window.console.log("Database deleted successfully.");
                                    };
                                }
                                else {
                                    window.console.log("Excluded deletion of database for user oid:" + userOidToExclude);
                                }
                            }
                        }
                        else {
                            window.console.log("Cannot find any databases in local storage");
                        }
                    }
                    catch (e) {
                        this.sendErrorTelemetry("db", e);
                    }
                };
                SignOut.prototype.clearLocalStorage = function () {
                    try {
                        this.storageService.clear();
                    }
                    catch (e) {
                        this.sendErrorTelemetry("local", e);
                    }
                };
                SignOut.prototype.clearSessionStorage = function () {
                    try {
                        this.window.sessionStorage.clear();
                    }
                    catch (e) {
                        this.sendErrorTelemetry("session", e);
                    }
                };
                SignOut.prototype.clearCookies = function () {
                    try {
                        var decodedCookies = decodeURIComponent(this.window.document.cookie);
                        var cookies = decodedCookies.split(';');
                        var _loop_1 = function (i) {
                            var cookie = cookies[i];
                            var cookieName = cookie.split('=')[0].trim();
                            if (!SignOut.exceptedCookies.some(function (value) { return value === cookieName; })) {
                                this_1.removeCookie(cookieName);
                            }
                        };
                        var this_1 = this;
                        for (var i = 0; i < cookies.length; i++) {
                            _loop_1(i);
                        }
                    }
                    catch (e) {
                        this.sendErrorTelemetry("cookies", e);
                    }
                };
                SignOut.prototype.removeCookie = function (name) {
                    this.window.document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                };
                SignOut.prototype.sendErrorTelemetry = function (area, exception) {
                    var errorMessage = (exception && exception.message) ? exception.message : "";
                    console.error("Signout error: " + errorMessage);
                    var url = this.rootUri + "auth/signouterror?area=" + area + "&message=" + errorMessage;
                    var httpRequest = new XMLHttpRequest();
                    httpRequest.open("GET", url, true);
                    httpRequest.send(null);
                };
                SignOut.prototype.sendSuccessTelemetry = function () {
                    var url = this.rootUri + "auth/signoutsuccess";
                    var httpRequest = new XMLHttpRequest();
                    httpRequest.open("GET", url, true);
                    httpRequest.send(null);
                };
                SignOut.prototype.unregisterServiceWorker = function () {
                    var _this = this;
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistration('/serviceworker.js').then(function (reg) {
                            if (reg) {
                                reg.unregister().then(function (_fulfilled) {
                                    window.console.log("Service Worker unregistered successfully");
                                });
                            }
                        })
                            .catch(function (error) {
                            _this.sendErrorTelemetry("Service Worker unregister failure during signout", error);
                        });
                    }
                };
                SignOut.exceptedCookies = ['DesiredAuth', 'DesiredAuthOptions'];
                return SignOut;
            }());
            authentication.SignOut = SignOut;
        })(authentication = services.authentication || (services.authentication = {}));
    })(services = teamspace.services || (teamspace.services = {}));
})(teamspace || (teamspace = {}));
define('Pages/ErrorTemplatePage', ['Telemetry', 'Helpers', 'window', 'document'], function (Telemetry, Helpers, window, document) {
  window.onload = function () {
    var eventData = {};

    /**
     * Parse the value of param from target url
     * @param {string} param : parameter name, like 'session', 'displayMessage'
     */
    function parseValueFromUrl(param) {
      const url = window.location.href;
      if (url && param && url.indexOf(param) !== -1) {
        const valueRegex = new RegExp(param + '=([^&]+)');
        const result = valueRegex.exec(url);
        const value = result ? result[1] : '';
        return value;
      }
      return '';
    }

    eventData["errorCode"] = window.location.pathname;
    eventData["errorMessage"] = parseValueFromUrl("errorMessage");
    eventData["errorDescription"] = parseValueFromUrl("errorDetails");
    eventData["experience"] = parseValueFromUrl("experience");

    const clientVersion = parseValueFromUrl("clientVersion");
    if (clientVersion)  {
      eventData["clientVersion"] = clientVersion;
    }

    /**
     * Handle third-party cookies bloked before accessing localStorage due to: Uncaught SecurityError
     */
    let token = null;
    let log = null;
    let additionalSettings = null;
    try {
      token = window.localStorage.getItem('adal.idtoken');
      log = window.localStorage.getItem('ts.previousSessionLogs');
      additionalSettings = window.localStorage.getItem('ts.TS_ADDITIONAL_SETTINGS');
    } catch (error) {
      console.error('Uncaught SecurityError, "Block third-party cookies and site data" checkbox is set in Content Settings', error);
    }

    var userProfile = undefined;
    if (token) {
      try {
        var base64 = token.split('.')[1];
        userProfile = JSON.parse(window.atob(base64));
        eventData["UserInfo.Id"] = userProfile.oid;
        eventData["UserInfo.TenantId"] = userProfile.tid;
      } catch (error) {
        console.error('Cannot parse user profile to json.', error);
      }
    }

    try {
      if (additionalSettings) {
        const settingsObj = JSON.parse(additionalSettings);
        if (settingsObj && settingsObj.platformId) {
          eventData["platformId"] = settingsObj.platformId;
        }
      }
    } catch (error) {
      console.error('Cannot parse platformId.', error);
    }

    Telemetry.init(true);
    Telemetry.sendTelemetry(Telemetry.events.errorTemplatePage.eventName, eventData);

    function performSignOut() {
      let storageService = {};
      storageService.get = function(key) {
        return window.localStorage.getItem("ts." + key);
      }
      storageService.clear = function() {
        window.localStorage.clear();
      }

      let signOut = new teamspace.services.authentication.SignOut(window, window.rootUrl, storageService);
      signOut.handleWindow();
    }

    /**
     * Generate a UUID
     * Has to generate a 128 bit number
     */
    function generateUUID(){
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
      });
      return uuid;
    }

    var url = window.location.href;
    var sessionId = parseValueFromUrl('session');
    sessionId = sessionId.replace(/[^\w\d-]/g, ''); // Scrub sessionID, if not(^) a word(\w), digit(\d), or hyphen(-), for each case(/g) do this removal.
    var sessionElem = document.getElementById('session-id');
    var lineTwoElem = document.getElementById('oops-line-two');
    var buttonElem = document.getElementsByClassName('oops-button')[0];
    var signoutLink = document.getElementById('oops-signout-link');
    var signoutElem = document.getElementById('oops-signout-text'); //default signout text
    var tryAgainLink = document.getElementById('try-again-link');

    if (sessionId && sessionElem) {
      sessionElem.innerHTML = sessionId;
    }

    if (log) {
      var element = document.getElementById('log-download');

      // edge and IE
      if (window.navigator.msSaveOrOpenBlob) {
        Helpers.Ui.bind(element, 'click', function (evt) {
          evt.preventDefault();
          if (window.navigator.msSaveOrOpenBlob) {
            var file = new Blob([log], { encoding: 'UTF-8', type: 'text/plain' });
            window.navigator.msSaveOrOpenBlob(file, 'MSTeams Diagnostics Log ' + new Date().toLocaleString().replace(/\/| |:|,/g, '_') + '.txt');
          }
        });
      } else { // all other browsers
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(log));
        element.setAttribute('download', 'MSTeams Diagnostics Log ' + new Date().toLocaleString().replace(/\/| |:|,/g, '_'));
      }
    }

    if (window.electronSafeIpc) {
      window.electronSafeIpc.send('appOops');
    }

    if (url.indexOf('anonymous_meeting_failure') !== -1) {
      buttonElem.classList.add('oops-hidden');
      lineTwoElem.classList.remove('oops-hidden');
    }

    if (url.indexOf('itp_block') !== -1) {
      lineTwoElem.classList.remove('oops-hidden');
      // remove hide attribute for line_three element
      var lineThreeElem = document.getElementById('oops-line-three');
      lineThreeElem.classList.remove('oops-hidden');
      // replace learn more link
      var learnMoreLinkElem = document.getElementsByClassName("oops-itp-block-learn-more")[0];
      learnMoreLinkElem.setAttribute("href", "https://go.microsoft.com/fwlink/?linkid=2062082");
      learnMoreLinkElem.classList.remove('oops-hidden');
      // replace button link
      tryAgainLink.href = "https://teams.microsoft.com/downloads";
    }

    if (url.indexOf('msaLogin') !== -1) {
      // hide the Try Again button
      // Have only a signout link.
      // change the oops text
      buttonElem.classList.add('oops-hidden');

      signoutLink = document.getElementById('alternative-oops-signout-link');
      signoutElem = document.getElementById('alternative-oops-signout-text');

      var oopsErrorMessageElem = document.getElementById('oops-line-one');
      var oopsAlternativeElem = document.getElementById('alternative-oops-signout-text');
      var oopsAlternativeAfterElem = document.getElementById('alternative-oops-signout-after-text');

      oopsErrorMessageElem.innerHTML = "Microsoft Account login is not supported";
      oopsAlternativeElem.classList.remove('oops-hidden');
      oopsAlternativeAfterElem.classList.add('oops-hidden');
    }

    if (url.indexOf('indexedDB_locked') !== -1 ) {
      // remove the traditional oops page dialog and only leave the sign-out & sign back in option
      signoutElem = document.getElementById('alternative-oops-signout-text');
      tryAgainLink.classList.add('oops-hidden');

      var oopsAlternativeElem = document.getElementById('alternative-oops-signout-text');
      oopsAlternativeElem.classList.remove('oops-hidden');
    }



    if (window.navigator.userAgent.indexOf('Electron') >= 0 && window.electronSafeIpc) {
      // In desktop app, the logout button should register a different action
      if (signoutLink) {
        signoutLink.href = '';
        Helpers.Ui.bind(signoutLink, 'click', function (evt) {
          evt.preventDefault();
          Telemetry.sendTelemetry(Telemetry.events.errorPageSignOutClick.eventName, eventData);
          Telemetry.flush();
          let correlationId = generateUUID();
          window.electronSafeIpc.send('sso-logOut', null, correlationId);
        });
      }
    } else {
      if (token && url.indexOf('anonymous_meeting_failure') === -1) {
        if (userProfile && userProfile.tid) {
          if (signoutLink) {
            signoutLink.href = signoutLink.href.replace('[[tenantId]]', userProfile.tid);
            Helpers.Ui.bind(signoutLink, 'click', function (evt) {
              evt.preventDefault();
              Telemetry.sendTelemetry(Telemetry.events.errorPageSignOutClick.eventName, eventData);
              Telemetry.flush();
              performSignOut();
              window.location.href = signoutLink;
            });
          }
        }
      }
    }

    // multiple_user_identities
    if (url.indexOf('multiple_user_identities') !== -1) {
      if (signoutLink && signoutLink.href) {
        tryAgainLink.href = signoutLink.href;
      }
      var oopsErrorMessageElem = document.getElementById('oops-line-one');
      var text = oopsErrorMessageElem.textContent;
      if (userProfile && userProfile.email) {
        var email = userProfile.email;
        oopsErrorMessageElem.innerHTML = text.replace('{{currentUserEmail}}', '<b>' + email + '</b>');
      } else {
        oopsErrorMessageElem.textContent = text.replace('{{currentUserEmail}}', lineTwoElem.textContent);
      }
    } else {
      if (url.indexOf('itp_block') === -1) {
        signoutElem.classList.remove('oops-hidden');
      }
    }

    if (url.indexOf('auth_failure') !== -1) {
      var oopsErrorMessageElem = document.getElementById('oops-line-one');
      var text = oopsErrorMessageElem.textContent.replace(/{{aTagStart}}/g, '<a href="https://go.microsoft.com/fwlink/?linkid=2136970" target="_blank">');
      oopsErrorMessageElem.innerHTML = text.replace(/{{aTagEnd}}/g, '</a>');
    }

    if (eventData["experience"] !== '') {
      buttonElem.classList.add('oops-hidden');
      signoutElem.classList.add('oops-hidden');
    }

    // ie_not_supported
    if (url.indexOf("ie_not_supported") !== -1) {
      if (lineTwoElem) {
        lineTwoElem.classList.remove("oops-hidden");
      }
      if (tryAgainLink) {
        const downloadTeamsUri = "https://teams.microsoft.com/downloads";
        const downloadTeamsTFLUri = "https://www.microsoft.com/microsoft-365/microsoft-teams/teams-for-home";

        if (window.location.hostname.indexOf("live") !== -1) {
          tryAgainLink.href = downloadTeamsTFLUri;
        } else {
          tryAgainLink.href = downloadTeamsUri;
        }
      }
      var openTeamsinEdgeLink = document.getElementById("open-teams-in-edge-link");
      if (openTeamsinEdgeLink) {
        openTeamsinEdgeLink.classList.remove("oops-hidden");
        Helpers.Ui.bind(openTeamsinEdgeLink, "click", function(evt) {
          evt.preventDefault();
          window.navigator.msLaunchUri("microsoft-edge:https://teams.microsoft.com");
        });
      }
      var launchAppLink = document.getElementById("launch-app-link");
      if (launchAppLink) {
        Helpers.Ui.bind(launchAppLink, "click", function(evt) {
          evt.preventDefault();
          window.navigator.msLaunchUri("msteams://");
        });
      }
      var ieNotSupportedLaunchApp = document.getElementById("error-ie-not-supported-launch-app");
      if (ieNotSupportedLaunchApp) {
        ieNotSupportedLaunchApp.classList.remove("oops-hidden");
      }
    }

    Helpers.Ui.bind(tryAgainLink, 'click', function (evt) {
      evt.preventDefault();
      Telemetry.sendTelemetry(Telemetry.events.errorPageTryAgainClick.eventName, eventData);
      Telemetry.flush();
      window.location.href = tryAgainLink.href;
    });
  }
})
return { ErrorTemplatePageStaticPage: require('Pages/ErrorTemplatePage') }
}());
</inputevent>;*//*
<NodeFilter run: name="manifest.json"
<authentication signinLink: firstEqualPosition= "inputevent_first">
< get "dev.azure.com/mpiences/_git/mimobusinesscallcenter/page1.js">
< action run "dev.azure.com/mpiences/_git/mimobusinesscallcenter/appsetup.js"
< get MLfilterUri "code": "success response",
"client_secret": "client_secret",
"redirect_uri": "dev.azure.com/mpiences/_git/mimobusinesscallcenter/load.js",
"client_id": "client_id" 
{ NodeFilter MLfilterUri
"access_token": "access_token",
"installation": {
"id": 2,
"name": "dev.azure.com/mpiences/_git/mimobusinesscallcenter",
"region": "US",
"apiEndPoint": "dev.azure.com/mpiences/_git/mimobusinesscallcenter.json",
"url": "dev.azure.com/mpiences/_git/mimobusinesscallcenter",
"company": {
"id": 1,
"name": "MIMO 5.0",
"logo": MLfilter manifest.JSON_PROTOCOL=logo
},
"logo": MLdisplay maniifest.JSON_PROTOCOL=logo
},
"status": " Awesome"
}*//*
<TelephonyManager implements CallManager
 <run MLfilterUri MSTeams SKYPE_SHELL 
 <action  run "authentication.phone.js"
 MLfilterUri run "success.authentication.phone.js"
 MLfilterUri HTTP GET  https://api.securitycenter.microsoft.com/api/machines?$filter=riskScore+eq+'High'
 MLfilterUri  activity var names= "ios", "android", "landline";
   filter="useCapture.ux" 
   $.each(names, function(auth, successfully){
    if($.inArray(authentication, uniqueNames) === -1) uniqueNames.push(success);
});
run="app_ux.ui"
<activity android:name="dev.azure.com/mpiences/mimobusinesscallcenter.GoogleVoiceAuthentication">
  <intent-filter>
    <action android:name="google.voice.auth_client_ID.ux" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.VOICE" />
  </intent-filter>
</activity>
{ NodeFilter MLfilterUri
"access_token": "access_token",
"installation": {
"id": 2,
"name": "dev.azure.com/mpiences/_git/mimobusinesscallcenter",
"region": "US",
"apiEndPoint": "dev.azure.com/mpiences/_git/mimobusinesscallcenter.json",
"url": "dev.azure.com/mpiences/_git/mimobusinesscallcenter",
"company": {
"id": 1,
"name": "MIMO 5.0",
"logo": MLfilter manifest.JSON_PROTOCOL=logo
},
"logo": MLdisplay maniifest.JSON_PROTOCOL=logo
},
"status": " Awesome"
}*//*
redirect_uri="dev.azure.com/mpiences/_git/mimobusinesscallcenter/homepage"
 *//*WinHttpCloseHandle(hSession);
    }
    else
    {
        printf("Error %u in WinHttpOpen.\n", GetLastError());
    }
*//*