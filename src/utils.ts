import { CityDetails } from "./types";

// Dynamic background configurations based on weather types
export interface WeatherTheme {
  label: string;
  iconName: string;
  bgGradient: string; // Background of the entire page
  cardBg: string; // Background of the card (usually transparent glassmorphic)
  textColor: string; // Primary text color
  textMuted: string; // Secondary/muted text color
  accentBg: string; // Small badge/button highlights
  borderClass: string; // Borders for cards
  shadowColor: string;
}

export function getWeatherTheme(code: number, isDay: boolean): WeatherTheme {
  // Clear Sky
  if (code === 0) {
    if (isDay) {
      return {
        label: "Sunny",
        iconName: "Sun",
        bgGradient: "from-slate-950 via-slate-900 to-amber-950/40",
        cardBg: "bg-slate-900/40 backdrop-blur-md",
        textColor: "text-slate-100",
        textMuted: "text-slate-400",
        accentBg: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
        borderClass: "border-slate-800/80",
        shadowColor: "shadow-amber-500/5",
      };
    } else {
      return {
        label: "Clear Night",
        iconName: "Moon",
        bgGradient: "from-slate-950 via-slate-900 to-indigo-950/40",
        cardBg: "bg-slate-900/40 backdrop-blur-md",
        textColor: "text-slate-100",
        textMuted: "text-slate-400",
        accentBg: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25",
        borderClass: "border-slate-800/80",
        shadowColor: "shadow-indigo-500/5",
      };
    }
  }

  // Mainly Clear, Partly Cloudy, Overcast
  if (code >= 1 && code <= 3) {
    if (isDay) {
      return {
        label: code === 1 ? "Mainly Clear" : code === 2 ? "Partly Cloudy" : "Overcast",
        iconName: code === 1 ? "CloudSun" : "Cloud",
        bgGradient: "from-slate-950 via-slate-900 to-slate-800/40",
        cardBg: "bg-slate-900/40 backdrop-blur-md",
        textColor: "text-slate-100",
        textMuted: "text-slate-400",
        accentBg: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25",
        borderClass: "border-slate-800/80",
        shadowColor: "shadow-indigo-500/5",
      };
    } else {
      return {
        label: code === 1 ? "Mainly Clear" : code === 2 ? "Partly Cloudy" : "Overcast",
        iconName: code === 1 ? "CloudMoon" : "Cloud",
        bgGradient: "from-slate-950 via-slate-900 to-slate-950/60",
        cardBg: "bg-slate-900/40 backdrop-blur-md",
        textColor: "text-slate-100",
        textMuted: "text-slate-400",
        accentBg: "bg-slate-800 text-slate-300 border border-slate-700/30",
        borderClass: "border-slate-800/80",
        shadowColor: "shadow-black/20",
      };
    }
  }

  // Fog or depositing rime fog
  if (code === 45 || code === 48) {
    const label = code === 45 ? "Foggy" : "Rime Fog";
    return {
      label,
      iconName: "CloudFog",
      bgGradient: "from-slate-950 via-slate-900 to-zinc-900/40",
      cardBg: "bg-slate-900/40 backdrop-blur-md",
      textColor: "text-slate-100",
      textMuted: "text-slate-400",
      accentBg: "bg-zinc-800 text-zinc-300 border border-zinc-700/30",
      borderClass: "border-slate-800/80",
      shadowColor: "shadow-black/20",
    };
  }

  // Drizzle
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    const label = code >= 56 ? "Freezing Drizzle" : "Light Drizzle";
    return {
      label,
      iconName: "CloudDrizzle",
      bgGradient: "from-slate-950 via-slate-900 to-cyan-950/40",
      cardBg: "bg-slate-900/40 backdrop-blur-md",
      textColor: "text-slate-100",
      textMuted: "text-slate-400",
      accentBg: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25",
      borderClass: "border-slate-800/80",
      shadowColor: "shadow-cyan-500/5",
    };
  }

  // Rain: Slight, moderate, heavy, freezing
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67 || (code >= 80 && code <= 82)) {
    let label = "Rainy";
    if (code === 61) label = "Light Rain";
    if (code === 65) label = "Heavy Rain";
    if (code === 66 || code === 67) label = "Freezing Rain";
    if (code >= 80) label = "Rain Showers";

    return {
      label,
      iconName: "CloudRain",
      bgGradient: "from-slate-950 via-slate-900 to-blue-950/40",
      cardBg: "bg-slate-900/40 backdrop-blur-md",
      textColor: "text-slate-100",
      textMuted: "text-slate-400",
      accentBg: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25",
      borderClass: "border-slate-800/80",
      shadowColor: "shadow-indigo-500/5",
    };
  }

  // Snow
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    let label = "Snowy";
    if (code === 71) label = "Light Snow";
    if (code === 75) label = "Heavy Snow";
    if (code === 77) label = "Snow Grains";

    return {
      label,
      iconName: "CloudSnow",
      bgGradient: "from-slate-950 via-slate-900 to-sky-950/40",
      cardBg: "bg-slate-900/40 backdrop-blur-md",
      textColor: "text-slate-100",
      textMuted: "text-slate-400",
      accentBg: "bg-sky-500/15 text-sky-300 border border-sky-500/25",
      borderClass: "border-slate-800/80",
      shadowColor: "shadow-sky-500/5",
    };
  }

  // Thunderstorm
  if (code === 95 || code === 96 || code === 99) {
    const label = code === 95 ? "Thunderstorm" : "Storm with Hail";
    return {
      label,
      iconName: "CloudLightning",
      bgGradient: "from-slate-950 via-slate-900 to-purple-950/40",
      cardBg: "bg-slate-900/40 backdrop-blur-md",
      textColor: "text-slate-100",
      textMuted: "text-slate-400",
      accentBg: "bg-purple-500/15 text-purple-300 border border-purple-500/25",
      borderClass: "border-slate-800/80",
      shadowColor: "shadow-purple-500/5",
    };
  }

  // Fallback / Unknown code
  return {
    label: "Unknown",
    iconName: "Cloud",
    bgGradient: "from-slate-950 via-slate-900 to-slate-800/30",
    cardBg: "bg-slate-900/40 backdrop-blur-md",
    textColor: "text-slate-100",
    textMuted: "text-slate-400",
    accentBg: "bg-white/10 text-slate-100 border border-white/10",
    borderClass: "border-slate-800/80",
    shadowColor: "shadow-black/20",
  };
}

