const { ccclass, property } = _decorator;
import {
  _decorator,
  Component,
  EditBox,
  Button,
  log,
  Vec3,
  Vec2,
  Node,
  PolygonCollider2D,
  Contact2DType,
  RigidBody2D,
  v2,
  Collider2D,
  IPhysics2DContact,
  find,
} from "cc";
// import Photon Photon-Javascript_SDK on the following line

import { PlayerManager } from "./PlayerManager";
import { PlayerPrefab } from "../PlayerPrefab";

@ccclass("PhotonManager")
export default class PhotonManager extends Component {
  static appId: string = "db787735-3afa-454d-804f-04814bf4b429"; // Photon Application ID

  public appVersion: string = "1.0"; // Photon Application Version

  public region: string = "us"; // Photon Server Region

  static loadBalancingClient: Photon.LoadBalancing.LoadBalancingClient = null;

  static instance: PhotonManager;

  onLoad() {
    this.initializePhoton();
    PhotonManager.instance = this;
  }

  initializePhoton() {
    if (PhotonManager.loadBalancingClient === null) {
      PhotonManager.loadBalancingClient =
        new Photon.LoadBalancing.LoadBalancingClient(
          Photon.ConnectionProtocol.Wss,
          PhotonManager.appId,
          this.appVersion
        );

      if (PhotonManager.loadBalancingClient) {
        console.log("Photon LoadBalancingClient initialized");
      }

      // PhotonManager.loadBalancingClient.setLogger(this.logger);
      PhotonManager.loadBalancingClient.onStateChange =
        this.onStateChange.bind(this);
      PhotonManager.loadBalancingClient.onEvent = this.onEvent.bind(this);
      PhotonManager.loadBalancingClient.onError = this.onError.bind(this);
      PhotonManager.loadBalancingClient.onRoomListUpdate =
        this.onRoomListUpdate.bind(this);
      PhotonManager.loadBalancingClient.onJoinRoom = this.onJoinRoom.bind(this);
      PhotonManager.loadBalancingClient.onActorJoin =
        this.onActorJoin.bind(this);
      PhotonManager.loadBalancingClient.onActorLeave =
        this.onActorLeave.bind(this);
      this.connect();
    }
  }

  connect() {
    try {
      PhotonManager.loadBalancingClient.connectToRegionMaster(this.region);
      console.log("Photon connected to region:", this.region);
    } catch (error) {
      // this.logger.error("Error:", error);
      console.error("Error:", error);
    }
  }

  createRoom(roomName: string): boolean {
    const options = {
      isVisible: true,
      isOpen: true,
      maxPlayers: 4,
    };
    const res = PhotonManager.loadBalancingClient.createRoom(roomName, options);
    console.log("Room created:", res);
    return res;
  }

  joinRoom(roomName: string): boolean {
    const joinOptions = {
      createIfNotExists: false, // Don't create room if it doesn't exist
      rejoin: false, // Don't rejoin after disconnect
    };

    const res = PhotonManager.loadBalancingClient.joinRoom(
      roomName,
      joinOptions,
      undefined,
      {
        onJoinRoom: () => {
          console.log("Successfully joined room:", roomName);
        },
        onError: (errorCode, errorMessage) => {
          console.log("Failed to join room:", errorCode, errorMessage);
          // Implement UI feedback or alternative actions here
        },
      }
    );

    return res;
  }

  onStateChange(state: number) {
    // this.logger.info("State:", state);
    log("State:", state);
    switch (state) {
      case Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby:
        // this.logger.info("Joined Lobby");
        log("Joined Lobby");
        break;
      case Photon.LoadBalancing.LoadBalancingClient.State.Joined:
        // this.logger.info("Joined Room");
        log("Joined Room");
        break;
    }
  }

  onError(errorCode: number, errorMsg: string) {
    // this.logger.error("Error:", errorCode, "Message:", errorMsg);
    console.log("Error:", errorCode, "Message:", errorMsg);
  }

  onRoomListUpdate(rooms: any[]) {
    // this.logger.info("Room List Update:", rooms);
    console.log("Room List Update:", rooms);
    // Handle room list updates
  }

  onJoinRoom() {
    // this.logger.info("Joined Room");
    console.log("Joined Room");
    // Handle room join success
  }

