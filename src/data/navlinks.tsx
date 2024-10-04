import { IconBuildingCommunity, IconParkingCircle, IconTablePlus } from "@tabler/icons-react";
import { ChartNoAxesColumnIncreasing, CircleDotDashedIcon, DatabaseZapIcon, Globe2Icon, LayoutDashboardIcon, ListCheckIcon, SettingsIcon, UsersIcon } from "lucide-react";

export interface NavLink {
    title: string
    label?: string
    href: string
    icon: JSX.Element
  }
  
  export interface SideLink extends NavLink {
    sub?: NavLink[]
  }

export const sidelinks: SideLink[] = [
    {
      title: 'Dashboard',
      label: '',
      href: '/',
      icon: <LayoutDashboardIcon size={18} />,
    },
    {
      title: 'Nodes',
      label: '',
      href: '/nodes',
      icon: <ListCheckIcon size={18} />,
    },
    {
      title: 'Users',
      label: '',
      href: '/users',
      icon: <UsersIcon size={18} />,
    },
    {
      title: 'DOI Services',
      label: '',
      href: '',
      icon: <DatabaseZapIcon size={18} />,
      sub: [
        {
          title: 'Records',
          label: '',
          href: '/doi',
          icon: <ListCheckIcon size={18} />,
        },
        {
          title: 'Pending',
          label: '',
          href: '/doi/pending',
          icon: <IconParkingCircle size={18} />,
        },
      ],
    },
    {
      title: 'Community',
      label: '',
      href: '/community',
      icon: <Globe2Icon size={18} />,
      sub: [
        {
          title: 'Communities',
          label: '',
          href: '/community',
          icon: <IconBuildingCommunity size={18} />,
        },
        {
          title: 'Add new',
          label: '',
          href: '/community/new',
          icon: <IconTablePlus size={18} />,
        },
      ],
    },
    {
      title: 'Analysis',
      label: '',
      href: '/analysis',
      icon: <ChartNoAxesColumnIncreasing size={18} />,
    },
    {
      title: 'Settings',
      label: '',
      href: '/settings',
      icon: <SettingsIcon size={18} />,
    },
  ]