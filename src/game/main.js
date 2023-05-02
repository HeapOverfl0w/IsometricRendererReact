import { Renderer } from './renderer';
import { Camera } from './camera';
import { Tile } from './tile';
import { Level } from './level';
import { CAMERA_ZOOM, CAMERA_X, CAMERA_Y, TILE_HEIGHT_OFFSET_RATIO } from './constants'

export class Main {
    constructor(ctx, data) {
        this.ctx = ctx;
        this.data = data;

        this.renderer = new Renderer();
        this.camera = new Camera();
        this.camera.x = CAMERA_X;
        this.camera.y = CAMERA_Y;
        this.camera.zoom = CAMERA_ZOOM;

        this.mouseX = 0;
        this.mouseY = 0;

        const tiles = [];
        for (let x = 0; x < 100; x++) {
            tiles.push([]);
            for (let y = 0; y < 100; y++) {
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
        this.updateInterval = setInterval(this.update.bind(this), 1000 / 30);
    }

    update() {
        this.renderer.draw(this.ctx, this.camera, this.level, this.mouseX, this.mouseY);
    }

    handleMouseMove(mouseX, mouseY) {
        this.mouseX = Math.floor(mouseX);
        this.mouseY = Math.floor(mouseY);
    }

    handleMouseWheel(zoomDiff) {
        this.camera.zoom = CAMERA_ZOOM + zoomDiff;
    }

    handleMouseClick(xDist, yDist) {
        const canvasTan = window.innerHeight / window.innerWidth;
        const canvasAngle = Math.atan(canvasTan);
        const adjustedCanvasAngle = Math.PI / 2 - canvasAngle;

        let angle = 0;

        if (yDist === 0) {
            if (xDist < 0) {
                angle = Math.PI + Math.PI / 2;
            }
            else {
                angle = Math.PI / 2;
            }
        }
        else if (xDist === 0) {
            if (yDist < 0) {
                angle = Math.PI;
            }
        }
        else {
            angle = Math.atan2(Math.abs(yDist), Math.abs(xDist));

            if (xDist > 0 && yDist > 0) {
                angle = Math.PI / 2 - angle;
            }
            else if (xDist > 0 && yDist < 0) {
                angle += Math.PI / 2;
            }
            else if (xDist < 0 && yDist < 0) {
                angle = Math.PI + (Math.PI / 2 - angle);
            }
            else {
                angle += Math.PI + Math.PI / 2
            }
        }

        const hypo = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

        let adjustedAngle = angle - adjustedCanvasAngle;
        adjustedAngle = angle >= adjustedCanvasAngle ? adjustedAngle : adjustedAngle + 2 * Math.PI;
  
        if (adjustedAngle <= 2 * canvasAngle) {
          adjustedAngle = adjustedAngle * ((Math.PI / 2) / (2 * canvasAngle));
        }
        else {
          let adjustment = Math.PI / 2;
          if (adjustedAngle <= Math.PI) {
            adjustment += (adjustedAngle - 2 * canvasAngle) * ((Math.PI / 2) / (2 * adjustedCanvasAngle));
          }
          else {
            adjustment = Math.PI;
            if (adjustedAngle <= 2 * canvasAngle + Math.PI) {
              adjustment += (adjustedAngle - Math.PI) * ((Math.PI / 2) / (2 * canvasAngle));
            }
            else {
              adjustment = Math.PI + Math.PI / 2 + (adjustedAngle - (Math.PI + Math.PI / 2)) * ((Math.PI / 2) / (2 * adjustedCanvasAngle));
            }
          }
          adjustedAngle = adjustment;
        }
  
        const xPrime = Math.cos(adjustedAngle) * hypo;
        const yPrime = Math.sin(adjustedAngle) * hypo;

        const tileWidth = window.innerWidth / this.camera.zoom;
        var tileHeight = window.innerHeight / this.camera.zoom;
        tileHeight = tileHeight - (TILE_HEIGHT_OFFSET_RATIO * tileHeight);

        const tileSize = Math.sqrt((Math.pow(tileWidth / 2, 2) + Math.pow(tileHeight / 2, 2)));

        const tileX = xPrime > 0 ?
          Math.floor(xPrime / tileSize) :
          Math.ceil(xPrime / tileSize);

        const tileY = yPrime > 0 ?
          Math.floor(yPrime / tileSize) :
          Math.ceil(yPrime / tileSize);

        this.camera.x += tileX;
        this.camera.y += tileY;
    }
}