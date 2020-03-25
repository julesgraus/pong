import Bat from '@/classes/bat'
import Ball from '@/classes/ball'
import { BatControllerInterface } from '@/interfaces/BatControllerInterface'
import CollisionDetector from '@/classes/collisionDetector'
import { PongObjectEnum } from '@/enums/PongObjectEnum'

export class AiController implements BatControllerInterface {
  bat: Bat
  private _ball: Ball
  private _halfHeight: number
  private _collisionDetector: CollisionDetector
  private _context: CanvasRenderingContext2D
  private _moveSpeed: number
  private _accuracy: number
  private _difficulty: number;

  constructor (collisionDetector: CollisionDetector, context: CanvasRenderingContext2D, bat: Bat, ball: Ball) {
    this._moveSpeed = 8 // The max speed the bat may move. 2 seems to be "slow" and 8 Seems to be "fast"
    this._accuracy = 100 // The higher the less accurate the bat will be. 200 seems to be "inaccurate". 100 seems to be accurate

    this._difficulty = 0 // 0 = easy, 10 = hard

    this._context = context
    this._collisionDetector = collisionDetector
    this.bat = bat
    this._ball = ball
    this._halfHeight = this.bat.height * 0.5

    this.tick = this.tick.bind(this)
  }

  tick () {
    this.bat.ready = true
    if (!this.batIsAtMaxAccuracy()) this.moveBatTowardsIdealPosition()
  }

  /**
   * Move the bat towards the ideal position,
   * That is where it will hit the ball in its center.
   */
  private moveBatTowardsIdealPosition (): void {
    const idealPosition = this._ball.y - ((this.bat.height - this._ball.height) * 0.5)
    if (this.bat.y < idealPosition) {
      if (this.bat.y + this._moveSpeed <= idealPosition) {
        this.bat.y += this._moveSpeed
      } else this.bat.y = idealPosition
    } else if (this.bat.y > idealPosition) {
      if (this.bat.y - this._moveSpeed >= idealPosition) {
        this.bat.y -= this._moveSpeed
      } else this.bat.y = idealPosition
    }

    if (this.bat.bottom > this._context.canvas.height) {
      this.bat.y = this._context.canvas.height - this.bat.height
    } else if (this.bat.top < 0) {
      this.bat.y = 0
    }
  }

  /**
   * Determines if the bat should move any further towards the ideal position
   * because of its accuracy. Returns true if the bat may move, false if not.
   */
  batIsAtMaxAccuracy (): boolean {
    if (this.bat.name === PongObjectEnum.RIGHT_BAT) {
      return this.bat.left - this._ball.right < this._accuracy
    }
    return false
  }

  mapNumber (value: number, from1: number, to1: number, from2: number, to2: number) {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2
  }

  get difficulty (): number {
    return this._difficulty
  }

  /**
   * Controls the difficulty. A difficulty of 0 tends to be easy. 10 is very hard
   *
   * @param difficulty
   */
  set difficulty (difficulty: number) {
    if (difficulty > 10) difficulty = 10
    else if (difficulty < 0) difficulty = 0
    this._difficulty = difficulty

    this._moveSpeed = this.mapNumber(difficulty, 0, 10, 2, 11)
    this._accuracy = this.mapNumber(difficulty, 0, 10, 190, 60)

    // console.log('Difficulty: ' + difficulty)
    // console.log('Move speed (higher is faster): ' + this._moveSpeed)
    // console.log('Accuracy (lower is accurate): ' + this._accuracy)
  }
}
