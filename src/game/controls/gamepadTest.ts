const haveEvents = 'GamepadEvent' in window
const haveWebkitEvents = 'WebKitGamepadEvent' in window
const controllers = {} as Gamepad[]
const rAF =
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame

function connecthandler(e: GamepadEvent) {
  addgamepad(e.gamepad)
}
function addgamepad(gamepad: Gamepad) {
  controllers[gamepad.index] = gamepad
  const d = document.createElement('div')
  d.setAttribute('id', 'controller' + gamepad.index)
  const t = document.createElement('h1')
  t.appendChild(document.createTextNode('gamepad: ' + gamepad.id))
  d.appendChild(t)
  var b = document.createElement('div')
  b.className = 'buttons'
  for (var i = 0; i < gamepad.buttons.length; i++) {
    var e = document.createElement('span')
    e.className = 'button'
    //e.id = "b" + i;
    e.innerHTML = i.toString()
    b.appendChild(e)
  }
  d.appendChild(b)
  const a = document.createElement('div')
  a.className = 'axes'
  for (i = 0; i < gamepad.axes.length; i++) {
    e = document.createElement('meter')
    e.className = 'axis'
    //e.id = "a" + i;
    e.setAttribute('min', '-1')
    e.setAttribute('max', '1')
    e.setAttribute('value', '0')
    e.innerHTML = i.toString()
    a.appendChild(e)
  }
  d.appendChild(a)
  document.getElementById('start').style.display = 'none'
  document.body.appendChild(d)
  rAF(updateStatus)
}

function disconnecthandler(e: GamepadEvent) {
  removegamepad(e.gamepad)
}

function removegamepad(gamepad: Gamepad) {
  const d = document.getElementById('controller' + gamepad.index)
  document.body.removeChild(d)
  delete controllers[gamepad.index]
}

function updateStatus() {
  scangamepads()
  for (const j in controllers) {
    const controller = controllers[j]
    const d = document.getElementById('controller' + j)
    const buttons = d.getElementsByClassName('button')
    for (let i = 0; i < controller.buttons.length; i++) {
      var b = buttons[i]
      let val = controller.buttons[i]
      let pressed = val == 1.0
      let touched = false
      if (typeof val == 'object') {
        pressed = val.pressed
        if ('touched' in val) {
          touched = val.touched
        }
        val = val.value
      }
      const pct = Math.round(val * 100) + '%'
      b.style.backgroundSize = pct + ' ' + pct
      b.className = 'button'
      if (pressed) {
        b.className += ' pressed'
      }
      if (touched) {
        b.className += ' touched'
      }
    }

    const axes = d.getElementsByClassName('axis')
    for (let i = 0; i < controller.axes.length; i++) {
      const a = axes[i]
      a.innerHTML = i + ': ' + controller.axes[i].toFixed(4)
      a.setAttribute('value', controller.axes[i].toString())
    }
  }
  rAF(updateStatus)
}

function scangamepads() {
  const gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
    ? navigator.webkitGetGamepads()
    : []
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && gamepads[i].index in controllers) {
      controllers[gamepads[i].index] = gamepads[i]
    }
  }
}

export default function () {
  if (haveEvents) {
    window.addEventListener('gamepadconnected', connecthandler)
    window.addEventListener('gamepaddisconnected', disconnecthandler)
  } else if (haveWebkitEvents) {
    window.addEventListener('webkitgamepadconnected', connecthandler)
    window.addEventListener('webkitgamepaddisconnected', disconnecthandler)
  } else {
    setInterval(scangamepads, 500)
  }
}