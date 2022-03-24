module.exports = {
  firstName: "string",
  type: "string",
  status: "string",
  rejectedReason:"string",
  lastName: "string",

  email: "string",
  gender: "string",
  visibleAge: "boolean",
  visibleLocation: "boolean",
  visibleImage: "boolean",
  visiblelikeDislike: "boolean",

  orientation: "string",
  occupation: "string",
  languages: [
    {
      option: "string",
    },
  ],
  // ethni: "string",
  // connection: "string",
  bodyType: "string",

  employment: "string",
  astrologicalSign: "string",
  alcohol: "string",
  smoking: "string",
  marijuana: "string",
  diet: "string",
  pets: "string",
  maritalStatus: "string",
  wantsKids: "string",

  userName: "string",
  work: "string",

  // address: "string",

  age: "string",
  phone: "string",

  currentCity: "string",
  postalCode: "string",
  profilePic: {
    url: "string",
    thumbnail: "string",
    resize_url: "string",
    resize_thumbnail: "string",
  },
  address: {
    location: {
      type: "Point",
      coordinates: ["number", "number"],
    },
  },

  height: "number",
  religion: "string",
  images: [
    {
      url: "string",
      thumbnail: "string",
      resize_url: "string",
      resize_thumbnail: "string",
    },
  ],
  race: "string",
  education: "string",
  basicQuestionRemoved: "string",
  basicQuestionsId: "string",

  aboutMeQuestions: [
    {
      questionId: "string",
      que: "string",
      ans: "string",
    },
  ],
  interests: [
    {
      questionId: "string",
      que: "string",
      ans: "string",
    },
  ],
  preferences: {
    women: "boolean",
    men: "boolean",
    age: {
      from: "number",
      to: "number",
    },
    height: {
      from: "number",
      to: "number",
    },
    distance: "string",
    occupation: "string",
    bodyType: "string",
    height: "string",
    languages: [
      {
        option: "string",
      },
    ],
    race: "string",
    religion: "string",
    pets: "string",
    maritalStatus: "string",
    wantsKids: "string",
    education: "string",
    employment: "string",
    astrologicalSign: "string",
    alcohol: "string",
    smoking: "string",
    diet: "string",
  },
};
