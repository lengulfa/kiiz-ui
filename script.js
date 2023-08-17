import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


const doorSimpleTexture = textureLoader.load('/textures/door/door.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const roofScrave = textureLoader.load('/textures/roof/roof.png')
const sunBatteryTexture = textureLoader.load('/textures/sunBattery/sunBatteryTexture.jpg')
const tabaldyryqTexture = textureLoader.load('/textures/tabaldyryq/grayTexture.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
// Group
const yurt = new THREE.Group()
scene.add(yurt)

//Walls

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(4, 16, 12),
    new THREE.MeshStandardMaterial({
        map: bricksRoughnessTexture,
        aoMap: bricksRoughnessTexture,
        normalMap: bricksRoughnessTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
sphere.position.y = 1
yurt.add(sphere)

//Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 2),
    new THREE.MeshStandardMaterial({
        map: doorSimpleTexture
        
    })
)
door.position.y = 1.5
door.position.z = 4
yurt.add(door)

//Roof
const roof = new THREE.Mesh(
    new THREE.CylinderGeometry( 1, 1, 2, 32 ),
    new THREE.MeshStandardMaterial({map: roofScrave})
    )
roof.position.y = 4
yurt.add(roof)

//Tabaldyryq
const tabaldyryq = new THREE.Mesh(
    new THREE.CylinderGeometry( 6, 1, 2, 32 ),
    new THREE.MeshStandardMaterial({map: tabaldyryqTexture})
    )

tabaldyryq.position.y = -0.9
yurt.add(tabaldyryq)


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)




/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.7)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.5)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

doorLight.position.set(0, 2.2, 2.7)
yurt.add(doorLight)



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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()