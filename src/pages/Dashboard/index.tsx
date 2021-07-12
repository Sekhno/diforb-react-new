import React, { useEffect, useState, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter }       from 'react-router-dom'
import { Carousel }         from 'primereact/carousel'
import { Toolbar }          from 'primereact/toolbar'
import { Button }           from 'primereact/button'
import { Avatar }           from 'primereact/avatar'
import { getFirebaseBackend } from '../../helpers/firebase.helper'
import { Library }          from '../../helpers/firebase.interface'
import { onLogout }         from '../../async/authActions'
import { onLoadLibraries }  from '../../async/dashboardAction'
import CarouselItem         from './CarouselItem'
import styles               from './Dashboard.module.scss'




const Dashboard = (): JSX.Element => {
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
  const LeftContents = (): JSX.Element => {
    return <span className = { 'icon-diforb-logo' }/>
  }
  const RightContents = (): JSX.Element => {
    return (
      <React.Fragment>
        <CustomAvatar/>
        <Button icon = 'icon-logout' onClick = {() => dispatch(onLogout())}/>  
      </React.Fragment>
    )
  }
  const CustomAvatar = (): JSX.Element => {
    const user = getFirebaseBackend()?.getAuthenticatedUser()
    return (
      <React.Fragment>
        
        <Avatar icon = 'icon-avatar' shape="circle"/>
        <span>{ user?.displayName }</span>
      </React.Fragment>
    )
  }
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
      <Toolbar left = { LeftContents } right = { RightContents }/> 
      <section className = { styles.sectionCarousel }>
        <Carousel 
          ref = { carouselRef }
          value = { libraries } numVisible = { 5 } numScroll = { 1 } 
          responsiveOptions = { responsiveOptions }
          itemTemplate = { CarouselItem } 
          header = { null } 
          page = { page }
          circular = { true }
          onPageChange = {(e) => setPage(e.page)}
        />
      </section>
      <section className = { styles.sectionSlogan }>
        <p>
          <i className = 'icon-diforb-logo'/>
          – это онлайн сервис для создания звуковых эффектов и музыки.
          Наша целевая аудитория - разработчики компьютерных игр, но сервис также будет 
          полезен и в других направлениях : анимация, реклама, презентации и другие медиа продукты. 
          На сегодняшний день у нас готов прототип для создания звуков. 
          Проведено тестирование гипотез на русскоязычной аудитории и получены положительные отзывы.
        </p>
      </section>
    </div>
  )
}



const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard))