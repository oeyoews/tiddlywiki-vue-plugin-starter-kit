// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.resolve(__dirname, 'templates');

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 默认作者名
const DEFAULT_AUTHOR = 'oeyoews';

// 询问插件名称
rl.question('请输入插件名称: ', (pluginName) => {
  if (!pluginName) {
    console.error('错误: 插件名称不能为空');
    rl.close();
    return;
  }

  // 询问插件描述
  rl.question('请输入插件描述 (可选): ', (description) => {
    // 如果没有提供描述，使用插件名称作为描述
    description = description || pluginName;

    // 询问作者名称
    rl.question(`请输入作者名称 (默认: ${DEFAULT_AUTHOR}): `, (author) => {
      // 如果没有提供作者名称，使用默认值
      author = author || DEFAULT_AUTHOR;

      // 显示将要创建的插件信息
      console.log('\n将要创建以下插件:');
      console.log(`- 插件名称: ${pluginName}`);
      console.log(`- 插件描述: ${description}`);
      console.log(`- 作者名称: ${author}`);
      console.log(`- 源目录: src/plugins/${pluginName}`);
      console.log(`- 目标目录: wiki/plugins/${pluginName}`);

      // 询问是否确认创建
      rl.question('\n确认创建插件? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          // 创建插件
          createPlugin(pluginName, description, author);
        } else {
          console.log('已取消创建插件');
        }
        rl.close();
      });
    });
  });
});

/**
 * 创建插件目录和文件
 * @param {string} pluginName 插件名称
 * @param {string} description 插件描述
 * @param {string} author 作者名称
 */
function createPlugin(pluginName, description, author) {
  console.log(`\n开始创建插件: ${pluginName}`);

  // 创建插件目录
  const srcPluginDir = path.resolve(rootDir, `src/plugins/${pluginName}`);

  // 检查插件目录是否已存在
  if (fs.existsSync(srcPluginDir)) {
    console.error(`错误: 插件目录 ${srcPluginDir} 已存在`);
    return;
  }

  // 创建目录
  fs.mkdirSync(srcPluginDir, { recursive: true });

  console.log(`✅ 创建目录: ${srcPluginDir}`);
  // console.log(`✅ 创建目录: ${wikiPluginDir}`);
  // console.log(`✅ 创建目录: ${wikiTiddlersDir}`);

  // 替换模板中的变量
  const templateVars = {
    pluginName,
    description,
    author,
    capitalizedPluginName: capitalizeFirstLetter(pluginName)
  };

  // 创建 plugin.info 文件
  createFileFromTemplate(
    'plugin.info.template.js',
    path.resolve(srcPluginDir, 'plugin.info'),
    templateVars
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'plugin.info')}`);

  // 创建 readme.tid 文件
  createFileFromTemplate(
    'readme.tid.template',
    path.resolve(srcPluginDir, 'readme.tid'),
    templateVars
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'readme.tid')}`);

  // 创建 main.ts 文件
  createFileFromTemplate(
    'main.ts.template',
    path.resolve(srcPluginDir, 'main.ts'),
    templateVars
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'main.ts')}`);

  // 创建 App.vue 文件
  createFileFromTemplate(
    'App.vue.template',
    path.resolve(srcPluginDir, 'App.vue'),
    templateVars
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'App.vue')}`);

  // 创建 widget.js 文件
  createFileFromTemplate(
    'widget.js.template',
    path.resolve(srcPluginDir, 'widget.js'),
    templateVars
  );
  console.log(`✅ 创建文件: ${path.resolve(srcPluginDir, 'widget.js')}`);

  console.log(`\n✅ 插件 ${pluginName} 创建成功!`);
  console.log(`\n使用以下命令构建插件:`);
  console.log(`npm run build:plugin --name=${pluginName}`);
  console.log(`\n或者构建所有插件:`);
  console.log(`npm run build:all`);
}

/**
 * 从模板创建文件
 * @param {string} templateName 模板文件名
 * @param {string} outputPath 输出文件路径
 * @param {Object} vars 替换变量
 */
function createFileFromTemplate(templateName, outputPath, vars) {
  // 读取模板文件
  const templatePath = path.resolve(templatesDir, templateName);
  let content = fs.readFileSync(templatePath, 'utf-8');

  // 替换模板变量
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  });

  // 如果是 plugin.info 文件，需要将内容转换为 JSON
  if (outputPath.endsWith('plugin.info')) {
    try {
      const jsonObj = JSON.parse(content);
      content = JSON.stringify(jsonObj, null, 2);
    } catch (e) {
      console.error('解析 plugin.info 模板失败:', e);
    }
  }

  // 写入文件
  fs.writeFileSync(outputPath, content, 'utf-8');
}

/**
 * 首字母大写
 * @param {string} str 字符串
 * @returns {string} 首字母大写的字符串
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
