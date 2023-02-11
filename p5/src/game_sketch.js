let game_sketch = (p) => {
  p.board_rows = 4;
  p.board_cols = 4;
  p.tiles = [];
  p.game_on = true;

  p.get_shorter_size = (div_id) => {
    p.start_checking_if_solved = false;
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
          p.tiles.push(new Tile(index, null, true));
          continue;
        }
        img.copy(source_img, x, y, p.tile_w, p.tile_h, 0, 0, p.tile_w, p.tile_h);
        p.tiles.push(new Tile(index, img));
      }
    }

    p.shuffle_tiles(p.tiles);
    p.start_checking_if_solved = true;
  }

  p.find_blank_tile = (tiles) => {
    for(let i = 0; i < tiles.length; i++){
      if(tiles[i].blank)
        return i;
    }
  }

  p.is_neighbor = (index1, index2) => {
    let x1, y1, x2, y2;
    x1 = (index1 / p.board_rows)|0;
    x2 = (index2 / p.board_rows)|0;
    y1 = index1 % p.board_cols;
    y2 = index2 % p.board_cols;
    if( x1 != x2 || y1 != y2){
      dist = Math.abs(x1-x2) + Math.abs(y1-y2);
      if( dist == 1 )
        return true;
    }
    return false;
  }

  p.swap_tiles = (index1, index2, tiles) => {
    let tmp = tiles[index1];
    tiles[index1] = tiles[index2];
    tiles[index2] = tmp;
  }

  p.mouseClicked = () => {
    let row = (p.mouseY/p.tile_h)|0;
    let col = (p.mouseX/p.tile_w)|0;
    let index, blank_index;
    if( (row >= 0 && col >= 0) && (row < p.board_rows && col < p.board_cols) ){
      if(p.tiles.length == 0)
        return;
      index = col + row * p.board_cols;
      blank_index = p.find_blank_tile(p.tiles);
      if(p.is_neighbor(blank_index, index)){
        p.swap_tiles(blank_index, index, p.tiles);
      }
    }
  }

  p.shuffle_tiles = (tiles) => {
    let neighbors, blank_index, neighbor_to_move, tmp;
    for(let n = 0; n < 2; n++){
      neighbors = [];
      blank_index = p.find_blank_tile(tiles);
      for(let i = 0; i < tiles.length; i++){
        if(p.is_neighbor(blank_index, i))
          neighbors.push(i);
      }
      neighbor_to_move = p.random(neighbors);
      p.swap_tiles(neighbor_to_move, blank_index, tiles);
    }
  }

  p.draw_image_tiles = (tiles) => {
    if(tiles.length != 0){
      for(let i = 0; i < p.board_rows; i++){
        for(let j = 0; j < p.board_cols; j++){
          let x = j * p.tile_w;
          let y = i * p.tile_h
          let index = j + i * p.board_cols;
          p.strokeWeight(2);
          p.noFill();
          p.rect(x, y, p.tile_w, p.tile_h);
          if(tiles[index].blank){
            continue;
          }
          p.image(tiles[index].img, x, y, p.tile_w, p.tile_h);
        }
      }
    }
  }

  p.check_for_win = (tiles) => {
    if(p.start_checking_if_solved == false)
      return false;
    for(let i = 0; i < tiles.length; i++){
      if(tiles[i].original_index != i)
        return false;
    }
    return true;
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
    if(p.game_on){
      p.clear();
      p.draw_image_tiles(p.tiles);
      setTimeout(() => {
        if(p.check_for_win(p.tiles)){
          p.game_on = false;
          p.start_checking_if_solved = false;
          alert("SOLVED");
        }
      }, 100);
    }
  }
}

let p5_game = new p5(game_sketch, 'game_sketch_container');