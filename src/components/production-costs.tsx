import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Box, CalendarDays, ChevronRight, Cpu, Factory, Layers, PlugZap, Printer, TrendingDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { name: 'Materia prima', subtitle: 'Precios de compra registrados en el Excel', rows: [
    { icon: Layers, name: 'Filamento PLA', detail: '1 kg', amount: '$297.00' },
    { icon: PlugZap, name: 'Cables dupont', detail: '120 unidades', amount: '$89.00' },
    { icon: Cpu, name: 'Sensor mioeléctrico EMG', detail: '1 unidad', amount: '$189.00' },
    { icon: Box, name: 'Servomotores', detail: '5 unidades', amount: '$179.46' },
  ] },
  { name: 'Gastos indirectos', subtitle: 'Importes estimados por prótesis', rows: [
    { icon: Zap, name: 'Electricidad', detail: 'Por unidad', amount: '$10.94' },
    { icon: Box, name: 'Empaques', detail: 'Por unidad', amount: '$0.00' },
    { icon: Printer, name: 'Depreciación de la impresora', detail: 'Por unidad', amount: '$46.26' },
    { icon: Layers, name: 'Amortización de molde', detail: 'Por unidad', amount: '$0.24' },
    { icon: Factory, name: 'Refacciones · Hotend', detail: 'Por unidad', amount: '$6.73' },
  ] },
  { name: 'Depreciación', subtitle: 'Distribuida entre las unidades producidas en el año', rows: [
    { icon: Printer, name: 'Impresora 3D', detail: '30% anual', amount: '$4,811.25 / año' },
    { icon: Layers, name: 'Plantilla', detail: '15% anual', amount: '$24.90 / año' },
  ] },
];

function CostCounter() {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!visible || reduced) return;
    const controls = animate(0, 506.13, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate(value) {
      if (ref.current) ref.current.textContent = value.toFixed(2);
    } });
    return () => controls.stop();
  }, [visible, reduced]);
  return <span ref={ref}>506.13</span>;
}

export function ProductionCosts() {
  const [tab, setTab] = useState(0);
  const reduced = useReducedMotion();
  const category = categories[tab];
  if (!category) return null;
  return <section className="costs-v2" aria-labelledby="cost-heading">
    <div className="section cost-intro"><div><span className="eyebrow">03 / COSTOS DE PRODUCCIÓN</span><h2 id="cost-heading">Accesibilidad que<br/>también se mide.</h2></div><p>Ingeniería de bajo costo.<br/><span>Una inversión en posibilidades.</span></p></div>
    <div className="cost-highlight"><div className="cost-highlight-inner">
      <div className="cost-price"><span className="cost-overline"><TrendingDown size={16}/> COSTO ESTIMADO POR UNIDAD</span><div className="cost-number"><span className="currency">$</span><CostCounter/><small>MXN</small></div><p>Materia prima + gastos indirectos</p></div>
      <div className="cost-capacity"><CalendarDays size={23}/><span>Capacidad estimada</span><strong>2 <small>prótesis / semana</small></strong><div className="capacity-detail"><span><b>8.67</b> al mes</span><span><b>104</b> al año <ArrowUpRight size={15}/></span></div></div>
    </div></div>
    <div className="section cost-breakdown">
      <div className="cost-ledger"><div className="cost-tabs" role="tablist" aria-label="Detalle de costos">{categories.map((item, i) => <Button key={item.name} id={`cost-tab-${i}`} role="tab" aria-selected={tab === i} aria-controls="cost-panel" variant="ghost" onClick={() => setTab(i)} className={tab === i ? 'cost-tab selected' : 'cost-tab'}>{item.name}{tab === i && <motion.span layoutId="cost-tab-line" className="cost-tab-line" transition={{ type: 'spring', stiffness: 380, damping: 35 }}/>}</Button>)}</div>
        <AnimatePresence mode="wait"><motion.div key={tab} id="cost-panel" role="tabpanel" aria-labelledby={`cost-tab-${tab}`} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: reduced ? 0 : 0.22 }}><p className="ledger-subtitle">{category.subtitle}</p><div className="ledger-rows">{category.rows.map((row, i) => <motion.div className="ledger-row" key={row.name} initial={reduced ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduced ? 0 : i * 0.045 }}><div className="ledger-icon"><row.icon size={20}/></div><div><strong>{row.name}</strong><span>{row.detail}</span></div><b>{row.amount}</b></motion.div>)}</div></motion.div></AnimatePresence>
      </div>
      <aside className="equipment-investment"><span className="eyebrow">LA BASE PARA FABRICAR</span><Printer size={38} strokeWidth={1.2}/><h3>Inversión en equipo</h3><strong>$16,203.50 <small>MXN</small></strong><div><span>Impresora 3D</span><b>$16,037.50</b></div><div><span>Plantilla</span><b>$166.00</b></div><p><ChevronRight size={14}/> Equipo reutilizable para la producción.</p></aside>
      <p className="technical-note cost-footnote">Estimación académica basada en el Excel del proyecto. Los precios de compra no equivalen al consumo por prótesis. La mano de obra aún no está contemplada.</p>
    </div>
  </section>;
}