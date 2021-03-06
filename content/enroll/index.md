+++
title = "Reskill Americans Enrollment Form"
date = 2021-12-15T12:30:03-08:00
draft = false
tags = []
layout = "document"

[[process]]
name = "form"
+++

{{% if-equal enroll false %}}

## Enrollment Information to come Soon

We have not yet set a firm date for our 2022 {{< term cohort >}}.  Please check this
website for updates.

{{% /if-equal %}}

{{% if-equal enroll true %}}

{{< sign-in >}}

{{< message-box >}}

We are currently accepting enrollment for the training period that starts in
March 2022.

Once you submit your enrollment form, you'll get an email from us that will
include access to our online learning platform.

## Eligibility Requirements:

- You must self-identify as a historically underrepresented minority.
- You must be eligible to work in the United States.

## Reskill Americans - 2022 Enrollment Form

We are now enrollments for our seven-month software development training
program.

<form id="enrollment-form">
<ol>

<li><label> State of Residence:
  <select name="state">
    <option value=""></option>
    {{< state-options >}}
  </select>
  </label>
</li>

<li>
  <fieldset><legend>Employment Status</legend>
    <label><input name="employed" type="radio" value="employed">Employed</label>
    <label><input name="employed" type="radio" value="unemployed">Unemployed</label>
  </fieldset>
</li>

<li>
  <fieldset><legend>Highest level of school completed</legend>
    <label><input name="education" type="radio" value="none">No diploma</label>
    <label><input name="education" type="radio" value="highschool">Highschool</label>
    <label><input name="education" type="radio" value="some-college">College - no degree</label>
    <label><input name="education" type="radio" value="technical">Trade/technical/vocational training</label>
    <label><input name="education" type="radio" value="associate">Associate Degree</label>
    <label><input name="education" type="radio" value="bachelors">Bachelor's Degree</label>
    <label><input name="education" type="radio" value="masters">Master's Degree</label>
    <label><input name="education" type="radio" value="post-graduate">Other post-graduate degree</label>
  </fieldset>
</li>

<li>
  <fieldset><legend>Work Authorization:</legend>
    <label><input name="workStatus" type="radio" value="allowed">I am legally authorized to work in the U.S.</label>
    <label><input name="workStatus" type="radio" value="not-allowed">I am not a U.S. citizen, and do not have a work visa</label>
  </fieldset>
</li>

<li>
  <fieldset><legend>Minority Representation - "I identify as ... "</legend>
    {{< minority-options >}}
    <p class="note">See our <a href="/faq/#minority" target="_blank">FAQ</a> for our definition of
      underrepresented minorities.</p>
  </fieldset>
</li>

<li>
  <fieldset><legend>Age group</legend>
    <label><input name="ageGroup" type="radio" value="16-17">16 - 17</label>
    <label><input name="ageGroup" type="radio" value="18-24">18 - 24</label>
    <label><input name="ageGroup" type="radio" value="25-34">25 - 34</label>
    <label><input name="ageGroup" type="radio" value="35-44">35 - 44</label>
    <label><input name="ageGroup" type="radio" value="45-above">45 - above</label>
    <label><input name="ageGroup" type="radio" value="unspecified">Prefer not to say</label>
  </fieldset>
</li>

<li>
  <fieldset><legend>Gender</legend>
    <label><input name="gender" type="radio" value="female">Woman</label>
    <label><input name="gender" type="radio" value="male">Man</label>
    <label><input name="gender" type="radio" value="non-binary">Non-binary</label>
    <label><input name="gender" type="radio" value="unspecified">Prefer not to say</label>
  </fieldset>
</li>

<li>
  <fieldset><legend>Which learning track are you considering joining?</legend>
    <label><input name="track" type="radio" value="full-stack">Full-Stack Web Development</label>
    <label><input name="track" type="radio" value="ui-ux">Product Design - UI/UX</label>
    <label><input name="track" type="radio" value="unsure">I'm unsure</label>
    <p class="note">Note: You may change tracks up until the third week of the program.</p>
  </fieldset>
</li>

<li>
  <fieldset><legend>How many hours per week are you able to commit to this program (dedicated to learning, doing assignments, and peer/instructor interaction) over the seven months you are enrolled?</legend>
    <label><input name="timeCommitment" type="radio" value="15">15 hours per week (minimum)</label>
    <label><input name="timeCommitment" type="radio" value="16-24">16 - 24 hours per week</label>
    <label><input name="timeCommitment" type="radio" value="25-40">25 - 40 hours per week</label>
  </fieldset>
</li>

</ol>

<input type="submit" class="signed-in" value="Submit">
<p class="form-error signed-out">You must sign in with LinkedIn to submit this form.</p>

</form>

{{% /if-equal %}}
