"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show submit story form on click on "submit story" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  submitStory();
  $submitStoryForm.show();
}

$navSubmit.on("click", navSubmitClick);

function navFavClick(evt) {
  console.debug("navFavClick", evt);
  hidePageComponents();
  putFavStoriesOnPage();
}

$navFavs.on("click", navFavClick);

function myStoriesClick(evt) {
  console.debug("myStoriesClick");
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$navMyStories.on("click", myStoriesClick);
