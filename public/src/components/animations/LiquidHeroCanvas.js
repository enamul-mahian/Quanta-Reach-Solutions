import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isReducedMotion, lerp } from '/src/lib/motion.js';
/**
 * QUANTA REACH SOLUTIONS - RESPONSIVE LIQUID WEBGL ENGINE
 * Detail levels are intentionally capped so the hero remains smooth on normal
 * laptops and phones. The original values (20/32) could allocate an enormous
 * number of triangles and freeze the browser before the first frame rendered.
 */
export const LiquidHeroCanvas = () => {
    const containerRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const targetMouse = useRef({ x: 0, y: 0 });
    const velocity = useRef(0);
    const lastMousePos = useRef({ x: 0, y: 0 });
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return undefined;
        let renderer = null;
        let frameId = 0;
        let isDisposed = false;
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.z = 5;
            renderer = new THREE.WebGLRenderer({
                antialias: window.devicePixelRatio <= 1.5,
                alpha: true,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            container.appendChild(renderer.domElement);
            const liquidMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x168bff,
                metalness: 0.1,
                roughness: 0.08,
                transmission: 0.55,
                thickness: 1.6,
                ior: 1.45,
                clearcoat: 1,
                clearcoatRoughness: 0.12,
                transparent: true,
                opacity: 0.82,
            });
            const purpleMaterial = liquidMaterial.clone();
            purpleMaterial.color.setHex(0x7457ff);
            const ribbonMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 1,
                roughness: 0.05,
            });
            // A detail value of 4 is already visually smooth and remains practical.
            const mainGeometry = new THREE.IcosahedronGeometry(2, 4);
            const sideGeometry = new THREE.IcosahedronGeometry(1.2, 3);
            const ribbonGeometry = new THREE.TorusKnotGeometry(2.5, 0.03, 120, 12);
            const mainBasePositions = mainGeometry.attributes.position.array.slice();
            const sideBasePositions = sideGeometry.attributes.position.array.slice();
            const mainBlob = new THREE.Mesh(mainGeometry, liquidMaterial);
            const sideBlob = new THREE.Mesh(sideGeometry, purpleMaterial);
            sideBlob.position.set(2.5, -1, -1);
            const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
            const objects = new THREE.Group();
            objects.add(mainBlob, sideBlob, ribbon);
            scene.add(objects);
            scene.add(new THREE.AmbientLight(0xffffff, 0.55));
            const blueLight = new THREE.PointLight(0x168bff, 15);
            blueLight.position.set(-5, 5, 5);
            scene.add(blueLight);
            const purpleLight = new THREE.PointLight(0x7457ff, 12);
            purpleLight.position.set(5, -5, 2);
            scene.add(purpleLight);
            const resize = () => {
                if (!renderer || isDisposed)
                    return;
                const width = Math.max(1, container.clientWidth || window.innerWidth);
                const height = Math.max(1, container.clientHeight || window.innerHeight);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            };
            const deform = (geometry, basePositions, time, radius, intensity) => {
                const position = geometry.attributes.position;
                const vertex = new THREE.Vector3();
                for (let index = 0; index < position.count; index += 1) {
                    const offset = index * 3;
                    vertex.set(basePositions[offset], basePositions[offset + 1], basePositions[offset + 2]);
                    const noise = Math.sin(vertex.x * 1.2 + time)
                        * Math.cos(vertex.y * 1.2 + time * 0.9)
                        * Math.sin(vertex.z * 1.2 + time * 1.1)
                        * (0.12 + velocity.current * 0.22)
                        * intensity;
                    vertex.normalize().multiplyScalar(radius * (1 + noise));
                    position.setXYZ(index, vertex.x, vertex.y, vertex.z);
                }
                position.needsUpdate = true;
                geometry.computeVertexNormals();
            };
            const onMouseMove = (event) => {
                const width = Math.max(1, window.innerWidth);
                const height = Math.max(1, window.innerHeight);
                targetMouse.current.x = (event.clientX / width) * 2 - 1;
                targetMouse.current.y = -(event.clientY / height) * 2 + 1;
                const dx = event.clientX - lastMousePos.current.x;
                const dy = event.clientY - lastMousePos.current.y;
                velocity.current = Math.min(Math.hypot(dx, dy) * 0.006, 1.2);
                lastMousePos.current = { x: event.clientX, y: event.clientY };
            };
            const reducedMotion = isReducedMotion();
            const clock = new THREE.Clock();
            const renderFrame = () => {
                if (!renderer || isDisposed)
                    return;
                const time = clock.getElapsedTime();
                mouse.current.x = lerp(mouse.current.x, targetMouse.current.x, 0.05);
                mouse.current.y = lerp(mouse.current.y, targetMouse.current.y, 0.05);
                velocity.current = lerp(velocity.current, 0, 0.035);
                if (!reducedMotion) {
                    deform(mainGeometry, mainBasePositions, time, 2, 1);
                    deform(sideGeometry, sideBasePositions, time * 1.4, 1.2, 0.9);
                    objects.rotation.x = mouse.current.y * 0.35;
                    objects.rotation.y = mouse.current.x * 0.35;
                    ribbon.rotation.z += 0.004 + velocity.current * 0.025;
                    mainBlob.position.y = Math.sin(time * 0.5) * 0.18;
                    sideBlob.position.x = 2.5 + Math.cos(time * 0.8) * 0.45;
                }
                renderer.render(scene, camera);
                if (!reducedMotion)
                    frameId = window.requestAnimationFrame(renderFrame);
            };
            resize();
            window.addEventListener('resize', resize, { passive: true });
            if (!reducedMotion)
                window.addEventListener('mousemove', onMouseMove, { passive: true });
            renderFrame();
            return () => {
                isDisposed = true;
                window.removeEventListener('resize', resize);
                window.removeEventListener('mousemove', onMouseMove);
                if (frameId)
                    window.cancelAnimationFrame(frameId);
                mainGeometry.dispose();
                sideGeometry.dispose();
                ribbonGeometry.dispose();
                liquidMaterial.dispose();
                purpleMaterial.dispose();
                ribbonMaterial.dispose();
                renderer?.dispose();
                renderer?.forceContextLoss();
                if (renderer?.domElement.parentNode === container) {
                    container.removeChild(renderer.domElement);
                }
            };
        }
        catch (error) {
            console.warn('[Quanta Reach] WebGL hero was disabled on this device.', error);
            renderer?.dispose();
            return undefined;
        }
    }, []);
    return (_jsx("div", { ref: containerRef, className: "absolute inset-0 h-full w-full pointer-events-none", "aria-hidden": "true" }));
};
