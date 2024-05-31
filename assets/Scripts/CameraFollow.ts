import { _decorator, Component, Node, Vec3, find } from "cc";
import GlobalManager from "./Manager/GlobalManager";
const { ccclass, property } = _decorator;

@ccclass("CameraFollow")
export class CameraFollow extends Component {
  @property(Node)
  target: Node = null; // Target node to follow

  start() {
    this.updateTarget(); // Update target on start
  }

  update(dt: number) {
    if (this.target) {
      let CameraPos = this.node.position;
      CameraPos.lerp(this.target.position, 0.1);
      this.node.setPosition(CameraPos.x, CameraPos.y, 0);
    }
  }

  updateTarget() {
    const selectedIndex = GlobalManager.instance.selectedPlayerIndex;
    const playerPath = `Canvas/map1/ZorderByY/Player${selectedIndex}`;
    const playerNode = find(playerPath);
    if (playerNode) {
      this.target = playerNode;
      console.log("CameraFollow: Target updated to", playerPath);
    } else {
      console.error(
        "CameraFollow: Failed to find player node at path:",
        playerPath
      );
    }
  }
}
