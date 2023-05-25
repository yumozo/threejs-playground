import gamepadTest from './gamepadTest'
import { gamepadAPI } from './gamepadAPI'

interface IControls {
  registerKeyDown(key: string, func: Function): void
  registerKeyDown(keycode: number, func: Function): void
  removeOnKeyDown(key: string, func: Function): void
  removeOnKeyDown(keycode: number, func: Function): void
}

export class GameControls implements IControls {
  private adrStr: string
  private savedOnDownKeysAsStr: Set<string>
  private savedOnDownKeysAsNum: Set<number>
  private savedOnReleaseKeys: Set<string>
  private gamepadAPI = gamepadAPI

  constructor() {
    this.adrStr = '[controls]: '
    this.savedOnDownKeysAsStr = new Set()
    this.savedOnDownKeysAsNum = new Set()
    this.savedOnReleaseKeys = new Set()

    // --- HANDLE GAMEPAD
    window.addEventListener('gamepadconnected', gamepadAPI.connect)
    window.addEventListener('gamepaddisconnected', gamepadAPI.disconnect)
    // ---
  }

  // STRING KEY REPRESENTATION
  registerKeyDown(key: string | number, func: Function, gamepad?: boolean) {
    if (typeof key === 'string') {
      if (gamepad) {
        setInterval(() => {
          if (gamepadAPI.buttonPressed(key)) {
            func()
            console.log('Gamepad button pressed: ', key)
          }
        }, 1)
      }
      if (this.savedOnDownKeysAsStr.has(key)) return
      window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === key) {
          func()
        }
      })
      this.savedOnDownKeysAsStr.add(key)
    } else if (typeof key === 'number') {
      // if (this.savedOnDownKeysAsNum.has(key)) return
      // window.addEventListener('keydown', (e: KeyboardEvent) => {
      //   if (e.key === key) {
      //     // here's not .key
      //     func()
      //   }
      // })
      // this.savedOnDownKeysAsNum.add(key)
    } else {
      throw new Error('no valid key value in registerKeyDown')
    }
    console.log(this.adrStr + `key ${key} registered.`)
  }

  removeOnKeyDown(key: string) {
    if (this.savedOnDownKeys.has(key)) {
      this.savedOnDownKeys.delete(key)
    } else console.warn(this.adrStr + 'no such key registered on press.')
  }

  onKeyUp(key: string, func: Function) {
    if (this.savedOnReleaseKeys.has(key)) return
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.which === key) {
        func()
      }
    })
    this.savedOnReleaseKeys.add(key)
    console.log(this.adrStr + `key ${key} registered on release.`)
  }

  removeOnKeyUp(key: string) {
    if (this.savedOnReleaseKeys.has(key)) {
      this.savedOnReleaseKeys.delete(key)
    } else console.warn(this.adrStr + 'no such key registered.')
  }
}
