import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';

const Showcase = () => {

  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

  useGSAP(() => {
    if (!isTablet) {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#showcase',  // 
          start: 'top top',      // Cuando la parte superior de la sección #showcase llega a la parte superior de la ventana, ScrollTrigger se activa. 
          end: 'bottom top',
          scrub: true,           // conecta el progreso de una animación directamente con la posición de la barra de scroll.
          pin: true,             // La sección #showcase se queda fija en la pantalla.
        }
      });

      timeline
        .to('.mask img', {                                           // Animamos la imagen de la máscara.
          transform: 'scale(1.1)'                                    // Escalamos la imagen de la máscara pasando del scale(80) ampliado a scale(1.1)
        }).to('.content', { opacity: 1, y: 0, ease: 'power1.in' });  // En index.css opacity=0 y aqui se pasa a 1, ademas pasa de y según layout a y=0
    }
  }, [isTablet])

  return (
    <section id="showcase">
      <div className="media">
        <video 
          src="/videos/game.mp4" 
          loop 
          muted 
          autoPlay 
          playsInline 
        />
        <div className="mask">
          <img src="/mask-logo.svg" />
        </div>
      </div>

      <div className="content">
        <div className="wrapper">
          <div className="lg:max-w-md">
            <h2>Rocket Chip</h2>

            <div className="space-y-5 mt-7 pe-10">
              <p>
                Introducing {" "}
                <span className="text-white">
                  M4, the next generation of Apple silicon
                </span>
                . M4 powers
              </p>
              <p>
                It drives Apple Intelligence on iPad Pro, so you can write, create, and accomplish more with ease. All in a design that’s unbelievably thin, light, and powerful.
              </p>
              <p>
                A brand-new display engine delivers breathtaking precision, color accuracy, and brightness. And a next-gen GPU with hardware-accelerated ray tracing brings console-level graphics to your fingertips.
              </p>
              <p className="text-primary">Learn more about Apple Intelligence</p>
            </div>
          </div>

          <div className="max-w-3xs space-y-14">
            <div className="space-y-2">
              <p>Up to</p>
              <h3>4x faster</h3>
              <p>pro rendering performance than M2</p>
            </div>
            <div className="space-y-2">
              <p>Up to</p>
              <h3>1.5x faster</h3>
              <p>CPU performance than M2</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Showcase