'use client'

class SoundManagerClass {
  private enabled: boolean = true
  private initialized: boolean = false

  private init() {
    if (this.initialized) return
    if (typeof window === 'undefined') return

    try {
      this.enabled = localStorage.getItem('kyc-sounds') !== 'false'
    } catch {
      this.enabled = true
    }
    this.initialized = true
  }

  play(sound: 'correct' | 'wrong' | 'levelup' | 'complete' | 'click') {
    if (typeof window === 'undefined') return

    this.init()
    if (!this.enabled) return

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return

      const ctx = new AudioContextClass()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      switch (sound) {
        case 'correct':
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime)
          oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.4)
          break

        case 'wrong':
          oscillator.frequency.setValueAtTime(200, ctx.currentTime)
          oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.15)
          oscillator.type = 'sawtooth'
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.3)
          break

        case 'levelup':
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime)
          oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15)
          oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3)
          oscillator.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.45)
          gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.7)
          break

        case 'complete':
          oscillator.frequency.setValueAtTime(783.99, ctx.currentTime)
          oscillator.frequency.setValueAtTime(987.77, ctx.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.5)
          break

        case 'click':
          oscillator.frequency.setValueAtTime(800, ctx.currentTime)
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.05)
          break
      }
    } catch {
      // Silently fail
    }
  }

  toggle() {
    this.init()
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kyc-sounds', this.enabled.toString())
      } catch {
        // Ignore
      }
    }
    return this.enabled
  }

  isEnabled() {
    this.init()
    return this.enabled
  }
}

let instance: SoundManagerClass | null = null

export function getSoundManager(): SoundManagerClass {
  if (!instance) {
    instance = new SoundManagerClass()
  }
  return instance
}

// Simple functions that can be called directly
export const playSound = (sound: 'correct' | 'wrong' | 'levelup' | 'complete' | 'click') => {
  getSoundManager().play(sound)
}
