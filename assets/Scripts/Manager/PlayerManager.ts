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
import { MultiRoom } from "../MultiRoom";
import { MultiSelect } from "../MultiSelect";
//import { PhotonManager } from './PhotonManager'; // 假设你有这样一个处理Photon事件的脚本
const { ccclass, property } = _decorator;
export let userIdList = [];

@ccclass("PlayerManager")
export class PlayerManager extends Component {
  @property
  public PoolMode: boolean = true;

  @property(Prefab)
  playerPrefab: Prefab;

  @property(Prefab)
  bulletPrefab: Prefab;

  @property(Prefab)
  bulletPrefab2: Prefab;
  @property(Prefab)
  bulletPrefab3: Prefab;
  @property(Prefab)
  bulletPrefab4: Prefab;
  

  @property(Prefab) explodePrefab: Prefab;

  @property([Node])
  spawnPoints: Node[] = [];

  private playerParentPath: string = "Canvas/map1/ZorderByY";
  private playerParent: Node = null;
  private players: Node[] = [];
  private roomId: number = 0;
  private currentUserUid: string = "";
  private currentUserIndex: number = -1;

  private bulletPool: NodePool = null;
  private particlePool: NodePool = null;
  private bulletPool2: NodePool = null;
  private bulletPool3: NodePool = null;
  private bulletPool4: NodePool = null;

  static userNumber: number = 0;

  onLoad() {
    this.playerParent = find(this.playerParentPath);
    this.roomId = MultiRoom.roomID;
    this.spawnPlayers();
    this.initBulletPool();
    console.log("init bullet pool");
    this.initParticlePool();
    this.loadRoomUsers();
    this.currentUserUid = firebase.auth().currentUser.uid;
  }

  async loadRoomUsers() {
    try {
      const roomRef = firebase.database().ref("rooms/" + this.roomId);
      const snapshot = await roomRef.once("value");
      if (snapshot.exists()) {
        const room = snapshot.val();
        const users = room.users;
        this.initializePlayers(users);
      }
    } catch (error) {
      console.error("Error loading room users: ", error);
    }
  }

  spawnPlayers() {
    GlobalManager.instance.selectedPlayerIndex = MultiSelect.userIndex;
    const selectedIndex = GlobalManager.instance.selectedPlayerIndex;
    let index = 0;
    this.spawnPoints.forEach((spawnPoint) => {
      const player = instantiate(this.playerPrefab);
      player.setParent(this.playerParent);
      player.setPosition(spawnPoint.position);
      player.getComponent(PlayerPrefab).playerIndex = index + 1;
      player.name = `Player${index + 1}`;
      index++;
      this.players.push(player);
    });
  }

  async initializePlayers(users: { [key: string]: string }) {
    const userIds = Object.values(users); // 获取所有用户 ID
    userIdList = userIds;
    console.log("userids", userIds);
    for (let index = 1; index < userIds.length; index++) {
      const userId = userIds[index];
      const player = this.players[index - 1];
      const controlComponent = player.getComponent(PlayerPrefab);
      //controlComponent.playerIndex = index + 1;
      //player.name = `Player${index + 1}`;
      console.log("Now index is ", index);
      console.log("USER LENGTH IS ", userIds.length);
      PlayerManager.userNumber = userIds.length - 1;

      if (userId !== "dummy" && index < userIds.length) {
        try {
          const userSnapshot = await firebase
            .database()
            .ref("users/" + userId)
            .once("value");
          if (userSnapshot.exists()) {
            const user = userSnapshot.val();
            controlComponent.enabled = true;
            controlComponent.setSkin(user.skin); // 假设 PlayerPrefab 有 setSkin 方法来设置皮肤
            //controlComponent.playerIndex = index;
            console.log("Player is ins and index is ", index);

            if (userId === this.currentUserUid) {
              this.currentUserIndex = index;
            }
          }
        } catch (error) {
          console.error("Error loading user data: ", error);
        }
      } else {
        player.active = false;
        console.log("Player is not ins and index is ", index);
        // console.log("userId", userId);
      }
    }

    for (let index = userIds.length; index < 5; index++) {
      const player = this.players[index - 1];
      player.active = false;
    }
  }

