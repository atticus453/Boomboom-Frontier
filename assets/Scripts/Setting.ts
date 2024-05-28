import { _decorator, Component, Node, Slider, Button, director} from 'cc';
const { ccclass, property } = _decorator;
import { backPage } from './Select';
@ccclass('Setting')
export class Setting extends Component {
    @property(Slider) slider: Slider = null;
    @property(Button) BackBtn: Button = null;
    start() {
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
        const value = slider.progress; // 获取 slider 的值，范围在 0 到 1 之间
        console.log(`Slider value: ${value}`);

        // 更新显示 slider 值的标签（如果有）
        // if (this.sliderValueLabel) {
        //     this.sliderValueLabel.string = `Value: ${(value * 100).toFixed(0)}`;
        // }
        console.log(`${(value * 100).toFixed(0)}`);
    }
    BackMenu(){
        if(backPage == 1){
            director.loadScene("Select");
        }else{
            director.loadScene("Menu2");
        }
        
    }
    update(deltaTime: number) {
        
    }
}

