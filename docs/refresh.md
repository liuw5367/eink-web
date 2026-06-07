# 刷新机制说明

E-Ink 屏幕每次刷新都会产生闪屏和残影，因此本项目的核心设计目标是：**最小化屏幕刷新次数，两种刷新独立运行、互不干扰**。

## 架构总览

```
┌─────────────────────────────────────────────────┐
│                   Layout.tsx                     │
│              （独立定时器调度）                      │
│                                                  │
│  天气定时器 ──▶ doWeatherRefresh() ──▶ refresh() │
│               (weatherInterval)       刷 1 次屏 ✅│
│                                                  │
│  页面定时器 ──▶ doPageRefresh()   ──▶ pageRefresh()│
│               (interval)             刷 1 次屏 ✅│
│                                                  │
│  两个定时器独立运行，互不干扰                        │
└─────────────────────────────────────────────────┘
```

### 数据模型（useWeatherStore）

只有一层数据：`now`, `hourly`, `daily`, `air`。

- `refresh()` 从 API 拉取数据后写入 store → 触发 re-render → 屏幕刷新
- `pageRefresh()` 递增 `refreshTick` → 触发 re-render → 屏幕刷新（用于时间更新）

两者都触发屏幕刷新，但各自独立：天气刷新更新数据，页面刷新更新时间。

## 两种刷新模式

### 模式一：间隔刷新（默认）

配置项：`interval`（页面刷新间隔）、`weatherInterval`（天气拉取间隔）

```
时间线（interval=5, weatherInterval=15）:

0min ─── 初始加载 ────────────────────────────────────────
         await 天气 API → pageRefresh()
         屏幕刷新 1 次 ✅

5min ──── 页面定时器触发 ─────────────────────────────────
         pageRefresh() → 刷 1 次屏 ✅（时间更新）

10min ─── 页面定时器触发 ─────────────────────────────────
         pageRefresh() → 刷 1 次屏 ✅（时间更新）

15min ─── 两个定时器同时触发 ─────────────────────────────
         天气定时器: refresh() → 刷 1 次屏 ✅（数据+时间更新）
         页面定时器: pageRefresh() → 刷 1 次屏 ✅（时间更新）
         注: 两次刷新间隔很短，e-ink 上看起来像 1 次

20min ─── 页面定时器触发 ─────────────────────────────────
         pageRefresh() → 刷 1 次屏 ✅（时间更新）
```

**关键行为**：
- 两个 `setInterval` **完全独立**，互不干扰
- 天气定时器调用 `doWeatherRefresh()` → `refresh()` 更新数据并触发 re-render
- 页面定时器调用 `doPageRefresh()` → `pageRefresh()` 触发 re-render（时间更新）
- 两者不共享状态，不互相等待

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

- 夜间时段内：跳过所有刷新（不刷屏）
- 支持跨午夜时段，如 `23:00 ~ 06:00`

## 组件订阅关系

### 模式组件（BankeMode / ChenbaoMode）

```tsx
const w = useWeatherStore((s) => s.now);
const hourly = useWeatherStore((s) => s.hourly);
const daily = useWeatherStore((s) => s.daily);
const air = useWeatherStore((s) => s.air);
useWeatherStore((s) => s.refreshTick);
```

- `refresh()` 更新 `now/hourly/daily/air` → 组件 re-render
- `pageRefresh()` 更新 `refreshTick` → 组件 re-render（时间随之更新）

### StatusBar / BottomNav

时间显示通过 `useRef` + `setInterval` 直接操作 DOM，不触发 React 重渲染。

## 实现细节

### 定时器生命周期

```
useEffect 依赖变更
  ├── 清理旧定时器（timersRef + stoppedRef）
  └── 创建新定时器
       ├── topHour: setTimeout 链式调度
       ├── interval > 0: setInterval（页面）
       └── weatherInterval > 0: setInterval（天气）
```

### `stoppedRef` 哨兵

- effect 清理时设为 `true`
- 嵌套的 `setTimeout` 回调开头检查此标志
- 防止组件卸载后执行过期的刷新操作
