const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const Sequelize = require("sequelize");
const { Novu } = require("@novu/node");
const novu = new Novu("954d338857617a53b156f602012f01e4");
const msal = require("@azure/msal-node");
const request = require("request");
const moment = require("moment");

const Op = Sequelize.Op;

const {
  attachmentLog,
  mailLog,
  googleUrl,
  Userprofile,
  azureUrl,
  requestTypes,
  FRISHOD,
  auditLogs,
} = require("../models");
const requesttypes = require("../models/requesttypes");

// Create User

exports.createOrUpdateUser = async (req, res, next) => {
  const { name, email } = req.user;
  const { department, jobTitle } = req.profile;

  try {
    const [user, created] = await Userprofile.findOrCreate({
      where: { email },
      defaults: {
        name,
        // photo_url: req.pic || null,
        department,
        role: jobTitle,
        email,
      },
    });

    await auditLogs.create({
      user: name,
      user_email: email,
      session: `Login Occurred at ${moment().format("MMM Do YY")}`,
    });

    res.json(user);
  } catch (error) {
    console.log(error);

    await auditLogs.create({
      user: name,
      user_email: email,
      session: `Login failed at ${moment().format(
        "MMM Do YY"
      )} due to ${error}`,
    });
    return res.status(401).json({
      err: "User not created",
    });
  }
};

// Sharepoit Links

exports.sharepointLinks = async (req, res, next) => {
  // const { name, email } = req.user;
  // const { department, jobTitle } = req.profile;
  const { control_number, manager_email, requester_name, items, manager } =
    req.body;

  const msalConfig = {
    auth: {
      clientId: "75a29625-ea07-4f6b-84b6-6a22f7768b24",
      authority:
        "https://login.microsoftonline.com/4bd56a37-6519-47bb-be3e-f1a1aac7a2a6",
      clientSecret: "KG68Q~YqyyRYmtIZsDCI~MV42qJ0UudXbNjh6apd",
    },
  };

  let cca = new msal.ConfidentialClientApplication(msalConfig);

  let tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  let tokenResponse = await cca.acquireTokenByClientCredential(tokenRequest);

  console.log(tokenResponse.accessToken);

  try {
    request.post(
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
        url: "https://graph.microsoft.com/v1.0/sites/frisl.sharepoint.com,ef955848-3bdd-4d46-b694-bbb31f6b4409,10dc78f2-f8e5-478e-ba72-627299e76dbb/lists/e25f6211-2c20-443d-827c-b3f8fcd2a6f7/items",
        body: JSON.stringify({
          fields: {
            manageremail: manager_email,
            control: control_number,
            requestername: requester_name,
            items,
            manager,
          },
        }),
      },

      function (err, httpResponse, body) {
        console.log(body);
      }
    );

    return res.status(201).json({ msg: "Completed!" });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      err: "Error Ocurred!",
    });
  }
};

//Demo

exports.prints = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json({ msg: "Demo!!!! Adebayo Tope Favor Miracle Testimony ! !" });
  } catch (error) {}
};

// Check Login User

exports.getCurrentUser = async (req, res, next) => {
  try {
    const { email } = req.user;

    const currentUser = await Userprofile.findOne({ where: { email } });

    // if (currentUser.)

    // let a = currentUser.department.toUpperCase();

    // console.log(a.indexOf[0]);

    // const manangerName = await FRISHOD.findOne({
    //   where: {
    //     department_role: {
    //       [Op.like]: `%${a}%`,
    //     },
    //   },
    // });

    //  console.log(manangerName);

    return res.status(201).json(currentUser);

    // console.log(currentUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: error,
    });
  }
};

exports.updateSignature = async (req, res, next) => {
  try {
    // console.log(req);
    //  console.log(req.query.email);
    const email = req.query.email;

    const { signature_url } = req.body;

    const updateSignature = await Userprofile.update(
      { signature_url },
      { where: { email } }
    );
    res.json(updateSignature);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: error,
    });
  }
};

exports.createInbox = async (req, res, next) => {
  const {
    sender_email,
    body,
    assignees,
    subject,
    received_date,
    attachment,
    sender_name,
    ticket_id,
  } = req.body;

  try {
    const incomingmail = await mailLog.create({
      ticket_id,
      body,
      sender_email,
      assignees,
      subject,
      sender_name,
      received_date,
      attachment,
    });
    return res.status(201).json({
      status: true,
      data: incomingmail,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: err,
    });
  }
};

exports.createAttachment = async (req, res, next) => {
  const { image_url, ticket_id } = req.body;

  try {
    const attachment = await azureUrl.create({
      image_url,
      ticket_id,
    });
    return res.status(201).json({
      status: true,
      data: attachment,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: false,
      message: err,
    });
  }
};

exports.getSingleRequest = async (req, res, next) => {
  const ticket_id = parseInt(req.params.ticket_id);

  try {
    const singleattachment = await mailLog.findOne({
      where: { ticket_id },
      include: [azureUrl],
    });

    return res.status(201).json({
      status: true,
      data: singleattachment,
      //url: urlArray
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: false,
      message: err,
    });
  }
};

exports.getAllRequest = async (req, res, next) => {
  try {
    const allMailLogs = await mailLog.findAll({
      order: [["received_date", "DESC"]], //where: {status: 'PENDING' },
      include: [azureUrl, requestTypes],
    });

    return res.status(201).json({
      status: true,
      data: allMailLogs,
      //url: urlArray
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: false,
      message: err,
    });
  }
};

