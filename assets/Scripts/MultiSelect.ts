import { _decorator, Component, Node, Button, find, director, log, EditBox, Prefab, instantiate, resources, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MultiSelect')
export class MultiSelect extends Component {

    roomPosY: number = 100;
    // roomHeight: number = 100;

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
                for(let room in roomList) {
                    const roomNode = instantiate(this.roomPrefab);
                    roomNode.getChildByName("Label").getComponent(Label).string = roomList[room].roomName;
                    roomNode.setPosition(0, this.roomPosY, 0);
                    this.roomPosY -= 150;
                    find("Canvas/Rooms").addChild(roomNode);
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
                const newRoom = await firebase.database().ref('rooms/' + this.roomName.string);
                await newRoom.set({
                    roomName: this.roomName.string,
                    users: [],
                    isReady: false,
                    userCnt: 1
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

