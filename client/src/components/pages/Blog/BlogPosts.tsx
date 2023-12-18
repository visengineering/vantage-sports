import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useHistory } from 'react-router-dom';
import { Stack } from 'src/components/shared/Stack';
import { BlogPosts, BlogPostType } from 'src/types-cms';
import butter from './butter-client';
import arrowLeft from '../../../assets/landingpage/arrow-left.svg';
import arrowRight from '../../../assets/landingpage/arrow-right.svg';

const BlogPostCard: FC<{
  post: BlogPostType;
  className?: string;
}> = ({ post, className }) => (
  <div className="card blog-post-card-item">
    <Link to={`/blog/posts/${post.slug}`}>
      <div className={`blog-card ${className}`}>
        {post.featured_image && (
          <div className="card-img">
            <img className="img" src={post.featured_image} />
          </div>
        )}
        <div className="text-content">
          <span>
            {moment(post.created).local().format('MM-DD-YYYY  h:mm a')}
          </span>
          <h2>{post.title}</h2>
        </div>
      </div>
    </Link>
  </div>
);

const BlogPostsPage: FC<{ match: any /* TODO: improve types */ }> = ({
  match,
}) => {
  const [posts, setPosts] = useState<BlogPosts>({
    meta: {},
    data: [],
  });
  const page = match.params?.page || 1;
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 991px)' });
  const history = useHistory();

  useEffect(() => {
    setTimeout(async () => {
      const resp = await butter.post.list({ page, page_size: 11 });
      setPosts({
        ...resp.data,
        data: (
          (resp.data?.data ? resp.data.data : []) as BlogPostType[]
        ).filter((post) => post.status === 'published'),
      });
    });
  }, [page]);
  if (!posts.data?.length) {
    return <p>Loading...</p>;
  }
  const { next_page, previous_page } = posts.meta;
  return (
    <div style={{ backgroundColor: '#f5f5f7' }}>
      <div className="container">
        <Stack flow="row" gap={1}>
          <h1>Vantage News</h1>
          {posts.data.length > 0 && (
            <>
              <BlogPostCard post={posts.data[0]} className="first-card" />
              <Stack
                gap={1}
                templateColumns={isTabletOrMobile ? '1fr' : '1fr 1fr'}
              >
                {posts.data.slice(1).map((post, key) => {
                  return <BlogPostCard post={post} key={key} />;
                })}
              </Stack>
            </>
          )}

          <div className="switch-page-blog">
            <button
              className="arrow-button"
              onClick={() => history.push(`/blog/${previous_page}`)}
              disabled={!previous_page}
            >
              <img src={arrowLeft} />
            </button>
            <button
              className="arrow-button"
              onClick={() => history.push(`/blog/${next_page}`)}
              disabled={!next_page}
            >
              <img src={arrowRight} />
            </button>
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default BlogPostsPage;
