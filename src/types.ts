export interface CityDetails {
  name: string;
  country: string;
  admin1?: string; // state/region
  timezone: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
}

export interface DailyForecastItem {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitationSum: number;
}

export interface WeatherData {
  city: CityDetails;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export interface WeatherCondition {
  label: string;
  icon: string; // Lucide icon name
  themeClass: string; // Tailwind gradient & background classes
  accentClass: string; // Accent color for highlights
  cardBg: string; // Card background color
  isDarkTheme: boolean; // Flag to use white text or dark text
}
