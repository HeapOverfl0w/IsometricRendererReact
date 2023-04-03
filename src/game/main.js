import { Renderer } from './renderer';
import { Camera } from './camera';
import { Tile } from './tile';
import { Level } from './level';

export class Main {
    constructor(ctx, data) {
        this.ctx = ctx;
        this.data = data;

        this.renderer = new Renderer();
        this.camera = new Camera();
        this.camera.x = 25;
        this.camera.y = 25;

        this.mouseX = 0;
        this.mouseY = 0;

        const tiles = [];
        for(let x = 0; x < 100; x++) {
            tiles.push([]);
            for(let y = 0; y < 100; y++) {
                let tileType = Math.random();
                if (tileType > 0.2) {
                    tiles[x].push(new Tile(this.data.textures['test'], true));
                    if (Math.random() > 0.9) {
                        tiles[x][y].levelObject = this.data.levelObjects['testObject'].copy();
                    }
                } else if (tileType > 0.19) {
                    tiles[x].push(undefined);
                } else {
                    tiles[x].push(new Tile(this.data.textures['stone'], true));
                    if (Math.random() > 0.9) {
                        tiles[x][y].levelObject = this.data.levelObjects['testWall'].copy();
                    }
                }                
            }
        }
        this.level = new Level(this.data, tiles);
    }

    start() {
        this.updateInterval = setInterval(this.update.bind(this), 1000/30);
    }
    
    update() {
        this.renderer.draw(this.ctx, this.camera, this.level, this.mouseX, this.mouseY);
    }
    
    handleMouseMove(mouseX, mouseY) {
        this.mouseX = Math.floor(mouseX);
        this.mouseY = Math.floor(mouseY);
    }

    handleMouseWheel(deltaY) {
        let delta = 1;
        if (deltaY < 0) {
            delta = -1;
        }

        this.camera.zoom += delta;
    }

    handleMouseClick() {
        this.camera.x = this.renderer.mouseTileX;
        this.camera.y = this.renderer.mouseTileY;
    }
}