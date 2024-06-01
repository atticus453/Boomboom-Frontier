import { _decorator, Component, Node, Slider, Button, director, AudioSourceComponent, AudioSource} from 'cc';
const { ccclass, property } = _decorator;
import { backPage } from './Select';

@ccclass('Setting')
export class Setting extends Component {
    @property(Slider) 
    slider: Slider = null;

    @property(Button) 
    BackBtn: Button = null;


    static volume: number = 0.5;

    start() {
        this.slider.progress = Setting.volume;
        if (this.slider) {
            this.slider.node.on('slide', this.onSliderChanged, this);
        }
        let BackButton = new Component.EventHandler();
        BackButton.target = this.node;
        BackButton.component = "Setting";
        BackButton.handler = "BackMenu";
        this.BackBtn.clickEvents.push(BackButton);
    }
    onSliderChanged(slider: Slider) {
        Setting.volume = slider.progress; // 获取 slider 的值，范围在 0 到 1 之间
        this.getComponent(AudioSource).volume = Setting.volume;
        console.log(this.getComponent(AudioSource).volume);
    }
    BackMenu(){
        if(backPage == 1){
            director.loadScene("Select");
        }else{
            director.loadScene("MultiRoom");
        }
        
    }
    update(deltaTime: number) {
        
    }
}

