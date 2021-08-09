import React, { useState } from 'react'
import { PlayState, Tween } from 'react-gsap'
import { Skeleton } from 'primereact/skeleton'
import { PropsSideInterface, SoundListType } from '../types'
import styles from './Side.module.scss'

const TIME = .3

const LeftSide = (props: PropsSideInterface) => {
  const [ activeCategory, setActiveCategory ] = useState(0)
  const [ activeSubCategory, setActiveSubcategory ] = useState(-1)
  const [ activeSound, setActiveSound ] = useState(-1)
  const [ playStateSubcategory, setPlayStateSubCategory ] = useState(PlayState.play)
  const { library, loading, onChangeSound } = props
  const data = library?.data ? library?.data : library?.main || []
  const clickCategory = (i: number) => {
    setActiveSubcategory(-1)
    setPlayStateSubCategory(PlayState.reverse)
    setTimeout(() => {
      setPlayStateSubCategory(PlayState.restart)
      setPlayStateSubCategory(PlayState.play)
      setActiveCategory(i)
    }, TIME * 1000)
  }
  const clickSubcategory = (i: number, category: string, type: string, subcategory: string) => {
    if (type === SoundListType.sound) {
      onChangeSound(`libraries/${library.name}/${category}/${subcategory}.wav`)
    } else {
      activeSubCategory !== i ? setActiveSubcategory(i) : setActiveSubcategory(-1)
    }
  }
  const currentSound = (i: number): boolean => {
    return activeSound === i
  }


  return(
    <div className = { styles.leftSide }>
      <ul className = { styles.categories }>
        {
          !library ? (
            <React.Fragment>
              <li><Skeleton height = '100%'/></li>
              <li><Skeleton height = '100%'/></li>
              <li><Skeleton height = '100%'/></li>
              <li><Skeleton height = '100%'/></li>
              <li><Skeleton height = '100%'/></li>
            </React.Fragment>
          ) :
          data.map((category, i) => (
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
                      <li>
                        <div onClick = {() => clickSubcategory(i, category.name, subcategory.type, subcategory.name)}>
                          <i className = { subcategory.icon || category.icon }/>
                          <span>{ subcategory.name }</span>
                        </div>
                        {
                          subcategory.type === SoundListType.sub &&
                          <Tween
                            from = {{ height: 0, opacity: 0 }} duration = { TIME }
                            playState = { activeSubCategory === i ? PlayState.play : PlayState.reverse }>
                            <ul className = { styles.sounds }>
                              {
                                subcategory.data.map((sound, i) => (
                                  <li className = { styles.sound } 
                                    key = { `${subcategory.name}_${sound.name}` } 
                                    onClick = {() => (onChangeSound(`libraries/${library.name}/${category.name}/${subcategory.name}/${sound.name}.wav`),
                                    setActiveSound(i))}
                                  >
                                    <span datatype = {sound.name} 
                                      className = { loading && currentSound(i) ? styles.loading : !loading && currentSound(i) ? styles.active : '' }
                                    >{ sound.name }</span>
                                  </li>
                                ))
                              }
                            </ul>
                          </Tween>
                        }
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