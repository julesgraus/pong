import PongObjectInterface from '@/interfaces/PongObjectInterface'

export default class CollisionDetector {
  private subjects: Array<PongObjectInterface>

  constructor () {
    this.subjects = []

    this.collisions = this.collisions.bind(this)
    this.collidesWith = this.collidesWith.bind(this)
    this.add = this.add.bind(this)
  }

  add (subject: PongObjectInterface) {
    this.subjects.push(subject)
  }

  collisions (subject: PongObjectInterface) {
    return this.subjects.filter((collisionCandidate: PongObjectInterface) => {
      return collisionCandidate.name !== subject.name && this.collidesWith(subject, collisionCandidate)
    })
  }

  collidesWith (subjectOne: PongObjectInterface, subjectTwo: PongObjectInterface) {
    return !(subjectOne.left > subjectTwo.right ||
      subjectOne.right < subjectTwo.left ||
      subjectOne.top > subjectTwo.bottom ||
      subjectOne.bottom < subjectTwo.top)
  }
}
