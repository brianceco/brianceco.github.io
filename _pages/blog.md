---
layout: default
permalink: /blog/
title: blog
nav: true
nav_order: 1
---

<div class="post">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}
  <div class="header-bar">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>
{% endif %}

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}

<div class="archive">
  {% for year_group in posts_by_year %}
    <h2 class="archive-year">{{ year_group.name }}</h2>
    <ul class="archive-list">
      {% for post in year_group.items %}
        {% if post.external_source == blank %}
          {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
        {% else %}
          {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
        {% endif %}
        <li class="archive-item">
          <span class="archive-date">{{ post.date | date: "%b %d" }}</span>
          <span class="archive-title">
            {% if post.redirect == blank %}
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            {% elsif post.redirect contains '://' %}
              <a href="{{ post.redirect }}" target="_blank">{{ post.title }}</a>
            {% else %}
              <a href="{{ post.redirect | relative_url }}">{{ post.title }}</a>
            {% endif %}
          </span>
          <span class="archive-meta">{{ read_time }} min read</span>
        </li>
      {% endfor %}
    </ul>
  {% endfor %}
</div>

</div>