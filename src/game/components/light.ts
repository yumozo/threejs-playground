import { DirectionalLight } from "three";

/**
 * Don't forget to add light's target to your scene!
 * @returns Directional light object
 */
export function createLight(): DirectionalLight {
  // Create a directional light
  const light = new DirectionalLight('white', 1)

  // Move this light up and towards us
  light.position.set(0, 4, 4)
  // Move its direction a little
  light.target.position.set(0, -2, 0)
  // Enable shadow cast
  light.castShadow = true

  return light
}