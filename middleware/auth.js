const admin = require("../firebase");
const axios = require("axios");
const request = require("request");
const msal = require("@azure/msal-node");

// async function allow() {
//   const msalConfig = {
//     auth: {
//       clientId: "75a29625-ea07-4f6b-84b6-6a22f7768b24",
//       authority:
//         "https://login.microsoftonline.com/4bd56a37-6519-47bb-be3e-f1a1aac7a2a6",
//       clientSecret: "KG68Q~YqyyRYmtIZsDCI~MV42qJ0UudXbNjh6apd",
//     },
//   };

//   let cca = new msal.ConfidentialClientApplication(msalConfig);

//   let tokenRequest = {
//     scopes: ["https://graph.microsoft.com/.default"],
//   };

//   let tokenResponse = await cca.acquireTokenByClientCredential(tokenRequest);

//   //return tokenResponse;
// }

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseToken = req.headers.authtoken;

    //console.log(firebaseToken)

    const accesstoken = req.headers.accesstoken;

    const firebaseUser = await admin.auth().verifyIdToken(firebaseToken);

    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "content-type": "image/jpeg",
      },
      responseType: "arraybuffer",
    };

    const configs = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    let base64Body;

    const photoUrl = await axios
      .get("https://graph.microsoft.com/v1.0/me/photo/$value", config)
      .then((res) => {
        base64Body = res.data.toString("base64");

        return base64Body || null;
      })
      .catch((err) => {
        console.log(err);
        if (err) {
          throw new Error(`Error Ocurred ! - ${err}`);
        }
      });

    const profile = await axios
      .get("https://graph.microsoft.com/beta/me", configs)
      .then((res) => {
        //  console.log(res);
        return res.data;
      });

    req.profile = profile;
    req.pic = photoUrl ? photoUrl : null;
    req.user = firebaseUser;

    //console.log(photoUrl);

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      err: "Invalid Login",
      error,
    });
  }
};

exports.authOnly = async (req, res, next) => {
  try {
    const firebaseToken = req.headers.authtoken;

    //console.log(firebaseToken)

    const firebaseUser = await admin.auth().verifyIdToken(firebaseToken);

    req.user = firebaseUser;

    next();
  } catch (error) {
    res.status(401).json({
      err: "Invalid or expired Token",
      error,
    });
  }
};

exports.authToken = async (req, res, next) => {
  try {
    // const firebaseToken = req.headers.authtoken;

    //console.log(firebaseToken)

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

    const accesstoken = req.headers.accesstoken;

    console.log(tokenResponse.accessToken);

    // const firebaseUser = await admin.auth().verifyIdToken(firebaseToken);

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${accesstoken}`,
    //     "content-type": "image/jpeg",
    //   },
    //   responseType: "arraybuffer",
    // };

    // const configs = {
    //   headers: {
    //     Authorization: `Bearer ${accesstoken}`,
    //     // accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // };

    request.post(
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
        url: "https://graph.microsoft.com/v1.0/sites/frisl.sharepoint.com,ef955848-3bdd-4d46-b694-bbb31f6b4409,10dc78f2-f8e5-478e-ba72-627299e76dbb/lists/e25f6211-2c20-443d-827c-b3f8fcd2a6f7/items",
        body: JSON.stringify({
          fields: {
            manageremail: "biodun123590abiodun@yahoo.com",
          },
        }),
      },

      function (err, httpResponse, body) {
        console.log(body);
      }
    );
    // JSON.stringify({
    //   fields: {
    //     manageremail: "biodun1234@yahoo.com",
    //   },
    // }),
    // req.profile = profile;
    //req.pic = photoUrl;
    // req.user = firebaseUser;

    // console.log("Access Token", accesstoken);

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      err: "Invalid or expired Token",
      error,
    });
  }
};
