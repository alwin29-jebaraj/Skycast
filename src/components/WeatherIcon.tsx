import * as Icons from "lucide-react";

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function WeatherIcon({ name, className = "", size = 24 }: WeatherIconProps) {
  // Safe lookup of icons
  const IconComponent = (Icons as any)[name] || Icons.Cloud;
  return <IconComponent className={className} size={size} />;
}
