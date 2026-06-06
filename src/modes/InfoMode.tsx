import { useConfigStore } from '../hooks/useConfig';

export function InfoMode() {
  const cfg = useConfigStore((s) => s.cfg);

  const forecast = [
    { name: '今天', icon: '⛅', temp: '28/19' },
    { name: '明天', icon: '🌤', temp: '30/21' },
    { name: '周四', icon: '☀️', temp: '32/22' },
    { name: '周五', icon: '🌧', temp: '25/18' },
    { name: '周六', icon: '⛅', temp: '27/19' },
  ];

  const news = [
    { tag: '科技', text: '国内大模型竞争加剧，多家厂商发布新一代基础模型' },
    { tag: '财经', text: 'A股午后震荡，沪指收涨 0.3%，科技板块领涨' },
    { tag: '国内', text: '多地迎来强降雨，气象部门发布黄色预警请注意防范' },
    { tag: '体育', text: '中超联赛第 12 轮结束，上海海港领跑积分榜' },
    { tag: '生活', text: '端午假期出行高峰预测：高铁预订量同比增长 18%' },
    { tag: '文化', text: '2026年博物馆日活动启动，超千家场馆免费开放' },
  ];

  return (
    <section className="flex flex-col overflow-y-auto overflow-x-hidden h-full">
      {/* Weather big */}
      <div className="px-3.5 py-3 border-b-2 border-black flex justify-between items-start flex-shrink-0">
        <div>
          <div
            className="text-[11px] font-bold tracking-wide mb-1"
            style={{ color: 'var(--gray)' }}
          >
            📍 {cfg.city}市
          </div>
          <div className="font-mono text-[52px] font-black leading-none">28°C</div>
          <div className="text-[12px] mt-0.5">多云转晴</div>
          <div
            className="font-mono text-[11px] mt-1"
            style={{ color: 'var(--gray)' }}
          >
            湿度 65% · 东南风 3级
          </div>
        </div>
        <div className="text-center">
          <span className="text-[40px] block">⛅</span>
          <div className="font-mono text-[11px] mt-1">H:28 L:19</div>
        </div>
      </div>

      {/* Forecast strip */}
      <div className="flex border-b-2 border-black flex-shrink-0">
        {forecast.map((f, i) => (
          <div
            key={i}
            className="flex-1 text-center py-[7px] px-0.5 text-[10px] border-r border-gray-200 last:border-0"
          >
            <div className="font-bold text-[9px] mb-[3px]">{f.name}</div>
            <div className="text-[14px] my-0.5">{f.icon}</div>
            <div className="font-mono text-[9px]">{f.temp}</div>
          </div>
        ))}
      </div>

      {/* News */}
      <div className="px-3.5 py-2.5 flex-1 overflow-y-auto">
        <div className="widget-label">今日要闻</div>
        {news.map((item, i) => (
          <div key={i} className="py-[7px] border-b border-gray-200 last:border-0">
            <div
              className="text-[8px] font-black tracking-widest inline-block border px-1 mb-[3px]"
              style={{ color: 'var(--gray)' }}
            >
              {item.tag}
            </div>
            <div className="text-[12px] leading-relaxed">{item.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
