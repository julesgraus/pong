export default class SoundEffectsController {
  private _context?: AudioContext
  private _node?: OscillatorNode

  constructor () {
    if (!this.supported()) console.error('The sounds effects controller is not supported in your browser.')

    // Strangely enough this prevents / reduces lagging the browser when a sound is played.
    // I think it 'primes' something in the browser internally
    this._context = new AudioContext()
  }

  leftBat () {
    this.playForOscillator(300, 0.08)
  }

  rightBat () {
    this.playForOscillator(310, 0.08)
  }

  wall () {
    this.playForOscillator(240, 0.06)
  }

  private playForOscillator (frequency: number, duration: number) {
    // Hopefully there will be a better more efficient way of playing audio
    // Recreating it every time seems to be a waste of system resources.
    this._context = undefined
    this._context = new AudioContext()
    this._node = this._context.createOscillator()
    this._node.type = 'square'
    this._node.frequency.value = frequency
    this._node.connect(this._context.destination)
    this._node.start()
    this._node.stop(duration)
  }

  supported () {
    return !!window.AudioContext || !!window.webkitAudioContext
  }
}