exports.getAllRequestWithPending = async (req, res, next) => {
  try {
    const allMailLogs = await mailLog.findAll({
      where: { status: "PENDING" },
      include: [azureUrl, requestTypes],
    });

    return res.status(201).json({
      status: true,
      data: allMailLogs,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: false,
      message: err,
    });
  }
};

exports.getAllRequests = async (req, res, next) => {
  try {
    const allMailLogs = await mailLog.findAll({ include: [azureUrl] });

    return res.status(201).json({
      status: true,
      data: allMailLogs,
      //url: urlArray
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err,
    });
  }
};

exports.createMailLogs = async (req, res, next) => {
  const {
    sender_email,
    body,
    ticket_id,
    subject,
    sender_name,
    assignees_email,
    assignees,
    received_date,
    attachment,
  } = req.body;

  try {
    const allRequest = await mailLog.create({
      sender_email,
      body,
      ticket_id,
      subject,
      sender_name,
      assignees_email,
      assignees,
      received_date,
      attachment,
    });

    return res.status(201).json({
      status: true,
      data: allRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: false,
      message: err,
    });
  }
};

exports.updateRequest = async (req, res, next) => {
  const ticket_id = parseInt(req.params.ticket_id);

  const { status } = req.body;

  try {
    const updateRequest = await mailLog.update(
      { status },
      {
        where: {
          ticket_id,
        },
      }
    );

    return res.status(201).json({
      status: true,
      data: updateRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: false,
      message: err,
    });
  }
};

exports.getRequestByQuery = async (req, res, next) => {
  const assignees_email = req.query.assignees_email;

  try {
    const singleattachment = await mailLog.findAll({
      where: { assignees_email },
      include: [azureUrl],
    });

    return res.status(201).json({
      status: true,
      data: singleattachment,
      //url: urlArray
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: false,
      message: err,
    });
  }
};

exports.createRequestTypes = async (req, res, next) => {
  const { request_types, ticket_id, status } = req.body;

  try {
    const requesttype = await requestTypes.create({
      request_types,
      ticket_id,
      status,
    });

    await mailLog.update(
      { status },
      {
        where: {
          ticket_id,
        },
      }
    );

    return res.status(201).json({
      status: true,
      data: requesttype,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: error,
    });
  }
};

exports.updateRequestTypes = async (req, res, next) => {
  const request_id = req.params.request_id;

  const { status } = req.body;

  try {
    const findTicket_id = await requestTypes.findOne({ where: { request_id } });

    // console.log(findTicket_id);

    const updatedRequestType = await requestTypes.update(
      { status },
      {
        where: {
          request_id,
        },
      }
    );

    // console.log(updatedRequestType);

    // await mailLog.update({ status }, { where: {
    //   ticket_id: findTicket_id.ticket_id
    // }})

    return res.status(201).json({
      status: true,
      msg: "status updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: error,
    });
  }
};

exports.getRequestWithPagination = async (req, res, next) => {
  const { offset, limit } = req.body;

  try {
    const allMailLogs = await mailLog.findAndCountAll({
      limit,
      offset,
      order: [["received_date", "DESC"]],
      include: [azureUrl],
    });

    return res.status(201).json({
      status: true,
      data: allMailLogs,
      //url: urlArray
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err,
    });
  }
};

exports.getRequestByTicket = async (req, res, next) => {
  const ticket_id = req.params.ticket_id;

  try {
    const allMailLogs = await mailLog.findOne({
      where: {
        ticket_id,
      },
      include: [azureUrl],
    });

    return res.status(201).json({
      status: true,
      data: allMailLogs,
      //url: urlArray
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err,
    });
  }
};

exports.updateIsShown = async (req, res, next) => {
  const ticket_id = parseInt(req.params.ticket_id);

  const { isShown } = req.body;

  try {
    const updateRequest = await mailLog.update(
      { isShown },
      {
        where: {
          ticket_id,
        },
      }
    );

    return res.status(201).json({
      status: true,
      data: updateRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      status: false,
      message: err,
    });
  }
};

exports.getIsShown = async (req, res, next) => {
  const ticket_id = req.params.ticket_id;

  try {
    const allMailLogs = await mailLog.findOne({
      where: {
        ticket_id,
      },
    });

    return res.status(201).json({
      status: true,
      data: allMailLogs.isShown,
      //url: urlArray
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err,
    });
  }
};

exports.sendMailer = async (req, res, next) => {
  const { sender_email, body, subject } = req.body;

  // console.log(sender_email, body, subject);

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      //secure: false, // true for 465, false for other ports
      secureConnection: false,
      auth: {
        user: "info@firstregistrarsnigeria.com", // generated ethereal user
        pass: "Investor1", // generated ethereal password
      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: '"FRIS "  <info@firstregistrarsnigeria.com>', // "info@firstregistrarsnigeria.com", // sender address
      to: `${sender_email}`, // list of receivers
      subject: `${subject}`, // Subject line
      text: "FRIS Information", // plain text body
      //replyTo: "noreply@firstregistrarsnigeria.com",
      priority: "high",
      html: body, // html body
    });

    return res
      .status(202)
      .json({ status: true, msg: "Message sent via email" });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err,
    });
  }
};
