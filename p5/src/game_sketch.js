let game_sketch = (p) => {
  p.board_rows = 4;
  p.board_cols = 4;
  p.tiles = [];

  p.get_shorter_size = (div_id) => {
    let width = document.getElementById(div_id).getBoundingClientRect().width;
    let height = document.getElementById(div_id).getBoundingClientRect().height;
    let shorter_size = (width <= height ? width : height);
    return shorter_size;
  }
  p.windowResized = () => {
    p.game_sketch_container_size = p.get_shorter_size('game_sketch_container');
    p.resizeCanvas(p.game_sketch_container_size, p.game_sketch_container_size);
    p.tile_w = p.canvas.width/p.board_cols;
    p.tile_h = p.canvas.height/p.board_rows;
    p.draw_image_tiles(p.tiles);
  }

  p.get_image_url = new Promise( (resolve, reject) => {
    if(localStorage.getItem("image_url") !== null){
      resolve(localStorage.getItem("image_url"));
    }
    p.animals = ["cats", "shibes"];
    p.which_animal = p.random(p.animals); 
    p.url = `https://shibe.online/api/${p.which_animal}?count=1&urls=true&httpsUrls=true`;
    fetch(p.url)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("image_url", data[0]);
      resolve(data[0]);
    });
  });
 
  p.create_image_tiles = (source_img) => {
    source_img.resize(p.game_sketch_container_size, p.game_sketch_container_size);
    for(let i = 0; i < p.board_rows; i++){
      for(let j = 0; j < p.board_cols; j++){
        let x = j * p.tile_w;
        let y = i * p.tile_h;
        let img = p.createImage(p.tile_w, p.tile_h);
        img.copy(source_img, x, y, p.tile_w, p.tile_h, 0, 0, p.tile_w, p.tile_h);
        let tile = new Tile(j + i * p.board_cols, img);
        p.tiles.push(tile);
      }
    }

    
  }

  p.draw_image_tiles = (tiles) => {
    if(tiles.length != 0){
      for(let i = 0; i < p.board_rows; i++){
        for(let j = 0; j < p.board_cols; j++){
          let index = j + i * p.board_cols;
          p.image(tiles[index].img, j * p.tile_w, i * p.tile_h, p.tile_w, p.tile_h);
        }
      }
    }
  }

  p.setup = async () => {
    p.game_sketch_container_size = p.get_shorter_size('game_sketch_container');
    p.canvas = p.createCanvas(p.game_sketch_container_size, p.game_sketch_container_size);
    p.tile_w = p.canvas.width/p.board_cols;
    p.tile_h = p.canvas.height/p.board_rows;
    p.image_url = await p.get_image_url;
    p.loadImage("https://images.dog.ceo/breeds/pomeranian/n02112018_4296.jpg", (image) => {
    // p.loadImage(p.image_url, (image) => {
      p.create_image_tiles(image);
    });
  }

  p.draw = () => {
    p.draw_image_tiles(p.tiles);
  }
}

let p5_game = new p5(game_sketch, 'game_sketch_container');