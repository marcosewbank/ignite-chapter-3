import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(props: PostProps) {
  console.log('🚀 ~ file: [slug].tsx ~ line 30 ~ Post ~ props', props);

  return <div>post</div>;
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query();

  return {
    paths: [
      // {
      //   params: {
      //     slug: "criando-um-blog-com-contador-de-visitas-usando-nextjs",
      //   },
      // },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps = async context => {
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', context.params.uid);
  console.log('🚀 ~ file: [slug].tsx ~ line 57 ~ response', response);

  // TODO

  return { props: { post: 'oi' } };
};
