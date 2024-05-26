import { _decorator, Component, Node, Button, find, director, log, EditBox, Prefab, instantiate, resources, Label } from 'cc';
import { MultiRoom } from './MultiRoom';
const { ccclass, property } = _decorator;

@ccclass('MultiSelect')
export class MultiSelect extends Component {

    roomPosY: number = 100;
    // roomHeight: number = 100;

    roomID: number = 0;

    @property({ type: EditBox })
    roomName: EditBox = null;

    @property({ type: Prefab })
    roomPrefab: Prefab = null;

    start() {
        let creatRoomButton = find("Canvas/creatRoom").getComponent(Button);

        creatRoomButton.node.on(Node.EventType.MOUSE_UP, this.addRoom, this);
        const roomRef = firebase.database().ref('rooms/')
        roomRef.once('value', (snapshot) => {
            if (snapshot.exists()) {
                const roomList = snapshot.val();
                for (let room in roomList) {
                    const roomNode = instantiate(this.roomPrefab);
                    // console.log(roomList[room]);
                    roomNode.getChildByName("Label").getComponent(Label).string = roomList[room].roomName;
                    roomNode.setPosition(0, this.roomPosY, 0);
                    this.roomPosY -= 150;
                    find("Canvas/Rooms").addChild(roomNode);
                    roomNode.on(Node.EventType.MOUSE_UP, () => {
                        MultiRoom.roomID = roomList[room].key;
                        director.loadScene("MultiRoom");
                    });
                }
            } else {
                console.log("No rooms found.");
            }
        }, (error) => {
            console.error("Failed to fetch room list: ", error);
        });
    }

    async addRoom() {
        try {
            if (this.roomName.string) {
                const roomsRef = firebase.database().ref('rooms');
                const newRoomRef = roomsRef.push();
                this.roomID = newRoomRef.key;
                const user = await firebase.auth().currentUser;
                await newRoomRef.set({
                    roomName: this.roomName.string,
                    users: [user.uid],
                    isReady: false,
                    userCnt: 1,
                    key: this.roomID
                });
                const roomNode = instantiate(this.roomPrefab);
                console.log(roomNode);
                roomNode.getChildByName("Label").getComponent(Label).string = this.roomName.string;
                roomNode.setPosition(0, this.roomPosY, 0);
                this.roomPosY -= 150;

                find("Canvas/Rooms").addChild(roomNode);
                this.roomName.string = "";
                alert("Room created successfully");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    update(deltaTime: number) {

    }
}

