// @ts-nocheck
import fs from 'fs';
import path from 'path';

// 默认插件名称
const DEFAULT_PLUGIN_NAME = 'example';
// 插件作者
const PLUGIN_AUTHOR = 'oeyoews';

/**
 * 根据文件类型生成 meta 内容
 * @param {string} filePath 文件路径
 * @param {string} pluginName 插件名称
 * @returns {string} meta 内容
 */
function generateMetaContent(filePath, pluginName = DEFAULT_PLUGIN_NAME) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // 基本 title
  const title = `$:/plugins/${PLUGIN_AUTHOR}/${pluginName}/${fileName}`;

  // 根据扩展名确定文件类型和其他属性
  switch (ext) {
    case '.js':
      return `title: ${title}
type: application/javascript
module-type: library`;

    case '.css':
      return `title: ${title}
tags: $:/tags/Stylesheet
type: text/css`;

    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
      return `title: ${title}
type: image/${ext.substring(1)}`;

    default:
      return `title: ${title}
type: text/plain`;
  }
}

/**
 * 检查并创建 meta 文件
 * @param {string} filePath 文件路径
 * @param {string} pluginName 插件名称
 * @returns {void}
 */
export function ensureMetaFile(filePath, pluginName = DEFAULT_PLUGIN_NAME) {
  const metaPath = `${filePath}.meta`;

  // 如果 meta 文件已存在，不做任何操作
  if (fs.existsSync(metaPath)) {
    return;
  }

  // 生成 meta 内容
  const metaContent = generateMetaContent(filePath, pluginName);

  // 写入 meta 文件
  fs.writeFileSync(metaPath, metaContent, 'utf-8');
  console.log(`✅ 创建 meta 文件: ${metaPath}`);
}

/**
 * 复制文件并确保有对应的 meta 文件
 * @param {string} sourcePath 源文件路径
 * @param {string} targetPath 目标文件路径
 * @param {string} pluginName 插件名称
 * @returns {void}
 */
export function copyFileWithMeta(sourcePath, targetPath, pluginName = DEFAULT_PLUGIN_NAME) {
  if (!fs.existsSync(sourcePath)) {
    console.error(`源文件不存在: ${sourcePath}`);
    return;
  }

  // 确保目标目录存在
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 复制文件
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✅ 复制文件: ${sourcePath} -> ${targetPath}`);

  // 确保有 meta 文件
  ensureMetaFile(targetPath, pluginName);
}