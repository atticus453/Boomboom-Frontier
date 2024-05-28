import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventKeyboard,
  EventMouse,
  KeyCode,
  RigidBody2D,
  v2,
  v3,
  Prefab,
  instantiate,
  find,
  UITransform,
  math,
  NodePool,
} from "cc";
import { Player } from "./Player";

const { ccclass, property } = _decorator;

@ccclass("GameMgr")
export class GameMgr extends Component {
  @property
  public PoolMode: boolean = true;

  @property(Prefab)
  public bulletPrefab: Prefab = null;

  @property(Player)
  public player: Player = null;

  private bulletSpeed = 25;
  private playerDirX = 0;
  private playerDirY = 0;
  private playerFacingAngle = 0;
  private playerPreDir: string = "RIGHT";

  private isShooting = false;
  private isDragging = false;

  private bulletPool: NodePool = null;

  onLoad(): void {
    if (this.PoolMode) {
      this.bulletPool = new NodePool();

      for (let i = 0; i < 100; i++) {
        let bullet = instantiate(this.bulletPrefab);
        this.bulletPool.put(bullet);
      }
    }
  }

  start() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
  }

  update(deltaTime: number) {
    this.player.handleMove(
      this.playerDirX,
      this.playerDirY,
      this.playerFacingAngle,
      this.playerPreDir
    );
    this.handleUIMove();

    if (this.isShooting) this.scheduleOnce(this.handlePlayerShoot, 0.1);
  }

  handlePlayerShoot() {
    let bullet = null;
    if (this.PoolMode) bullet = this.createBullet();
    else bullet = instantiate(this.bulletPrefab);

    bullet.parent = find("Canvas/BulletPool");
    let bulletBody = bullet.getComponent(RigidBody2D);

    let bulletPosX: number,
      bulletPosY: number,
      bulletDir: number[] = [0, 0];

    bulletDir = this.changeAngleToUnitVec();

    bulletPosX = this.player.node.position.x + bulletDir[0] * 25;
    bulletPosY = this.player.node.position.y + bulletDir[1] * 25;

    bullet.setPosition(v3(bulletPosX, bulletPosY, 0));
    bulletBody.linearVelocity = v2(
      bulletDir[0] * this.bulletSpeed,
      bulletDir[1] * this.bulletSpeed
    );
  }

  onKeyDown(e: EventKeyboard) {
    switch (e.keyCode) {
      case KeyCode.KEY_W:
        this.playerDirY = 1;
        this.playerPreDir = "UP";
        console.log("up");
        break;
      case KeyCode.KEY_S:
        this.playerDirY = -1;
        this.playerPreDir = "DOWN";
        console.log("down");
        break;
      case KeyCode.KEY_A:
        this.playerDirX = -1;
        this.playerPreDir = "LEFT";
        console.log("left");
        break;
      case KeyCode.KEY_D:
        this.playerDirX = 1;
        this.playerPreDir = "RIGHT";
        console.log("right");
        break;
      case KeyCode.KEY_K:
        this.isShooting = true;
        break;
    }
  }

  onKeyUp(e: EventKeyboard) {
    switch (e.keyCode) {
      case KeyCode.KEY_W:
        this.playerDirY = 0;
        break;
      case KeyCode.KEY_S:
        this.playerDirY = 0;
        break;
      case KeyCode.KEY_A:
        this.playerDirX = 0;
        break;
      case KeyCode.KEY_D:
        this.playerDirX = 0;
        break;
      case KeyCode.KEY_K:
        this.isShooting = false;
        break;
    }
    console.log("stop");
  }

  onMouseDown(e: EventMouse) {
    switch (e.getButton()) {
      case 2: // BUTTON_RIGHT
        this.isDragging = true;
        break;
      case 0: // BUTTON_LEFT
        this.isShooting = true;
        console.log("BUTTON_LEFT");
        break;
    }
  }

  onMouseMove(e: EventMouse) {
    if (this.isDragging) {
      let deltaDist = this.node.parent
        .getComponent(UITransform)
        .convertToNodeSpaceAR(v3(e.getUILocation().x, e.getUILocation().y, 0));

      this.playerFacingAngle = math.toDegree(
        Math.atan2(deltaDist.y, deltaDist.x)
      );
    }
  }

  onMouseUp(e: EventMouse) {
    switch (e.getButton()) {
      case 2: // BUTTON_RIGHT
        this.playerDirY = 0;
        this.playerDirX = 0;
        this.isDragging = false;
        break;
      case 0: // BUTTON_LEFT
        this.isShooting = false;
        break;
    }
  }

  handleUIMove() {
    let Camera = find("/Canvas/Camera");
    let CameraPos = Camera.position;
    CameraPos.lerp(this.player.node.position, 0.1);
    Camera.setPosition(CameraPos.x, CameraPos.y, 0);
  }

  createBullet(): Node {
    let bullet: Node = null;
    if (this.bulletPool.size() > 0) {
      bullet = this.bulletPool.get();
    } else {
      bullet = instantiate(this.bulletPrefab);
    }
    return bullet;
  }

  recycleBullet(bullet: Node) {
    this.bulletPool.put(bullet);
  }

  changeAngleToUnitVec() {
    let radian =
      this.playerFacingAngle >= 0
        ? math.toRadian(this.playerFacingAngle)
        : math.toRadian(360 + this.playerFacingAngle);

    return [Math.cos(radian), Math.sin(radian)];
  }
}
