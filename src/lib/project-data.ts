export const steps = [
  { title:'Imprimir y lijar', text:'Fabricación en PLA de la palma y las falanges. Lijado de las piezas para un ensamble preciso.' },
  { title:'Ensamblar los dedos', text:'Unión de las falanges con hilo de nylon, tornillos M3 y tendones para transmitir el movimiento.' },
  { title:'Montar los servos', text:'Instalación de los cinco servomotores en el antebrazo y conexión al controlador PCA.' },
  { title:'Calibrar la señal EMG', text:'Ajuste del umbral de detección de la contracción muscular a partir del sensor AD8232.' },
  { title:'Programar el agarre', text:'Mapeo de la señal muscular a posiciones de los dedos y al movimiento de pinza.' },
  { title:'Probar y ajustar', text:'Pruebas del movimiento, revisión de los tendones y ajuste del soporte del antebrazo.' },
];
export const members = [
  ['Marcos David Galindo Acero','Biomédica','MG'],
  ['Diego Isaac Mancilla Carreño','Creatividad Digital','DM'],
  ['Josue Alejandro Jimenez Quintero','Ciberseguridad','JJ'],
  ['Dyaln Castro Lopez','Finanzas','DC'],
  ['Rodrigo Trinidad Lopez Pizarro','Ciberseguridad','RP'],
];
export function pageHead(title:string, description:string) { return {meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}; }