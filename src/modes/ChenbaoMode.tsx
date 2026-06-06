import { useClock, zp } from "../hooks/useClock";
import { getLunarInfo, getLunarShort, getWeekDates } from "../hooks/useLunar";
import { useConfigStore } from "../hooks/useConfig";
import { useWeatherStore } from "../hooks/useWeather";
import { weatherIcon } from "../utils/weatherIcon";

const WEEKDAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function ChenbaoMode() {
  const { now, time, WD_FULL } = useClock();
  const cfg = useConfigStore((s) => s.cfg);
  const w = useWeatherStore((s) => s.now);
  const hourly = useWeatherStore((s) => s.hourly);
  const daily = useWeatherStore((s) => s.daily);
  const air = useWeatherStore((s) => s.air);

  const day = now.getDate();
  const lunar = getLunarInfo(now);

  // Mini calendar from real data
  const y = now.getFullYear();
  const m = now.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const WD_HEADERS = ["日", "一", "二", "三", "四", "五", "六"];

  const calCells: {
    day: number;
    other: boolean;
    isToday: boolean;
    isWeekend: boolean;
    lunarStr: string;
  }[] = [];
  let d = 1;
  let nd = 1;
  const total = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  for (let i = 0; i < total; i++) {
    let cd: number;
    let other = false;
    if (i < firstDay) {
      cd = prevDays - firstDay + i + 1;
      other = true;
    } else if (d > daysInMonth) {
      cd = nd++;
      other = true;
    } else {
      cd = d++;
    }

    const dow = i % 7;
    const isToday =
      !other &&
      now.getFullYear() === y &&
      now.getMonth() === m &&
      now.getDate() === cd;
    const isWeekend = dow === 0 || dow === 6;
    const lunarStr = !other ? getLunarShort(new Date(y, m, cd)) : "";

    calCells.push({ day: cd, other, isToday, isWeekend, lunarStr });
  }

  // Hourly: next 6 hours
  const hourlyForecast = hourly.slice(0, 6).map((h) => {
    const dt = new Date(h.fxTime);
    return {
      time: `${dt.getHours()}时`,
      icon: weatherIcon(h.icon),
      temp: `${h.temp}°`,
    };
  });

  // Forecast: skip today, show 7 days
  const forecast = daily.slice(1, 8).map((fd) => {
    const dt = new Date(fd.fxDate);
    return {
      day: WEEKDAY_NAMES[dt.getDay()],
      icon: weatherIcon(fd.iconDay),
      temp: `${fd.tempMax}°/${fd.tempMin}°`,
    };
  });

  const today = daily[0];

  return (
    <section
      className="h-full overflow-hidden"
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
      }}
    >
      {/* Main */}
      <div className="px-3.5 pt-6 flex h-full flex-col border-r border-gray-200">
        <div
          className="font-mono font-black leading-[0.85]"
          style={{
            fontSize: "clamp(80px, 28vw, 120px)",
            letterSpacing: "-4px",
          }}
        >
          {zp(day)}
        </div>
        <div className="flex items-center gap-2.5 mt-4 pt-4 border-t-2 border-black text-[20px]">
          <span className=" font-bold tracking-widest">
            {WD_FULL[now.getDay()]}
          </span>
          <span className="font-semibold tracking-wide">
            农历 {lunar.full}
            {lunar.festivals.length > 0 && ` · ${lunar.festivals.join(" ")}`}
          </span>
        </div>

        {/* Mini calendar */}
        <div className="mt-6 flex-1">
          <div className="grid grid-cols-7 border-b border-gray-200 pb-1 mb-1.5">
            {WD_HEADERS.map((h, i) => (
              <div key={i} className="text-center text-[13px] font-bold">
                {h}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calCells.map((cell, i) => (
              <div
                key={i}
                className="text-center py-1 flex flex-col items-center"
              >
                <span
                  className={`font-mono text-[16px] font-bold ${
                    cell.isToday
                      ? "bg-black text-white w-[28px] h-[28px] rounded-full flex items-center justify-center"
                      : cell.other
                        ? "text-gray-600"
                        : ""
                  }`}
                >
                  {cell.day}
                </span>
                <span className="text-[9px] font-semibold mt-px">
                  {cell.lunarStr}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col px-2.5 py-2.5 gap-0 overflow-y-auto">
        {/* Weather */}
        <div className="py-2.5 border-b border-gray-200">
          <div className="text-[11px] font-black tracking-widest uppercase mb-1.5">
            天气
          </div>
          <div className="flex items-end gap-1.5 mb-1">
            <span className="text-[30px] leading-none">
              {w ? weatherIcon(w.icon) : "⛅"}
            </span>
            <span className="font-mono text-[44px] font-bold leading-none">
              {w?.temp ?? "--"}°
            </span>
          </div>
          <div className="text-[13px] font-semibold leading-relaxed">
            {w && `体感 ${w.feelsLike}°`}
            {today && `  ${today.tempMax}°/${today.tempMin}°`}
            <br />
            {cfg.city} · {w?.text ?? "加载中"}
            <br />
            {w && `湿度 ${w.humidity}% · ${w.windDir} ${w.windScale}级`}
            <br />
            {air && `空气 ${air.category}`}
            {today && `  日出${today.sunrise} 日落${today.sunset}`}
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="py-2.5 border-b border-gray-200">
          <div className="text-[11px] font-black tracking-widest uppercase mb-1.5">
            小时预报
          </div>
          <div className="flex flex-col gap-1">
            {hourlyForecast.length > 0
              ? hourlyForecast.map((h, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[13px]"
                  >
                    <span className="font-bold tracking-wide">{h.time}</span>
                    <span className="text-[16px]">{h.icon}</span>
                    <span className="font-mono text-[13px] font-bold">
                      {h.temp}
                    </span>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[13px]"
                  >
                    <span className="font-bold">—</span>
                    <span>❓</span>
                    <span className="font-mono text-[13px] font-bold">--°</span>
                  </div>
                ))}
          </div>
        </div>

        {/* Forecast */}
        <div className="py-2.5">
          <div className="text-[11px] font-black tracking-widest uppercase mb-1.5">
            未来预报
          </div>
          <div className="flex flex-col gap-1">
            {forecast.length > 0
              ? forecast.map((f, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[13px]"
                  >
                    <span className="font-bold tracking-wide">{f.day}</span>
                    <span className="text-[16px]">{f.icon}</span>
                    <span className="font-mono text-[13px] font-bold">
                      {f.temp}
                    </span>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[13px]"
                  >
                    <span className="font-bold">—</span>
                    <span>❓</span>
                    <span className="font-mono text-[13px] font-bold">
                      --/--
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
