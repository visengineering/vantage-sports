import React, { useState } from 'react';
import { scrollOnClick } from 'src/components/shared/utils/scroll-on-click';

const NewRecruitingGuide = () => {
  const [active, setActive] = useState<string>('freshman');
  return (
    <>
      <section className="author-section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 author">
              <div className="author-detail">
                <div className="sticky-top-container">
                  <ul className="author-list">
                    <li>
                      <div
                        onClick={() => {
                          scrollOnClick('freshman');
                          setActive('freshman');
                        }}
                        className={
                          active === 'freshman'
                            ? 'active-link'
                            : 'not-active-link'
                        }
                      >
                        FRESHMAN YEAR
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          scrollOnClick('summer-after-freshmen');
                          setActive('summer-after-freshmen');
                        }}
                        className={
                          active === 'summer-after-freshmen'
                            ? 'active-link'
                            : 'not-active-link'
                        }
                      >
                        SUMMER AFTER FRESHMEN YEAR
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          scrollOnClick('sophomore');
                          setActive('sophomore');
                        }}
                        className={
                          active === 'sophomore'
                            ? 'active-link'
                            : 'not-active-link'
                        }
                      >
                        SOPHOMORE YEAR
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          scrollOnClick('sophomore-summer');
                          setActive('sophomore-summer');
                        }}
                        className={
                          active === 'sophomore-summer'
                            ? 'active-link'
                            : 'not-active-link'
                        }
                      >
                        SUMMER AFTER SOPHOMORE YEAR
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          scrollOnClick('junior-year');
                          setActive('junior-year');
                        }}
                        className={
                          active === 'junior-year'
                            ? 'active-link'
                            : 'not-active-link'
                        }
                      >
                        JUNIOR YEAR
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          scrollOnClick('junior-summer');
                          setActive('junior-summer');
                        }}
                        className={
                          active === 'junior-summer'
                            ? 'active-link'
                            : 'not-active-link'
                        }
                      >
                        SUMMER AFTER JUNIOR YEAR
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          scrollOnClick('senior-year');
                          setActive('senior-year');
                        }}
                        className={
                          active === 'senior-year'
                            ? 'active-link'
                            : 'not-active-link'
                        }
                      >
                        SENIOR year
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-8 about-author">
              <div className="freshman" id="freshman">
                <h2 className="title pt-0">FRESHMAN YEAR</h2>
                <div className="freshman-content">
                  <h3 className="subtitle">Focus on grades</h3>
                  <ul>
                    <li>
                      As soccer players are one of the earliest sports to commit
                      to, college coaches tend to look at grades primarily from
                      freshman year to junior year when they are deciding to
                      offer prospective athletes.
                    </li>
                    <li>
                      Set good study habits, become organized, and create good
                      time management skills (as this will become more and more
                      important as school and soccer become more demanding)
                    </li>
                  </ul>
                </div>

                <div className="freshman-content">
                  <h3 className="subtitle">Focus on extra training</h3>

                  <p className="text">
                    Going to team soccer practice 3 to 4 times a week is not
                    enough to help you stand out from other players. Continue to
                    work on skills, speed/conditioning, and or strength outside
                    of team organized practices
                  </p>
                </div>

                <div className="freshman-content">
                  <h3 className="subtitle">
                    Try and get on a competitive club team (if possible ECNL)
                  </h3>
                  <ul>
                    <li>
                      Freshman year is the start of when college coaches begin
                      to look at players
                    </li>
                    <li>
                      Get on a team that plays in college showcases as you can
                      start exposing yourself to colleges
                    </li>
                    <li>
                      ECNL is the top league for Women’s Soccer right now and
                      the college showcases they put on are very well attended
                      by college coaches
                    </li>
                  </ul>
                </div>

                <div className="freshman-content">
                  <h3 className="subtitle">
                    Compile a list of prospective schools
                  </h3>
                  <ul>
                    <li>
                      Start to brainstorm and write down perspective schools
                      that you are interested in playing at
                    </li>
                    <li>
                      This list should be somewhat broad and have around 25-30
                      schools on it
                    </li>
                    <li>
                      Think of:
                      <ul className="roman">
                        <li>Size of school</li>
                        <li>Location</li>
                        <li>Conference</li>
                        <li>
                          Potential majors/minors of interest available at the
                          school
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="freshman" id="summer-after-freshmen">
                <h2 className="title">Summer after freshman year</h2>
                <div className="freshman-content">
                  <ul>
                    <li>
                      Use this time to get ahead and improve on all your
                      weaknesses
                    </li>
                    <li>
                      Create a list of areas you would like to improve on for
                      the next season
                    </li>
                    <li>
                      Set a plan before each workout of what you will do in the
                      session (this will allow you to stay on task and help you
                      better achieve your goals)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="freshman" id="sophomore">
                <h2 className="title">
                  Sophomore year (maybe one of the most important years)
                </h2>
                <div className="freshman-content">
                  <h3 className="subtitle">Continue to improve your grades</h3>
                  <p className="text">
                    Getting better grades can only help you in the recruiting
                    process
                  </p>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">Narrow down your list</h3>
                  <ul>
                    <li>
                      Start to narrow down your list that you made last year
                      into a more compelling list to you as it pertains to your
                      interests and skill set
                    </li>
                    <li>
                      Potentially narrow this list down to 15 schools
                      <ul className="roman">
                        <li>
                          Really focus the list of schools on the things that
                          matter most to you (ex: location, conference, academic
                          caliber, etc.)
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Email coaches when you will be at showcases
                  </h3>
                  <p className="text">
                    Email the coaches on your list the schedule of your games
                    (times and dates) so it is easy for them to create a
                    schedule
                  </p>
                  <p className="text mb-2">What to include in the email:</p>
                  <ul>
                    <li>
                      Personalize it (use coach’s names and mention the school
                      they coach at)
                    </li>
                    <li>
                      Include your name, the club you play for, your position,
                      GPA, and what year you are in school
                    </li>
                    <li>Say why you’re interested in the school</li>
                    <li>Attach the schedule of your games</li>
                    <li>Add your club coaches contact information</li>
                    <li>
                      <strong>CHECK OVER THE EMAIL</strong> (re-read your email
                      to make sure there are no mistakes of who it is going to,
                      the person you are addressing, and the school they work
                      for)
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Lean on your club coaches for recruiting help
                  </h3>
                  <ul>
                    <li>
                      At this time college coaches aren’t allowed to directly
                      contact players; therefore they go through your club
                      coaches
                    </li>
                    <li>
                      Usually college coaches send your club coaches emails of
                      interest that they will pass on to players and/or you can
                      tell your club coaches the colleges you are interested in
                      and they can relay it onto the college coaches
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">Attend college ID camps</h3>
                  <p className="text">
                    Attend a couple ID camps that you are interested in
                  </p>
                  <ul>
                    <li>
                      These will help you play in front of various college
                      coaches and see how they coach, potentially play with
                      current college players, and see the campus
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">Prep for ACT/ SAT</h3>
                  <ul>
                    <li>
                      Start to familiarize yourself with the ACT/SAT and
                      possible decide which you you will like to focus on
                    </li>
                    <li>
                      You will be starting this process earlier than your normal
                      non athlete peers; however, most likely ending it a lot
                      earlier than them as well
                    </li>
                  </ul>
                </div>
              </div>

              <div className="freshman" id="sophomore-summer">
                <h2 className="title">Summer After Sophomore year</h2>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Continue to work on your weaknesses outside of team training
                  </h3>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Continue prepping for the ACT/SAT
                  </h3>
                </div>

                <div className="freshman-content">
                  <h3 className="subtitle">
                    Starting June 15th after your sophomore year college coaches
                    can start to contact prospective athletes
                  </h3>
                  <ul>
                    <li>
                      Keep your options open when college coaches reach out
                    </li>
                    <li>
                      It’s better to have a lot of schools to choose from than
                      to hold out on two that may never come around
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Starting August 1st athletes and college coaches can start
                    planning on campus unofficial/official visits
                  </h3>
                </div>
                <p>
                  <strong> **Enjoy the process.</strong> Sophomore and Junior
                  Year can be very stressful, but also rewarding at the same
                  time. Just stay focused on soccer and everything else will
                  fall into place.
                </p>
              </div>

              <div className="freshman" id="junior-year">
                <h2 className="title">Junior Year</h2>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Continue to do more away from your team as well as bring up
                    the intensity during team practices
                  </h3>
                  <ul>
                    <li>A winning team is more desirable to college coaches</li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Narrow your list to 6 or so schools
                  </h3>
                  <p className="text mb-2">Things to think about:</p>
                  <ul>
                    <li>Conference</li>
                    <li>
                      How much does the coaches see you playing (impact player
                      right away or will you have to wait your turn to play)
                    </li>
                    <li>Roster size</li>
                    <li>How many years left are on the coach’s contract</li>
                    <li>major/minor availability at the school</li>
                    <li>How many people are in your position</li>
                    <li>What position to the coaches see you at</li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Continue the conversation between player and college coach
                    over the phone
                  </h3>
                  <p className="text">Ask all of your questions</p>
                  <ul>
                    <li>
                      This will help you make a better decision while also
                      showing a lot of interest to the school and program
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Take the unofficial/official visits to your top schools
                  </h3>
                  <ul>
                    <li>
                      See if you fit into the school and if you can see yourself
                      there
                    </li>
                    <li>
                      If possible try to stay with the team for the night and/or
                      spend time with them during the visit so you can ask them
                      various questions you didn’t want to ask the coach.
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Take the ACT/SAT and send to coaches
                  </h3>
                  <ul>
                    <li>
                      Do your best in these tests and then send to the coaches
                      as some schools may say your score is good enough and
                      others may tell you to get a few more points
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Weigh your offers and take your time when deciding where to
                    commit as this is a big decision
                  </h3>
                  <ul>
                    <li>
                      Lean on your club coaches, teammates and family when
                      making this decision
                    </li>
                    <li>
                      Make a list of pros and cons of each school and go from
                      there
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Commit to the school of your choice!!!
                  </h3>
                  <ul>
                    <li>This will make the whole process so rewarding</li>
                  </ul>
                </div>
                <p>
                  <strong> **Enjoy the process.</strong> Remember your #1 school
                  may not have worked out, but don’t get stressed or worked up
                  as there are a ton of other schools that can feel like home
                  and be just as or more amazing.
                </p>
              </div>

              <div className="freshman" id="junior-summer">
                <h2 className="title">Summer after Junior Year</h2>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    If you <strong>haven’t committed</strong> yet
                  </h3>
                  <ul>
                    <li>Don’t stress, don’t give up your time will come</li>
                    <li>Continue visiting schools and talking to coaches</li>
                    <li>
                      Continue to work harder than everyone else and get your
                      skills better
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    If you <strong>have committed</strong>
                  </h3>
                  <ul>
                    <li>
                      Continue the dialogue between you and your future college
                      coaches
                    </li>
                    <li>
                      Ask your club coaches/college coaches something you should
                      work on during the summer
                    </li>
                    <li>
                      Continue to increase your fitness, strength, and skills
                    </li>
                  </ul>
                </div>
              </div>

              <div className="freshman" id="senior-year">
                <h2 className="title">Senior Year</h2>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Complete your college applications early
                  </h3>
                  <p className="text">
                    Most schools will want you to apply early to make sure
                    everything is done including essays, application, etc.
                  </p>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">Stay on top of your grades</h3>
                  <p className="text">
                    Remember college coaches still have the chance to take back
                    a scholarship so make sure to keep your grades up
                  </p>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle ">
                    Continue to strive on the field or in the gym
                  </h3>
                  <ul>
                    <li>
                      Remember in a couple months you will be playing against
                      people that could be four years older than you. Therefore,
                      it is important you are as strong and as fast as you
                      possibly can be
                      <ul className="roman">
                        <li>
                          **the college game is a lot faster and more physical
                          than you may think
                        </li>
                      </ul>
                    </li>

                    <li>
                      Give yourself the best chance to come into college
                      prepared
                    </li>
                  </ul>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">
                    Continue the conversation with your college coaches
                  </h3>

                  <p className="text">
                    It is important to start to get comfortable with your
                    coaches as you will see them/interact with them almost
                    everyday in a couple months
                  </p>
                </div>
                <div className="freshman-content">
                  <h3 className="subtitle">Sign your NIL</h3>
                  <ul>
                    <li>
                      Enjoy this day as you have worked so hard to get here
                    </li>
                    <li>
                      Not everyone gets to experience this as it is an
                      indication of your athletic ability and determination to
                      soccer
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewRecruitingGuide;
