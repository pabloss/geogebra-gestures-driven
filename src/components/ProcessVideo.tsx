import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {GestureRecognizer, GestureRecognizerResult} from "@mediapipe/tasks-vision";
import LandmarksDrawing from "./LandmarksDrawing";
import GesturesInfo from "./GesturesInfo";

interface ProcessVideoProps {
    gestureRecognizer: GestureRecognizer,
    height: number,
    width: number,
}

function ProcessVideo(props: ProcessVideoProps) {
    const lastVideoTimeRef = useRef(-1);
    const resultsRef = useRef<GestureRecognizerResult | null>(null);
    const [results, setResults] = useState<GestureRecognizerResult | null>(null);

    const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
    const webcamElement = videoRef.current as HTMLVideoElement;

    const requestRef = React.useRef(0)

    useEffect(() => {
        if (webcamElement?.style) {
            webcamElement.style.height = `${props.height}px`;
            webcamElement.style.width = `${props.width}px`;
        }
    }, []);

    function getResults(videoElement: HTMLVideoElement,): GestureRecognizerResult | null {
        if (videoElement && (videoElement.currentTime ?? 0 !== lastVideoTimeRef.current)) {
            lastVideoTimeRef.current = videoElement.currentTime;
            return props.gestureRecognizer.recognizeForVideo(videoElement, Date.now());
        }
        return null;
    }

    async function predictWebcam(videoElement: HTMLVideoElement) {
        resultsRef.current = getResults(videoElement);
        setResults(getResults(videoElement));
        // Call this function again to keep predicting when the browser is ready.
        requestRef.current = window.requestAnimationFrame(() => {
            predictWebcam(videoElement);
        });
    }

    useEffect(() => {
        const constraints = {
            video: true
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                if (videoRef.current !== null) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener("loadeddata", () => {
                        if (videoRef?.current) {
                            predictWebcam(videoRef.current);
                        }
                    });
                }
            });
        return () => window.cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <>
            <video id={"webcam"} ref={videoRef} width={props.width} height={props.height} autoPlay playsInline/>
            <LandmarksDrawing results={results} width={props.width} height={props.height}/>
            <GesturesInfo results={results}/>
        </>
    );
}

export default ProcessVideo;
