import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const fog = new THREE.Fog(0x262837, 1, 8)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorTextures = {
    color: textureLoader.load('/textures/door/color.jpg'),
    occlusion: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
    roughness: textureLoader.load('/textures/door/roughness.jpg'),
    metalness: textureLoader.load('/textures/door/metalness.jpg'),
    displacement: textureLoader.load('/textures/door/height.jpg'),
    alpha: textureLoader.load('/textures/door/alpha.jpg'),
    normal: textureLoader.load('/textures/door/normal.jpg'),
}

const wallTextures = {
    occlusion: textureLoader.load('/textures/bricks/ambientOcclusion.jpg'),
    color: textureLoader.load('/textures/bricks/color.jpg'),
    normal: textureLoader.load('/textures/bricks/normal.jpg'),
    roughness: textureLoader.load('/textures/bricks/roughness.jpg'),
}

const grassTextures = {
    color: textureLoader.load('/textures/grass/color.jpg'),
    occlusion: textureLoader.load('/textures/grass/ambientOcclusion.jpg'),
    normal: textureLoader.load('textures/grass/normal.jpg'),
    roughness: textureLoader.load('/textures/grass/roughness.jpg'),
}

const floorTextures = {
    color: textureLoader.load('/textures/grass/color.jpg'),
    occlusion: textureLoader.load('/textures/grass/ambientOcclusion.jpg'),
    normal: textureLoader.load('textures/grass/normal.jpg'),
    roughness: textureLoader.load('/textures/grass/roughness.jpg'),
}

floorTextures.color.repeat.set(8, 8)
floorTextures.occlusion.repeat.set(8, 8)
floorTextures.normal.repeat.set(8, 8)
floorTextures.roughness.repeat.set(8, 8)

floorTextures.color.wrapS = THREE.RepeatWrapping
floorTextures.occlusion.wrapS = THREE.RepeatWrapping
floorTextures.normal.wrapS = THREE.RepeatWrapping
floorTextures.roughness.wrapS = THREE.RepeatWrapping

floorTextures.color.wrapT = THREE.RepeatWrapping
floorTextures.occlusion.wrapT = THREE.RepeatWrapping
floorTextures.normal.wrapT = THREE.RepeatWrapping
floorTextures.roughness.wrapT = THREE.RepeatWrapping

/**
 * House
 */
//group
const house = new THREE.Group()
scene.add(house)

//Walls

const wallsSizes = {
    width: 3.5,
    height: 2.5,
    depth: 3.5,
}

const wallsMaterial = new THREE.MeshStandardMaterial({color: 0x5C4033})
wallsMaterial.map = wallTextures.color
wallsMaterial.aoMap = wallTextures.occlusion
wallsMaterial.aoMapIntensity = 1
wallsMaterial.normalMap = wallTextures.normal
wallsMaterial.roughnessMap = wallTextures.roughness

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(wallsSizes.width, wallsSizes.height, wallsSizes.depth, 4, 4, 4 ),
    wallsMaterial
)
walls.geometry.setAttribute('uv2', new THREE.BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = wallsSizes.height * .5
house.add(walls)

//Roof

const roofSizes = {
    radius: 3,
    height: 1,
    segments: 4,
}

const roofMaterial = new THREE.MeshStandardMaterial()
roofMaterial.map = wallTextures.color

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(roofSizes.radius, roofSizes.height, roofSizes.segments),
    roofMaterial
)
roof.position.y = roofSizes.height * .5 + wallsSizes.height
roof.rotation.y = Math.PI * .25
house.add(roof)

// Floor


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial( {
        map: floorTextures.color,
        aoMap: floorTextures.occlusion,
        aoMapIntensity: 1,
        normalMap: floorTextures.normal,
        roughnessMap: floorTextures.roughness
    } )
)

floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

//Door
const doorMaterial = new THREE.MeshStandardMaterial()
const doorSizes = {
    width: 1.5,
    height: 1.5,
    segments: 32,
}

