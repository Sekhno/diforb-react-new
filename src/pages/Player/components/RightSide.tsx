import React, { useState } from 'react'
import { PlayState, Tween } from 'react-gsap'
import { Skeleton } from 'primereact/skeleton'
import { ScrollPanel } from 'primereact/scrollpanel'
import { PropsSideInterface, SoundListType, ActiveSound } from '../types'
import styles from './Side.module.scss'

const TIME = .3
const HEIGHT = (window.innerHeight - 88) + 'px'
const defaultActiveSound: ActiveSound = {
  category: '',
  sub: '',
  sound: ''
}

export const RightSide = (props: PropsSideInterface) => {
  const [ active, setActive ] = useState(defaultActiveSound)
  const [ activeCategory, setActiveCategory ] = useState(0)
  const [ activeSubCategory, setActiveSubcategory ] = useState(-1)
  const [ activeSound, setActiveSound ] = useState(-1)
  const [ playStateSubcategory, setPlayStateSubCategory ] = useState(PlayState.play)
  const { library, loading, mode, onChangeSound, onActive } = props
  const format = library?.format || 'wav'

  let data
  if (mode) {
    data = library[mode] || []
  } else {
    data = library?.data ? library?.data : library?.extra || []
  }

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
      onChangeSound(`libraries/${library.id}/${category}/${subcategory}.${format}`)
      setActive({ category, sub: '', sound: subcategory})
      onActive({ category, sub: '', sound: subcategory })
    } else {
      activeSubCategory !== i ? setActiveSubcategory(i) : setActiveSubcategory(-1)
    }
  }
  const clickSound = (category: string, sub: string, sound: string, i: number) => {
    onChangeSound(`libraries/${library.id}/${category}/${sub}/${sound}.${format}`)
    setActiveSound(i)
    onActive({ category, sub, sound })
    setActive({ category, sub, sound })
  }
  const currentSound = (visibleCategory: string, visibleSub: string, visibleSound: string, i: number): boolean => {
    const { category, sub, sound } = active
    return visibleCategory === category 
    && visibleSub === sub
    && visibleSound === sound
    && activeSound === i
  }
  const currentSubSound = (visibleCategory: string, visibleSubSound: string, i: number): boolean => {
    const { category, sound } = active
    return visibleCategory === category 
    && visibleSubSound === sound
  }
  const getClassIfTypeSound = (type: string, visibleCategory: string, visibleSound: string, i: number) => {
    if (type === SoundListType.sound) {
      if (loading && currentSubSound(visibleCategory, visibleSound, i)) {
        return styles.loading
      }
      else if (!loading && currentSubSound(visibleCategory, visibleSound, i)) {
        return styles.active
      }
      else return ''
    }
  }

  return(
    <div className = { styles.rightSide }>
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
                <ScrollPanel className = { styles.scrollPanel } style={{ height: HEIGHT, width: '100%' }}>
                  {
                    category.data.map((subcategory, i) => (
                      <Tween key = { subcategory.name } 
                        from = {{ x: -50, opacity: 0 }} duration = { TIME } 
                        stagger = {() => i * TIME}
                        playState = { playStateSubcategory }>
                        <li className = { styles.subcategoryItem }>
                          <div className = { getClassIfTypeSound(subcategory.type, category.name, subcategory.name, i) }
                            onClick = {() => clickSubcategory(i, category.name, subcategory.type, subcategory.name)}
                          >
                            <i className = { subcategory.icon || category.icon }/>
                            <span datatype = { subcategory.name }>{ subcategory.name }</span>
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
                                      onClick = {() => clickSound(category.name, subcategory.name, sound.name, i)}
                                    >
                                      <span datatype = {sound.name} 
                                        className = { loading && currentSound(category.name, subcategory.name, sound.name, i) 
                                          ? styles.loading 
                                          : !loading && currentSound(category.name, subcategory.name, sound.name, i) ? styles.active : '' }
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
                </ScrollPanel>
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

export default RightSide