// DotEnv
require("dotenv").config();

// Server Port
const PORT = 4000;

// User Actions
const USER_ACTION_ROUTE = "/user-action";

// Email Verification
const EMAIL_VERIFICATION_ROUTE = '/email-verification';

// Sign Up And Sign In
const SIGN_IN_ROUTE = "/signin";
const SIGN_UP_ROUTE = "/signup";

// Public Route
const GET_USER = "/get-user";
const GET_USERS_ROUTE = '/get-users';
const LATEST_STORIES_ROUTE = "/latest-stories";
const GET_USER_PROFILE = '/get-user-profile';
const GET_STORY_WITH_AUTHOR = '/get-user-story-and-author';
const GET_SPECIFIC_USER = "/get-specific-user";
const GET_RANDOM_STORIES = "/get-random-stories";
const CHANGE_PASSWORD_ROUTE = "/change-password";

// Routes That Needs an Id
const SEARCH_STORIES_ROUTE = "/search-stories";
const SEARCH_PEOPLE_ROUTE = "/search-people";
const GET_USER_FRIENDS_ROUTE = "/get-user-friends";
const FOLLOWED_STORIES_ROUTE = "/followed-stories";
const FOLLOWED_USERS_ROUTE = "/followed-peoples";
const PUBLISHED_STORIES_ROUTE = "/published-stories";
const BOOKMARKED_STORIES_ROUTE = "/bookmarked-stories";
const DRAFT_STORIES_ROUTE = "/draft-stories";
const GET_STORY_ROUTE = "/get-story";
const CREATE_STORY_ROUTE = "/create-story";
const EDIT_STORY_ROUTE = "/edit-story";
const REMOVE_STORY_ROUTE = "/remove-story";

// Story Actions
const STORY_ACTIONS = "/story-actions";

// Message
const GET_MESSAGE_ROUTE = "/get-message";

// Notification
const GET_MESSAGE_NOTIFICATION_ROUTE = "/get-message-notification";
const GET_NOTIFICATION_ROUTE = "/get-notification";

// JWT PRIVATE KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Mongoose Url
const MONGOOSE_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pclry.mongodb.net/HadesBlog?retryWrites=true&w=majority`;

module.exports = {
  PORT,
  MONGOOSE_URL,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  GET_USER,
  PRIVATE_KEY,
  LATEST_STORIES_ROUTE,
  SEARCH_STORIES_ROUTE,
  SEARCH_PEOPLE_ROUTE,
  FOLLOWED_STORIES_ROUTE,
  FOLLOWED_USERS_ROUTE,
  PUBLISHED_STORIES_ROUTE,
  DRAFT_STORIES_ROUTE,
  GET_RANDOM_STORIES,
  CREATE_STORY_ROUTE,
  REMOVE_STORY_ROUTE,
  GET_STORY_ROUTE,
  EDIT_STORY_ROUTE,
  USER_ACTION_ROUTE,
  GET_USER_PROFILE,
  GET_USER_FRIENDS_ROUTE,
  BOOKMARKED_STORIES_ROUTE,
  GET_SPECIFIC_USER,
  GET_STORY_WITH_AUTHOR,
  STORY_ACTIONS,
  GET_USERS_ROUTE,
  EMAIL_VERIFICATION_ROUTE ,
  GET_MESSAGE_ROUTE,
  GET_NOTIFICATION_ROUTE,
  GET_MESSAGE_NOTIFICATION_ROUTE,
  CHANGE_PASSWORD_ROUTE
};
