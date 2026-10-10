# Myoelectric Hand Project

Genera una pagina web con imagenes replazables, que nada mas las cambie en los archivos con esta informacion:

Integrantes: 
Marcos David Galindo Acero
Diego Isaac Mancilla Carreño
Josue alejandro jimenez quintero
Dyaln Castro Lopez

Prótesis mioeléctrica de bajo costoObjetivo: mano funcional impresa en 3D para amputación transradial, que detecte contracción muscular por EMG y cierre pinza.Software: diseño paramétrico, laminado en UltiMaker Cura (Super Quality 0.12mm, PLA 0.4mm nozzle), Arduino IDE para control de servos.Mecánica: palma CC810 + 15 falanges, articulación con hilo de nylon / tornillos M3, tendones.Electrónica: sensor EMG MyoWare, Arduino Nano, 5x servos MG90S/MG996R, batería LiPo 2S + regulador, cableado.

materia prima base:1kg PLA, 5 servos, 1 sensor EMG, Arduino Nano, protoboard/cables, batería LiPo 7.4V 1000mAh, tornillería M3 y elásticos.Proceso: 1) imprimir y lijar, 2) ensamblar dedos con tendones, 3) montar servos en antebrazo, 4) calibrar umbral EMG, 5) mapear señal a posiciones de agarre, 6) pruebas y ajuste de soporte.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dbf5505e-d8fe-4e66-9821-7eaaccac26c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
