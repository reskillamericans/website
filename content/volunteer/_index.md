+++
title = "Reskill Americans Volunteer Application"
date = 2021-12-15T12:15:42-08:00
draft = false
tags = []
layout = "document"

[[process]]
name = "form"
+++

{{< sign-in >}}

{{< message-box >}}

Thank you for your interest in volunteering with Reskill Americans. Whether you are an industry veteran or someone who has just completed a boot camp yourself, we would love your help! We seek volunteer mentors with technical expertise in UI/UX product design or full stack web development in the following areas:

<b>Mentor a Participant:</b>
 Share your technical expertise and experience to mentor our participants throughout our seven-month training program.
Time commitment: 1- 2 hours per week for 7 months
Timeframe: Starting in Fall 2022
We seek volunteers that have technical expertise in product design and/or full
stack web development. Whether you are an industry veteran, or someone who has
just completed a boot camp yourself, we could use your help!

<b>Mentor a Graduate:</b> Share your technical expertise and experience to mentor our graduates as they navigate the job search.
Time commitment: 1-2 hours per week.
Timeframe: Immediately/Ongoing

Please complete this Volunteer Application and we will be in touch shortly. Thank you so much for your interest in helping increase access to careers in tech!

<form id="volunteer-form">
<ol>

<li><label> U.S. Residence:
  <select name="state">
    <option value=""></option>
    {{< state-options >}}
  </select>
  </label>
</li>

<li>
  <label>Company/Organization:<input name="org" type="text">
  </label>
  <p class="note">Note:  Enter "self" if unaffiliated with a company or organization.</p>
</li>

<li>
  <label>Title/Department (Ex. Product Designer, AI Team):<input name="dept" type="text">
  </label>
 
</li>
<li>
  <label>If you're currently a student, please list your school and your area of study:<input name="dept" type="text">
  </label>
 
</li>

<li>
  <fieldset><legend>Have you ever been convicted of any criminal offense other than a minor traffic violation?</legend>
    <label><input name="yes" type="radio" value="yes">Yes</label>
    <label><input name="no" type="radio" value="no">No</label>
   
  </fieldset>
</li>
<li>
  <fieldset><legend>Years of work experience:</legend>
    <label><input name="work-exp" type="radio" value="0">0</label>
    <label><input name="work-exp" type="radio" value="1-3">1 - 3</label>
    <label><input name="work-exp" type="radio" value="4 - 9">4 - 9</label>
    <label><input name="work-exp" type="radio" value="10-above">10 or more</label>
  </fieldset>
</li>

<li>
  <fieldset><legend>Which area of experience do you want to share your knowledge of? (Please check all that apply):</legend>
    <label><input name="topics" type="checkbox" value="software-development">Software development</label>
    <label><input name="topics" type="checkbox" value="design">Product design (UX/UI)</label>
    <label><input name="topics" type="checkbox" value="project-management">Project management</label>
    <label><input name="topics" type="checkbox" value="data-science">Data science</label>
 

  </fieldset>
</li>

<li>
  <fieldset><legend>In which ways would you like to volunteer? (Please check all that apply)</legend>
    <label><input name="activity" type="checkbox" value="one-on-one">Be matched with a participant to mentor them one-on-one throughout the program (1-2 hours per week for 7 months).</label>
    <label><input name="activity" type="checkbox" value="chat">Answer questions that participants post online in Slack (at your convenience, a minimum of 1 hour per week).</label>
    <label><input name="activity" type="checkbox" value="TA-assistant">Act as a TA assistant for a group of 15 participants (1 hour weekly meeting).</label>
    <label><input name="activity" type="checkbox" value="mentor">Be matched with a graduate to mentor them on-on-one as they navigate the job search</label>
    <label><input name="activity" type="checkbox" value="interview-support">Provide interview support: provide mock interviews, feedback and/or other interview tips.</label>
    <label><input name="activity" type="checkbox" value="resume-review">Offer resume review, feedback and suggestions.</label>
    <label><input name="activity" type="checkbox" value="portfolio-review">Portfolio review, feedback and suggestions.</label>
    <label><input name="activity" type="checkbox" value="job-fair">General mentorship: offer encouragement, support and advice to help inspire graduates as they look for jobs.</label>
    <label><input name="activity" type="checkbox" value="guest">Be a guest speaker in one of our Town Halls: share your work experience, career advice and inspiring tips via a recorded livestream with our participants via a recorded livestream.</label>
  </fieldset>
</li>
<li>
  <fieldset><legend>Please indicate which tech platform you prefer. (Note, we prefer that when volunteers first meet our graduates they use a video chat, but after that they can communicate via text/email/channel of their choice).</legend>
    <label><input name="minority" type="radio" value="zoom">Zoom</label>
    <label><input name="minority" type="radio" value="meet">Google meet</label>
    <label><input name="minority" type="radio" value="microsoft">Microsoft Teams</label>
    <label><input name="minority" type="radio" value="other">Other:</label>
           <input class="other" name="minority-other" type="text">

  </fieldset>
</li>
<li>
  <fieldset><legend>Please share anything else about yourself that you’d like us and our participants/graduates to know in order to best match you:</legend>
    <textarea data-optional="true" name="bio"  rows="4"></textarea>
  </fieldset>
</li>

<li>
  <fieldset><legend>Do you self-identify as a historically underrepresented minority?
(Note: We do not require that our volunteers identify as underrepresented minorities.)</legend>
  <p class="note">Note: We <b>do not</b> require that our volunteers identify as underrepresented
      minorities.</p>
    <label><input name="minority" type="radio" value="none">Non-minority</label>
    {{< minority-options >}}
    <p class="note">See our <a href="/faq/#minority" target="_blank">FAQ</a> for our definition of
      underrepresented minorities.</p>
  </fieldset>
</li>

<li>
  <fieldset><legend>Please type your full name here to accept the terms of our
    <a href="/volunteer/agreement" target="_blank">Volunteer Participation Agreement</a>.
    </legend>
    <input name="accept-terms" type="text" placeholder="Your Name">
  </fieldset>
</li>
</ol>


<input type="submit" class="signed-in" value="Submit">
<p class="form-error signed-out">You must sign in with LinkedIn to submit this form.</p>

</form>
