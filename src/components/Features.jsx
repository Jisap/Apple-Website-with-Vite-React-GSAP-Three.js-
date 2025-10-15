import { Canvas } from "@react-three/fiber";                 // Importa el componente Canvas para renderizar la escena 3D.
import StudioLights from "./three/StudioLights.jsx";         // Componente de iluminación personalizado para la escena.
import { features, featureSequence } from "../constants.js"; // Importa los datos de las características y la secuencia de videos.
import clsx from "clsx"; 
import { Suspense, useEffect, useRef } from "react"; 
import { Html } from "@react-three/drei";                    // Permite renderizar HTML dentro de una escena 3D.
import MacbookModel from "./models/Macbook.jsx"; 
import { useMediaQuery } from "react-responsive"; 
import useMacbookStore from "../store/index.js"; 
import { useGSAP } from "@gsap/react"; 
import gsap from 'gsap'; 

/**
 * Componente que maneja la lógica de animación del modelo 3D al hacer scroll.
 */
const ModelScroll = () => {
  
  const groupRef = useRef(null);                                     // Ref para obtener una referencia directa al grupo que contiene el modelo 3D.
  
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })   // Hook para saber si estamos en un dispositivo móvil y ajustar la escala del modelo.
  
  const { setTexture } = useMacbookStore();                          // Función del store de Zustand para cambiar la textura (el video) de la pantalla del Macbook.  

  // Este useEffect se ejecuta una sola vez para pre-cargar todos los videos de las características.
  // Esto mejora el rendimiento, ya que los videos estarán listos para mostrarse sin demoras cuando el scroll los active.
  useEffect(() => {
    featureSequence.forEach((feature) => {
      const v = document.createElement('video');

      // Asigna las propiedades necesarias al elemento de video.
      Object.assign(v, {
        src: feature.videoPath,
        muted: true,
        playsInline: true,
        preload: 'auto',
        crossOrigin: 'anonymous',
      });

      // Inicia la carga del video en segundo plano.
      v.load();
    })
  }, []);

  // Hook de GSAP para definir las animaciones controladas por el scroll.
  useGSAP(() => {
    // --- Timeline para la rotación del modelo 3D ---
    const modelTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#f-canvas',  // El elemento que dispara la animación es el Canvas.
        start: 'top top',      // La animación empieza cuando el tope del canvas llega al tope de la ventana.
        end: 'bottom top',     // Termina cuando el fondo del canvas llega al tope de la ventana.
        scrub: 1,              // La animación se inicia con el scroll, haciendo la transición suave.
        pin: true,             // Fija el elemento trigger (#f-canvas) mientras la animación está activa.
      }
    });

    // --- Timeline para sincronizar el contenido (textos y videos) ---
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#f-canvas',
        start: 'top center', // Empieza un poco antes para que el contenido se sincronice bien.
        end: 'bottom top',
        scrub: 1,
      }
    })

    // Animación de rotación del modelo 3D.
    if (groupRef.current) {
      // Gira el modelo 360 grados (2 * PI radianes) en el eje Y.
      modelTimeline.to(groupRef.current.rotation, { y: Math.PI * 2, ease: 'power1.inOut' })
    }

    // --- Sincronización de contenido y texturas de la pantalla ---
    // La timeline se construye como una secuencia de acciones.
    timeline
      .call(() => setTexture('/videos/feature-1.mp4')) // 1. Cambia el video de la pantalla.
      .to('.box1', { opacity: 1, y: 0, delay: 1 })     //    Y anima la aparición del primer texto.

      .call(() => setTexture('/videos/feature-2.mp4')) // 2. Cambia el video.
      .to('.box2', { opacity: 1, y: 0 })               //    Anima el segundo texto.

      .call(() => setTexture('/videos/feature-3.mp4')) // 3. Y así sucesivamente...
      .to('.box3', { opacity: 1, y: 0 })

      .call(() => setTexture('/videos/feature-4.mp4'))
      .to('.box4', { opacity: 1, y: 0 })

      .call(() => setTexture('/videos/feature-5.mp4'))
      .to('.box5', { opacity: 1, y: 0 })
  }, []);

  return (
    // El grupo que contiene el modelo y al que GSAP aplicará la rotación.
    <group ref={groupRef}>
      {/* Suspense muestra un fallback (un texto de "Loading...") mientras el modelo 3D se carga. */}
      <Suspense fallback={<Html><h1 className="text-white text-3xl uppercase">Loading...</h1></Html>}>
        {/* Renderiza el modelo del Macbook, ajustando su escala si es móvil y su posición vertical. */}
        <MacbookModel scale={isMobile ? 0.05 : 0.08} position={[0, -1, 0]} />
      </Suspense>
    </group>
  )
}

/**
 * Componente principal de la sección "Features".
 * Estructura el layout y renderiza el Canvas 3D y los textos de las características.
 */
const Features = () => {
  return (
    <section id="features">
      <h2>See it all in a new light.</h2>

      {/* El Canvas de React Three Fiber donde se renderiza la escena 3D. */}
      <Canvas id="f-canvas" camera={{}}>
        <StudioLights /> {/* Luces personalizadas para un look de estudio. */}
        <ambientLight intensity={0.5} /> {/* Luz ambiental para rellenar sombras. */}
        <ModelScroll /> {/* El componente que contiene el modelo y su lógica de animación. */}
      </Canvas>

      {/* Este div se superpone al canvas para mostrar los textos de las características. */}
      <div className="absolute inset-0">
        {/* Itera sobre el array 'features' para renderizar cada caja de texto. */}
        {features.map((feature, index) => (
          <div
            key={feature.id}
            // `clsx` ayuda a construir las clases: 'box' (común), 'box1', 'box2', etc. (para GSAP),
            // y los estilos de posicionamiento que vienen de las constantes.
            className={clsx('box', `box${index + 1}`, feature.styles)}
          >
            <img src={feature.icon} alt={feature.highlight} />
            <p>
              <span className="text-white">{feature.highlight}</span>
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features;
