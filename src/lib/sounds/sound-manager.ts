'use client'

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('kyc-sounds') !== 'false'
    }
  }

  private getOrCreateAudio(name: string, src: string): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null

    if (!this.sounds.has(name)) {
      const audio = new Audio(src)
      audio.preload = 'auto'
      this.sounds.set(name, audio)
    }
    return this.sounds.get(name)!
  }

  play(sound: 'correct' | 'wrong' | 'levelup' | 'complete' | 'click') {
    if (!this.enabled) return

    // Use Web Audio API for simple sounds
    if (typeof window === 'undefined') return

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    switch (sound) {
      case 'correct':
        // Happy ascending tone
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2) // G5
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.4)
        break

      case 'wrong':
        // Descending buzzer
        oscillator.frequency.setValueAtTime(200, ctx.currentTime)
        oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.15)
        oscillator.type = 'sawtooth'
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.3)
        break

      case 'levelup':
        // Fanfare
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
        // Success chime
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime)
        oscillator.frequency.setValueAtTime(987.77, ctx.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.5)
        break

      case 'click':
        // Short click
        oscillator.frequency.setValueAtTime(800, ctx.currentTime)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.05)
        break
    }
  }

  toggle() {
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('kyc-sounds', this.enabled.toString())
    }
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }
}

export const soundManager = new SoundManager()
