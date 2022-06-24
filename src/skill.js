class Skill {
  /**
   * 
   * @param {Chance to initialize the possibilty for this skill to be happened} chance 
   * @param {Type of Skill - Attack or Defend} type 
   */
  constructor(name, type, chance) {
    this._name = name
    this._type = type
    this._chance = chance
  }
  /**
   * 
   * @param {Attacker Object} attacker 
   * @param {Defender Object} defender 
   * @param {Currently calculated damage} damage 
   * @param {total match number} total 
   * @returns newly Calculated damage
   */
  getDamage(attacker, defender, damage, total) { } // function to return damage according to its params
}

export class CriticalStrike extends Skill {
  _triAttackChance = 1

  getDamage(attacker, defender, damage, total) {
    // Calculate its happening likelyhood
    const _possibility = Math.ceil(Math.random() * 100)

    if (_possibility <= this._triAttackChance) {
      return damage * 3
    }
    else if (_possibility <= this._chance) {
      return damage * 2
    }
    else return damage
  }
}

export class Resilience extends Skill {
  getDamage(attacker, defender, damage, total) {
    // If this skill was happened just before, return
    if (total - this._happenedAt < 4) return damage

    // Calculate its happening likelyhood
    const _possibility = Math.ceil(Math.random() * 100)
    if (_possibility <= this._chance) {
      // Update Happened
      this._happenedAt = total;
      return damage / 2
    } else return damage
  }
}