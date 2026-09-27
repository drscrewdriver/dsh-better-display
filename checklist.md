# Checklist

## Must Pass
- [ ] `npm run typecheck` 零错误；`npm run build` 通过（含 check-harness-compat）
- [ ] 硬刷新后，tidychat 探针：`document.querySelectorAll('[data-chat-anchor-key]').length > 0`（阅读视图下行行有锚点）
- [ ] tidychat 消息轨出现：`.tidychat-nav-canvas` 在 DOM，圆点数 = 用户行数（user+steering）
- [ ] 悬停摘要、点击跳转、滚动当前轮高亮正常（重点：末尾插队消息会话尾部圆点不失效）
- [ ] 推理思考卡半透明衬底：展开态、折叠/短文本平铺态均有 `--dsw-alias-bg-layer-1` 衬底，圆角 16px
- [ ] 平铺态版式：衬底上标题/正文内边距正常（不贴边、不双重缩进）
- [ ] 答案泡泡观感不变（回归）；`data-reader-bubbles=off` 时推理卡恢复原平铺/不透明行为
- [ ] 官方轨仍被 tidychat 接管隐藏（`data-tidychat-hide-official-nav` 生效，官方标记可见数 = 0）
- [ ] bd 自身功能回归：自动折叠、过程展开、跟随思考、最终回答、交付物行均正常

## Should Pass
- [ ] `npm run test:official` / `npm run test:auto-fold` 通过
- [ ] 玻璃模式（frosted glass）下推理卡与答案泡泡同为半透明 + blur，皮肤壁纸可透出
- [ ] tidychat 外圈在横线/圆点两样式下可见（本机 0.3.3 为 1px 实线，光晕待 tidychat 0.3.4）
- [ ] 性能无回退：长会话滚动流畅（衬底为静态背景，理论无影响）
