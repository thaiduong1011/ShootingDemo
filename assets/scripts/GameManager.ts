// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EnemyManager from "./EnemyManager";
import PlayerManager from "./PlayerManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    static Instance: GameManager = null;
    @property(cc.Node)
    m_environment: cc.Node = null;
    @property(cc.Prefab)
    m_spaceRoad: cc.Prefab = null;

    m_roadList: cc.Node[] =[];
    m_moveDistance: number = 0;
    m_roadY: number = 0;
    m_roadHeight: number = 0;

    @property(cc.Node)
    m_enviroment: cc.Node = null;
    m_speed: number = 100;

    m_lives: number = 3;
    m_score: number = 0;

    static IsPause: boolean = false;

    onLoad()
    {
        GameManager.Instance = this;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    start () 
    {
        this.generateRoad();
    }

    generateRoad()
    {
        let node: cc.Node = null;
        this.m_moveDistance = 0;
        this.m_roadY = 0;
        this.m_roadHeight = this.m_spaceRoad.data.children[0].height*this.m_spaceRoad.data.childrenCount;
        for (let i = 0; i < 2; i++)
        {
            node = cc.instantiate(this.m_spaceRoad);
            node.setParent(this.m_environment);
            node.setPosition(0, this.m_roadY, 0);
            this.m_roadY += this.m_roadHeight;
            this.m_roadList.push(node);
        }
    }

    update (dt) 
    {
        this.m_enviroment.y -= this.m_speed*dt;
        this.m_moveDistance += this.m_speed*dt;
        
        if (this.m_moveDistance > this.m_roadHeight)
        {
            this.m_moveDistance = 0;
            var road = this.m_roadList.shift();
            road.y = this.m_roadY;
            this.m_roadY += this.m_roadHeight;
            this.m_roadList.push(road);
        }
    }

    replay()
    {
        this.m_lives = 3;
        this.m_score = 0;
        EnemyManager.Instance.reset();
        PlayerManager.Instance.reset();
        GameManager.IsPause = false;
    }

    static convertToBrotherPosAR (current: cc.Node, brother: cc.Node): cc.Vec3 {
        
        let worldPos = current.parent.convertToWorldSpaceAR(current.position);
        let localPos = brother.parent.convertToNodeSpaceAR(worldPos);
        return localPos;
    }

    static getRndInteger (min, max) 
    {
        return Math.floor(Math.random() * (max - min) ) + min;        
    }

    static getRndFloat (min, max) 
    {
        return (Math.random() * (max - min) ) + min;        
    }
}
