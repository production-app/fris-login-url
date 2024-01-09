require("dotenv").config();

module.exports = {
  type: "service_account",
  project_id: "helpdesk-apps",
  private_key_id: process.env.HELP_private_key_id,
  private_key: process.env.HELP_private_key,
  client_email: "firebase-adminsdk-lk41q@helpdesk-apps.iam.gserviceaccount.com",
  client_id: process.env.HELP_client_id,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lk41q%40helpdesk-apps.iam.gserviceaccount.com",
};
