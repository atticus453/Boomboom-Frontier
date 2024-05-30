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
  find,
} from "cc";
import { PlayerManager } from "./Manager/PlayerManager";

const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  private isCollied = false;

  private playerManagerPath: string = "Canvas/PlayerManager";
  private playerManager = null;

  protected onLoad(): void {
    let collider = this.node.getComponent(PolygonCollider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    this.playerManager = find(this.playerManagerPath).getComponent(
      PlayerManager
    );
  }

  start() {
    // console.log(this.node.parent.name);
  }

  update(deltaTime: number) {
    if (this.isCollied) {
      console.log("Bullet is collied");
      if (this.playerManager.PoolMode) {
        this.playerManager.bulletPool.put(this.node);
        this.isCollied = false;
      } else this.node.destroy();
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {
    if (
      otherCollider.node.parent.name === "Barriers" ||
      otherCollider.node.name === "tree"
    ) {
      this.isCollied = true;
    }
  }
}
