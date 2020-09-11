// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";
import BulletPool from "./BulletPool";
import PlayerManager from "./PlayerManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyManager extends cc.Component {
    static Instance: EnemyManager = null;
    @property(cc.Prefab)
    private m_enemyPrefab: cc.Prefab = null;
    @property(cc.Node)
    m_enemyContainer: cc.Node = null;
    @property(BulletPool)
    m_bulletPool: BulletPool = null;

    ROW_NUMBER: number = 6 ;
    COLUMN_NUMBER: number = 10;
    ENEMY_SIZE: number = 32;
    PADDING: number = 10;

    //moving
    m_speed: number = 30;
    m_borderX: number = 250;
    m_isMoveRight: boolean = true;

    m_timer: number = 0;
    m_enemyCount: number = 0;

    onLoad()
    {
        EnemyManager.Instance = this;
        this.generateEnemy();
        this.m_timer = GameManager.getRndFloat(0.5, 2);
    }

    generateEnemy()
    {
        this.m_enemyContainer.removeAllChildren();
        this.m_enemyContainer.width = (this.ENEMY_SIZE + this.PADDING)*this.COLUMN_NUMBER;
        this.m_enemyContainer.height = (this.ENEMY_SIZE + this.PADDING)*this.ROW_NUMBER;
        let posStartX = -this.m_enemyContainer.width/2;
        let posY = 0;
        for (let row = 0; row < this.ROW_NUMBER;row++)
        {
            posY = row*(this.ENEMY_SIZE + this.PADDING);
            for (let col = 0; col < this.COLUMN_NUMBER;col++)
            {
                let posX = posStartX + (this.ENEMY_SIZE + this.PADDING)*col;
                let node = cc.instantiate(this.m_enemyPrefab);
                node.parent = this.m_enemyContainer;
                node.setPosition(posX, posY, 0);
            }
        }
        this.m_enemyCount = this.m_enemyContainer.childrenCount;
    }

    update(dt)
    {
        if (GameManager.IsPause)
            return;
        if (this.m_isMoveRight)
        {
            this.m_enemyContainer.x += this.m_speed*dt; 
        }
        else
        {
            this.m_enemyContainer.x -= this.m_speed*dt; 
        }

        let boundRight= this.m_enemyContainer.x + this.m_enemyContainer.width/2;
        let boundLeft = this.m_enemyContainer.x - this.m_enemyContainer.width/2;
        if (boundRight >= this.m_borderX || boundLeft <= -this.m_borderX)
        {
            this.m_isMoveRight =  !this.m_isMoveRight;
        }

        this.m_timer -= dt;
        if (this.m_timer <= 0)
        {
            let randEnemy = this.m_enemyContainer.children[GameManager.getRndInteger(0, this.m_enemyContainer.childrenCount)];
            let bullet = this.m_bulletPool.getAvailableBullet();
            let bulletPos = GameManager.convertToBrotherPosAR(randEnemy, bullet.node);
            bullet.node.setPosition(bulletPos);
            bullet.setDirection(cc.v2(PlayerManager.Instance.m_player.x, PlayerManager.Instance.m_player.y));
            this.m_timer = GameManager.getRndFloat(0.5, 2);
        }
    }

    reset()
    {
        for(let i =0; i < this.m_enemyContainer.childrenCount; i++)
        {
            this.m_enemyContainer.children[i].active = true;
        }
        this.m_timer = GameManager.getRndFloat(0.5, 2);
        this.m_enemyContainer.x = 0;
        this.m_enemyCount = this.m_enemyContainer.childrenCount;
    }
}
