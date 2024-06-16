// BGManager.ts
import { _decorator, Component, Node, AudioSource, AudioClip, resources, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BGManager')
export default class BGManager extends Component {
    private static _audioSource: AudioSource = null;

    onLoad() {
        // Set this node as a persistent node
        director.addPersistRootNode(this.node);

        // Initialize the audio source
        BGManager._audioSource = this.getComponent(AudioSource);
        if (!BGManager._audioSource) {
            console.error("AudioSource component not found!");
        }
    }

    static playMusic() {
        if (BGManager._audioSource) {
            // Ensure an AudioClip is loaded
            resources.load('../../Audio/BGM/menu_music', AudioClip, (err, clip) => {
                if (err) {
                    console.error(err);
                    return;
                }
                BGManager._audioSource.clip = clip;
                BGManager._audioSource.play();
                console.log("playMusic");
            });
        } else {
            console.error("AudioSource not initialized!");
        }
    }
}
