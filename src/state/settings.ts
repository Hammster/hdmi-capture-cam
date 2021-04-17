import create, { State } from 'zustand'

export interface IAppSettings extends State {
  videoSourceId: string | null
  audioSourceId: string | null
  resolutionW: number
  resolutionH: number
  updateVideoSource: (by: string) => void
  updateAudioSource: (by: string) => void
  updateVideoWidth: (by: number) => void
  updateVideoHeight: (by: number) => void
}

// @TODO: add some localstorage loading once the app is running
export const useAppSettingsStore = create<IAppSettings>(set => ({
  videoSourceId: localStorage.getItem('videoSourceId') || null,
  audioSourceId: localStorage.getItem('audioSourceId') || null,
  resolutionW: 1920,
  resolutionH: 1080,
  updateVideoSource: (by) => set((state) => {
    localStorage.setItem('videoSourceId', by)
    return { ...state, videoSourceId: by }
  }),
  updateAudioSource: (by) => set((state) => {
    localStorage.setItem('audioSourceId', by)
    return { ...state, audioSourceId: by }
  }),
  updateVideoWidth: (by) => set((state) => ({ ...state, resolutionW: by })),
  updateVideoHeight: (by) => set((state) => ({ ...state, resolutionH: by })),
}))
