import { _decorator, Component, Node, Label, Button, director, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MultiRoom')
export class MultiRoom extends Component {

    static roomID: number = 0;

    userList: string[] = [];

    @property({ type: Button })
    returnButton: Button = null;

    @property({ type: Button })
    startButton: Button = null;

    @property({ type: Label })
    roomName: Label = null;

    @property({ type: Label })
    roomIDLabel: Label = null;

    @property({ type: Prefab })
    userPrefab: Prefab = null;

    start() {
        const roomRef = firebase.database().ref('rooms/' + MultiRoom.roomID.toString());
        roomRef.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const room = snapshot.val();
                this.roomName.string = room.roomName;
                this.userList = room.users;
                for(let user in this.userList) {
                    console.log(this.userList[user]);
                    const userNode = instantiate(this.userPrefab);
                    const userRef = firebase.database().ref('users/' + this.userList[user]);
                    userRef.once('value', (snapshot) => {
                        if (snapshot.exists()) {
                            const user = snapshot.val();
                            userNode.getChildByName("userName").getComponent(Label).string = user.username;
                        } else {
                            console.log("User not found.");
                        }
                    });
                }
            }
        });
        this.roomIDLabel.string = MultiRoom.roomID.toString();
        this.returnButton.node.on(Node.EventType.MOUSE_UP, () => {
            MultiRoom.roomID = 0;
            director.loadScene("MultiSelect");
        });
    }

    update(deltaTime: number) {
        
    }
}

