import Bat from '@/classes/bat'
import { fromEvent, Observable } from 'rxjs'
import { BatControllerInterface } from '@/interfaces/BatControllerInterface'

export class MouseController implements BatControllerInterface {
  private bat: Bat;
  private context: CanvasRenderingContext2D

  constructor (context: CanvasRenderingContext2D, bat: Bat) {
    this.context = context
    this.bat = bat

    this.updateBatPosition = this.updateBatPosition.bind(this)

    fromEvent<MouseEvent>(document, 'mousemove').subscribe(
      this.updateBatPosition
    )
  }

  updateBatPosition (event: MouseEvent) {
    this.bat.y = this.getMousePos(this.context, event).y
  }

  getMousePos (context: CanvasRenderingContext2D, evt: MouseEvent) {
    const rect = context.canvas.getBoundingClientRect()

    return {
      x: (evt.clientX - rect.left),
      y: (evt.clientY - rect.top)
    }
  }
}
