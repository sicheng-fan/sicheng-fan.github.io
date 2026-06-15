'use client'

import Image from 'next/image'

interface AffiliationLogoProps {
  src: string
  alt: string
  containerClassName?: string
  imageClassName?: string
  sizes?: string
}

export function AffiliationLogo({
  src,
  alt,
  containerClassName = 'h-10 w-10 rounded-xl',
  imageClassName = 'object-contain p-1.5',
  sizes = '40px',
}: AffiliationLogoProps) {
  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white ${containerClassName}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={imageClassName}
      />
    </div>
  )
}
