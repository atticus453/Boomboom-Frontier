import {
    PolygonCollider2D,
    Contact2DType,
    Collider2D,
    IPhysics2DContact,
    find,
    Prefab,
    instantiate,
    v2,
    v3,
    AudioSource,
    RigidBody2D,
    ParticleSystem,
    ParticleSystem2D
} from "cc";
import { _decorator, Component, Node } from 'cc';
import { PlayerManager } from "./Manager/PlayerManager";
import { Setting } from "./Setting";
const { ccclass, property } = _decorator;

@ccclass('Particle')
export class Particle extends Component {
    private playerManagerPath: string = "Canvas/PlayerManager";
  private playerManager = null;

  private isCollied = false;
  private isNodePooling = true;
  exploding: boolean = false;
  explode: Node = null;
  collideX: number = 0;
  collideY: number = 0;

  // @property(Prefab) explodePrefab: Prefab = null;
  particleLayerPath: string = "Canvas/particlePool";
  
  timeCnt: number = 0;
  

  protected onLoad(): void {
    // let collider = this.node.getComponent(PolygonCollider2D);
    // if (collider) {
    //   collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    //   collider.sensor = true;
    //   collider.on(Contact2DType.PRE_SOLVE, this.PreSolve);
    // }
    this.getComponent(ParticleSystem2D).resetSystem();
    this.getComponent(ParticleSystem2D).enabled = false;
    this.playerManager = find(this.playerManagerPath).getComponent(
      PlayerManager
    );
    let bullet = find(this.particleLayerPath)
    
    this.isNodePooling = this.playerManager.PoolMode;
    //set name
    this.node.name = "explode";
    

    //enable sensor

  }

  start() {
    // console.log(this.node.parent.name);
  }

  update(deltaTime: number) {
    if(this.timeCnt >= 0.5){
        if(this.isNodePooling){
          this.timeCnt = 0;  
          this.node.parent = null;
          this.node.position = v3(-1, -1, 0);
          this.getComponent(ParticleSystem2D).resetSystem();
          this.playerManager.recycleParticle(this.node);
          // this.node.destroy();
        }else{
          this.node.destroy();
        }
    }
    this.timeCnt += deltaTime;
    console.log("nowposition", this.node.position);
    
    this.getComponent(ParticleSystem2D).enabled = true;

    
    
    
    

  }
}

