import { _decorator, Component, Node, Button, find, director } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('MultiSelect')
export class MultiSelect extends Component {
    start() {
        let creatRoomButton = find("Canvas/creatRoom").getComponent(Button);

        creatRoomButton.node.on(Node.EventType.MOUSE_UP, this.addRoom, this);
    }

    async addRoom() {
        const roomName = prompt("Enter Room Name: ");
        if (roomName) {
            try {
                const newRoom = await firebase.database().ref('rooms/' + roomName);
                await newRoom.set({
                    roomName: roomName,
                    users: [],
                    isReady: false,
                    userCnt: 1
                });
            }
            catch (error) {
                alert(error.message);
            }
        }
    }

}