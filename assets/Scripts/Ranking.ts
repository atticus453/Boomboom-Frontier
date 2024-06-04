import * as cc from "cc";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Ranking extends cc.Component {

    @property(cc.Prefab)
    item_prefab: cc.Prefab = null;

    onLoad () {
        var scr = this.node.getChildByName("RankingScroll").getComponent(cc.ScrollView);
        var usersRef = firebase.database().ref('users');
        usersRef.on('value', (snapshot) => {
            if(!snapshot.exists()) return;

            const usersData = snapshot.val();
            const usersDataArr = Object.keys(usersData).map((key)=>usersData[key]);
            // cc.log(Object.keys(usersData).map((key)=>usersData[key]));
            // console.log(usersDataArr);
            usersDataArr.sort((a, b)=>{
                return b.death - a.death;
            });
            for(var i = 0; i < usersDataArr.length; i++) {
                var optItem = cc.instantiate(this.item_prefab); //實例化一個預製體
                var optItemSize = optItem.getChildByName("background").getComponent(cc.UITransform).contentSize;
                cc.log(optItemSize.width);
                scr.content.addChild(optItem);
                console.log(optItem.position.x);
                optItem.position = cc.v3(optItem.position.x, optItem.position.y - i*optItemSize.height*1.1 - 50, 0);
                optItem.getChildByName("name").getComponent(cc.Label).string = usersDataArr[i].name;
                optItem.getChildByName("score").getComponent(cc.Label).string = usersDataArr[i].death;
                optItem.getChildByName("rank").getComponent(cc.Label).string = i.toString();
    
            }
        });
    }

    start () {

    }

    onReturnClick(){
        cc.director.loadScene("MultiSelect");
    }

    // update (dt) {}
}

