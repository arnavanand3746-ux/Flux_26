"use client"
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function CanvasWave() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    // Scene Setup
    const scene = new THREE.Scene()
    // Soft transparent background to let CSS handle it
    
    // Camera Setup - Moved slightly closer for more prominence
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 30, 80)
    camera.lookAt(0, -10, 0)

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // Transparent
    currentMount.appendChild(renderer.domElement)

    // Create the 3D Wave Grid (PlaneGeometry)
    const geometry = new THREE.PlaneGeometry(300, 150, 120, 60)
    
    // Rotate so it lays flat on the ground
    geometry.rotateX(-Math.PI / 2)

    // Store original positions for the wave animation
    const pos = geometry.attributes.position
    const originalPositions = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) {
      originalPositions[i * 3] = pos.getX(i)
      originalPositions[i * 3 + 1] = pos.getY(i)
      originalPositions[i * 3 + 2] = pos.getZ(i)
    }

    // Material - Premium Particle Grid Look
    const material = new THREE.PointsMaterial({ 
      color: 0x39a9db, // mlh-light-blue
      size: 0.5, // Perfect medium size
      transparent: true,
      opacity: 0.85, // Balanced opacity
      sizeAttenuation: true
    })

    const particles = new THREE.Points(geometry, material)
    
    // Shift slightly down so it sits under the main text but fills more space
    particles.position.y = -5 // Lifted up closer to the text
    scene.add(particles)

    // Resize Handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onWindowResize)

    // Animation Loop
    const clock = new THREE.Clock()
    let animationId: number

    const animate = () => {
      const time = clock.getElapsedTime() * 0.5 // Slowed down for elegance

      // Static smooth camera
      camera.lookAt(0, -10, 0)

      // Animate the wave vertices
      const positions = geometry.attributes.position
      
      for (let i = 0; i < positions.count; i++) {
        const x = originalPositions[i * 3]
        const z = originalPositions[i * 3 + 2]
        
        // Gentle but more pronounced sweeping wave motion
        const y = Math.sin(x * 0.03 + time) * 6 // Increased from 4
                + Math.sin(z * 0.02 + time * 0.8) * 6 // Increased from 4

        positions.setY(i, y)
      }
      
      positions.needsUpdate = true

      renderer.render(scene, camera)
      
      // Schedule next frame at the end
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize)
      cancelAnimationFrame(animationId)
      
      // Properly dispose of Three.js objects to free up WebGL contexts
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss() // Force context loss to prevent hitting WebGL context limits on route changes
      
      if (currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
      {/* Container for Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      {/* Heavy gradient overlay so the grid seamlessly fades into the white background at the edges and top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_10%,_#f8fafc_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50 z-10 pointer-events-none opacity-80" />
    </div>
  )
}
