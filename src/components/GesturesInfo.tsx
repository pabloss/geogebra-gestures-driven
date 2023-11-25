import React, {MutableRefObject, useEffect, useRef} from 'react';
import {GestureRecognizerResult} from "@mediapipe/tasks-vision";

interface GesturesInfoProps {
    results: GestureRecognizerResult | null,
}

function GesturesInfo(props: GesturesInfoProps) {
    const videoWidth = "480px";

    const gestureRef: MutableRefObject<HTMLParagraphElement | null> = useRef(null);
    const gestureOutput: HTMLParagraphElement | null = gestureRef.current;

    function getGesturesInfo(results: GestureRecognizerResult) {
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore =
            parseFloat(String(results.gestures[0][0].score * 100))
                .toFixed(2)
        ;
        const handedness = results.handednesses[0][0].displayName;
        return {categoryName, categoryScore, handedness};
    }

    function showRecognitionInferences(
        videoWidth: string,
        gestureOutput: HTMLParagraphElement,
        results: GestureRecognizerResult
    ) {
        if (!gestureOutput.style) {
            return;
        }

        function styleGesturesOutput() {
            if (results.gestures.length > 0) {
                gestureOutput.style.display = "block";
                gestureOutput.style.width = `${videoWidth}px`;
            } else {
                gestureOutput.style.display = "none";
            }
        }

        styleGesturesOutput();
        if (results.gestures.length > 0) {
            const {categoryName, categoryScore, handedness} = getGesturesInfo(results);
            gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
        }
    }

    useEffect(() => {
        if (gestureOutput && props.results) {
            showRecognitionInferences(videoWidth, gestureOutput, props.results);
        }
    }, [props.results]);

    return (<p id={"gesture_output"} ref={gestureRef}></p>);
}

export default GesturesInfo;
