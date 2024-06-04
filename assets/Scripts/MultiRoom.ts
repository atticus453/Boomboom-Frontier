import { _decorator, Component, Node, Label, Button, director, Prefab, instantiate, macro, AnimationClip, animation, Animation, AudioSource } from 'cc';
import { Setting } from './Setting';
const { ccclass, property } = _decorator;

@ccclass('MultiRoom')
export class MultiRoom extends Component {

    static roomID: number = 0;

    userList: string[] = [];

    mode: string = "";

    map: string = "";

    userCnt: number = 0;

    @property({ type: Button })
    returnButton: Button = null;

    @property({ type: Button })
    startButton: Button = null;

    @property({ type: Button })
    settingButton: Button = null;

    @property({ type: Button })
    mapButton: Button = null;

    @property({ type: Label })
    roomName: Label = null;

    @property({ type: Label })
    roomIDLabel: Label = null;

    @property({ type: Prefab })
    userPrefab: Prefab = null;

    @property({ type: Button })
    bagButton: Button = null;

    private playerFrameList: Node[] = [];

    private roomRef = null;

    private mapCnt: number = 2;

    @property(Prefab)
    mapSelectPrefab: Prefab = null;

    @property(Prefab)
    setupSelectPrefab: Prefab = null;

    @property(AnimationClip)
    knightAnimationClip: AnimationClip = null;

    @property(AnimationClip)
    musketeerAnimationClip: AnimationClip = null;

    @property(AnimationClip)
    swordsmanAnimationClip: AnimationClip = null;

    @property(AnimationClip)
    wizardAnimationClip: AnimationClip = null;

