/**
 * 井字小游戏
 */
import React from "react";

const lineText = {
    1: 'X',
    2: 'O'
}
export default class Square extends React.Component {
    changeStep(item, index) {
        if(this.props.changeStep) {
            this.props.changeStep(item, index)
        }
    }
    render() {
        const historys = this.props.historys
        const player = this.props.player
        const winner = this.props.winner
        console.log(winner);
        return (
            <div className="detail">
                {winner && <span>赢家：{lineText[winner]}</span>}
                {!winner && <span>下一个玩家：{lineText[player]}</span>}
                <button className="reset" onClick={this.changeStep.bind(this, null, 0)}>重新开始</button>
                {
                    historys.map((el, index) => {
                        return (
                            <div className="detail-item" key={index}>
                                <span>{index + 1}. </span>
                                <button onClick={this.changeStep.bind(this, el, index + 1)}>回到第{index + 1}步</button>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}