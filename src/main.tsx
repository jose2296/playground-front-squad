import React, { LazyExoticComponent, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider
} from 'react-router-dom';
import './index.css';
import Layout from './Layout';
import Daily from './modules/Daily/Daily';
import DailyGame from './modules/Daily/Game/DailyGame';
import DailyRoulette from './modules/Daily/Roulette/Roulette';
import { Links } from './modules/Links';
import { useStore } from './store';

export interface HOCFunctions {
    nextStep?: () => void;
    previousStep?: () => void;
}

const HOC = ({ Component, index }: { Component: LazyExoticComponent<({ nextStep, previousStep }: HOCFunctions) => JSX.Element>; index: number }) => {
    const { changeStepByIndex, nextStep, previousStep } = useStore();

    useEffect(() => {
        changeStepByIndex(index);
    }, [Component]);

    return (
        <Component nextStep={nextStep} previousStep={previousStep} />
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Navigate to='/games' />
            },
            {
                path: 'games',
                element: <HOC Component={Links as any} index={0} />
            },
            {
                path: 'daily',
                element: <HOC Component={Daily as any} index={1} />,
                children: [
                    {
                        path: '',
                        element: <DailyRoulette />,
                    },
                    {
                        path: ':game',
                        element: <DailyGame />
                    }
                ]
            },
            {
                path: '*',
                element: <Navigate to='/' />
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
