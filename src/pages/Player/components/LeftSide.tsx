import React, { SyntheticEvent, useState } from 'react'
import { Controls, PlayState, Tween } from 'react-gsap'
import { of, timeout } from 'rxjs'
import { PropsSideInterface, SoundListType } from '../types'
import styles from './Side.module.scss'

const TIME = .3

const LeftSide = (props: PropsSideInterface) => {
  const [ activeCategory, setActiveCategory ] = useState(0)
  const [ playStateSubcategory, setPlayStateSubCategory ] = useState(PlayState.play)
  const { library } = props
  const clickCategory = (i: number) => {
    setPlayStateSubCategory(PlayState.reverse)
    setTimeout(() => {
      setPlayStateSubCategory(PlayState.restart)
      setPlayStateSubCategory(PlayState.play)
      setActiveCategory(i)
    }, TIME * 1000)
  }
  const clickSubcategory = (i: number) => {}
  const clickSound = (url: string) => {}

  return(
    <div className = { styles.leftSide }>
      <ul className = { styles.categories }>
        {
          !library ? <li>Downloading...</li> :
          library.data.map((category, i) => (
            <li key = { category.name } 
              className = { activeCategory === i ? styles.active : '' }>
              <div onClick = {() => clickCategory(i)}>
                <i className = { category.icon }/>
                <span>{ category.name }</span>
              </div>
              <ul className = { styles.subcategory }>
                {
                  category.data.map((subcategory, i) => (
                    <Tween key = { subcategory.name } 
                      from = {{ x: -50, opacity: 0 }} duration = { TIME } 
                      stagger = {() => i * TIME}
                      playState = { playStateSubcategory }>
                      <li onClick = {() => {
                        subcategory.type === SoundListType.sub ? 
                        clickSubcategory(i) : 
                        clickSound(``)
                      }}>
                        <i className = { subcategory.type === SoundListType.sub ? subcategory.icon : category.icon }/>
                        <span>{ subcategory.name }</span>
                      </li>
                    </Tween>
                  ))
                }
              </ul>
            </li>
          ))
        }
      </ul>
      <Tween to = {{ y: activeCategory * 80 }} duration = { TIME }  ease = 'back.out(1.7)'
        playState = { PlayState.play }>
        <div className = { styles.categoryShadow }/>
      </Tween>
      
    </div>
  )
}

export default LeftSide