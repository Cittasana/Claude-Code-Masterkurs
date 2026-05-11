import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Single registration point for GSAP ScrollTrigger.
 * Import this module before using ScrollTrigger anywhere.
 * Idempotent — registering the same plugin twice is a no-op.
 */
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
