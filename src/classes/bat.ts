import PongObject from '@/classes/PongObject'

export default class Bat extends PongObject {
  private _score: number
  private _ready: boolean

  constructor (name: number, x = 0, y = 0, height = 120, width = 20, color = '#FFFFFF') {
    super(name, x, y, width, height, color)
    this._score = 0
    this._ready = false
  }

  public won () {
    this._score++
  }

  public resetScore () {
    this._score = 0
  }

  get score (): number {
    return this._score
  }

  get ready (): boolean {
    return this._ready
  }

  set ready (value: boolean) {
    this._ready = value
  }
}
