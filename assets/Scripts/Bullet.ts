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
  v3,
  AudioSource,
  RigidBody2D
} from "cc";

import { PlayerManager } from "./Manager/PlayerManager";
import { Setting } from "./Setting";

const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  private playerManagerPath: string = "Canvas/PlayerManager";
  private playerManager = null;

  private isCollied = false;
  private isNodePooling = true;
  exploding: boolean = false;
  explode: Node = null;
  collideX: number = 0;
  collideY: number = 0;

  @property(Prefab) explodePrefab: Prefab = null;
  particleLayerPath: string = "Canvas/particlePool";
  

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
    this.collideX = 0;
    this.collideY = 0;
    this.isNodePooling = this.playerManager.PoolMode;
    //set name
    this.node.name = "Bullet";
    this.exploding = false;
    this.isCollied = false;

    //enable sensor

  }

  start() {
    // console.log(this.node.parent.name);
  }

  update(deltaTime: number) {
    if (this.isCollied) {
      console.log("Bullet is collied");
      // if(this.explode == null){
      //   this.explode = instantiate(this.explodePrefab);
      //   this.explode.setPosition(v3(this.node.position.x, this.node.position.y, 0));
      //   find("Canvas").addChild(this.explode);
      // }
      // if(this.explode == null){
      if(this.exploding == false){
        console.log("createpos", this.node.position);
        this.explode = this.handleExplode();
        console.log("afterset", this.explode.position.x, this.explode.position.y);
      }
      if (this.isNodePooling && this.isCollied) {
        this.collideX = -1;
        this.collideY = -1;
        this.isCollied = false;
        this.exploding = false;
        this.explode = null;
        this.playerManager.recycleBullet(this.node);
        
        
        this.scheduleOnce(() => {
          if(this.explode){
            // this.playerManager.recycleParticle(this.explode);
            this.explode = null;
            
          }
          
          // this.playerManager.recycleBullet(this.node);
        }, 0.5)

      } else {
        this.node.destroy();
        // this.scheduleOnce(() => {
        //   if(this.explode){
        //     this.explode.destroy();
        //     this.explode = null;
        //     this.exploding = false;
        //   } 
        //   this.node.destroy();
        // }, 0.5)
      }
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {
    // if(this.collideX == 0 && this.collideY == 0){
      this.collideX = selfCollider.node.position.x;
      this.collideY = selfCollider.node.position.y;
    // }
    if (
      otherCollider.node.parent.name === "Barriers" ||
      otherCollider.node.name === "tree" ||
      otherCollider.node.name === "Player1" ||
      otherCollider.node.name === "Player2" ||
      otherCollider.node.name === "Player3" 
    ) {
      
      
      this.isCollied = true;
      console.log("collide", contact.getWorldManifold().points);
    }
  }
  PreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact){
    if(otherCollider.tag == 3){
      contact.disabled = true;
    }
  }

  handleExplode() {
    // First create a bullet
    // this.exploding = true;
    this.scheduleOnce(() => {this.exploding = false}, 1);
    let bullet = null;
    let bulletPosX = this.node.position.x;
    let bulletPosY = this.node.position.y;
    if (this.isNodePooling){
      bullet = this.playerManager.createParticle(this.collideX, this.collideY);
      console.log("parent", bullet.parent);
      bullet.setPosition(v3(this.collideX, this.collideY, 0));
      // this.scheduleOnce(() => {
      //   bullet.setPosition(-1, -1);
      //   this.playerManager.recycleParticle(bullet);
      // }, 0.5);
    } 
    else{
      bullet = instantiate(this.explodePrefab);
      bullet.setPosition(v3(this.collideX, this.collideY, 0));
      // this.scheduleOnce(() => {
      //   bullet.destroy();
      // }, 0.5)
    } 
    // bullet.setPosition(v3(0, 0, 0));
    console.log("position old", bullet.position.x, bullet.position.y);
    console.log("player", find("Canvas/map1/ZorderByY/Player1").position.x, find("Canvas/map1/ZorderByY/Player1").position.y);
    console.log("position", this.node.position.x, this.node.position.y);
    bullet.parent = find(this.particleLayerPath);
    bullet.setPosition(this.node.position.x, this.node.position.y);

    // bullet.setPosition(656, -104);
    console.log("setPos", bullet.position.x, bullet.position.y);
    
    

    
    // this.scheduleOnce(() => {bullet.parent = find(this.particleLayerPath)}, 0.2);
    
    return bullet;
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
