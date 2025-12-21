import { Route } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'sign-up',
        pathMatch: 'full'
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    }
];
