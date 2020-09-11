// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    static Instance: UIManager = null;
    @property(cc.Label)
    m_scoreText: cc.Label = null;
    @property(cc.Label)
    m_livesText: cc.Label = null;
    @property(cc.Node)
    m_replayButton: cc.Node = null;
    @property(cc.Label)
    private m_resultText: cc.Label = null;

    onLoad()
    {
        UIManager.Instance = this;
    }

    start()
    {
        this.resetUI();
    }

    showResult(isWin: boolean)
    {
        this.m_resultText.string = isWin? "YOU WIN!" : "YOU LOSE!";
        this.m_resultText.node.active = true;
        this.m_replayButton.active = true;
    }

    hideResult()
    {
        this.m_resultText.node.active = false;
        this.m_replayButton.active = false;
    }

    onReplayButton(event: cc.Component.EventHandler, name: string)
    {
        GameManager.Instance.replay();
        this.hideResult();
    }

    resetUI()
    {
        this.m_livesText.string = GameManager.Instance.m_lives.toString();
        this.m_scoreText.string = 0 + "";
    }
 
}
