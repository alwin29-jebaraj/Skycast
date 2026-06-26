import { motion } from "motion/react";
import { HourlyForecastItem } from "../types";
import { WeatherTheme, formatTemp, formatDateTime, getWeatherTheme } from "../utils";
import WeatherIcon from "./WeatherIcon";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  timezone: string;
  theme: WeatherTheme;
  isFahrenheit: boolean;
}

export default function HourlyForecast({
  hourly,
  timezone,
  theme,
  isFahrenheit,
}: HourlyForecastProps) {
  // Take only the first 24 hours
  const displayHourly = hourly.slice(0, 24);

  return (
    <motion.div
      id="hourly-forecast-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`w-full rounded-3xl p-6 shadow-xl border ${theme.cardBg} ${theme.borderClass} ${theme.textColor} ${theme.shadowColor}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <WeatherIcon name="Clock" size={18} />
          Hourly Forecast (24h)
        </h3>
        <span className="text-xs font-mono opacity-70">
          Scroll horizontally →
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {displayHourly.map((item, index) => {
          const isCurrentHour = index === 0;
          const hourTheme = getWeatherTheme(item.weatherCode, true); // default to day icons for simple list
          const formattedHour = formatDateTime(item.time, timezone).split(",")[0]; // Just the time part

          return (
            <motion.div
              key={item.time}
              id={`hourly-item-${index}`}
              whileHover={{ y: -4 }}
              className={`flex-shrink-0 w-24 rounded-2xl p-3 flex flex-col items-center justify-between text-center border transition-colors ${
                isCurrentHour
                  ? "bg-white/15 border-white/40 shadow-md"
                  : "bg-white/5 border-white/5 hover:bg-white/10"
              }`}
            >
              <span className="text-[10px] font-mono tracking-wider uppercase opacity-60">
                {isCurrentHour ? "Now" : formattedHour}
              </span>

              <div className="my-2.5 p-1.5 rounded-xl bg-white/5">
                <WeatherIcon
                  name={hourTheme.iconName}
                  className="text-current"
                  size={24}
                />
              </div>

              <span className="text-sm font-bold">
                {formatTemp(item.temperature, isFahrenheit)}
              </span>

              <div className="flex items-center gap-1 mt-1 text-[10px] opacity-70">
                <WeatherIcon name="Droplets" size={10} />
                <span>{item.humidity}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
