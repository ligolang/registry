// @ts-nocheck
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { Header as AppHeader } from './Header';

type PackageViewHeaderProps = { name: string; className?: string; description: string };

function PackageViewHeader(props: PackageViewHeaderProps) {
  let { name, description, className } = props;
  return (
    <header className={'ligo-app-header-bottom w-auto mx-24 mb-6 pb-4 ' + (className ?? '')}>
      <h1>{name}</h1>
      <p className="text-slate-400 text-xl pb-4">{description}</p>
    </header>
  );
}

type props = {
  markdown: string;
  name: string;
  description: string;
  author: string;
  website: string;
  repository: string;
  lastWeekDownloads: number;
};

export function Package({
  markdown,
  name,
  description,
  author,
  website,
  repository,
  lastWeekDownloads,
}: props) {
  let websiteSection;
  if (website) {
    websiteSection = (
      <>
        <h2>Website</h2>
        <p>
          <a href={website}>{website.replace(/https?:\/\//, '')}</a>
        </p>
      </>
    );
  } else {
    websiteSection = <div />;
  }
  let repositorySection;
  if (repository) {
    repositorySection = (
      <>
        <h2>Repository</h2>
        <p>
          <a href={repository}>{repository.replace(/https?:\/\//, '')}</a>
        </p>
      </>
    );
  } else {
    websiteSection = <div />;
  }
  let authorSection;
  if (author) {
    authorSection = (
      <>
        <h2>By</h2>
        <p>{author}</p>
      </>
    );
  } else {
    authorSection = <div />;
  }
  return (
    <main>
      <AppHeader />
      <section className="flex flex-col pb-12">
        <PackageViewHeader name={name} description={description} />
        <section className="flex lg:flex-row flex-col">
          <article className="flex-auto lg:w-1/3">
            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    // @ts-ignore
                    <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {markdown.replace(`# ${name}`, '')}
            </ReactMarkdown>
          </article>
          <aside className="flex-auto mt-12 flex-none w-full lg:w-1/3 lg:mt-0">
            {authorSection}
            {websiteSection}
            {repositorySection}
            <h2>Downloads last week</h2>
            <p>{lastWeekDownloads}</p>
          </aside>
        </section>
      </section>
    </main>
  );
}
/* <article dangerouslySetInnerHTML={{ __html: markdown}} className="flex-auto lg:w-1/3"></article> */
