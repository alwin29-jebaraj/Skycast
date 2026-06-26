import { motion } from "motion/react";
import { DailyForecastItem } from "../types";
import { WeatherTheme, formatTemp, getDayName, getWeatherTheme } from "../utils";
import WeatherIcon from "./WeatherIcon";

interface DailyForecastProps {
  daily: DailyForecastItem[];
  theme: WeatherTheme;
  isFahrenheit: boolean;
}

export default function DailyForecast({
  daily,
  theme,
  isFahrenheit,
}: DailyForecastProps) {
  // Let's find global min/max of the 7 days to draw proportional range bars!
  const allMaxes = daily.map((d) => d.maxTemp);
  const allMins = daily.map((d) => d.minTemp);
  const globalMax = Math.max(...allMaxes);
  const globalMin = Math.min(...allMins);
  const tempRange = globalMax - globalMin || 1;

  return (
    <motion.div
      id="daily-forecast-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`w-full rounded-3xl p-6 shadow-xl border ${theme.cardBg} ${theme.borderClass} ${theme.textColor} ${theme.shadowColor}`}
    >
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <WeatherIcon name="Calendar" size={18} />
        7-Day Forecast
      </h3>

      <div className="flex flex-col gap-3">
        {daily.map((day, index) => {
          const dayTheme = getWeatherTheme(day.weatherCode, true);
          const dayName = getDayName(day.date);

          // Calculate visual temperature bar percentages
          const leftPercent = ((day.minTemp - globalMin) / tempRange) * 100;
          const barWidth = ((day.maxTemp - day.minTemp) / tempRange) * 100;

          return (
            <motion.div
              key={day.date}
              id={`daily-item-${index}`}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-4"
            >
              {/* Day name */}
              <div className="w-24 flex-shrink-0">
                <span className="text-sm font-bold block">{dayName}</span>
                <span className="text-[10px] font-mono opacity-50 block">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Icon & condition name */}
              <div className="flex items-center gap-2.5 w-32 flex-shrink-0">
                <div className="p-1.5 rounded-xl bg-white/5 text-current flex-shrink-0">
                  <WeatherIcon name={dayTheme.iconName} size={20} />
                </div>
                <span className="text-xs font-semibold truncate">
                  {dayTheme.label}
                </span>
              </div>

              {/* Temperature Bar */}
              <div className="hidden sm:flex flex-grow items-center gap-3">
                <span className="text-xs font-mono opacity-60 w-8 text-right">
                  {formatTemp(day.minTemp, isFahrenheit)}
                </span>
                <div className="h-2 rounded-full bg-black/10 flex-grow relative overflow-hidden">
                  <div
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(barWidth, 5)}%`,
                    }}
                    className={`absolute h-full rounded-full bg-gradient-to-r from-blue-300 to-amber-300 opacity-90`}
                  />
                </div>
                <span className="text-xs font-mono font-bold w-8 text-left">
                  {formatTemp(day.maxTemp, isFahrenheit)}
                </span>
              </div>

              {/* Small Fallback for mobile temperatures */}
              <div className="sm:hidden flex items-center gap-2 text-xs font-mono font-bold">
                <span className="opacity-60">
                  {formatTemp(day.minTemp, isFahrenheit)}
                </span>
                <span>/</span>
                <span>{formatTemp(day.maxTemp, isFahrenheit)}</span>
              </div>

              {/* Precipitation */}
              <div className="w-16 flex items-center justify-end gap-1 text-[11px] opacity-75 font-mono">
                <WeatherIcon name="CloudRain" size={11} className="text-blue-300/80" />
                <span>{day.precipitationSum.toFixed(1)}mm</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
