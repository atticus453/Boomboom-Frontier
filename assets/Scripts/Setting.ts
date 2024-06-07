import { _decorator, Component, Node, Slider, Button, director, AudioSourceComponent, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
// import { Menu } from './Menu';

@ccclass('Setting')
export class Setting extends Component {
    @property(Slider)
    BGMSlider: Slider = null;

    @property(Slider)
    EffectSlider: Slider = null;

    @property(Button)
    BackBtn: Button = null;


    static BGMvolume: number = 1;
    static EffectVolume: number = 1;

    start() {
        this.BGMSlider.progress = Setting.BGMvolume;
        if (this.BGMSlider) {
            this.BGMSlider.node.on('slide', this.onBGMSliderChanged, this);
        }

        this.EffectSlider.progress = Setting.EffectVolume;
        if (this.EffectSlider) {
            this.EffectSlider.node.on('slide', this.onEffectSliderChanged, this);
        }

        let BackButton = new Component.EventHandler();
        BackButton.target = this.node;
        BackButton.component = "Setting";
        BackButton.handler = "BackMenu";
        this.BackBtn.clickEvents.push(BackButton);
        
    }
    onBGMSliderChanged(slider: Slider) {
        Setting.BGMvolume = slider.progress;
    }
    onEffectSliderChanged(slider: Slider) {
        Setting.EffectVolume = slider.progress;
    }

    BackMenu() {
        this.BackBtn.getComponent(AudioSource).volume = Setting.EffectVolume * 2;
        this.BackBtn.getComponent(AudioSource).play();
        this.scheduleOnce(()=>{this.node.destroy()}, 0.3);
    }

    update(deltaTime: number) {

    }
}
