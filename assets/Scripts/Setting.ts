import { _decorator, Component, Node, Slider, Button, director, AudioSourceComponent, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
import { backPage } from './Select';

@ccclass('Setting')
export class Setting extends Component {
    @property(Slider)
    BGMSlider: Slider = null;

    @property(Slider)
    EffectSlider: Slider = null;

    @property(Button)
    BackBtn: Button = null;


    static BGMvolume: number = 0.5;
    static EffectVolume: number = 0.5;

    start() {
        this.getComponent(AudioSource).volume = Setting.BGMvolume * 2;
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
        this.getComponent(AudioSource).volume = Setting.BGMvolume;
        console.log(this.getComponent(AudioSource).volume);
    }
    onEffectSliderChanged(slider: Slider) {
        Setting.EffectVolume = slider.progress;
    }
    BackMenu() {
        this.BackBtn.getComponent(AudioSource).volume = Setting.EffectVolume;
        console.log(this.BackBtn.getComponent(AudioSource));
        this.BackBtn.getComponent(AudioSource).play();
        if (backPage == 1) {
            this.scheduleOnce(() => {
                director.loadScene("Select");
            }, 0.3);
        } else {
            this.scheduleOnce(() => {
                director.loadScene("MultiRoom");
            }, 0.3);
        }

    }
    update(deltaTime: number) {

    }
}
