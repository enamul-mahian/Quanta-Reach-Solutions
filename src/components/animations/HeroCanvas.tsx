import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { lerp } from '../../lib/motion';

/**
 * METAFORE TECHNOLOGIES - LIQUID WEBGL ENGINE
 * এই কম্পোনেন্টটি মেটাবল শেডার এবং গ্লসি ৩ডি অবজেক্টের সমন্বয়ে 
 * একটি অর্গানিক লিকুইড এনভায়রনমেন্ট তৈরি করে।
 */

export const HeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // মাউস ও মোশন ট্র্যাকিং
  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // ১. সিন এবং ক্যামেরা সেটআপ
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // ২. রেন্ডারার কনফিগারেশন (High-End Rendering)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // ৩. অর্গানিক লিকুইড অবজেক্টস (The Blobs)
    const blobGroup = new THREE.Group();
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // লিকুইড মেটেরিয়াল (Glossy & Translucent)
    const createLiquidMaterial = (color: number) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.6, // গ্লাস ও লিকুইড ফিলিংসের জন্য
        thickness: 1.5,
        ior: 1.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9,
      });
      materials.push(mat);
      return mat;
    };

    // অর্গানিক মেইন ব্লোবস
    const blobGeom = new THREE.IcosahedronGeometry(1.8, 15); // হাই সাবডিভিশন
    geometries.push(blobGeom);

    const mainBlob = new THREE.Mesh(blobGeom, createLiquidMaterial(0x168BFF)); // Electric Blue
    const purpleBlob = new THREE.Mesh(blobGeom, createLiquidMaterial(0x7457FF)); // Purple
    purpleBlob.position.set(2, 1, -2);
    purpleBlob.scale.set(0.6, 0.6, 0.6);

    // ৪. গ্লসি টিউব ও রিভনস (Ribbons)
    const curve = new THREE.TorusKnotGeometry(2, 0.05, 128, 16);
    geometries.push(curve);
    const chromeMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      metalness: 1, 
      roughness: 0.05 
    });
    materials.push(chromeMat);
    const ribbon = new THREE.Mesh(curve, chromeMat);
    ribbon.position.set(-1, -1, 1);
    
    blobGroup.add(mainBlob, purpleBlob, ribbon);
    scene.add(blobGroup);

    // ৫. লাইটিং (Cinematic Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const topLight = new THREE.PointLight(0xffffff, 15);
    topLight.position.set(5, 5, 5);
    scene.add(topLight);

    const blueLight = new THREE.PointLight(0x168BFF, 10);
    blueLight.position.set(-5, 5, 2);
    scene.add(blueLight);

    // ৬. লিকুইড ডিসপ্লেসমেন্ট লজিক (Vertex Distortion)
    const updateVertexDistortion = (mesh: THREE.Mesh, time: number) => {
      const positions = mesh.geometry.attributes.position;
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);
        
        // নয়েজ-ভিত্তিক লিকুইড মুভমেন্ট (সিমুলেটেড মেটাবল)
        const noise = Math.sin(vertex.x * 1.5 + time) * 
                      Math.cos(vertex.y * 1.5 + time) * 
                      Math.sin(vertex.z * 1.5 + time) * 
                      (0.1 + velocity.current * 0.5);
        
        vertex.normalize().multiplyScalar(1.8 + noise);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      positions.needsUpdate = true;
    };

    // ৭. ইভেন্ট লিসেনারস
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // ভেলোসিটি ক্যালকুলেশন
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      velocity.current = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.005, 1);
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // ৮. রেন্ডার লুপ
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();

      // মাউস ইন্টারপোলেশন
      mouse.current.x = lerp(mouse.current.x, targetMouse.current.x, 0.05);
      mouse.current.y = lerp(mouse.current.y, targetMouse.current.y, 0.05);
      velocity.current = lerp(velocity.current, 0, 0.05); // গ্র্যাজুয়াল স্লো-ডাউন

      // লিকুইড মরফিং
      updateVertexDistortion(mainBlob, time);
      updateVertexDistortion(purpleBlob, time * 1.2);

      // ৩ডি অবজেক্ট রোটেশন ও টিল্ট
      blobGroup.rotation.x = mouse.current.y * 0.3;
      blobGroup.rotation.y = mouse.current.x * 0.3;
      blobGroup.position.y = Math.sin(time * 0.5) * 0.2; // ফ্লোটিং মোশন
      
      ribbon.rotation.z += 0.005 + velocity.current * 0.1;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // ৯. ক্লিনআপ ও মেমরি ডিসপোজাল
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full" 
      style={{ touchAction: 'none' }}
    />
  );
};