const express = require("express");
// Constant
const routes = require("../Constants/index");

// JWT
const jwt = require("../Helpers/jwt");

// Router
const router = express.Router();

// Multer
const upload = require("../Helpers/multer");

// Controllers
const signUp = require("../Controllers/SignUp/index");
const signIn = require("../Controllers/SignIn/index");
const search = require("../Controllers/Search/index");
const user = require("../Controllers/UserActions/index");
const getUserFriends = require("../Controllers/Friends");
const followed = require("../Controllers/Followed/index");
const email = require("../Controllers/EmailActions/index");
const public = require("../Controllers/GetUserData/index");
const storyAction = require("../Controllers/StoryActions/");
const createStory = require("../Controllers/CreateStory/index");
const getUserProfile = require("../Controllers/GetUserProfile");
const getLatestStories = require("../Controllers/LatestStories/index");
const randomStories = require("../Controllers/GetRandomStories/index");
const handleGetStoryWithAuthor = require("../Controllers/GetStoryWithAuthor");
const emailVerification = require("../Controllers/EmailVerfication");
const changePassword = require("../Controllers/ChangePassword");

// For Getting all basic user data
router.get(routes.GET_USERS_ROUTE, public.getAllBasicUserData);
// For Getting Current User
router.get(routes.GET_USER, jwt.authenticateToken, public.getCurrentUser);
// User Actions
router.post(routes.USER_ACTION_ROUTE, jwt.authenticateToken, upload.single("media"), user.action);
// For Getting Story And It's Author
router.post(routes.GET_STORY_WITH_AUTHOR, handleGetStoryWithAuthor);
// For Getting Published Stories
router.post(routes.PUBLISHED_STORIES_ROUTE, public.getPublished);
// For Getting Drafted Stories
router.post(routes.DRAFT_STORIES_ROUTE, public.getDraft);
// For Getting Bookmarked Storis
router.post(routes.BOOKMARKED_STORIES_ROUTE, public.getBookmarked);
// For Getting Random Stories
router.post(routes.GET_RANDOM_STORIES, randomStories);
// For Getting User Profile
router.post(routes.GET_USER_PROFILE, getUserProfile);
// For Getting User Friends
router.post(routes.GET_USER_FRIENDS_ROUTE, getUserFriends);
// For Returning Searched Stories And People
router.post(routes.SEARCH_STORIES_ROUTE, search.stories);
router.post(routes.SEARCH_PEOPLE_ROUTE, search.people);
// For Gettings The Latest Stories
router.post(routes.LATEST_STORIES_ROUTE, getLatestStories);
// For Getting The All Followed People By The User and their Stories
router.post(routes.FOLLOWED_USERS_ROUTE, followed.people);
router.post(routes.FOLLOWED_STORIES_ROUTE, jwt.authenticateToken, followed.stories);
// For Creating Story it needs a image file call hero image
router.post(
	routes.CREATE_STORY_ROUTE,
	jwt.authenticateToken,
	upload.single("heroImage"),
	createStory.upload
);
// For Updating Password
router.post(routes.CHANGE_PASSWORD_ROUTE, changePassword);
// For Editing Story it needs a image file call hero image
router.post(
	routes.EDIT_STORY_ROUTE,
	jwt.authenticateToken,
	upload.single("heroImage"),
	createStory.edit
);
// For Removing The User's Story
router.post(routes.REMOVE_STORY_ROUTE, jwt.authenticateToken, createStory.removeStory);
// For Getting The User's Story
router.post(routes.GET_STORY_ROUTE, jwt.authenticateToken, createStory.getStory);
// For Story Actions
router.post(routes.STORY_ACTIONS, storyAction.action);
// For Verifying and Requesting Email
router.post(routes.EMAIL_VERIFICATION_ROUTE + "-verify", emailVerification);
router.post(routes.EMAIL_VERIFICATION_ROUTE + "-request", email.request);
// For Getting Notifications
router.post(routes.GET_NOTIFICATION_ROUTE, jwt.authenticateToken, public.getNotification);
// For Getting Message Notifications
router.post(routes.GET_MESSAGE_NOTIFICATION_ROUTE, jwt.authenticateToken, public.getMessageNotification);
// For Getting The Messages
router.post(routes.GET_MESSAGE_ROUTE, public.getMessage);
// Sign Up and Sign In
router.post(routes.SIGN_UP_ROUTE, signUp);
router.post(routes.SIGN_IN_ROUTE, signIn);

module.exports = router;