doorMaterial.aoMap = doorTextures.occlusion
doorMaterial.map = doorTextures.color
doorMaterial.alphaMap = doorTextures.alpha
doorMaterial.normalMap = doorTextures.normal
doorMaterial.aoMapIntensity = .5
doorMaterial.roughnessMap = doorTextures.roughness
doorMaterial.metalnessMap = doorTextures.metalness
doorMaterial.displacementMap = doorTextures.displacement
doorMaterial.displacementScale = .06
doorMaterial.transparent = true

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(doorSizes.width, doorSizes.height, doorSizes.segments, doorSizes.segments),
    doorMaterial
)

door.geometry.setAttribute('uv2', new THREE.BufferAttribute(door.geometry.attributes.uv.array, 2))

door.position.set(walls.position.x,doorSizes.height * .5 - .02,walls.position.z + wallsSizes.width * .5 - .01)
house.add(door)

//bushes

const bushGeometry = new THREE.SphereGeometry(1, 16,16)

const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })
grassMaterial.map = grassTextures.color
grassMaterial.aoMap = grassTextures.occlusion
grassMaterial.aoMapIntensity = 1
grassMaterial.normalMap = grassTextures.normal
grassMaterial.roughnessMap = grassTextures.roughness

const bush1 = new THREE.Mesh(bushGeometry, grassMaterial)
bush1.position.set(.7,.25,walls.position.z + wallsSizes.width * .5 + .3)
bush1.scale.set(.4,.4,.4)

const bush2 = new THREE.Mesh(bushGeometry, grassMaterial)
bush2.position.set(1.1,.1,walls.position.z + wallsSizes.width * .5 + .2)
bush2.scale.set(.2,.2,.2)

const bush3 = new THREE.Mesh(bushGeometry, grassMaterial)
bush3.position.set(-.6,.2,walls.position.z + wallsSizes.width * .5 + .2)
bush3.scale.set(.3,.3,.3)

const bush4 = new THREE.Mesh(bushGeometry, grassMaterial)
bush4.position.set(-.8,.05,walls.position.z + wallsSizes.width * .5 + .4)
bush4.scale.set(.1,.1,.1)

house.add(bush1, bush2, bush3, bush4)

//graves

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(.6,.8,.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const multiplier1 = Math.random() * 6 + 3
    const multiplier2 = Math.random() * 6 + 3
    const rotationAngle = Math.random() * Math.PI * .25 - .5
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(Math.sin(angle) * multiplier1, .35, Math.cos(angle) * multiplier2)
    grave.rotation.y = (Math.random() - .5) * Math.PI * .15
    grave.rotation.z = (Math.random() - .5) * Math.PI * .15
    graves.add(grave)
}


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//DoorLight

const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, 2, wallsSizes.depth / 2 + .1)
house.add(doorLight)

const doorLightHelper = new THREE.PointLightHelper(doorLight, .1)
house.add(doorLightHelper)

//Ghosts

const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
const ghost2 = new THREE.PointLight(0xffff00, 2, 3)
const ghost3 = new THREE.PointLight(0x00ffff, 2, 3)

scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0x262837)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Ghost Animation

    const ghost1Angle = elapsedTime * .5
    ghost1.position.x = Math.cos(ghost1Angle) * 4 + 5
    ghost1.position.z = Math.sin(ghost1Angle) * 4 + 5
    ghost1.position.y = Math.sin(ghost1Angle * 3)

    const ghost2Angle = - elapsedTime * .32
    ghost2.position.x = Math.cos(ghost2Angle) * 4 + 3
    ghost2.position.z = Math.sin(ghost2Angle) * 4 + 3
    ghost2.position.y = Math.sin(ghost2Angle * 3)

    const ghost3Angle = - elapsedTime * .18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime  * .32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime  * .5))
    ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(ghost3Angle * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()