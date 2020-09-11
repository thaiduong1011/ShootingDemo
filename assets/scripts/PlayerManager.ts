// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";
import BulletPool from "./BulletPool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerManager extends cc.Component 
{
    static Instance: PlayerManager = null;
    @property(cc.Node)
    m_player: cc.Node = null;
    @property(BulletPool)
    m_bulletPool: BulletPool = null;

    m_speedHorizontal: number = 150;
    m_borderX: number = 250;
    m_isMoving: boolean = false;
    m_isMovingRight: boolean = false;

    m_isShooting: boolean = false;
    m_completedTheShoot: boolean = false;

    onLoad()
    {
        PlayerManager.Instance = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    reset()
    {
        this.m_player.x = 0;
    }

    onKeyDown(event) 
    {
        if (GameManager.IsPause)
            return;
        switch(event.keyCode) 
        {
            case cc.macro.KEY.a: 
            case cc.macro.KEY.left:
                this.m_isMoving = true;
                this.m_isMovingRight = false;
                break;
            case cc.macro.KEY.d: 
            case cc.macro.KEY.right:
                this.m_isMoving = true;
                this.m_isMovingRight = true;
                break;
            case cc.macro.KEY.space:
                this.m_isShooting = true;
        }
    }

    onKeyUp(event)
    {
        switch(event.keyCode) 
        {
            case cc.macro.KEY.a: 
            case cc.macro.KEY.left:
            case cc.macro.KEY.d: 
            case cc.macro.KEY.right:
                this.m_isMoving = false;
             break;
            case cc.macro.KEY.space:
                this.m_isShooting = false;
                this.m_completedTheShoot = false;
        }
    }

    update(dt)
    {
        if (this.m_isMoving)
        {
            let sign = this.m_isMovingRight? 1: -1;
            let posX = this.m_player.x + sign*this.m_speedHorizontal*dt;
            if (Math.abs(posX) < this.m_borderX)
            {
                this.m_player.x = posX;
            }
        }

        if (this.m_isShooting && !this.m_completedTheShoot)
        {
            let bullet = this.m_bulletPool.getAvailableBullet().node;
            let bulletPos = GameManager.convertToBrotherPosAR(this.m_player, bullet);
            bulletPos.y += 10;
            bullet.setPosition(bulletPos);
            this.m_completedTheShoot = true;
        }
    }
    
}
