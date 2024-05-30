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

@ccclass("PhotonManager")
export default class PhotonManager extends Component {
  @property(String)
  appId: string = "db787735-3afa-454d-804f-04814bf4b429"; // Photon Application ID

  @property(String)
  appVersion: string = "1.0"; // Photon Application Version

  @property({ type: String })
  region: string = "us"; // Photon Server Region

  @property(EditBox)
  roomNameInput: EditBox = null;

  @property(Button)
  createRoomButton: Button = null;

  @property(Button)
  joinRoomButton: Button = null;

  private loadBalancingClient: Photon.LoadBalancing.LoadBalancingClient = null;

  onLoad() {
    this.initializePhoton();
    console.log("PhotonManager loaded");
    this.createRoomButton.node.on("click", this.onCreateRoomClicked, this);
    this.joinRoomButton.node.on("click", this.onJoinRoomClicked, this);
  }

  initializePhoton() {
    this.loadBalancingClient = new Photon.LoadBalancing.LoadBalancingClient(
      Photon.ConnectionProtocol.Wss,
      this.appId,
      this.appVersion
    );

    if (this.loadBalancingClient) {
      console.log("Photon LoadBalancingClient initialized");
    }

    // this.loadBalancingClient.setLogger(this.logger);
    this.loadBalancingClient.onStateChange = this.onStateChange.bind(this);
    this.loadBalancingClient.onEvent = this.onEvent.bind(this);
    this.loadBalancingClient.onError = this.onError.bind(this);
    this.loadBalancingClient.onRoomListUpdate =
      this.onRoomListUpdate.bind(this);
    this.loadBalancingClient.onJoinRoom = this.onJoinRoom.bind(this);
    this.loadBalancingClient.onActorJoin = this.onActorJoin.bind(this);
    this.loadBalancingClient.onActorLeave = this.onActorLeave.bind(this);
    this.connect();
  }

  connect() {
    try {
      this.loadBalancingClient.connectToRegionMaster(this.region);
      console.log("Photon connected to region:", this.region);
    } catch (error) {
      // this.logger.error("Error:", error);
      console.error("Error:", error);
    }
  }

  createRoom(roomName: string) {
    const options = {
      isVisible: true,
      isOpen: true,
      maxPlayers: 4,
    };
    this.loadBalancingClient.createRoom(roomName, options);
  }

  onCreateRoomClicked() {
    const roomName = this.roomNameInput.string;
    if (roomName) {
      this.createRoom(roomName);
    } else {
      console.log("Please enter a room name.");
      // Optionally show this message on the UI
    }
  }

  onJoinRoomClicked() {
    const roomName = this.roomNameInput.string;
    if (roomName) {
      this.joinRoom(roomName);
    } else {
      console.log("Please enter a room name.");
      // Optionally show this message on the UI
    }
  }

  joinRoom(roomName: string) {
    const joinOptions = {
      createIfNotExists: false, // Don't create room if it doesn't exist
      rejoin: false, // Don't rejoin after disconnect
    };

    this.loadBalancingClient.joinRoom(roomName, joinOptions, undefined, {
      onJoinRoom: () => {
        console.log("Successfully joined room:", roomName);
      },
      onError: (errorCode, errorMessage) => {
        console.log("Failed to join room:", errorCode, errorMessage);
        // Implement UI feedback or alternative actions here
      },
    });
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
  //     this.loadBalancingClient.joinRoom(roomName);
  // }

  leaveRoom() {
    this.loadBalancingClient.leaveRoom();
  }

  sendEvent(eventCode: number, data: any) {
    // Ensure the loadBalancingClient is initialized and connected before trying to send events
    if (this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
      try {
        // Sending the event to all other players in the room
        // raiseEvent(eventCode: number, data: any, options: RaiseEventOptions)
        this.loadBalancingClient.raiseEvent(eventCode, data, {
          // Targets.MasterClient can be used if you want to send data to only the master client
          // For this example, we'll broadcast to everyone including the sender
          target: Photon.LoadBalancing.Constants.ReceiverGroup.Others,
          // Using reliable: true to ensure delivery
          sendReliable: true,
        });
        console.log("Event sent successfully", eventCode, data);
      } catch (error) {
        console.error("Failed to send event", eventCode, data, error);
      }
    } else {
      //console.error("Cannot send event, client is not connected to a room or loadBalancingClient is not initialized.");
    }
  }

  onEvent(code: number, content: any, actorNr: number) {
    console.log("Event:", code, "Content:", content, "Actor:", actorNr);
    if (code === 1) {
      // 假设 '1' 是位置更新的事件代码
      this.updatePlayerPosition(content);
    }
  }

  updatePlayerPosition(content: any) {
    // 使用 content 中的 selectedIndex 来找到对应的玩家节点
    const playerNode = find(
      `Canvas/PlayerManager/Player${content.PlayerIndex}`
    );
    if (playerNode) {
      playerNode.setPosition(
        new Vec3(content.x, content.y, playerNode.position.z)
      ); // 假设 z 坐标不变
    } else {
      console.log("Player node not found for index: ", content.PlayerIndex);
    }
  }
}
