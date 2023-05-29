import { Link } from 'react-router-dom';
import logo from '../images/gucLogo.png';

const Navbar = () => {

    return (
        <header>
            <div className="container">
                <div><h1>Teacher Scheduling Application</h1></div>
                <div className="imageHolder"><img className="image" src={logo} /></div>
            </div>

        </header>
    )
}

export default Navbar