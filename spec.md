# Spec: 阅读视图锚点契约修复 + 推理思考半透明衬底

## 需求
- R1 阅读视图渲染的行级节点补回宿主 ChatView 锚点契约（`data-chat-anchor-key` + `data-chat-flow-kind`），使 dsh-tidychat 等以该契约为 DOM 事实源的生态插件在阅读视图下恢复正常（消息轨静默失效的根因修复，见 tidychat 仓库 `docs/RAIL-BETTER-DISPLAY-ROOT-CAUSE.md`）。
- R2 推理思考卡（含折叠/短文本平铺态）获得与答案泡泡同款的半透明衬底（`--dsw-alias-bg-layer-1`），跟随现有「消息气泡」开关（`data-reader-bubbles`）；玻璃模式（`data-reader-glass`）同答案泡泡加 frosted blur。
- R3 构建（`npm run build`）并把产物部署到本机运行中的 DSH profile（覆盖前备份），浏览器实测验证。
- R4 产出向上一游 `aa2246740/dsh-better-display` 提 issue 的素材（放在答复中，不落盘）。
- R5 变更记录进 CHANGELOG（Unreleased）。

## 技术方案
### R1 锚点契约（`src/client/Reader.tsx`，4 处单行属性追加）
| 位置 | 元素 | 追加属性 |
|---|---|---|
| `AssistantNode` L175 | `article.answer` | `data-chat-anchor-key={nodeKey} data-chat-flow-kind={node.kind}`（kind='assistant-step'） |
| `MainNode` L201 | `div.userCluster`（user/steering） | 同上（kind='user'/'steering'）——tidychat 消息轨的关键行 |
| `MainNode` L214 | `div.error`（turn-error） | 同上（kind='turn-turn-error' 实际 node.kind='turn-error'） |
| `MainNode` L250 | `div.unknown` 回退 | 同上（node.kind 为运行时开放值域） |
不新增/修改任何逻辑；`OfficialNode`（OfficialContent.tsx L59）已有同款写法作先例。pending submission（L847）与原生行为对齐：不带锚点（无已落账键）。

### R2 推理衬底（`src/client/Reader.module.css`，bubbles 段末尾追加）
```css
.root[data-reader-bubbles=on] .reasonCard {
  box-sizing: border-box;
  background: var(--dsw-alias-bg-layer-1, rgba(127, 127, 127, .08));
  border-color: var(--dsw-alias-border-l2, rgba(128, 128, 128, .22));
  border-radius: 16px;
}
.root[data-reader-bubbles=on][data-reader-glass] .reasonCard {
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
}
/* 平铺态（短文本/收起）原规则清零了内边距与圆角：在衬底上恢复，
   特异性 (0,5,0) > 平铺规则 (0,3,0)，不依赖文件顺序 */
.root[data-reader-bubbles=on] .reasonCard[data-overflow=false][data-expanded=false] { padding-bottom: 10px; }
.root[data-reader-bubbles=on] .reasonCard[data-overflow=false][data-expanded=false] .reasonHeading { padding: 10px 16px 0; }
.root[data-reader-bubbles=on] .reasonCard[data-overflow=false][data-expanded=false] .reasonText { padding: 8px 16px 0; }
```
CSS 经 tsdown 打进 `lib/client.js`，无独立产物。

### R3 部署
`npm run typecheck && npm run build` → 备份 `~/.dsh/profiles/web/node_modules/@drscrewdriver/dsh-better-display/lib/` → 覆盖 `lib/client.js`、`lib/dsh-better-display.js`（及 .map）。变更全在 client 半，浏览器硬刷新（Ctrl+Shift+R）生效；若宿主缓存 client bundle 则重开 host。

## 决策记录
| 选项 | 选择 | 理由 |
|---|---|---|
| 双插件修复 vs 合并项目 | 双插件修复 | 契约属宿主且长期稳定（0.1.0-rc.7→0.1.7），修复惠及全体生态插件；保留两个上游的 rc 适配红利；本修复也是将来合并项目的前置子集，代码可整体迁移 |
| 衬底跟随「消息气泡」开关 vs 独立开关 | 跟随 bubbles | 同一视觉家族，单一开关可整体退出；避免设置项膨胀（YAGNI） |
| 锚点值来源 | `nodeKey` / `node.kind` | 与 `OfficialNode` 的 `data-chat-anchor-key={node.key}` 同源同值（引擎会话上下文键），非自造格式 |
| 属性追加 vs 结构重构 | 仅追加属性 | 最小侵入，上游接受成本最低；无行为变化风险 |
| 平铺态内边距 | 新规则覆盖而非删旧规则 | 旧平铺规则在 bubbles=off 时仍是正确行为； bubbles=on 才需要衬底上的内边距 |

## 约束
- 禁止硬编码 bd 的 CSS Module hash 类名（`_userCluster` 等随构建变化）——本方案全部用语义属性/结构类，符合。
- 锚点属性必须原样携带引擎键，不做任何改写（engine-owned 面，改写即引入静默失效）。
- 覆盖式部署会在下次 `npm install` 时被 npm 版本还原——属预期，正式发布走版本 bump + npm publish（用户执行）。
- 本轮不改 tidychat 侧代码（其回退方案已记录在根因文档 §5，作为 bd 关闭时的健壮性后续项）。
