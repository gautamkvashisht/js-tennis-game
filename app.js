let canvas = document.getElementById('gameCanvas')
let canvasContext = canvas.getContext('2d')

let ballX = 50
let ballSpeedX = 6
let ballY = 50
let ballSpeedY = 8

let paddle1Y = 200
let paddle2Y = 200
const PADDLE2_SPEED = 6
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 10

let player1Score = 0
let player2Score = 0
const WINNING_SCORE = 3
let showWinner = false
let winner = null

function main() {
  let framesPerSecond = 40
  setInterval(() => {
    move()
    draw()
  }, 1000/framesPerSecond)
  canvas.addEventListener('mousedown', (event) => {
    if (showWinner) {
      player1Score = 0
      player2Score = 0
      showWinner = false
      winner = null
    }
  })
  canvas.addEventListener('mousemove', (event) => {
    let mousePos = calculateMousePosition(event)
    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2)
  })
}

function calculateMousePosition(event) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  let mouseX = event.clientX - rect.left - root.scrollLeft
  let mouseY = event.clientY - rect.top - root.scrollTop
  return {
    x: mouseX,
    y: mouseY
  }
}

function computerMovement() {
  let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2)
  if (paddle2YCenter < (ballY - 30)) {
    paddle2Y += PADDLE2_SPEED 
  } else if (paddle2YCenter > (ballY + 30)) {
    paddle2Y -= PADDLE2_SPEED
  }
}

function ballReset() {
  if (player1Score == WINNING_SCORE || player2Score == WINNING_SCORE) {
    showWinner = true
    winner = player1Score == WINNING_SCORE ? 'You' : 'Computer'
  }

  ballSpeedX = -ballSpeedX
  ballX = canvas.width/2
  ballY = canvas.height/2
}

function move() {
  if (showWinner) {
    return
  }
  computerMovement()
  ballX += ballSpeedX
  ballY += ballSpeedY

  if (ballX < PADDLE_WIDTH) {
    if (ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX
      let deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT/2))
      ballSpeedY += 0.6*deltaY
    }
    else {
      player2Score++ // Increment in score must be before ball reset
      ballReset()
    }
  }
  if (ballX > canvas.width - PADDLE_WIDTH) {
    if (ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX
      let deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT/2))
      ballSpeedY *= 0.35
    }
    else {
      player1Score++ // Increment in score must be before ball reset
      ballReset()
    }
  }
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY
  } 
}

function drawRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.fillRect(leftX, topY, width, height,)
}

function drawCircle(leftX, topY, radius, drawColor) {
  canvasContext.fillStyle = drawColor
  canvasContext.beginPath()
  canvasContext.arc(leftX, topY, radius, 0, Math.PI*2, true)
  canvasContext.fill()
}

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 40) {
    drawRect((canvas.width/2) - 1, i, 2, 20, 'white')
  }
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, 'black') // Canvas
  canvasContext.font = '20px Arial'
  if (showWinner) {
    canvasContext.fillStyle = 'green'
    canvasContext.fillText(winner+' won', 350, 200)
    canvasContext.fillText('Click to Continue', 350, 400)
    return
  }
  drawNet()
  drawRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white') // Left Player Paddle
  drawRect(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white') // Right Computer Paddle
  // Ball  
  drawCircle(ballX, ballY, 10, 'red')
  
  canvasContext.fillText(player1Score, 100, 100)
  canvasContext.fillText(player2Score, canvas.width-100, 100)
}

main()