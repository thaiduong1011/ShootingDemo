// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletPool extends cc.Component {

    @property(cc.Prefab)
    private m_bulletPrefab: cc.Prefab = null;

    private m_pool: cc.Node[] = [];

    private createNewBullet(): Bullet
    {
        let node = cc.instantiate(this.m_bulletPrefab);
        let bullet = node.getComponent(Bullet);
        node.setParent(this.node);
        return bullet;
    }

    getAvailableBullet(): Bullet
    {
        var node:cc.Node = null;
        if (this.m_pool.length > 0)
        {
            node = this.m_pool.pop();
            node.active = true;
        }
        else
        {
            node = this.createNewBullet().node;
        }
        let bullet = node.getComponent(Bullet);
        return bullet;
    }

    releaseBullet(bullet: Bullet)
    {
        bullet.node.active = false;
        this.m_pool.push(bullet.node);
    }
}
