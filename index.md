---
layout: post
title: "The Internet. By Cats. For Cats."
permalink: /
---

# The Internet. Made by Cats for Cats.

<video id="catVideo" loop autoplay muted playsinline style="max-width: 400px; width: 100%; height: auto;">
  <source src="/assets/video/cat3.3.mp4" type="video/mp4">
</video>

<div style="margin-top: 10px;">
  <label for="speedSlider">Speed: <span id="speedValue">4.25</span>x</label><br>
  <input type="range" id="speedSlider" min="0.25" max="10" step="0.25" value="4.25" style="width: 200px;">
</div>

<script>
  const video = document.getElementById('catVideo');
  const slider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');
  video.playbackRate = slider.value;
  slider.addEventListener('input', function() {
    video.playbackRate = this.value;
    speedValue.textContent = this.value;
  });
</script>

[Contents](/contents/)

[About me](/about/)