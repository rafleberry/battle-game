import battle from "./src/battle";
import Character from "./src/character";
import { heroProps, villainProps } from "./src/config";
import { logProperties } from "./src/util";
import { CriticalStrike, Resilience } from "./src/skill";

const main = () => {
  /**
   * Create Skill objects
   */
  const criticalStrike = new CriticalStrike("Critical Strike", "attack", 10)
  const resilience = new Resilience("Resilience", "defence", 20)

  /**
   * Create Hero and Villian Character and initilize them
   */
  const hero = new Character({ name: "Hero", props: heroProps, attackSkills: [criticalStrike], defenceSkills: [resilience] })
  const villian = new Character({ name: "Villian", props: villainProps, attackSkills: [], defenceSkills: [] })

  /**
   * Environment Variables
   */
  let turn = true // Turn variable: true means hero's turn, false means villian's turn
  let total = 0 // Total attack, when reaches 20, it stops
  let status = '' // String to be logged at the end: shows who win or zero-sum
  /**
   * Log out Current Hero and Villian Properties
   */
  console.log("======= Characters Entered =======")
  logProperties(hero)
  logProperties(villian)

  /**
   * Toss up who will take the first turn: whose speed is fast and more lucky will take the first turn
   */
  turn = hero._properties.speed > villian._properties.speed || hero._properties.luck >= villian._properties.luck

  /**
   * Run Battle until one of them is dead or total reaches 20
   */
  while (true) {
    // Decide attacker and defender according to whose turn
    const attacker = turn ? hero : villian
    const defender = turn ? villian : hero

    // Run battle
    const isEnded = battle(attacker, defender, turn, total)

    // Increase total number
    total++

    if (isEnded) {
      if (turn) status = "Hero Win"
      else status = "Vilian Win"
      break
    }

    if (total >= 20) {
      status = "Zero Sum"
      break
    }

    // Swap turn
    turn = !turn
  }

  /**
   * Log out Game status
   */
  console.log("\n======= Game Over =======\n")

  console.log(status.yellow)

  logProperties(hero)
  logProperties(villian)

}

main()