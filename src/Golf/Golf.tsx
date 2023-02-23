import { useEffect, useState } from 'react';
import './Daily.sass';
import { Unity, useUnityContext } from "react-unity-webgl";

export const Golf = () => {

    const { unityProvider } = useUnityContext({
        loaderUrl: "/unity/build webgl.loader.js",
        dataUrl: "/unity/build webgl.data",
        frameworkUrl: "/unity/build webgl.framework.js",
        codeUrl: "/unity/build webgl.wasm",
    });

    return (
        <div className="container">
           <Unity unityProvider={unityProvider} />
        </div>
    )
}
