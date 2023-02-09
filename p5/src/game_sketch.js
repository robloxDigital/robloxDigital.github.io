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
    // p.draw_image_tiles(p.tiles);
  }

  p.get_image_url = new Promise( (resolve, reject) => {
    p.animals = ["cats", "shibes"];
    p.which_animal = p.random(p.animals); 
    p.url = `https://shibe.online/api/${p.which_animal}?count=1&urls=true&httpsUrls=true`;
    fetch(p.url)
    .then(res => res.json())
    .then(data => {
      resolve(data[0]);
    });
  });
 
  p.create_image_tiles = (source_img) => {
    source_img.resize(p.game_sketch_container_size, p.game_sketch_container_size);
    for(let i = 0; i < p.board_rows; i++){
      for(let j = 0; j < p.board_cols; j++){
        let x = j * p.tile_w;
        let y = i * p.tile_h;
        let index = j + i * p.board_cols;
        let img = p.createImage(p.tile_w, p.tile_h);
        if(index == p.board_cols*p.board_rows-1){
          p.tiles.push(new Tile(index, img, true));
          continue;
        }
        img.copy(source_img, x, y, p.tile_w, p.tile_h, 0, 0, p.tile_w, p.tile_h);
        p.tiles.push(new Tile(index, img));
      }
    }
    
    p.shuffle_tiles(p.tiles);
  }

  p.shuffle_tiles = (tiles) => {
    let neighbors, x, y, blank_index, blank_x, blank_y, dist, neighbor_to_move, tmp;
    for(let n = 0; n < 100; n++){
      neighbors = [];
      for(let i = 0; i < tiles.length; i++){
        if(tiles[i].blank){
          blank_index = i;
          blank_x = (i / p.board_rows)|0;
          blank_y = i % p.board_cols;
        }
      }
      for(let i = 0; i < tiles.length; i++){
        x = (i / p.board_rows)|0;
        y = i % p.board_cols;
        if( x != blank_x || y != blank_y){
          dist = Math.abs(x-blank_x) + Math.abs(y-blank_y);
          if( dist == 1 )
            neighbors.push(i);
        }
      }
      neighbor_to_move = p.random(neighbors);
      tmp = tiles[blank_index];
      tiles[blank_index] = tiles[neighbor_to_move];
      tiles[neighbor_to_move] = tmp;
    }
  }

  p.draw_image_tiles = (tiles) => {
    if(tiles.length != 0){
      for(let i = 0; i < p.board_rows; i++){
        for(let j = 0; j < p.board_cols; j++){
          let x = j * p.tile_w;
          let y = i * p.tile_h
          let index = j + i * p.board_cols;
          p.image(tiles[index].img, x, y, p.tile_w, p.tile_h);
          p.strokeWeight(2);
          p.noFill();
          p.rect(x, y, p.tile_w, p.tile_h);
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