import { create } from 'zustand';

// Creamos nuestro store de Zustand.
// `create` recibe una función que define el estado inicial y las acciones.
// `set` es la función que usamos para actualizar el estado.

const useMacbookStore = create((set) => ({
  // --- ESTADO ---
  // Color actual del modelo del Macbook.
  color: '#2e2c2e',
  
  // Escala (tamaño) actual del modelo del Macbook.
  scale: 0.08,
  
  // Textura de video que se está mostrando en la pantalla del Macbook.
  texture: '/videos/feature-1.mp4',

  // --- ACCIONES ---
  // Acción para cambiar el color. Recibe un nuevo color y actualiza el estado.
  setColor: (color) => set({ color }),

  // Acción para cambiar la escala. Recibe una nueva escala y actualiza el estado.
  setScale: (scale) => set({ scale }),

  // Acción para cambiar la textura. Recibe una nueva ruta de video y actualiza el estado.
  setTexture: (texture) => set({ texture }),

  // Acción para resetear todos los valores a su estado inicial.
  reset: () => set({ color: '#2e2c2e', scale: 0.08, texture: '/videos/feature-1.mp4' }),
}))

export default useMacbookStore;