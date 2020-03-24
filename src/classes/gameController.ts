import Bat from '@/classes/bat'
import Ball from '@/classes/ball'
import { BatControllerInterface } from '@/interfaces/BatControllerInterface'
import { AiController } from '@/classes/aiController'
import { MouseController } from '@/classes/mouseController'
import CollisionDetector from '@/classes/collisionDetector'
import BallController from '@/classes/ballController'
import { PongObjectEnum } from '@/enums/PongObjectEnum'
import PongObject from '@/classes/PongObject'
import { fromEvent } from 'rxjs'
import { delay } from 'rxjs/operators'

export default class GameController {
  private _fieldColor: string
  private _fontColor: string
  private _midFieldLineColor: string;
  private _bats: Array<Bat>
  private _context: CanvasRenderingContext2D
  private _leftBatController: BatControllerInterface
  private _rightBatController: BatControllerInterface
  private _ballController: BallController
  private _collisionDetector: CollisionDetector
  private _ball: Ball
  private _topOfPlayField: PongObject
  private _bottomOfPlayField: PongObject
  private _currentDifficulty: number;

  constructor (context: CanvasRenderingContext2D) {
    this._context = context
    this._fieldColor = '#000000'
    this._fontColor = '#FFFFFF'
    this._midFieldLineColor = '#FFFFFF'

    this._currentDifficulty = 0

    this.updateCanvasDimensions()

    this._ball = new Ball(10, 10)

    this._bats = [
      new Bat(PongObjectEnum.LEFT_BAT),
      new Bat(PongObjectEnum.RIGHT_BAT)
    ]

    this._collisionDetector = new CollisionDetector()

    this._topOfPlayField = new PongObject(PongObjectEnum.TOP_OF_PLAYFIELD, 0, -2, this._context.canvas.width, 2)
    this._bottomOfPlayField = new PongObject(PongObjectEnum.BOTTOM_OF_PLAYFIELD, 0, this._context.canvas.height, this._context.canvas.width, 2)

    this._leftBatController = new MouseController(this._context, this._bats[0])
    this._rightBatController = new AiController(this._collisionDetector, this._context, this._bats[1], this._ball)

    this._bats.forEach(this._collisionDetector.add)
    this._collisionDetector.add(this._ball)
    this._collisionDetector.add(this._topOfPlayField)
    this._collisionDetector.add(this._bottomOfPlayField)

    this._ballController = new BallController(this._collisionDetector, this._ball, this._bats, 50)

    this.tick = this.tick.bind(this)
    this.drawBat = this.drawBat.bind(this)

    this.reset()
    this.tick()
    this.listenToKeyPress()
  }

  listenToKeyPress () {
    fromEvent(window, 'keyup').pipe(
      delay(100) // Wait a little bit
    ).subscribe(() => {
      this._bats[0].ready = true // Ready the players bat.
      if (
        this._bats.filter(bat => bat.ready).length === this._bats.length &&
        !this._ballController.ballMayMove
      ) {
        this._ballController.ballMayMove = true // And if everybody is ready, START!!!!!
      }
    })
  }

  updateCanvasDimensions () {
    this._context.canvas.width = window.innerWidth
    this._context.canvas.height = window.innerHeight
  }

  reset () {
    this._bats.forEach(bat => { bat.resetScore() })
    this.resetPositions()
  }

  resetPositions () {
    this._bats[0].x = 10
    this._bats[0].y = (this._context.canvas.height - this._bats[0].height) * 0.5

    this._bats[1].x = this._context.canvas.width - 10 - this._bats[1].width
    this._bats[1].y = (this._context.canvas.height - this._bats[1].height) * 0.5

    this._ball.x = (this._context.canvas.width - this._ball.width) * 0.5
    this._ball.y = (this._context.canvas.height - this._ball.height) * 0.5
  }

  checkForWinner () {
    let winner = null
    if (this._ball.right < 0) winner = this._bats[1]
    if (this._ball.left > this._context.canvas.width) winner = this._bats[0]

    if (winner) {
      winner.won()
      this._ballController.ballMayMove = false
      this._ballController.resetVelocity()
      this.resetPositions()
      this._bats.forEach(bat => { bat.ready = false })
      this.recalculateDifficulty()
    }
  }

  recalculateDifficulty () {
    if (!(this._rightBatController instanceof AiController)) return

    // Ai is winning
    if (this._bats[0].score < this._bats[1].score) this._rightBatController.difficulty--
    // Player is winning
    else this._rightBatController.difficulty++
  }

  tick () {
    this._ballController.updateBallPosition()
    if (this._rightBatController instanceof AiController) this._rightBatController.tick()
    this.clearCanvas()
    this.drawScore()
    this.drawMidFieldLine()
    this.drawBats()
    this.drawBall()
    this.checkForWinner()
    window.requestAnimationFrame(this.tick)
  }

  clearCanvas () {
    this._context.fillStyle = this._fieldColor
    this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height)
  }

  drawScore () {
    this._context.fillStyle = this._fontColor
    this._context.font = '48px digitalix'
    this._context.fillText(this._bats[0].score.toString(10), (this._context.canvas.width * 0.33), 50)
    this._context.fillText(this._bats[1].score.toString(10), (this._context.canvas.width * 0.63), 50)
  }

  drawMidFieldLine () {
    const half = this._context.canvas.width * 0.5
    this._context.strokeStyle = this._midFieldLineColor
    this._context.lineWidth = 2
    this._context.beginPath()
    this._context.setLineDash([10, 10])
    this._context.moveTo(half, 0)
    this._context.lineTo(half, this._context.canvas.height)
    this._context.stroke()
  }

  drawBats () {
    this._bats.forEach(this.drawBat)
  }

  drawBat (bat: Bat) {
    this._context.fillStyle = bat.color
    this._context.fillRect(bat.x, bat.y, bat.width, bat.height)
  }

  drawBall () {
    this._context.fillStyle = this._ball.color
    this._context.fillRect(this._ball.x, this._ball.y, this._ball.width, this._ball.height)
  }
}
