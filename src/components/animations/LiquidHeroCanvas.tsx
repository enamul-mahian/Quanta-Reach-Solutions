import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { lerp } from '../../lib/motion';

/**
 * METAFORE TECHNOLOGIES - ADVANCED LIQUID METABALL ENGINE
 * এই কম্পোনেন্টটি কাস্টম শেডার এবং নয়েজ ফাংশন ব্যবহার করে 
 * মাউস-রিঅ্যাক্টিভ লিকুইড ব্লোব এবং ৩ডি গ্লসি অবজেক্ট তৈরি করে।
 */

export const LiquidHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // মাউস এবং ইন্টারঅ্যাকশন স্টেট
  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // ১. সিন এবং রেন্ডারার কনফিগারেশন
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // টেক্সট ব্লেন্ডিংয়ের জন্য ট্রান্সপারেন্ট ব্যাকগ্রাউন্ড
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    // ২. কাস্টম শেডার মেটেরিয়াল (Liquid & Glossy Fresnel Effect)
    // এটি অবজেক্টের কিনারে গ্লো এবং মাঝখানে লিকুইড ট্রান্সপারেন্সি তৈরি করে
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x168BFF,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.7, // লিকুইড লুকের জন্য
      thickness: 2,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const purpleMaterial = liquidMaterial.clone();
    purpleMaterial.color.setHex(0x7457FF);

    // ৩. ৩ডি জিওমেট্রি জেনারেশন (Metaballs & Ribbons)
    const objects = new THREE.Group();
    const geometryItems: THREE.BufferGeometry[] = [];
    const materialItems: THREE.Material[] = [liquidMaterial, purpleMaterial];

    // মেইন লিকুইড ব্লোব (হাই-সাবডিভিশন স্ফিয়ার)
    const mainBlobGeom = new THREE.IcosahedronGeometry(2, 32); 
    geometryItems.push(mainBlobGeom);
    const mainBlob = new THREE.Mesh(mainBlobGeom, liquidMaterial);
    
    // সেকেন্ডারি অর্গানিক ব্লোব
    const sideBlobGeom = new THREE.IcosahedronGeometry(1.2, 20);
    geometryItems.push(sideBlobGeom);
    const sideBlob = new THREE.Mesh(sideBlobGeom, purpleMaterial);
    sideBlob.position.set(2.5, -1, -1);

    // গ্লসি রিভন/টিউব (Torus Knot)
    const ribbonGeom = new THREE.TorusKnotGeometry(2.5, 0.03, 150, 20);
    geometryItems.push(ribbonGeom);
    const ribbonMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      metalness: 1, 
      roughness: 0.02 
    });
    materialItems.push(ribbonMat);
    const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);
    
    objects.add(mainBlob, sideBlob, ribbon);
    scene.add(objects);

    // ৪. সিনেমাটিক লাইটিং (Electric Blue & Purple highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x168BFF, 15);
    blueLight.position.set(-5, 5, 5);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x7457FF, 12);
    purpleLight.position.set(5, -5, 2);
    scene.add(purpleLight);

    // ۵. লিকুইড ডিফরমেশন লজিক (Custom Displacement)
    const updateLiquidMotion = (mesh: THREE.Mesh, time: number, intensity: number) => {
      const pos = mesh.geometry.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        
        // গাণিতিক নয়েজ সিমুলেশন (লিকুইড মরফিং)
        const noise = Math.sin(v.x * 1.2 + time) * 
                      Math.cos(v.y * 1.2 + time) * 
                      Math.sin(v.z * 1.2 + time) * 
                      (0.15 + velocity.current * 0.4);

        const targetDist = 1.0 + noise * intensity;
        v.normalize().multiplyScalar(mesh.geometry.type === 'IcosahedronGeometry' ? 1.8 * targetDist : 1);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
    };

    // ৬. ইভেন্ট হ্যান্ডলারস
    const onMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // গতি (Velocity) গণনা
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      velocity.current = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.008, 1.5);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    // ৭. অ্যানিমেশন লুপ (নিরাপদ THREE.Clock মেথডে ফিরিয়ে আনা হয়েছে)
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      const time = clock.getElapsedTime();

      // মাউস ইন্টারপোলেশন (মসৃণতা)
      mouse.current.x = lerp(mouse.current.x, targetMouse.current.x, 0.05);
      mouse.current.y = lerp(mouse.current.y, targetMouse.current.y, 0.05);
      
      // ভেলোসিটি ধীরে ধীরে কমানো (Inertia)
      velocity.current = lerp(velocity.current, 0, 0.03);

      // লিকুইড ব্লোব আপডেট
      updateLiquidMotion(mainBlob, time, 1.0);
      updateLiquidMotion(sideBlob, time * 1.5, 0.8);

      // গ্রুপ রোটেশন এবং টিল্ট (মাউস রেসপনসিভ)
      objects.rotation.x = mouse.current.y * 0.4;
      objects.rotation.y = mouse.current.x * 0.4;
      
      // ৩ডি অবজেক্টের স্বাধীন নড়াচড়া
      ribbon.rotation.z += 0.005 + velocity.current * 0.05;
      mainBlob.position.y = Math.sin(time * 0.5) * 0.2;
      sideBlob.position.x = 2.5 + Math.cos(time * 0.8) * 0.5;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // ৮. রিসোর্স ডিসপোজাল (Memory Management)
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      
      geometryItems.forEach(g => g.dispose());
      materialItems.forEach(m => m.dispose());
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ touchAction: 'none' }}
    />
  );
};