
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import { Golf } from './Golf/Golf';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Game from './Game/Game';
import GolfV2 from './golfv2/Golf-v2';
const DailyV2 = lazy(() => import('./daily-v2/DailyV2'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/v2",
    element: (
      <div className="App">
          <DailyV2 />
      </div>
    )
  },
  {
    path: "/game",
    element: (
      <div className="App">
          <Game />
      </div>
    )
  },
  {
    path: 'golf',
    element: <GolfV2 />,
  },
  {
    path: "golf-old",
    element: <Golf />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={'Loading...'} >
      <RouterProvider router={router}/>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
