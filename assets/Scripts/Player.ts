import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventKeyboard,
  KeyCode,
  RigidBody2D,
  v2,
  v3,
  Prefab,
  instantiate,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  @property(Prefab)
  public bulletPrefab: Prefab = null;

  private speed = 10;
  private dirX = 0;
  private dirY = 0;

  start() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  update(deltaTime: number) {
    let playerBody = this.node.getComponent(RigidBody2D);
    playerBody.linearVelocity = v2(
      this.dirX * this.speed,
      this.dirY * this.speed
    );
    this.node.parent
      .getChildByName("Camera")
      .setPosition(this.node.position.x, this.node.position.y, 0);

    let faceDir = this.dirX >= 0 ? 1 : -1;
    this.node.setScale(faceDir, 1, 1);
  }

  onKeyDown(e: EventKeyboard) {
    switch (e.keyCode) {
      case KeyCode.KEY_W:
        this.dirY = 1;
        console.log("up");
        break;
      case KeyCode.KEY_S:
        this.dirY = -1;
        console.log("down");
        break;
      case KeyCode.KEY_A:
        this.dirX = -1;
        console.log("left");
        break;
      case KeyCode.KEY_D:
        this.dirX = 1;
        console.log("right");
        break;
      case KeyCode.KEY_K:
        this.handleShoot();
        break;
    }
  }

  onKeyUp(e: EventKeyboard) {
    switch (e.keyCode) {
      case KeyCode.KEY_W:
        this.dirY = 0;
        break;
      case KeyCode.KEY_S:
        this.dirY = 0;
        break;
      case KeyCode.KEY_A:
        this.dirX = 0;
        break;
      case KeyCode.KEY_D:
        this.dirX = 0;
        break;
    }
    console.log("stop");
  }

  handleShoot() {
    let bullet = instantiate(this.bulletPrefab);
    bullet.setPosition(
      v3(this.node.position.x + 5 * this.node.scale.x, this.node.position.y, 0)
    );
    bullet.parent = this.node;
  }
}
