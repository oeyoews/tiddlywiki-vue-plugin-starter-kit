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
    const { filter = '[!is[system]!sort[modified]limit[4]]' } = this.attributes;

    const tiddlers = $tw.wiki.filterTiddlers(filter);

    const getNodes = (tiddlers) => {
      return tiddlers.map((tiddler, index) => {
        const { creator, title, tags, ...otherFields } =
          $tw.wiki.getTiddler(tiddler)?.fields;
        const data = {
          id: `tiddler_${index}`,
          type: 'data',
          position: { x: 20, y: 250 + index * 100 },
          data: {
            label: tiddler,
            dataType: 'Tiddler',
            fields: {
              creator,
              title,
              tags,
            },
          },
        };
        return data;
      });
    };
    const getEdges = (tiddlers) => {
      // 创建边数组
      const edges = [];

      // 如果节点数量小于2，则无需创建边
      if (tiddlers.length < 2) return edges;

      // 获取默认边样式
      const defaultEdgeStyle = {
        animated: true,
        style: { stroke: '#1890ff', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          color: '#1890ff',
          width: 16,
          height: 16,
          strokeWidth: 0.1,
        },
      };

      // 创建连接线 - 每个节点连接到下一个节点
      for (let i = 0; i < tiddlers.length - 1; i++) {
        const sourceId = `tiddler_${i}`;
        const targetId = `tiddler_${i + 1}`;

        // 创建边
        edges.push({
          id: `edge-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: 'smoothstep',
          ...defaultEdgeStyle,
        });
      }

      return edges;
    };

    const data = {
      nodes: getNodes(tiddlers),
      edges: getEdges(tiddlers),
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
