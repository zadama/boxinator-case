const authErrors = {
  "correct-now": { response: "hejehej" },
  wrong: { response: "ddaåsdpåasdp" },
};

const res = authErrors["correct-now"];
console.log(res == null ? "unhandled error" : res.response);
