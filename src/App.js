// import logo from './logo.svg';
import './App.css';
import Clock from './components/Clock';
import Calculator from './components/Calculator';
import SplitLine from './components/SplitLine'
import Square from './Square/Square'

function FancyBorder(props) {
    return (
        <div className='FancyBorder'>
            {props.children}
        </div>
    );
}
function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/* <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p> */}
                <Clock />
            </header>
            <div className="App-body">
                <Calculator />
                <SplitLine />
                <FancyBorder>
                    <h1 className="Dialog-title">
                        Welcome
                    </h1>
                    <p className="Dialog-message">
                        Thank you for visiting our spacecraft!
                    </p>
                </FancyBorder>
                <Square />
            </div>
        </div>
    );
}

export default App;