  onActorJoin(actor: any) {
    //this.logger.info("Actor Join:", actor);
    console.log("Actor Join:", actor);
    // Handle actor join
  }

  onActorLeave(actor: any) {
    // this.logger.info("Actor Leave:", actor);
    console.log("Actor Leave:", actor);
    // Handle actor leave
  }

  // joinRoom(roomName: string) {
  //     PhotonManager.loadBalancingClient.joinRoom(roomName);
  // }

  leaveRoom() {
    PhotonManager.loadBalancingClient.leaveRoom();
  }

  sendEvent(eventCode: number, data: any) {
    // Ensure the loadBalancingClient is initialized and connected before trying to send events
    if (
      PhotonManager.loadBalancingClient &&
      PhotonManager.loadBalancingClient.isJoinedToRoom()
    ) {
      try {
        // Sending the event to all other players in the room
        // raiseEvent(eventCode: number, data: any, options: RaiseEventOptions)
        PhotonManager.loadBalancingClient.raiseEvent(eventCode, data, {
          // Targets.MasterClient can be used if you want to send data to only the master client
          // For this example, we'll broadcast to everyone including the sender
          target: Photon.LoadBalancing.Constants.ReceiverGroup.Others,
          // Using reliable: true to ensure delivery
          sendReliable: false,
        });
        //console.log("Event sent successfully", eventCode, data);
      } catch (error) {
        console.error("Failed to send event", eventCode, data, error);
      }
    } else {
      //console.error("Cannot send event, client is not connected to a room or loadBalancingClient is not initialized.");
    }
  }

  onEvent(code: number, content: any, actorNr: number) {
    //console.log("Event:", code, "Content:", content, "Actor:", actorNr);
    if (code === 4) {
      // 假设 '1' 是位置更新的事件代码
      this.updatePlayerPosition(content);
    } else if (code === 2) {
      // 处理血量更新事件
      this.updatePlayerHealth(content);
    } else if (code === 1) {
      this.handleShootEvent(content);
    } else if (code === 3) {
      this.updatePlayerFace(content);
    } else if (code === 6) {
      this.playerDeadMessage(content);
    }
  }

  playerDeadMessage(content: any) {
    const playerManagerNode = find(`Canvas/PlayerManager`);
    if (playerManagerNode) {
      const playerManager = playerManagerNode.getComponent(PlayerManager);
      if (playerManager) {
        playerManager.playerDeadMessage(content.PlayerIndex);
      }
    }
  }

  updatePlayerPosition(content: any) {
    // 使用 content 中的 selectedIndex 来找到对应的玩家节点
    const playerNode = find(
      `Canvas/map1/ZorderByY/Player${content.PlayerIndex}`
    );
    if (playerNode) {
      playerNode.setPosition(
        new Vec3(content.x, content.y, playerNode.position.z)
      ); // 假设 z 坐标不变
      playerNode.getComponent(PlayerPrefab).angle = content.angle;
      playerNode
        .getComponent(PlayerPrefab)
        .gunNode.setRotationFromEuler(0, 0, content.angle);
      //playerNode.setScale(content.face ,1);
    } else {
      console.log("Player node not found for index: ", content.PlayerIndex);
    }
  }

  updatePlayerFace(content: any) {
    const playerNode = find(
      `Canvas/map1/ZorderByY/Player${content.PlayerIndex}`
    );
    if (playerNode) {
      playerNode.setScale(content.face * -1, 1);
    } else {
      console.log("Player node not found for index: ", content.PlayerIndex);
    }
  }

  updatePlayerHealth(content: any) {
    // 使用 content 中的 selectedIndex 来找到对应的玩家节点d
    const playerManagerNode = find(`Canvas/PlayerManager`);
    if (playerManagerNode) {
      const playerManager = playerManagerNode.getComponent(PlayerManager);
      if (playerManager) {
        playerManager.updateHealth(content.PlayerIndex, content.Damage);
      }
    }
  }

  handleShootEvent(content: any) {
    const playerManagerNode = find(`Canvas/PlayerManager`);
    if (playerManagerNode) {
      const playerManager = playerManagerNode.getComponent(PlayerManager);
      if (playerManager) {
        playerManager.handlePlayerShoot(content.PlayerIndex);
      }
    }
  }

  getLoadBalancingClient() {
    return PhotonManager.loadBalancingClient;
  }
}
