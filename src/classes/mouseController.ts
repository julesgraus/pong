import Bat from '@/classes/bat'
import { fromEvent } from 'rxjs'
import { BatControllerInterface } from '@/interfaces/BatControllerInterface'

export class MouseController implements BatControllerInterface {
  bat: Bat;
  private _context: CanvasRenderingContext2D

  constructor (context: CanvasRenderingContext2D, bat: Bat) {
    this._context = context
    this.bat = bat

    this.updateBatPosition = this.updateBatPosition.bind(this)

    fromEvent<MouseEvent>(document, 'mousemove').subscribe(
      this.updateBatPosition
    )
  }

  updateBatPosition (event: MouseEvent) {
    this.bat.y = this.getMousePos(this._context, event).y
    if (this.bat.bottom > this._context.canvas.height) {
      this.bat.y = this._context.canvas.height - this.bat.height
    }
  }

  getMousePos (context: CanvasRenderingContext2D, evt: MouseEvent) {
    const rect = context.canvas.getBoundingClientRect()

    return {
      x: (evt.clientX - rect.left),
      y: (evt.clientY - rect.top)
    }
  }
}
