import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "./ui/bento-grid";

const features = [
  {
    Icon: FileTextIcon,
    name: "Save your files",
    description: "We automatically save your files as you type.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-pink-400 to-red-400 rounded-full blur-3xl" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search through all your files in one place.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Multilingual",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-3xl" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: <div className="absolute -right-20 -top-20 opacity-60 w-40 h-40 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-3xl" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

function BentoDemo() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Bento Grid Demo</h1>
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}

export { BentoDemo }; 