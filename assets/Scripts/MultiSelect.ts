import { _decorator, Component, Node, Button, find, director, log, EditBox, Prefab, instantiate, resources, Label, NodeEventType, labelAssembler, macro } from 'cc';
import { MultiRoom } from './MultiRoom';
import PhotonManager from './Manager/PhotonManager';
const { ccclass, property } = _decorator;

@ccclass('MultiSelect')
export class MultiSelect extends Component {

    roomPosY: number = 185;

    roomID: number = 0;

    

    @property(Prefab)
    roomFramePrefab: Prefab = null;

    @property(Prefab)
    createRoomPopUpPrefab: Prefab = null;

    @property(Prefab)
    mapPreviewPrefab: Prefab = null;

    static roomNodeList: Node[] = null;
    static userIndex: number = 0;

    private joinFlag: boolean = false;
    private updateData = null;

    onLoad() {
        MultiSelect.roomNodeList = [];
        let creatRoomButton = find("Canvas/creatRoom").getComponent(Button);
        creatRoomButton.node.on(Node.EventType.MOUSE_UP, this.onCreateRoomClick, this);
        let returnButton = this.node.getChildByName("returnButton").getComponent(Button);
        returnButton.node.on(Node.EventType.MOUSE_UP, ()=>{director.loadScene("Select");}, this);

        for(let i=0; i<6; i++){
            const roomNode = instantiate(this.roomFramePrefab);
            MultiSelect.roomNodeList.push(roomNode);
            roomNode.setPosition(-90, this.roomPosY, 0);
            this.roomPosY -= 80;
        }

        const roomRef = firebase.database().ref('rooms/');
        roomRef.off();
        roomRef.on('value', (snapshot) => {
            if (!snapshot.exists()){
                console.log("No rooms found.");
                return;
            } 

            let roomArr = [];
            snapshot.forEach(childSnapshot => {
                let item = childSnapshot.val();
                item.key = childSnapshot.key;
                roomArr.push(item);
            });
            // console.log(roomArr);
            this.roomPosY = 185;
            
            for (let i=0; i<6; i++) {
                
                if(i < roomArr.length){
                    MultiSelect.roomNodeList[i].getChildByName("playerCount").getComponent(Label).string = roomArr[i].userCnt + "/" + 4;
                    MultiSelect.roomNodeList[i].getChildByName("roomName").getComponent(Label).string = roomArr[i].roomName;
                    find("Canvas/Rooms").addChild(MultiSelect.roomNodeList[i]);
                    MultiSelect.roomNodeList[i].on(Node.EventType.MOUSE_UP, () => {
                        this.onJoinClick(roomArr[i].roomName, roomArr[i].map, roomArr[i].mode, roomArr[i].key);
                    }, this);
                }
                else if(MultiSelect.roomNodeList[i].getParent()){
                    MultiSelect.roomNodeList[i].removeFromParent();
                }
            }
        }, (error) => {
            console.error("Failed to fetch room list: ", error);
        });
    }

    protected onDestroy(): void {
        const roomRef = firebase.database().ref('rooms/');
        roomRef.off();
    }

    protected start(): void {

    }

    async addRoom(roomName: string) {
        try {
            if (!roomName) return;
                
            const roomsRef = firebase.database().ref('rooms');
            const newRoomRef = roomsRef.push();
            this.roomID = newRoomRef.key;
            const user = await firebase.auth().currentUser;
            await newRoomRef.set({
                roomName: roomName,
                users: ["dummy"],
                isReady: false,
                userCnt: 0,
                key: this.roomID,
                mode: "DeathMatch",
                map: "XiaoJin",

            });
        }
        catch (error) {
            console.log(error);
        }
    }

    update(deltaTime: number) {
        // const roomRef = firebase.database().ref('rooms/');
        
    }

    onCreateRoomClick(){
        let popUp = instantiate(this.createRoomPopUpPrefab);
        let cancel = popUp.getChildByName("cancel").getComponent(Button);
        let create = popUp.getChildByName("create").getComponent(Button);
        let roomName = popUp.getChildByName("roomName").getComponent(EditBox);
        cancel.node.on(Node.EventType.MOUSE_UP, ()=>{
            popUp.destroy();
        }, this);
        create.node.on(Node.EventType.MOUSE_UP, ()=>{
            console.log("CREATE ROOM " + roomName.string);
            this.addRoom(roomName.string);
            // add room in photon
            //
            popUp.destroy();
        }, this);
        popUp.setPosition(0, 0, 0);
        this.node.addChild(popUp);       
    }

    onJoinClick(roomName: string, map: string, mode: string, roomID:number){
        // if(this.node.getChildByName("roomPreview"))
        //     this.node.getChildByName("roomPreview").destroy();
        console.log("hi");
        let roomPreview;
        if(this.node.getChildByName("roomPreview"))
            roomPreview = this.node.getChildByName("roomPreview");
        else{
            roomPreview = instantiate(this.mapPreviewPrefab);
            this.node.addChild(roomPreview);
            roomPreview.setPosition(400, 20);
        }
        roomPreview.getChildByName("info").getComponent(Label).string = "Room: " + roomName +
                                                                    "\nMap: " + "XiaoJin" +
                                                                    "\nMode: " + "DeathMatch";
        roomPreview.getChildByName("joinButton").on(Node.EventType.MOUSE_UP, this.handleAddingRoom(roomName, map, mode, roomID));
    }

    async handleAddingRoom(roomName: string, map: string, mode: string, roomID:number){
        MultiRoom.roomID = roomID;
            const roomRef = firebase.database().ref('rooms/' + roomID);
            const user = firebase.auth().currentUser;
            let userCnt: number = 0;
            let userList: string[] = [];
            // this.unschedule(this.updateData);

            await roomRef.once('value', (snapshot) => {
                userCnt = snapshot.val().userCnt + 1;
                userList = snapshot.val().users;
                userList.push(user.uid);
                roomRef.update({userCnt: userCnt, users: userList});
            });
            // 做一個async function，等待userCnt更新完再執行下面的程式碼
            MultiSelect.userIndex = userCnt;


            // if room isnt exist, create room by photon
            // else join room
            try {
                
                PhotonManager.instance.createRoom(roomName);
            } catch (error) {
                console.log(error);
                PhotonManager.instance.joinRoom(roomName);
            }
            
    
            director.loadScene("MultiRoom");
    }
}


