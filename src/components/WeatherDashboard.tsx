import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { CityDetails, WeatherData } from "../types";
import { getWeatherTheme, POPULAR_CITIES, formatDateTime } from "../utils";
import CurrentWeatherCard from "./CurrentWeatherCard";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import WeatherIcon from "./WeatherIcon";

export default function WeatherDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState<CityDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unit settings state
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isMph, setIsMph] = useState(false);

  // Load a default city on mount
  useEffect(() => {
    // We will load New York as our initial fallback city
    const initialCity = POPULAR_CITIES[0];
    fetchWeatherData(initialCity);
  }, []);

  const fetchWeatherData = async (city: CityDetails) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=${encodeURIComponent(city.timezone)}`;
      const response = await axios.get(url);
      const data = response.data;

      const mapped: WeatherData = {
        city,
        current: {
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          relativeHumidity: data.current.relative_humidity_2m,
          isDay: data.current.is_day === 1,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          pressure: data.current.pressure_msl,
          uvIndex: data.daily.uv_index_max[0] ?? 0,
          sunrise: data.daily.sunrise[0] ?? "",
          sunset: data.daily.sunset[0] ?? "",
        },
        hourly: data.hourly.time.map((t: string, idx: number) => ({
          time: t,
          temperature: data.hourly.temperature_2m[idx],
          weatherCode: data.hourly.weather_code[idx],
          humidity: data.hourly.relative_humidity_2m[idx],
          windSpeed: data.hourly.wind_speed_10m[idx],
        })),
        daily: data.daily.time.map((d: string, idx: number) => ({
          date: d,
          maxTemp: data.daily.temperature_2m_max[idx],
          minTemp: data.daily.temperature_2m_min[idx],
          weatherCode: data.daily.weather_code[idx],
          precipitationSum: data.daily.precipitation_sum[idx],
        })),
      };

      setWeatherData(mapped);
    } catch (err: any) {
      console.error("Error fetching weather details:", err);
      setError("Failed to fetch weather data from server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery.trim())}&count=5&language=en&format=json`;
      const response = await axios.get(geoUrl);

      if (!response.data.results || response.data.results.length === 0) {
        setError(`Could not find any results for "${searchQuery}". Check the spelling and try again.`);
        setIsLoading(false);
        return;
      }

      const results: CityDetails[] = response.data.results.map((res: any) => ({
        name: res.name,
        country: res.country,
        admin1: res.admin1,
        timezone: res.timezone,
        latitude: res.latitude,
        longitude: res.longitude,
        countryCode: res.country_code,
      }));

      // Set suggestions
      setSuggestions(results);
      // Select first match by default
      fetchWeatherData(results[0]);
    } catch (err: any) {
      console.error("Error finding coordinates:", err);
      setError("Unable to contact the location service. Please check your internet connection.");
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (city: CityDetails) => {
    fetchWeatherData(city);
    // Keep suggestions open or close them? Let's just clear suggestions to make UI tidy!
    setSuggestions([]);
    setSearchQuery("");
  };

  // Get current weather theme (default to sunny if loading/no data yet)
  const theme = weatherData
    ? getWeatherTheme(weatherData.current.weatherCode, weatherData.current.isDay)
    : getWeatherTheme(0, true);

  // Dynamic luxury dark radial gradients matching the Sleek Interface mockup
  const getRadialBg = () => {
    if (theme.label.includes("Sunny") || theme.label.includes("Clear")) {
      return "radial-gradient(circle at top right, #271e12 0%, #020510 100%)";
    }
    if (theme.label.includes("Rain") || theme.label.includes("Drizzle")) {
      return "radial-gradient(circle at top right, #11213c 0%, #020510 100%)";
    }
    if (theme.label.includes("Snow")) {
      return "radial-gradient(circle at top right, #132a3c 0%, #020510 100%)";
    }
    if (theme.label.includes("Thunder") || theme.label.includes("Storm")) {
      return "radial-gradient(circle at top right, #20133c 0%, #020510 100%)";
    }
    return "radial-gradient(circle at top right, #1e293b 0%, #020617 100%)";
  };

  return (
    <div
      id="main-app-container"
      className="min-h-screen text-slate-100 font-sans p-6 md:p-8 flex flex-col items-center justify-start transition-all duration-1000 ease-in-out w-full"
      style={{
        background: getRadialBg(),
      }}
    >
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Header / Brand & Settings */}
        <header id="app-header" className="flex flex-col md:flex-row items-center justify-between gap-6 w-full border-b border-slate-800/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white flex-shrink-0">
              <WeatherIcon name="CloudSun" className="text-white animate-pulse" size={24} />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                SkyCast<span className="text-indigo-400 font-extrabold">.</span>
              </span>
              <p className="text-[10px] font-bold font-mono tracking-widest text-slate-500 uppercase">
                REAL-TIME ATMOSPHERIC METRICS
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
            {weatherData && (
              <div className="text-xs text-slate-400 font-semibold tracking-wide font-mono bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800/60">
                {formatDateTime(new Date().toISOString(), weatherData.city.timezone, true)}
              </div>
            )}

            {/* Metric Switches */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex rounded-xl p-1 shadow-inner bg-slate-900/60 border border-slate-800/80">
                <button
                  id="unit-c-btn"
                  onClick={() => setIsFahrenheit(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !isFahrenheit
                      ? "text-white bg-indigo-500 shadow-md shadow-indigo-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  °C
                </button>
                <button
                  id="unit-f-btn"
                  onClick={() => setIsFahrenheit(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isFahrenheit
                      ? "text-white bg-indigo-500 shadow-md shadow-indigo-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  °F
                </button>
              </div>

              <div className="flex rounded-xl p-1 shadow-inner bg-slate-900/60 border border-slate-800/80">
                <button
                  id="unit-kmh-btn"
                  onClick={() => setIsMph(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !isMph
                      ? "text-white bg-indigo-500 shadow-md shadow-indigo-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  km/h
                </button>
                <button
                  id="unit-mph-btn"
                  onClick={() => setIsMph(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isMph
                      ? "text-white bg-indigo-500 shadow-md shadow-indigo-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  mph
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Search Form conforming to Sleek Interface */}
        <section id="search-section" className="w-full flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative w-full">
              <input
                id="city-search-input"
                type="text"
                placeholder="Search for a city (e.g. New York, London)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800/80 rounded-2xl py-4.5 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-100 placeholder-slate-400 backdrop-blur-xl transition-all shadow-xl"
              />
              <WeatherIcon
                name="Search"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <button
                id="search-btn"
                type="submit"
                disabled={isLoading}
                className="absolute right-2.5 top-2.5 bottom-2.5 px-6 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading && <WeatherIcon name="RefreshCw" className="animate-spin text-white" size={14} />}
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Popular Cities Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-mono uppercase tracking-wider text-[10px] mr-1">Popular Cities:</span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.name}
                id={`popular-city-btn-${c.name}`}
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                  fetchWeatherData(c);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  weatherData?.city.name === c.name
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                    : "bg-slate-900/30 text-slate-300 border-slate-800 hover:bg-slate-800/60"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                id="search-suggestions-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border p-2 shadow-2xl bg-slate-950/90 border-slate-800 text-slate-100 mt-1 max-w-2xl mx-auto w-full backdrop-blur-xl z-50 relative"
              >
                <div className="text-[10px] uppercase tracking-wider font-mono opacity-60 p-2 border-b border-slate-800">
                  Multiple matches found. Select correct city:
                </div>
                <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto mt-1.5">
                  {suggestions.map((c, i) => (
                    <button
                      key={`${c.latitude}-${c.longitude}`}
                      id={`suggestion-item-${i}`}
                      onClick={() => handleSuggestionClick(c)}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-slate-200">
                        {c.name}
                        {c.admin1 ? `, ${c.admin1}` : ""}
                        <span className="font-normal opacity-75"> ({c.country})</span>
                      </span>
                      {c.countryCode && (
                        <span className="text-[10px] font-mono opacity-50 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/50 uppercase">
                          {c.countryCode}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Loading Indicator */}
        {isLoading && !weatherData && (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <div className="p-4 rounded-full bg-slate-900/40 border border-slate-800 animate-spin text-indigo-400">
              <WeatherIcon name="RefreshCw" size={32} />
            </div>
            <p className="text-xs font-mono tracking-widest animate-pulse text-slate-400">
              ANALYZING METRICS...
            </p>
          </div>
        )}

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              id="error-notification"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-start gap-3 shadow-lg"
            >
              <WeatherIcon name="AlertCircle" className="text-rose-400 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-sm">Operation Alert</h4>
                <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Dash Layout arranged in 12-column Grid */}
        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            {/* Main Area: Column Span 8 */}
            <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
              <CurrentWeatherCard
                current={weatherData.current}
                city={weatherData.city}
                theme={theme}
                isFahrenheit={isFahrenheit}
                isMph={isMph}
              />
              <HourlyForecast
                hourly={weatherData.hourly}
                timezone={weatherData.city.timezone}
                theme={theme}
                isFahrenheit={isFahrenheit}
              />
            </div>

            {/* Sidebar Area: Column Span 4 */}
            <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
              <DailyForecast
                daily={weatherData.daily}
                theme={theme}
                isFahrenheit={isFahrenheit}
              />

              {/* Weekly Outlook Highlights Container */}
              <motion.div
                id="weekly-outlook-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-indigo-600 rounded-3xl p-6 relative overflow-hidden shadow-xl border border-indigo-500 text-white"
              >
                <div className="relative z-10">
                  <h3 className="text-white font-extrabold text-lg tracking-tight mb-2 flex items-center gap-2 font-display">
                    <WeatherIcon name="Sparkles" size={18} />
                    Weekly Outlook
                  </h3>
                  <p className="text-indigo-100/90 text-sm leading-relaxed">
                    Generally {theme.label.toLowerCase()} conditions are trending. Check back daily for hyper-local atmospheric updates.
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-indigo-500/30 pt-4">
                    <span className="text-[10px] font-mono tracking-wider text-indigo-200/80 uppercase">
                      AI MODEL STABLE
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold border border-white/10">
                      LIVE RADAR
                    </span>
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-15">
                  <WeatherIcon name={theme.iconName} size={144} className="text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Footer conforming to Sleek Interface */}
        <footer id="app-footer" className="mt-8 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-medium uppercase tracking-wider gap-4">
          <div className="flex flex-wrap items-center gap-6 justify-center sm:justify-start font-mono">
            <span>Real-time Data via Open-Meteo API</span>
            <span>Units: {isFahrenheit ? "Fahrenheit" : "Celsius"} • {isMph ? "MPH" : "KM/H"}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>System Operational</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
