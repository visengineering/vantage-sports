import React from 'react';
import * as assets from '../../assets';

const Testimonial = () => {
  return (
    <main>
      <section className="hero-panel-section">
        <div className="container">
          <div className="panel-section testimonial-panel">
            <h1 className="title">Testimonials</h1>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6 pr-lg-4 pb-md-0 pb-5">
              <div className="testimonial focus">
                <div className="img-container">
                  <img src={assets.testimonialBanner1} alt="" />
                </div>
                <div className="card-text-body">
                  <p className="type">Baseball</p>

                  <p className="d-flex flex-wrap mb-2">
                    <span className="institute">USF’s</span>
                    <span className="name">
                      <a href="https://www.vantagesports.com/coach/327">
                        Ben Rozenblum
                      </a>
                    </span>
                  </p>

                  <p className="message">
                    “It was tremendous. He came prepared with stuff to start and
                    said he will build from there going forward to work on
                    weaknesses and continue to build the strengths. Very polite
                    and great job of communicating and or demonstrating things
                    he wanted him to do.”
                  </p>

                  <p className="by">- William Harris</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 pl-lg-4">
              <div className="testimonial focus">
                <div className="img-container">
                  <img src={assets.testimonialBanner2} alt="" />
                </div>
                <div className="card-text-body">
                  <p className="type">Baseball</p>

                  <p className="d-flex flex-wrap mb-2">
                    <span className="institute">
                      University of West Florida’s
                    </span>
                    <span className="name">
                      <a href="https://www.vantagesports.com/coach/329">
                        Cullan OShea
                      </a>
                    </span>
                  </p>

                  <p className="message">
                    “Seth was pumped up after his lesson today. He literally
                    said that was one of the best lessons..... He said he
                    learned some good pointers and techniques. He definitely
                    wants to continue working”
                  </p>

                  <p className="by">- Dolores Taylor</p>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial-block">
            <div className="testimonial">
              <div className="img-container">
                <img src={assets.testimonialBanner3} alt="" />
              </div>
              <div className="card-text-body">
                <p className="type">Baseball</p>

                <p className="d-flex flex-wrap mb-2">
                  <span className="institute">Jackson State University’s</span>
                  <span className="name">
                    <a href="https://www.vantagesports.com/coach/424">
                      Anthony Beccera
                    </a>
                  </span>
                </p>

                <p className="message">
                  “Seth was pumped up after his lesson today. He literally said
                  that was one of the best lessons..... He said he learned some
                  good pointers and techniques. He definitely wants to continue
                  working”
                </p>

                <p className="by">- Kim A</p>
              </div>
            </div>

            <div className="testimonial">
              <div className="img-container">
                <img src={assets.testimonialBanner4} alt="" />
              </div>
              <div className="card-text-body">
                <p className="type">Football</p>

                <p className="d-flex flex-wrap mb-2">
                  <span className="institute">UTEP’s</span>
                  <span className="name">
                    <a href="https://www.vantagesports.com/coach/151">
                      Deylon William
                    </a>
                  </span>
                </p>

                <p className="message">
                  “These athletes were amazing with the boys and my son loved
                  them. Everyone got a ton of one on one time and we will
                  definitely be going to all future events. Thank you!.”
                </p>

                <p className="by">- Christopher Griessener</p>
              </div>
            </div>

            <div className="testimonial">
              <div className="img-container">
                <img src={assets.testimonialBanner5} alt="" />
              </div>
              <div className="card-text-body">
                <p className="type">Soccer</p>

                <p className="d-flex flex-wrap mb-2">
                  <span className="institute">
                    Nova Southeastern University’s
                  </span>
                  <span className="name">
                    <a href="https://www.vantagesports.com/coach/154">
                      Quentin Aguilar
                    </a>
                  </span>
                </p>

                <p className="message">
                  “Chase had a lot of fun. He actually said “it was fun” which
                  isn’t always the case (with private training). Coach is super
                  nice too”
                </p>

                <p className="by">- Nicole Austin</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Testimonial;
