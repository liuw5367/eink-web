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
  const hourlyForecast = hourly.slice(0, 24).map((h) => {
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
      <div className="px-3.5 pt-6 flex h-full flex-col border-r border-black ">
        <div className="flex justify-between">
          <div
            className="font-mono font-black leading-[0.85]"
            style={{
              fontSize: "clamp(80px, 28vw, 120px)",
              letterSpacing: "-4px",
            }}
          >
            {zp(day)}
          </div>
          <div
            className="flex items-center gap-2.5 mt-4 pt-4 font-bold"
            style={{ fontSize: "var(--text-md)" }}
          >
            <span className="tracking-widest">{WD_FULL[now.getDay()]}</span>
            <span className="tracking-wide">
              {lunar.full}
              {lunar.festivals.length > 0 && ` · ${lunar.festivals.join(" ")}`}
            </span>
          </div>
        </div>

        <div className="mt-3 h-[3px] bg-black " />
        <div className="flex-1" />

        {/* Mini calendar */}
        <div className="mt-6 flex-1">
          <div className="grid grid-cols-7 border-b border-black pb-1 mb-1.5">
            {WD_HEADERS.map((h, i) => (
              <div
                key={i}
                className="text-center font-bold"
                style={{ fontSize: "var(--text-base)" }}
              >
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
                  className={`font-mono font-bold ${
                    cell.isToday
                      ? "bg-black text-white w-[28px] h-[28px] rounded-full flex items-center justify-center"
                      : cell.other
                        ? "text-gray-600"
                        : ""
                  }`}
                  style={{ fontSize: "var(--text-md)" }}
                >
                  {cell.day}
                </span>
                <span
                  className="font-semibold mt-px"
                  style={{ fontSize: "var(--text-xs)" }}
                >
                  {cell.lunarStr}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />
        <div className="flex-1" />

        {/* Forecast - horizontal */}
        <div className="mt-3 mb-4 flex gap-1">
          {forecast.length > 0
            ? forecast.map((f, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-0.5"
                >
                  <span
                    className="font-bold tracking-wide"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {f.day}
                  </span>
                  <span style={{ fontSize: "var(--text-md)" }}>{f.icon}</span>
                  <span
                    className="font-mono font-bold"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {f.temp}
                  </span>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-0.5"
                >
                  <span
                    className="font-bold"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    —
                  </span>
                  <span>❓</span>
                  <span
                    className="font-mono font-bold"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    --/--
                  </span>
                </div>
              ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col px-2.5 py-2.5 gap-0 overflow-y-auto">
        {/* Weather */}
        <div className="py-2.5 border-b border-black">
          <div className="flex justify-center items-center gap-3 mb-1">
            <span
              className="leading-none"
              style={{ fontSize: "var(--text-xl)" }}
            >
              {w ? weatherIcon(w.icon) : "⛅"}
            </span>
            <span
              className="font-mono font-bold leading-none"
              style={{ fontSize: "var(--text-xl)" }}
            >
              {w?.temp ?? "--"}°
            </span>
          </div>
          <div
            className="font-semibold leading-relaxed"
            style={{ fontSize: "var(--text-base)" }}
          >
            {w?.text ?? "加载中"}
            {today && ` · ${today.tempMax}°/${today.tempMin}°`}
            <br />
            {w && `🌡️ ${w.feelsLike}° · 💧 ${w.humidity}%`}
            <br />
            {air && `🌫️ ${air.category}`}
            {w && ` 💨 ${w.windDir} ${w.windScale}级`}
            <br />
            {today && `  🌅 ${today.sunrise} 🌇 ${today.sunset}`}
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="py-2.5">
          <div
            className="font-black tracking-widest uppercase mb-1.5"
            style={{ fontSize: "var(--text-sm)" }}
          >
            小时预报
          </div>
          <div className="flex flex-col gap-1">
            {hourlyForecast.length > 0
              ? hourlyForecast.map((h, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    <span className="font-bold tracking-wide">{h.time}</span>
                    <span style={{ fontSize: "var(--text-md)" }}>{h.icon}</span>
                    <span className="font-mono font-bold">{h.temp}</span>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center"
                    style={{ fontSize: "var(--text-base)" }}
                  >
                    <span className="font-bold">—</span>
                    <span>❓</span>
                    <span className="font-mono font-bold">--°</span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
