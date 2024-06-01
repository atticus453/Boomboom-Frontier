// GlobalManager.ts
import { _decorator } from "cc";
const { ccclass } = _decorator;

@ccclass("GlobalManager")
export default class GlobalManager {
  private static _instance: GlobalManager;

  public static get instance(): GlobalManager {
    if (!this._instance) {
      this._instance = new GlobalManager();
    }
    return this._instance;
  }

  selectedPlayerIndex: number = 0; // 默认选择第一个玩家

  private constructor() {
    // 私有构造函数保证单例模式
  }

  // 可以添加更多管理全局状态的方法和属性
}
