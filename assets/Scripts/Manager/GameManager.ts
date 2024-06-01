import { _decorator, Component, Node, find, BoxCollider2D, Contact2DType, IPhysics2DContact, Sprite } from 'cc';
import { PlayerPrefab } from '../PlayerPrefab';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export default class GameManager extends Component {
    @property(Node)
    items: Node[] = [];

    static isPickup: boolean = false;

    start() {
        this.items = find('Canvas/items')!.children;
        console.log(this.items);
        for(let item of this.items) {
            const itemCollider = item.getComponent(BoxCollider2D);
            if(itemCollider) {
                itemCollider.on(Contact2DType.BEGIN_CONTACT, (self: BoxCollider2D, other: BoxCollider2D, contact: IPhysics2DContact) => {
                    if(GameManager.isPickup) {
                        if(self.tag === 0) {
                            PlayerPrefab.itemBar.getChildByPath("Weapon/WeaponSprite").getComponent(Sprite).spriteFrame = item.getComponent(Sprite).spriteFrame;
                            item.getComponent(Component).scheduleOnce(() => {
                                item.active = false;
                            }, 0.1);
                        }
                        if(self.tag === 1) {
                            PlayerPrefab.itemBar.getChildByPath("Item/ItemSprite").getComponent(Sprite).spriteFrame = item.getComponent(Sprite).spriteFrame;
                            item.getComponent(Component).scheduleOnce(() => {
                                item.active = false;
                            }, 0.1);
                        }
                        GameManager.isPickup = false;
                    }
                });
            }
        }
    }

    update(deltaTime: number) {
        
    }
}

