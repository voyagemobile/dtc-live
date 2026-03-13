interface ArticleContentProps {
  html: string
}

export function ArticleContent({ html }: ArticleContentProps) {
  return (
    <div
      className="article-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
