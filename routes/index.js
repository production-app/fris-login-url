const express = require("express");
const router = express.Router();

const {
  createAttachment,
  createInbox,
  getSingleRequest,
  createOrUpdateUser,
  sharepointLinks,
  getCurrentUser,
  getAllRequest,
  createMailLogs,
  getRequestByQuery,
  updateRequest,
  getAllRequests,
  prints,
  createRequestTypes,
  updateRequestTypes,
  getAllRequestWithPending,
  getRequestWithPagination,
  getRequestByTicket,
  updateSignature,
  updateIsShown,
  getIsShown,
  sendMailer,
} = require("../controllers");

const { authCheck, authOnly, authToken } = require("../middleware/auth");

router.route("/createInbox").post(createInbox);

router.route("/attachments").post(createAttachment);

router.route("/request/:ticket_id").get(getSingleRequest);

router.route("/loginuser").post(authCheck, createOrUpdateUser);

//Sharepoint

router.route("/sharepoints").post(sharepointLinks);

router.route("/demo").get(prints);

router.route("/currentuser").get(authOnly, getCurrentUser);

router.route("/requestall").get(getAllRequest); // exposed to FRISOPS ALL STATUS

router.route("/request").get(getAllRequestWithPending); // exposed to FRISOPS ALL REQUEST PENDING

router.route("/createlogs").post(createMailLogs); // exposed to power automate

router.route("/request/:ticket_id").put(updateRequest); // exposed to FRISOPS

router.route("/getlogs").get(getRequestByQuery); // exposed to FRISOPS

router.route("/requesttype").post(createRequestTypes); // exposed to Frontend

router.route("/requesttype/:request_id").put(updateRequestTypes); // exposed to Frontend and FRISOPS

router.route("/isshown/:ticket_id").put(updateIsShown); // exposed to Frontend and FRISOPS

router.route("/updatesignature/").put(updateSignature); // exposed to Frontend and FRISOPS

router.route("/isshown/:ticket_id").get(getIsShown); // change the UI state of the Frontend

router.route("/sendmail/").post(sendMailer); // send mailer for the frontend

router.route("/request/:ticket_id").get(getIsShown); // change the UI state of the Frontend

router.route("/requestall").post(getRequestWithPagination); // exposed to HELPDESK APP ALL STATUS

router.route("/request/:ticket_id").get(getRequestByTicket); // exposed to Frontend and FRISOPS

// To vertify the existence of an email address in the table

module.exports = router;
