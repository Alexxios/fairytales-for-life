import "./Home.css"
import { Link } from "react-router-dom"
import ThemeList from "../components/Themes"

export function Home() {
    return (
        <div className="home">
            <header>
                <h1>Сказки</h1>
            </header>
            <main>
                <ThemeList />
                <Link to="/">Home</Link>
                <Link to="/page1">Page 1</Link>
                <Link to="/page2">Page 2</Link>
                <Link to="/page3">Page 3</Link>   
            </main>
            
        </div>
    )
}