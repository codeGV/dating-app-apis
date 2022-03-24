module.exports = {
  type: "string",
  status: "string",
  rejectedReason:"string",
  firebaseToken: "string",
  uId: "string",
  loginType: "string",
  firstName: "string",
  lastName: "string",
  gender: "string",
  age: "number",
  email: "string",
  height: "number",
  occupation: "string",

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
  religion: "string",
  race: "string",
  basicQuestions: [
    {
      questionId: "string",
      que: "string",
      ans: {
        value: "string",
        _id: "string",
      },
    },
  ],
  images: [
    {
      url: "string",
      thumbnail: "string",
      resize_url: "string",
      resize_thumbnail: "string",
    },
  ],
  tempToken: "string",
  phone: "string",
};
