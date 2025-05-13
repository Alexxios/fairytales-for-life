// AboutPage.jsx
import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="aboutPage">
      
      <section className="storySection">
        <div className="content">
            <h1>О проекте</h1>
          <p>
             «Сказки для жизни» — это истории для взрослых и детей, которые делают самые обыкновенные вещи волшебными. Они помогают нам взглянуть на мир и нас самих по-другому, стать добрее, счастливее и сильнее.
            </p><br></br>
            <p>
              Авторы подкаста: Маргарита и Платон Мерсияновы
            </p><br></br>
            <p>
              Наш сервис психологической поддержки «”Сказки для жизни” спешат на помощь» в телеграме: https://t.me/skazkidlyazhiznibot
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;