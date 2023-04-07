import { Animation } from './animation';
import { LevelObject } from './level-object';

export class Data {
    constructor() {

    }

    load() {
        this.loadTextures();
        this.loadAnimations();
        this.loadLevelObjects();
    }

    loadTextures() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const images = document.getElementById('textures');

        this.textures = {};

        for (let i = 0; i < images.childElementCount; i++) {
            let img = images.children[i];
            let imgName = img.src.split('\\').pop().split('/').pop().split('.')[0];
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            let imgData = ctx.getImageData(0, 0, img.width, img.height);
            this.textures[imgName] = imgData;
        }
    }

    loadAnimations() {
        this.animations = {};
        this.animations['testObject'] = new Animation(this.textures['testObject'], 89, 100, 1, 0, false);
        this.animations['testWall'] = new Animation(this.textures['testWall'], 55, 70, 1, 0, false);
    }

    loadLevelObjects() {
        this.levelObjects = {};
        this.levelObjects['testObject'] = new LevelObject("tree", this.animations['testObject']);
        this.levelObjects['testWall'] = new LevelObject("wall", this.animations['testWall']);
    }
}