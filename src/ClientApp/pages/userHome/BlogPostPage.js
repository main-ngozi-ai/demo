import React from 'react';
import { Link } from 'react-router-dom';
import AvatarImg0 from '../../components/Img/avatars-0.jpg';
import AvatarImg1 from '../../components/Img/avatars-1.jpg';
import AvatarImg2 from '../../components/Img/avatars-2.jpg';
import AvatarImg3 from '../../components/Img/avatars-3.jpg';


import BlogImg1 from '../../components/Img/AA_Blog/1.jpeg';
import BlogImg2 from '../../components/Img/AA_Blog/2.jpeg';
import BlogImg3 from '../../components/Img/AA_Blog/3.jpeg';
import BlogImg5 from '../../components/Img/AA_Blog/4.jpeg';
import BlogImg6 from '../../components/Img/AA_Blog/5.jpeg';
import BlogImg4 from '../../components/Img/AA_Blog/6.jpeg';
import BlogImg7 from '../../components/Img/AA_Blog/7.jpeg';
import BlogImg8 from '../../components/Img/AA_Blog/8.jpeg';
import BlogImg9 from '../../components/Img/AA_Blog/9.jpeg';
import BlogImg10 from '../../components/Img/AA_Blog/10.jpeg';



const TopCards = ({ data }) => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
      <div className="card card-small card-post card-post--1">
        <div className="card-post__image" style={{ backgroundImage: `url(${data.image})` }}>
          <Link to={data.categoryLink} className={`card-post__category badge badge-pill badge-${data.badgeColor}`}>
            {data.category}
          </Link>
          <div className="card-post__author d-flex">
            <Link
              to={data.authorLink}
              className="card-post__author-avatar card-post__author-avatar--small"
              style={{ backgroundImage: `url(${data.authorAvatar})` }}
            >
              Written by {data.authorName}
            </Link>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">
            <Link className="text-fiord-blue" to={data.postLink}>
              {data.title}
            </Link>
          </h5>
          <p className="card-text d-inline-block mb-3">{data.description}</p>
          <span className="text-muted">{data.date}</span>
        </div>
      </div>
    </div>
  );
};


const AsidePostCard = ({ data }) => {
return (
  <div className="col-lg-6 col-sm-12 mb-4">
    <div className="card card-small card-post card-post--aside card-post--1">
      <div className="card-post__image" style={{ backgroundImage: `url(${data.image})` }}>
        <Link to={data.categoryLink} className={`card-post__category badge badge-pill badge-${data.badgeColor}`}>
          {data.category}
        </Link>
        <div className="card-post__author d-flex">
          <Link
            to={data.authorLink}
            className="card-post__author-avatar card-post__author-avatar--small"
            style={{ backgroundImage: `url(${data.authorAvatar})` }}
          >
            Written by {data.authorName}
          </Link>
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">
          <Link className="text-fiord-blue" to={data.postLink}>
            {data.title}
          </Link>
        </h5>
        <p className="card-text d-inline-block mb-3">{data.description}</p>
        <span className="text-muted">{data.date}</span>
      </div>
    </div>
  </div>
);
};



