import { _decorator, Component, instantiate, Node,Prefab,Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    private prefabBullet:Prefab;
    private fireRate=1;
    start() {

    }

    update(deltaTime: number) {
        this.node.translate(new Vec3(500*deltaTime,0,0));
       
    }
    
}


