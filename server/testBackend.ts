import { jwtDecode } from 'jwt-decode';
//this tests all the functions from frontend that make calls to backend.
//functions from frontend making calls to backend are slightly modified to be testable as a script.
async function TestBackend() {
  interface UserInfo {
    user_id: number;
    username: string;
    password: string;
    email: string;
    phonesubbed: boolean;
    emailsubbed: boolean;
    tickers: string | null;
  }

  interface loginResponse {
    authenticated: boolean;
    userInfo: UserInfo;
    token: string;
  }

  interface profileResponse {
    message: string;
    value: string;
    authenticated: boolean;
    token: string;
  }
  interface notifResponse {
    message: string;
    value: string;
  }

  interface JwtPayload {
    userId: string;
  }

//variables to be changed by functions in these tests
  let backenduser_id: number = 0;
  let backendusername = '';
  let backendemail = '';
  let backendpassword = '';
  let backendphonesubbed: boolean = false;
  let backendemailsubbed: boolean = false;
  let backendtickers: string | null = null;
  let backendtoken: string = '';
  let newbackendtoken: string = '';
  let actualAuthenticated:boolean = true;
  let updateSuccessMessage:string = '';
  let updateSuccessValue:string = '';
  let updateFailedMessage:string = '';
  let updateFailedValue:string = '';
  let phonesubbedMessage:string = '';
  let phonesubbedValue:string = '';
  let emailsubbedMessage:string = '';
  let emailsubbedValue:string = '';
  let deleteMessage:string = '';


//expected values for tests
  const expectedInitialUsername = 'test user 1';
  const expectedInitialEmail = 'testuser1@gmail.com';
  const expectedInitialPhoneSubbed = false;
  const expectedInitialEmailSubbed = false;
  const expectedAuthenticated = true;
  
 //name of tests 
  let profileTestsPassed:boolean = true;//weird logic i know.
  let userRegistered: boolean = false;
  let userLoggedIn:boolean = false;
  let deletedAccount: boolean = false;
  let notifTestsPassed: boolean = true;


//number of tests done
  let successfulTests = 0;
  let numTests = 0;
  let failedTests = 0;

//functions nearly same as frontend, just slight changes to make it work for testing.
  async function handleRegister(): Promise<boolean> {
    const username: string = 'test user 1';
    const password: string = 'test password';
    const email: string = 'testuser1@gmail.com';
    try {
        const body = { username, password, email };
        const response = await fetch("http://localhost:4000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const user = await response.json() as UserInfo;
            backenduser_id = user.user_id;
            backendusername = user.username;
            backendemail = user.email;
            backendpassword = user.password;
            backendemailsubbed = user.emailsubbed;
            backendphonesubbed = user.phonesubbed;
            backendtickers = user.tickers;
            return true;
        } else {
            console.error('Failed to register:', response.statusText);
            return false;
        }
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
}

async function handleLogin(): Promise<void>{
  try {
    const password: string = 'test password';
    const email: string = 'testuser1@gmail.com';
    const body = { email, password };
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const data = await response.json() as loginResponse;
      backendtoken = data.token;
    } else {
      actualAuthenticated=false;
      console.error('Failed to login:', response.statusText);
    }
  } catch (error) {
    actualAuthenticated=false;
  }
};

async function updateProfile(userfield:string, currentpw:string, newpw:string, emailfield:string): Promise<void> {
  try {
    const decodedToken= jwtDecode(backendtoken) as JwtPayload;
    const userId = parseInt(decodedToken.userId);
    const body = { username: userfield, currentPassword: currentpw, newPassword: newpw, email: emailfield };

    const response = await fetch(`http://localhost:4000/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${backendtoken}` },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const data = await response.json() as profileResponse;
      updateSuccessMessage = data.message;
      updateSuccessValue = data.value;
      newbackendtoken = data.token;
      actualAuthenticated=data.authenticated;
    }
    else{
      const data = await response.json() as profileResponse;
      updateFailedMessage = data.message;
      updateFailedValue = data.value;
    }
  }
   catch (err){
    console.error((err as Error).message);
  }
}

async function updatePhoneNotifs():Promise<void>{
  try{
    const decodedToken= jwtDecode(newbackendtoken) as JwtPayload;//i changed the token value when i updated profile
    const userId = parseInt(decodedToken.userId);
    const body = {phoneSubscribed: backendphonesubbed};
      const response = await fetch(`http://localhost:4000/users/phone/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${newbackendtoken}` },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        if(backendphonesubbed === true)
          {
            backendphonesubbed=false;
          }
        else
        {
          backendphonesubbed=true;
        }
        const data = await response.json() as notifResponse;
        phonesubbedMessage = data.message;
        phonesubbedValue = data.value;
      }
    }
     catch (err){
      console.error((err as Error).message);
    }
  };

  async function updateEmailNotifs():Promise<void>{
    try{
      const decodedToken= jwtDecode(newbackendtoken) as JwtPayload;//i changed the token value when i updated profile
      const userId = parseInt(decodedToken.userId);
      const body = {emailSubscribed: backendemailsubbed};
        const response = await fetch(`http://localhost:4000/users/email/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${newbackendtoken}` },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          if(backendemailsubbed === true)
            {
              backendemailsubbed= false;
            }
          else
          {
            backendemailsubbed=true;
          }
          const data = await response.json() as notifResponse;
           emailsubbedMessage = data.message;
           emailsubbedValue = data.value;
      
        }
      }
       catch (err){
        console.error((err as Error).message);
      }
    };

    async function handleDelete():Promise<void> {
        const decodedToken= jwtDecode(newbackendtoken) as JwtPayload;
        const userId = parseInt(decodedToken.userId);
        try{
          const response = await fetch(`http://localhost:4000/users/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${newbackendtoken}`,
            },
          });
          if (response.ok) {
            newbackendtoken = '';
            const message: string = await response.text();
            deleteMessage=message;
          }
        }catch(error) {
          console.error('Error fetching user info:', error);
        }
      }
