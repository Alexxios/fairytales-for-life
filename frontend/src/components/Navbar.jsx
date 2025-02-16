import { Link } from "react-router-dom"
import "./Navbar.css"
import logoImage from "../../public/logo.jpeg"

export function Navbar() {
    return (
        <div className="navbar">
            <img src={logoImage} width={45}/>
            <Link to="/">
                <button>Главная</button>
            </Link>
            <Link to="/page1">
                <button>Page 1</button>
            </Link>
            <Link to="/page2">
                <button>Page 2</button>
            </Link>
            <Link to="/page3">
                <button>Page 3</button>
            </Link>
        </div>
    )
}