import React from 'react'
import {CSSTransition} from 'react-transition-group'
import './index.scss'
const Mode = {
    Start: 'start',
    Playing: 'playing',
    Win: 'win',
    Lose: 'lose',
}
class CardItem {
    static x = 20;
    static y = 21;
    static colorType = {
        1: '#FFB7DD',
        2: '#FFCCCC',
        3: '#FFC8B4',
        4: '#FFDDAA',
        5: '#FFEE99',
        6: '#FFFFBB',
        7: '#EEFFBB',
        8: '#CCFF99',
        9: '#99FF99',
        10: '#BBFFEE',
        11: '#AAFFEE',
        12: '#99FFFF',
        13: '#CCEEFF',
        14: '#CCDDFF'
    };
    static contentType = {
        1: '🥕',
        2: '✂️',
        3: '🥦',
        4: '🥛',
        5: '🌊',
        6: '🧤',
        7: '🧵',
        8: '🌱',
        9: '🔨',
        10: '🌽',
        11: '🌾',
        12: '🐑',
        13: '🪵',
        14: '🔥'
    };
    constructor({ x, y, z, key }) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.key = key;
        const offset = z * 0;
        this.val = key;
        this.style = {
            top: y * CardItem.y + offset + 'px',
            left: x * CardItem.x + offset + 'px',
            width: CardItem.x * 2 - 2 + 'px',
            height: CardItem.y * 2 - 8 + 'px'
        };
    }
    setStyle(style) {
        this.style = {
            ...this.style,
            ...style
        }
    }
    setValue(val) {
        this.val = val;
        this.content = CardItem.contentType[val];
        this.setStyle({
            background: CardItem.colorType[val]
        })
    }
}
export default class Square extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: 'start',
            // 取出三张卡片
            save: true,
            // 随机打乱一次
            rand: true,
            // 等待点击的卡牌
            cardItemList: [],
            // 点击后没有被消除的卡牌
            penddingList: [],
            // 点击后已经被消除的卡牌
            clearList: [],
            // 被取出的等待区的卡牌
            saveList: [],
            option: {
                x: 6,
                y: 4,
                z: 8,
                cardRandom: 0.2,
                maxCardType: 11,
            },
            step: 0,
            win: false,
            cardMap: [],
            calcValueList: [],
            xUnit: 0,
            yUnit: 0,
            tools: {
                save: true,
                rand: true,
            },
            timer: 0,
        }
    }
    get leftOffset() {
        const wrapWidth = (this.state.xUnit + 2) * CardItem.x;
        return (wrapWidth - 7 * CardItem.x * 2) / 2;
    }
    get cardWrapStyle() {
        return {
            width: (this.state.xUnit + 2) * CardItem.x + 'px',
            height: (this.state.yUnit + 1) * CardItem.y + 'px'
        };
    }
    // 开始游戏
    async stateGame() {
        this.updateMode(Mode.Playing)
        await this.getMap(this.state.option);
        this.setState({
            penddingList: [],
            clearList: [],
            saveList: [],
            save: true,
            rand: true
        }, () => {
            this.setCardValue({ maxCardType: Number(this.state.option.maxCardType) });
            this.calcCover();
        })
    }
    setCardValue({ maxCardType } = {}) {
        // 卡片种类
        const valStack = new Array(maxCardType);
        let { calcValueList, cardItemList } = this.state
        calcValueList = new Array(maxCardType + 1).fill(0);
        // 给卡片设置值
        cardItemList.forEach(item => {
            const value = Math.ceil(Math.random() * maxCardType);
            if (valStack[value]) {
                valStack[value].push(item);
                if (valStack[value].length === 3) {
                    valStack[value].forEach(item => {
                        item.setValue(value);
                    });
                    valStack[value] = null;
                }
            }
            else {
                valStack[value] = [item];
            }
        });

        let count = 2;
        valStack.forEach(list => {
            list
                && list.forEach(item => {
                    count++;
                    item.setValue(Math.floor(count / 3));
                });
        });
        this.setState({
            calcValueList: calcValueList,
            cardItemList: cardItemList
        })
    }
    async initGameMap({ x, y, z }) {
        let { xUnit, yUnit } = this.state
        xUnit = x * 2;
        yUnit = y * 2;
        this.setState({
            xUnit: xUnit,
            yUnit: yUnit
        })
        const cardMap = new Array(z);
        // 地图初始化
        for (let k = 0; k < z; k++) {
            cardMap[k] = new Array(yUnit);
            for (let i = 0; i < yUnit; i++) {
                cardMap[k][i] = new Array(xUnit).fill(0);
            }
        }
        return cardMap
    }
    // 地图最大为 x * y 张牌，最多有 z 层
    async getMap({ x, y, z, cardRandom } = {}) {
        const cardMap = await this.initGameMap({ x, y, z });
        const cardItemList = [];
        const { xUnit, yUnit } = this.state
        let key = 0;
        for (let k = 0; k < z; k++) {
            const shrinkSpeed = 3
            const shrink = Math.floor((z - k - 1) / shrinkSpeed);
            const shrinkX = Math.min(Math.floor(xUnit / 2) - 2, shrink);
            const shrinkY = Math.min(Math.floor(yUnit / 2) - 2, shrink);
            // 行
            for (let i = shrinkY; i < yUnit - 1 - shrinkY; i++) {
                // 列
                for (let j = shrinkX; j < Math.ceil((xUnit - 1) / 2); j++) {
                    let canSetCard = true;
                    if (j > 0 && cardMap[k][i][j - 1]) {
                        // 左边不能有牌
                        canSetCard = false;
                    }
                    else if (i > 0 && cardMap[k][i - 1][j]) {
                        // 上边不能有牌
                        canSetCard = false;
                    }
                    else if (i > 0 && j > 0 && cardMap[k][i - 1][j - 1]) {
                        // 左上不能有牌
                        canSetCard = false;
                    }
                    else if (i > 0 && cardMap[k][i - 1][j + 1]) {
                        // 右上不能有牌
                        canSetCard = false;
                    }
                    else if (k > 0 && cardMap[k - 1][i][j]) {
                        // 正底不能有牌
                        canSetCard = false;
                    }
                    else if (Math.random() >= cardRandom) {
                        canSetCard = false;
                    }
                    if (canSetCard) {
                        key++;
                        const cardItem = new CardItem({ x: j, y: i, z: k, key });
                        cardMap[k][i][j] = cardItem;
                        cardItemList.push(cardItem);
                        // 对称放置
                        const mirrorX = xUnit - 2 - j;
                        if (mirrorX > j) {
                            key++;
                            const cardItem = new CardItem({
                                x: mirrorX,
                                y: i,
                                z: k,
                                key
                            });
                            cardMap[k][i][mirrorX] = cardItem;
                            cardItemList.push(cardItem);
                        }
                    }
                }
            }
        }
        cardItemList.reverse();
        for (let i = 1; i <= key % 3; i++) {
            const clearItem = cardItemList.pop();
            cardMap[clearItem.z][clearItem.y][clearItem.x] = 0;
        }
        cardItemList.reverse();
        this.setState({
            cardMap: cardMap,
            cardItemList: cardItemList
        })
    }
    // 随机打乱卡牌一次
    randCard() {
        if (this.state.rand) {
            let { cardItemList } = this.state
            const length = cardItemList.length
            cardItemList.forEach(item => {
                const randNum = Math.floor(length * Math.random())
                const newItem = cardItemList[randNum]
                let temp
                temp = item.style.left
                item.setStyle({
                    left: newItem.style.left
                })
                newItem.setStyle({
                    left: temp
                })
                temp = item.style.top
                item.setStyle({
                    top: newItem.style.top
                })
                newItem.setStyle({
                    top: temp
                })
                temp = item.x
                item.x = newItem.x
                newItem.x = temp
                temp = item.y
                item.y = newItem.y
                newItem.y = temp
                temp = item.z
                item.z = newItem.z
                newItem.z = temp
            })

            cardItemList.sort((a, b) => a.z - b.z)
            this.setState({
                rand: false,
                cardItemList: cardItemList,
            })
            this.calcCover()
        }
    }
    // 计算卡牌之间的层级
    calcCover() {
        const { xUnit, yUnit, cardItemList } = this.state
        // 构建一个遮挡 map
        const coverMap = new Array(yUnit)
        for (let i = 0; i <= yUnit; i++) {
            coverMap[i] = new Array(xUnit).fill(false)
        }

        // 从后往前，后面的层数高
        for (let i = cardItemList.length - 1; i >= 0; i--) {
            const item = cardItemList[i]
            const { x, y } = item
            if (coverMap[y][x]) {
                item.cover = true
            } else if (coverMap[y][x + 1]) {
                item.cover = true
            } else if (coverMap[y + 1][x]) {
                item.cover = true
            } else if (coverMap[y + 1][x + 1]) {
                item.cover = true
            } else {
                item.cover = false
            }
            coverMap[y][x] = true
            coverMap[y + 1][x] = true
            coverMap[y][x + 1] = true
            coverMap[y + 1][x + 1] = true
        }
        this.setState({
            cardItemList: cardItemList,
        })
    }
    // 点击卡牌
    clickCard(item) {
        let { timer, penddingList, cardItemList, calcValueList } = this.state
        clearTimeout(timer)
        // this.removeThree()
        penddingList.push(item)
        const index = cardItemList.indexOf(item)
        cardItemList = cardItemList
            .slice(0, index)
            .concat(cardItemList.slice(index + 1))
        this.calcCover()
        calcValueList[item.val]++
        item.setStyle({
            top: '165%',
            left: this.leftOffset + (penddingList.length - 1) * CardItem.x * 2 + 'px'
        })

        this.setState({
            timer: setTimeout(() => {
                this.removeThree()
            }, 100),
            penddingList: penddingList,
            cardItemList: cardItemList,
            calcValueList: calcValueList
        })
    }
    // 取出三个卡牌
    saveCard() {
        if (this.state.save) {
            let { penddingList, calcValueList } = this.state
            let saveList = penddingList.slice(0, 3);
            saveList.forEach((item, index) => {
                item.setStyle({
                    top: '120%',
                    left: this.leftOffset + index * CardItem.x * 2 + 'px'
                })
                calcValueList[item.val]--;
            });
            penddingList = penddingList.slice(3);
            penddingList.forEach((item, index) => {
                item.setStyle({
                    top: '165%',
                    left: this.leftOffset + index * CardItem.x * 2 + 'px'
                })
            });
            this.setState({
                save: false,
                saveList: saveList,
                penddingList: penddingList,
                calcValueList: calcValueList
            })
        }
    }
    // 点击被取出的三个卡牌
    clickSaveCard(item) {
        let { cardItemList, saveList } = this.state
        cardItemList.push(item)
        const index = saveList.indexOf(item)
        saveList = saveList.slice(0, index).concat(saveList.slice(index + 1))
        this.setState(
            {
                cardItemList: cardItemList,
                saveList: saveList,
            },
            () => {
                this.clickCard(item)
            }
        )
    }
    // 根据条件消除卡牌  并且判断游戏输赢
    removeThree() {
        let { penddingList, calcValueList, clearList, cardItemList } = this.state
        penddingList.forEach(item => {
            if (calcValueList[item.val] === 3) {
                penddingList.forEach(newItem => {
                    if (newItem.val === item.val) {
                        clearList.push(newItem)
                    }
                })
                clearList.forEach((item, index) => {
                    item.setStyle({
                        left: this.leftOffset - 60 + 'px'
                    })
                })

                penddingList = penddingList.filter(newItem => {
                    return newItem.val !== item.val
                })
                penddingList.forEach((item, index) => {
                    item.setStyle({
                        top: '165%',
                        left: this.leftOffset + index * CardItem.x * 2 + 'px'
                    })
                })
                calcValueList[item.val] = 0
                this.setState({
                    clearList: clearList,
                    penddingList: penddingList,
                    calcValueList: calcValueList
                })
                if (cardItemList.length === 0) {
                    this.setState({
                        mode: Mode.Win
                    })
                }
            }
        })

        if (penddingList.length >= 7) {
            this.setState({
                mode: Mode.Lose
            })
        }
    }
    updateMode(mode) {
        this.setState({
            mode: mode,
        })
    }
    rePlay() {
        this.stateGame()
    }
    render() {
        const { mode, cardItemList, penddingList, clearList, saveList } = this.state
        let className = ['full-width', 'full-height', mode].join(' ')
        return (
            <div className="stage full-width">
                <div className={className}>
                    {mode === Mode.Start ? (
                        <div
                            className="start_text"
                            onClick={this.stateGame.bind(this)}
                        >
                            开始游戏
                        </div>
                    ) : mode === Mode.Playing ? (
                        <>
                            <div className="card-wrap" style={this.cardWrapStyle}>
                                {cardItemList.map(item => {
                                    let className = ['card-item']
                                    item.cover && className.push('item-cover')
                                    return (
                                        <div
                                            className={className.join(' ')}
                                            style={item.style}
                                            key={item.key}
                                            onClick={this.clickCard.bind(this, item)}
                                        >
                                            {item.content}
                                        </div>
                                    )
                                })}
                                {penddingList.map(item => {
                                    return (
                                        <div
                                            className="card-item disable"
                                            style={item.style}
                                            key={item.key}
                                            onClick={this.clickCard.bind(this, item)}
                                        >
                                            {item.content}
                                        </div>
                                    )
                                })}
                                {/* {clearList.map(item => {
                                    return (
                                        <div
                                            className="card-item clear-item disable"
                                            style={item.style}
                                            key={item.key}
                                            onClick={this.clickCard.bind(this, item)}
                                        >
                                            {item.content}
                                        </div>
                                    )
                                })} */}
                                {saveList.map(item => {
                                    return (
                                        <div
                                            className="card-item"
                                            style={item.style}
                                            key={item.key}
                                            onClick={this.clickSaveCard.bind(this, item)}
                                        >
                                            {item.content}
                                        </div>
                                    )
                                })}
                                <p className="card-tips">
                                    剩余空位:{7 - penddingList.length}/7 已消除:
                                    {clearList.length}/
                                    {cardItemList.length +
                                        penddingList.length +
                                        saveList.length +
                                        clearList.length}
                                </p>
                            </div>
                            <div className="tools">
                                道具：
                                <button disabled={!this.state.save} onClick={this.saveCard.bind(this)}>
                                    取出三个卡片
                                </button>
                                <button
                                    disabled={!this.state.rand}
                                    onClick={this.randCard.bind(this)}
                                >
                                    随机
                                </button>
                                <button onClick={this.rePlay.bind(this)}>再来一次</button>
                            </div>
                        </>
                    ) : mode === Mode.Win ? (
                        <div>你赢了，真厉害！</div>
                    ) : (
                        <div>你输了， 加油哦！<button onClick={this.rePlay.bind(this)}>再来一次</button></div>
                    )}
                </div>
            </div>
        )
    }
}