export function formatDateTime(isoString: string, timezone: string, includeDate = false): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    if (includeDate) {
      options.weekday = "short";
      options.month = "short";
      options.day = "numeric";
    }
    return new Date(isoString).toLocaleString("en-US", options);
  } catch (e) {
    return isoString;
  }
}

export function getDayName(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    return date.toLocaleDateString("en-US", { weekday: "short" });
  } catch (e) {
    return dateString;
  }
}

export function formatTemp(celsius: number, isFahrenheit: boolean): string {
  if (isFahrenheit) {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatWindSpeed(kmh: number, isMph: boolean): string {
  if (isMph) {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export const POPULAR_CITIES: CityDetails[] = [
  { name: "New York", country: "United States", admin1: "New York", timezone: "America/New_York", latitude: 40.7128, longitude: -74.006, countryCode: "US" },
  { name: "London", country: "United Kingdom", admin1: "England", timezone: "Europe/London", latitude: 51.5074, longitude: -0.1278, countryCode: "GB" },
  { name: "Tokyo", country: "Japan", admin1: "Tokyo", timezone: "Asia/Tokyo", latitude: 35.6762, longitude: 139.6503, countryCode: "JP" },
  { name: "Sydney", country: "Australia", admin1: "New South Wales", timezone: "Australia/Sydney", latitude: -33.8688, longitude: 151.2093, countryCode: "AU" },
  { name: "Paris", country: "France", admin1: "Île-de-France", timezone: "Europe/Paris", latitude: 48.8566, longitude: 2.3522, countryCode: "FR" },
];
