import CollisionDetector from '@/classes/collisionDetector'
import { PongObjectEnum } from '@/enums/PongObjectEnum'
import Bat from '@/classes/bat'
import Ball from '@/classes/ball'
import random from 'lodash/fp/random'
import PongObjectInterface from '@/interfaces/PongObjectInterface'

export default class BallController {
  private _collisionDetector: CollisionDetector
  private _ball: Ball
  private _velocityMultiplier: number
  private _ballMayMove: boolean
  private _startVelocity: number
  private _maxVelocity: number;
  private _bats: Array<Bat>;

  constructor (collisionDetector: CollisionDetector, ball: Ball, bats: Array<Bat>, maxVelocity: number) {
    this._bats = bats
    this._ball = ball
    this._collisionDetector = collisionDetector
    this._startVelocity = 7
    this._velocityMultiplier = 1.07
    this._maxVelocity = maxVelocity
    this._ballMayMove = false
  }

  updateBallPosition () {
    this.processCollisions()
    this.moveBall()
  }

  processCollisions () {
    // Reset collision detection booleans
    this._ball.recentlyHitWall = false
    this._ball.recentlyHitBat = false

    // Determine what the ball did hit. May be multiple things.
    const subjects = this._collisionDetector.collisions(this._ball)
    subjects.forEach(subject => {
      switch (subject.name) {
        case PongObjectEnum.LEFT_BAT:
        case PongObjectEnum.RIGHT_BAT:
          this.ballHitBat(subject)
          break
        case PongObjectEnum.BOTTOM_OF_PLAYFIELD:
        case PongObjectEnum.TOP_OF_PLAYFIELD:
          this.ballHitWall()
          break
      }
    })
  }

  ballHitBat (bat: PongObjectInterface) {
    // Calculate and set new xVelocity
    const suggestedVelocity = (this._ball.xVelocity * this._velocityMultiplier) * -1
    this._ball.xVelocity = suggestedVelocity > this._maxVelocity ? this._maxVelocity : suggestedVelocity

    // Calculate and set new yVelocity
    const batCenterY = bat.y + (bat.height * 0.5)
    const ballCenterY = this._ball.y + (this._ball.height * 0.5)
    let offset = 0
    if (ballCenterY < batCenterY || ballCenterY > batCenterY) offset = ballCenterY - batCenterY
    offset = this.mapNumber(offset, 0, bat.height, 0, 13)

    this._ball.yVelocity = offset
    this._ball.recentlyHitBat = true
  }

  ballHitWall () {
    this._ball.yVelocity *= -1
    this._ball.recentlyHitWall = true
  }

  moveBall () {
    if (!this.ballMayMove) return

    let suggestedXPos = this._ball.x + this._ball.xVelocity
    const suggestedYPos = this._ball.y + this._ball.yVelocity

    // Prevent the ball from ghosting trough the bats. Correct the suggestedXPos
    if ( // Left side
      suggestedXPos < this._bats[0].right &&
      (this._ball.y >= this._bats[0].top && this._ball.y <= this._bats[0].bottom)
    ) {
      suggestedXPos = this._bats[0].right
    } else if (suggestedXPos > this._bats[1].left &&
      (this._ball.y >= this._bats[1].top && this._ball.y <= this._bats[1].bottom)
    ) { // Right side
      suggestedXPos = this._bats[1].x
    }

    this._ball.x = suggestedXPos
    this._ball.y = suggestedYPos
  }

  resetVelocity () {
    this._ball.xVelocity = this._startVelocity
    this._ball.yVelocity = 0
  }

  mapNumber (value: number, from1: number, to1: number, from2: number, to2: number) {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2
  }

  get ballMayMove (): boolean {
    return this._ballMayMove
  }

  set ballMayMove (value: boolean) {
    this._ballMayMove = value
    if (this._ballMayMove) {
      this._ball.xVelocity = random(0, 1) ? -this._startVelocity : this._startVelocity
      this._ball.yVelocity = random(0, 1) ? -this._startVelocity : this._startVelocity
    }
  }
}
