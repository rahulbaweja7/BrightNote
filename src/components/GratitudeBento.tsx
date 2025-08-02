import {
  CalendarIcon,
  FileTextIcon,
  HeartIcon,
  BarChartIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "./ui/bento-grid";

interface GratitudeBentoProps {
  totalEntries: number;
  currentStreak: number;
  thisMonthEntries: number;
  onAddEntry: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

const GratitudeBento = ({
  totalEntries,
  currentStreak,
  thisMonthEntries,
  onAddEntry,
  onToggleDarkMode,
  isDarkMode,
}: GratitudeBentoProps) => {
  const features = [
    {
      Icon: HeartIcon,
      name: "Daily Gratitude",
      description: `You've written ${totalEntries} entries so far. Keep up the positive mindset!`,
      href: "#",
      cta: "Add Entry",
      background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-pink-400 to-red-400 rounded-full blur-3xl" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
      onClick: onAddEntry,
    },
    {
      Icon: CalendarIcon,
      name: "Calendar View",
      description: "Track your gratitude journey with our beautiful calendar interface.",
      href: "#",
      cta: "View Calendar",
      background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: BarChartIcon,
      name: "Your Stats",
      description: `${currentStreak} day streak • ${thisMonthEntries} entries this month`,
      href: "#",
      cta: "View Stats",
      background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-3xl" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: FileTextIcon,
      name: "Journal Entries",
      description: "Reflect on your daily moments of gratitude and joy.",
      href: "#",
      cta: "Read Entries",
      background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: isDarkMode ? SunIcon : MoonIcon,
      name: isDarkMode ? "Light Mode" : "Dark Mode",
      description: `Switch to ${isDarkMode ? 'light' : 'dark'} mode for a different experience.`,
      href: "#",
      cta: "Toggle Theme",
      background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-3xl" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
      onClick: onToggleDarkMode,
    },
  ];

  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard 
          key={feature.name} 
          {...feature}
          onClick={feature.onClick}
        />
      ))}
    </BentoGrid>
  );
};

export { GratitudeBento }; 