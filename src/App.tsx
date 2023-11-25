import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {FilesetResolver, GestureRecognizer} from "@mediapipe/tasks-vision";
import Geogebra from "react-geogebra";
import ProcessVideo from "./components/ProcessVideo";

interface AppProps {
    height: number,
    width: number,
}

function App(props: AppProps) {
    const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer | null>(null);
    const appRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        async function createGestureRecognizer() {
            const vision = await FilesetResolver.forVisionTasks("tasks-vision/wasm");
            const gestureRecognizer =
                await GestureRecognizer.createFromOptions(
                    vision,
                    {
                        baseOptions: {
                            modelAssetPath: "models/gesture_recognizer.task",
                            delegate: "GPU"
                        },
                        numHands: 2,
                        runningMode: "VIDEO"
                    }
                );
            setGestureRecognizer(gestureRecognizer);
        }

        if (!gestureRecognizer) {
            createGestureRecognizer();
        }

        // Activate the webcam stream.
    }, []);

    return (
        <div className="App" ref={appRef}>
            <Geogebra
                debug
                appName={"3d"}
                width={props.width}
                height={props.height}
                showMenuBar={true}
                showToolBar={true}
                showAlgebraInput={true}
                id={''}
                appletOnLoad={function (): void {
                    throw new Error('Function not implemented.');
                }}/>
            {
                gestureRecognizer !== null ?
                    <ProcessVideo gestureRecognizer={gestureRecognizer} height={props.height}
                                  width={props.width}/> : <></>
            }
        </div>
    );
}

export default App;
