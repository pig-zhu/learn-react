import React from "react";

export default class Clock extends React.Component {
    render() {
        return (
            <div className="gua_component">
                <h2>来试一下刮刮乐吧！</h2>
                <canvas className="gua_box"></canvas>
            </div>
        )
    }
}