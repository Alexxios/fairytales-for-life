import "./Home.css"
import { Link } from "react-router-dom"
import ThemeList from "../components/Themes"
import { useState } from 'react';
import ThemesComponent from '../components/ThemesComponent';

export function Home() {

    const [currentTheme, setCurrentTheme] = useState({
        id: 1,
        title: 'Корневая тема',
        subthemes: [
          {
            id: 101,
            title: 'Подтема 1',
            items: [
              { id: 1001, title: 'Элемент 1' },
              { id: 1002, title: 'Элемент 2' },
            ],
            subthemes: [
              {
                id: 1011,
                title: 'Вложенная подтема',
                works: [
                  { id: 10111, title: 'Произведение 1', author: 'Автор 1' },
                  { id: 10112, title: 'Произведение 2', author: 'Автор 2' },
                ]
              }
            ]
          },
          {
            id: 102,
            title: 'Подтема 2',
            works: [
              { id: 1021, title: 'Книга 1', author: 'Писатель 1' },
              { id: 1022, title: 'Книга 2', author: 'Писатель 2' },
            ]
          }
        ]
      });


    return (
        <div className="home">
            <main>
                <ThemesComponent initialTheme={currentTheme} />
            </main>
            
        </div>
    )
}