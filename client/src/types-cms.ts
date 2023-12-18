export type CMSAuthor = {
  bio: string;
  email: string;
  facebook_url: string;
  first_name: string;
  instagram_url: string;
  last_name: string;
  linkedin_url: string;
  pinterest_url: string;
  profile_image: string;
  slug: string;
  title: string;
  twitter_handle: string;
};

export type CMSCategory = {
  name: string;
  slug: string;
};

export type CMSTag = {
  name: string;
  slug: string;
};

export type BlogPostType = {
  author: CMSAuthor;
  body: string;
  categories?: CMSCategory[];
  created: string;
  featured_image?: string;
  featured_image_alt?: string;
  meta_description: string;
  published: string;
  seo_title: string;
  slug: string;
  status: string;
  summary: string;
  tags: CMSTag[];
  title: string;
  updated: string;
  url: string;
};

export type BlogPosts = {
  meta: {
    next_page?: number;
    previous_page?: number;
  };
  data: BlogPostType[];
};
