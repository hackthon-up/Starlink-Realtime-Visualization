import React, {Component} from 'react';
import logo from "../assets/images/spacex_logo.svg";

class Header extends Component {
    render() {
        return (
            <div>
                <header className="App-header">
                    < img src={logo} className="App-logo" alt="logo" />
                    <p className="title">
                        StarLink Tracker
                    </p >
                </header>
            </div>
        );
    }
}

export default Header;