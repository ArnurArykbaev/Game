let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let ballR = 10,
  x = canvas.width / 2,
  y = canvas.height - 30,
  ballPadding = 20;

let balls = [];
let ballColors = [
  { name: "scissors", color: "#2292A4" },
  { name: "paper", color: "#BDBF09" },
  { name: "rock", color: "#D96C06" },
];

const ballQuantity = randomInteger(11, 23);
for (ball = 0; ball < ballQuantity; ball++) {
  const newBallColor = randomInteger(0, 2);
  balls.push({
    x: ballR + ballPadding + randomIntegerWithoutZero(1, 200),
    y: ballR + ballPadding + randomIntegerWithoutZero(1, 500),
    dx: randomIntegerWithoutZero(-2, 2),
    dy: randomIntegerWithoutZero(-2, 2),
    status: 1,
    color: ballColors[newBallColor].color,
  });
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function randomIntegerWithoutZero(min, max) {
  let rand;
  do {
    rand = min + Math.random() * (max + 1 - min);
  } while (rand === 0);
  return Math.floor(rand);
}

function drawBall() {
  balls.forEach(function (ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballR, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  });
}

function gameOver() {
  const firstColor = balls[0].color;
  for (let i = 1; i < balls.length; i++) {
    if (balls[i].color !== firstColor) {
      return false;
    }
  }
  alert("All balls have the same color!");
  document.location.reload()
  return true;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball) => {
    drawBall(ball); // pass the ball as a parameter to drawBall()
    collisionDetection(ball); // pass the ball as a parameter to collisionDetection()

    if (hitSideWall(ball)) ball.dx = -ball.dx;

    if (hitTop(ball) || hitBottom(ball)) ball.dy = -ball.dy;

    function hitBottom(ball) {
      return ball.y + ball.dy > canvas.height - ballR;
    }
    function hitSideWall(ball) {
      return (
        ball.x + ball.dx > canvas.width - ballR || ball.x + ball.dx < ballR
      );
    }
    function hitTop(ball) {
      return ball.y + ball.dy < ballR;
    }

    ball.x += ball.dx;
    ball.y += ball.dy; // update the position of the ball
  });
}

function collisionDetection() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const dx = balls[j].x - balls[i].x;
      const dy = balls[j].y - balls[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < ballR * 2) {
        balls[i].dx = -balls[i].dx;
        balls[i].dy = -balls[i].dy;
        balls[j].dx *= -1;
        balls[j].dy *= -1;
        
        if (balls[i].color !== balls[j].color) {
          const newColor = ballColors.find(color => color.color !== balls[i].color && color.color !== balls[j].color);
          balls[i].color = newColor.color;
          balls[j].color = newColor.color;
        }
        
        if (gameOver()) return;
      }
    }
  }
}

setInterval(draw, 10);
