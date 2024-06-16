import { _decorator, Component, Node, Contact2DType, Collider2D, IPhysics2DContact, PolygonCollider2D, UITransform, BoxCollider2D, BoxCollider } from 'cc';
const { ccclass, property } = _decorator;
// import { DirX, DirY } from "./Player";
@ccclass('tree')
export class tree extends Component {
   
    onLoad(){
        let collider = this.node.getComponent(PolygonCollider2D);
        let boxCollider = null;
        if(this.node.name != "boxes") boxCollider = this.node.getComponent(BoxCollider2D);
        else boxCollider = this.getColliderWithTag(this.node, 1);
        if (collider) {
            // console.log("poly");
            collider.on(Contact2DType.PRE_SOLVE, this.PolyonPreSolve, this);
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
        // console.log(otherCollider.node.name);
        // let treeUpBound = selfCollider.node.position.y;
        // if(otherCollider.node.name != "Player" || otherCollider.tag != 1){
        //     contact.disabled = true;
        // }
        if(otherCollider.tag != 4){
            contact.disabled = true;
        }
        
    }
    PolyonPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        // console.log(otherCollider.node.name);
        // console.log("slove");
        // let treeUpBound = selfCollider.node.position.y;
        // if(otherCollider.node.name == "Player"){
        //     contact.disabled = true;
        // }
        if(otherCollider.tag == 2 || otherCollider.tag == 4){
            contact.disabled = true;
        }
        let treeUpBound = this.node.position.y - this.getComponent(UITransform).contentSize.height / 2 * 2/3 * this.node.scale.y + 10;
        let treeLowBound = this.node.position.y - this.getComponent(UITransform).contentSize.height / 2 * this.node.scale.y - 10;
        
        
    }
    getColliderWithTag(node: Node, tag: number): PolygonCollider2D | null {
        // 获取节点上的所有 BoxCollider2D 组件
        const boxColliders = node.getComponents(PolygonCollider2D);

        // 查找 tag 为 1 的 BoxCollider2D
        for (const collider of boxColliders) {
            if (collider.tag === tag) {
                return collider;
            }
        }

        return null; // 如果没有找到符合条件的 BoxCollider2D，则返回 null
    }
}