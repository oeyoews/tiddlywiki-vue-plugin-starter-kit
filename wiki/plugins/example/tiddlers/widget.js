/*\
title: $:/plugins/oeyoews/example/widget.js
type: application/javascript
module-type: widget

\*/
const { widget: Widget } = require('$:/core/modules/widgets/widget.js');

class ExampleWidget extends Widget {
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
    const {title} = this.attributes;

    const { createApp } = window.Vue;
    const component = require('./app');
    const domNode = this.document.createElement('div');
    const props = {
      title: title|| "Hello tw"
    }

    try {
      const app = createApp(component(props)());

      app.config.errorHandler = (err) => {
        const text = `[Vue3](${app.version}): ` + err;
        console.error(text, '(example plugin)');
        domNode.textContent = text;
        domNode.style.color = 'red';
      };

      // 挂载
      app.mount(domNode);

      parent.insertBefore(domNode, nextSibling);
      this.domNodes.push(domNode);
    } catch (e) {
      console.error(e.message, 'example plugin');
    }
  }
}

exports['example'] = ExampleWidget;
