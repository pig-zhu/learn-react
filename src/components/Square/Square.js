/**
 * 井字小游戏
 */
import React from "react";
import './Square.scss'
import PlayMatch from './components/playMatch'
import Tr from './components/table'

const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

export default class Square extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 下一个进行的玩家    玩家1--X  玩家2--O
            player: 1,
            // 存放历史记录   {index: ** , player: **}
            historys: [],
            // 当前的步数
            currentStep: 0,
            // 赢家
            winner: null
        }
    }
    playerClick(index) {
        let { player, historys, currentStep, winner} = this.state
        historys = historys.slice(0, currentStep)
        // 重复点击  则false
        if(!historys.find(el => el.index === index) && !winner) {
            historys.push({
                index: index,
                player: player
            })
            currentStep++
            this.setState({
                player: player === 1 ? 2 : 1,
                historys: historys,
                currentStep: currentStep
            })
            if(historys.length > 4 && this.judgeWin(historys)) {
                return
            }
        }
    }
    changeStep(item, index) {
        this.setState({
            winner: null,
            player: item && item.player === 1 ? 2 : 1,
            currentStep: index
        })
    }
    // 判断赢家
    judgeWin(historys) {
        for(let i = 0; i<8; i++) {
            const [a, b, c] = lines[i]
            const item1 = historys.find(el => el.index === a)
            const item2 = historys.find(el => el.index === b)
            const item3 = historys.find(el => el.index === c)
            if(item1 && item2 && item3 && item1?.player === item2?.player && item2?.player === item3?.player) {
                this.setState({
                    winner: item1.player
                })
                return item1.player
            }
        }
        return null
    }
    render() {
        let currentData = this.state.historys.slice(0, this.state.currentStep)

        return (
            <div className="Square">
                <h2>这是一个井字小游戏</h2>
                <div className="box">
                    {/* 渲染场地 */}
                    <table className="scene">
                        <tbody><Tr currentData={currentData} playerClick={this.playerClick.bind(this)} /></tbody>
                    </table>
                    <PlayMatch winner={this.state.winner} historys={this.state.historys} player={this.state.player} changeStep={this.changeStep.bind(this)} />
                </div>
            </div>
        )
    }
}