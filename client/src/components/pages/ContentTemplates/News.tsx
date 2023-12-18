import React from 'react';
import * as assets from '../../../assets';

const News = () => {
  return (
    <section className="news-release-section">
      <div className="container">
        <div className="news-container">
          <div className="news-banner">
            <div className="img-container">
              <img src={assets.newsBanner} alt="image" />
            </div>
          </div>

          <div className="release-info">
            <p className="info">Published: 28 Dec 2021, 2:28</p>
          </div>

          <div className="news-title">
            <h1 className="title-text">
              The return of “Yellowstone” has forced me into some tough viewing
              decisions on Sunday nights. What did we do before on-demand, just
              wait six months for the rerun?
            </h1>

            <hr />
          </div>

          <div className="news-content">
            <h2 className="content-title">Inside an NIL deal</h2>

            <p>
              Patrick Johnson at Vantage Sports provided some insight into how
              college athletes are monetizing their skills via a women’s
              lacrosse camp over the weekend in Pittsburgh.
            </p>

            <p>
              Duquesne sophomore Emelie Curtis gave instruction at a camp for
              $25 per athlete and took home a total of $550. Vantage charges a
              10% service fee for field setup, registrations and insurance
              waiver forms Johnson, who founded Vantage, runs camps and clinics
              of all sizes, but mostly his business is coming from setting up
              one-on-one training and mentoring programs that connect youth
              athletes with college athletes.
            </p>

            <p>
              He’s seen particular success with baseball instruction. Camps and
              clinics remain an NIL category with upside for the athletes and a
              prime way for them to monetize their name and accomplishments in
              their college town or hometown. But camps/clinics represent only
              4% of all NIL activity through the first four months, well behind
              social-media content and appearances, according to INFLCR.
            </p>

            <img src={assets.newsImg} alt="image" />

            <p></p>
            <p style={{ fontSize: '15px', fontWeight: '500' }}>
              <i>
                Duquesne sophomore Emelie Curtis gave instruction at a camp for
                $25 per athlete
              </i>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default News;
