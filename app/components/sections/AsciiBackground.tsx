"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";

export function AsciiBackground() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(width, height);

    const effect = new AsciiEffect(renderer, " .:-=+*#%@", {
      invert: true,
      resolution: 0.18,
      scale: 1,
    });
    effect.setSize(width, height);
    effect.domElement.style.position = "absolute";
    effect.domElement.style.inset = "0";
    effect.domElement.style.color = "rgb(63, 63, 70)";
    effect.domElement.style.backgroundColor = "transparent";
    effect.domElement.style.pointerEvents = "none";
    stage.appendChild(effect.domElement);

    // AsciiEffect's wrapper contains the WebGL canvas — force it hidden so only
    // the ASCII table overlay is visible.
    const innerCanvas = effect.domElement.querySelector("canvas");
    if (innerCanvas) {
      innerCanvas.style.display = "none";
    }

    const geometry = new THREE.TorusKnotGeometry(0.9, 0.32, 160, 24);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      shininess: 20,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    const point = new THREE.PointLight(0xffffff, 2.0);
    point.position.set(5, 5, 5);
    scene.add(point);

    const point2 = new THREE.PointLight(0xffffff, 1.0);
    point2.position.set(-5, -3, 4);
    scene.add(point2);

    let rafId = 0;
    const start = performance.now();
    const animate = () => {
      const t = (performance.now() - start) / 1000;
      mesh.rotation.x = t * 0.25;
      mesh.rotation.y = t * 0.35;
      effect.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      effect.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      if (effect.domElement.parentNode === stage) {
        stage.removeChild(effect.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden dark:flex items-center justify-center overflow-hidden"
    >
      <div
        ref={stageRef}
        className="relative w-[700px] h-[500px] md:w-[875px] md:h-[625px]"
      />
    </div>
  );
}
