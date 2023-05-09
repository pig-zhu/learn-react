import React from "react";
import {Routes, Route} from 'react-router-dom';
import routes from "../../router/route";
export default class Body extends React.Component {
    // constructor(props) {
    //     super(props)
    // }
    render() {
        return (
            <div className="App-body">
                <Routes>
                    {
                        routes.map(el => {
                            return <Route path={el.path} element={el.element} key={el.name}></Route>
                        })
                    }
                </Routes>
            </div>
        )
    }
}