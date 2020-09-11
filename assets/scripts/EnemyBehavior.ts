// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EnemyManager from "./EnemyManager";
import GameManager from "./GameManager";
import UIManager from "./UIManager";
import Bullet from "./Bullet";
import PlayerManager from "./PlayerManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBehavior extends cc.Component {

    start () {
        let collider = this.getComponent(cc.BoxCollider);
        collider.node.on('collision-enter', this.onCollisionEnter, this);
    }
  
    onCollisionEnter (other, self) 
    {
        if (self.node.active == false)
            return;
        if (other.node.name == "bullet")
        {
            PlayerManager.Instance.m_bulletPool.releaseBullet(other.node.getComponent(Bullet));
            self.node.active = false;
            EnemyManager.Instance.m_enemyCount--;
            GameManager.Instance.m_score++;
            UIManager.Instance.m_scoreText.string = GameManager.Instance.m_score.toString();
            if (EnemyManager.Instance.m_enemyCount <= 0)
            {
                GameManager.IsPause = true;
                UIManager.Instance.showResult(true);
            }
        }
    }
}
