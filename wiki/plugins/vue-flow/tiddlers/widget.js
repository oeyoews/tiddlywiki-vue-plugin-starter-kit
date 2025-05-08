/*\
title: $:/plugins/oeyoews/vue-flow/widget.js
type: application/javascript
module-type: widget

\*/
const { widget: Widget } = require('$:/core/modules/widgets/widget.js');

class PluginVueFlowWidget extends Widget {
  constructor(parseTreeNode, options) {
    super(parseTreeNode, options);
  }

  render(parent, nextSibling) {
    if (!$tw.browser) return;

    this.computeAttributes();
    this.execute();

    const ssr = this.document.isTiddlyWikiFakeDom;
    if (ssr) return;

    const vuelib = '$:/plugins/oeyoews/neotw-vue3/vue.global.prod.js';

    if (!window.Vue) {
      window.Vue = require(vuelib);
      window.vue = require(vuelib);
    }
    const { filter = '[!is[system]]' } = this.attributes;

    const tiddlers = $tw.wiki.filterTiddlers(filter);

    const getNodes = (tiddlers) => {
      return tiddlers.map((tiddler, index) => {
        const { text, ...fields } = $tw.wiki.getTiddler(tiddler)?.fields;
        const data = {
          id: `tiddler_${index}`,
          type: 'data',
          position: { x: 20, y: 250 + index * 100 },
          data: {
            label: tiddler,
            dataType: 'Tiddler',
            fields,
          },
        };
        return data;
      });
    };

    const data = {
      nodes: getNodes(tiddlers),
      edges: [],
    };

    const { createApp } = window.Vue;
    const component = require('./app');
    const domNode = this.document.createElement('div');
    const props = {
      data,
    };

    try {
      const app = createApp(component(props)());

      app.config.errorHandler = (err) => {
        const text = `[Vue3](${app.version}): ` + err;
        console.error(text, '(vue-flow plugin)');
        domNode.textContent = text;
        domNode.style.color = 'red';
      };

      // 挂载
      app.mount(domNode);

      parent.insertBefore(domNode, nextSibling);
      this.domNodes.push(domNode);
    } catch (e) {
      console.error(e.message, 'vue-flow plugin');
    }
  }
}

exports['vue-flow'] = PluginVueFlowWidget;
