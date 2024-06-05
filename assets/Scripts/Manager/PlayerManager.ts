// PlayerManager.ts
import {
  _decorator,
  Component,
  Node,
  instantiate,
  Prefab,
  find,
  NodePool,
} from "cc";
import GlobalManager from "./GlobalManager";
import { PlayerPrefab } from "../PlayerPrefab";
//import { PhotonManager } from './PhotonManager'; // 假设你有这样一个处理Photon事件的脚本
const { ccclass, property } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends Component {
  @property
  public PoolMode: boolean = true;

  @property(Prefab)
  playerPrefab: Prefab;

  @property(Prefab)
  bulletPrefab: Prefab;

  @property(Prefab) explodePrefab: Prefab;

  @property([Node])
  spawnPoints: Node[] = [];

  private playerParentPath: string = "Canvas/map1/ZorderByY";
  private playerParent: Node = null;
  private players: Node[] = [];

  private bulletPool: NodePool = null;
  private particlePool: NodePool = null;

  onLoad() {
    this.playerParent = find(this.playerParentPath);
    this.spawnPlayers();
    this.initializePlayers();
    this.initBulletPool();
    this.initParticlePool();
  }

  spawnPlayers() {
    const selectedIndex = GlobalManager.instance.selectedPlayerIndex;
    this.spawnPoints.forEach((spawnPoint) => {
      const player = instantiate(this.playerPrefab);
      player.setParent(this.playerParent);
      player.setPosition(spawnPoint.position);
      this.players.push(player);
    });
  }

  initializePlayers() {
    const selectedIndex = GlobalManager.instance.selectedPlayerIndex;
    this.players.forEach((player, index) => {
      const controlComponent = player.getComponent(PlayerPrefab);
      controlComponent.playerIndex = index+1;
      if (index === selectedIndex - 1) {
        // 激活该玩家的控制脚本
        player.name = `Player${index + 1}`;
        player.playerIndex = index + 1;
        controlComponent.enabled = true;
        //console.log("Player is controlled by the local player");
        // console.log(
        //   "Selected player index  and Index ",
        //   selectedIndex,
        //   " ",
        //   index
        // );
      } else {
        // 禁用其他玩家的控制脚本，但依然会接收位置更新
        player.name = `Player${index + 1}`;
        player.playerIndex = index + 1;
        controlComponent.enabled = true;
        // console.log("Player is controlled by the remote player");
        // console.log(
        //   "Selected player index  and Index ",
        //   selectedIndex,
        //   " ",
        //   index
        // );
      }
    });
  }

  initBulletPool() {
    if (this.PoolMode) {
      this.bulletPool = new NodePool();

      for (let i = 0; i < 100; i++) {
        let bullet = instantiate(this.bulletPrefab);
        this.bulletPool.put(bullet);
      }
    }
  }
  initParticlePool(){
    if(this.PoolMode){
      this.particlePool = new NodePool();

      for (let i = 0; i < 100; i++) {
        let explode = instantiate(this.explodePrefab);
        this.particlePool.put(explode);
      }
    }
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
  createParticle(x: number, y: number): Node {
    console.log("createParticle");
    let explode: Node = null;
    if (this.particlePool.size() > 0) {
      explode = this.particlePool.get();
      console.log("getPos", explode.position.x, explode.position.y);
    } else {
      explode = instantiate(this.explodePrefab);
    }
    console.log("manager", x, y);
    explode.setPosition(x, y);
    return explode;
  }

  recycleBullet(bullet: Node) {
    this.bulletPool.put(bullet);
  }
  recycleParticle(explode: Node) {
    this.particlePool.put(explode);
  }

  updateHealth(playerIndex: number, damage: number) {
    const playerNode = this.players[playerIndex - 1]; // 假设playerIndex是从1开始的
    if (playerNode) {
      const playerComponent = playerNode.getComponent(PlayerPrefab);
      if (playerComponent) {
        playerComponent.updateHealth(damage);
      }
    } else {
      console.log("Player node not found for index: ", playerIndex);
    }
  }

  handlePlayerShoot(playerIndex: number) {
    const playerNode = this.players[playerIndex - 1]; // 假设playerIndex是从1开始的
    if (playerNode) {
      const playerComponent = playerNode.getComponent(PlayerPrefab);
      if (playerComponent) {
        playerComponent.handlePlayerShoot();
      }
    } else {
      console.log("Player node not found for index: ", playerIndex);
    }
  }
  
}
