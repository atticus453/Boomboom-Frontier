import {
  _decorator,
  Component,
  PolygonCollider2D,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
  find,
  Prefab,
  instantiate,
  Node,
  v2,
  v3
} from "cc";

import { PlayerManager } from "./Manager/PlayerManager";

const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  private playerManagerPath: string = "Canvas/PlayerManager";
  private playerManager = null;

  private isCollied = false;
  private isNodePooling = true;
  exploding: boolean = false;
  explode: Node = null;

  @property(Prefab) explodePrefab: Prefab = null;
  

  protected onLoad(): void {
    let collider = this.node.getComponent(PolygonCollider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      collider.sensor = true;
      collider.on(Contact2DType.PRE_SOLVE, this.PreSolve);
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
      if(this.explode == null){
        this.explode = instantiate(this.explodePrefab);
        this.explode.setPosition(v3(this.node.position.x, this.node.position.y, 0));
        find("Canvas").addChild(this.explode);
      }
      if (this.isNodePooling) {
        this.playerManager.recycleBullet(this.node);
        this.isCollied = false;
        
        this.scheduleOnce(() => {
          if(this.explode){
            this.explode.destroy();
            this.explode = null;
          } 
            
        }, 0.5)
          
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
  PreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact){
    if(otherCollider.tag == 3){
      contact.disabled = true;
    }
  }
}

// import {
//   _decorator,
//   Component,
//   Node,
//   PolygonCollider2D,
//   Contact2DType,
//   RigidBody2D,
//   v2,
//   Collider2D,
//   IPhysics2DContact,
//   find,
//   Prefab,
//   instantiate,
//   v3,
// } from "cc";
// import { GameMgr } from "./GameMgr";
// import { PlayerManager } from "./Manager/PlayerManager";

// const { ccclass, property } = _decorator;

// @ccclass("Bullet")
// export class Bullet extends Component {
//   private isCollied = false;
//   @property(Prefab) explodePrefab: Prefab = null;

//   private gameMgr = null;
//   exploding: boolean = false;
//   explode: Node = null;

//   protected onLoad(): void {
//     let collider = this.node.getComponent(PolygonCollider2D);
//     if (collider) {
//       collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
//       collider.on(Contact2DType.PRE_SOLVE, this.PreSolve);
//     }

//     this.gameMgr = find("Canvas/PlayerManager").getComponent(PlayerManager);
//   }

//   start() {
//     // console.log(this.node.parent.name);
//   }

//   update(deltaTime: number) {
//     if (this.isCollied) {
//       if(this.explode == null){
//         this.explode = instantiate(this.explodePrefab);
//         this.explode.setPosition(v3(this.node.position.x, this.node.position.y, 0));
//         find("Canvas").addChild(this.explode);
//       }
//       // let explode = instantiate(this.explodePrefab);
//       // explode.setPosition(v3(this.node.position.x, this.node.position.y, 0));
//       // find("Canvas").addChild(explode);
//       if (this.isCollied) {
//         console.log("Bullet is collied");
//         if (this.gameMgr.PoolMode) {
//           this.gameMgr.bulletPool.put(this.node);
//           this.exploding = true;
//           this.scheduleOnce(() => {
//             if(this.explode){
//               this.explode.destroy();
//               this.explode = null;
//             } 
            
//           }, 0.5)
          
//           this.isCollied = false;
//         } else this.node.destroy();
//       }
//     }
//   }

//   onBeginContact(
//     selfCollider: Collider2D,
//     otherCollider: Collider2D,
//     contact: IPhysics2DContact
//   ) {
//     if (otherCollider.node.parent.name === "Barriers") {
//       this.isCollied = true;
//     }
//   }
//   PreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact){
//     if(otherCollider.tag == 3){
//       contact.disabled = true;
//     }
//   }
// }
