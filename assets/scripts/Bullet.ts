// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BulletPool from "./BulletPool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property(cc.Boolean)
    m_isPlayer: boolean = false;
    m_speed: number = 120;
    m_sign: number = -1;
    m_bulletPool: BulletPool = null;
    private m_direction: cc.Vec2 = null;

    onLoad()
    {
        this.m_bulletPool = this.node.parent.getComponent(BulletPool);
        this.m_sign = this.m_isPlayer? 1 : -1;
    }

   update(dt)
   {
       if (this.m_isPlayer)
       {
            this.node.y += this.m_sign*this.m_speed*dt;
       }
       else if (this.m_direction)
       {
            this.node.x +=  this.m_direction.x*this.m_speed*dt;
            this.node.y +=  this.m_direction.y*this.m_speed*dt;
       }

        if (Math.abs(this.node.y) > 400)
        {
            this.m_bulletPool.releaseBullet(this);
        }
   }

   setDirection(target: cc.Vec2)
   {
       this.m_direction = target.subtract(cc.v2(this.node.x, this.node.y)).normalize();
   }
}
