export default function battle(attacker, defender, turn, total) {
	const atProps = attacker._properties
	const dfProps = defender._properties

	console.log(`\nTurn ${total + 1}`.green, `Attacker: ${attacker._name}, Defender: ${defender._name}, Health: ${dfProps.health}`)

	/**
	 * Calculate Damage
	 */
	let damage = atProps.strength - dfProps.defence

	/**
	 * If defender is lucky no strike to him
	 */
	if (defender.isLucky()) {
		console.log(`${defender._name} Lucky, Missed Attack (^_^)`.yellow)
		return false
	}

	/**
	 * Let players use their skills - Attacker first and defender later (Just assumed, it can be updated into using speed for deciding whose will go first)
	 */
	const atSkills = attacker._attackSkills
	for (let i = 0; i < atSkills.length; i++) {
		const _damage = atSkills[i].getDamage(attacker, defender, damage, total)
		// If _damage is updated from damage, means that skill was happened
		if (_damage != damage) {
			console.log(`${attacker._name} use ${atSkills[i]._name}, Damage Increased from ${damage} to ${_damage} (>_<)`.blue)
			damage = _damage
		}
	}

	const dfSkills = defender._defenceSkills
	for (let i = 0; i < dfSkills.length; i++) {
		const _damage = dfSkills[i].getDamage(attacker, defender, damage, total)
		// If _damage is updated from damage, means that skill was happened
		if (_damage != damage) {
			console.log(`${defender._name} use ${dfSkills[i]._name}, Damage decreased from ${damage} to ${_damage} (^_^)`.yellow)
			damage = _damage
		}
	}

	dfProps.health -= damage

	/**
	 * Log damage and status change
	 */
	console.log(`Damage: ${damage}, Defender Health: ${dfProps.health > 0 ? dfProps.health : 0}`)

	if (defender.isDead()) return true
	else return false
}   