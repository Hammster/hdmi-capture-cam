import React, { useEffect, useState } from 'react'
import styles from './contols.module.css'
import { AnchorButton, Button, ButtonGroup, Callout, Classes, Code, Dialog, FormGroup, H5, HTMLSelect, InputGroup, Intent, Menu, MenuDivider, MenuItem, Popover, Position, Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { useAppSettingsStore } from '../state/settings';

let videoInputs: MediaDeviceInfo[] = []
let audioInputs: MediaDeviceInfo[] = []
let appStartTime = new Date()
let sessionStartTime = new Date()

initialize()

async function initialize() {
  const videoPermissionGranted = await navigator.permissions.query({ name: 'camera' })
  console.log(videoPermissionGranted)

  navigator.mediaDevices.enumerateDevices()
    .then(result => {
      videoInputs = result.filter(device => device.kind === 'videoinput')
      audioInputs = result.filter(device => device.kind === 'audioinput')
      console.log('devicesMapped')
    })
}

function Controls() {
  const [isOptionOpen, setIsOptionOpen] = useState(false)
  const [videoState, setVideoState] = useState({
    playing: false,
    paused: false,
    stopped: true
  })
  const [timeNow, setTimeNow] = useState(Date.now())
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeNow(Date.now());
    }, 1000);
  });
  

  const appSettings = useAppSettingsStore(state => state)

  const handleOpen = () => setIsOptionOpen(true)
  const handleClose = () => setIsOptionOpen(false)

  const handleStart = () => {
    navigator.getUserMedia(
      // constraints
      {
        video: {
          width: { min: appSettings.resolutionW },
          height: { min: appSettings.resolutionH },
          latency: 0,
          deviceId: appSettings.videoSourceId!
        },
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          deviceId: appSettings.audioSourceId!,
        }
      },

      // successCallback
      function (localMediaStream) {
        const video = document.querySelector('video')!
        video.srcObject  = localMediaStream
        video.onloadedmetadata = function (e) {
          video.play()
          sessionStartTime = new Date()
          setVideoState({
            playing: true,
            paused: false,
            stopped: false
          })
        };
      },

      // errorCallback
      function (err) {
        console.error(err)
      }
    )
  }
  const handleStop = () => {
    const video = document.querySelector('video')!
    video.srcObject = null
    setVideoState({
      playing: false,
      paused: false,
      stopped: true
    })
  }
  const handlePause = () => {
    const video = document.querySelector('video')!
    video.pause()
    setVideoState({
      playing: false,
      paused: true,
      stopped: false
    })
  }

  const hhmmss = (difference: number) => {
    let offset = new Date(difference)
    let HH = (offset.getHours() - 1).toString().padStart(2, '0')
    let MM = (offset.getMinutes()).toString().padStart(2, '0')
    let SS = (offset.getSeconds()).toString().padStart(2, '0')
    return `${HH}:${MM}:${SS}`
  }

  const getAppTime = () => {
    return hhmmss(timeNow - appStartTime.getTime())
  }

  const getSessionTime = () => {
    if(!videoState.playing) return 'stopped'
    return hhmmss(timeNow - sessionStartTime.getTime())
    
  }

  return (
    <div className={styles.controls}>
      <ButtonGroup>
        <Button onClick={handleOpen}>Options</Button>
        <Button disabled={videoState.playing} intent={videoState.playing  ? Intent.SUCCESS  : undefined} icon="play"  onClick={handleStart} />
        <Button disabled={videoState.stopped || videoState.paused} intent={videoState.paused   ? Intent.WARNING  : undefined} icon="pause" onClick={handlePause} />
        <Button disabled={videoState.stopped} intent={videoState.stopped  ? Intent.DANGER   : undefined} icon="stop"  onClick={handleStop} />
        <Popover position={Position.TOP} content={
            <Menu>
              <MenuItem className={styles.preservedEntry} disabled text={`Running (App):     ${getAppTime()}`} />
              <MenuItem className={styles.preservedEntry} disabled text={`Running (Session): ${getSessionTime()}`} />
              <MenuDivider />
              <MenuItem disabled text="Version 1.0.0" />
            </Menu>
        }>
            <Button icon="chart" text="Stats" />
        </Popover>
      </ButtonGroup>

      

      <Dialog
        icon="cog"
        onClose={handleClose}
        title="Settings"
        isOpen={isOptionOpen}
      >
        <div className={Classes.DIALOG_BODY}>
          <Callout>Settings are automatically applied</Callout>
          <br />
          <FormGroup
            helperText="Source that will provide the video like a webcam or capturecard"
            label="Video Source"
            labelFor="videoSourceSelect"
            labelInfo="(required)"
          >
            <HTMLSelect id="videoSourceSelect" defaultValue={appSettings.videoSourceId || undefined} onChange={(event) => { appSettings.updateVideoSource(event.currentTarget.value) }}>
              <option selected disabled>Choose an video source</option>
              {videoInputs.map(input => <option value={input.deviceId}>{input.label}</option>)}
            </HTMLSelect>
          </FormGroup>

          <FormGroup
            helperText="Source that will provide the audio like a microphone or capturecard"
            label="Audio Source"
            labelFor="audioSourceSelect"
            labelInfo="(required)"
          >
            <HTMLSelect id="audioSourceSelect" defaultValue={appSettings.audioSourceId || undefined} onChange={(event) => { appSettings.updateAudioSource(event.currentTarget.value) }}>
              <option selected disabled>Choose an audio source</option>
              {audioInputs.map(input => <option value={input.deviceId}>{input.label}</option>)}
            </HTMLSelect>
          </FormGroup>

          <FormGroup
            helperText="Resolution of the video"
            label="Video Resolution"
            labelFor="videoResultionRadio"
            labelInfo="(required)"
          >
            <RadioGroup onChange={() => {}}>
                <Radio className={styles.preservedEntry} label="4320p | 7680 x 4320"  value="one" />
                <Radio className={styles.preservedEntry} label="2160p | 3840 x 2160"  value="one" />
                <Radio className={styles.preservedEntry} label="1440p | 2560 x 1440"  value="two" />
                <Radio className={styles.preservedEntry} label="1080p | 1920 x 1080"  value="three" />
                <Radio className={styles.preservedEntry} label="720p  | 1280 x 720"   value="three" />
                <Radio className={styles.preservedEntry} label="SVGA  | 800 × 600"    value="three" />
            </RadioGroup>
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Dialog>
    </div>
  )
}

export default Controls
