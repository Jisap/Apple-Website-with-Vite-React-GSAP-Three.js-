// Importaciones necesarias de React y librerías de Three.js y animación.
import { useRef } from "react";
import { PresentationControls } from "@react-three/drei";
import gsap from 'gsap';

// Importación de los modelos 3D de los Macbook.
import MacbookModel16 from "../models/Macbook-16.jsx";
import MacbookModel14 from "../models/Macbook-14.jsx";
import { useGSAP } from "@gsap/react";


// --- CONSTANTES DE ANIMACIÓN ---

const ANIMATION_DURATION = 1;                                            // Duración de las animaciones de transición en segundos.
const OFFSET_DISTANCE = 5;                                               // Distancia que se desplazan los modelos para salir de la pantalla.

// --- FUNCIONES AUXILIARES DE ANIMACIÓN (GSAP) ---

// Función para animar la opacidad de todos los sub-objetos (mallas) de un grupo.
const fadeMeshes = (group, opacity) => {
  if (!group) return;

  // Recorre todos los descendientes del grupo.
  group.traverse((child) => {
    if (child.isMesh) {
      // Asegura que el material pueda ser transparente.
      child.material.transparent = true;
      // Anima la propiedad 'opacity' del material.
      gsap.to(child.material, { opacity, duration: ANIMATION_DURATION })
    }
  })
}

// Función para animar la posición en el eje X de un grupo.
const moveGroup = (group, x) => {
  if (!group) return;

  // Anima la propiedad 'position.x' del grupo.
  gsap.to(group.position, { x, duration: ANIMATION_DURATION })
}


const ModelSwitcher = ({ scale, isMobile }) => {

  const SCALE_LARGE_DESKTOP = 0.08;
  const SCALE_LARGE_MOBILE = 0.05;

  const smallMacbookRef = useRef();
  const largeMacbookRef = useRef();

  const showLargeMacbook = scale === SCALE_LARGE_DESKTOP || scale === SCALE_LARGE_MOBILE; // Determina si el modelo grande se muestra o no.

  const controlsConfig = {
    snap: true,
    speed: 1,
    zoom: 1,
    azimuth: [-Infinity, Infinity],
    config: { mass: 1, tension: 0, friction: 26 }
  }

  // Cuando el usuario hace clic en un tamaño, el scale cambia. useGSAP se dispara 
  useGSAP(() => {
    // Esto es TRUE en la primera renderización SCALE_LARGE_DESKTOP = 0.08 -> showLargeMacbook = true
    if (showLargeMacbook) {
      // Mueve el Macbook pequeño a la izquierda, fuera de la pantalla.
      moveGroup(smallMacbookRef.current, -OFFSET_DISTANCE); // x: -5
      // Mueve el Macbook grande al centro.
      moveGroup(largeMacbookRef.current, 0);

      fadeMeshes(smallMacbookRef.current, 0);
      fadeMeshes(largeMacbookRef.current, 1);
    } else {
      // Mueve el Macbook grande a la derecha, fuera de la pantalla.
      moveGroup(smallMacbookRef.current, 0);
      // Mueve el Macbook pequeño al centro.
      moveGroup(largeMacbookRef.current, OFFSET_DISTANCE);

      fadeMeshes(smallMacbookRef.current, 1);
      fadeMeshes(largeMacbookRef.current, 0);
    }
  }, [scale])

  return (
    <>
      <PresentationControls {...controlsConfig}>
        <group ref={largeMacbookRef}>
          <MacbookModel16 
            scale={isMobile ? 0.05 : 0.08}
          />
        </group>
      </PresentationControls>

      <PresentationControls {...controlsConfig}>
        <group ref={smallMacbookRef}>
          <MacbookModel14 scale={isMobile ? 0.03 : 0.06} />
        </group>
      </PresentationControls>
    </>
  )
}

export default ModelSwitcher