//test 1:register. if you do not want to perform this test comment out lines 240-264 and line 416.
  await handleRegister();
  numTests += 1;
  console.log('The following tests are for handleRegister. The whole thing will be counted as 1 test');
  console.log('expected username: ' + expectedInitialUsername);
  console.log('actual username: ' + backendusername);
  console.log('expected email: ' + expectedInitialEmail);
  console.log('actual email: ' + backendemail);
  console.log('expected phonesubbed: ' + expectedInitialPhoneSubbed);
  console.log('actual phonesubbed: ' + backendphonesubbed);
  console.log('expected emailsubbed: ' + expectedInitialEmailSubbed);
  console.log('actual emailsubbed: ' + backendemailsubbed);
  if (expectedInitialUsername === backendusername &&
    expectedInitialEmail === backendemail &&
    expectedInitialPhoneSubbed === backendphonesubbed &&
    expectedInitialEmailSubbed === backendemailsubbed) {
    userRegistered = true;
  } else {
    userRegistered = false;
  }

  if (userRegistered) {
    successfulTests += 1;
  } else {
    failedTests += 1;
  }

//test 2:login. if you do not want to perform this test comment out lines 267-285 and line 417.
  await handleLogin();
  numTests+=1;
  console.log('The following tests are for handleLogin. The whole thing will be counted as 1 test');
  console.log('expected authentication value ' + expectedAuthenticated);
  console.log('actual authentication value: ' + actualAuthenticated);
  console.log('the token should not be an empty string after logging in: ');
  console.log('token value after logging in: '+backendtoken);
  if (expectedAuthenticated === actualAuthenticated &&
    backendtoken != '') {
    userLoggedIn = true;
  } else {
    userLoggedIn = false;
  }

  if (userLoggedIn) {
    successfulTests += 1;
  } else {
    failedTests += 1;
  }

//test 3: updating credentials/profile. if you do not want to perform this or certain test you can comment them out. commenting out the whole test wil be lines 289-363. and line 418
//the 11 tests will count as 1
  await updateProfile('','','','');
  console.log('profile test 1: all fields blank')
  console.log('expect: profile is not updated because all fields were blank, warning')
  console.log('actual: '+updateFailedMessage+', '+updateFailedValue);
  if(!(updateFailedMessage==='profile is not updated because all fields were blank'&&updateFailedValue==='warning'))
    {profileTestsPassed= false;}
  await updateProfile('','','','testuser1@gmail.com');
  console.log('profile test 2: same email')
  console.log('expect: new email cannot match current email, error')
  console.log('actual: '+updateFailedMessage+', '+updateFailedValue);
  if(!(updateFailedMessage==='new email cannot match current email'&&updateFailedValue==='error'))
    {profileTestsPassed= false;}
  await updateProfile('test user 1','','','');
  console.log('profile test 3: same username')
  console.log('expect: new username cannot match current username!, error')
  console.log('actual: '+updateFailedMessage+', '+updateFailedValue);
  if(!(updateFailedMessage==='new username cannot match current username!'&&updateFailedValue==='error'))
    {profileTestsPassed= false;}
  await updateProfile('Sabeet Hossain','','','');
  console.log('profile test 4:username belongs to another account')
  console.log('expect: username belongs to another account!, error')
  console.log('actual: '+updateFailedMessage+', '+updateFailedValue);
  if(!(updateFailedMessage==='username belongs to another account!'&&updateFailedValue==='error'))
    {profileTestsPassed = false;}
  await updateProfile('','abcd','pass','');
  console.log('profile test 5:entered incorrect current password')
  console.log('expect: current password is incorrect!, error')
  console.log('actual: '+updateFailedMessage+', '+updateFailedValue);
  if(!(updateFailedMessage==='current password is incorrect!'&&updateFailedValue==='error'))
    {profileTestsPassed = false;}
  await updateProfile('','test password','test password','');
  console.log('profile test 6:entered matching current and new pw')
  console.log('expect: new password cannot match current password!, error')
  console.log('actual: '+updateFailedMessage+', '+updateFailedValue);
  if(!(updateFailedMessage==='new password cannot match current password!'&&updateFailedValue==='error'))
    {profileTestsPassed = false;}
  await updateProfile('','','','sabeethossain11@gmail.com');
  console.log('profile test 7:entered email that belongs to someone else')
  console.log('expect: email belongs to another account, error')
  console.log('actual: '+updateFailedMessage+', '+updateFailedValue);
  if(!(updateFailedMessage==='email belongs to another account'&&updateFailedValue==='error'))
    {profileTestsPassed = false;}
  await updateProfile('user1','','','');
  console.log('profile test 8:successful username update')
  console.log('expect: username was successfully updated!, success')
  console.log('actual: '+updateSuccessMessage+', '+updateSuccessValue);
  if(!(updateSuccessMessage==='username was successfully updated!'&&updateSuccessValue==='success'))
    {profileTestsPassed = false;}
  await updateProfile('','test password','new password','');
  console.log('profile test 9:successful password update')
  console.log('expect: password was successfully updated!, success')
  console.log('actual: '+updateSuccessMessage+', '+updateSuccessValue);
  if(!(updateSuccessMessage==='password was successfully updated!'&&updateSuccessValue==='success'))
    {profileTestsPassed = false;}
  await updateProfile('','','','testuser1@protonmail.com');
  console.log('profile test 10:successful email update');
  console.log('expect: email was successfully updated!, success')
  console.log('actual: '+updateSuccessMessage+', '+updateSuccessValue);
  if(!(updateSuccessMessage==='email was successfully updated!'&&updateSuccessValue==='success'))
    {profileTestsPassed = false;}
  /*in this case i'm basically reverting everything to what it was originally except
    email, which was not intentional but useful since i can check the database and actually notice
    the change from testuser1@gmail.com to testuser@gmail.com
  */
  await updateProfile('test user 1','new password','test password','testuser@gmail.com');
  console.log('profile test 11:successful multiple parts of profile update')
  console.log('expect: profile was successfully updated!, success')
  console.log('actual: '+updateSuccessMessage+', '+updateSuccessValue);
  if(!(updateSuccessMessage==='profile was successfully updated!'&&updateSuccessValue==='success'))
    {profileTestsPassed = false;}
  numTests+=1;
  if(profileTestsPassed === true)
    {successfulTests+=1;}
  else
  {failedTests+=1;}

