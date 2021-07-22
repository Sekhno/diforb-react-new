import React, { useEffect, useState, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Carousel }         from 'primereact/carousel'
import { Toolbar }          from 'primereact/toolbar'
import { Button }           from 'primereact/button'
import { Avatar }           from 'primereact/avatar'
import { TabMenu }          from 'primereact/tabmenu'
import { Divider }          from 'primereact/divider'
import { getFirebaseBackend } from '../../helpers/firebase.helper'
import { Library }          from '../../helpers/firebase.interface'
import { onLogout }         from '../../async/authActions'
import { onLoadLibraries }  from '../../async/dashboardAction'
import CarouselItem         from './CarouselItem'
import diforbPlayerImage    from '../../assets/img/wire-frame.png'
import degtyarevImage       from '../../assets/img/teams/degtyarev.webp'
import sekhnoImage          from '../../assets/img/teams/sekhno.jpeg'
import arismyatovImage      from '../../assets/img/teams/arismyatov.jpeg'
import shcheglovImage       from '../../assets/img/teams/shcheglov.jpeg'
import hilobokImage         from '../../assets/img/teams/hilobok.jpeg'
import styles               from './Dashboard.module.scss'


const Home = (): JSX.Element => {
  const [ page, setPage ] = useState(0)
  const dispatch = useDispatch()
  const carouselRef = useRef(null)
  const libraries = useSelector((state: { dashboard: { libraries: Library[]} }) => state.dashboard.libraries)
  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
      numScroll: 1
  },
  {
      breakpoint: '600px',
      numVisible: 2,
      numScroll: 2
  },
  {
      breakpoint: '480px',
      numVisible: 1,
      numScroll: 1
  }
  ]
  
  useEffect(() => {
    dispatch(onLoadLibraries())
  }, [])

  useEffect(() => {
    console.log('Page: >>>>' + page)
  }, [ page ])

  useEffect(() => {
    console.log('Ref: >>>', carouselRef)
  }, [ carouselRef ])

  return (
    <div className = { styles.wrapper }>
      <section className = { styles.sectionSlogan }>
        <div className = 'p-grid'>
          <div className = 'p-col-8'>
            <div className = { styles.slogan }>
              <i className = 'icon-diforb-logo'/> <br />
              <span>
                Diforb – это онлайн сервис для создания звуковых эффектов и музыки.
                Наша целевая аудитория - разработчики компьютерных игр, но сервис также будет 
                полезен и в других направлениях : анимация, реклама, презентации и другие медиа продукты. 
                На сегодняшний день у нас готов прототип для создания звуков. 
                Проведено тестирование гипотез на русскоязычной аудитории и получены положительные отзывы.
              </span>
            </div>
            
          </div>
          <div className = 'p-col-4'>
            <div className = { styles.image }>
              <img src = { diforbPlayerImage } alt = 'diforb_player' />
            </div>
          </div>
        </div>   
      </section>
      <section className = { styles.sectionCarousel }>
        <Carousel 
          ref = { carouselRef }
          value = { libraries } numVisible = { 5 } numScroll = { 1 } 
          responsiveOptions = { responsiveOptions }
          itemTemplate = { CarouselItem } 
          header = { null } 
          // page = { page }
          autoplayInterval = { 3000 }
          circular
          // onPageChange = {(e) => setPage(e.page)}
        />
      </section>
      <section className = { styles.sectionProblems }>
        <div className = 'p-grid'>
          <div className = 'p-col-8'>
            <h2>ПРОБЛЕМЫ</h2>
            <p> <b>разработчика при создании звукового оформления для игры:</b> </p>
            <div className = 'p-grid'>
              <div className = 'p-col-4'>
                <h3>Стоки:</h3>
                <ul>
                  <li>Мало профильного контента</li>
                  <li>Нельзя редактировать звук</li>
                  <li>Низкое качество контента</li>
                </ul>
              </div>
              <div className = 'p-col-4'>
                <h3>Звуковой редактор:</h3>
                <ul>
                  <li>Дорого</li>
                  <li>Требует установки</li>
                  <li>Требует обучения</li>
                </ul>
              </div>
              <div className = 'p-col-4'>
                <h3>Редактирование:</h3>
                <ul>
                  <li>Требует навыков</li>
                  <li>Долго</li>
                </ul>
              </div>
            </div>
          </div>
          <div className = 'p-col-4'>
            <h2>РЕШЕНИЕ</h2>
            <p> <b>Diforb помогает быстро найти, отредактировать и получить нужные звуковые эффекты</b> </p>
          </div>
        </div>
      </section>
      <section className = { styles.sectionTeams }>
        <div className = 'p-grid'>
          <div className = 'p-col-4'>
            <h2>КОМАНДА</h2>
          </div>
          <div className = 'p-col-8'>
            Наша команда имеет многолетний опыт в работе со звуком в сфере кинопроизводства и игровой индустрии, соответственно мы очень хорошо знаем потребности своей целевой аудитории.
          </div>
        </div>
        <div className = 'p-grid'>
          <div className = 'p-col'>
            <div className = { styles.avatar }>
              <img src = { shcheglovImage } alt = '' />
            </div>
            <h3 className = 'p-text-center'>Виктор Щеглов </h3>
            <h4 className = 'p-text-center'>CEO</h4>
          </div>
          <div className = 'p-col'>
            <div className = { styles.avatar }>
              <img src = { hilobokImage } alt = '' />
            </div>
            <h3 className = 'p-text-center'>Валерий Хилобок  </h3>
            <h4 className = 'p-text-center'>Founder</h4>
          </div>
          <div className = 'p-col'>
            <div className = { styles.avatar }>
              <img src = { arismyatovImage } alt = '' />
            </div>
            <h3 className = 'p-text-center'>Андрей Арисмятов</h3>
            <h4 className = 'p-text-center'>CTO</h4>
          </div>
          <div className = 'p-col'>
            <div className = { styles.avatar }>
              <img src = { degtyarevImage } alt = '' />
            </div>
            <h3 className = 'p-text-center'>Сергей Дегтярёв</h3>
            <h4 className = 'p-text-center'>UX/UI</h4>
          </div>
          <div className = 'p-col'>
            <div className = { styles.avatar }>
              <img src = { sekhnoImage } alt = '' />
            </div>
            <h3 className = 'p-text-center'>Дмитрий Сехно</h3>
            <h4 className = 'p-text-center'>Frontend</h4>
          </div>
          
        </div>
        
      </section>
    </div>
  )
}



const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Home))