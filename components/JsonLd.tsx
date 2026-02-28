export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'No Noise Blog',
    url: 'https://blog.zucchini.win',
    description: 'Your attention is valuable. Every day: 6 must-reads, plus my latest writing.',
    author: {
      '@type': 'Person',
      name: 'Jayden',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({ 
  title, 
  description, 
  date, 
  author, 
  url 
}: { 
  title: string;
  description: string;
  date: string;
  author: string;
  url: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Person',
      name: 'Jayden',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
