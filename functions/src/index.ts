import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setAdminRole = functions.https.onCall((data, context) => {

  console.log('setAdminRole_data..... ', data);
  console.log('setAdminRole_context..... ', context);

  return admin.auth().getUserByEmail(data.email)
          .then((user) => {
            console.log('setAdminRole_user..... ', user);

            return admin.auth().setCustomUserClaims(user.uid, { admin: true });
          })
          .then((res) => {
            console.log('setAdminRole_res..... ', res);

            return { message: `OK! User ${data.email} is now an Admin!` };
          })
          .catch((err) => {
            console.error('setAdminRole_err..... ', err)
          });

});
