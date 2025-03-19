import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt, Vec3, systemEvent, SystemEvent, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Hunter')
export class Hunter extends Component {
    @property({ type: Prefab })
    private prefabBullet: Prefab = null!;
    
    @property({ type: Prefab })
    private prefabPocong: Prefab = null!;
    
    private maxBullets = 3; // Maksimum peluru yang bisa ditembakkan sebelum reload
    private remainingBullets = this.maxBullets; // Jumlah peluru yang tersisa
    private isReloading = false; // Status reload
    private reloadTime = 1; // Waktu reload (1 detik)

    private pocongSpawn = 3; // Timer spawn pocong

    private bulletActive: Node[] = [];
    private pocongActive: Node[] = [];
    private bulletNonActive: Node[] = [];
    private pocongNonActive: Node[] = [];

    start() {
        // Tambahkan event listener untuk mendeteksi klik mouse
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.shoot, this);
    }

    update(deltaTime: number) {
        // Timer spawn pocong
        this.pocongSpawn -= deltaTime;
        if (this.pocongSpawn <= 0) {
            this.pocongSpawn = 3;
            this.spawnPocong();
        }

        // Bersihkan peluru yang sudah keluar layar
        for (let i = this.bulletActive.length - 1; i >= 0; i--) {
            if (this.bulletActive[i].position.x > 640) {
                this.bulletNonActive.push(this.bulletActive[i]);
                this.bulletActive[i].active = false;
                this.bulletActive.splice(i, 1);
            }
        }

        // Bersihkan pocong yang sudah keluar layar
        for (let i = this.pocongActive.length - 1; i >= 0; i--) {
            if (this.pocongActive[i].position.x < -640) {
                this.pocongNonActive.push(this.pocongActive[i]);
                this.pocongActive[i].active = false;
                this.pocongActive.splice(i, 1);
            }
        }
    }

    shoot(event: EventMouse) {
        if (this.remainingBullets > 0 && !this.isReloading) {
            this.spawnBullet();
            this.remainingBullets--;

            // Jika peluru habis, mulai reload
            if (this.remainingBullets === 0) {
                this.isReloading = true;
                this.scheduleOnce(() => {
                    this.remainingBullets = this.maxBullets; // Isi ulang peluru
                    this.isReloading = false;
                    console.log("✅ Reload selesai! Peluru tersedia lagi.");
                }, this.reloadTime);
            }
        } else if (this.isReloading) {
            console.log("⏳ Sedang reload... tunggu 1 detik.");
        }
    }

    spawnBullet() {
        let nodeBullet: Node;
        if (this.bulletNonActive.length > 0) {
            nodeBullet = this.bulletNonActive[0];
            this.bulletNonActive.splice(0, 1);
            nodeBullet.active = true;
        } else {
            nodeBullet = instantiate(this.prefabBullet);
            nodeBullet.setParent(this.node.parent);
        }
        nodeBullet.setPosition(this.node.position);
        this.bulletActive.push(nodeBullet);
    }

    spawnPocong() {
        let nodePocong: Node;
        if (this.pocongNonActive.length > 0) {
            nodePocong = this.pocongNonActive[0];
            this.pocongNonActive.splice(0, 1);
            nodePocong.active = true;
        } else {
            nodePocong = instantiate(this.prefabPocong);
            nodePocong.setParent(this.node.parent);
        }
        nodePocong.setPosition(new Vec3(350, randomRangeInt(-36, 36) * 10, 0));
        this.pocongActive.push(nodePocong);
    }
}
