import React, { LazyExoticComponent, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    Navigate,
    Outlet,
    RouterProvider,
} from 'react-router-dom';
import './index.css';
import Layout from './Layout';
import { Links } from './modules/components/Links';
import { useStore } from './store';
import Daily from './modules/Daily';
import InternationalDay from './modules/InternationalDay';
import Roulette from './modules/Daily/Roulette';
import DailyGame from './modules/Daily/DailyGame';

export interface HOCFunctions { 
    nextStep?: () => void;
    previousStep?: () => void;
};

const HOC = ({ Component, index }: { Component: LazyExoticComponent<({ nextStep, previousStep }: HOCFunctions) => JSX.Element>; index: number }) => {
    const { changeStepByIndex, nextStep, previousStep } = useStore();
    
    useEffect(() => {
        changeStepByIndex(index);
    }, [Component]);

    return (
        <Component nextStep={nextStep} previousStep={previousStep} />
    )
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Navigate to="/games" />
            },
            {
                path: 'games',
                element: <HOC Component={Links as any} index={0} />
            },
            {
                path: 'daily',
                element: <HOC Component={(({ previousStep, nextStep }: HOCFunctions) => <Outlet context={{ previousStep, nextStep }} />) as any} index={1} />,
                children: [
                    {
                        path: '',
                        element: <Roulette />,
                    },
                    {
                        path: ':game',
                        element: <DailyGame />
                    }
                ]
            },
            {
                path: 'international-day',
                element: <HOC Component={InternationalDay    as any} index={2} />,
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
