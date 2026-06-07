# 刷新机制说明

E-Ink 屏幕每次刷新都会产生闪屏和残影，因此本项目的核心设计目标是：**最小化屏幕刷新次数，天气数据必须在页面刷新前就绪**。

## 架构总览

```
┌─────────────────────────────────────────────────┐
│                   Layout.tsx                     │
│              （统一刷新调度器）                      │
│                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  天气 API │───▶│ 原始数据  │───▶│ 显示数据  │   │
│  │  (网络)   │    │ (后台更新) │    │ (触发渲染) │   │
│  └──────────┘    └──────────┘    └──────────┘   │
│       refresh()     pageRefresh()                │
│       不刷屏         刷 1 次屏                    │
└─────────────────────────────────────────────────┘
```

### 两层数据模型（useWeatherStore）

| 层级 | 字段 | 更新时机 | 是否触发屏幕刷新 |
|------|------|---------|----------------|
| **原始数据** | `now`, `hourly`, `daily`, `air` | `refresh()` API 返回时 | ❌ 不触发 |
| **显示数据** | `displayNow`, `displayHourly`, `displayDaily`, `displayAir` | `pageRefresh()` 调用时 | ✅ 触发 1 次 |

这个分离确保了：
- 天气 API 返回不会单独刷一次屏
- 只有 `pageRefresh()` 才会产生屏幕刷新
- `pageRefresh()` 将原始数据快照到显示数据，保证显示的是完整的最新状态

## 两种刷新模式

### 模式一：间隔刷新（默认）

配置项：`interval`（页面刷新间隔）、`weatherInterval`（天气拉取间隔）

```
时间线（interval=15, weatherInterval=15）:

0min ─── 初始加载 ────────────────────────────────────────
         await 天气 API → pageRefresh()
         屏幕刷新 1 次 ✅

15min ── 定时器触发 ──────────────────────────────────────
         天气已过期 → await 天气 API → pageRefresh()
         屏幕刷新 1 次 ✅

30min ── 定时器触发 ──────────────────────────────────────
         同上
```

**关键行为**：
- 使用**单个 `setInterval`** 统一调度，不是两个独立定时器
- 每次触发时先检查天气数据是否过期（基于 `lastWeatherRef` 时间戳）
- 如果天气过期：`await 天气 API → pageRefresh()`（1 次屏幕刷新）
- 如果天气未过期：直接 `pageRefresh()`（1 次屏幕刷新）
- `weatherInterval` 控制天气 API 的最小调用间隔，不是独立定时器

**典型配置组合**：

| interval | weatherInterval | 效果 |
|----------|----------------|------|
| 15min | 15min | 每 15 分钟同时更新天气和页面 |
| 15min | 60min | 每 15 分钟刷新页面，天气每小时才重新拉取 |
| 5min | 30min | 每 5 分钟刷新页面（含时间），天气 30 分钟更新一次 |
| 0 | 15min | 手动刷新页面，天气后台每 15 分钟自动拉取 |

### 模式二：整点刷新

配置项：`topHour = true`，忽略 `interval` 和 `weatherInterval`

```
时间线:

XX:59:50 ── 天气预拉取 ────────────────────────────────
            await 天气 API（最多等 10 秒）
            不刷屏

XX:00:00 ── 整点到达 ──────────────────────────────────
            pageRefresh()
            屏幕刷新 1 次 ✅

XX:59:50 ── 下一小时的天气预拉取 ───────────────────────
            ...
```

**关键行为**：
- 整点前 10 秒开始 `await` 天气 API
- 天气数据就绪后，等待整点到达再 `pageRefresh()`
- 使用 `stoppedRef` 防止组件卸载后回调继续执行

## 夜间模式

配置项：`night`（开关）、`nightStart`、`nightEnd`

- 夜间时段内：跳过所有页面刷新（不刷屏）
- 天气后台拉取仍然执行（保证天亮时有最新数据）
- 支持跨午夜时段，如 `23:00 ~ 06:00`

## 组件订阅关系

### 模式组件（BankeMode / ChenbaoMode）

```tsx
// 只订阅显示数据，不订阅原始数据
const w = useWeatherStore((s) => s.displayNow);
const hourly = useWeatherStore((s) => s.displayHourly);
const daily = useWeatherStore((s) => s.displayDaily);
const air = useWeatherStore((s) => s.displayAir);
// 订阅 refreshTick 以响应 pageRefresh()
useWeatherStore((s) => s.refreshTick);
```

**为什么这样设计**：
- 天气 API 返回时，原始数据更新但显示数据不变 → 不刷屏
- `pageRefresh()` 同时更新显示数据和 `refreshTick` → 刷 1 次屏
- 避免了"天气 API 返回刷一次 + pageRefresh 刷一次"的双刷问题

### StatusBar / BottomNav

时间显示通过 `useRef` + `setInterval` 直接操作 DOM，不触发 React 重渲染。

## 刷新次数对比（修复前 vs 修复后）

### 默认配置（interval=15, weatherInterval=15）

| 场景 | 修复前 | 修复后 |
|------|--------|--------|
| 初始加载 | 天气 API 返回刷 1 次 + 页面定时器刷 1 次 = **2 次** | await 天气 → 刷 **1 次** |
| 15 分钟周期 | 天气定时器刷 1 次 + 页面定时器天气+刷 1 次 = **2~3 次** | 天气 → 页面 **1 次** |
| 天气 API 返回时 | 原始数据变更刷 1 次 + refreshTick 刷 1 次 = **2 次** | 不触发 **0 次** |

### 极端配置（interval=5, weatherInterval=60）

| 场景 | 修复前 | 修复后 |
|------|--------|--------|
| 5 分钟周期（天气未过期） | 每次都拉天气 + 刷 2 次 = **高频 API + 双刷** | 只刷页面 **1 次**，天气不重复拉 |

## 实现细节

### 定时器生命周期

```
useEffect 依赖变更
  ├── 清理旧定时器（timersRef + stoppedRef）
  └── 创建新定时器
       ├── topHour: setTimeout 链式调度
       ├── interval > 0: setInterval + clearInterval
       └── weatherInterval > 0 (手动模式): setInterval + clearInterval
```

### `lastWeatherRef` 时间戳

- 记录上次天气 API 调用的完成时间
- `doRefresh(false)` 时检查：`Date.now() - lastWeatherRef >= weatherInterval * 60000`
- 避免在天气数据新鲜时重复调用 API

### `stoppedRef` 哨兵

- effect 清理时设为 `true`
- 嵌套的 `setTimeout` 回调开头检查此标志
- 防止组件卸载后执行过期的刷新操作
