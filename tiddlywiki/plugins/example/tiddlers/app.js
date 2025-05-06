"use strict";

const _imports_0 = "/vite.svg";
const _imports_1 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='37.07'%20height='36'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20198'%3e%3cpath%20fill='%2341B883'%20d='M204.8%200H256L128%20220.8L0%200h97.92L128%2051.2L157.44%200h47.36Z'%3e%3c/path%3e%3cpath%20fill='%2341B883'%20d='m0%200l128%20220.8L256%200h-51.2L128%20132.48L50.56%200H0Z'%3e%3c/path%3e%3cpath%20fill='%2335495E'%20d='M50.56%200L128%20133.12L204.8%200h-47.36L128%2051.2L97.92%200H50.56Z'%3e%3c/path%3e%3c/svg%3e";
const _hoisted_1$1 = { class: "card" };
const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
  __name: "HelloWorld",
  props: {
    msg: {}
  },
  setup(__props) {
    const count = vue.ref(0);
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
        vue.createElementVNode("h1", null, vue.toDisplayString(_ctx.msg) + " " + vue.toDisplayString(_ctx.name), 1),
        vue.createElementVNode("div", _hoisted_1$1, [
          vue.createElementVNode("button", {
            type: "button",
            onClick: _cache[0] || (_cache[0] = ($event) => count.value++)
          }, "count is " + vue.toDisplayString(count.value), 1),
          _cache[1] || (_cache[1] = vue.createElementVNode("p", null, [
            vue.createTextVNode(" Edit "),
            vue.createElementVNode("code", null, "components/HelloWorld.vue"),
            vue.createTextVNode(" to test HMR ")
          ], -1))
        ]),
        _cache[2] || (_cache[2] = vue.createElementVNode("p", null, [
          vue.createTextVNode(" Check out "),
          vue.createElementVNode("a", {
            href: "https://vuejs.org/guide/quick-start.html#local",
            target: "_blank"
          }, "create-vue"),
          vue.createTextVNode(", the official Vue + Vite starter ")
        ], -1)),
        _cache[3] || (_cache[3] = vue.createElementVNode("p", null, [
          vue.createTextVNode(" Learn more about IDE Support for Vue in the "),
          vue.createElementVNode("a", {
            href: "https://vuejs.org/guide/scaling-up/tooling.html#ide-support",
            target: "_blank"
          }, "Vue Docs Scaling up Guide"),
          vue.createTextVNode(". ")
        ], -1)),
        _cache[4] || (_cache[4] = vue.createElementVNode("p", { class: "read-the-docs" }, "Click on the Vite and Vue logos to learn more", -1))
      ], 64);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const HelloWorld = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8d7cc8de"]]);
const _hoisted_1 = { key: 0 };
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  __name: "App",
  props: {
    title: {},
    theme: {},
    showLogos: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
        _ctx.showLogos !== false ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, _cache[0] || (_cache[0] = [
          vue.createElementVNode("a", {
            href: "https://vite.dev",
            target: "_blank"
          }, [
            vue.createElementVNode("img", {
              src: _imports_0,
              class: "logo",
              alt: "Vite logo"
            })
          ], -1),
          vue.createElementVNode("a", {
            href: "https://vuejs.org/",
            target: "_blank"
          }, [
            vue.createElementVNode("img", {
              src: _imports_1,
              class: "logo vue",
              alt: "Vue logo"
            })
          ], -1)
        ]))) : vue.createCommentVNode("", true),
        vue.createVNode(HelloWorld, {
          msg: _ctx.title || "Vite + Vue"
        }, null, 8, ["msg"])
      ], 64);
    };
  }
});
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-328c88da"]]);
function component(props = {}) {
  return function(containerProps = {}) {
    const mergedProps = { ...props, ...containerProps };
    return {
      render() {
        return vue.h(App, mergedProps);
      }
    };
  };
}
module.exports = component;
