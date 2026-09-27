# Tasks

## Phase 1: 代码改动（src/client）
- [ ] task_1: `src/client/Reader.tsx` L175 answer article 追加 `data-chat-anchor-key={nodeKey} data-chat-flow-kind={node.kind}`
- [ ] task_2: `src/client/Reader.tsx` L201 userCluster（user/steering）追加同款两属性
- [ ] task_3: `src/client/Reader.tsx` L214 turn-error、L250 unknown 回退追加同款两属性
- [ ] task_4: `src/client/Reader.module.css` bubbles 段末尾追加 reasonCard 半透明衬底规则（含 glass 变体与平铺态内边距恢复，见 spec §R2）

## Phase 2: 记录与构建
- [ ] task_5: CHANGELOG.md Unreleased 增补两条（锚点契约恢复 / 推理衬底）
- [ ] task_6: `npm run typecheck` → 零错误
- [ ] task_7: `npm run build` → 通过（产物 lib/client.js、lib/dsh-better-display.js）

## Phase 3: 部署（可逆）
- [ ] task_8: 备份 `~/.dsh/profiles/web/node_modules/@drscrewdriver/dsh-better-display/lib/` 至 `lib.backup-fork5/`
- [ ] task_9: 覆盖部署新 lib 至该目录；浏览器 Ctrl+Shift+R 硬刷新

## Phase 4: 验证（checklist.md Must Pass 逐项）
- [ ] task_10: 浏览器探针验证锚点/轨/接管三链路（对照 checklist）
- [ ] task_11: 目检推理衬底（展开/折叠/短文本三态 × 明暗主题）与答案泡泡回归
- [ ] task_12: bd 自身回归（折叠/跟随/回答/交付物）

## Phase 5: 收尾
- [ ] task_13: 更新 tidychat 仓库根因文档 §5 状态（bd 侧已修，tidychat 回退转为后续健壮性项）
- [ ] task_14: 产出上游 issue 素材（答复中给出，不落盘）；变更留待用户确认后 commit
