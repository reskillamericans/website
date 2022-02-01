+++
title = "Testimonial of {{ replace .Name "-" " " | title }}"
date = {{ .Date }}
draft = false

name = "{{ replace .Name "-" " " | title }}"
location = "City, State"

# Don't publish full size image
[_build]
publishResources = false
+++

<insert testimonial text here>