//test 4: toggling subscription to phone notifications on and off. if you dont want to perform certain tests comment it out. to comment out the full test comment out lines 366-396 and line 419
  await updatePhoneNotifs();
  console.log('notif test 1: turn phone notifs on')
  console.log('expect: You will now be getting phone notifications!, info')
  console.log('actual: '+phonesubbedMessage+', '+phonesubbedValue);
  if(!(phonesubbedMessage==='You will now be getting phone notifications!'&&phonesubbedValue==='info'))
    {notifTestsPassed = false;}
  await updatePhoneNotifs();
  console.log('notif test 2: turn phone notifs off')
  console.log('expect: You will no longer be getting phone notifications, info')
  console.log('actual: '+phonesubbedMessage+', '+phonesubbedValue);
  if(!(phonesubbedMessage==='You will no longer be getting phone notifications'&&phonesubbedValue==='info'))
    {notifTestsPassed = false;}
  await updateEmailNotifs();
  console.log('notif test 3: turn email notifs on')
  console.log('expect: You will now be getting email notifications!, info')
  console.log('actual: '+emailsubbedMessage+', '+emailsubbedValue);
  if(!(emailsubbedMessage==='You will now be getting email notifications!'&&emailsubbedValue==='info'))
    {notifTestsPassed = false;}
  await updateEmailNotifs(); 
  console.log('notif test 4: turn email notifs off')
  console.log('expect: You will no longer be getting email notifications, info')
  console.log('actual: '+emailsubbedMessage+', '+emailsubbedValue);
  if(!(emailsubbedMessage==='You will no longer be getting email notifications'&&emailsubbedValue==='info'))
    {notifTestsPassed = false;}
  
  numTests+=1;

  if(notifTestsPassed === true)
    {successfulTests+=1;}
  else
  {failedTests+=1;}
//test 5 delete. comment out line 398-414 to comment this test out. useful if you want to see the changes the other test provide to the database without removing the account from database .
  await handleDelete();
  console.log('testing delete');
  console.log('expect: "Username was deleted!"')
  console.log('actual: '+deleteMessage);
  numTests+=1;
  if(newbackendtoken != '' || deleteMessage != '"Username was deleted!"')
    {
      deletedAccount = false;
    }
    else{
      deletedAccount = true;
    }

    if(deletedAccount === true)
      {successfulTests+=1;}
    else
    {failedTests+=1;}

  console.log('register test passed? : ' + userRegistered);
  console.log('login test passed? : ' + userLoggedIn);
  console.log('profile test passed? : ' + profileTestsPassed);
  console.log('phone and email notification tests passed? ' + notifTestsPassed);
  console.log('delete account passed? '+ deletedAccount );
  console.log(successfulTests + ' tests passed out of ' + numTests);
  console.log(failedTests + ' tests failed out of ' + numTests);


}

TestBackend();
