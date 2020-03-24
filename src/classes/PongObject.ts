import PongObjectInterface from '@/interfaces/PongObjectInterface'

export default class PongObject extends DOMRect implements PongObjectInterface {
  private _color: string
  private _name: number

  constructor (name: number, x?: number, y?: number, width?: number, height?: number, color = '#FFFFFF') {
    super(x, y, width, height)
    this._name = name
    this._color = color
  }

  get color (): string {
    return this._color
  }

  set color (value: string) {
    this._color = value
  }

  get name (): number {
    return this._name
  }

  set name (value: number) {
    this._name = value
  }
}
