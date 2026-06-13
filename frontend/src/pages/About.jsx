import React from 'react'
import Hero from '../components/about/Hero.jsx'
import Problem from '../components/about/Problem.jsx'
import WhyCodelens from '../components/about/WhyCodelens.jsx'
import Growth from '../components/about/Growth.jsx'
import Ecosystem from '../components/about/Ecosystem.jsx'
import Commitment from '../components/about/Commitment.jsx'
import Community from '../components/about/Community.jsx'
import Working from '../components/about/Working.jsx'
import Privacy from '../components/about/Privacy.jsx'
import FAQSection from '../components/explore/FAQSection.jsx'
import AboutCTA from '../components/about/AboutCTA.jsx'

const About = () => {
  return (
    <>
    <Hero/>
    <Problem/>
    <WhyCodelens/>
    <Growth/>
    <Ecosystem/>
    <Commitment/>
    <Community/>
    <Working/>
    <Privacy/>
    <FAQSection/>
    <AboutCTA/>
    </>
  )
}

export default About
