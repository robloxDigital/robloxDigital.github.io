let background_sketch = (p) => {

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      p.createBackground();
    }
  
    p.preload = () => {
      p.img = p.loadImage('assets/mario-cloud-840-859.png');
    }
  
    p.createBackground = () => {
      p.background("#3d9eee");
  
      p.number_of_clouds = 8;
      p.img_ratio = 3;
      if(p.windowWidth < 1200){
        p.img_ratio = 6;
      }
      for (let i = 0; i < p.number_of_clouds; i++) {
        let y = p.random(p.windowHeight - p.img.width / p.img_ratio)
        p.image(p.img, 50 + i * (p.windowWidth / p.number_of_clouds), y, p.img.width / p.img_ratio, p.img.height / p.img_ratio);
      }
    }
  
    p.setup = () => {
      p.canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      p.canvas.position(0, 0);
      p.canvas.style('z-index', -1);
      p.createBackground();
      p.noLoop();
    }
  }
  
  let p5_background = new p5(background_sketch);