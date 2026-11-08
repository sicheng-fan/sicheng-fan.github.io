import { Fragment } from 'react'
import type { Publication } from '@/data/publications'

export function PublicationAuthors({ pub }: { pub: Publication }) {
  const authors = pub.authors.slice(0, pub.authorDisplayLimit)
  return (
    <>
      {authors.map((author, i) => (
        <Fragment key={`${i}-${author}`}>
          {i > 0 && ', '}
          {author === 'Sicheng Fan' ? <strong className="text-slate-800">{author}</strong> : author}
        </Fragment>
      ))}
      {authors.length < pub.authors.length && ', et al.'}
    </>
  )
}