    start() {
        try {
            this.roomRef = firebase.database().ref('rooms/' + MultiRoom.roomID.toString());

            // instantiate player frames
            for (let i = 1; i <= 4; i++) {
                const playerFrame = instantiate(this.userPrefab);
                playerFrame.setPosition(-100, 160 - 100 * (i - 1));
                playerFrame.getChildByName("name").getComponent(Label).string = "Wait...";
                playerFrame.getChildByName("KD").getComponent(Label).string = "";
                this.playerFrameList.push(playerFrame);
                this.node.addChild(playerFrame);
            }

            this.roomIDLabel.string = MultiRoom.roomID.toString();
            this.returnButton.node.on(Node.EventType.MOUSE_UP, () => {
                MultiRoom.roomID = 0;
                const user = firebase.auth().currentUser;
                this.userList.splice(this.userList.indexOf(user.uid), 1);
                let userCnt = 0;
                this.roomRef.once('value', (snapshot) => {
                    userCnt = snapshot.val().userCnt - 1;
                    if (userCnt == 0) this.roomRef.remove();
                    else this.roomRef.update({ userCnt: userCnt, users: this.userList });
                }, (e) => {
                    console.log(e);
                });
                this.returnButton.node.getComponent(AudioSource).volume = Setting.EffectVolume * 2;
                this.returnButton.node.getComponent(AudioSource).play();
                this.scheduleOnce(() => {
                    director.loadScene("MultiSelect");
                }, 1);
            });
            this.roomRef.off();
            this.roomRef.on('value', (snapshot) => {
                if (!snapshot.exists()) return;
                try {
                    const room = snapshot.val();
                    this.roomName.string = room.roomName;
                    this.userList = room.users;
                    this.map = room.map;
                    this.mode = room.mode;
                    this.userCnt = room.userCnt;

                    // console.log("userList");
                    // console.log(this.userList);
                    for (let i = 0; i < 4; i++) {
                        if (i > this.userCnt) continue;

                        const userRef = firebase.database().ref('users/' + this.userList[i + 1]);
                        userRef.once('value', (snapshot) => {
                            try {
                                if (!snapshot.exists()) return;
                                // console.log(snapshot.val());
                                const user = snapshot.val();
                                this.playerFrameList[i].getChildByName("name").getComponent(Label).string = user.name;
                                this.playerFrameList[i].getChildByName("KD").getComponent(Label).string = (user.death == 0 ? "NA" : (user.kill / user.death).toString());

                            }
                            catch (e) {
                                console.log(e);
                            }

                        });
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
        } catch (error) {
            console.log(error);
        }

    }

    protected onDestroy(): void {
        this.roomRef = firebase.database().ref('rooms/' + MultiRoom.roomID.toString());
        this.roomRef.off();
    }

    update(deltaTime: number) {

    }

    onSettingClick() {
        this.settingButton.node.getComponent(AudioSource).volume = Setting.EffectVolume * 2;
        this.settingButton.node.getComponent(AudioSource).play();
        this.scheduleOnce(() => {
            director.loadScene("Setting");
        }, 0.5);
    }

    onBagClick() {
        if (this.node.getChildByName("setupSelect")) return;

        console.log("OPENING BAG...");

        let setupSelect = instantiate(this.setupSelectPrefab);
        let skinName: string[] = ["female1", "female2", "male1", "male2"];
        setupSelect.setPosition(0, 0);
        this.node.addChild(setupSelect);

        // button function setup
        this.scheduleOnce(() => {
            const currentUser = firebase.auth().currentUser;
            const userRef = firebase.database().ref('users/' + currentUser.uid);

            setupSelect.getChildByName("cancel").on(Node.EventType.MOUSE_UP, () => {
                setupSelect.destroy();
            }, this);
            setupSelect.getChildByName("knight").getChildByName("Button").on(Node.EventType.MOUSE_UP, () => {
                console.log("kngiht");
                this.node.getChildByName("playerPreview").getChildByName("player").getComponent(Animation).play("Knight_Idle");
                userRef.update({ skin: "Knight" });
                setupSelect.destroy();
            }, this);
            setupSelect.getChildByName("musketeer").getChildByName("Button").on(Node.EventType.MOUSE_UP, () => {
                console.log("musketeer");
                this.node.getChildByName("playerPreview").getChildByName("player").getComponent(Animation).play("Musketeer_Idle");
                userRef.update({ skin: "Musketeer" });
                setupSelect.destroy();
            }, this);
            setupSelect.getChildByName("swordsman").getChildByName("Button").on(Node.EventType.MOUSE_UP, () => {
                console.log("swordsman");
                this.node.getChildByName("playerPreview").getChildByName("player").getComponent(Animation).play("Swordsman_Idle");
                userRef.update({ skin: "Swordsman" });
                setupSelect.destroy();
            }, this);
            setupSelect.getChildByName("wizard").getChildByName("Button").on(Node.EventType.MOUSE_UP, () => {
                console.log("wizard");
                this.node.getChildByName("playerPreview").getChildByName("player").getComponent(Animation).play("Wizard_Idle");
                userRef.update({ skin: "Wizard" });
                setupSelect.destroy();
            }, this);
        }, 0.1);
    }

    onMapClick() {
        if (this.node.getChildByName("mapSelect")) return;
        this.mapButton.node.getComponent(AudioSource).volume = Setting.EffectVolume * 2;
        this.mapButton.node.getComponent(AudioSource).play();

        console.log("OPENING MAP...");

        let mapSelect = instantiate(this.mapSelectPrefab);
        let mapNames: string[] = ["map1", "map2"];
        mapSelect.setPosition(0, 0);
        this.node.addChild(mapSelect);

        // button function setup
        mapSelect.getChildByName("cancel").on(Node.EventType.MOUSE_UP, () => {
            mapSelect.getComponent(AudioSource).volume = Setting.EffectVolume;
            mapSelect.getComponent(AudioSource).play();
            this.scheduleOnce(() => {
                mapSelect.destroy();
            }, 0.3);
        }, this);
        mapSelect.getChildByName("map1").on(Node.EventType.MOUSE_UP, () => {
            console.log("Change to map1");
            this.roomRef.update({ map: mapNames[0] });
            mapSelect.destroy();
        }, this);
        mapSelect.getChildByName("map2").on(Node.EventType.MOUSE_UP, () => {
            console.log("Change to map2");
            this.roomRef.update({ map: mapNames[1] });
            mapSelect.destroy();
        }, this);
        mapSelect.getChildByName("random").on(Node.EventType.MOUSE_UP, () => {
            console.log("Randommmmmmmm");
            this.roomRef.update({ map: mapNames[Math.floor(Math.random() * this.mapCnt)] });
            mapSelect.destroy();
        }, this);

    }

}

