import {
  _decorator,
  Component,
  RigidBody2D,
  v2,
  Prefab,
  BoxCollider2D,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  private playerSpeed = 10;
  private bulletSpeed = 25;
  private preDir: string = "RIGHT";
  private dirX = 0;
  private dirY = 0;
  private angule = 0;

  onLoad(): void {
    let collider = this.node.getComponent(BoxCollider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  start() {}

  update(deltaTime: number) {
    this.handlePlayerPosition();
  }

  handleMove(dirX: number, dirY: number, facingAngle: number, preDir: string) {
    
    this.dirX = dirX;
    this.dirY = dirY;
    this.angule = facingAngle;
    this.preDir = preDir;
    this.node.setRotationFromEuler(0, 0, facingAngle);
    
    
  }

  handlePlayerPosition() {
    let playerBody = this.node.getComponent(RigidBody2D);
    playerBody.linearVelocity = v2(
      this.dirX * this.playerSpeed,
      this.dirY * this.playerSpeed
    );

    let playerFace: number[] = [1, 1];
    switch (this.preDir) {
      case "RIGHT":
        playerFace = [1, 1];
        break;
      case "LEFT":
        playerFace = [-1, 1];
        break;
      case "UP":
        playerFace = [1, 1];
        break;
      case "DOWN":
        playerFace = [1, -1];
        break;
    }
    // this.node.setScale(playerFace[0], playerFace[1], 1);
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {
    // console.log(otherCollider.node.name);
  }
}
