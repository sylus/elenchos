const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    refId: String,
    sha: String, // of the push
    cluster_id: String,
    pr_state: {
      type: String,
      enum: ["open", "closed"]
    },
    deployment_id: String,
    load_balancer_ip: String,
    config: String,
    cluster_state: {
      type: String,
      enum: [
        "none",
        "pending",
        "queued",
        "in_progress",
        "error",
        "failure",
        "success",
        "deleted"
      ]
    },
    branch: String,
    repo: String
  },
  { timestamps: true }
);

export const Model = mongoose.model("pull_requests", schema);
