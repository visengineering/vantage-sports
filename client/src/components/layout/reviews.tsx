import React from 'react';
import Slider from 'react-slick';
import man1 from '../../assets/landingpage/optimized/man1.jpeg';
import man2 from '../../assets/landingpage/optimized/man2.jpeg';
import stars from '../../assets/landingpage/stars.svg';
import woman1 from '../../assets/landingpage/optimized/woman1.jpeg';
import woman2 from '../../assets/landingpage/optimized/woman2.jpeg';

const Reviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  return (
    <section className="py-5 bg-primary text-white sections">
      <div className="container text-center">
        <h2 className="text-center text-4xl font-extrabold">
          <strong>Why people love Vantage</strong>
        </h2>
        <img className="mx-auto d-inline-block mx-auto my-4" src={stars} />
        <div className="pt-2">
          <div className="py-2">
            <Slider
              {...settings}
              className="font-medium leading-relaxed opacity-90 tracking-wide"
            >
              <div>
                <div className="review mx-auto">
                  <img
                    className="border rounded-circle bg-transparent mx-auto mb-4"
                    src={woman1}
                    style={{ height: '70px', width: '70px' }}
                  />
                  “Chase had a lot of fun. He actually said “it was fun” which
                  isn’t always the case (with private training). Coach is super
                  nice too”
                  <br />
                  <br />- Nicole Austin (Soccer)
                </div>
              </div>

              <div>
                <div className="review mx-auto">
                  <img
                    className="border rounded-circle bg-transparent mx-auto mb-4"
                    src={man1}
                    style={{ height: '70px', width: '70px' }}
                  />
                  “These athletes were amazing with the boys and my son loved
                  them. Everyone got a ton of one on one time and we will
                  definitely be going to all future events. Thank you!.”
                  <br />
                  <br />- Christopher Griessener (Football)
                </div>
              </div>

              <div>
                <div className="review mx-auto">
                  <img
                    className="border rounded-circle bg-transparent mx-auto mb-4"
                    src={woman2}
                    style={{ height: '70px', width: '70px' }}
                  />
                  “Seth was pumped up after his lesson today. He literally said
                  that was one of the best lessons..... He said he learned some
                  good pointers and techniques. He definitely wants to continue
                  working”
                  <br />
                  <br />- Kim A (Baseball)
                </div>
              </div>

              <div>
                <div className="review mx-auto">
                  <img
                    className="border rounded-circle bg-transparent mx-auto mb-4"
                    src={man2}
                    style={{ height: '70px', width: '70px' }}
                  />
                  “It was tremendous. He came prepared with stuff to start and
                  said he will build from there going forward to work on
                  weaknesses and continue to build the strengths. Very polite
                  and great job of communicating and or demonstrating things he
                  wanted him to do.”
                  <br />
                  <br />- William Harris (Baseball)
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
