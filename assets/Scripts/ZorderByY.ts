import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZorderByY')
export class ZorderByY extends Component {
    
    start() {
        // let l: number[]= [1, 5, 4, 3, 2];
        // l.sort((a, b) => {
        //     return b - a;
        // })
        // console.log(l[0]);
        // l.push(3);
        // console.log(l);
        // console.log(this.node.children[0].name);
        let playerY: number = 0;
        let playerX: number = 0;
        this.node.children.forEach((child) => {
            // if(this.getComponentInChildren.name == "Player"){
            if(this.getComponentInChildren.name == "Player"){
                playerY = child.position.y;
                playerX = child.position.x;
            }
        })
        let l: number[] = [];
        this.node.children.forEach((child, index) => {
            // console.log(child.name);
            // l.push(child.position.y);
            if(child.name == "boxes"){
                if(playerX - child.position.x > -61.8 * child.scale.x){
                    l.push(child.position.y - 76.7 * child.scale.y - (playerY - 36));
                }else{
                    l.push(child.position.y - 149 * child.scale.y - (playerY - 36));
                }
                
            }else{
                l.push(child.position.y - child.getComponent(UITransform).contentSize.height / 2 * child.scale.y - (playerY - 36));
            }
            
        });

        this.node.children.sort((a, b) => {
            return l[this.node.children.indexOf(a)] - l[this.node.children.indexOf(b)];
        });
        this.node.children.forEach((child) => {
            console.log(child.name);
        })
    }

    update(deltaTime: number) {
        let playerY: number = 0;
        let playerX: number = 0;
        this.node.children.forEach((child) => {
            if(child.name == "Player"){
                playerY = child.position.y;
                playerX = child.position.x;
            }
        })
        let l: number[] = [];
        this.node.children.forEach((child, index) => {
            // console.log(child.name);
            // l.push(child.position.y);
            if(child.name == "boxes"){
                
                if(playerX < child.position.x){
                    // l.push(child.position.y - 76.7 * child.scale.y - (playerY - 36));
                    // console.log(">0", child.position.y - 76.7 - (playerY - 36));
                    l.push(child.position.y - 76.7 - (playerY - 36));
                }else{
                    // l.push(child.position.y - 149 * child.scale.y - (playerY - 36));
                    // console.log("<0", child.position.y - 149 - (playerY - 36));
                    l.push(child.position.y - 149 - (playerY - 36));
                }
                
            }else{
                l.push(child.position.y - child.getComponent(UITransform).contentSize.height / 2 * child.scale.y - (playerY - 36));
            }
            // l.push(child.position.y - child.getComponent(UITransform).contentSize.height / 2 * child.scale.y - (playerY - 36));
        });

        this.node.children.sort((a, b) => {
            // return l[this.node.children.indexOf(a)] - l[this.node.children.indexOf(b)];
            return l[this.node.children.indexOf(b)] - l[this.node.children.indexOf(a)];
        });
        
        
        
        this.node.children.forEach((child, index) => {
            // console.log(child.name);
            child.setSiblingIndex(index);
        });
    }
}