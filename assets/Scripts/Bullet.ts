import {
  _decorator,
  Component,
  PolygonCollider2D,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
  find,
} from "cc";

import { PlayerManager } from "./Manager/PlayerManager";

const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  private playerManagerPath: string = "Canvas/PlayerManager";
  private playerManager = null;

  private isCollied = false;
  private isNodePooling = true;

  protected onLoad(): void {
    let collider = this.node.getComponent(PolygonCollider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      collider.sensor = true;
    }

    this.playerManager = find(this.playerManagerPath).getComponent(
      PlayerManager
    );

    this.isNodePooling = this.playerManager.PoolMode;
    //set name
    this.node.name = "Bullet";

    //enable sensor

  }

  start() {
    // console.log(this.node.parent.name);
  }

  update(deltaTime: number) {
    if (this.isCollied) {
      console.log("Bullet is collied");
      if (this.isNodePooling) {
        this.playerManager.recycleBullet(this.node);
        this.isCollied = false;
      } else {
        this.node.destroy();
      }
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {
    if (
      otherCollider.node.parent.name === "Barriers" ||
      otherCollider.node.name === "tree" ||
      otherCollider.node.name === "Player1" ||
      otherCollider.node.name === "Player2" ||
      otherCollider.node.name === "Player3" 
    ) {
      this.isCollied = true;
      console.log(otherCollider.node.name);
    }
  }
}
