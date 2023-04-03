import React, {useRef, useEffect} from "react";
import { Data } from '../game/data';
import { Main } from '../game/main';

export function Canvas() {
    const canvasRef = useRef();
    let main = undefined;
    let data = undefined;

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        if (!data && !main) {
            data = new Data();
            data.load();
            main = new Main(ctx, data);
            main.start();
        }
    }, []);

    return (
        <div>
            <canvas style={{ width: window.innerWidth + 'px', height: window.innerHeight + 'px' }}
                id='scene' ref={canvasRef}
                width='640' height='400'
                onWheel={(event) => {
                    if (main != undefined) {
                        main.handleMouseWheel(event.deltaY);
                    }
                }}
                onMouseMove={(event) => {
                    if (main != undefined) {
                        main.handleMouseMove(event.clientX / canvasRef.current.clientWidth * canvasRef.current.width, event.clientY / canvasRef.current.clientHeight * canvasRef.current.height);
                    }
                }}
                onMouseUp={() => {
                    if (main != undefined) {
                        main.handleMouseClick();
                    }                        
                }}
            ></canvas>
        </div>
    )
}