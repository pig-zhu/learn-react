import React from "react";
const isPhone = /Mobi|Android|iPhone/i.test(navigator.userAgent)
const getXYOnCanvas = function(e) {
    return {
        x: (isPhone ? e.changedTouches[0].clientX : e.clientX) - e.target.offsetLeft,
        y: (isPhone ? e.changedTouches[0].clientY : e.clientY) - e.target.offsetTop
    }
}
export default function Welcome() {
    let move = false
    let points = []
    let canvas = null
    let ctx = null
    function draw () {
        if(canvas && ctx && points.length > 1) {
            let start = points[points.length - 2]
            let end = points[points.length - 1]
            ctx.beginPath()
            ctx.strokeStyle = '#000'
            // ctx.lineWidth = 15
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
            // ctx.closePath()
        }
    }
    function mouseDownHandler(e) {
        if((e.type === "touchstart" && isPhone) || (e.type === "mousedown" && !isPhone)) {
            move = true
        }
    }
    function mouseUpHandler(e) {
        if((e.type === "touchend" && isPhone) || (e.type === "mouseup" && !isPhone)) {
            move = false
            points = []
        }
    }
    function mouseMoveHandler(e) {
        if(move) {
            points.push(getXYOnCanvas(e))
            draw()
        }
    }
    return (
        <div className="gua_component">
            <h2>来试一下刮刮乐吧！</h2>
            <canvas className="gua_box"
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onTouchStart={mouseDownHandler}
                onTouchEnd={mouseUpHandler}
                onTouchMove={mouseMoveHandler}
                onMouseMove={mouseMoveHandler}
                ref={(e) => {
                    if(e) {
                        canvas = e
                        canvas.width = canvas.offsetWidth
                        canvas.height = canvas.offsetHeight
                        ctx = canvas.getContext('2d')
                    }
                }}>
            </canvas>
        </div>
    )
}