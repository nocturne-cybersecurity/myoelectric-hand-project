import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';

export function ProjectHeader() {
  return <header className="site-header"><Link to="/" className="wordmark">CUGDL<span className="brand-divider"/><span className="brand-subtitle">Ingeniería con propósito</span></Link><nav aria-label="Navegación principal"><Link to="/" activeOptions={{exact:true}} activeProps={{className:'active'}}>El proyecto</Link><Link to="/proceso" activeProps={{className:'active'}}>Proceso</Link><Link to="/equipo" activeProps={{className:'active'}}>Equipo</Link></nav><span className="header-label">Proyecto universitario <ArrowUpRight size={15}/></span></header>;
}