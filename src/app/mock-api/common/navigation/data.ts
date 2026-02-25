/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

const operatorNavigation: any = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboards',
        children: [],
    },
];

const managerNavigation: any = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboards',
        children: [],
    },
    {
        id: 'reports',
        title: 'Reports',
        tooltip: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:view-list',
        link: '/reports',
        children: [],
    },
];

const adminNavigation: any = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboards',
        children: [],
    },
    {
        id: 'reports',
        title: 'Reports',
        tooltip: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:view-list',
        link: '/reports',
        children: [],
    },
    {
        id: 'users',
        title: 'Users',
        tooltip: 'Users',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/users',
        children: [],
    },
];

const superadminNavigation: any = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboards',
        children: [],
    },
    {
        id: 'reports',
        title: 'Reports',
        tooltip: 'Reports',
        type: 'basic',
        icon: 'heroicons_outline:view-list',
        link: '/reports',
        children: [],
    },
    {
        id: 'users',
        title: 'Users',
        tooltip: 'Users',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/users',
        children: [],
    },
    {
        id: 'Panels',
        title: 'Panels',
        tooltip: 'Panels',
        type: 'basic',
        icon: 'heroicons_outline:cog',
        link: '/panels',
        children: [],
    },
];

export const defaultOperatorNavigation: FuseNavigationItem[] =
    operatorNavigation;
export const defaultManagerNavigation: FuseNavigationItem[] = managerNavigation;
export const defaultAdminNavigation: FuseNavigationItem[] = adminNavigation;
export const defaultSuperAdminNavigation: FuseNavigationItem[] =
    superadminNavigation;

// export const defaultNavigation: FuseNavigationItem[] = adminNavigation;
// export const compactNavigation: FuseNavigationItem[] = adminNavigation;

// export const futuristicNavigation: FuseNavigationItem[] = adminNavigation;
// export const horizontalNavigation: FuseNavigationItem[] = adminNavigation;
