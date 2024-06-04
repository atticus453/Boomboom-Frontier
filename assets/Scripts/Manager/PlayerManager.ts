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

@ccclass("PlayerManager")
export class PlayerManager extends Component {
  @property
  public PoolMode: boolean = true;

  @property(Prefab)
  playerPrefab: Prefab;

  @property(Prefab)
  bulletPrefab: Prefab;

  @property([Node])
  spawnPoints: Node[] = [];

  private playerParentPath: string = "Canvas/map1/ZorderByY";
  private playerParent: Node = null;
  private players: Node[] = [];
  private roomId: number = 0;
  private currentUserUid: string = "";
  private currentUserIndex: number = -1;

  private bulletPool: NodePool = null;

  onLoad() {
    this.playerParent = find(this.playerParentPath);
    this.roomId = MultiRoom.roomID;
    this.spawnPlayers();
    // this.initializePlayers();
    this.initBulletPool();
    this.loadRoomUsers();
    this.currentUserUid = firebase.auth().currentUser.uid;
  }

  async loadRoomUsers() {
    try {
      const roomRef = firebase.database().ref('rooms/' + this.roomId);
      const snapshot = await roomRef.once('value');
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

  // initializePlayers(users: string[]) {
  //   const selectedIndex = GlobalManager.instance.selectedPlayerIndex;
  //   this.players.forEach((player, index) => {
  //     const controlComponent = player.getComponent(PlayerPrefab);
  //     controlComponent.playerIndex = index+1;
  //     if (users && users[index]) {
  //       // 激活该玩家的控制脚本
  //       player.name = `Player${index + 1}`;
  //       player.playerIndex = index + 1;
  //       controlComponent.enabled = true;
  //       //console.log("Player is controlled by the local player");
  //       // console.log(
  //       //   "Selected player index  and Index ",
  //       //   selectedIndex,
  //       //   " ",
  //       //   index
  //       // );
  //     } else {
  //       // 禁用其他玩家的控制脚本，但依然会接收位置更新
  //       player.name = `Player${index + 1}`;
  //       player.playerIndex = index + 1;
  //       controlComponent.enabled = true;
  //       player.active = false;
  //       // console.log("Player is controlled by the remote player");
  //       // console.log(
  //       //   "Selected player index  and Index ",
  //       //   selectedIndex,
  //       //   " ",
  //       //   index
  //       // );
  //     }
  //   });
  // }
  async initializePlayers(users: { [key: string]: string }) {
    const userIds = Object.values(users); // 获取所有用户 ID
    for (let index = 1; index < userIds.length; index++) {
      const userId = userIds[index];
      const player = this.players[index-1];
      const controlComponent = player.getComponent(PlayerPrefab);
      //controlComponent.playerIndex = index + 1;
      //player.name = `Player${index + 1}`;
      console.log("Now index is ", index);
      console.log("USER LENGTH IS ", userIds.length);
      
      if (userId !== "dummy" && index < userIds.length) {
        try {
          const userSnapshot = await firebase.database().ref('users/' + userId).once('value');
          if (userSnapshot.exists()) {
            const user = userSnapshot.val();
            controlComponent.enabled = true;
            controlComponent.character = user.skin; // 假设 PlayerPrefab 有 setSkin 方法来设置皮肤
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
      }
    }

    for(let index = userIds.length; index < 5; index++) {
      const player = this.players[index-1];
      player.active = false;
    }
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
