import { _decorator, Component, Node, Label, Button, director, Prefab, instantiate, macro } from 'cc';
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

    // private updateData = null;
    private roomRef = null;

    start() {
        try {
            this.roomRef = firebase.database().ref('rooms/' + MultiRoom.roomID.toString());

        // instantiate player frames
            for(let i=1; i<=4; i++){
                const playerFrame = instantiate(this.userPrefab);
                playerFrame.setPosition(-100, 160-100*(i-1));
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
                    if(userCnt == 0) this.roomRef.remove();
                    else this.roomRef.update({userCnt: userCnt, users: this.userList});
                }, (e) => {
                    console.log(e);
                });
                
                director.loadScene("MultiSelect");
            });
            this.roomRef.off();
            this.roomRef.on('value', (snapshot) => {
                if (!snapshot.exists()) return;
                try{
                    const room = snapshot.val();
                    this.roomName.string = room.roomName;
                    this.userList = room.users;
                    this.map = room.map;
                    this.mode = room.mode;
                    this.userCnt = room.userCnt;

                    console.log("userList");
                    console.log(this.userList);
                    for(let i=0; i<4; i++){
                        if(i > this.userCnt) continue;
                            
                        const userRef = firebase.database().ref('users/' + this.userList[i+1]);
                        userRef.once('value', (snapshot) => {
                            try{
                                if (!snapshot.exists()) return;
                                console.log(snapshot.val());
                                const user = snapshot.val();
                                this.playerFrameList[i].getChildByName("name").getComponent(Label).string = user.name;
                                this.playerFrameList[i].getChildByName("KD").getComponent(Label).string = (user.death == 0 ? "NA" : (user.kill / user.death).toString());
                                
                            }
                            catch(e){
                                console.log(e);
                            }
                            
                        }); 
                    }
                }
                catch(e){
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

    onSettingClick(){
        director.loadScene("Setting");
    }

    onBagClick(){
        console.log("OPENING BAG...");
    }

    onMapClick(){
        console.log("OPENING MAP...");
    }
}

