import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, useGSAP)

gsap.defaults({ ease: 'expo.out', duration: 1.1 })

/** House easings. Kept few and consistent so motion reads as one system. */
export const ease = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  soft: 'power2.out',
} as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { Flip, gsap, ScrollTrigger, SplitText, useGSAP }
