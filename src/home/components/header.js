import React from "react";
import logo from '../../../src/common/images/default.jpg'
import {Link} from 'react-router-dom';
import routes from "../../router/route";

export default class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: window.location.pathname || '/'
        }
    }
    clickHandle(params) {
        this.setState({
            activeTab: params
        })
    }
    render() {
        return (
            <header className="App-header flex-box">
                <div className="left flex-box full-height">
                    <img className="img" alt="" src={logo} />
                    <span>LearnReact</span>
                </div>
                <div className="right flex-box full-height">
                    {
                        routes.map(el => {
                            let classname = ['route-item',this.state.activeTab === el.path?'activeTab': ''].join(' ')
                            return el.hideden ? '' : <div className={classname} key={el.name}>
                                <Link className='link-item' to={el.path} onClick={this.clickHandle.bind(this, el.path)}>{el.name}</Link>
                            </div>
                        })
                    }
                </div>
            </header>
        )
    }
}