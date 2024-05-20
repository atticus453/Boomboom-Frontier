import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MultiRoom')
export class MultiRoom extends Component {

    @property({ type: Label })
    roomName: Label = null;

    start() {
        
    }

    update(deltaTime: number) {
        
    }
}

