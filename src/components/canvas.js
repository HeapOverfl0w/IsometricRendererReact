import React, { useRef, useEffect } from "react";
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
            main.handleMouseClick(props.zoom);
        }
    }, [props.center]);

    return (
        <div>
            <canvas style={{ width: window.innerWidth + 'px', height: window.innerHeight + 'px' }}
                id='scene' ref={canvasRef}
                width='640' height='400'
            ></canvas>
        </div>
    )
}