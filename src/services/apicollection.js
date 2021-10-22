const cred = {
  url: {
    staging: 'https://testapi.mhealth.ai:8081/',
    production: 'https://api.mhealth.ai/',
  },
  baseUrl: {
    staging: 'https://w21.mhealth.ai/#/?',
    production: 'https://walkathon21.mhealth.ai/#/?',
    // dev: 'http://localhost:3000/',
  },
  client_secret: {
    staging: '2d1376db3fa7e6d87e1c0e119da0d4c0d882704a94131196dd1ee550a192d4ac',
    production:
      'b189505ccb4f4c83fe2ef7939dc34a887738206df24bdad69779356688566279',
  },
  secret_token: {
    staging: 'I_BCUcoklG_yLk_gTLUAC-UBcr85RzYjGE1I9cCLx6g',
    production: '6rNzSZnJsfpS0nWqwtYvvdtB0o7WrMvIlEgJLm2wv3k',
  },
  client_id: {
    staging: 'mHealth',
    production: 'Walkathon21',
  },
};

module.exports = {
  urlPrefix: cred.url.staging,
  clientSecret: cred.client_secret.staging,
  secretToken: cred.secret_token.staging,
  clientID: cred.client_id.staging,
  baseUrl: cred.baseUrl.staging,
  validateUser: 'clients/validateUser',
  sendOtp: 'clients/sendOtp',
  verifyOtp: 'clients/verifyOtp',
  registerUser: 'v1.0/registerUser',
  loginUser: 'get/token',
  getLeaderBoardByDate: 'v1.0/getDateWiseLeaderBoardData',
  getLeaderBoard: 'v1.0/getLeaderBoardData',
  getUserDetails: 'v1.0/getUserDetails',
  updateUserDetails: 'v1.0/updateUserDetails',
  forgotPin: 'v1.0/forgetPasswordOrPin',
  resetPin: 'v1.0/resetPasswordOrPin',
  getEventGallery: 'v1.0/getUserEventStatusDetail',
  markAsAbusive: 'v1.0/markStatusAsAbuse',
  pinUsers: 'v1.0/pinUsersWithinEvent',
  getAllEvents: 'clients/getAllEvents',
  updateAvatarAndAlias: 'v1.0/updateUserAvatarAndAlias',
  getUserDataByEventId: 'v1.0/getEventWiseUserDetail',
  registerInEvent: 'v1.0/registerInEvent',
  updateDataSource: 'v1.0/updateDatasource',
  sendSmsApi: 'v1.0/sendSMS',
  getCurrentSource: 'v1.0/getDataSourceByEventAndUser',
  updateDataPerformance: 'v1.0/enterPastDataInEvent',
  unSubscribe: 'v1.0/unRegisterFromEvent',
  validateAlias: 'v1.0/searchAliasName',
  syncDataForGFitAndStrava: 'v1.0/getSyncDataForGoogleFitAndStrava',
  getPersonalTarget: 'v1.0/getResponseForPersonalTarget',
  getEventTarget: 'v1.0/getResponseForEventTarget',
  setPersonalTarget: 'v1.0/setPersonalTarget',
  postChallenge: 'v1.0/registerOrUpdateEventDetails',
  postChallengeImages: 'v1.0/eventImagesForRegistration',
  getSubEvent: 'v1.0/getSubEventDetails',
  subscribeSubEvent: 'v1.0/subscribeInSubEvent',
  unSubscribeSubEvent: 'v1.0/UnSubscribeFromSubEvent',
  subEventUsersList: 'v1.0/getSubEventWiseUsersDetail',
  postSubEvent: 'v1.0/subEventCreationForEvent',
  postSubEventImages: 'v1.0/subEventImages',
  getAllActivities: 'v1.0/getAllSubActivities ',
  getAllMobile: 'v1.0/getAllMobileNumber',
  sendChallengeInvite: 'v1.0/inviteInChallenge',
  viewChallenges: 'v1.0/acceptRejectOrPendingChallenges',
  challengeAction: 'v1.0/acceptOrRejectMeChallenge',
  viewChallengeScorecard: 'v1.0/scoreCardViewOfChallenge',
  dashboardTabs: 'v1.0/getAllDashboradTabs',
  rejoinInEvent: 'v1.0/rejoinInEvent',
  insertOrEditPaymentOfUser: 'v1.0/insertOrEditPaymentOfUser',
  getCountryList: 'clients/getCountryList',
  getProgramWiseActivity: 'v1.0/getUserActivityRecordDetails',
  addProgramActivity: 'v1.0/insertUserActivitydetails',
  viewOldRecording: 'v1.0/getProgramVideosAndDocByUser',
  ratingProgramByUser: 'v1.0/ratingProgramByUser',
  createcoach: 'v1.0/createOrUpdateInstructorProfile',
  getcoach: 'v1.0/searchAndViewCoachProfile?phoneNumber',
  uploadImage: 'v1.0/uploadMultiPartFile',
  getAllCoahes: 'v1.0/getAllCoaches',
  createorupdateteam: 'v1.0/createOrUpdateTeamDetails',
  renderTeamList: 'v1.0/getEventWiseTeamDetail',
  renderMemberList: 'v1.0/getEventWiseActiveUsers',
  teamLeaderBoardData: 'v1.0/getTeamLeaderBoard',
  activeUserInTeam: 'v1.0/teamWiseActiveUsers',
  zoomreport: 'v1.0/reportOfZoomMeetingParticipants',
  performanceReport: 'v1.0/getChallengerRecords',
  leaveTeam: 'v1.0/inactiveUserFromTeam',
};
