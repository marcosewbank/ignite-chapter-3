import { useState } from 'react';
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';
import Post from './post/[slug]';
import Header from '../components/Header';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props: HomeProps) {
  const { results, next_page } = props.postsPagination;

  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState(next_page);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = async () => {
    if (currentPage !== 1 && nextPage === null) {
      return;
    }

    const postsResults = await fetch(`${nextPage}`).then(response =>
      response.json()
    );
    setNextPage(postsResults.next_page);
    setCurrentPage(postsResults.page);
    setPosts([...posts, ...postsResults.results]);
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <article className={styles.posts}>
          {posts.map(result => (
            <Link href={`/post/${result.uid}`}>
              <a key={result.uid} className={styles.post}>
                <strong>{result.data.title}</strong>
                <p>{result.data.subtitle}</p>
                <section>
                  <span>
                    <FiCalendar />
                    <time>
                      {format(new Date(result.first_publication_date), 'PP', {
                        locale: ptBR,
                      })}
                    </time>
                  </span>
                  <span>
                    <FiUser />
                    <span>{result.data.author}</span>
                  </span>
                </section>
              </a>
            </Link>
          ))}
          {nextPage && (
            <button type="button" onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}
        </article>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse: any = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    { pageSize: 1 }
  );

  return {
    props: {
      postsPagination: {
        results: postsResponse.results,
        next_page: postsResponse.next_page,
      },
    },
  };
};
