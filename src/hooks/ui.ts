import { useEffect, useState } from 'react'
import {isMobile} from 'react-device-detect'

const SCROLL_TRIGGER = 5
const BREAKPOINT_SMALL = 1024

export const useScroll = () => {
    const [position, setPosition] = useState(0)
    const [isScrolled, setScrolled] = useState(false)
    
    const onScroll = () => {
      const { scrollTop } = document.documentElement || document.body
  
      setPosition(scrollTop)
      setScrolled(scrollTop > SCROLL_TRIGGER)
    }
  
    useEffect(() => {
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)  
    }, [])
  
    return { position, isScrolled }
  }
  
  export const useViewport = () => {
    const compute = () => {
      const ua = window.navigator.userAgent

      const { innerWidth, innerHeight, devicePixelRatio } = window
      const isPortrait = (innerWidth < innerHeight)
      const isSmall = ua === "carmelmobile" || (innerWidth <= BREAKPOINT_SMALL && isMobile)

      const weight = ua === "carmelmobile" ? 1 : (isSmall && isPortrait ? devicePixelRatio : 1)
      const baseFontSize = 14

      const fonts = {
        xxxl: Math.ceil(baseFontSize * weight * 2.71),
        xxl: Math.ceil(baseFontSize * weight * 2.14),
        xl: Math.ceil(baseFontSize * weight * 1.71),
        l: Math.ceil(baseFontSize * weight * 1.42),
        m:  Math.ceil(baseFontSize * weight * 1),
        s:  Math.ceil(baseFontSize * weight * 0.83),
        xs:  Math.ceil(baseFontSize * weight * 0.64),
      } 

      return {
        width: innerWidth, 
        height: innerHeight,
        isPortrait,
        isMobile,
        isSmall,
        fonts,
        scale: devicePixelRatio
      }
    }

    const current = compute()
    const [viewport, setViewport] = useState(current)
  
    const onResize = () => {
      setViewport(compute())
    }
  
    useEffect(() => {
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)  
    }, [])
  
    return viewport
  }

  