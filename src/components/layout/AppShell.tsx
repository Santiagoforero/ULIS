import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useProjectWorkspace } from '@/context/ProjectWorkspaceContext'
import {
  Activity,
  ArrowLeft,
  Bell,
  Building2,
  FileBarChart,
  FileCheck2,
  FileSearch,
  Gavel,
  Landmark,
  LayoutDashboard,
  Menu,
  Scale,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom'

export function AppShell() {
  const { projectId } = useParams<{ projectId: string }>()
  const { project, loading, error } = useProjectWorkspace()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const base = `/p/${projectId ?? ''}`

  const nav = useMemo(
    () => [
      { to: base, label: 'Dashboard', icon: LayoutDashboard, end: true },
      {
        to: `${base}/recoleccion`,
        label: 'Recolección Documental',
        icon: FileSearch,
        badge: 'ACTIVA',
      },
      { to: `${base}/diagnostico`, label: 'Diagnóstico Legal', icon: Scale },
      { to: `${base}/analisis-normativo`, label: 'Análisis Normativo', icon: Landmark },
      { to: `${base}/mcn`, label: 'Matriz de Cumplimiento (MCN)', icon: FileCheck2 },
      { to: `${base}/radicacion`, label: 'Radicación', icon: Gavel },
      { to: `${base}/licenciamiento`, label: 'Licenciamiento', icon: Building2 },
      { to: `${base}/reportes`, label: 'Reportes', icon: FileBarChart },
    ],
    [base],
  )

  const title = useMemo(() => {
    const item = nav.find((n) =>
      n.end ? location.pathname === n.to : location.pathname.startsWith(n.to),
    )
    return item?.label ?? 'ULIS'
  }, [location.pathname, nav])

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen bg-background text-foreground">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/5 bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-6 py-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <Activity className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sidebar-muted">
                  Urban Legal Intelligence
                </p>
                <p className="text-lg font-semibold tracking-tight">ULIS</p>
              </div>
            </div>
            <Separator className="bg-white/10" />
            <div className="px-4 py-2">
              <NavLink
                to="/projects"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-sidebar-muted hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Todos los proyectos
              </NavLink>
            </div>
            <ScrollArea className="flex-1 px-3 py-2">
              <nav className="space-y-1">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-white/10 text-white shadow-inner shadow-black/20'
                          : 'text-sidebar-muted hover:bg-white/5 hover:text-white',
                      ].join(' ')
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </nav>
            </ScrollArea>
            <div className="border-t border-white/10 p-4 text-xs text-sidebar-muted">
              <p className="font-semibold text-white/90">Expediente</p>
              <p className="mt-1 leading-relaxed">
                <span className="text-white">
                  {loading ? 'Cargando…' : project?.name ?? '—'}
                </span>
                {error ? <span className="mt-1 block text-destructive">{error}</span> : null}
              </p>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
          <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-8">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white shadow-sm lg:hidden"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Panel operativo
                </p>
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
                </div>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    readOnly
                    placeholder="Buscar en expediente…"
                    className="h-10 w-72 rounded-xl border border-border bg-white pl-9 pr-3 text-sm shadow-sm outline-none ring-accent/0 transition focus:ring-2 focus:ring-accent/25"
                  />
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm hover:text-foreground"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Centro de alertas y requerimientos</TooltipContent>
              </Tooltip>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
