import { _decorator, Component, Label, Prefab, Node, instantiate, randomRangeInt, director } from 'cc';
import { Pocong } from './Pocong';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Label) scoreLabel: Label = null;
    @property(Prefab) pocongPrefab: Prefab = null;
    private score: number = 0;
    private missedPocong: number = 0;
    @property(Node) hunter: Node = null; 
    private isGameOver: boolean = false;
    start() {
        
    }

    gameOver() {
        this.isGameOver = true;
        // this.gameOverLabel.string = "Game Over!";
        // this.gameOverLabel.node.active = true;

        // Nonaktifkan input Hunter
        if (this.hunter) {
            this.hunter.getComponent('Hunter').enabled = false;
        }

        // Hentikan semua Pocong dan Bullet di layar
        this.stopAllEnemies();

        // Hentikan semua update game (opsional)
        director.pause();
    }

    checkPocongPosition(pocong: Node) {
        if (this.isGameOver) return;

        if (pocong.position.x < this.hunter.position.x) {
            this.missedPocong++;
            console.log(`Pocong lolos: ${this.missedPocong}`); // Debugging
            
            if (this.missedPocong >= 3) {
                console.log("Game Over Triggered!");
                this.gameOver();
            }

            pocong.destroy(); // Hapus Pocong yang lolos
        }
    }
    stopAllEnemies() {
        let allPocongs = this.node.scene.getComponentsInChildren('Pocong');
        allPocongs.forEach(pocong => pocong.enabled = false);

        let allBullets = this.node.scene.getComponentsInChildren('Bullet');
        allBullets.forEach(bullet => bullet.enabled = false);
    }
}

