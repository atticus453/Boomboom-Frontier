import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoseScene')
export class LoseScene extends Component {
    start() {
        this.scheduleOnce(() => {
            director.loadScene("MultiSelect");
        }, 3);
    }

    update(deltaTime: number) {
        
    }
}

