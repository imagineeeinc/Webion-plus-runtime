import './styles.js'
import m from 'mithril'

import app from './app'

import Model from './model'
import { defaults } from './state'
import Actions from './actions'
import message from './message'
import hotkeys from './hotkeys'
import { createFlemsIoLink } from './state'

let resizeRegistrered = false
window.m = m // wright hmr
function Flems(dom, state = {}, runtimeUrl) {
  const model = Model(dom, state, runtimeUrl)
      , actions = Actions(model)

  window.addEventListener('keydown', e => model.metaDown = (e.key === 'Meta' || e.key === 'Control'), true)
  window.addEventListener('keyup', e => {
    model.metaDown = !(e.key === 'Meta' || e.key === 'Control')
    actions.hideRect()
  }, true)

  if (!resizeRegistrered) {
    window.addEventListener('resize', () => m.redraw())
    resizeRegistrered = true
  }

  message.listen(model, actions)

  // Disable hotkeys until proper combos can be decided upon
  // hotkeys(model, actions)

  m.mount(dom, {
    view: () => app(model, actions)
  })

  return {
    focus: model.focus,
    reload: () => actions.refresh({ force: true }),
    onchange: fn => actions.onchange = fn,
    onload: fn => actions.onload = fn,
    onloaded: fn => actions.onloaded = fn,
    getLink: actions.getLink,
    set: actions.setState,
    redraw: m.redraw
  }
}

Flems.defaults = defaults
Flems.createFlemsIoLink = createFlemsIoLink
Flems.version = process.env.FLEMS_VERSION // eslint-disable-line

export default Flems

