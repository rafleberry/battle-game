import assert from 'assert'
import "colors"
import Character from '../src/character'
import { CriticalStrike, Resilience } from '../src/skill'
import battle from '../src/battle'

function createCharacter() {
  let character
  const props = {}
  const keys = ['health', 'strength', 'defence', 'speed', 'luck']

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const ran1 = Math.floor(Math.random() * 100)
    const ran2 = Math.floor(Math.random() * 100)
    props[key] = {
      min: Math.min(ran1, ran2),
      max: Math.max(ran1, ran2)
    }
  }

  character = new Character({ name: "Mock Character", props: props, attackSkills: [], defenceSkills: [] })

  return { character, props }
}

describe('Test Character', function () {
  let character, props

  before("Initialize Character", function () {
    const { character: _character, props: _props } = createCharacter()
    character = _character
    props = _props
  })

  describe('Check whether character properties fit with the props inserted', function () {
    it("Check Character name", function () {
      assert.equal(character._name, 'Mock Character')
    })

    it("Check Character Health", function () {
      assert.equal(character._properties.health > props.health.min, true)
      assert.equal(character._properties.health < props.health.max, true)
    })

    it("Check Character Strength", function () {
      assert.equal(character._properties.strength > props.strength.min, true)
      assert.equal(character._properties.strength < props.strength.max, true)
    })

    it("Check Character Defence", function () {
      assert.equal(character._properties.defence > props.defence.min, true)
      assert.equal(character._properties.defence < props.defence.max, true)
    })

    it("Check Character Speed", function () {
      assert.equal(character._properties.speed > props.speed.min, true)
      assert.equal(character._properties.speed < props.speed.max, true)
    })

    it("Check Character Luck", function () {
      assert.equal(character._properties.luck > props.luck.min, true)
      assert.equal(character._properties.luck < props.luck.max, true)
    })
  })

  describe('Check character functionality', function () {
    it("Check Character dead status", function () {
      character._properties.health = 0
      assert.equal(character.isDead(), true)
    })
    it("Check Character Luck possibility, pass it if it does not exceed +-5% from character's lucky point", function () {
      let lucky = 0
      const tryCnt = 100000
      for (let i = 0; i < tryCnt; i++) {
        if (character.isLucky()) lucky++
      }
      // Check lucky point should not exceed 5% range
      assert.equal(lucky < tryCnt * (character._properties.luck + 5) / 100, true)
      assert.equal(lucky > tryCnt * (character._properties.luck - 5) / 100, true)
    })
  })
});

describe("Test Critical Strike", function () {
  const criticalStrike = new CriticalStrike("Critical Strike", "attack", 10)

  describe("Test Critical Strike Property", function () {
    it("Check Skill name", function () {
      assert.equal(criticalStrike._name, "Critical Strike")
    })

    it("Check Skill type", function () {
      assert.equal(criticalStrike._type, "attack")
    })

    it("Check Skill Chance", function () {
      assert.equal(criticalStrike._chance, 10)
    })
  })

  describe("Test Critical Strike functionality", function () {
    it("Check Skill happening likelihood, pass it if it does not exceed +-5% from chance point", function () {
      let lucky = 0
      const tryCnt = 100000
      const damage = 100

      for (let i = 0; i < tryCnt; i++) {
        if (criticalStrike.getDamage(null, null, damage, 0) != damage) lucky++
      }
      // Check lucky point should not exceed 5% range
      assert.equal(lucky < tryCnt * (criticalStrike._chance + 5) / 100, true)
      assert.equal(lucky > tryCnt * (criticalStrike._chance - 5) / 100, true)
    })

    it("Check Double Damage", function () {
      criticalStrike._triAttackChance = 0
      criticalStrike._chance = 100

      const damage = 100
      const _damage = criticalStrike.getDamage(null, null, damage, 0)
      if (_damage != damage) {
        assert.equal(damage * 2, _damage)
      }
    })

    it("Check Triple Damage", function () {
      criticalStrike._triAttackChance = 100

      const damage = 100
      const _damage = criticalStrike.getDamage(null, null, damage, 0)
      if (_damage != damage) {
        assert.equal(damage * 3, _damage)
      }
    })

    it("Check Triple damage happening likelihood, pass it if it does not exceed +-1% from chance point", function () {
      criticalStrike._triAttackChance = 1
      let lucky = 0
      const tryCnt = 100000
      const damage = 100

      for (let i = 0; i < tryCnt; i++) {
        if (criticalStrike.getDamage(null, null, damage, 0) === damage * 3) lucky++
      }
      // Check lucky point should not exceed 5% range
      assert.equal(lucky < tryCnt * (criticalStrike._triAttackChance + 1) / 100, true)
      assert.equal(lucky > 0, true)
    })
  })
})

