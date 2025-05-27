const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const startBtn = document.getElementById("startBtn");
    const scoreDisplay = document.getElementById("score");

    let ballX, ballY, dx, dy, ballRadius = 10;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX, rightPressed = false, leftPressed = false;


    const brickRowCount = 2;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    let bricks = [];
    let bricksBroken = 0;

    let gameStarted = false;

    function initGame() {
      ballX = canvas.width / 2;
      ballY = canvas.height - 30;
      dx = 2;
      dy = -2;
      paddleX = (canvas.width - paddleWidth) / 2;
      bricksBroken = 0;
      scoreDisplay.textContent = "Bricks Broken: 0";

      bricks = [];
      for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
    }

    function keyDownHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    }

    function keyUpHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    }

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ballX > b.x &&
              ballX < b.x + brickWidth &&
              ballY > b.y &&
              ballY < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              bricksBroken++;
              scoreDisplay.textContent = "Bricks Broken: " + bricksBroken;
            }
          }
        }
      }
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0d6efd";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#212529";
      ctx.fill();
      ctx.closePath();
    }

    function drawBall() {
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0d6efd";
      ctx.fill();
      ctx.closePath();
    }

    function draw() {
      if (!gameStarted) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) dx = -dx;
      if (ballY + dy < ballRadius) dy = -dy;
      else if (ballY + dy > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) dy = -dy;
        else {
          alert("Game Over! You broke " + bricksBroken + " bricks.");
          document.location.reload();
        }
      }

      if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
      else if (leftPressed && paddleX > 0) paddleX -= 5;

      ballX += dx;
      ballY += dy;

      requestAnimationFrame(draw);
    }

    startBtn.addEventListener("click", () => {
      canvas.style.display = "block";
      startBtn.style.display = "none";
      initGame();
      gameStarted = true;
      draw();
      function draw() {
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (bricksBroken === brickRowCount * brickColumnCount) {
    alert("🎉 You Win! All bricks broken.");
    gameStarted = false;
    return; 
  }

  if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) dx = -dx;
  if (ballY + dy < ballRadius) dy = -dy;
  else if (ballY + dy > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) dy = -dy;
    else {
      alert("Game Over! You broke " + bricksBroken + " bricks.");
      document.location.reload();
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  ballX += dx;
  ballY += dy;

  requestAnimationFrame(draw);
}

    });

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);