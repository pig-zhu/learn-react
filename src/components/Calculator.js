import React from "react";
import TemperatureInput from "./TemperatureInput";
import Tools from "../resources/js/tool";
function BoilingVerdict (props) {
    if (props.celsius >= 100) {
        return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
}
export default class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {temperature: '', scale: 'c'};
    }
    handleCelsiusChange(temperature) {
        this.setState({scale: 'c', temperature});
    }
    handleFahrenheitChange(temperature) {
        this.setState({scale: 'f', temperature});
    }
    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f' ? Tools.tryConvert(temperature, Tools.toCelsius) : temperature;
        const fahrenheit = scale === 'c' ? Tools.tryConvert(temperature, Tools.toFahrenheit) : temperature;

        return (
            <div>
                <TemperatureInput temperature={celsius} onTemperatureChange={this.handleCelsiusChange} scale="c" />
                <TemperatureInput temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange} scale="f"  />
                <BoilingVerdict
                celsius={parseFloat(celsius)} />
            </div>
        )
    }
}