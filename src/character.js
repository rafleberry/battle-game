//////////////////////////
//     Hero object      //
//////////////////////////

// Property
/**
 * Health: 70 - 100
 * Strength: 70 - 80
 * Defence: 45 - 55
 * Speed 40 - 50
 * Luck: 10 - 30
 */

// Skills
/**
 * Name: Critical Strike
 * Type: Attack
 * Callback: skill functionality
 */

function setProperty(props) {
  /**
   * Set Character property
   */
  const _properties = {}
  const _keys = Object.keys(props)
  for (let i = 0; i < _keys.length; i++) {
    // Get property range from input
    const _key = _keys[i]
    const _min = props[_key].min
    const _max = props[_key].max

    // Calculate property value in that range
    const _bal = Math.random() * (_max - _min) + _min
    _properties[_key] = _bal
  }

  return _properties
}

export default class Character {
  constructor({ name, props, attackSkills, defenceSkills }) {
    this._name = name
    this._properties = setProperty(props)

    /**
     * Set Character skills
     */
    this._attackSkills = attackSkills
    this._defenceSkills = defenceSkills
  }

  isDead() {
    if (this._properties.health <= 0) {
      this._properties.health = 0
      return true
    } else {
      return false
    }
  }

  isLucky() {
    const _luck = Math.ceil(Math.random() * 100)
    return _luck <= this._properties.luck
  }
}