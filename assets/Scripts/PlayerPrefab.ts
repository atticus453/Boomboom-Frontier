import {
    _decorator,
    find,
    Component,
    KeyCode,
    input,
    RigidBody2D,
    EventKeyboard,
    Input,
    v2,
    Node,
    Prefab,
    BoxCollider2D,
    Contact2DType,
    Collider2D,
    IPhysics2DContact,
    instantiate,
    math,
    EventMouse,
    UITransform,
    v3,
    Sprite,
    Color,
    Game
} from "cc";

import GlobalManager from "./Manager/GlobalManager";
import { PlayerManager } from "./Manager/PlayerManager";
import PhotonManager from "./Manager/PhotonManager";
import GameManager from "./Manager/GameManager";

const { ccclass, property } = _decorator;

// In the Fucntion "handlePlayerShoot"
// There is a line need to be changed

@ccclass("PlayerPrefab")
export class PlayerPrefab extends Component {
    @property
    public playerSpeed: number = 10;

    @property(Prefab)
    public bulletPrefab: Prefab = null;

    @property(Prefab)
    public itemPrefab: Prefab = null;

    static itemBar: Node = null;

    // The path of the important Node in the scene
    private photonManagerPath: string = "Canvas/PhotonManager";
    private playerManagerPath: string = "Canvas/PlayerManager";
    private bulletLayerPath: string = "Canvas/BulletPool";

    // The Node in the scene
    private photonManager = null;
    private playerManager = null;
    private PlayerIndex: number = 0;

    // The properties of the bullet
    private bulletSpeed = 25;
    private fireRate = 0.2;
    private shootInterval = 0;

    // The properties of the player
    private preDir: string = "RIGHT";
    private dirX = 0;
    private dirY = 0;
    private angle = 0;
    private curItem: number = 0; // 0: weapon, 1: item

    // Some flags for judging the state of the player
    private isNodePooling = true;
    private isDragging = false;
    private isShooting = false;

    onLoad(): void {
        this.playerManager = find(this.playerManagerPath).getComponent(
            PlayerManager
        );

        this.photonManager = find(this.photonManagerPath).getComponent(
            PhotonManager
        );

        this.isNodePooling = this.playerManager.PoolMode;
    }

    start() {
        this.handleListener("LOAD");
        this.PlayerIndex = GlobalManager.instance.selectedPlayerIndex;

        PlayerPrefab.itemBar = instantiate(this.itemPrefab);
        PlayerPrefab.itemBar.position = v3(304.476, -223.456, 0);
        find("Canvas/Camera").addChild(PlayerPrefab.itemBar);
    }

    onDestroy() {
        this.handleListener("UNLOAD");
    }

    update(deltaTime: number) {
        let playerBody = this.node.getComponent(RigidBody2D);
        if (playerBody) {
            this.handlePlayerPosition();
            this.sendPosition();

            if (this.isShooting) {
                this.shootInterval -= deltaTime;
                if (this.shootInterval <= 0) {
                    this.handlePlayerShoot();
                    this.shootInterval = this.fireRate;
                }
            }

            if (this.curItem === 0) {
                PlayerPrefab.itemBar.getChildByPath("Weapon/WeaponBack").getComponent(Sprite).color = new Color(201, 197, 107, 255);
                PlayerPrefab.itemBar.getChildByPath("Item/ItemBack").getComponent(Sprite).color = new Color(255, 255, 255, 255);
            }
            else {
                PlayerPrefab.itemBar.getChildByPath("Weapon/WeaponBack").getComponent(Sprite).color = new Color(255, 255, 255, 255);
                PlayerPrefab.itemBar.getChildByPath("Item/ItemBack").getComponent(Sprite).color = new Color(201, 197, 107, 255);
            }
        }
    }

    sendPosition() {
        const position = this.node.position;
        if (this.photonManager) {
            this.photonManager.sendEvent(1, {
                x: position.x,
                y: position.y,
                PlayerIndex: this.PlayerIndex,
            });
        }
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
        }
        this.node.setScale(playerFace[0], playerFace[1]);

