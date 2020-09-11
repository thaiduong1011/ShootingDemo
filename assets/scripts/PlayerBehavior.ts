// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";
import UIManager from "./UIManager";
import EnemyManager from "./EnemyManager";
import Bullet from "./Bullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerBehavior extends cc.Component {

    start () {
        let collider = this.getComponent(cc.BoxCollider);
        collider.node.on('collision-enter', this.onCollisionEnter, this);
    }
  
    onCollisionEnter (other, self) 
    {
        if (other.node.name == "enemyBullet")
        {
            EnemyManager.Instance.m_bulletPool.releaseBullet(other.node.getComponent(Bullet));
            other.node.active = false;
            GameManager.Instance.m_lives--;
            if (GameManager.Instance.m_lives >= 0)
            {
                UIManager.Instance.m_livesText.string = GameManager.Instance.m_lives.toString();
            }
            if (GameManager.Instance.m_lives <= 0)
            {
                GameManager.IsPause= true;
                UIManager.Instance.showResult(false);
            }
        }
    }
}
