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

Thank you for your interest in volunteering with Reskill Americans.  We are
looking for volunteer mentors to meet regularly with our participants during the
course of our seven-month training program.

We seek volunteers that have technical expertise in product design and/or full
stack web development. Whether you are an industry veteran, or someone who has
just completed a boot camp yourself, we could use your help!

We are asking for a minimum commitment of two hours per week, over a period of
at least two months.  During that time, you will be paired with participants
learning a track that's aligned to your skill set.

Please answer the survey below to get started.  We can then match you with the
most appropriate group.

<form id="volunteer-form">
<ol>

<li><label> State of Residence:
  <select name="state">
    <option value=""></option>
    {{< state-options >}}
  </select>
  </label>
</li>

<li>
  <label>Organization:<input name="org" type="text">
  </label>
  <p class="note">Note: Enter "self" if unaffiliated.</p>
</li>

<li>
  <fieldset><legend>Years of work experience in software development or design:</legend>
    <label><input name="work-exp" type="radio" value="0">0</label>
    <label><input name="work-exp" type="radio" value="1-3">1 - 3</label>
    <label><input name="work-exp" type="radio" value="4 - 9">4 - 9</label>
    <label><input name="work-exp" type="radio" value="10-above">10 or more</label>
  </fieldset>
</li>

<li>
  <fieldset><legend>Do you self-identify as a historically underrepresented minority?</legend>
    <label><input name="minority" type="radio" value="none">Non-minority</label>
    {{< minority-options >}}
    <p class="note">Note: We <b>do not</b> require that our volunteers identify as underrepresented
      minorities.</p>
    <p class="note">See our <a href="/faq/#minority" target="_blank">FAQ</a> for our definition of
      underrepresented minorities.</p>
  </fieldset>
</li>

<li>
  <fieldset><legend>What are the technologies or topics in which you can help participants?</legend>
    <p class="note top">Select all that apply.</p>
    <label><input name="topics" type="checkbox" value="html-css">HTML/CSS</label>
    <label><input name="topics" type="checkbox" value="javascript">JavaScript</label>
    <label><input name="topics" type="checkbox" value="typescript">TypeScript</label>
    <label><input name="topics" type="checkbox" value="design">UI/UX and Design</label>
    <label><input name="topics" type="checkbox" value="programming">Basic programming concepts</label>
    <label><input name="topics" type="checkbox" value="algorithms">Algorithms and Data Structures</label>
    <label><input name="topics" type="checkbox" value="command-line">Use of Command Line (Terminal)</label>
    <label><input name="topics" type="checkbox" value="git">Git and GitHub</label>
    <label><input name="topics" type="checkbox" value="vscode">VSCode</label>
    <label><input name="topics" type="checkbox" value="figma">Figma</label>
    <label><input name="topics" type="checkbox" value="node">Node.js (server-side JavaScript)</label>
    <label><input name="topics" type="checkbox" value="cloud">Cloud (AWS, Google, or Azure)</label>
    <label><input name="topics" type="checkbox" value="career">General Career Advice</label>
    <label><input name="topics" type="checkbox" value="other">Other:</label>
       <input class="other" name="topics-other" type="text">
  </fieldset>
</li>

<li>
  <fieldset><legend>In which ways would you be available to volunteer?</legend>
    <label><input name="activity" type="checkbox" value="chat">Answer questions posted online in Slack/Discord.</label>
    <label><input name="activity" type="checkbox" value="TA">Serve as primary TA for a group of 15 participants - weekly meetings.</label>
    <label><input name="activity" type="checkbox" value="TA-assistant">Act as a TA assistant for a group of 15 participants.</label>
    <label><input name="activity" type="checkbox" value="mentor">Match 1:1 with participants and be available via email/chat.</label>
    <label><input name="activity" type="checkbox" value="office-hours">Hold Zoom office hours to work with participants live.</label>
    <label><input name="activity" type="checkbox" value="interview">Practice (simulated) interview training.</label>
    <label><input name="activity" type="checkbox" value="town-hall">Appear in a 1-hour Town Hall live-stream</label>
    <label><input name="activity" type="checkbox" value="job-fair">Appear in a 1-hour Job Fair live-stream for participants to hear about job opportunities in my organization.</label>
    <label><input name="activity" type="checkbox" value="other">Other:</label>
       <input class="other" name="activity-other" type="text">
  </fieldset>
</li>

<li>
  <fieldset><legend>If you are willing to be identified in our volunteer directory
    (distributed to participants)</legend>
    <textarea data-optional="true" name="bio" placeholder="Please tell as about yourself..." rows="4"></textarea>
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
