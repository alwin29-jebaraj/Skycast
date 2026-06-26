import { motion } from "motion/react";
import { CurrentWeather, CityDetails } from "../types";
import { WeatherTheme, formatTemp, formatWindSpeed, formatDateTime } from "../utils";
import WeatherIcon from "./WeatherIcon";

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  city: CityDetails;
  theme: WeatherTheme;
  isFahrenheit: boolean;
  isMph: boolean;
}

export default function CurrentWeatherCard({
  current,
  city,
  theme,
  isFahrenheit,
  isMph,
}: CurrentWeatherCardProps) {
  // Stats grid config
  const stats = [
    {
      id: "feels-like",
      label: "Feels Like",
      value: formatTemp(current.apparentTemperature, isFahrenheit),
      icon: "Thermometer",
    },
    {
      id: "humidity",
      label: "Humidity",
      value: `${current.relativeHumidity}%`,
      icon: "Droplets",
    },
    {
      id: "wind",
      label: "Wind Speed",
      value: formatWindSpeed(current.windSpeed, isMph),
      icon: "Wind",
      subValue: `Direction: ${current.windDirection}°`,
    },
    {
      id: "pressure",
      label: "Pressure",
      value: `${Math.round(current.pressure)} hPa`,
      icon: "Gauge",
    },
    {
      id: "precipitation",
      label: "Precipitation",
      value: `${current.precipitation} mm`,
      icon: "CloudRain",
    },
    {
      id: "uv-index",
      label: "UV Index",
      value: `${current.uvIndex}`,
      icon: "Sun",
    },
    {
      id: "sunrise",
      label: "Sunrise",
      value: formatDateTime(current.sunrise, city.timezone),
      icon: "Sunrise",
    },
    {
      id: "sunset",
      label: "Sunset",
      value: formatDateTime(current.sunset, city.timezone),
      icon: "Sunset",
    },
  ];

  return (
    <motion.div
      id="current-weather-card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full rounded-3xl p-6 md:p-8 shadow-xl border ${theme.cardBg} ${theme.borderClass} ${theme.textColor} ${theme.shadowColor}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Hero Section */}
        <div id="weather-hero-section" className="lg:col-span-2 flex flex-col justify-between border-b lg:border-b-0 lg:border-r pb-6 lg:pb-0 lg:pr-8 border-current/10">
          <div>
            <div className="flex items-center gap-2">
              <WeatherIcon name="MapPin" className="text-current/70 animate-bounce" size={20} />
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {city.name}
              </h2>
            </div>
            {city.admin1 && (
              <p className={`text-sm mt-1 font-medium ${theme.textMuted}`}>
                {city.admin1}, {city.country}
              </p>
            )}
            {!city.admin1 && (
              <p className={`text-sm mt-1 font-medium ${theme.textMuted}`}>
                {city.country}
              </p>
            )}
          </div>

          <div className="my-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-6xl md:text-7xl font-bold tracking-tighter">
                {formatTemp(current.temperature, isFahrenheit)}
              </span>
              <span className="text-lg font-semibold mt-1 flex items-center gap-1.5 capitalize">
                {theme.label}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10">
              <WeatherIcon name={theme.iconName} className="text-current w-16 h-16 md:w-20 md:h-20 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className={theme.textMuted}>
              Local Time: {formatDateTime(new Date().toISOString(), city.timezone)}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${theme.accentBg}`}>
              {current.isDay ? "Day" : "Night"}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div id="weather-stats-grid" className="lg:col-span-3 flex flex-col justify-center">
          <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 opacity-80">
            Weather Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.id}
                id={`stat-card-${stat.id}`}
                whileHover={{ scale: 1.03 }}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium opacity-70`}>
                    {stat.label}
                  </span>
                  <WeatherIcon name={stat.icon} className="opacity-60" size={16} />
                </div>
                <div>
                  <div className="text-lg font-bold">{stat.value}</div>
                  {stat.subValue && (
                    <div className="text-[10px] font-mono opacity-65 truncate mt-0.5">
                      {stat.subValue}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
