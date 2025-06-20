import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register'
import { RegisterCar } from './cars/register-car/register-car';
import { authGuard } from './auth-guard';
import { CarList } from './cars/car-list/car-list';
import { CarDetail } from './cars/car-detail/car-detail';

export const routes: Routes = [
    { 
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register 
    },
    {
        path: 'cars',
        component: CarList,
        canActivate: [authGuard]
    },
    {
        path: 'cars/register',
        component: RegisterCar,
        canActivate: [authGuard]
    },
    {
        path: 'cars/:id',
        component: CarDetail,
        canActivate: [authGuard]
    },
];
