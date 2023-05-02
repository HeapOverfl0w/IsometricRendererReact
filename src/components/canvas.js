import React, { useRef, useEffect } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../game/constants";
import { Data } from '../game/data';
import { Main } from '../game/main';

let main = undefined;
let data = undefined;

export function Canvas(props) {
    const canvasRef = useRef();

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        if (!data && !main) {
            data = new Data();
            data.load();
            main = new Main(ctx, data);
            main.start();
        }
    }, []);

    useEffect(() => {
        if (main !== undefined) {
            main.handleMouseMove(
                props.position.x / canvasRef.current.clientWidth * canvasRef.current.width,
                props.position.y / canvasRef.current.clientHeight * canvasRef.current.height);
        }
    }, [props.position]);

    useEffect(() => {
        if (main !== undefined) {
            main.handleMouseWheel(props.zoom);
        }
    }, [props.zoom]);

    useEffect(() => {
        if (main !== undefined && props.center.x !== undefined && props.center.y !== undefined) {
            var xDist = props.center.x - canvasRef.current.clientWidth / 2;
            var yDist = canvasRef.current.clientHeight / 2 - props.center.y;

            main.handleMouseClick(xDist, yDist);
        }
    }, [props.center]);

    return (
        <div>
            <canvas style={{ width: window.innerWidth + 'px', height: window.innerHeight + 'px' }}
                id='scene' ref={canvasRef}
                width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
            ></canvas>
        </div>
    )
}