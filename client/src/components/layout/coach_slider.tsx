import React, { Component } from 'react';
import Slider from 'react-slick';
import allyMuraskin from '../../assets/landingpage/optimized/ally-muraskin.jpeg';
import arrowLeft from '../../assets/landingpage/arrow-left.svg';
import arrowRight from '../../assets/landingpage/arrow-right.svg';
import brandenWilson from '../../assets/landingpage/optimized/branden_wilson.jpeg';
import chyanne from '../../assets/landingpage/optimized/chyanne.jpeg';
import cliffordTaylor from '../../assets/landingpage/optimized/clifford_taylor.jpeg';
import colbyHalter from '../../assets/landingpage/optimized/colby_halter.jpeg';
import emelieCurtis from '../../assets/landingpage/optimized/emelie_curtis.jpeg';
import jaredDickey from '../../assets/landingpage/optimized/jared.jpeg';
import jordanTamu from '../../assets/landingpage/optimized/jordan_tamu.jpeg';
import maddyManahan from '../../assets/landingpage/optimized/maddy_manahan.jpeg';
import benVanCleve from '../../assets/landingpage/optimized/van-cleve.jpeg';
import yosefNgowe from '../../assets/landingpage/optimized/yosef_ngowe.jpeg';

export default class CoachSlider extends Component {
  constructor(props: any) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  next() {
    (this as any).slider.slickNext();
  }
  previous() {
    (this as any).slider.slickPrev();
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 3000,

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    };

    return (
      <section className="container glide glide-coach pb-3">
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <div className="d-flex justify-content-between items-center">
          <h2 className="bolder mb-3">
            <strong>Popular coaches</strong>
          </h2>
          <div className="d-flex align-items-center space-x-4">
            <a href="/coaches" className="mr-3 text-primary">
              See all
            </a>
            <div className="">
              <img
                className="mr-1 slider-btn rounded-circle"
                onClick={this.previous}
                src={arrowLeft}
              />
              <img
                className="ml-1 slider-btn rounded-circle"
                onClick={this.next}
                src={arrowRight}
              />
            </div>
          </div>
        </div>
        <Slider
          ref={(c) => ((this as any).slider = c)}
          {...settings}
          className="mt-6"
        >
          <div>
            <div className="bg-image hover-zoom">
              <img
                className="rounded-lg slider-img"
                src={jaredDickey}
                style={{ objectPosition: '50% 0' }}
                alt="Jared Dickey"
                height="260"
              />
            </div>
            <div className="fw-bolder">
              <h6 className="mt-3">Jared Dickey</h6>
              <p className="m-0 p-0">University Of Tennessee</p>
              <p>Baseball</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={chyanne}
              alt="Chyanne Dennis"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Chyanne Dennis</h6>
              <p className="m-0 p-0">University of South Florida</p>
              <p className=" ">Women&apos;s Soccer</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={jordanTamu}
              alt="Jordan Ta'amu"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Jordan Ta&apos;amu</h6>
              <p className="m-0 p-0">Ole Miss</p>
              <p className=" ">Football</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={yosefNgowe}
              alt="Yosef Ngowe"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Yosef Ngowe</h6>
              <p className="m-0 p-0">Mercer University</p>
              <p className=" ">Lacrosse</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              style={{ objectPosition: '20% 0' }}
              src={benVanCleve}
              alt="Ben Van Cleve"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Ben Van Cleve</h6>
              <p className="m-0 p-0">Ole Miss</p>
              <p className=" ">Baseball</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={allyMuraskin}
              alt="Ally Muraskin"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Ally Muraskin</h6>
              <p className="m-0 p-0">University of Pittsburg</p>
              <p className=" ">Softball</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={emelieCurtis}
              alt="Emelie Curtis"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Emelie Curtis</h6>
              <p className="m-0 p-0">Duquesne University</p>
              <p className=" ">Women&apos;s Lacrosse</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={maddyManahan}
              alt="Maddy Manahan"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Maddy Manahan</h6>
              <p className="m-0 p-0">Boston College</p>
              <p className=" ">Women&apos;s Lacrosse</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={colbyHalter}
              alt="Colby Halter"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Colby Halter</h6>
              <p className="m-0 p-0">University of Florida</p>
              <p className=" ">Baseball</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={brandenWilson}
              alt="Branden Wilson"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Branden Wilson</h6>
              <p className="m-0 p-0">University of Utah</p>
              <p className=" ">Dodging</p>
            </div>
          </div>

          <div>
            <img
              className="rounded-lg slider-img"
              src={cliffordTaylor}
              alt="Clifford Taylor IV"
              height="260"
            />
            <div className="fw-bolder">
              <h6 className="mt-3">Clifford Taylor IV</h6>
              <p className="m-0 p-0">University of Florida</p>
              <p className=" ">Football</p>
            </div>
          </div>
        </Slider>
      </section>
    );
  }
}
