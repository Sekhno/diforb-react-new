import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Accordion, AccordionTab } from 'primereact/accordion'

export const Faq = () => {
  const [ activeIndex, setActiveIndex] = useState(-1)


  return(
    <div className = 'paperWrapper'>
      {
        <Accordion activeIndex = { activeIndex } 
          expandIcon = 'icon-chevron-down' collapseIcon = 'icon-chevron-up'
          onTabChange={(e) => setActiveIndex(e.index)}>
          {
            faqs.map(({id, header, content}, i) => (
              <AccordionTab headerTemplate = { 
                <HeaderTemplate header = {header} active = { activeIndex === i }/> 
               } key = {i}>
                <p> <span className = 'p-mr-1'>A:</span>{content}</p>
              </AccordionTab>
            ))
          }
        </Accordion>
      }
    </div>
  )
}

const HeaderTemplate = (props: any): JSX.Element => {
  const { header, active } = props

  return (
    <React.Fragment>
      <b className = 'p-mr-1'>Q:</b> <span>{ header }</span> 
    </React.Fragment>
  )
}

const faqs = [
	{
		"id": "q-1",
		"header": "What is Diforb and what can it do?",
		"content": "Diforb is a set of convenient tools which can help you to create unique sound effects and process different sounds. At present, our sound  libraries can give you a chance to make a variety of unmatchable sound effects. "
	},
	{
		"id": "q-2",
		"header": "Where can I use sounds, made with the help of  Diforb libraries?",
		"content": "These sounds can be used in any media projects such as games, ads presentations, applications, video blogs and others. You can not sell these sounds or set them free on any other recourses. You can get more particular information in “ License Agreement” paragraph."
	},
	{
		"id": "q-3",
		"header": "Can I use these sounds in any commercial projects?",
		"content": "You can use them both for commercial and noncommercial projects."
	},
	{
		"id": "q-4",
		"header": "Can I have any problems with copyrights in future?",
		"content": "All sound libraries and sounds entitlements are Diforb`s ownership. If you follow “License Agreement”, you will have no problems with copyrights."
	},
	{
		"id": "q-5",
		"header": "What is Pitch function for?",
		"content": "Pitch function can be used to lower or raise any sound key, to make a sound shorter ( when raising a key) or longer ( when lowering a key). This function is not active in some libraries to optimize sound combinations."
	},
	{
		"id": "q-6",
		"header": "What can be Reverb used for?",
		"content": "Reverb is indoor sound simulation effect. It generates sound reflections from the chosen virtual room walls. You can use three presets for different locations situated according to the increasing of their  locations size – Room, Hall, Stadium. Reverb fader gives you an opportunity to control the amount of reverberation you want to mix into your sound. We recommend you to use this effect if you have to replace the sound into any specific space or increase the volume of the sound or its value."
	},
	{
		"id": "q-7",
		"header": "I was tuning up the sound in the library and found myself stuck. How can I come back to Diforb library settings?",
		"content": "To do it you should reload the library page in your browser. In a short time, a special button will be worked out for such situations."
	}
]

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Faq))