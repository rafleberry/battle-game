import "colors"

export function logProperties(character) {
  const name = character._name
  const props = character._properties

  console.log(`\n${name}`.green)

  const keys = Object.keys(props)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    console.log(`\t${key}: ${props[key]}${key === 'luck' ? "%" : ""}`)
  }
}