const SmallCard = ({ data }) => {
  return (
    <div className="col-lg-4">
      <div className="card card-small card-post mb-4">
        <div className="card-body">
          <h5 className="card-title">{data.title}</h5>
          <p className="card-text text-muted">{data.description}</p>
        </div>
        <div className="card-footer border-top d-flex">
          <div className="card-post__author d-flex">
            <Link
              to="#"
              className="card-post__author-avatar card-post__author-avatar--small"
              style={{ backgroundImage: `url(${data.avatar})` }}
            >
              Written by {data.author}
            </Link>
            <div className="d-flex flex-column justify-content-center ml-3">
              <span className="card-post__author-name">{data.author}</span>
              <small className="text-muted">{data.date}</small>
            </div>
          </div>
          <div className="my-auto ml-auto">
            <Link className="btn btn-sm btn-white" to="#">
              <i className="far fa-bookmark mr-1"></i> Bookmark
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const LargeCard = ({ data }) => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
      <div className="card card-small card-post h-100">
        <div
          className="card-post__image"
          style={{ backgroundImage: `url(${data.image})` }}
        ></div>
        <div className="card-body">
          <h5 className="card-title">
            <Link className="text-fiord-blue" to="#">
              {data.title}
            </Link>
          </h5>
          <p className="card-text">{data.description}</p>
        </div>
        <div className="card-footer text-muted border-top py-3">
          <span className="d-inline-block">
            By{' '}
            <Link className="text-fiord-blue" to="#">
              {data.author}
            </Link>{' '}
            in{' '}
            <Link className="text-fiord-blue" to="#">
              {data.category}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};


const TopCardsData = [
  {
    image: BlogImg1,
    category: 'Business',
    badgeColor: 'dark',
    categoryLink: '/category/business',
    authorAvatar: AvatarImg0,
    authorName: 'Anna Kunis',
    authorLink: '/author/anna-kunis',
    title: 'Conduct at an replied removal an amongst',
    postLink: '/post/conduct-at-an-replied',
    description: 'However venture pursuit he am mr cordial. Forming musical am hearing studied be luckily. But in for determine what would see...',
    date: '28 February 2019',
  },
  {
    image: BlogImg2,
    category: 'Travel',
    badgeColor: 'info',
    categoryLink: '/category/travel',
    authorAvatar: AvatarImg1,
    authorName: 'James Jamerson',
    authorLink: '/author/james-jamerson',
    title: 'Off tears are day blind smile alone had ready',
    postLink: '/post/off-tears-are-day',
    description: 'Is at purse tried jokes china ready decay an. Small its shy way had woody downs power. To denoting admitted speaking learning my...',
    date: '29 February 2019',
  },
  {
    image: BlogImg3,
    category: 'Technology',
    badgeColor: 'primary',
    categoryLink: '/category/technology',
    authorAvatar: AvatarImg2,
    authorName: 'Jimmy Jackson',
    authorLink: '/author/jimmy-jackson',
    title: 'Difficult in delivered extensive at direction',
    postLink: '/post/difficult-in-delivered',
    description: 'Is at purse tried jokes china ready decay an. Small its shy way had woody downs power. To denoting admitted speaking learning my...',
    date: '29 February 2019',
  },
  {
    image: BlogImg4,
    category: 'Technology',
    badgeColor: 'warning',
    categoryLink: '/category/technology',
    authorAvatar: AvatarImg3,
    authorName: 'John James',
    authorLink: '/author/john-james',
    title: 'It so numerous if he may outlived disposal',
    postLink: '/post/it-so-numerous',
    description: 'How but sons mrs lady when. Her especially are unpleasant out alteration continuing unreserved ready road market resolution...',
    date: '29 February 2019',
  },
];



const asidePosts = [
  {
    image: BlogImg5,
    category: 'Travel',
    badgeColor: 'info',
    categoryLink: '/category/travel',
    authorAvatar: AvatarImg2,
    authorName: 'Anna Ken',
    authorLink: '/author/anna-ken',
    title: 'Attention he extremity unwilling on otherwise cars backwards yet',
    postLink: '/post/attention-he-extremity',
    description: 'Conviction up partiality as delightful is discovered. Yet jennings resolved disposed exertion you off. Left did fond drew fat head poor jet pan flying over...',
    date: '29 February 2019',
  },
  {
    image: BlogImg6,
    category: 'Business',
    badgeColor: 'dark',
    categoryLink: '/category/business',
    authorAvatar: AvatarImg1,
    authorName: 'Jamie James',
    authorLink: '/author/jamie-james',
    title: 'Totally words widow one downs few age every seven if miss part by fact',
    postLink: '/post/totally-words-widow',
    description: 'Discovered had get considered projection who favourable. Necessary up knowledge it tolerably. Unwilling departure education to admitted speaking...',
    date: '29 February 2019',
  },
];



const PostBlogPage = () => {
  const smallCardData = [
    {
      title: 'Had denoting properly jointure which well books beyond',
      description:
        'In said to of poor full be post face snug. Introduced imprudence see say unpleasing devonshire acceptance son. Exeter longer...',
      author: 'James Khan',
      date: '21 March 2011',
      avatar: AvatarImg1,
    },
    {
      title: 'Husbands ask repeated resolved but laughter debating',
      description:
        'It abode words began enjoy years no do no. Tried spoil as heart visit blush or. Boy possible blessing sensible set but margaret interest. Off tears...',
      author: 'Chris Jones',
      date: '21 March 2011',
      avatar: AvatarImg2,
    },
    {
      title: 'Instantly gentleman contained belonging exquisite now direction',
      description:
        'West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest merit checking railway...',
      author: 'Mark Jameson',
      date: '21 March 2011',
      avatar: AvatarImg3,
    },
  ];

  const largeCardData = [
    {
      image: BlogImg7,
      title: 'Extremity so attending objection as engrossed',
      description:
        'Morning prudent removal an letters by. On could my in order never it. Or excited certain sixteen it to parties colonel not seeing...',
      author: 'Alene Trenton',
      category: 'News',
    },
    {
      image: BlogImg8,
      title: 'Bed sincerity yet therefore forfeited his',
      description:
        'Pursuit chamber as elderly amongst on. Distant however warrant farther to of. My justice wishing prudent waiting in be...',
      author: 'Chris Jamie',
      category: 'News',
    },
    {
      image: BlogImg9,
      title: 'Object remark lively all did feebly excuse our',
      description:
        'Speaking throwing breeding betrayed children my to. Me marianne no he horrible produced ye. Sufficient unpleasing and...',
      author: 'Monica Jordan',
      category: 'News',
    },
    {
      image: BlogImg10,
      title: 'His followed carriage proposal entrance',
      description:
        'For county now sister engage had season better had waited. Occasional mrs interested far expression directly as regard...',
      author: 'Monica Jordan',
      category: 'News',
    },
  ];

  return (
    <div className="main-content-container container-fluid px-4">
      <div className="page-header row no-gutters py-4">
        <div className="col-12 col-sm-4 text-center text-sm-left mb-0">
          <span className="text-uppercase page-subtitle">Components</span>
          <h3 className="page-title">Blog Posts</h3>
        </div>
      </div>

      <div className="row">
      {TopCardsData.map((post, index) => (
        <TopCards key={index} data={post} />
      ))}
    </div>

    <div className="row">
      {asidePosts.map((post, index) => (
        <AsidePostCard key={index} data={post} />
      ))}
    </div>

      <div className="row">
        {smallCardData.map((card, index) => (
          <SmallCard key={index} data={card} />
        ))}
      </div>
      <div className="row">
        {largeCardData.map((card, index) => (
          <LargeCard key={index} data={card} />
        ))}
      </div>
    </div>
  );
};

export default PostBlogPage;
