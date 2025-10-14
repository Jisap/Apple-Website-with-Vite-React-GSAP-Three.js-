import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { performanceImages, performanceImgPositions } from "../constants.js";
import { useMediaQuery } from "react-responsive";

const Performance = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" }); // La animación de las imagenes solo se ejecuta en desktop
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      // Text Animation
      gsap.fromTo(
        ".content p",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".content p",
            start: "top bottom",
            end: "top center",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      if (isMobile) return;

      // Image Positioning Timeline
      // 1. Se crea una Timeline con un ScrollTrigger
      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "power1.inOut", overwrite: "auto" },
        scrollTrigger: {
          trigger: sectionEl,         // La sección <section id="performance">
          start: "top bottom",        // La animación empieza cuando el top de la sección toca el fondo de la pantalla
          end: "bottom top",          // Termina cuando el fondo de la sección toca el tope de la pantalla
          scrub: 1,                   // La animación se "frota" con el scroll, con 1 segundo de suavizado
          invalidateOnRefresh: true,
        },
      });

      // Position Each Performance Image
      // 2. Se itera sobre las posiciones finales y se crean las animaciones
      performanceImgPositions.forEach((item) => {

        if (item.id === "p5") return;                                          // La imagen central (p5) no se anima

        const selector = `.${item.id}`;
        const vars = {};                                                       // Objeto para las propiedades a animar

        // Se construyen las propiedades finales desde el archivo de constantes
        if (typeof item.left === "number") vars.left = `${item.left}%`;
        if (typeof item.right === "number") vars.right = `${item.right}%`;
        if (typeof item.bottom === "number") vars.bottom = `${item.bottom}%`;

        if (item.transform) vars.transform = item.transform;

        // 3. Se añade la animación a la timeline
        tl.to(selector, vars, 0);
      });
    },
    { scope: sectionRef, dependencies: [isMobile] }
  );

  return (
    <section id="performance" ref={sectionRef}>
      <h2>Next-level graphics performance. Game on.</h2>

      <div className="wrapper">
        {performanceImages.map((item, index) => (
          <img
            key={index}
            src={item.src}
            className={item.id}
            alt={item.alt || `Performance Image #${index + 1}`}
          />
        ))}
      </div>

      <div className="content">
        <p>
          Run graphics-intensive workflows with a responsiveness that keeps up
          with your imagination. The M4 family of chips features a GPU with a
          second-generation hardware-accelerated ray tracing engine that renders
          images faster, so{" "}
          <span className="text-white">
            gaming feels more immersive and realistic than ever.
          </span>{" "}
          And Dynamic Caching optimizes fast on-chip memory to dramatically
          increase average GPU utilization — driving a huge performance boost
          for the most demanding pro apps and games.
        </p>
      </div>
    </section>
  )
}
export default Performance