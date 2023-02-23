
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Golf } from './Golf/Golf';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "golf",
    element: <Golf />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
