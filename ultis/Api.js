const Api = {
    POPULATION_SIZE: 10,

    FIRST_DAY: 2,
    
    LAST_DAY: 7,

    FIRST_ORDER: 1,

    LAST_ORDER: 5,

    TD : "Thể dục",
    GDQP : "GDQP",

    VERSION: 1,
    SECRET: 'xUqbJHOoIXoyPTStGdFjjpJTSMDdff4Q',

    ERROR_MESSAGE: 'Internal API error',
    ERROR_STATUS: 422,
    ERROR_MESSAGE_DEPENDENCY: 'Internal API error',
    ERROR_STATUS_DEPENDENCY: 424,

    /**
     * RESPONSE STATUSES
     */
    STATUS_SUCCESS: 'success',
    STATUS_VERIFIED: 'verified',
    STATUS_FAIL: 'fail',
    STATUS_EXCEPTION: 'exception',

    STATUS_AUTH_FAILED: 'auth.failed',
    STATUS_VERIFICATION_SENT: 'verification.link.sent',
    STATUS_SIGNED: 'user.signed',
    STATUS_UNSIGNED: 'user.unsigned',
    STATUS_DELETED: 'user.deleted',
    STATUS_PASSWORD_INVALID: 'old password does not match',

    /**
     * CLOUDFLARE IMAGES
     */

    /**
     * Stores links
     */
    APPLE_LINK: '',
    GOOGLE_LINK: '',

    WEEK_DAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    /**
     * Within distances
     */
    SHORT_DISTANCE: 5,
    MIDDLE_DISTANCE: 30,
    LONG_DISTANCE: 100,

    CHECKIN_DISTANCE: 50,
    NOTIFICATION_RADIUS: 100000,


    /**
     * Club Notification SEND TO TYPE
     */
    SEND_TO_ONLINE_USERS: 1,
    SEND_TO_PREVIOUS_GUESTS: 2,

    EVENT_SEARCH_RADIUS: 100000, //search google events within 50km from a location
    MINGLE_SEARCH_RADIUS: 100000, //search google events within 50km from a location
    USER_SEARCH_RADIUS: 100000, //search google events within 100km from a location
    
    
    /**
     * Club Notification SEND TO TYPE
     */
    MINGLEPOST_NOTIFY_ACTION_DELETE: 1,
    MINGLEPOST_NOTIFY_ACTION_LIKESHARE: 2,
    MINGLEPOST_NOTIFY_ACTION_SEND: 3,
};

export default Api;
