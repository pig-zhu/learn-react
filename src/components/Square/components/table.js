/**
 * 井字小游戏
 */
import React from "react";

const lineText = {
    1: 'X',
    2: 'O'
}
export default class Square extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    createTr(params) {
        let currentData = this.props.currentData
        return (
            Array.from({length: 3}).map((el, index) => {
                return (<tr key={index}>
                    {
                        Array.from({length: 3}).map((els, col) => {
                            let order = col + index * 3
                            // 是否在记录里面存在
                            let item = currentData.find(item => item.index === order)
                            return <td key={col} onClick={this.handleClick.bind(this, order)}>
                                {item ? lineText[item.player] : ''}
                            </td>
                        })
                    }
                </tr>)
            })
        )
    }
    handleClick(index) {
        if(this.props.playerClick) {
            this.props.playerClick(index)
        }
    }
    render() {
        return (
            <>
            {this.createTr()}
            </>
        )
    }
}