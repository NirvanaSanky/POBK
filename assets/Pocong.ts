import { _decorator, Component, Node, Vec3,randomRange, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Pocong')
export class Pocong extends Component {
    private speedX = randomRange(50, 100); // Kecepatan ke kiri random
    private jumpHeight = randomRange(500, 600); // Tinggi lompat random
    private gravity = -400; // Gravitasi turun
    private velocityY = 0;
    private isOnGround = true; 
    gameManager: any;
    start() {
        // let collider = this.getComponent(Collider2D);
        // if (collider) {
        //     collider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
        // }
    }
    // onCollision(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     if (otherCollider.node.name === 'Bullet') {
    //         otherCollider.node.destroy();
    //         this.node.destroy();
    //         const gameManagerNode = this.node.scene.getChildByName("GameManager");
    //         if (gameManagerNode) {
    //             const gameManager = gameManagerNode.getComponent(GameManager);
    //             if (gameManager) gameManager.addScore();
    //         }
    //     }
    // }
    update(deltaTime: number) {
        let pos = this.node.position;

        // Jika Pocong menyentuh tanah, lompat
        if (this.isOnGround) {
            this.velocityY = this.jumpHeight;
            this.isOnGround = false;
        }

        // Update kecepatan turun dengan gravitasi
        this.velocityY += this.gravity * deltaTime;

        // Update posisi Pocong (ke kiri & lompat)
        let newX = pos.x - this.speedX * deltaTime;
        let newY = pos.y + this.velocityY * deltaTime;

        // Jika menyentuh tanah lagi, atur ulang lompat
        if (newY <= -300) {
            newY = -300;
            this.isOnGround = true;
        }

        this.node.setPosition(new Vec3(newX, newY, pos.z));
        if (this.gameManager) {
            this.gameManager.checkPocongPosition(this.node);
    }
}

}
