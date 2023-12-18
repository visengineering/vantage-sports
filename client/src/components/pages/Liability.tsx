import React, { useContext } from 'react';
import { MainContext } from '../../contexts/MainContext';

const Liability = () => {
  const { userName } = useContext(MainContext);
  return (
    <main>
      <section className="hero-panel-section">
        <div className="container">
          <div className="panel-section">
            <h1 className="title">Liability Waiver</h1>
            <p className="sub-title">Last Updated: July 16, 2021</p>
          </div>
        </div>
      </section>
      <section className="term-service-section">
        <div className="container">
          <div className="content-block">
            <div className="block">
              <span className="lbl">Vantage Service Details:</span> Vantage
              Sports is the marketplace that connects aspiring college athletes
              to high-caliber college players and alumni. The Vantage Sports
              platform will allow college athletes to instruct aspiring college
              athletes through the form of 1-on-1 instruction, small-group
              training, clinics, film and virtual instruction, or through a
              general 1-on-1 Zoom to get advice or ask questions (collectively
              the “Services”).
              <hr />
              I, <span style={{ fontWeight: 'bold' }}>{userName}</span> the
              undersigned Parent or Legal Guardian (“Guardian”) acknowledge that
              I have agreed and consent to the above-named participant
              (“Participant”) participating in the Services as described in the
              above-referenced Services.
            </div>

            <div className="block">
              ON BEHALF OF PARTICIPANT, I UNDERSTAND THAT PARTICIPANT’S
              PARTICIPATION IN THE SERVICES IS VOLUNTARY. I RECOGNIZE THAT
              PARTICIPATION IN THE SERVICES BY PARTICIPANT HAS INHERENT RISKS OF
              INJURY TO PARTICIPANT OR PROPERTY AMONG OTHER RISKS EITHER NOT
              KNOWN TO ME AND/OR PARTICIPANT OR READILY FORSEEABLE AT THIS TIME,
              WHILE PARTICIPATING IN THE SERVICES OR RELATED ACTIVITIES, AND
              AGREE TO ACCEPT AND ASSUME ANY AND ALL RISKS ASSOCIATED WITH
              PARTICIPATION IN THE SERVICES. For and in consideration of the
              opportunity to attend and participate in the Services, the
              Guardian, on behalf of himself or herself and on behalf of
              Participant, any spouse, personal representatives, insurers,
              heirs, successors or assigns, hereby fully and finally RELEASES,
              ACQUITS and FOREVER DISCHARGES Vantage Sports Co. (“Vantage”) and
              its respective shareholders, partners, officers, directors,
              employees, contractors, agents, representatives, parent companies,
              subsidiaries, divisions, affiliates, sponsors, insurers,
              predecessors, successors and assigns (hereafter, collectively the
              “Released Parties”) of and from any and all claims, demands,
              actions, causes of action, suits, costs, losses, injuries,
              damages, expenses and liability arising out of, related to or in
              any way connected with, directly or indirectly, the Participant’s
              attendance at or participation in the Services and related
              activities, even if caused by the Released Parties’ ordinary
              negligence whenever, wherever and however the same may occur (such
              released claims and other matters listed above to be referred to
              as the “Covered Claims”). The Guardian, on behalf of
              himself/herself and Participant, further agrees that if, despite
              this Release and Consent, he or she, or anyone on his or her
              behalf, brings a Covered Claim against the Released Parties, he or
              she will indemnify, save and hold harmless each Released Party
              from any loss, liability, damage, or cost which it may incur as a
              result of such Covered Claim, including all attorneys’ fees
              incurred by any Released Party defending against the same. The
              Guardian, on behalf of Participant, (i) represents that he or she
              is over the age of 18 years, (ii) represents that he or she is
              capable of reading and understanding the written English language
              and that prior to signing below, he or she has read and
              understands this Release and Consent, (iii) represents that
              Participant is able to safely participate in the Services and am
              solely responsible for Participant’s evaluation and maintenance of
              Participant’s health, including any pre- existing injuries, (iv)
              understands that participation in such Services involves the risk
              of injuries, and (v) understands and agrees that if Participant
              participates in the Services, Guardian, on behalf of Participant,
              will be solely responsible for any and all physical injury,
              illness, death or disability that Participant sustains as a result
              of participation in or attendance at such Services and that none
              of the Released Parties shall have any responsibility or liability
              for any such injury. THE GUARDIAN FURTHER REPRESENTS AND CONFIRMS
              PARTICIPATION IN THE SERVICES INVOLVES THE RISK TO HAVE DIRECT OR
              INDIRECT CONTACT WITH INDIVIDUALS WHO HAVE BEEN EXPOSED TO AND/OR
              DIAGNOSED WITH ONE OR MORE COMMUNICABLE DISEASES, INCLUDING BUT
              NOT LIMITED TO COVID-19 AND IT IS IMPOSSIBLE TO ELIMINATE THE RISK
              THAT THE PARTICIPANT COULD BECOME INFECTED THROUGH CONTACT WITH OR
              CLOSE PROXIMITY TO AN INDIVIDUAL WITH A COMMUNICABLE DISEASE. The
              Guardian, on behalf of Participant, hereby consents that in
              connection with the Services, the Participant may be photographed,
              videotaped and/or recorded and that such photography, videotaping
              and recording, as well as the Participant’s name, may be used for
              the reasonable business purposes of Vantage in any and all media
              formats, including, without limitation, television, radio, and
              digital media formats, including the Internet, without the payment
              of any consideration. The Guardian, for and in consideration of
              the opportunity for Participant to participate in the Services,
              hereby consents to allow Vantage to use Guardian’s personal data
              for the limited purposes of contacting Participant to communicate
              information and promotional materials to Participant, and to
              provide Participant’s personal data to third-party partners for
              commercial or solicitation purposes. The personal information will
              be collected, processed and used in accordance with Vantage’s
              Privacy Policy, which can be found at
              https://www.vantagesports.com/ADD. This Release and Consent shall
              be governed by the laws of the State of Florida, without regard to
              applicable conflicts of law provisions or the principles of
              comity. This Release and Consent may be electronically signed, and
              any electronic signatures appearing on this Release and Consent
              are the same as handwritten signatures for the purposes of
              validity, enforceability and admissibility. The undersigned
              Participant expressly waives any and all rights or benefits that
              he or she may now have, or in the future may have as to the
              Released Claims. This Release and Consent is intended to cover all
              claims in connection with and/or arising out of the undersigned
              Participant’s participation in the Services. Should any claims be
              deemed not to be covered by this Release and Consent, the
              Guardian, on behalf of himself/herself and Particpant, agrees that
              all legal claims Guardian and/or Participant wishes to pursue
              against the Released Parties, including any dispute over the terms
              or coverage of this Release and Consent, shall be brought on an
              individual basis only and through confidential, final and binding
              arbitration before a private and impartial arbitrator (conducted
              in accordance with current AAA Arbitration Rules &amp;
              Procedures), and the Guardian, on behalf of himself/herself and/or
              Participant, hereby waives his or her right to commence, or be a
              party to, any class or collective claims or to bring jointly with
              any other person any claim against the Released Parties. I, THE
              UNDERSIGNED GUARDIAN, HAVE CAREFULLY READ THIS AGREEMENT AND FULLY
              UNDERSTAND ITS CONTENTS. I AM AWARE THAT THIS IS A RELEASE OF
              LIABILITY CONTRACT BETWEEN MYSELF AND THE RELEASED PARTIES AND
              SIGN IT AT MY OWN FREE WILL.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Liability;
