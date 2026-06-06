import { useConfigStore } from '../hooks/useConfig';
import { useWeatherStore } from '../hooks/useWeather';
import { getLunarInfo } from '../hooks/useLunar';
import { weatherIcon } from '../utils/weatherIcon';
import { useClock } from '../hooks/useClock';

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function InfoMode() {
  const cfg = useConfigStore((s) => s.cfg);
  const w = useWeatherStore((s) => s.now);
  const daily = useWeatherStore((s) => s.daily);
  const hourly = useWeatherStore((s) => s.hourly);
  const air = useWeatherStore((s) => s.air);
  const { now } = useClock();

  const today = daily[0];
  const nowHour = now.getHours();

  const forecast5 = daily.slice(0, 5).map((d, i) => {
    const dt = new Date(d.fxDate);
    const name = i === 0 ? '今天' : i === 1 ? '明天' : WEEKDAY_NAMES[dt.getDay()];
    return {
      name,
      icon: weatherIcon(d.iconDay),
      temp: `${d.tempMax}/${d.tempMin}`,
    };
  });

  // News (placeholder)
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
          <div className="font-mono text-[52px] font-black leading-none">
            {w?.temp ?? '--'}°C
          </div>
          <div className="text-[12px] mt-0.5">{w?.text ?? '加载中…'}</div>
          <div className="font-mono text-[11px] mt-1" style={{ color: 'var(--gray)' }}>
            {w && `湿度 ${w.humidity}% · ${w.windDir} ${w.windScale}级`}
            {air && ` · AQI ${air.aqi} ${air.category}`}
          </div>
        </div>
        <div className="text-center">
          <span className="text-[40px] block">{w ? weatherIcon(w.icon) : '⛅'}</span>
          {today && (
            <div className="font-mono text-[11px] mt-1">
              H:{today.tempMax} L:{today.tempMin}
            </div>
          )}
        </div>
      </div>

      {/* Sunrise/sunset + UV + precip */}
      {today && (
        <div
          className="flex gap-2.5 px-3.5 py-1.5 text-[10px] border-b-2 border-black flex-wrap flex-shrink-0"
          style={{ color: 'var(--gray)' }}
        >
          <span>🌅 {today.sunrise}</span>
          <span>🌇 {today.sunset}</span>
          <span>紫外线 {today.uvIndex}</span>
          <span>降水 {today.precip}mm</span>
        </div>
      )}

      {/* Hourly forecast strip */}
      {hourly.length > 0 && (
        <div className="flex border-b-2 border-black flex-shrink-0 overflow-x-auto">
          {hourly
            .filter((h) => new Date(h.fxTime).getHours() >= nowHour)
            .slice(0, 8)
            .map((h, i) => {
              const hr = new Date(h.fxTime).getHours();
              return (
                <div
                  key={i}
                  className="flex-1 text-center py-[7px] px-0.5 text-[10px] border-r border-gray-200 last:border-0 min-w-[48px]"
                >
                  <div className="font-mono text-[9px]" style={{ color: 'var(--gray)' }}>
                    {hr}:00
                  </div>
                  <div className="text-[14px] my-0.5">{weatherIcon(h.icon)}</div>
                  <div className="font-mono text-[9px]">{h.temp}°</div>
                  <div className="text-[8px]" style={{ color: 'var(--light-gray)' }}>
                    {h.pop}%
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 7-day forecast strip */}
      <div className="flex border-b-2 border-black flex-shrink-0">
        {forecast5.map((f, i) => (
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

      {/* Air quality */}
      {air && (
        <div className="px-3.5 py-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="font-bold">空气质量</span>
            <span className="font-mono font-bold text-[14px]">{air.aqi}</span>
            <span style={{ color: 'var(--gray)' }}>{air.category}</span>
            <span className="text-[10px]" style={{ color: 'var(--light-gray)' }}>
              PM2.5: {air.pm2p5} · PM10: {air.pm10}
            </span>
          </div>
        </div>
      )}

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
