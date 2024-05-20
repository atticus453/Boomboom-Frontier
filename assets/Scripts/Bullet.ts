import {
  _decorator,
  Component,
  Node,
  PolygonCollider2D,
  Contact2DType,
  RigidBody2D,
  v2,
  Collider2D,
  IPhysics2DContact,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  private speed = 20;
  private isCollied = false;

  protected onLoad(): void {
    let shootingPlayer = this.node.parent;
    let collider = this.node.getComponent(PolygonCollider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    let bulletBody = this.node.getComponent(RigidBody2D);
    bulletBody.linearVelocity = v2(this.speed * shootingPlayer.scale.x, 0);

    this.node.parent = shootingPlayer.parent;
  }

  start() {
    // console.log(this.node.parent.name);
  }

  update(deltaTime: number) {
    if (this.isCollied) this.node.destroy();
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {
    if (
      otherCollider.node.name === "leftBound" ||
      otherCollider.node.name === "rightBound"
    ) {
      this.isCollied = true;
    }
  }
}
