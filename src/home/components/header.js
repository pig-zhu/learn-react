import React from "react";
import logo from '../../../src/common/images/default.jpg'
import {Link} from 'react-router-dom';
import routes from "../../router/route";

export default class Header extends React.Component {
    // constructor(props) {
    //     super(props)
    // }
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
                            return <div className="route-item">
                                <Link key={el.path} to={el.path}>{el.name}</Link>
                            </div>
                        })
                    }
                </div>
            </header>
        )
    }
}