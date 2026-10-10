import { useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const files = import.meta.glob<string>('../assets/proceso/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const images = Object.entries(files).sort(([a],[b]) => a.localeCompare(b)).map(([path,src]) => ({src, label:path.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/^\d+[-_]?/, '').replace(/[-_]/g,' ') || 'Proceso del proyecto'}));

export function ProcessGallery() {
  const [current,setCurrent] = useState(0);
  const [expanded,setExpanded] = useState(false);
  const image = images[current];
  const move = (direction:number) => setCurrent(value => (value + direction + images.length) % images.length);
  if (!image) return <p className="text-muted-foreground">Registro fotográfico pendiente.</p>;
  return <div className="gallery" onKeyDown={event => {if(event.key==='ArrowLeft')move(-1);if(event.key==='ArrowRight')move(1);if(event.key==='Escape')setExpanded(false);}}><div className="gallery-image"><img src={image.src} alt={image.label} width={1536} height={1024} loading="lazy"/><span className="photo-tag">REGISTRO DEL PROYECTO</span><Button variant="ghost" size="icon" className="expand-button" title="Ampliar imagen" aria-label="Ampliar imagen" onClick={()=>setExpanded(true)}><Maximize2/></Button></div><div className="gallery-bottom"><div><span className="eyebrow">{String(current+1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}</span><h3 className="capitalize">{image.label}</h3></div><div className="gallery-controls"><Button variant="outline" size="icon" aria-label="Imagen anterior" onClick={()=>move(-1)}><ArrowLeft/></Button><Button variant="outline" size="icon" aria-label="Imagen siguiente" onClick={()=>move(1)}><ArrowRight/></Button></div></div>{images.length>1&&<div className="gallery-thumbs">{images.map((item,index)=><Button key={item.src} variant="ghost" className={index===current?'thumb selected':'thumb'} aria-label={`Ver imagen ${index+1}: ${item.label}`} onClick={()=>setCurrent(index)}><img src={item.src} alt="" loading="lazy"/></Button>)}</div>}{expanded&&<div className="lightbox" role="dialog" aria-modal="true" aria-label="Fotografía ampliada"><Button variant="ghost" size="icon" className="lightbox-close" aria-label="Cerrar imagen" autoFocus onClick={()=>setExpanded(false)}><X/></Button><img src={image.src} alt={image.label}/><div className="gallery-controls"><Button variant="outline" size="icon" aria-label="Fotografía anterior" onClick={()=>move(-1)}><ArrowLeft/></Button><Button variant="outline" size="icon" aria-label="Fotografía siguiente" onClick={()=>move(1)}><ArrowRight/></Button></div></div>}</div>;
}