import {
  IconBuildingCommunity,
  IconParkingCircle,
  IconTablePlus,
} from "@tabler/icons-react";
import {
  ChartNoAxesColumnIncreasing,
  CircleDotDashedIcon,
  DatabaseZapIcon,
  Globe2Icon,
  LayoutDashboardIcon,
  ListCheckIcon,
  SettingsIcon,
  UsersIcon,
  BarChart3Icon,
  LineChartIcon,
  TrendingUpIcon,
  UsersRoundIcon,
  DatabaseIcon,
  NetworkIcon,
} from "lucide-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: "Overview",
    label: "",
    href: "/",
    icon: <LayoutDashboardIcon size={18} />,
  },
  // {
  //   title: 'Nodes',
  //   label: '',
  //   href: '/nodes',
  //   icon: <ListCheckIcon size={18} />,
  // },
  {
    title: "Users",
    label: "",
    href: "/users",
    icon: <UsersIcon size={18} />,
  },
  // {
  //   title: 'DOI Services',
  //   label: '',
  //   href: '',
  //   icon: <DatabaseZapIcon size={18} />,
  //   sub: [
  //     {
  //       title: 'Records',
  //       label: '',
  //       href: '/doi',
  //       icon: <ListCheckIcon size={18} />,
  //     },
  //     {
  //       title: 'Pending',
  //       label: '',
  //       href: '/doi/pending',
  //       icon: <IconParkingCircle size={18} />,
  //     },
  //   ],
  // },
  {
    title: "Desci Communities",
    label: "",
    href: "/communities",
    icon: <Globe2Icon size={18} />,
    sub: [
      {
        title: "Desci Communities",
        label: "",
        href: "/communities",
        icon: <IconBuildingCommunity size={18} />,
      },
      {
        title: "Add new",
        label: "",
        href: "/communities/new",
        icon: <IconTablePlus size={18} />,
      },
    ],
  },
  {
    title: "Journals",
    label: "",
    href: "/journals",
    icon: <Globe2Icon size={18} />,
    sub: [
      {
        title: "Journals",
        label: "",
        href: "/journals",
        icon: <IconBuildingCommunity size={18} />,
      },
      {
        title: "Add new",
        label: "",
        href: "/journals/new",
        icon: <IconTablePlus size={18} />,
      },
    ],
  },
  {
    title: "User Engagement",
    label: "",
    href: "/metrics",
    icon: <BarChart3Icon size={18} />,
    sub: [
      {
        title: "Sciweave Analytics",
        label: "",
        href: "/metrics/sciweave",
        icon: <ChartNoAxesColumnIncreasing size={18} />,
      },
      {
        title: "SciWeave IP Usage",
        label: "",
        href: "/metrics/sciweave/ip-usage",
        icon: <NetworkIcon size={18} />,
      },
      {
        title: "User Engagement",
        label: "",
        href: "/metrics",
        icon: <UsersRoundIcon size={18} />,
      },
      {
        title: "Publishing funnel",
        label: "",
        href: "/metrics/publishing-funnel",
        icon: <LineChartIcon size={18} />,
      },
      {
        title: "Retention",
        label: "",
        href: "/metrics/retention",
        icon: <TrendingUpIcon size={18} />,
      },
      {
        title: "Feature adoption",
        label: "",
        href: "/metrics/feature-adoption",
        icon: <CircleDotDashedIcon size={18} />,
      },
      {
        title: "Research object Statistics",
        label: "",
        href: "/metrics/ro-stats",
        icon: <DatabaseIcon size={18} />,
      },
    ],
  },
  // {
  //   title: 'Settings',
  //   label: '',
  //   href: '/settings',
  //   icon: <SettingsIcon size={18} />,
  // },
];
