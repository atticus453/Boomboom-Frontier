import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZorderByY')
export class ZorderByY extends Component {
    start() {

    }

    update(deltaTime: number) {
        this.node.children.sort((a, b) => {
            if (a.name === 'Player' || b.name === 'Player') {
                return b.position.y + 80 - a.position.y;
            }
        });
        this.node.children.forEach((child, index) => {
            child.setSiblingIndex(index);
        });
    }
}

