import React, { useState } from 'react';
import * as assets from '../../../assets';
import { scrollOnClick } from 'src/components/shared/utils/scroll-on-click';

const News = () => {
  const [active, setActive] = useState<string>('freshman');
  return (
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
                        scrollOnClick('about-author');
                        setActive('about-author');
                      }}
                      className={
                        active === 'about-author'
                          ? 'active-link'
                          : 'not-active-link'
                      }
                    >
                      ABOUT THE AUTHOR
                    </div>
                  </li>
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
            <div className="author-content" id="about-author">
              <div className="img-container">
                <img src={assets.author} alt="author-img" />
              </div>
              <h2 className="title">ABOUT THE AUTHOR</h2>
              <div className="text-content">
                <p className="text">
                  Elon Tuckman is currently a senior attackman for Gettysburg
                  College (NCAA D3) majoring in Sociology. Elon also has a
                  passion for Sports Marketing and in addition to being a
                  student-athlete, he also is a Marketing and Development Intern
                  at Vantage Sports. Vantage Sports is a marketplace that
                  connects college athletes with paid opportunities to coach and
                  mentors younger athletes.
                </p>
                <p className="text">
                  Elon also offers 1-on-1 consultation and advice about getting
                  recruited to play college lacrosse through the Vantage Sports
                  marketplace. If you are interested in receiving more
                  personalized 1-on-1 advice and consultation regarding the
                  recruiting process, you can book a session.
                </p>
              </div>
              <div className="btn-container">
                <a
                  href="https://www.vantagesports.com/coach/258"
                  className="btn"
                >
                  Book A Session With Elon
                </a>
              </div>
            </div>

            <div className="freshman" id="freshman">
              <h2 className="title">FRESHMAN YEAR</h2>
              <div className="freshman-content">
                <h3 className="subtitle">GET YOUR GRADES RIGHT!</h3>
                <p className="text">
                  The first and most important priority for your freshman year
                  of high school is to focus on Academics.
                </p>
                <p className="text">
                  Freshman-year grades are the first ones college coaches will
                  see when looking at a recruit. Set good study habits, stay on
                  top of your work, and make sure your grades reflect the best
                  work you could have possibly done.
                </p>
              </div>

              <div className="freshman-content">
                <h3 className="subtitle">HIT THE WEIGHTS!!</h3>
                <p className="text">
                  Spend time developing good habits in the weight room. If you
                  get into a solid routine in the initial days of your freshman
                  year, the adjustment to high school lacrosse will be much
                  easier.
                </p>
                <p className="text">
                  Talk to your trainer or older players on your teams about
                  routines you can do to maximize your time in the gym. Routines
                  can be set for three times a week spent in the weight room,
                  with the other two days either on the field or focused on
                  conditioning.
                </p>
              </div>

              <div className="freshman-content">
                <h3 className="subtitle">START TO COMPILE YOUR LIST</h3>
                <p className="text">
                  Compile a list of schools you are interested in. Make this
                  list as broad as possible. Include some schools that are
                  “maybes,” and then, later on, you can cut them off the list.
                </p>
              </div>

              <div className="freshman-content">
                <h3 className="subtitle">
                  <u>A Few Important Factors To Think About:</u>
                </h3>
                <ul>
                  <li>Large school vs. small school</li>
                  <li>Distance from home</li>
                  <li>Distance from home</li>
                  <li>Programs of study</li>
                </ul>
                <p className="text">
                  The list should have all divisions featured. If you feel like
                  you are a Division 1 Player, include 10–15 Division 1 schools,
                  5–10 Division 2 and Division 3 schools, and a couple of bigger
                  schools with club teams.
                </p>
                <p className="text">
                  If you feel like you are a Division 2 or Division 3 Player,
                  include 5 Division 1 schools, 5–10 Division 2 schools, 5–10
                  Division 3 schools, and 5–10 club programs.
                </p>
              </div>
            </div>

            <div className="freshman" id="summer-after-freshmen">
              <h2 className="title">SUMMER AFTER FRESHMEN YEAR</h2>
              <div className="freshman-content">
                <h3 className="subtitle">
                  COLLECT FOOTAGE FOR YOUR HIGHLIGHT VIDEO
                </h3>
                <p className="text">
                  After your spring season, if there is footage available
                  featuring your play, compile clips to create a short
                  highlights reel focusing on your best plays of the season. By
                  watching the film and pulling these plays, you should be able
                  to assess the level of your game following the spring season.
                </p>
                <p className="text">
                  Looking back on your spring season, pick out the best things
                  you do and the parts of your game that need the most
                  improvement.
                </p>
                <p className="text">For example:</p>
                <ul>
                  <li>
                    <b>Best at :</b> strong alley dodges, good in-tight
                    finisher, strong outside shot
                  </li>
                  <li>
                    <b> Needs improvement :</b> weak explosiveness out of
                    dodges, off-hand shoton the run, toughness, ground balls
                  </li>
                </ul>
              </div>

              <div className="freshman-content">
                <h3 className="subtitle">CHOOSE THE RIGHT SUMMER TEAM</h3>
                <p className="text">
                  Play for a summer team committed to assisting in the
                  development of your play. Talk to the directors and coaches to
                  ensure their goals have your best interests in mind.
                </p>
                <p className="text">
                  There is little to be done when connecting with college
                  coaches because of the new rules. Focus on improvement this
                  summer, spending time in the weight room when you can, and
                  practicing lacrosse on the field as much as possible.
                </p>
              </div>
            </div>

            <div className="freshman" id="sophomore">
              <h2 className="title">SOPHOMORE YEAR</h2>
              <div className="freshman-content">
                <h3 className="subtitle">NARROW DOWN YOUR LIST</h3>
                <p className="text">
                  Look deeper into the schools on the list you made. Reach out
                  to anyone you know at these schools; start thinking about what
                  you will major in and confirm whether these schools provide
                  it. This should help narrow down your list.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">ADD TO YOUR HIGHLIGHT VIDEO</h3>
                <p className="text">
                  After playing for your summer team, you should have a plethora
                  of films to watch. Go through each game and focus on your
                  play. Pick out the plays that showcase your best skills, and
                  compile these clips into a highlights video. While pulling out
                  these highlights, focus on the negative plays as well. Note
                  the little things that need improving in your game.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">
                  UP YOUR STRENGTH & CONDITIONING ROUTINE
                </h3>
                <p className="text">
                  With a year of high school lacrosse under your belt, you know
                  that sizematters. Now is the time to go to work in the weight
                  room.
                </p>
                <p className="text">
                  The biggest jump players make in high school is from freshman
                  to sophomore. Experience builds confidence, and the gains you
                  make in the weight room will start to show.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">PREP FOR THE ACT & SAT</h3>
                <p className="text">
                  Take a look at ACTs and SATs to determine which you’ll focus
                  on. Ask your school to provide practice ACTs and SATs to get a
                  feel for your preference.
                </p>
              </div>
            </div>

            <div className="freshman" id="sophomore-summer">
              <h2 className="title">SUMMER AFTER SOPHOMORE YEAR</h2>
              <div className="freshman-content">
                <h3 className="subtitle">GAIN GOOD SUMMER TEAM EXPOSURE</h3>
                <p className="text">
                  Following your spring season, summer is crucial, as college
                  coaches reach out following tournament completion on September
                  1. Make sure you are competing on a summer team that will get
                  good exposure at competitive tournaments.
                </p>
                <p className="text">
                  It is important you play on these teams—do not join a team
                  where you sit behind other players all summer not showcasing
                  your play.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">REQUEST A SKILL ASSESSMENT</h3>
                <p className="text">
                  Sit down with your high school coaches and have them assess
                  the status of your game. As you are halfway through your high
                  school career, your coach should be able to accurately assess
                  your game and the facets that need improvement.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">SEND INTRODUCTORY EMAIL TO COACHES</h3>
                <p className="text">
                  Following completion of the summer tournament circuit, you
                  should be able to cut down your list to schools you see
                  yourself at and those where you think you would enjoy
                  yourself.
                </p>
                <p className="text">This email should include the following:</p>
                <ul>
                  <li>Graduating year/Age</li>
                  <li>Hometown/High school</li>
                  <li>Contact information (cell number & email)</li>
                  <li>Coach information (high school and summer team)</li>
                  <li>GPA & test scores (if available)</li>
                  <li>Fall lacrosse schedule (high school and club team)</li>
                </ul>
              </div>
            </div>

            <div className="freshman" id="junior-year">
              <h2 className="title">JUNIOR YEAR</h2>
              <div className="freshman-content">
                <h3 className="subtitle">
                  SHARE YOUR FALL SCHEDULE WITH COLLEGE COACHES
                </h3>
                <p className="text">
                  Following September 1, coaches will initiate contact with
                  their top recruits, but you should also reach out to the
                  schools you are interested in. Discuss the schools at the top
                  of your list with your coaches; they may have contacts in
                  those schools.
                </p>
                <p className="text">
                  Write an introductory email featuring your fall schedule and
                  send it to every school on your list so coaches know where you
                  are playing. If coaches plan to attend the tournament or be in
                  the area, the chances of seeing you play are much higher if
                  they have your schedule.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">
                  GET YOUR STANDARDIZED TEST SCORES & GRADES UP
                </h3>
                <p className="text">
                  This fall is especially huge regarding test scores. If you are
                  trying to attain a score you haven’t achieved yet, get a tutor
                  and buckle down and study before that test date.
                </p>
                <p className="text">
                  Make sure you can separate yourself as a recruit with your
                  grades; don’t let grades get in the way of being recruited for
                  your play.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">STAY FOCUSED</h3>
                <p className="text">
                  DO NOT LET SOCIAL MEDIA DISTRACT YOU! Social media is
                  everywhere, and it is very hard to completely shut yourself
                  off from it.
                </p>
                <p className="text">
                  Many kids in your position will be posting about commitments,
                  write-ups, and other distractions that will divert you from
                  your path.
                </p>
                <p className="text">
                  Focus on yourself, and do not let others dictate your speed of
                  recruiting. You will find your perfect school at your own
                  speed.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">SCHEDULE UNOFFICIAL VISITS</h3>
                <p className="text">
                  Make unofficial visits to the schools on your list during
                  breaks or weekends. Take trips while classNamees are in
                  session and see what a normal day looks like on campus.
                </p>
              </div>
            </div>

            <div className="freshman" id="junior-summer">
              <h2 className="title">SUMMER AFTER JUNIOR YEAR</h2>
              <div className="freshman-content">
                <h3 className="subtitle">BE PROACTIVE IN CONTACTING COACHES</h3>
                <p className="text">
                  Following September 1, coaches will initiate contact with
                  their top recruits, but you should also reach out to the
                  schools you are interested in. Discuss the schools at the top
                  of your list with your coaches; they may have contacts in
                  those schools.
                </p>
                <p className="text">
                  Be aggressive and put yourself out there to every school. At
                  this point, there is nothing to hold back on. If you truly
                  want to play for a specific coach and school, it is your job
                  to reach out and make sure you are on their radar.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">CONTINUE TO IMPROVE YOUR GAME</h3>
                <p className="text">
                  Following your junior season, your coaches should be able to
                  pick out the parts of your game that may be not as developed
                  as you would like. Focus on these facets as well as your
                  continuing progress in the weight room and efforts to become
                  as big as possible.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">BECOME A LEADER ON YOUR TEAM</h3>
                <p className="text">
                  Take leadership roles for your spring teams and mentor some of
                  the younger guys who may need assistance.
                </p>
                <p className="text">
                  Help them in the weight room, organize captains’ practices,
                  and set strong examples for them.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">
                  ATTEND SCHOOL-SPECIFIC CAMPS/PROSPECT DAYS
                </h3>
                <p className="text">
                  If you have schools in mind, attend these specific camps
                  rather than broad camps with many coaches and players.
                </p>
              </div>
            </div>

            <div className="freshman" id="senior-year">
              <h2 className="title">SENIOR YEAR</h2>
              <div className="freshman-content">
                <h3 className="subtitle">STAY PERSISTENT</h3>
                <p className="text">
                  If you are still uncommitted, do not give up; schools often
                  have recruits drop out at the last second, and some people do
                  not get in. This is not the end. If you truly have a school
                  you want to go to, apply and talk to the coach about a
                  potential preferred walk-on or a tryout with the team.
                </p>
                <p className="text">
                  If you are still uncommitted, do not give up; schools often
                  have recruits drop out at the last second, and some people do
                  not get in. This is not the end. If you truly have a school
                  you want to go to, apply and talk to the coach about a
                  potential preferred walk-on or a tryout with the team.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">
                  COMPLETE YOUR COLLEGE APPLICATIONS EARLY
                </h3>
                <p className="text">
                  If you are committed to a school at this point, stay on top of
                  all your applications. Make sure your college essays,
                  supplements, and application requirements are done and
                  submitted way before the actual due date.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">CONTINUE TO DEMONSTRATE LEADERSHIP</h3>
                <p className="text">
                  Continue to set a good example on and off the field by doing
                  the right thing in the classNameroom and in society—others
                  will follow your lead at this point.
                </p>
              </div>
              <div className="freshman-content">
                <h3 className="subtitle">
                  BE SMART ON OVERNIGHT COLLEGE VISITS
                </h3>
                <p className="text">
                  Be smart with overnight visits! Being verbally committed to a
                  school does not guarantee you a spot. Being on a college
                  campus can be exciting, but be smart to ensure that you make
                  it there.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default News;
