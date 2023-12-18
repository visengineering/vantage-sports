import React, { FC, useEffect, useState } from 'react';
import butter from './butter-client';
import { Helmet } from 'react-helmet';
import { BlogPostType } from 'src/types-cms';
import moment from 'moment';
import { ShareOnSocial } from 'src/components/layout/ShareOnSocial';
import { useShareLink } from 'src/components/shared/hooks/use-share-link';

const BlogPost: FC<{ match: any /* TODO: improve types */ }> = ({ match }) => {
  const shareLink = useShareLink();
  const [post, setPost] = useState<BlogPostType | null>(null);
  useEffect(() => {
    setTimeout(async () => {
      const resp = await butter.post.retrieve(match.params.post);
      setPost(resp.data.data);
    });
  }, []);

  if (!post) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Helmet>
        <title>{post.seo_title}</title>
        <meta name="description" content={post.meta_description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Vantage_NIL" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.meta_description} />
        <meta name="twitter:creator" content="@Vantage_NIL" />
        <meta name="twitter:image" content={post.featured_image} />
        <meta name="twitter:domain" content={window.location.host} />
        <meta property="og:url" content={shareLink} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description} />
        <meta name="og:image" content={post.featured_image} />
      </Helmet>
      <div className="blog-post-header container">
        <div className="text-content">
          <span className="text-muted">
            {moment(post.created).local().format('MM-DD-YYYY  h:mm a')}
          </span>
          <h1 className="title">{post.title}</h1>
          <ShareOnSocial shareLink={shareLink} emailSubject={post.title} />
        </div>
        <img className="featured-image" src={post.featured_image} />
      </div>
      <div className="blog-post container">
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </>
  );
};

export default BlogPost;
