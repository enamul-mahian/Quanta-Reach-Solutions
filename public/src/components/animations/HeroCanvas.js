import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isReducedMotion, lerp } from '/src/lib/motion.js';
/**
 * Legacy hero canvas kept for reusable page artwork. Geometry detail is capped
 * and every animation/resource is cleaned up when the component unmounts.
 */
export const HeroCanvas = () => {
    const containerRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const targetMouse = useRef({ x: 0, y: 0 });
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return undefined;
        let renderer = null;
        let frameId = 0;
        let disposed = false;
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
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;
            container.appendChild(renderer.domElement);
            const blueMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x168bff,
                metalness: 0.1,
                roughness: 0.08,
                transmission: 0.5,
                thickness: 1.4,
                clearcoat: 1,
                transparent: true,
                opacity: 0.88,
            });
            const purpleMaterial = blueMaterial.clone();
            purpleMaterial.color.setHex(0x7457ff);
            const ribbonMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.06 });
            const blobGeometry = new THREE.IcosahedronGeometry(1.8, 4);
            const ribbonGeometry = new THREE.TorusKnotGeometry(2, 0.05, 100, 12);
            const mainBlob = new THREE.Mesh(blobGeometry, blueMaterial);
            const purpleBlob = new THREE.Mesh(blobGeometry.clone(), purpleMaterial);
            purpleBlob.position.set(2, 1, -2);
            purpleBlob.scale.setScalar(0.6);
            const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
            ribbon.position.set(-1, -1, 1);
            const group = new THREE.Group();
            group.add(mainBlob, purpleBlob, ribbon);
            scene.add(group);
            scene.add(new THREE.AmbientLight(0xffffff, 0.6));
            const topLight = new THREE.PointLight(0xffffff, 15);
            topLight.position.set(5, 5, 5);
            scene.add(topLight);
            const blueLight = new THREE.PointLight(0x168bff, 10);
            blueLight.position.set(-5, 5, 2);
            scene.add(blueLight);
            const resize = () => {
                if (!renderer || disposed)
                    return;
                const width = Math.max(1, container.clientWidth || window.innerWidth);
                const height = Math.max(1, container.clientHeight || window.innerHeight);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            };
            const onMouseMove = (event) => {
                targetMouse.current.x = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
                targetMouse.current.y = -(event.clientY / Math.max(1, window.innerHeight)) * 2 + 1;
            };
            const reducedMotion = isReducedMotion();
            const clock = new THREE.Clock();
            const animate = () => {
                if (!renderer || disposed)
                    return;
                const time = clock.getElapsedTime();
                mouse.current.x = lerp(mouse.current.x, targetMouse.current.x, 0.05);
                mouse.current.y = lerp(mouse.current.y, targetMouse.current.y, 0.05);
                if (!reducedMotion) {
                    group.rotation.x = mouse.current.y * 0.3;
                    group.rotation.y = mouse.current.x * 0.3;
                    group.position.y = Math.sin(time * 0.5) * 0.2;
                    ribbon.rotation.z += 0.005;
                }
                renderer.render(scene, camera);
                if (!reducedMotion)
                    frameId = window.requestAnimationFrame(animate);
            };
            resize();
            window.addEventListener('resize', resize, { passive: true });
            if (!reducedMotion)
                window.addEventListener('mousemove', onMouseMove, { passive: true });
            animate();
            return () => {
                disposed = true;
                window.removeEventListener('resize', resize);
                window.removeEventListener('mousemove', onMouseMove);
                if (frameId)
                    window.cancelAnimationFrame(frameId);
                blobGeometry.dispose();
                purpleBlob.geometry.dispose();
                ribbonGeometry.dispose();
                blueMaterial.dispose();
                purpleMaterial.dispose();
                ribbonMaterial.dispose();
                renderer?.dispose();
                renderer?.forceContextLoss();
                if (renderer?.domElement.parentNode === container)
                    container.removeChild(renderer.domElement);
            };
        }
        catch (error) {
            console.warn('[Quanta Reach] WebGL artwork was disabled on this device.', error);
            renderer?.dispose();
            return undefined;
        }
    }, []);
    return _jsx("div", { ref: containerRef, className: "h-full w-full", "aria-hidden": "true" });
};
