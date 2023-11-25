import React, {MutableRefObject, useEffect, useRef} from 'react';
import {DrawingUtils, GestureRecognizer, GestureRecognizerResult} from "@mediapipe/tasks-vision";

interface LandmarksDrawingProps {
    results: GestureRecognizerResult | null,
    height: number,
    width: number,
}

function LandmarksDrawing(props: LandmarksDrawingProps) {
    const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
    const canvasElement: HTMLCanvasElement | null = canvasRef.current;
    const canvasCtx: CanvasRenderingContext2D | null | undefined = canvasElement?.getContext("2d");
    const drawingUtils = canvasCtx ? new DrawingUtils(canvasCtx) : null;

    function drawHands(
        results: GestureRecognizerResult,
    ) {
        if (!drawingUtils) {
            return;
        }
        canvasCtx!.save();
        canvasCtx!.clearRect(0, 0, canvasElement!.width, canvasElement!.height);
        if (results?.landmarks) {
            for (const landmarks of results.landmarks) {
                drawingUtils.drawConnectors(
                    landmarks,
                    GestureRecognizer.HAND_CONNECTIONS,
                    {
                        color: "#00FF00",
                        lineWidth: 5
                    }
                );
                drawingUtils.drawLandmarks(
                    landmarks,
                    {
                        color: "#FF0000",
                        lineWidth: 2
                    }
                );
            }
        }
        canvasCtx!.restore();
    }

    useEffect(() => {
        if (canvasElement?.style) {
            canvasElement.style.height = `${props.height}px`;
            canvasElement.style.width = `${props.width}px`;
        }
        if (
            canvasElement &&
            canvasCtx &&
            props.results !== null
        ) {
            drawHands(props.results);
        }
    }, [props.results]);

    return (
        <canvas
            id={"output_canvas"}
            ref={canvasRef}
            height={props.height}
            width={props.width}
            style={{
                position: 'absolute',
                left: 0,
                top: 0
            }}
        />
    );
}

export default LandmarksDrawing;
