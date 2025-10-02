class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setCurrentAudio(audio: HTMLAudioElement | null) {
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
    }
    this.currentAudio = audio;
  }

  getCurrentAudio(): HTMLAudioElement | null {
    return this.currentAudio;
  }

  pauseAll() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }
}

export default AudioManager;

