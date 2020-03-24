import { PongObjectEnum } from '@/enums/PongObjectEnum'
import PongObject from '@/classes/PongObject'

export default class Ball extends PongObject {
  private _xVelocity: number
  private _yVelocity: number
  private _recentlyHitWall: boolean
  private _recentlyHitBat: boolean

  constructor (x = 0, y = 0, size = 15) {
    super(PongObjectEnum.BALL, x, y, size, size)
    this._xVelocity = 0
    this._yVelocity = 0
    this._recentlyHitWall = false
    this._recentlyHitBat = false
  }

  get xVelocity (): number {
    return this._xVelocity
  }

  set xVelocity (value: number) {
    this._xVelocity = value
  }

  get yVelocity (): number {
    return this._yVelocity
  }

  set yVelocity (value: number) {
    this._yVelocity = value
  }

  get recentlyHitWall (): boolean {
    return this._recentlyHitWall
  }

  set recentlyHitWall (value: boolean) {
    this._recentlyHitWall = value
  }

  get recentlyHitBat (): boolean {
    return this._recentlyHitBat
  }

  set recentlyHitBat (value: boolean) {
    this._recentlyHitBat = value
  }
}
