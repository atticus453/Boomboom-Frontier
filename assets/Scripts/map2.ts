import { _decorator, AnimationClip, Component, Node, Animation, AnimationManager, AnimationComponent} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('map2')
export class map2 extends Component {
    @property(Node) grassA: Node;
    @property(AnimationComponent) animCompo: AnimationComponent;
    @property(Node) grassA2: Node;
    @property(AnimationComponent) animCompoA2: AnimationComponent;

    @property(Node) grassH: Node;
    @property(AnimationComponent) animCompoH: AnimationComponent;
    @property(Node) grassH2: Node;
    @property(AnimationComponent) animCompoH2: AnimationComponent;
    @property(Node) grassH3: Node;
    @property(AnimationComponent) animCompoH3: AnimationComponent;

    start() {
        if(this.grassA){
            this.animCompo = this.grassA.getComponent(AnimationComponent);
        }
        if(this.grassA2){
            this.animCompoA2 = this.grassA2.getComponent(AnimationComponent);
        }
        if(this.grassH){
            this.animCompoH = this.grassH.getComponent(AnimationComponent);
        }
        if(this.grassH2){
            this.animCompoH2 = this.grassH2.getComponent(AnimationComponent);
        }
        if(this.grassH3){
            this.animCompoH3 = this.grassH3.getComponent(AnimationComponent);
        }
        

    }

    update(deltaTime: number) {
        if(this.animCompo){
            if(!this.animCompo.getState('grassA').isPlaying){
                this.animCompo.play('grassA');
            }
        }
        if(this.animCompoA2){
            if(!this.animCompoA2.getState('grassA').isPlaying){
                this.animCompoA2.play('grassA');
            }
        }
        if(this.animCompoH){
            if(!this.animCompoH.getState('grassH').isPlaying){
                this.animCompoH.play('grassH');
            }
        }
        if(this.animCompoH2){
            if(!this.animCompoH2.getState('grassH').isPlaying){
                this.animCompoH2.play('grassH');
            }
        }
        if(this.animCompoH3){
            if(!this.animCompoH3.getState('grassH').isPlaying){
                this.animCompoH3.play('grassH');
            }
        }
    }
}

