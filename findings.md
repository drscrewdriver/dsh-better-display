# Findings

## 架构决策
- **修复层级选在 better-display 而非 tidychat**：根因是阅读视图丢失宿主行级锚点（tidychat 仓库 `docs/RAIL-BETTER-DISPLAY-ROOT-CAUSE.md` 实锤）。bd 侧补 4 个属性即恢复契约，tidychat 零改动复活；tidychat 侧的 `[data-reader-key]` 回退方案保留为后续健壮性项（防其它渲染器替换者）。
- **契约的宿主背书**：宿主 0.1.7-rc.2 原生 ChatView 仍在输出 `data-chat-anchor-key`/`data-chat-flow-kind`（`dsh-client-ui-chat/lib/client.js` 实测），且 0.1.0-rc.7 起持续存在——属长期稳定的宿主面，bd 补写不是「兼容某个插件的私有约定」。
- **上游接受度论据**：bd 自己的 `OfficialNode`（OfficialContent.tsx L59）已在写这两个属性；README 明确为皮肤类插件保留 `data-chat-flow` 钩子——同类生态兼容意识已有先例，本修复只是延伸到常规行。

## 技术选型
- **锚点值 = `nodeKey` / `node.kind`**：阅读视图的 `data-reader-key` 已携带引擎会话上下文键（公式 `${kind.length}:${kind}${id}`，如 `4:user12`、`14:assistant-step1:1:body:1`），与原生 `data-chat-anchor-key` 同源同值；kind 用节点原始 kind（user/steering/assistant-step/turn-error），与原生 `data-chat-flow-kind` 值域一致。
- **衬底 token 沿用答案泡泡的 `--dsw-alias-bg-layer-1`**：皮肤半透明层色（navy 皮肤 `#121f43e6`），fork.5 已验证其观感与宿主一致；玻璃模式 blur(12px) 同款。
- **CSS 放置策略**：新规则追加在 Reader.module.css 的 bubbles 段末尾。平铺态规则 `.reasonCard[data-overflow=false][data-expanded=false]` 特异性 (0,3,0)，与 `.root[data-reader-bubbles=on] .reasonCard` (0,3,0) 同级——同特异性靠源顺序取胜，追加在文件后部即覆盖其 background/border/radius；带平铺态属性的新规则 (0,5,0) 稳胜，不依赖顺序。

## 约束与依赖
- bd 的 CSS Module 类名（`_userCluster`、`_reasonCard` 等带 hash 前缀）不可出现在选择器——本方案只用 css module 导入的属性引用（构建期绑定）与 data-* 属性选择器，符合项目既有禁令。
- React 属性追加不参与 bd 内部任何查询（grep 核实 bd 自身不读 `data-chat-anchor-key`），纯增量、零行为风险。
- 部署目标为本机 npm 安装包的 lib/ 覆盖（link 模式等价物），`npm install` 会还原为 npm 版本——正式发布需版本 bump + publish（fork 维护者操作）。
- tidychat 本机装 0.3.3（外圈为旧 1px 实线；光晕在其 0.3.4）：锚点修复后轨即出现，光晕观感需 tidychat 发 0.3.4 后才有——两件事独立。

## 风险识别
- **kind 值域开放**（unknown 回退处 node.kind 为运行时值）：属性值原样透传，不做白名单，风险为零。
- **宿主未来改键公式**：本修复不解析键、只透传，公式变化不影响 bd；仅影响 tidychat 回退解析（其已列入后续项）。
- **半透明衬底上的文字对比度**：`--dsw-alias-bg-layer-1` 为官方答案面板同款 token，答案泡泡已验证；推理卡文字用 `--dsw-alias-label-*`，与泡泡同族，风险低。玻璃皮肤（高透明壁纸）下与答案泡泡观感一致。
- **平铺态版式**：短思考原文案「贴边紧凑」是为无衬底设计的；衬底上恢复 heading/text 内边距（新规则覆盖），已在 spec 中给出具体值，需目检确认。
