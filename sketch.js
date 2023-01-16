let scissorArray;
let paperArray = new Array(10).fill(0).map((_, i) => "p");
let rockArray = new Array(10).fill(0).map((_, i) => "r");



function generate(xStart, yStart, r) {
  let angle = random(0, 2 * PI);
  let x = xStart + random(-r,r) * cos(angle);
  let y = yStart + random(-r,r) * sin(angle);
  return { x, y };
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  scissorArray = new Array(20).fill(0).map((_, i) => {
    return new RPS("S", generate(200,height-200,100));
  });

  paperArray = new Array(20).fill(0).map((_, i) => {
    return new RPS("P", generate((width-100) / 2, 200 ,100));
  })

  rockArray = new Array(20).fill(0).map((_, i) => {
    return new RPS("R", generate(width-200,height-200,100));
  })
}

function draw() {
  background(0);
  fill(255);
  textSize(32);

  scissorArray.forEach((scissor) => {
    scissor.draw();
    scissor.move();
    scissor.checkEdges();
    scissor.flock(scissorArray, scissor.averagePosition(paperArray), rockArray);
    if(scissor.checkCollision(rockArray)) {
      scissorArray = scissorArray.filter((s) => s !== scissor);
      rockArray.push(new RPS("r", {x: scissor.position.x, y: scissor.position.y}));
    }
  });

  paperArray.forEach((paper) => {
    paper.draw();
    paper.move();
    paper.checkEdges();
    paper.flock(paperArray, paper.averagePosition(rockArray), scissorArray);
    if(paper.checkCollision(scissorArray)) {
      paperArray = paperArray.filter((p) => p !== paper);
      scissorArray.push(new RPS("s", {x: paper.position.x, y: paper.position.y}));
    }
  });

  rockArray.forEach((rock) => {
    rock.draw();
    rock.move();
    rock.checkEdges();
    rock.flock(rockArray, rock.averagePosition(scissorArray), paperArray);
    if(rock.checkCollision(paperArray)) {
      rockArray = rockArray.filter((r) => r !== rock);
      paperArray.push(new RPS("p", {x: rock.position.x, y: rock.position.y}));
    }
  });
}