        // --Waiting For Change--
        //Here need to change the node to the gun
        this.node.setRotationFromEuler(0, 0, this.angle);
    }

    handlePlayerShoot() {
        // First create a bullet
        let bullet = null;
        if (this.isNodePooling) bullet = this.playerManager.createBullet();
        else bullet = instantiate(this.bulletPrefab);

        // Assign the bullet to the bullet layer
        bullet.parent = find(this.bulletLayerPath);
        let bulletBody = bullet.getComponent(RigidBody2D);

        let bulletPosX: number,
            bulletPosY: number,
            bulletDir: number[] = [0, 0];

        bulletDir = this.changeAngleToUnitVec();

        bulletPosX = this.node.position.x + bulletDir[0] * 25;
        bulletPosY = this.node.position.y + bulletDir[1] * 25;

        bullet.setPosition(bulletPosX, bulletPosY);
        bulletBody.linearVelocity = v2(
            bulletDir[0] * this.bulletSpeed,
            bulletDir[1] * this.bulletSpeed
        );
    }

    handlePickItem() {
        GameManager.isPickup = true;
        console.log("is picking up");
    }

    handleUseItem() {
        console.log("is using item");
        const item = PlayerPrefab.itemBar.getChildByPath("Item/ItemSprite").getComponent(Sprite).spriteFrame;
        if(item !== null) {
            if(item.name === "healing") {
                // console.log("healing");
            }
            else if(item.name === "speedUp") {
                this.playerSpeed = 15;
                this.scheduleOnce(() => {
                    this.playerSpeed = 10;
                }, 3);
            }
            PlayerPrefab.itemBar.getChildByPath("Item/ItemSprite").getComponent(Sprite).spriteFrame = null;
        }
        else {
            return;
        }
    }

    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact
    ) { }

    // The function to handle the listener
    // Use "LOAD" to open the listener
    // Use "UNLOAD" to close the listener
    handleListener(mode: string) {
        if (mode === "LOAD") {
            let collider = this.node.getComponent(BoxCollider2D);
            if (collider) {
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }

            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
            input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
            input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
            input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        } else if (mode === "UNLOAD") {
            let collider = this.node.getComponent(BoxCollider2D);
            if (collider) {
                collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }

            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
            input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
            input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
            input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        }
    }

    // Use the angle to calculate the unit vector
    changeAngleToUnitVec() {
        let radian =
            this.angle >= 0
                ? math.toRadian(this.angle)
                : math.toRadian(360 + this.angle);

        return [Math.cos(radian), Math.sin(radian)];
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.dirY = 1;
                this.preDir = "UP";
                // console.log("up");
                break;
            case KeyCode.KEY_S:
                this.dirY = -1;
                this.preDir = "DOWN";
                // console.log("down");
                break;
            case KeyCode.KEY_A:
                this.dirX = -1;
                this.preDir = "LEFT";
                // console.log("left");
                break;
            case KeyCode.KEY_D:
                this.dirX = 1;
                this.preDir = "RIGHT";
                // console.log("right");
                break;
            case KeyCode.KEY_K:
                this.isShooting = true;
                break;
            case KeyCode.KEY_F:
                this.handlePickItem();
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
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
            case KeyCode.KEY_K:
                this.isShooting = false;
                break;
        }
    }

    private onMouseMove(e: EventMouse) {
        if (this.isDragging) {
            let deltaDist = this.node.parent
                .getComponent(UITransform)
                .convertToNodeSpaceAR(v3(e.getUILocation().x, e.getUILocation().y, 0));

            this.angle = math.toDegree(Math.atan2(deltaDist.y, deltaDist.x));
        }
    }

    private onMouseDown(e: EventMouse) {
        switch (e.getButton()) {
            case 2: // BUTTON_RIGHT
                this.isDragging = true;
                break;
            case 0: // BUTTON_LEFT
                if(this.curItem === 0) {
                    this.isShooting = true;
                }
                else {
                    this.handleUseItem();
                }
                break;
        }
    }

    private onMouseUp(e: EventMouse) {
        switch (e.getButton()) {
            case 2: // BUTTON_RIGHT
                this.isDragging = false;
                break;
            case 0: // BUTTON_LEFT
                this.isShooting = false;
                break;
        }
    }

    private onMouseWheel(e: EventMouse) {
        // console.log(e.getScrollY());
        if (e.getScrollY() > 50) {
            this.curItem = 1;
        } else if(e.getScrollY() < -50){
            this.curItem = 0;
        }
    }
}
