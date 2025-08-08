import { defineComponent, shallowRef, h, resolveComponent, computed, hasInjectionContext, inject, getCurrentInstance, createElementBlock, provide, cloneVNode, createApp, toRef, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, defineAsyncComponent, mergeProps, ref, watch, withAsyncContext, withCtx, createTextVNode, getCurrentScope, toValue, nextTick, useSSRContext } from 'vue';
import { p as parseQuery, l as hasProtocol, m as joinURL, w as withQuery, n as withTrailingSlash, o as withoutTrailingSlash, q as isScriptProtocol, v as sanitizeStatusCode, x as getContext, $ as $fetch, y as createHooks, e as createError$1, z as isEqual, A as stringifyParsedURL, B as stringifyQuery, C as toRouteMatcher, D as createRouter, E as defu } from '../_/nitro.mjs';
import { u as useHead$1, h as headSymbol, b as baseURL } from '../routes/renderer.mjs';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const DEBOUNCE_DEFAULTS = {
  trailing: true
};
function debounce(fn, wait = 25, options = {}) {
  options = { ...DEBOUNCE_DEFAULTS, ...options };
  if (!Number.isFinite(wait)) {
    throw new TypeError("Expected `wait` to be a finite number");
  }
  let leadingValue;
  let timeout;
  let resolveList = [];
  let currentPromise;
  let trailingArgs;
  const applyFn = (_this, args) => {
    currentPromise = _applyPromised(fn, _this, args);
    currentPromise.finally(() => {
      currentPromise = null;
      if (options.trailing && trailingArgs && !timeout) {
        const promise = applyFn(_this, trailingArgs);
        trailingArgs = null;
        return promise;
      }
    });
    return currentPromise;
  };
  return function(...args) {
    if (currentPromise) {
      if (options.trailing) {
        trailingArgs = args;
      }
      return currentPromise;
    }
    return new Promise((resolve) => {
      const shouldCallNow = !timeout && options.leading;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        const promise = options.leading ? leadingValue : applyFn(this, args);
        for (const _resolve of resolveList) {
          _resolve(promise);
        }
        resolveList = [];
      }, wait);
      if (shouldCallNow) {
        leadingValue = applyFn(this, args);
        resolve(leadingValue);
      } else {
        resolveList.push(resolve);
      }
    });
  };
}
async function _applyPromised(fn, _this, args) {
  return await fn.apply(_this, args);
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.0.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8
];
const __nuxt_component_0$1 = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, slots.default?.());
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_0 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
let supabaseClient = null;
const useSupabase = () => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const url = config.public?.supabaseUrl;
  const anonKey = config.public?.supabaseAnonKey;
  if (!url || !anonKey) {
    console.warn("[useSupabase] Missing supabaseUrl or supabaseAnonKey in runtimeConfig.public");
  }
  if (!supabaseClient) {
    supabaseClient = createClient(url, anonKey);
  }
  return { supabase: supabaseClient };
};
function useComments() {
  const getToast = () => {
    {
      return { success: (_msg) => {
      }, error: (_msg) => {
      } };
    }
  };
  const comments = ref({});
  const isSubmitting = ref(false);
  const errorMessage = ref("");
  const loadAllComments = async () => {
    return;
  };
  const getCommentsForPost = (postId) => {
    return comments.value[postId] || [];
  };
  const isPostDisabled = (author, content) => !author?.trim() || !content?.trim() || isSubmitting.value;
  const submitComment = async (postId, author, content) => {
    if (isPostDisabled(author, content)) return;
    errorMessage.value = "";
    isSubmitting.value = true;
    const pid = Number(postId);
    const optimistic = {
      id: void 0,
      post_id: pid,
      author: author.trim(),
      content: content.trim(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    comments.value[pid] = [...comments.value[pid] || [], optimistic];
    try {
      if (true) throw new Error("Cannot submit on server");
      const { supabase: supabase2 } = useSupabase();
      const { error } = await supabase2.from("comments").insert([
        {
          post_id: pid,
          author: optimistic.author,
          content: optimistic.content,
          // Write both fields to satisfy schemas where comment_text is NOT NULL
          comment_text: optimistic.content
        }
      ]);
      if (error) throw error;
      getToast().success("Comment posted!");
    } catch (err) {
      console.error("Failed to post comment", err);
      errorMessage.value = err?.message || "Failed to post comment.";
      comments.value[pid] = (comments.value[pid] || []).filter((c) => c !== optimistic);
      getToast().error(errorMessage.value);
    } finally {
      isSubmitting.value = false;
    }
  };
  return {
    comments,
    loadAllComments,
    getCommentsForPost,
    submitComment,
    isSubmitting,
    isPostDisabled,
    errorMessage
  };
}
function usePosts() {
  const posts = ref([]);
  const isLoading = ref(false);
  const totalPostsCount = ref(0);
  const loadPosts = async (opts) => {
    {
      if (process?.env?.NITRO_LOG_LEVEL === "debug") {
        console.warn("[usePosts] loadPosts skipped on server (SSR)");
      }
      return;
    }
  };
  return { posts, isLoading, totalPostsCount, loadPosts };
}
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!nuxtApp._asyncData[key.value]?._init) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const postsPerPage = 10;
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const {
      getCommentsForPost,
      isSubmitting: commentsIsSubmitting,
      isPostDisabled: commentsIsPostDisabled
    } = useComments();
    const newCommentForms = ref({});
    const draftFor = (postId) => {
      const pid = Number(postId);
      if (!newCommentForms.value[pid]) {
        newCommentForms.value[pid] = { author: "", content: "" };
      }
      return newCommentForms.value[pid];
    };
    const submittingByPost = ref({});
    const isCommentDisabled = (postId) => {
      const d = draftFor(postId);
      const pid = Number(postId);
      return commentsIsPostDisabled(d.author, d.content) || !!submittingByPost.value[pid];
    };
    const expandedComments = ref({});
    const isCommentsExpanded = (postId) => !!expandedComments.value[postId];
    const getCommentCount = (postId) => (getCommentsForPost(postId) || []).length;
    const route = useRoute();
    const getPageTitle = () => {
      switch (route.path) {
        case "/":
          return "TextsMom - Share Your Unhinged Mom Texts | Funny Mom Messages";
        case "/post":
          return "Submit Your Mom Text - Share Funny Mom Messages | TextsMom";
        case "/contact":
          return "Contact Us - Get in Touch | TextsMom";
        case "/about":
          return "About TextsMom - The Home of Unhinged Mom Texts";
        default:
          return "TextsMom - Share Your Unhinged Mom Texts";
      }
    };
    useHead({
      title: computed(() => getPageTitle()),
      meta: [
        {
          name: "description",
          content: computed(() => {
            switch (route.path) {
              case "/":
                return "Share and discover the most unhinged, confusing, and hilarious text messages from moms around the world. Join our community of mom text survivors.";
              case "/post":
                return "Submit your funny, confusing, or unhinged mom text messages to share with our community. Help others laugh and feel less alone.";
              case "/contact":
                return "Get in touch with the TextsMom team. We welcome feedback, suggestions, and your mom text horror stories.";
              case "/about":
                return "Learn about TextsMom, the community dedicated to sharing and celebrating the glorious dysfunction of modern motherhood through text messages.";
              default:
                return "TextsMom - The home of unhinged mom texts from around the world.";
            }
          })
        },
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { name: "theme-color", content: "#FF007A" },
        { name: "msapplication-TileColor", content: "#FF007A" },
        { name: "application-name", content: "TextsMom" },
        { name: "apple-mobile-web-app-title", content: "TextsMom" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-touch-fullscreen", content: "yes" },
        { name: "format-detection", content: "telephone=no" },
        { name: "generator", content: "Nuxt.js" }
      ],
      link: [
        { rel: "canonical", href: computed(() => `https://texts.mom${route.path}`) }
      ],
      script: [
        {
          type: "application/ld+json",
          innerHTML: computed(() => {
            const jsonLdGraph = {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://texts.mom/#website",
                  "url": "https://texts.mom/",
                  "name": "TextsMom",
                  "description": "Share and discover the most unhinged, confusing, and hilarious text messages from moms around the world.",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://texts.mom/?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://texts.mom/#organization",
                  "name": "TextsMom",
                  "url": "https://texts.mom/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://texts.mom/logo.png"
                  }
                },
                {
                  "@type": "WebPage",
                  "@id": `https://texts.mom${route.path}#webpage`,
                  "url": `https://texts.mom${route.path}`,
                  "name": getPageTitle(),
                  "isPartOf": {
                    "@id": "https://texts.mom/#website"
                  }
                }
              ]
            };
            return JSON.stringify(jsonLdGraph, null, 2);
          })
        },
        {
          src: "https://www.googletagmanager.com/gtag/js?id=G-F7NW6VS4H4",
          async: true
        },
        {
          innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-F7NW6VS4H4');
      `
        }
      ]
    });
    const form = ref({
      name: "",
      text: "",
      country: "",
      state: ""
    });
    const contactForm = ref({
      name: "",
      email: "",
      message: "",
      country: "",
      state: ""
    });
    const { posts } = usePosts();
    const showSuccessModal = ref(false);
    const showProfanityModal = ref(false);
    const showRateLimitModal = ref(false);
    const showModerationModal = ref(false);
    const rateLimitRemainingTime = ref(0);
    const profanityModalType = ref("");
    const moderationViolationType = ref("");
    const isVoting = ref(false);
    const userVotes = ref(/* @__PURE__ */ new Map());
    const showMobileMenu = ref(false);
    const closeMobileMenu = () => {
      showMobileMenu.value = false;
    };
    const showShareModal = ref(false);
    const shareModalMessage = ref("");
    const showReportModal = ref(false);
    const showReportSuccessModal = ref(false);
    ref(null);
    const showRandomPostModal = ref(false);
    const currentRandomPost = ref(null);
    const searchQuery = ref("");
    const filterOption = ref("all");
    const filteredPosts = ref([]);
    watch(posts, (newPosts) => {
      if (newPosts.length > 0 && filteredPosts.value.length === 0) {
        filteredPosts.value = [...newPosts];
      }
    }, { immediate: true });
    ref(false);
    ref(0);
    const hasUserVoted = (postId, voteType) => {
      return userVotes.value.get(postId) === voteType;
    };
    const currentPage = ref(1);
    const postsToDisplay = computed(() => {
      return filteredPosts.value.length > 0 || searchQuery.value || filterOption.value !== "all" ? filteredPosts.value : posts.value;
    });
    const totalPages = computed(() => {
      return Math.ceil(postsToDisplay.value.length / postsPerPage);
    });
    const paginatedPosts = computed(() => {
      const start = (currentPage.value - 1) * postsPerPage;
      const end = start + postsPerPage;
      return postsToDisplay.value.slice(start, end);
    });
    const countries = [
      "United States",
      "Canada",
      "United Kingdom",
      "Australia",
      "Germany",
      "France",
      "Italy",
      "Spain",
      "Netherlands",
      "Sweden",
      "Norway",
      "Denmark",
      "Japan",
      "South Korea",
      "India",
      "Brazil",
      "Mexico",
      "Argentina",
      "Other"
    ];
    const usStates = [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming"
    ];
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    };
    const currentPost = ref(null);
    const getNextPostId = () => {
      if (!currentPost.value || posts.value.length === 0) return null;
      const currentIndex = posts.value.findIndex((post) => post.id === currentPost.value.id);
      if (currentIndex === -1 || currentIndex === posts.value.length - 1) {
        return null;
      }
      return posts.value[currentIndex + 1].id;
    };
    const hasNextPost = computed(() => {
      return getNextPostId() !== null;
    });
    const setCurrentPostFromRoute = () => {
      const route2 = useRoute();
      if (route2.path.startsWith("/post/")) {
        const identifier = route2.path.split("/")[2];
        if (identifier) {
          let foundPost = posts.value.find((post) => post.slug === identifier);
          if (!foundPost && !isNaN(identifier)) {
            const postId = parseInt(identifier);
            foundPost = posts.value.find((post) => post.id === postId);
          }
          if (foundPost) {
            currentPost.value = foundPost;
          } else {
            loadIndividualPost(identifier);
          }
        }
      } else {
        currentPost.value = null;
      }
    };
    const loadIndividualPost = async (identifier) => {
      try {
        let existingPost = posts.value.find((post) => post.slug === identifier);
        if (!existingPost && !isNaN(identifier)) {
          const postId = parseInt(identifier);
          existingPost = posts.value.find((post) => post.id === postId);
        }
        if (existingPost) {
          currentPost.value = existingPost;
          return;
        }
        let query = supabase.from("posts").select("*");
        if (isNaN(identifier)) {
          query = query.eq("slug", identifier);
        } else {
          const postId = parseInt(identifier);
          query = query.or(`slug.eq.${identifier},id.eq.${postId}`);
        }
        const { data, error } = await query.single();
        if (error) {
          console.error("Error loading individual post:", error);
          currentPost.value = null;
          return;
        }
        if (data) {
          currentPost.value = data;
          return;
        }
        currentPost.value = null;
      } catch (error) {
        console.error("Error loading individual post:", error);
        currentPost.value = null;
      }
    };
    const { data: ssrPost } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "current-post",
      async () => {
        if (route.path.startsWith("/post/")) {
          const identifier = route.path.split("/")[2];
          if (identifier) {
            try {
              let query = supabase.from("posts").select("*");
              if (isNaN(identifier)) {
                query = query.eq("slug", identifier);
              } else {
                const postId = parseInt(identifier);
                query = query.or(`slug.eq.${identifier},id.eq.${postId}`);
              }
              const { data, error } = await query.single();
              if (error || !data) {
                return null;
              }
              return data;
            } catch (error) {
              console.error("Error loading post for SSR:", error);
              return null;
            }
          }
        }
        return null;
      },
      {
        server: true,
        default: () => null
      }
    )), __temp = await __temp, __restore(), __temp);
    if (ssrPost.value) {
      currentPost.value = ssrPost.value;
      const ssrBlogPostingLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `https://texts.mom/post/${ssrPost.value.slug || ssrPost.value.id}#blogposting`,
        "headline": ssrPost.value.seoTitle || (ssrPost.value.message ? ssrPost.value.message.substring(0, 60).trim() + (ssrPost.value.message.length > 60 ? "..." : "") : "Mom Text"),
        "description": ssrPost.value.seoDescription || (ssrPost.value.message ? ssrPost.value.message.substring(0, 155).trim() + (ssrPost.value.message.length > 155 ? "..." : "") : "A hilarious mom text submitted to texts.mom."),
        "articleBody": ssrPost.value.message || "A hilarious mom text.",
        "url": `https://texts.mom/post/${ssrPost.value.slug || ssrPost.value.id}`,
        "datePublished": ssrPost.value.created_at ? new Date(ssrPost.value.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        "dateModified": ssrPost.value.updated_at ? new Date(ssrPost.value.updated_at).toISOString() : ssrPost.value.created_at ? new Date(ssrPost.value.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        "image": {
          "@type": "ImageObject",
          "url": ssrPost.value.image || "https://texts.mom/default-post-image.jpg"
        },
        "author": {
          "@type": "Person",
          "name": ssrPost.value.name || "Anonymous",
          "url": ssrPost.value.authorUrl || "https://texts.mom/about"
        },
        "publisher": {
          "@type": "Organization",
          "name": "TextsMom",
          "@id": "https://texts.mom/#organization",
          "logo": {
            "@type": "ImageObject",
            "url": "https://texts.mom/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://texts.mom/post/${ssrPost.value.slug || ssrPost.value.id}#webpage`
        },
        "isPartOf": {
          "@type": "Blog",
          "@id": "https://texts.mom/#blog",
          "name": "TextsMom"
        }
      };
      useHead({
        script: [
          {
            key: "ssr-blogposting-ld",
            type: "application/ld+json",
            innerHTML: JSON.stringify(ssrBlogPostingLd, null, 2)
          }
        ]
      });
    }
    watch(() => useRoute().path, () => {
      setCurrentPostFromRoute();
    }, { immediate: true });
    watch(currentPost, (newPost) => {
      if (newPost) {
        const blogPostingLd = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `https://texts.mom/post/${newPost.slug || newPost.id}#blogposting`,
          "headline": newPost.seoTitle || (newPost.message ? newPost.message.substring(0, 60).trim() + (newPost.message.length > 60 ? "..." : "") : "Mom Text"),
          "description": newPost.seoDescription || (newPost.message ? newPost.message.substring(0, 155).trim() + (newPost.message.length > 155 ? "..." : "") : "A hilarious mom text submitted to texts.mom."),
          "articleBody": newPost.message || "A hilarious mom text.",
          "url": `https://texts.mom/post/${newPost.slug || newPost.id}`,
          "datePublished": newPost.created_at ? new Date(newPost.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
          "dateModified": newPost.updated_at ? new Date(newPost.updated_at).toISOString() : newPost.created_at ? new Date(newPost.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
          "image": {
            "@type": "ImageObject",
            "url": newPost.image || "https://texts.mom/default-post-image.jpg"
          },
          "author": {
            "@type": "Person",
            "name": newPost.name || "Anonymous",
            "url": newPost.authorUrl || "https://texts.mom/about"
          },
          "publisher": {
            "@type": "Organization",
            "name": "TextsMom",
            "@id": "https://texts.mom/#organization",
            "logo": {
              "@type": "ImageObject",
              "url": "https://texts.mom/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://texts.mom/post/${newPost.slug || newPost.id}#webpage`
          },
          "isPartOf": {
            "@type": "Blog",
            "@id": "https://texts.mom/#blog",
            "name": "TextsMom"
          }
        };
        useHead({
          title: `${newPost.name}'s Mom Text - TextsMom`,
          meta: [
            {
              name: "description",
              content: `Read this hilarious mom text from ${newPost.name}: "${newPost.message.substring(0, 150)}${newPost.message.length > 150 ? "..." : ""}"`
            },
            {
              property: "og:title",
              content: `${newPost.name}'s Mom Text - TextsMom`
            },
            {
              property: "og:description",
              content: `"${newPost.message.substring(0, 200)}${newPost.message.length > 200 ? "..." : ""}"`
            },
            {
              property: "og:url",
              content: `https://texts.mom/post/${newPost.slug || newPost.id}`
            }
          ],
          script: [
            {
              key: "blogposting-ld",
              type: "application/ld+json",
              innerHTML: JSON.stringify(blogPostingLd, null, 2)
            }
          ]
        });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtRouteAnnouncer = __nuxt_component_0$1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "site-container" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent));
      _push(`<header class="site-header">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "site-name-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="site-name"${_scopeId}><span class="texts"${_scopeId}>texts</span><span class="dot"${_scopeId}>.</span><span class="mom"${_scopeId}>mom</span></div>`);
          } else {
            return [
              createVNode("div", { class: "site-name" }, [
                createVNode("span", { class: "texts" }, "texts"),
                createVNode("span", { class: "dot" }, "."),
                createVNode("span", { class: "mom" }, "mom")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="site-nav desktop-nav"><button class="nav-link nav-link-texts">THE TEXTS</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/post",
        class: "nav-link nav-link-post"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`POST!`);
          } else {
            return [
              createTextVNode("POST!")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`ABOUT`);
          } else {
            return [
              createTextVNode("ABOUT")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`CONTACT`);
          } else {
            return [
              createTextVNode("CONTACT")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="mobile-nav"><button class="${ssrRenderClass([{ "active": unref(showMobileMenu) }, "hamburger-btn"])}"><span></span><span></span><span></span></button><div class="${ssrRenderClass([{ "active": unref(showMobileMenu) }, "mobile-backdrop"])}"></div><nav class="${ssrRenderClass([{ "active": unref(showMobileMenu) }, "mobile-menu"])}"><button class="mobile-nav-link mobile-nav-link-texts">THE TEXTS</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/post",
        class: "mobile-nav-link mobile-nav-link-post",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`POST!`);
          } else {
            return [
              createTextVNode("POST!")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "mobile-nav-link",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`ABOUT`);
          } else {
            return [
              createTextVNode("ABOUT")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "mobile-nav-link",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`CONTACT`);
          } else {
            return [
              createTextVNode("CONTACT")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></header>`);
      if (_ctx.$route.path === "/post") {
        _push(`<main><hr class="site-hr"><div class="post-form-container"><h1 class="post-title">DROP THE TEXT<span class="green-period">.</span> CLEANSE YOUR SOUL<span class="green-period">.</span></h1><form class="post-form"><div class="form-group"><label for="name" class="form-label">NAME</label><input type="text" id="name"${ssrRenderAttr("value", unref(form).name)} class="form-input" placeholder="Your name, not your mom&#39;s..." required></div><div class="form-group"><label for="text" class="form-label">TEXT</label><textarea id="text" class="form-textarea" rows="6" maxlength="280" placeholder="Share the mom text that made you laugh, cry, or question reality..." required>${ssrInterpolate(unref(form).text)}</textarea></div><div class="form-group"><label for="country" class="form-label">COUNTRY</label><select id="country" class="form-select" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).country) ? ssrLooseContain(unref(form).country, "") : ssrLooseEqual(unref(form).country, "")) ? " selected" : ""}>Select a country</option><!--[-->`);
        ssrRenderList(countries, (country) => {
          _push(`<option${ssrRenderAttr("value", country)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).country) ? ssrLooseContain(unref(form).country, country) : ssrLooseEqual(unref(form).country, country)) ? " selected" : ""}>${ssrInterpolate(country)}</option>`);
        });
        _push(`<!--]--></select></div>`);
        if (unref(form).country === "United States") {
          _push(`<div class="form-group"><label for="state" class="form-label">STATE</label><select id="state" class="form-select" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).state) ? ssrLooseContain(unref(form).state, "") : ssrLooseEqual(unref(form).state, "")) ? " selected" : ""}>Select a state</option><!--[-->`);
          ssrRenderList(usStates, (state) => {
            _push(`<option${ssrRenderAttr("value", state)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).state) ? ssrLooseContain(unref(form).state, state) : ssrLooseEqual(unref(form).state, state)) ? " selected" : ""}>${ssrInterpolate(state)}</option>`);
          });
          _push(`<!--]--></select></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="submit-btn">SUBMIT</button></form></div></main>`);
      } else if (_ctx.$route.path === "/contact") {
        _push(`<main><hr class="site-hr"><div class="post-form-container"><h1 class="post-title">GET IN TOUCH<span class="green-period">.</span> WE&#39;RE LISTENING<span class="green-period">.</span></h1><form class="post-form"><div class="form-group"><label for="contact-name" class="form-label">NAME</label><input type="text" id="contact-name"${ssrRenderAttr("value", unref(contactForm).name)} class="form-input" placeholder="Your actual name this time..." required></div><div class="form-group"><label for="contact-email" class="form-label">EMAIL</label><input type="email" id="contact-email"${ssrRenderAttr("value", unref(contactForm).email)} class="form-input" placeholder="We promise not to spam you with mom jokes..." required></div><div class="form-group"><label for="contact-message" class="form-label">MESSAGE</label><textarea id="contact-message" class="form-textarea" rows="6" placeholder="Tell us what&#39;s on your mind. Complaints about your mom are welcome..." required>${ssrInterpolate(unref(contactForm).message)}</textarea></div><div class="form-group"><label for="contact-country" class="form-label">COUNTRY</label><select id="contact-country" class="form-select" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(contactForm).country) ? ssrLooseContain(unref(contactForm).country, "") : ssrLooseEqual(unref(contactForm).country, "")) ? " selected" : ""}>Select a country</option><!--[-->`);
        ssrRenderList(countries, (country) => {
          _push(`<option${ssrRenderAttr("value", country)}${ssrIncludeBooleanAttr(Array.isArray(unref(contactForm).country) ? ssrLooseContain(unref(contactForm).country, country) : ssrLooseEqual(unref(contactForm).country, country)) ? " selected" : ""}>${ssrInterpolate(country)}</option>`);
        });
        _push(`<!--]--></select></div>`);
        if (unref(contactForm).country === "United States") {
          _push(`<div class="form-group"><label for="contact-state" class="form-label">STATE</label><select id="contact-state" class="form-select" required><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(contactForm).state) ? ssrLooseContain(unref(contactForm).state, "") : ssrLooseEqual(unref(contactForm).state, "")) ? " selected" : ""}>Select a state</option><!--[-->`);
          ssrRenderList(usStates, (state) => {
            _push(`<option${ssrRenderAttr("value", state)}${ssrIncludeBooleanAttr(Array.isArray(unref(contactForm).state) ? ssrLooseContain(unref(contactForm).state, state) : ssrLooseEqual(unref(contactForm).state, state)) ? " selected" : ""}>${ssrInterpolate(state)}</option>`);
          });
          _push(`<!--]--></select></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="submit-btn">SEND MESSAGE</button></form></div></main>`);
      } else if (_ctx.$route.path === "/about") {
        _push(`<main><hr class="site-hr"><div class="about-container"><h1 class="about-title">She typed it<span class="green-period">.</span> You read it<span class="green-period">.</span> We all suffer together<span class="green-period">.</span></h1><div class="about-content"><p>She means well<span class="green-period">.</span> She really does<span class="green-period">.</span></p><p>But somewhere between the missed punctuation, the all-caps threats, the cryptic emojis, and the &quot;who is this&quot; follow-ups… something unravels<span class="green-period">.</span></p><p>Texts<span class="green-period">.</span>mom is a shrine to the glorious dysfunction of modern motherhood—one, unhinged message at a time<span class="green-period">.</span></p><p>We don&#39;t judge<span class="green-period">.</span> Okay, maybe a little<span class="green-period">.</span> We just document<span class="green-period">.</span></p><p>Whether it&#39;s passive-aggressive guilt, baffling autocorrects, or love disguised as psychological warfare, if she texted it—you can post it<span class="green-period">.</span></p><p class="about-final">You&#39;re not alone<span class="green-period">.</span> Your mom just texts like this<span class="green-period">.</span></p></div></div></main>`);
      } else if (_ctx.$route.path.startsWith("/post/")) {
        _push(`<main><hr class="site-hr">`);
        if (unref(currentPost)) {
          _push(`<div class="individual-post-container"><div class="post-navigation"><button class="back-btn"> ← Back to Feed </button><button class="next-btn"${ssrIncludeBooleanAttr(!unref(hasNextPost)) ? " disabled" : ""}${ssrRenderAttr("title", unref(hasNextPost) ? "Go to next post" : "No more posts")}> Next Mom Text → </button></div><div class="individual-post-card"><div class="post-header"><span class="post-author">${ssrInterpolate(unref(currentPost).name)}</span><span class="post-location">${ssrInterpolate(unref(currentPost).location)}</span></div><pre class="post-content whitespace-pre-wrap text-left break-words">${ssrInterpolate(unref(currentPost).message)}</pre><div class="post-footer"><div class="post-timestamp">${ssrInterpolate(formatDate(unref(currentPost).created_at))}</div><div class="post-actions"><div class="post-sharing"><button class="share-btn report-btn" title="Report this post"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></button><div class="share-divider"></div><button class="share-btn share-twitter" title="Share on Twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></button><button class="share-btn share-instagram" title="Share on Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></button><button class="share-btn share-copy" title="Copy link"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg></button></div><div class="post-voting"><button class="${ssrRenderClass(["vote-btn", "vote-up", { "voted": hasUserVoted(unref(currentPost).id, "up") }])}"${ssrIncludeBooleanAttr(unref(isVoting)) ? " disabled" : ""}> 👍 <span class="vote-count">${ssrInterpolate(unref(currentPost).likes || 0)}</span></button><button class="${ssrRenderClass(["vote-btn", "vote-down", { "voted": hasUserVoted(unref(currentPost).id, "down") }])}"${ssrIncludeBooleanAttr(unref(isVoting)) ? " disabled" : ""}> 👎 <span class="vote-count">${ssrInterpolate(unref(currentPost).dislikes || 0)}</span></button><button class="comment-btn"${ssrRenderAttr("title", `${getCommentCount(unref(currentPost).id)} comments`)}> 💬 <span class="comment-count">${ssrInterpolate(getCommentCount(unref(currentPost).id))}</span></button></div></div></div></div><div class="comment-section comment-section-expanded"><div class="comment-header"><h4>Comments (${ssrInterpolate(getCommentCount(unref(currentPost).id))})</h4></div><div class="comments-list">`);
          if (unref(getCommentsForPost)(unref(currentPost).id).length === 0) {
            _push(`<div class="no-comments"> No comments yet. Be the first to comment! </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(unref(getCommentsForPost)(unref(currentPost).id), (comment) => {
            _push(`<div class="comment-item"><div class="comment-author">${ssrInterpolate(comment.author)}</div><div class="comment-content">${ssrInterpolate(comment.content)}</div><div class="comment-timestamp">${ssrInterpolate(formatDate(comment.created_at))}</div></div>`);
          });
          _push(`<!--]--></div><div class="add-comment-form"><div class="comment-input-group"><input${ssrRenderAttr("value", draftFor(unref(currentPost).id).author)} type="text" placeholder="Your name..." class="comment-author-input" maxlength="50"><textarea placeholder="Write a comment..." class="comment-content-input" rows="3" maxlength="500">${ssrInterpolate(draftFor(unref(currentPost).id).content)}</textarea><button class="submit-comment-btn"${ssrIncludeBooleanAttr(isCommentDisabled(unref(currentPost).id)) ? " disabled" : ""}>`);
          if (unref(submittingByPost)[Number(unref(currentPost).id)] || unref(commentsIsSubmitting)) {
            _push(`<span class="spinner" aria-hidden="true"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(unref(submittingByPost)[Number(unref(currentPost).id)] || unref(commentsIsSubmitting) ? "Posting..." : "Post Comment")}</button></div></div></div></div>`);
        } else {
          _push(`<div class="post-not-found"><h2>Post Not Found</h2><p>The post you&#39;re looking for doesn&#39;t exist or has been removed.</p><button class="back-btn">← Back to Feed</button></div>`);
        }
        _push(`</main>`);
      } else {
        _push(`<main><hr class="site-hr"><h1 class="sr-only">TextsMom - Share Your Unhinged Mom Texts</h1><div class="main-blurb"><div class="fade-word fade-word-1">UNHINGED<span class="green-period">.</span></div><div class="fade-word fade-word-2">DERANGED<span class="green-period">.</span></div><div class="fade-word fade-word-3">CONFUSING<span class="green-period">.</span></div></div><div class="main-blurb2"><span class="typewriter">YOU KNOW A <span class="blurb2">MOM</span> TEXT WHEN YOU SEE ONE<span class="green-period">.</span></span></div><hr class="site-hr2"><div class="main-postit"><div class="postit2"><span class="green-notice">NOTICE:</span> Every 60 seconds, over 2 million texts are sent by... mothers... all over the world. If you get a mom text, stay calm and immediately share it here.</div></div>`);
        if (unref(posts).length > 0) {
          _push(`<div id="posts-section" class="posts-section"><hr class="site-hr"><div class="feed-title-container"><div class="feed-title-main"><span class="live-indicator">● LIVE</span><span class="feed-title-text">FRESH TEXTS</span><span class="mom-text-highlight">FROM MOMS</span></div><div class="feed-subtitle">Real texts<span class="green-period">.</span> Real chaos<span class="green-period">.</span> Real moms<span class="green-period">.</span></div></div><div class="search-filter-bar"><div class="search-container"><input type="text"${ssrRenderAttr("value", unref(searchQuery))} placeholder="Search texts..." class="search-input"><span class="search-icon">🔍</span></div><button class="random-btn" title="Show random post"> RANDOM </button><div class="filter-container"><select class="filter-select"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(filterOption)) ? ssrLooseContain(unref(filterOption), "all") : ssrLooseEqual(unref(filterOption), "all")) ? " selected" : ""}>All Posts</option><option value="newest"${ssrIncludeBooleanAttr(Array.isArray(unref(filterOption)) ? ssrLooseContain(unref(filterOption), "newest") : ssrLooseEqual(unref(filterOption), "newest")) ? " selected" : ""}>Newest First</option><option value="oldest"${ssrIncludeBooleanAttr(Array.isArray(unref(filterOption)) ? ssrLooseContain(unref(filterOption), "oldest") : ssrLooseEqual(unref(filterOption), "oldest")) ? " selected" : ""}>Oldest First</option><option value="most-liked"${ssrIncludeBooleanAttr(Array.isArray(unref(filterOption)) ? ssrLooseContain(unref(filterOption), "most-liked") : ssrLooseEqual(unref(filterOption), "most-liked")) ? " selected" : ""}>Most Liked</option><option value="most-disliked"${ssrIncludeBooleanAttr(Array.isArray(unref(filterOption)) ? ssrLooseContain(unref(filterOption), "most-disliked") : ssrLooseEqual(unref(filterOption), "most-disliked")) ? " selected" : ""}>Most Controversial</option></select></div></div><div class="posts-container"><!--[-->`);
          ssrRenderList(unref(paginatedPosts), (post, index) => {
            _push(`<div class="${ssrRenderClass(["post-card", "chat-bubble", index % 2 === 0 ? "chat-left" : "chat-right"])}"><div class="post-header"><span class="post-author">${ssrInterpolate(post.name)}</span><span class="post-location">${ssrInterpolate(post.location)}</span></div><pre class="post-content whitespace-pre-wrap text-left break-words">${ssrInterpolate(post.message)}</pre><div class="post-footer"><div class="post-timestamp">${ssrInterpolate(formatDate(post.created_at))}</div><div class="post-actions"><div class="post-sharing"><button class="share-btn report-btn" title="Report this post"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></button><div class="share-divider"></div><button class="share-btn share-twitter" title="Share on Twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></button><button class="share-btn share-instagram" title="Share on Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></button><button class="share-btn share-copy" title="Copy link"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg></button></div><div class="post-voting"><button class="${ssrRenderClass(["vote-btn", "vote-up", { "voted": hasUserVoted(post.id, "up") }])}"${ssrIncludeBooleanAttr(unref(isVoting)) ? " disabled" : ""}> 👍 <span class="vote-count">${ssrInterpolate(post.likes || 0)}</span></button><button class="${ssrRenderClass(["vote-btn", "vote-down", { "voted": hasUserVoted(post.id, "down") }])}"${ssrIncludeBooleanAttr(unref(isVoting)) ? " disabled" : ""}> 👎 <span class="vote-count">${ssrInterpolate(post.dislikes || 0)}</span></button><button class="comment-btn"${ssrRenderAttr("title", `${getCommentCount(post.id)} comments`)}> 💬 <span class="comment-count">${ssrInterpolate(getCommentCount(post.id))}</span></button></div></div></div>`);
            if (isCommentsExpanded(post.id)) {
              _push(`<div class="comment-section"><div class="comment-header"><h4>Comments (${ssrInterpolate(getCommentCount(post.id))})</h4></div><div class="comments-list">`);
              if (unref(getCommentsForPost)(post.id).length === 0) {
                _push(`<div class="no-comments"> No comments yet. Be the first to comment! </div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<!--[-->`);
              ssrRenderList(unref(getCommentsForPost)(post.id), (comment) => {
                _push(`<div class="comment-item"><div class="comment-author">${ssrInterpolate(comment.author)}</div><div class="comment-content">${ssrInterpolate(comment.content)}</div><div class="comment-timestamp">${ssrInterpolate(formatDate(comment.created_at))}</div></div>`);
              });
              _push(`<!--]--></div><div class="add-comment-form"><div class="comment-input-group"><input${ssrRenderAttr("value", draftFor(post.id).author)} type="text" placeholder="Your name..." class="comment-author-input" maxlength="50"><textarea placeholder="Write a comment..." class="comment-content-input" rows="3" maxlength="500">${ssrInterpolate(draftFor(post.id).content)}</textarea><button class="submit-comment-btn"${ssrIncludeBooleanAttr(isCommentDisabled(post.id)) ? " disabled" : ""}>`);
              if (unref(submittingByPost)[Number(post.id)] || unref(commentsIsSubmitting)) {
                _push(`<span class="spinner" aria-hidden="true"></span>`);
              } else {
                _push(`<!---->`);
              }
              _push(` ${ssrInterpolate(unref(submittingByPost)[Number(post.id)] || unref(commentsIsSubmitting) ? "Posting..." : "Post Comment")}</button></div></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
          if (unref(totalPages) > 1) {
            _push(`<div class="pagination"><button${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""} class="pagination-btn pagination-prev"> ← PREVIOUS </button><div class="pagination-info"><span class="page-indicator">${ssrInterpolate(unref(currentPage))} of ${ssrInterpolate(unref(totalPages))}</span></div><button${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""} class="pagination-btn pagination-next"> NEXT → </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</main>`);
      }
      _push(`<footer class="site-footer"><div class="copyright"> 2025 texts.mom - All rights reserved </div></footer>`);
      if (unref(showSuccessModal)) {
        _push(`<div class="modal-overlay"><div class="modal-content"><div class="modal-header"><div class="success-icon">✓</div><h2 class="modal-title">TEXT SUBMITTED<span class="green-period">!</span></h2></div><div class="modal-body"><p class="modal-message">Thank you for sharing your mom text! It has been posted and is now live on the homepage.</p><p class="modal-submessage">Your contribution helps others laugh, cry, and question reality together.</p></div><div class="modal-actions"><button class="modal-btn modal-btn-primary">VIEW ON HOMEPAGE</button><button class="modal-btn modal-btn-secondary">SUBMIT ANOTHER</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showProfanityModal)) {
        _push(`<div class="modal-overlay"><div class="modal-content"><div class="modal-header"><div class="warning-icon">🚫</div><h2 class="modal-title">CONTENT FILTERED<span class="green-period">!</span></h2></div><div class="modal-body">`);
        if (unref(profanityModalType) === "name") {
          _push(`<p class="modal-message">Your mom says a lot of things but she didn&#39;t name you that. Keep your name clean and family-friendly.</p>`);
        } else {
          _push(`<p class="modal-message">Your mom text contains inappropriate language. We were shocked too.</p>`);
        }
        if (unref(profanityModalType) === "name") {
          _push(`<p class="modal-submessage">We want to maintain a positive community for everyone.</p>`);
        } else {
          _push(`<p class="modal-submessage">We know mom texts can be wild, but let&#39;s keep the language clean!</p>`);
        }
        _push(`</div><div class="modal-actions"><button class="modal-btn modal-btn-primary">GOT IT</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showRateLimitModal)) {
        _push(`<div class="modal-overlay"><div class="modal-content"><div class="modal-header"><div class="warning-icon">⏰</div><h2 class="modal-title">WHOA! SLOW DOWN THERE!<span class="green-period">!</span></h2></div><div class="modal-body"><p class="modal-message">You can submit another post in ${ssrInterpolate(unref(rateLimitRemainingTime))} seconds.</p><p class="modal-submessage">This helps prevent spam and keeps the quality high.</p></div><div class="modal-actions"><button class="modal-btn modal-btn-primary">UNDERSTOOD</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showModerationModal)) {
        _push(`<div class="modal-overlay"><div class="modal-content"><div class="modal-header"><div class="warning-icon">🤖</div><h2 class="modal-title">CONTENT FLAGGED<span class="green-period">!</span></h2></div><div class="modal-body"><p class="modal-message">Our AI moderation system has flagged your content.</p><p class="modal-submessage">Detected: <strong>${ssrInterpolate(unref(moderationViolationType))}</strong></p><p class="modal-submessage">Please revise your message to comply with our community guidelines.</p></div><div class="modal-actions"><button class="modal-btn modal-btn-primary">REVISE CONTENT</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showShareModal)) {
        _push(`<div class="modal-overlay"><div class="modal-content"><div class="modal-header"><div class="warning-icon">✨</div><h2 class="modal-title">SHARE SUCCESS<span class="green-period">!</span></h2></div><div class="modal-body"><p class="modal-message">${ssrInterpolate(unref(shareModalMessage))}</p></div><div class="modal-actions"><button class="modal-btn modal-btn-primary">AWESOME</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showReportModal)) {
        _push(`<div class="modal-overlay"><div class="modal-content"><div class="modal-header"><div class="warning-icon">🛡️</div><h2 class="modal-title">REPORT POST<span class="green-period">.</span></h2></div><div class="modal-body"><p class="modal-message">Why are you reporting this post?</p><div class="report-reasons"><button class="report-reason-btn">Inappropriate Content</button><button class="report-reason-btn">Spam</button><button class="report-reason-btn">Harassment</button><button class="report-reason-btn">Fake/Misleading</button><button class="report-reason-btn">Other</button></div></div><div class="modal-actions"><button class="modal-btn modal-btn-secondary">CANCEL</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showReportSuccessModal)) {
        _push(`<div class="modal-overlay"><div class="modal-content"><div class="modal-header"><div class="success-icon">✅</div><h2 class="modal-title">REPORT SUBMITTED<span class="green-period">!</span></h2></div><div class="modal-body"><p class="modal-message">Thank you for helping keep our community safe!</p><p class="modal-submessage">We&#39;ll review this post and take appropriate action if needed. Your report helps us maintain a positive environment for everyone.</p></div><div class="modal-actions"><button class="modal-btn modal-btn-primary">UNDERSTOOD</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showRandomPostModal)) {
        _push(`<div class="modal-overlay"><div class="modal-content random-post-modal"><div class="modal-header"><div class="random-icon">🎲</div><h2 class="modal-title">RANDOM MOM TEXT<span class="green-period">!</span></h2></div>`);
        if (unref(currentRandomPost)) {
          _push(`<div class="modal-body"><div class="random-post-display"><div class="random-post-bubble chat-bubble chat-left"><div class="post-header"><span class="post-author">${ssrInterpolate(unref(currentRandomPost).name)}</span><span class="post-location">${ssrInterpolate(unref(currentRandomPost).location)}</span></div><div class="post-content">${ssrInterpolate(unref(currentRandomPost).message)}</div><div class="post-footer"><div class="post-timestamp">${ssrInterpolate(formatDate(unref(currentRandomPost).created_at))}</div></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="modal-actions"><button class="modal-btn modal-btn-secondary">ANOTHER RANDOM POST</button><button class="modal-btn modal-btn-primary">CLOSE</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-CmmQ_OeB.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-BeYnhgjA.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { __nuxt_component_0 as _, entry$1 as default, useHead as u };
//# sourceMappingURL=server.mjs.map
