// SelectPlayerControl.ts
import { _decorator, Component, Node, director } from "cc";
import GlobalManager from "./GlobalManager";
const { ccclass, property } = _decorator;

@ccclass("SelectPlayer")
export class SelectPlayer extends Component {
  // selectPlayer(index: number) {
  //     GlobalManager.instance.selectedPlayerIndex = index;
  //     console.log("Selected player index: ", index);
  //     console.log("The player", GlobalManager.instance.selectedPlayerIndex, "is selected");
  // }

  selectPlayer(event: Event, customEventData: string) {
    const index = parseInt(customEventData); // 从字符串转换为数字
    GlobalManager.instance.selectedPlayerIndex = index;
    console.log("Selected player index: ", index);
  }

  startGame() {
    director.loadScene("map1Scene");
  }
}