describe("Test Resilience", function () {
  const resilience = new Resilience("Resilience", "defence", 10)

  describe("Test Resilience Property", function () {
    it("Check Skill name", function () {
      assert.equal(resilience._name, "Resilience")
    })

    it("Check Skill type", function () {
      assert.equal(resilience._type, "defence")
    })

    it("Check Skill Chance", function () {
      assert.equal(resilience._chance, 10)
    })
  })

  describe("Test resilience functionality", function () {
    it("Check Skill happening likelihood, pass it if it does not exceed +-5% from chance point", function () {
      let lucky = 0
      const tryCnt = 100000
      const damage = 100

      for (let i = 0; i < tryCnt; i++) {
        if (resilience.getDamage(null, null, damage, i * 4) != damage) lucky++
      }
      // Check lucky point should not exceed 5% range
      assert.equal(lucky < tryCnt * (resilience._chance + 5) / 100, true)
      assert.equal(lucky > tryCnt * (resilience._chance - 5) / 100, true)
    })

    it("Check Half Damage", function () {
      resilience._triAttackChance = 0
      resilience._chance = 100

      const damage = 100
      const _damage = resilience.getDamage(null, null, damage, 0)
      if (_damage != damage) {
        assert.equal(damage / 2, _damage)
      }
    })

    it("Check happen twice in one row", function () {
      const resilience = new Resilience("Resilience", "defence", 100)
      const damage = 100
      const _damage = resilience.getDamage(null, null, damage, 0)
      assert.equal(_damage, damage / 2)
      const __damage = resilience.getDamage(null, null, damage, 2)
      assert.equal(__damage, damage)
    })
  })
})

describe("Battle Test", function () {
  it("Defender health decreased by attacker strength minus defender defence", function () {
    const { character: attacker } = createCharacter()
    const { character: defender } = createCharacter()

    // Preserve defender lucky
    defender._properties.luck = 0
    defender._properties.health = 100
    const prevHealth = defender._properties.health
    const result = battle(attacker, defender, 0, 0)

    const afterHealth = defender._properties.health

    assert.equal(afterHealth, prevHealth - attacker._properties.strength + defender._properties.defence)
  })

  it("If defender health is 0, game over", function () {
    const { character: attacker } = createCharacter()
    const { character: defender } = createCharacter()

    defender._properties.luck = 0
    defender._properties.health = 50
    defender._properties.defence = 10
    attacker._properties.strength = 100

    const result = battle(attacker, defender, 0, 0)

    assert.equal(result, true)
  })

  it("If defender is lucky, his health should be reserved", function () {
    const { character: attacker } = createCharacter()
    const { character: defender } = createCharacter()

    defender._properties.luck = 100
    const prevHealth = defender._properties.health
    const result = battle(attacker, defender, 0, 0)
    const afterHealth = defender._properties.health

    assert.equal(result, false)
    assert.equal(afterHealth, prevHealth)
  })

  it("If attacker use critical strike", function () {
    const { character: attacker } = createCharacter()
    const { character: defender } = createCharacter()
    const criticalStrike = new CriticalStrike("Critical Strike", "attack", 100)

    defender._properties.luck = 0
    defender._properties.defence = 30
    defender._properties.health = 100

    attacker._properties.strength = 80
    attacker._attackSkills = [criticalStrike]

    const result = battle(attacker, defender, 0, 0)

    assert.equal(result, true)
  })

  it("If defender use resilience", function () {
    const { character: attacker } = createCharacter()
    const { character: defender } = createCharacter()
    const resilience = new Resilience("Resilience", "defence", 100)

    defender._properties.luck = 0
    defender._properties.defence = 30
    defender._properties.health = 30

    attacker._properties.strength = 80
    defender._defenceSkills = [resilience]

    const prevHealth = defender._properties.health
    const result = battle(attacker, defender, 0, 0)
    const afterHealth = defender._properties.health

    assert.equal(result, false)
    assert.equal(afterHealth, prevHealth - (attacker._properties.strength - defender._properties.defence) / 2)
  })
})