  initBulletPool() {
    if (this.PoolMode) {
      this.bulletPool = new NodePool();
      console.log("initiate bullet pool");
      for (let i = 0; i < 100; i++) {
        let bullet = instantiate(this.bulletPrefab);
        this.bulletPool.put(bullet);
      }

      this.bulletPool2 = new NodePool();
      for (let i = 0; i < 100; i++) {
        let bullet2 = instantiate(this.bulletPrefab2);
        this.bulletPool2.put(bullet2);
      }
      this.bulletPool3 = new NodePool();
      for (let i = 0; i < 100; i++) {
        let bullet3 = instantiate(this.bulletPrefab3);
        this.bulletPool3.put(bullet3);
      }
      this.bulletPool4 = new NodePool();
      for (let i = 0; i < 100; i++) {
        let bullet4 = instantiate(this.bulletPrefab4);
        this.bulletPool4.put(bullet4);
      }
    }
  }
  initParticlePool(){
    if(this.PoolMode){
      this.particlePool = new NodePool();
      console.log("initiate pool");
      for (let i = 0; i < 100; i++) {
        let explode = instantiate(this.explodePrefab);
        this.particlePool.put(explode);
      }
    }
  }


  createBullet(index: number = 1): Node {
    let bullet: Node = null;
    // if (this.bulletPool.size() > 0) {
    //   bullet = this.bulletPool.get();
    // } else {
    //   bullet = instantiate(this.bulletPrefab);
    // }
    let targetPool: NodePool = null;
    let targetPrefab: Prefab = null;
    if(index == 1){
      targetPool = this.bulletPool;
      targetPrefab = this.bulletPrefab;
    }else if(index == 2){
      targetPool = this.bulletPool2;
      targetPrefab = this.bulletPrefab2;
    }else if(index == 3){
      targetPool = this.bulletPool3;
      targetPrefab = this.bulletPrefab3;
      
    }else if(index == 4){
      targetPool = this.bulletPool4;
      targetPrefab = this.bulletPrefab4;
    }
    if (targetPool.size() > 0) {
      bullet = targetPool.get();
      console.log("get bullet");
    } else {
      bullet = instantiate(targetPrefab);
    }


    return bullet;
  }
  createParticle(x: number, y: number): Node {
    console.log("createParticle");
    let explode: Node = null;
    if (this.particlePool.size() > 0) {
      explode = this.particlePool.get();
      console.log("have nodepool");
    } else {
      explode = instantiate(this.explodePrefab);
      console.log("deon't have node pool");
    }
    console.log("manager", x, y);
    explode.setPosition(x, y);
    return explode;
  }

  recycleBullet(bullet: Node, index: number = 1) {
    let targetPool: NodePool = null;
    let targetPrefab: Prefab = null;
    if(index == 1){
      targetPool = this.bulletPool;
      targetPrefab = this.bulletPrefab;
    }else if(index == 2){
      targetPool = this.bulletPool2;
      targetPrefab = this.bulletPrefab2;
    }else if(index == 3){
      targetPool = this.bulletPool3;
      targetPrefab = this.bulletPrefab3;
    }else if(index == 4){
      targetPool = this.bulletPool4;
      targetPrefab = this.bulletPrefab4;
    }
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

  playerDeadMessage(playerIndex: number) {
    const playerNode = this.players[this.currentUserIndex - 1]; // 假设playerIndex是从1开始的
    const deadPlayerNode = this.players[playerIndex - 1];
    if (playerNode) {
      const playerComponent = playerNode.getComponent(PlayerPrefab);
      if (playerComponent) {
        playerComponent.receiveDeathEvent();
      }
    } else {
      console.log("Player node not found for index: ", playerIndex);
    }

    if (deadPlayerNode) {
      const deadPlayerComponent = deadPlayerNode.getComponent(PlayerPrefab);
      deadPlayerComponent.handleSupportPlayerDeath();
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
