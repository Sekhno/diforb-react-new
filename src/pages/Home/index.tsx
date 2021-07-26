import React, { useEffect, useState, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withRouter }       from 'react-router-dom'
import { PlayState, Tween } from 'react-gsap'
import { Carousel }         from 'primereact/carousel'
import { DeferredContent }  from 'primereact/deferredcontent'
import { Library }          from '../../helpers/firebase.interface'
import { onLoadLibraries }  from '../../async/dashboardAction'
import CarouselItem         from './CarouselItem'
import diforbPlayerImage    from '../../assets/img/wire-frame.png'
import degtyarevImage       from '../../assets/img/teams/degtyarev.webp'
import sekhnoImage          from '../../assets/img/teams/sekhno.jpeg'
import arismyatovImage      from '../../assets/img/teams/arismyatov.jpeg'
import shcheglovImage       from '../../assets/img/teams/shcheglov.jpeg'
import hilobokImage         from '../../assets/img/teams/hilobok.jpeg'
import styles               from './index.module.scss'


const Home = (): JSX.Element => {
  

  return (
    <div>Home</div>
  )
}



const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Home))