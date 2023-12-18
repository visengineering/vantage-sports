import React from 'react';
import SimpleBar from 'simplebar-react';
import * as assets from '../../../assets';

const KeysToCoaching = () => {
  return (
    <>
      <section className="keys-banner-section">
        <div className="container">
          <div className="content">
            <div className="text-container">
              <h1 className="title-text">Coaching And Recruiting Advice</h1>
              <p className="text">
                An online marketplace where college athletes offer private
                coaching recruiting advice to aspiring college athletes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="consideration-section">
        <div className="container">
          <h2 className="title-text">
            5 Considerations for <br />{' '}
            <span>Private Coaching And Clinics</span>
          </h2>

          <SimpleBar className="pb-3">
            <div className="consideration-card-container">
              <div className="consideration-card">
                <div className="icon">
                  <img
                    src="./img/5-keys/basketball-hoop.svg"
                    alt="basketball-hoop"
                  />
                </div>

                <div className="card-title-text">Facility Rental</div>

                <p className="text">
                  Make sure to reserve a facility ahead of time, typically
                  public ﬁelds and courts can be reserved by calling a town
                  ofﬁcial, use of universities facilities varies by institution,
                  many prohibit the use of ﬁelds for NIL opportunities.
                </p>
              </div>

              <div className="consideration-card">
                <div className="icon">
                  <img src={assets.bmo} alt="icon" />
                </div>

                <div className="card-title-text">Registration And Payment</div>

                <p className="text">
                  You&lsquo;ll want to use some system to track sign-ups and
                  player information (age, position, etc) such as a google form.
                  If handling payments over venmo you may have to report each
                  client separately
                </p>
              </div>

              <div className="consideration-card">
                <div className="icon">
                  <img src={assets.healthInsurance} alt="icon" />
                </div>

                <div className="card-title-text">Waivers And Insurance</div>

                <p className="text">
                  Consider using waivers and a camp insurance policy to protect
                  yourself in the event of trainee injuries. Waivers can be
                  printed and signed on site. Only a legal expert (ie. an
                  attorney) should write your waiver
                </p>
              </div>

              <div className="consideration-card">
                <div className="icon">
                  <img src={assets.emailMarketing} alt="icon" />
                </div>

                <div className="card-title-text">Marketing Planning</div>

                <p className="text">
                  Make sure to reserve a facility ahead of time, typically
                  public ﬁelds and courts can be reserved by calling a town
                  ofﬁcial, use of universities facilities varies by institution,
                  many prohibit the use of ﬁelds for NIL opportunities.
                </p>
              </div>

              <div className="consideration-card">
                <div className="icon">
                  <img src={assets.whistleIcon} alt="icon" />
                </div>

                <div className="card-title-text">Itinerary</div>

                <p className="text">
                  You&lsquo;ll want to give at least a rough outline of what
                  clients can expect, videos and images of drills to help!
                </p>
              </div>
            </div>
          </SimpleBar>
        </div>
      </section>

      <section className="benefit-section">
        <div className="container">
          <div className="panel">
            <h2 className="title-text">Benefits Of Vantage Sports</h2>
          </div>

          <div className="benefit-card-container">
            <div className="benefit-card">
              <div className="icon">
                <img src={assets.marketplace} alt="icon" />
              </div>

              <h2 className="card-title-text">Marketplace</h2>

              <p className="text">
                Post your training session on our marketplace to more easily
                reach a target audience.
              </p>
            </div>

            <div className="benefit-card">
              <div className="icon">
                <img src={assets.reportIcon} alt="icon" />
              </div>

              <h2 className="card-title-text">Payment and reporting</h2>

              <p className="text">
                Easily collect payment through our platform, get paid before the
                session stars, and have our team handle NIL and tax reporting
                (1099).
              </p>
            </div>

            <div className="benefit-card">
              <div className="icon">
                <img src={assets.tapIcon} alt="icon" />
              </div>

              <h2 className="card-title-text">Ease of use</h2>

              <p className="text">
                Automatically get waivers and insurance coverage through use of
                our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-panel-section">
        <div className="container">
          <div className="info-panel">
            <p className="text">
              Sign Up Or Contact With Us With Details <br /> On What
              You&lsquo;re Looking To Set Up <br /> And Someone From Our Team
              Will Assist You
            </p>

            <div className="info-slot-container">
              <a href="mailto:info@vantagesports.com" className="info-slot">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33.894"
                    height="25.385"
                    viewBox="0 0 33.894 25.385"
                  >
                    <g transform="translate(-215.328 -2403.637)">
                      <path
                        d="M19.78,180.822a5.1,5.1,0,0,1-5.665,0L.226,171.562c-.077-.051-.152-.1-.226-.16v15.173a3.119,3.119,0,0,0,3.12,3.12H30.774a3.119,3.119,0,0,0,3.12-3.12V171.4c-.074.055-.149.109-.226.16Z"
                        transform="translate(215.328 2239.327)"
                        fill="#fff"
                      />
                      <path
                        d="M1.327,69.866l13.889,9.26a3.112,3.112,0,0,0,3.462,0l13.889-9.26a2.974,2.974,0,0,0,1.327-2.481,3.123,3.123,0,0,0-3.119-3.119H3.119A3.123,3.123,0,0,0,0,67.387a2.973,2.973,0,0,0,1.327,2.479Z"
                        transform="translate(215.328 2339.371)"
                        fill="#fff"
                      />
                    </g>
                  </svg>
                </div>
                <div className="lbl">info@vantagesports.com</div>
              </a>

              <a
                href="https://www.vantagesports.com"
                target="_blank"
                rel="noopener noreferrer"
                className="info-slot"
              >
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                  >
                    <path
                      d="M16,1A15,15,0,1,0,31,16,15,15,0,0,0,16,1Zm0,28c-2.065,0-4.227-2.662-5.3-7H21.3C20.227,26.338,18.065,29,16,29Zm-5.706-9a27.358,27.358,0,0,1,0-8H21.706A26.651,26.651,0,0,1,22,16a26.65,26.65,0,0,1-.294,4ZM3,16a12.94,12.94,0,0,1,.636-4h4.65a28.115,28.115,0,0,0,0,8H3.636A12.94,12.94,0,0,1,3,16ZM16,3c2.065,0,4.227,2.662,5.3,7H10.7C11.773,5.662,13.935,3,16,3Zm7.714,9h4.65a12.9,12.9,0,0,1,0,8h-4.65A28.352,28.352,0,0,0,24,16,28.351,28.351,0,0,0,23.714,12Zm3.807-2H23.354a16.766,16.766,0,0,0-2.567-6.075A13.063,13.063,0,0,1,27.521,10ZM11.213,3.925A16.766,16.766,0,0,0,8.646,10H4.479a13.063,13.063,0,0,1,6.734-6.075ZM4.479,22H8.646a16.766,16.766,0,0,0,2.567,6.075A13.063,13.063,0,0,1,4.479,22Zm16.308,6.075A16.766,16.766,0,0,0,23.354,22h4.167a13.063,13.063,0,0,1-6.734,6.075Z"
                      transform="translate(-1 -1)"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <div className="lbl">vantagesports.com</div>
              </a>

              <a href="tel:+19084105277" className="info-slot">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26.567"
                    height="26.567"
                    viewBox="0 0 26.567 26.567"
                  >
                    <path
                      d="M137.091,130.166a16.3,16.3,0,0,1-7.217-1.65,1.478,1.478,0,0,0-1.978.685l-1.063,2.2a20.784,20.784,0,0,1-7.666-7.666l2.2-1.063a1.478,1.478,0,0,0,.685-1.978,16.24,16.24,0,0,1-1.653-7.217A1.476,1.476,0,0,0,118.925,112h-5.449A1.476,1.476,0,0,0,112,113.476a25.119,25.119,0,0,0,25.091,25.091,1.476,1.476,0,0,0,1.476-1.476v-5.449A1.476,1.476,0,0,0,137.091,130.166Z"
                      transform="translate(-112 -112)"
                      fill="#fafafa"
                    />
                  </svg>
                </div>
                <div className="lbl">+1 908 410 5277</div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default KeysToCoaching;
