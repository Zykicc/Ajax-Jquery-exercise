"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  //&#9734;
  //&#9733;
  const foundStory = currentUser.favorites.find(
    (fav) => fav.storyId === story.storyId
  );
  let star = "☆";

  if (foundStory) {
    star = "★";
  } else {
    star = "☆";
  }

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      <span id="starIcon" class="star">${star}</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
       
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make delete button HTML for story */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
// shows only favourited stories
function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our favourite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

//shows users own stories
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by you yet</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

async function submitStory(evt) {
  evt.preventDefault();
  const title = $("#submit-story-title").val();
  const author = $("#submit-story-author").val();
  const url = $("#submit-story-url").val();

  storyList.addStory(currentUser, { title, author, url });

  // navAllStories(evt);
  putStoriesOnPage();
  location.reload();
}

$("#submitStoryBtn").on("click", submitStory);

async function starClick(evt) {
  evt.preventDefault();

  /*
    &#9734 -> empty star
    &#9733 -> filled star
  */
  const filledStar = "★";
  const emptyStar = "☆";
  const $tgt = $(evt.target);

  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  //console.log($tgt.html() === emptyStar);
  if ($tgt.html() === emptyStar) {
    $tgt.html(filledStar);
    currentUser.addFav(story);
  } else {
    $tgt.html(emptyStar);
    currentUser.deleteFav(story);
  }
}

$allStoriesList.on("click", ".star", starClick);
