export class Tile {
    constructor(texture, passable, levelObject = undefined) {
        this.texture = texture;
        this.passable = passable;
        this.levelObject = levelObject;
    }
}