import { _decorator, Component, Node, Contact2DType, Collider2D, IPhysics2DContact, PolygonCollider2D, UITransform, BoxCollider2D, BoxCollider } from 'cc';
const { ccclass, property } = _decorator;
import { DirX, DirY } from "./Player";
@ccclass('tree2')
export class tree2 extends Component {
   
    onLoad(){
        let collider = this.node.getComponent(PolygonCollider2D);
        let boxCollider = this.node.getComponent(BoxCollider2D);
        if (collider) {
            console.log("poly");
            collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
        }
        if (boxCollider) {
            boxCollider.on(Contact2DType.PRE_SOLVE, this.BoxonPreSolve, this);
        }
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
    BoxonPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        console.log(otherCollider.node.name);
        let treeUpBound = selfCollider.node.position.y;
        // let treeUpBound = selfCollider.node.position.y - selfCollider.getComponent(UITransform).contentSize.height / 2 * 1/2 * selfCollider.node.scale.y + 10;
        let treeLowBound = selfCollider.node.position.y - selfCollider.getComponent(UITransform).contentSize.height / 2 * selfCollider.node.scale.y - 10;
        if(otherCollider.node.name == "Player"){
            let playerBound = otherCollider.node.position.y - otherCollider.getComponent(UITransform).contentSize.height / 2 * otherCollider.node.scale.y;
            console.log(DirX, DirY);
            if(playerBound > treeUpBound || playerBound < treeLowBound){
                console.log("no bound");
                contact.disabled = true;
            }
            // else if(DirY == 0){
            //     console.log("hori", Math.floor(playerBound), Math.floor(treeUpBound), Math.floor(treeLowBound));
            //     // if(playerBound > treeUpBound || playerBound < treeLowBound){
            //         contact.disabled = true;
            // }
                
            
            // else if(DirY == 1){
            //     if(playerBound > treeUpBound || playerBound < treeLowBound){
            //         contact.disabled = true;
            //     }
            // }
            // else if(DirY == -1){
            //     if(playerBound > treeUpBound){
            //         contact.disabled = true;
            //     }
            // }
            
        }
        
    }
    onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        console.log(otherCollider.node.name);
        console.log("slove");
        let treeUpBound = selfCollider.node.position.y;
        // let treeUpBound = selfCollider.node.position.y - selfCollider.getComponent(UITransform).contentSize.height / 2 * 1/2 * selfCollider.node.scale.y + 10;
        let treeLowBound = selfCollider.node.position.y - selfCollider.getComponent(UITransform).contentSize.height / 2 * selfCollider.node.scale.y - 10;
        if(otherCollider.node.name == "Player"){
            let playerBound = otherCollider.node.position.y - otherCollider.getComponent(UITransform).contentSize.height / 2 * otherCollider.node.scale.y;
            console.log(DirX, DirY);
            if(playerBound > treeUpBound || playerBound < treeLowBound){
                console.log("no bound");
                contact.disabled = true;
            }
            else if(DirY == 0){
                console.log("hori", Math.floor(playerBound), Math.floor(treeUpBound), Math.floor(treeLowBound));
                // if(playerBound > treeUpBound || playerBound < treeLowBound){
                    contact.disabled = true;
                // }
                
            }
            else if(DirY == 1){
                if(playerBound > treeUpBound || playerBound < treeLowBound){
                    contact.disabled = true;
                }
            }
            else if(DirY == -1){
                if(playerBound > treeUpBound){
                    contact.disabled = true;
                }
            }
            
        }
        
    }
}

