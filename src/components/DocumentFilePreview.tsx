import { cn } from '@/lib/utils'
import { FileImage, FileText, File as FileIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

function fileKind(mime: string | null) {
  if (!mime) return 'other'
  if (mime.startsWith('image/')) return 'image'
  if (mime === 'application/pdf' || mime.includes('pdf')) return 'pdf'
  return 'other'
}

function PreviewIcon({ mime }: { mime: string | null }) {
  const k = fileKind(mime)
  if (k === 'pdf') return <FileText className="h-8 w-8 text-muted-foreground" />
  if (k === 'image') return <FileImage className="h-8 w-8 text-muted-foreground" />
  return <FileIcon className="h-8 w-8 text-muted-foreground" />
}

type Props = {
  storagePath: string | null
  fileName: string | null
  fileMime: string | null
  getSignedUrl: (path: string) => Promise<string | null>
  className?: string
}

export function DocumentFilePreview({
  storagePath,
  fileName,
  fileMime,
  getSignedUrl,
  className,
}: Props) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isImage = fileKind(fileMime) === 'image'

  useEffect(() => {
    if (!storagePath || !isImage) {
      setUrl(null)
      return
    }
    let cancelled = false
    setLoading(true)
    void getSignedUrl(storagePath).then((signed) => {
      if (cancelled) return
      setUrl(signed)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [storagePath, fileMime, isImage, getSignedUrl])

  if (!storagePath) return null

  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border border-border/80 bg-muted/20 p-3',
        className,
      )}
    >
      <div className="relative flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {isImage && loading ? (
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" aria-hidden />
        ) : null}
        {isImage && url ? (
          <img
            src={url}
            alt={fileName ? `Vista previa de ${fileName}` : 'Vista previa del archivo'}
            className="h-full w-full object-cover"
          />
        ) : null}
        {(!isImage || (!loading && !url)) && (
          <div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
            <PreviewIcon mime={fileMime} />
            <span className="line-clamp-2 text-[10px] font-medium text-muted-foreground">
              {fileMime?.split('/')[1]?.toUpperCase() ?? 'ARCHIVO'}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Archivo en repositorio
        </p>
        {fileName ? (
          <p className="truncate font-mono text-sm text-foreground" title={fileName}>
            {fileName}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Sin nombre de archivo</p>
        )}
        {fileMime ? (
          <p className="text-xs text-muted-foreground">
            Tipo: <span className="font-mono">{fileMime}</span>
          </p>
        ) : null}
      </div>
    </div>
  )
}
