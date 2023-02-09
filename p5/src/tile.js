class Tile {
    constructor(original_index, img){
        this.original_index = original_index;
        this.img = img;
    }

    draw(){
        console.log(this.original_index);
    }
}