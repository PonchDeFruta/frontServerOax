import { Routes } from '@angular/router';

// tables
import { TablesComponent } from './tables';

// font-icons
import { FontIconsComponent } from './font-icons';

import { AppLayout } from './layouts/app-layout';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // dashboard
            // font-icons
            { path: 'font-icons', component: FontIconsComponent, data: { title: 'Font Icons' } },

            // components
            { path: '', loadChildren: () => import('./components/components.module').then((d) => d.ComponentsModule) },

            // forms
            { path: '', loadChildren: () => import('./forms/form.module').then((d) => d.FormModule) },

            //map
            // forms
            { path: '', loadChildren: () => import('./map/map.module').then((d) => d.MapModule) },

            // tables
            { path: 'tables', component: TablesComponent, data: { title: 'Tables' } },
            { path: '', loadChildren: () => import('./datatables/datatables.module').then((d) => d.DatatablesModule) },
        ],
    },
];
